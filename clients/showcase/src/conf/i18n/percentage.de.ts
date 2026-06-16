import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({ showcase: { percentage: {
    page: { title: 'Percentage', description: 'Fortschrittsanzeige als horizontale Leiste oder kreisfoermiger Indikator mit Min/Max-Normalisierung und theme-basierten Farben.' },
    sections: {
        bars: { title: 'Balkenanzeigen', description: 'Verwende Balken fuer dichte Dashboards und Detailbereiche in Tabellen. Der Wert wird zwischen min und max normalisiert.' },
        circles: { title: 'Kreisanzeigen', description: 'Verwende Kreise fuer Uebersichtsmetriken, bei denen der Prozentwert das wichtigste visuelle Signal ist.' },
        normalization: { title: 'Min/Max-Normalisierung', description: 'Der angezeigte Prozentwert wird als (value - min) / (max - min) berechnet und danach zwischen 0 und 100 begrenzt.' },
        variants: { title: 'Farbvarianten und Slots', description: 'variant steuert die Fuellung. trackVariant steuert die Spur. before/after koennen zusaetzlichen Kontext hinzufuegen.' },
    },
    labels: {
        completion: 'Fortschritt',
        storage: 'Speicher',
        budgetUsed: 'Budget genutzt',
        risk: 'Risiko',
        quality: 'Qualitaet',
        coverage: 'Abdeckung',
        noText: 'Ohne Text',
        revenueTarget: 'Umsatzziel: 75 von 150',
        temperatureRange: 'Temperaturbereich: 30 in 20-40',
        clampedAboveMax: 'Oberhalb des Maximums begrenzt',
    },
    propsDocs: { items: {
        value: { description: 'Aktueller Wert vor der Min/Max-Normalisierung.' }, max: { description: 'Maximalwert, der auf 100% abgebildet wird.' }, min: { description: 'Minimalwert, der auf 0% abgebildet wird.' }, appearance: { description: 'Form der Fortschrittsanzeige.' }, variant: { description: 'Farbe der Fortschrittsfuellung.' }, trackVariant: { description: 'Farbe der Spur bzw. des Hintergrunds.' }, thickness: { description: 'Hoehe des Balkens oder Breite des Kreisstrichs.' }, showText: { description: 'Zeigt den normalisierten Prozenttext an.' }, size: { description: 'Balkenbreite in Prozent oder Kreisgroesse in Pixeln.' }, fontSize: { description: 'Groesse des Prozenttexts in Pixeln.' }, label: { description: 'Beschriftung ueber der Anzeige.' }, before: { description: 'Inhalt vor dem Steuerelement.' }, after: { description: 'Inhalt nach dem Steuerelement.' }, className: { description: 'CSS-Klassen auf dem gerenderten Indikator.' }, wrapperClassName: { description: 'CSS-Klassen auf dem Wrapper.' },
    } },
    playground: { title: 'Percentage', defaultLabel: 'Fortschritt', props: {
        value: { description: 'Aktueller Wert vor der Min/Max-Normalisierung.' }, max: { description: 'Maximalwert, der auf 100% abgebildet wird.' }, min: { description: 'Minimalwert, der auf 0% abgebildet wird.' }, appearance: { description: 'Form der Fortschrittsanzeige.' }, variant: { description: 'Farbe der Fortschrittsfuellung.' }, trackVariant: { description: 'Farbe der Spur bzw. des Hintergrunds.' }, thickness: { description: 'Hoehe des Balkens oder Breite des Kreisstrichs.' }, showText: { description: 'Zeigt den normalisierten Prozenttext an.' }, size: { description: 'Balkenbreite in Prozent oder Kreisgroesse in Pixeln.' }, fontSize: { description: 'Groesse des Prozenttexts in Pixeln.' }, label: { description: 'Beschriftung ueber der Anzeige.' }, before: { description: 'Inhalt vor dem Steuerelement.' }, after: { description: 'Inhalt nach dem Steuerelement.' }, className: { description: 'CSS-Klassen auf dem gerenderten Indikator.' }, wrapperClassName: { description: 'CSS-Klassen auf dem Wrapper.' },
    } },
} } });
