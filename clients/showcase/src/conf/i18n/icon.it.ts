import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        icon: {
            page: { title: 'Icon', description: 'Renderer di icone basato su provider. La libreria di icone attiva viene configurata globalmente su App e puo essere cambiata a runtime. Provider integrati: lucide (predefinito), phosphor.' },
            sections: {
                basicUsage: { description: 'Renderizza qualsiasi icona per nome. Il provider attivo risolve il nome nel relativo componente.' },
                catalog: { title: 'Catalogo icone', description: 'Nomi di icone comuni supportati da tutti i provider integrati. Provider attivo: {providerId}.' },
                sizes: { description: 'La prop size imposta larghezza e altezza in pixel. Il valore predefinito e 16.' },
                colors: { title: 'Colori tramite className', description: 'Le icone ereditano il colore del testo CSS. Usa qualsiasi utility Tailwind text-*.' },
                providers: { title: 'Provider integrati: lucide vs phosphor', description: 'lucide e il predefinito. phosphor e integrato. Entrambi risolvono gli stessi nomi di icona.' },
                phosphor: { title: 'Varianti weight di Phosphor', description: 'Passa weight direttamente a Icon: non serve reinizializzare il provider. Valori supportati: thin, light, regular (predefinito), bold, fill, duotone.' },
                appConfig: { title: 'Configurazione a livello App', description: 'Il provider di icone viene impostato una sola volta su App ed ereditato via context. Puo essere cambiato a runtime con useIconController.' },
                aliases: { title: 'Alias', description: 'Mappa i tuoi nomi semantici verso nomi specifici del provider. Si configura una volta a livello App e funziona con qualsiasi provider.' },
                a11y: { title: 'Accessibilita', description: 'Le icone senza label sono aria-hidden (decorative). Fornisci una label quando l\'icona comunica un significato senza testo adiacente.' },
                customProvider: { title: 'Provider personalizzato', description: 'Implementa IconProviderAdapter per integrare qualsiasi libreria di icone.' },
            },
        },
    },
});
