import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tree: {
            page: {
                title: 'Tree',
                description: 'Albero di cartelle e file accessibile (pattern WAI-ARIA tree): le cartelle si aprono e si chiudono, un nodo è selezionato. Espansione e selezione controllate o non controllate.',
            },
            sections: {
                fileExplorer: { title: 'Esplora file', description: 'Un albero di cartelle con icone, un badge e un nodo disabilitato; selezionando un file lo si mostra di fianco.' },
                controlled: { title: 'Espansione controllata', description: 'Il genitore possiede lo stato di espansione/selezione e può aprire o chiudere ogni cartella.' },
                fromPaths: { title: 'Da percorsi', description: 'treeFromPaths trasforma una lista piatta di percorsi a/b/c in un albero: cartelle prima dei file, il percorso completo come id.' },
            },
            labels: {
                fileTree: 'File del pacchetto',
                selected: 'Selezionato',
                none: 'Nessuno',
                expandAll: 'Apri tutto',
                collapseAll: 'Chiudi tutto',
                openFolders: 'Cartelle aperte',
                selectedNode: 'Nodo selezionato',
                preview: 'Anteprima',
            },
            propsDocs: { items: {
                nodes: { description: 'Nodi dell\'albero: { id, label, icon?, badge?, description?, children?, disabled? }.' },
                expanded: { description: 'Id espansi controllati (insieme a onExpandedChange).' },
                defaultExpanded: { description: 'Id espansi iniziali per l\'uso non controllato.' },
                onExpandedChange: { description: 'Chiamata con i prossimi id espansi a ogni apertura/chiusura.' },
                selectedId: { description: 'Id selezionato controllato (insieme a onSelect).' },
                defaultSelectedId: { description: 'Id selezionato iniziale per l\'uso non controllato.' },
                onSelect: { description: 'Chiamata con il nodo selezionato su click, Invio o Spazio.' },
                ariaLabel: { description: 'Nome accessibile dell\'albero.' },
                className: { description: 'Classi sul contenitore role="tree".' },
                itemClassName: { description: 'Classi su ogni riga.' },
                selectedClassName: { description: 'Classi aggiuntive sulla riga selezionata.' },
            } },
            playground: { title: 'Playground Tree' },
        },
    },
});
