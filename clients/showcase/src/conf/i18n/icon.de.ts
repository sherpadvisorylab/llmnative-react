import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        icon: {
            page: { title: 'Icon', description: 'Provider-gestuetzter Icon-Renderer. Die aktive Icon-Bibliothek wird global auf App konfiguriert und kann zur Laufzeit gewechselt werden. Integrierte Provider: lucide (Standard), phosphor.' },
            sections: {
                basicUsage: { description: 'Rendert jedes Icon ueber seinen Namen. Der aktive Provider loest den Namen in die entsprechende Komponente auf.' },
                catalog: { title: 'Icon-Katalog', description: 'Gaengige Icon-Namen, die von allen integrierten Providern unterstuetzt werden. Aktiver Provider: {providerId}.' },
                sizes: { description: 'Die Prop size setzt Breite und Hoehe in Pixeln. Standard ist 16.' },
                colors: { title: 'Farben ueber className', description: 'Icons erben die CSS-Textfarbe. Verwende beliebige Tailwind-Utilities vom Typ text-*.' },
                providers: { title: 'Integrierte Provider: lucide vs phosphor', description: 'lucide ist der Standard. phosphor ist integriert. Beide loesen dieselben Icon-Namen auf.' },
                phosphor: { title: 'Phosphor-Gewichtsvarianten', description: 'Uebergib weight direkt an Icon: Der Provider muss nicht neu instanziiert werden. Unterstuetzte Werte: thin, light, regular (Standard), bold, fill, duotone.' },
                appConfig: { title: 'Konfiguration auf App-Ebene', description: 'Der Icon-Provider wird einmal auf App gesetzt und ueber Context vererbt. Er kann zur Laufzeit mit useIconController gewechselt werden.' },
                aliases: { title: 'Aliase', description: 'Mappe eigene semantische Namen auf providerspezifische Namen. Einmal auf App-Ebene konfiguriert, funktioniert das mit jedem Provider.' },
                a11y: { title: 'Barrierefreiheit', description: 'Icons ohne Label sind aria-hidden (dekorativ). Gib ein Label an, wenn das Icon ohne benachbarten Text Bedeutung traegt.' },
                customProvider: { title: 'Benutzerdefinierter Provider', description: 'Implementiere IconProviderAdapter, um eine beliebige Icon-Bibliothek zu integrieren.' },
            },
        },
    },
});
