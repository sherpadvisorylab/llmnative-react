import React, { useEffect, useId, useRef, useState } from 'react';
import { useI18n } from '../../../I18n';
import { useTheme } from '../../../Theme';
import { useGoogleMapsConfig } from '../../../providers/googleMaps/GoogleMapsProviderContext';
import { loadGoogleMaps } from '../../../providers/googleMaps/loadGoogleMaps';
import { Wrapper } from '../GridSystem';
import Icon from '../Icon';
import { cn } from '../../../libs/cn';
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import type { FieldValue } from '../../../providers/data/DataProvider';
import { Label, FieldError, fieldControlBaseClass, fieldFeedbackClass } from './Input';

export interface ParsedAddress {
    street?: string;
    city?: string;
    /** Province (administrative_area_level_2), falling back to the region when a country has no province level. */
    state?: string;
    zip?: string;
    country?: string;
    countryCode?: string;
    lat?: number;
    lng?: number;
    formatted?: string;
}

/**
 * Overrides the default sub-field paths. Each key defaults to `${name}.<key>` (e.g. `name="address"`
 * → `address.street`) — set any of these to an unrelated, absolute field path to write there instead.
 */
export interface AddressAutocompleteFieldNames {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    countryCode?: string;
    lat?: string;
    lng?: string;
    zoom?: string;
    formatted?: string;
}

export interface AddressAutocompleteMapOptions {
    /** Where the map renders relative to the search box. Defaults to `'below'`. */
    position?: 'above' | 'below';
    /** Zoom applied when a location is first placed (via search selection or map click) and no zoom is stored yet. Defaults to `15`. */
    defaultZoom?: number;
    /** Map height in pixels. Defaults to `240`. */
    height?: number;
}

export interface AddressAutocompleteProps extends FormFieldProps {
    /** Base field path; see {@link AddressAutocompleteFieldNames} for the default sub-field layout. */
    name: string;
    placeholder?: string;
    disabled?: boolean;
    feedback?: string;
    /** Restrict suggestions to these ISO 3166-1 alpha-2 country codes, e.g. `['it']`. */
    countries?: string[];
    /** Overrides the provider-level language/region bias for this instance only. */
    language?: string;
    region?: string;
    validator?: (value: FieldValue) => string | undefined | Promise<string | undefined>;
    /** Called with the fully parsed address whenever it changes (search selection, pin drag/click)
     *  — use this if the consumer needs fields beyond the ones auto-written. */
    onSelect?: (address: ParsedAddress) => void;
    /** Remaps the sub-field paths this component reads/writes. Omit to use `${name}.<field>`. */
    fieldNames?: AddressAutocompleteFieldNames;
    /**
     * Shows an embeddable map with a draggable/clickable pin, so the user can fine-tune the exact
     * location beyond what the address search resolves. Pass `true` for defaults or an options
     * object. Requires the **Geocoding API** enabled in the same Google Cloud project, in addition
     * to Places API (New) + Maps JavaScript API.
     */
    map?: boolean | AddressAutocompleteMapOptions;
    id?: string;
    labelClassName?: string;
    menuClassName?: string;
    itemClassName?: string;
    mapClassName?: string;
}

interface Suggestion {
    id: string;
    text: string;
    prediction: google.maps.places.PlacePrediction;
}

interface NormalizedComponent {
    longText: string;
    shortText: string;
    types: readonly string[];
}

const FALLBACK_CENTER = { lat: 41.8719, lng: 12.5674 }; // Italy, whole-country view
const FALLBACK_ZOOM = 5;

function normalizePlaceComponents(components: readonly google.maps.places.AddressComponent[] | null | undefined): NormalizedComponent[] {
    return (components ?? []).map((component) => ({
        longText: component.longText ?? '',
        shortText: component.shortText ?? component.longText ?? '',
        types: component.types,
    }));
}

function normalizeGeocoderComponents(components: readonly google.maps.GeocoderAddressComponent[]): NormalizedComponent[] {
    return components.map((component) => ({ longText: component.long_name, shortText: component.short_name, types: component.types }));
}

function componentText(components: readonly NormalizedComponent[], type: string, long = true): string | undefined {
    const match = components.find((component) => component.types.includes(type));
    if (!match) return undefined;
    const value = long ? match.longText : match.shortText;
    return value || undefined;
}

