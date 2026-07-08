import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        richText: {
            page: {
                title: 'RichText',
                description: 'Editor rich text WYSIWYG integrato con il Form context. Carica TipTap in modo lazy solo al montaggio. Supporta toolbar fissa e floating, tabelle, upload immagini/documenti, modalita sorgente e barra di stato.',
            },
            sections: {
                basicUsage: {
                    title: 'Uso base',
                    description: 'Inserisci RichText dentro un Form come qualsiasi altro campo. Il valore viene salvato come HTML di default e sincronizzato con il record ad ogni aggiornamento.',
                },
                toolbarModes: {
                    title: 'Modalita toolbar',
                    description: '"fixed" mostra una toolbar fissa sopra l editor. "floating" mostra una toolbar bubble sulla selezione del testo. false nasconde la toolbar.',
                },
                customCommands: {
                    title: 'Comandi toolbar personalizzati',
                    description: 'Passa toolbarCommands per scegliere quali pulsanti mostrare e in che ordine. Usa "|" come separatore visivo tra i gruppi.',
                },
                tableSupport: {
                    title: 'Supporto tabelle',
                    description: 'Aggiungi "table" a toolbarCommands per abilitare il pulsante di inserimento tabella. Viene inserita una tabella 3x3 con riga di intestazione.',
                },
                sourceCode: {
                    title: 'Modalita sorgente',
                    description: 'Aggiungi "sourceCode" a toolbarCommands per permettere all utente di alternare tra l editor WYSIWYG e una textarea con HTML grezzo.',
                },
                statusBar: {
                    title: 'Barra di stato',
                    description: 'Imposta statusBar={true} per mostrare la barra di stato predefinita (breadcrumb tag DOM + conteggio parole). Passa un oggetto StatusBarConfig per il controllo granulare.',
                },
                outputFormats: {
                    title: 'Formati di output',
                    description: '"html" (default) salva HTML. "json" salva il documento TipTap in JSON. "text" salva solo testo semplice.',
                },
                disabledState: {
                    title: 'Stato disabilitato',
                    description: 'La prop disabled rende l editor completamente in sola lettura.',
                },
                imageUpload: {
                    title: 'Upload immagini con varianti responsive',
                    description: 'Passa imageUpload a RichText per abilitare il comando imageUpload nella toolbar. Imposta srcsetWidths per generare automaticamente varianti responsive all upload. Ogni variante viene salvata come <nome>_<larghezza>w.<ext> e l attributo srcset viene scritto direttamente nel tag <img> inserito. La demo usa uno storage mock in memoria.',
                },
                commandMenu: {
                    title: 'Slash commands',
                    description: 'Passa commands per aprire il ContextMenu condiviso dentro l editor. In questa prima versione l handler lavora su testo semplice e ritorna una stringa che sostituisce il range del trigger.',
                },
            },
            labels: {
                articleBody: 'Corpo articolo',
                postContent: 'Contenuto del post',
                description: 'Descrizione',
                comment: 'Commento',
                notes: 'Note',
                content: 'Contenuto',
                contentWithCommands: 'Contenuto con comandi',
                startTyping: 'Inizia a scrivere...',
            },
            propsDocs: {
                title: 'Prop di RichText',
                items: {
                    name: { description: 'Nome del campo usato come chiave del form e path in notazione puntata.' },
                    label: { description: 'Etichetta visualizzata sopra l editor.' },
                    required: { description: 'Segna il campo come obbligatorio. Blocca l invio del form se l editor e vuoto.' },
                    placeholder: { description: 'Testo placeholder mostrato nell editor quando e vuoto.' },
                    disabled: { description: 'Rende l editor completamente in sola lettura.' },
                    toolbar: { description: 'Posizione della toolbar: "fixed" (sopra l editor), "floating" (bubble sulla selezione), oppure false (nascosta).' },
                    toolbarCommands: { description: 'Lista ordinata dei comandi della toolbar. Usa "|" come separatore visivo. Di default vengono mostrati tutti i comandi.' },
                    outputFormat: { description: 'Formato usato per salvare il valore: "html" (default), "json" (documento TipTap), "text" (testo semplice).' },
                    statusBar: { description: 'Abilita la barra di stato sotto l editor. true usa le impostazioni predefinite. Passa un oggetto StatusBarConfig per il controllo granulare.' },
                    minHeight: { description: 'Altezza minima dell editor in pixel. Default: 120.' },
                    maxHeight: { description: 'Altezza massima in pixel. Il contenuto scorre internamente oltre questo valore.' },
                    imageUpload: { description: 'Oggetto di configurazione per l upload immagini: { path, srcsetWidths, accept, maxBytes }. Passalo per abilitare il comando imageUpload. Omettilo per mantenere le immagini come data URI base64.' },
                    documentUpload: { description: 'Oggetto di configurazione per l upload documenti: { path, accept, maxBytes }. Passalo per abilitare il comando documentUpload. Inserito come chip cliccabile con nome file e dimensione.' },
                    commands: { description: 'Slash commands mostrate dal ContextMenu condiviso. Il trigger di default e "/" quando commands e presente. In RichText v1 l handler riceve contesto plain-text e ritorna una stringa.' },
                    commandsTrigger: { description: 'Stringa trigger usata per aprire il ContextMenu interno. Di default e "/" quando commands e presente.' },
                    feedback: { description: 'Testo di aiuto visualizzato sotto l editor.' },
                    defaultValue: { description: 'Valore iniziale quando usato fuori dal contesto Form.' },
                    validator: { description: 'Funzione di validazione custom. Ritorna una stringa di errore per bloccare l invio del form.' },
                    labelClassName: { description: 'Classi CSS applicate all elemento label.' },
                    className: { description: 'Classi CSS applicate al container dell editor.' },
                    wrapperClassName: { description: 'Classi CSS applicate al wrapper esterno.' },
                    before: { description: 'Contenuto renderizzato prima del wrapper dell editor.' },
                    after: { description: 'Contenuto renderizzato dopo il wrapper dell editor.' },
                    onChange: { description: 'Handler di cambiamento custom chiamato dal Form context ad ogni aggiornamento.' },
                },
            },
            playground: {
                title: 'RichText',
            },
        },
    },
});
