import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        codeEditor: {
            page: {
                title: 'CodeEditor',
                description: 'Editor di codice con syntax highlighting basato su CodeMirror 6. Caricato lazy solo a montaggio. Supporta HTML, JSON, JavaScript, TypeScript, CSS e Liquid. Tema adattivo via variabili CSS e override tema per componente.',
            },
            sections: {
                basicUsage: {
                    title: 'Uso base',
                    description: 'Inserisci CodeEditor in un Form come qualsiasi altro campo. Il valore si sincronizza con il record del form a ogni modifica.',
                },
                languageModes: {
                    title: 'Modalità linguaggio',
                    description: 'Passa language="json", "js", "ts", "css" o "liquid" per cambiare l\'evidenziazione sintattica.',
                },
                disabledState: {
                    title: 'Disabilitato',
                    description: 'La prop disabled rende l\'editor in sola lettura.',
                },
            },
            labels: {
                templateBody: 'Corpo template',
                jsonConfig: 'Config JSON',
                script: 'Script',
                stylesheet: 'Foglio di stile',
                liquidTemplate: 'Template Liquid',
                startCoding: 'Inizia a scrivere…',
            },
            propsDocs: {
                title: 'Props di CodeEditor',
                items: {
                    name: { description: 'Nome del campo usato come chiave form e percorso dot-notation.' },
                    label: { description: 'Etichetta visualizzata sopra l\'editor.' },
                    required: { description: 'Marca il campo come obbligatorio.' },
                    language: { description: 'Linguaggio di sintassi. Uno tra: "html", "json", "js", "ts", "css", "liquid". Default: "html".' },
                    placeholder: { description: 'Testo segnaposto mostrato all\'interno dell\'editor quando vuoto.' },
                    disabled: { description: 'Rende l\'editor in sola lettura.' },
                    minHeight: { description: 'Altezza minima dell\'editor in pixel. Default: 200.' },
                    maxHeight: { description: 'Altezza massima dell\'editor in pixel prima dello scroll. Default: 600.' },
                    feedback: { description: 'Testo di aiuto visualizzato sotto l\'editor.' },
                    defaultValue: { description: 'Valore iniziale quando usato fuori da un contesto Form.' },
                    value: { description: 'Valore controllato sincronizzato dall\'esterno del form.' },
                    labelClassName: { description: 'Classi CSS applicate all\'etichetta.' },
                    className: { description: 'Classi CSS applicate al contenitore dell\'editor.' },
                    wrapperClassName: { description: 'Classi CSS applicate al wrapper esterno.' },
                    before: { description: 'Contenuto renderizzato prima del wrapper dell\'editor.' },
                    after: { description: 'Contenuto renderizzato dopo il wrapper dell\'editor.' },
                    onChange: { description: 'Handler change personalizzato chiamato dal contesto Form a ogni modifica dell\'editor.' },
                },
            },
            playground: {
                title: 'CodeEditor',
            },
        },
    },
});
