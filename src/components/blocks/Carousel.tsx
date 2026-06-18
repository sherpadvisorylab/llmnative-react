import React from 'react';
import { useTheme } from "../../Theme";
import { useI18n } from "../../I18n";
import { cn } from '../../libs/cn';
import Icon from '../ui/Icon';

type AutoPlayOptions = {
    interval: number;
    pause: "hover" | "false" | "true";
    wrap: boolean;
};

type CarouselProps = {
    children: React.ReactElement[];
    showIndicators?: boolean;
    showControls?: boolean;
    showCaption?: boolean;
    dark?: boolean;
    autoPlay?: AutoPlayOptions;
    initialSlide?: number;
    renderCaption?: (image: React.ReactElement) => React.ReactElement;
    onSlideClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Carousel = ({
    children,
    showIndicators = false,
    showControls = false,
    showCaption = false,
    dark = false,
    autoPlay = undefined,
    initialSlide = 0,
    renderCaption = undefined,
    onSlideClick = undefined,
}: CarouselProps) => {
    const theme = useTheme("carousel");
    const dict = useI18n('common');

    const slides = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement[];
    const slideCount = slides.length;

    showIndicators = showIndicators || theme.Carousel.showIndicators;
    showControls = showControls || theme.Carousel.showControls;
    showCaption = showCaption || theme.Carousel.showCaption;
    dark = dark || theme.Carousel.dark;

    const themeAutoPlay = theme.Carousel.autoPlay;
    autoPlay = autoPlay || (typeof themeAutoPlay === 'object' ? themeAutoPlay : undefined);

    const normalizedInitialSlide = slideCount > 0
        ? Math.min(Math.max(initialSlide, 0), slideCount - 1)
        : 0;

    const [isHover, setIsHover] = React.useState(false);
    const [activeSlide, setActiveSlide] = React.useState(normalizedInitialSlide);

    React.useEffect(() => {
        setActiveSlide(normalizedInitialSlide);
    }, [normalizedInitialSlide]);

    const goTo = React.useCallback((nextIndex: number) => {
        if (slideCount <= 0) return;

        const wrap = autoPlay?.wrap ?? true;
        if (wrap) {
            const normalized = (nextIndex + slideCount) % slideCount;
            setActiveSlide(normalized);
            return;
        }

        setActiveSlide(Math.min(Math.max(nextIndex, 0), slideCount - 1));
    }, [autoPlay?.wrap, slideCount]);

    const goPrev = React.useCallback(() => goTo(activeSlide - 1), [activeSlide, goTo]);
    const goNext = React.useCallback(() => goTo(activeSlide + 1), [activeSlide, goTo]);

    React.useEffect(() => {
        if (!autoPlay || slideCount <= 1) return;
        if (autoPlay.pause === 'hover' && isHover) return;

        const timer = window.setInterval(() => {
            setActiveSlide((current) => {
                const next = current + 1;
                if (next < slideCount) return next;
                return autoPlay.wrap ? 0 : current;
            });
        }, autoPlay.interval || 2000);

        return () => window.clearInterval(timer);
    }, [autoPlay, isHover, slideCount]);

    const renderResolvedCaption = (image: React.ReactElement): React.ReactElement | null => {
        if (!showCaption) return null;
        if (renderCaption) return renderCaption(image);

        const { alt, description } = image.props as { alt?: string; description?: string };
        if (!alt && !description) return null;

        return (
            <div
                className={cn(
                    "absolute inset-x-4 bottom-4 hidden rounded-lg px-4 py-3 md:block",
                    dark ? "bg-white/80 text-slate-900" : "bg-black/60 text-white"
                )}
            >
                {alt && <h5 className="text-sm font-semibold">{alt}</h5>}
                {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
            </div>
        );
    };

    if (slideCount === 0) return null;

    return (
        <div
            className="relative overflow-hidden rounded-xl"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div
                className={cn("relative min-h-0", onSlideClick && "cursor-pointer")}
                onClick={onSlideClick}
            >
                {slides.map((image, index) => {
                    const isActive = index === activeSlide;

                    return (
                        <div
                            key={index}
                            aria-hidden={!isActive}
                            className={cn(
                                "relative transition-opacity duration-300 ease-out",
                                isActive ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                            )}
                        >
                            {image}
                            {(showIndicators || showControls || showCaption) && isHover && (
                                <div
                                    className={cn(
                                        "pointer-events-none absolute inset-0 opacity-20",
                                        dark ? "bg-white" : "bg-black"
                                    )}
                                />
                            )}
                            {isHover && renderResolvedCaption(image)}
                        </div>
                    );
                })}
            </div>

            {showIndicators && slideCount > 1 && (
                <ol className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2 px-4">
                    {slides.map((_, index) => (
                        <li key={index}>
                            <button
                                type="button"
                                aria-label={`${dict.pageNavigation} ${index + 1}`}
                                aria-current={index === activeSlide ? 'true' : undefined}
                                onClick={() => goTo(index)}
                                className={cn(
                                    "h-2.5 w-2.5 rounded-full border transition-all",
                                    index === activeSlide
                                        ? "scale-110 border-white bg-white"
                                        : "border-white/60 bg-white/30 hover:bg-white/60"
                                )}
                            />
                        </li>
                    ))}
                </ol>
            )}

            {showControls && isHover && slideCount > 1 && (
                <>
                    <button
                        type="button"
                        aria-label={dict.previous}
                        onClick={(event) => {
                            event.stopPropagation();
                            goPrev();
                        }}
                        className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-md transition-colors hover:bg-background"
                    >
                        <Icon name="chevron-left" size={18} />
                    </button>
                    <button
                        type="button"
                        aria-label={dict.next}
                        onClick={(event) => {
                            event.stopPropagation();
                            goNext();
                        }}
                        className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-md transition-colors hover:bg-background"
                    >
                        <Icon name="chevron-right" size={18} />
                    </button>
                </>
            )}
        </div>
    );
};

export default Carousel;
