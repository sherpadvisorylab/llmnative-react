import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gallery: {
            page: {
                title: 'Gallery',
                description: 'Galleria di record visuali con supporto condiviso per ordinamento, overlay, selezione e paginazione.',
            },
            sections: {
                sortedGallery: {
                    title: 'Galleria ordinata',
                    description: 'Gallery accetta lo stesso contratto di ordinamento di Grid e Table. Ordina i record in ingresso prima del rendering, senza richiedere una UI di intestazione.',
                },
                recordClick: {
                    title: 'Click sul record',
                    description: 'onRowClick ora riceve il record cliccato, cosi i consumer possono usare direttamente record._key.',
                },
                bulkSelection: {
                    title: 'Selezione multipla',
                    description: 'Gallery replica la semantica di Table: selectedKeys controlla la selezione e onSelectionChange espone i record selezionati. I comandi bulk restano fuori dal componente.',
                },
                groupedPaged: {
                    title: 'Raggruppata e paginata',
                    description: 'Passa un nome campo a groupBy per raggruppare le card in sezioni etichettate. Abbinandolo a sortable sullo stesso campo ottieni cluster naturali. Passa un array per raggruppamenti multi-livello.',
                },
            },
            labels: {
                assets: 'Asset',
                selectableAssets: 'Asset selezionabili',
                assetsByCategory: 'Asset per categoria',
                selectedKey: 'Chiave selezionata',
                none: 'nessuno',
                multiCheckbox: 'Checkbox multipla',
                enableSelectionHelp: 'Abilita la selezione per ispezionare in tempo reale il payload di onSelectionChange nella preview della gallery.',
                enableMultiCheckbox: 'Abilita checkbox multipla',
                disableMultiCheckbox: 'Disabilita checkbox multipla',
                onSelectionPayload: 'Payload onSelectionChange',
                payloadEmptyHint: 'Abilita la checkbox multipla qui sopra, poi seleziona le card per vedere qui il payload della callback.',
                export: 'Esporta',
                clear: 'Pulisci',
                selectAssetsToEnableBulk: 'Seleziona gli asset per abilitare i comandi bulk esterni',
                selectedCount: 'selezionati',
                selectedGalleryItems: 'Elementi gallery selezionati',
                record: 'record',
                newBadge: 'nuovo',
                brandBadge: 'brand',
                reviewBadge: 'review',
            },
            values: {
                assetNames: {
                    hero: 'Hero Brand',
                    social: 'Social Brand',
                    iconset: 'Set icone Brand',
                    launch: 'Lancio campagna',
                    banner: 'Banner campagna',
                    guide: 'Guida docs',
                },
                categories: {
                    brand: 'Brand',
                    campaign: 'Campagna',
                    docs: 'Docs',
                },
                statuses: {
                    ready: 'pronto',
                    draft: 'bozza',
                    review: 'review',
                },
            },
            propsDocs: {
                title: 'Props Gallery',
                items: {
                    records: { description: 'Record che contengono dati img o thumbnail.' },
                    header: { description: 'Contenuto header sopra la gallery.' },
                    footer: { description: 'Contenuto footer sotto la gallery.' },
                    sortable: { description: 'Gallery non ha una UI header ordinabile, ma puoi passare un oggetto OrderConfig per ordinare il set di record in ingresso prima del rendering.', shortcuts: {
                        false: { label: 'false', help: 'Disabilita l ordinamento client.' },
                        nameAsc: { label: 'name asc', help: 'Ordina per nome crescente.' },
                        statusDesc: { label: 'status desc', help: 'Ordina per stato decrescente.' },
                    } },
                    overlays: { description: 'Regole overlay basate su posizione e filtri record.', shortcuts: {
                        none: { label: 'none', help: 'Nessun overlay.' },
                        status: { label: 'status', help: 'Overlay orientati allo stato.' },
                        brand: { label: 'brand', help: 'Badge brand basato sulla categoria.' },
                    } },
                    onRowClick: { description: 'Chiamata quando l utente clicca una card record.' },
                    onSelectionChange: { description: 'Chiamata ogni volta che cambia la selezione. Quando presente, le checkbox di selezione compaiono automaticamente.' },
                    selectedKeys: { description: 'Stato di selezione controllato condiviso con comandi bulk esterni.' },
                    pagination: { description: 'Configurazione di paginazione condivisa.', shortcuts: {
                        default: { label: 'default', help: 'Paginazione standard centrata.' },
                        compact: { label: 'compact', help: 'Pagine e navigazione piu compatte.' },
                        sticky: { label: 'sticky', help: 'Controlli sticky in basso.' },
                    } },
                    gap: { description: 'Dimensione padding degli item.' },
                    columns: { description: 'Colonne per riga.' },
                    groupBy: { description: 'Raggruppa le card per nome campo. I record con lo stesso valore vengono renderizzati nella stessa sezione. Passa un array per raggruppamenti multi-livello.', placeholder: 'es. category o ["category","status"]', shortcuts: {
                        off: { label: 'off', help: 'Nessun raggruppamento.' },
                        category: { label: 'category', help: 'Raggruppa per categoria.' },
                        status: { label: 'status', help: 'Raggruppa per stato.' },
                        catStatus: { label: 'cat+status', help: 'Multi-livello: categoria poi stato.' },
                    } },
                    scrollToTopOnChange: { description: 'Riporta la gallery in alto quando cambia pagina.' },
                    scrollBehavior: { description: 'Comportamento di scroll usato per tornare in alto al cambio pagina.' },
                    className: { description: 'Classe applicata al wrapper interno flex-column.' },
                    wrapperClassName: { description: 'Classe applicata all elemento wrapper piu esterno.' },
                    scrollClassName: { description: 'Classe applicata al contenitore body scrollabile.' },
                    headerClassName: { description: 'Classe applicata al contenitore header.' },
                    bodyClassName: { description: 'Classe applicata al contenitore flex-wrap degli item.' },
                    footerClassName: { description: 'Classe applicata al contenitore footer.' },
                    selectedClassName: { description: 'Classe applicata all item selezionato.' },
                    before: { description: 'Contenuto renderizzato a sinistra della gallery.' },
                    after: { description: 'Contenuto renderizzato a destra della gallery.' },
                },
            },
            playground: {
                title: 'Gallery',
            },
        },
    },
});
