import type { DeepPartial } from '@llmnative/react';
import type { I18nDict } from '@llmnative/react';

const de: DeepPartial<I18nDict> = {
    common: {
        save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', close: 'Schließen',
        back: 'Zurück', search: 'Suchen', loading: 'Laden...',
        noDataFound: 'Keine Daten gefunden', pageNavigation: 'Seitennavigation',
        previous: 'Zurück', next: 'Weiter',
        notFoundMessage: 'Ups! Seite nicht gefunden.', goHome: 'Zur Startseite',
    },
    auth: {
        signIn: 'Anmelden', signOut: 'Abmelden', connect: 'Verbinden',
        connected: 'Verbunden', authenticated: 'Authentifiziert',
        notConfigured: 'Auth-Provider "{provider}" ist nicht konfiguriert. API-Schlüssel prüfen.',
        notImplemented: 'Der Provider implementiert signIn() nicht.',
    },
    form: {
        headerAdd: 'Hinzufügen', headerEdit: 'Bearbeiten', buttonSave: 'Speichern',
        buttonDelete: 'Löschen', buttonBack: 'Zurück',
        requiredField: 'Das Feld "{field}" ist erforderlich',
        requiredFieldGeneric: 'Pflichtfelder sind nicht ausgefüllt',
        saveSuccess: 'Erfolgreich gespeichert', deleteSuccess: 'Erfolgreich gelöscht',
        noticeRequiredFields: 'Pflichtfelder vor dem Speichern ausfüllen.',
    },
    grid: {
        buttonAdd: 'Hinzufügen',
        deleteConfirm: 'Dieses Element wirklich löschen?',
        emptyState: 'Keine Elemente vorhanden',
    },
    select: { placeholder: 'Auswählen...' },
    modal: { save: 'Speichern', delete: 'Löschen', cancel: 'Abbrechen', close: 'Schließen' },
    upload: {
        clickOrDrag: 'Klicken oder ziehen zum Hochladen...', dropToUpload: 'Loslassen zum Hochladen',
        uploadMore: 'Weitere Dateien hinzufügen', editFileName: 'Dateiname bearbeiten',
        editorImage: 'Bildeditor', loaded: 'Geladen', removeFile: 'Entfernen',
        uploadAnother: 'Eine weitere Datei hochladen', dropToParse: 'Loslassen zum Analysieren',
    },
    notifications: { title: 'Benachrichtigungen', seeAll: 'Alle anzeigen' },
    code: { copyCode: 'Code kopieren', copy: 'Kopieren', copied: 'Kopiert!', codeLanguageDefault: 'Text' },
    table: {
        noDataFound: 'Keine Daten gefunden', selectAllRows: 'Alle Zeilen auswählen',
        sortBy: 'Nach {label} sortieren', sortByCurrent: 'Nach {label} sortieren ({direction})',
        selectRow: 'Zeile {key} auswählen', reorderRow: 'Zeile {key} neu anordnen',
    },
    gallery: { selectItem: 'Element {key} auswählen' },
    crop: {
        enableCrop: 'Zuschnitt mit Skalierung {scale} aktivieren', variants: 'Varianten',
        outputFile: 'Ausgabedatei', active: 'Aktiv',
        removeVariant: 'Variante {scale} entfernen', fileName: 'Dateiname',
    },
    imageEditor: {
        title: 'Bildeditor', save: 'Speichern', undo: 'Rückgängig', redo: 'Wiederherstellen',
        zoomOut: 'Herauszoomen', zoomIn: 'Hineinzoomen', crop: 'Zuschneiden',
        flipHorizontal: 'Horizontal spiegeln', flipVertical: 'Vertikal spiegeln',
        rotate: '90° drehen', freeDrawing: 'Freihandzeichnen', arrow: 'Pfeil', text: 'Text',
        rectangle: 'Rechteck', circle: 'Kreis', triangle: 'Dreieck',
    },
    prompt: {
        noProviders: 'Keine AI-Provider registriert.',
        aiNotConfiguredEdit: 'AI ist nicht konfiguriert. Sie können diesen Prompt trotzdem bearbeiten.',
        aiNotConfiguredRun: 'AI ist nicht konfiguriert. Dieser Prompt kann nicht ausgeführt werden.',
        toggleOnTitle: 'AI deaktivieren', toggleOffTitle: 'AI aktivieren',
        closeEditor: 'Editor schließen', editSettings: 'Einstellungen bearbeiten',
        attachFiles: 'Dateien anhängen', run: 'Ausführen', noMatchingCommands: 'Keine passenden Befehle',
        tokenUsage: 'Token-Nutzung', tokenInput: 'Eingabe: {count} Token',
        tokenOutput: 'Ausgabe: {count} Token', tokenContext: 'Kontext: {count} Token',
        tokenCost: 'Kosten: {cost} USD', tokenTime: 'Zeit: {ms}ms', tokenUsageEmpty: '-',
        hidePreview: 'Vorschau ausblenden', showPreview: 'Aufgelöste Vorschau anzeigen',
        noProvider: 'Kein Provider', noResponse: 'Keine Antwort',
    },
    layout: {
        maxElements: 'Bereits 12 Elemente in der Zeile: Eines entfernen.',
        noSpace: 'Kein Platz: Elemente können nicht genug verkleinert werden.',
        dragToMove: 'Zum Verschieben ziehen', remove: 'Entfernen',
        dragToResize: 'Zum Verkleinern ziehen', dragHere: 'Element hierher ziehen',
    },
};

export default de;
