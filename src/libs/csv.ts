import Papa from 'papaparse';

export interface CsvParseResult {
    data: Record<string, string | null | undefined>[];
    fields: string[];
}

/** Parsing puro di testo CSV/TSV già in memoria — stesso motore (papaparse) di
 * `<UploadCSV>` (ui/fields/UploadCSV.tsx), estratto qui perché un chiamante che ha già il testo
 * (es. un allegato decodificato lato agente, non un evento `<input type="file">`) non ha un
 * `File`/`ChangeEvent` da passare a quel componente — solo la stringa. `UploadCSV` resta
 * l'ingresso quando l'origine è davvero un file scelto dall'utente nella UI; questa funzione è
 * l'ingresso quando l'origine è testo già in mano al chiamante. */
export function parseCsvText(text: string, opts?: { delimiter?: string }): CsvParseResult {
    const results = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: opts?.delimiter,
        dynamicTyping: false,
    });
    return {
        data: results.data,
        fields: (results.meta?.fields ?? []).filter(Boolean),
    };
}