function parseAddressComponents(
    components: readonly NormalizedComponent[],
    lat: number | undefined,
    lng: number | undefined,
    formatted: string | undefined,
): ParsedAddress {
    const streetNumber = componentText(components, 'street_number');
    const route = componentText(components, 'route');
    const street = [route, streetNumber].filter(Boolean).join(', ') || route || undefined;
    const city = componentText(components, 'locality') ?? componentText(components, 'postal_town') ?? componentText(components, 'sublocality');
    // Short form (e.g. "BA") — the province's 2-letter abbreviation in Italy and the closest
    // equivalent elsewhere; falls back to the region when a country has no province level.
    const state = componentText(components, 'administrative_area_level_2', false) ?? componentText(components, 'administrative_area_level_1', false);

    return {
        street,
        city,
        state,
        zip: componentText(components, 'postal_code'),
        country: componentText(components, 'country'),
        countryCode: componentText(components, 'country', false),
        lat,
        lng,
        formatted,
    };
}

function parsePlace(place: google.maps.places.Place): ParsedAddress {
    return parseAddressComponents(
        normalizePlaceComponents(place.addressComponents),
        place.location?.lat(),
        place.location?.lng(),
        place.formattedAddress ?? undefined,
    );
}

function parseGeocoderResult(result: google.maps.GeocoderResult): ParsedAddress {
    return parseAddressComponents(
        normalizeGeocoderComponents(result.address_components),
        result.geometry.location.lat(),
        result.geometry.location.lng(),
        result.formatted_address,
    );
}

/**
 * Address search field backed by the Google Places Autocomplete (New) API. Selecting a
 * suggestion fills the structured subfields below `name` — they stay independently editable
 * afterward, same as every other CRM-override field in this app. Optionally pairs with an
 * embeddable map (`map` prop) with a draggable/clickable pin for fine adjustment.
 *
 * Requires `<App googleMaps={{ apiKey }}>` (or `<GoogleMapsProvider config={...}>`) somewhere
 * above in the tree; without it the field renders disabled with an explanatory message.
 */
