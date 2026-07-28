/** Nome dell'header che trasporta l'id di conversazione dal client (provider AI, via
 * `AICompleteRequest.logId`) al proxy dev di Vite (`vite.ts`), che lo usa per accodare
 * request/response allo stesso file di log per l'intera conversazione. File separato e
 * privo di import Node-specific — i provider AI lato browser (anthropic.ts/gemini.ts/
 * openaiCompatible.ts) lo importano per impostare l'header, senza portarsi dietro le
 * dipendenze Node di vite.ts nel proprio bundle. */
export const LLM_LOG_ID_HEADER = 'x-llmnative-log-id';