export const AddressAutocomplete = ({
    name,
    label = undefined,
    required = false,
    placeholder = undefined,
    disabled = false,
    feedback = undefined,
    countries = undefined,
    language = undefined,
    region = undefined,
    validator = undefined,
    onSelect = undefined,
    fieldNames = undefined,
    map = false,
    id = undefined,
    labelClassName = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined,
    menuClassName = undefined,
    itemClassName = undefined,
    mapClassName = undefined,
}: AddressAutocompleteProps): React.ReactElement => {
    const dict = useI18n('addressAutocomplete');
    const theme = useTheme('addressAutocomplete');
    const config = useGoogleMapsConfig();

    const fields = {
        street: fieldNames?.street ?? `${name}.street`,
        city: fieldNames?.city ?? `${name}.city`,
        state: fieldNames?.state ?? `${name}.state`,
        zip: fieldNames?.zip ?? `${name}.zip`,
        country: fieldNames?.country ?? `${name}.country`,
        countryCode: fieldNames?.countryCode ?? `${name}.countryCode`,
        lat: fieldNames?.lat ?? `${name}.lat`,
        lng: fieldNames?.lng ?? `${name}.lng`,
        zoom: fieldNames?.zoom ?? `${name}.zoom`,
        formatted: fieldNames?.formatted ?? `${name}.formatted`,
    };

    const formatted = useFormContext({ name: fields.formatted, wrapperClassName, inheritWrapperClassName });
    const street = useFormContext({ name: fields.street });
    const city = useFormContext({ name: fields.city });
    const state = useFormContext({ name: fields.state });
    const zip = useFormContext({ name: fields.zip });
    const country = useFormContext({ name: fields.country });
    const countryCode = useFormContext({ name: fields.countryCode });
    const lat = useFormContext({ name: fields.lat });
    const lng = useFormContext({ name: fields.lng });
    const zoom = useFormContext({ name: fields.zoom });

    const error = useFieldValidation(name, { required, label, validator });
    const generatedId = useId();
    const elementId = id ?? generatedId;

    const mapOptions = typeof map === 'object' ? map : {};
    const mapEnabled = Boolean(map);
    const mapPosition = mapOptions.position ?? 'below';
    const defaultZoom = mapOptions.defaultZoom ?? 15;
    const mapHeight = mapOptions.height ?? 240;

    const [query, setQuery] = useState<string>(typeof formatted.value === 'string' ? formatted.value : '');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | undefined>(undefined);
    const requestRef = useRef(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const googleRef = useRef<typeof google | undefined>(undefined);
    const mapRef = useRef<google.maps.Map | undefined>(undefined);
    const markerRef = useRef<google.maps.Marker | undefined>(undefined);
    const geocoderRef = useRef<google.maps.Geocoder | undefined>(undefined);
    // Set right before this component writes street/city/state/zip/country itself (suggestion
    // selection, pin drag/click) so the manual-edit resync effect below can tell "the user just
    // typed in one of these fields" apart from "we just wrote them ourselves" and skip re-firing.
    const isApplyingRef = useRef(false);

    useEffect(() => {
        if (typeof formatted.value === 'string' && formatted.value !== query) setQuery(formatted.value);
        // Only re-sync when the form record's value changes from outside (e.g. loading a
        // different record) — not on every local keystroke, which already owns `query`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formatted.value]);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };
        window.document.addEventListener('pointerdown', handlePointerDown);
        return () => window.document.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    useEffect(() => {
        if (!config) return;
        const requestId = ++requestRef.current;
        const trimmed = query.trim();
        if (trimmed.length < 3) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const timeout = window.setTimeout(() => {
            void (async () => {
                try {
                    const googleApi = await loadGoogleMaps({ apiKey: config.apiKey, language: language ?? config.language, region: region ?? config.region });
                    googleRef.current = googleApi;
                    if (requestId !== requestRef.current) return;
                    sessionTokenRef.current ??= new googleApi.maps.places.AutocompleteSessionToken();
                    const { suggestions: predictions } = await googleApi.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
                        input: trimmed,
                        sessionToken: sessionTokenRef.current,
                        includedRegionCodes: countries,
                        language: language ?? config.language,
                        region: region ?? config.region,
                    });
                    if (requestId !== requestRef.current) return;
                    setSuggestions(
                        predictions
                            .filter((prediction) => prediction.placePrediction)
                            .map((prediction) => ({
                                id: prediction.placePrediction!.placeId,
                                text: prediction.placePrediction!.text.text,
                                prediction: prediction.placePrediction!,
                            })),
                    );
                    setLoadError(null);
                } catch (cause) {
                    if (requestId !== requestRef.current) return;
                    setSuggestions([]);
                    setLoadError(cause instanceof Error ? cause.message : dict.loadError);
                } finally {
                    if (requestId === requestRef.current) setLoading(false);
                }
            })();
        }, 250);

        return () => window.clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, config]);

    const applyParsedAddress = (parsed: ParsedAddress, zoomValue?: number) => {
        isApplyingRef.current = true;
        const nextQuery = parsed.formatted ?? query;
        setQuery(nextQuery);
        formatted.handleChange({ target: { name: fields.formatted, value: nextQuery } });
        if (parsed.street !== undefined) street.handleChange({ target: { name: fields.street, value: parsed.street } });
        if (parsed.city !== undefined) city.handleChange({ target: { name: fields.city, value: parsed.city } });
        if (parsed.state !== undefined) state.handleChange({ target: { name: fields.state, value: parsed.state } });
        if (parsed.zip !== undefined) zip.handleChange({ target: { name: fields.zip, value: parsed.zip } });
        if (parsed.country !== undefined) country.handleChange({ target: { name: fields.country, value: parsed.country } });
        if (parsed.countryCode !== undefined) countryCode.handleChange({ target: { name: fields.countryCode, value: parsed.countryCode } });
        if (parsed.lat !== undefined) lat.handleChange({ target: { name: fields.lat, value: parsed.lat } });
        if (parsed.lng !== undefined) lng.handleChange({ target: { name: fields.lng, value: parsed.lng } });
        if (zoomValue !== undefined) zoom.handleChange({ target: { name: fields.zoom, value: zoomValue } });
        onSelect?.(parsed);
    };

    const attachMarkerListeners = (marker: google.maps.Marker) => {
        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            if (position) void reverseGeocodeAndApply(position);
        });
    };

    const placeOrMoveMarker = (googleApi: typeof google, position: google.maps.LatLng) => {
        if (!mapRef.current) return;
        if (markerRef.current) {
            markerRef.current.setPosition(position);
        } else {
            markerRef.current = new googleApi.maps.Marker({ position, map: mapRef.current, draggable: true });
            attachMarkerListeners(markerRef.current);
        }
    };

    const reverseGeocodeAndApply = async (position: google.maps.LatLng) => {
        try {
            if (!geocoderRef.current) return;
            const response = await geocoderRef.current.geocode({ location: position });
            const result = response.results[0];
            if (!result) return;
            applyParsedAddress(parseGeocoderResult(result));
            setLoadError(null);
        } catch (cause) {
            setLoadError(cause instanceof Error ? cause.message : dict.loadError);
        }
    };

    // Keeps the search box, coordinates and map in sync when street/city/state/zip/country are
    // edited directly (the plain <Input> fields below this component, not through it) — those
    // share the same Form record, so this component already sees the live values via
    // useFormContext. Forward-geocodes the composed address on change; only refreshes the
    // display text + lat/lng/map, it never overwrites the fields the user just hand-edited.
    useEffect(() => {
        if (isApplyingRef.current) { isApplyingRef.current = false; return; }
        if (!config) return;

        const parts = [street.value, zip.value, city.value, state.value, country.value]
            .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
        if (parts.length === 0) return;
        const composedAddress = parts.join(', ');

        const timeout = window.setTimeout(() => {
            void (async () => {
                try {
                    const googleApi = await loadGoogleMaps({ apiKey: config.apiKey, language: language ?? config.language, region: region ?? config.region });
                    googleRef.current = googleApi;
                    geocoderRef.current ??= new googleApi.maps.Geocoder();
                    const response = await geocoderRef.current.geocode({ address: composedAddress, region: region ?? config.region });
                    const result = response.results[0];
                    if (!result) return;
                    const parsed = parseGeocoderResult(result);

                    // No isApplyingRef guard needed here: this effect only watches
                    // street/city/state/zip/country, and this branch never writes those back.
                    const nextQuery = parsed.formatted ?? composedAddress;
                    setQuery(nextQuery);
                    formatted.handleChange({ target: { name: fields.formatted, value: nextQuery } });
                    if (parsed.lat !== undefined) lat.handleChange({ target: { name: fields.lat, value: parsed.lat } });
                    if (parsed.lng !== undefined) lng.handleChange({ target: { name: fields.lng, value: parsed.lng } });

                    if (mapRef.current && parsed.lat !== undefined && parsed.lng !== undefined) {
                        const position = new googleApi.maps.LatLng(parsed.lat, parsed.lng);
                        mapRef.current.panTo(position);
                        placeOrMoveMarker(googleApi, position);
                    }
                    setLoadError(null);
                } catch (cause) {
                    setLoadError(cause instanceof Error ? cause.message : dict.loadError);
                }
            })();
        }, 600);

        return () => window.clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [street.value, city.value, state.value, zip.value, country.value, config]);

    // Creates the map once (on first mount where `map` is enabled and the API is configured).
    // Re-centers on newly selected/dragged coordinates happen imperatively elsewhere, not by
    // recreating the map, so panning/zooming the user has already done isn't reset on rerender.
    useEffect(() => {
        if (!mapEnabled || !config || !mapContainerRef.current || mapRef.current) return;
        let cancelled = false;

        void loadGoogleMaps({ apiKey: config.apiKey, language: language ?? config.language, region: region ?? config.region }).then((googleApi) => {
            if (cancelled || !mapContainerRef.current || mapRef.current) return;
            googleRef.current = googleApi;

            const hasCoords = typeof lat.value === 'number' && typeof lng.value === 'number';
            const center = hasCoords ? { lat: lat.value as number, lng: lng.value as number } : FALLBACK_CENTER;
            const initialZoom = typeof zoom.value === 'number' ? zoom.value : hasCoords ? defaultZoom : FALLBACK_ZOOM;

            const instance = new googleApi.maps.Map(mapContainerRef.current, {
                center,
                zoom: initialZoom,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            });
            mapRef.current = instance;
            geocoderRef.current = new googleApi.maps.Geocoder();

            if (hasCoords) {
                markerRef.current = new googleApi.maps.Marker({ position: center, map: instance, draggable: true });
                attachMarkerListeners(markerRef.current);
            }

            instance.addListener('click', (event: google.maps.MapMouseEvent) => {
                if (!event.latLng) return;
                placeOrMoveMarker(googleApi, event.latLng);
                void reverseGeocodeAndApply(event.latLng);
            });
            instance.addListener('zoom_changed', () => {
                const nextZoom = instance.getZoom();
                if (typeof nextZoom === 'number') zoom.handleChange({ target: { name: fields.zoom, value: nextZoom } });
            });
        }).catch((cause: unknown) => {
            if (!cancelled) setLoadError(cause instanceof Error ? cause.message : dict.loadError);
        });

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapEnabled, config]);

    const selectSuggestion = async (suggestion: Suggestion) => {
        setOpen(false);
        try {
            const place = suggestion.prediction.toPlace();
            await place.fetchFields({ fields: ['addressComponents', 'location', 'formattedAddress'] });
            const parsed = parsePlace(place);
            applyParsedAddress(parsed, mapEnabled ? defaultZoom : undefined);

            const googleApi = googleRef.current;
            if (mapEnabled && googleApi && mapRef.current && parsed.lat !== undefined && parsed.lng !== undefined) {
                const position = new googleApi.maps.LatLng(parsed.lat, parsed.lng);
                mapRef.current.setCenter(position);
                mapRef.current.setZoom(defaultZoom);
                placeOrMoveMarker(googleApi, position);
            }

            sessionTokenRef.current = undefined; // a session ends once a place is resolved
            setLoadError(null);
        } catch (cause) {
            setLoadError(cause instanceof Error ? cause.message : dict.loadError);
        }
    };

    if (!config) {
        return (
            <Wrapper className={formatted.formWrapClass}>
                {label && <Label label={label} required={required} htmlFor={elementId} className={labelClassName} />}
                <input
                    id={elementId}
                    disabled
                    className={cn(fieldControlBaseClass, className || theme.AddressAutocomplete.className)}
                    placeholder={dict.notConfigured}
                    title={dict.notConfigured}
                />
                <div className={fieldFeedbackClass}>{dict.notConfigured}</div>
            </Wrapper>
        );
    }

    const mapElement = mapEnabled ? (
        <div
            ref={mapContainerRef}
            className={cn('mt-2 w-full overflow-hidden rounded-md border', mapClassName)}
            style={{ height: mapHeight }}
        />
    ) : null;

    return (
        <Wrapper className={formatted.formWrapClass || theme.AddressAutocomplete.wrapperClassName}>
            {label && <Label label={label} required={required} htmlFor={elementId} className={labelClassName} />}
            {mapPosition === 'above' && mapElement}
            <div ref={rootRef} className="relative">
                <input
                    id={elementId}
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-autocomplete="list"
                    autoComplete="off"
                    className={cn(fieldControlBaseClass, 'pr-8', error && 'border-destructive focus-visible:ring-destructive/20', className || theme.AddressAutocomplete.className)}
                    placeholder={placeholder ?? dict.placeholder}
                    required={required}
                    disabled={disabled}
                    value={query}
                    onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                />
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
                    <Icon name={loading ? 'loader-circle' : 'map-pin'} size={15} className={loading ? 'animate-spin' : undefined} />
                </span>

                {open && (query.trim().length >= 3) && (
                    <div
                        className={cn(
                            'absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border p-1 text-sm shadow-lg',
                            menuClassName || theme.AddressAutocomplete.menuClassName,
                        )}
                    >
                        {loadError ? (
                            <div className="px-2 py-3 text-center text-destructive">{loadError}</div>
                        ) : loading && suggestions.length === 0 ? (
                            <div className="px-2 py-3 text-center text-muted-foreground">{dict.searching}</div>
                        ) : suggestions.length === 0 ? (
                            <div className="px-2 py-3 text-center text-muted-foreground">{dict.noResults}</div>
                        ) : suggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                type="button"
                                className={cn(
                                    'flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-accent hover:text-accent-foreground',
                                    itemClassName || theme.AddressAutocomplete.itemClassName,
                                )}
                                onClick={() => { void selectSuggestion(suggestion); }}
                            >
                                <Icon name="map-pin" size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 truncate">{suggestion.text}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {mapPosition === 'below' && mapElement}
            {error ? <FieldError message={error} /> : feedback && <div className={fieldFeedbackClass}>{feedback}</div>}
        </Wrapper>
    );
};

export default AddressAutocomplete;
