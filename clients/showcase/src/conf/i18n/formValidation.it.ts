import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        formValidation: {
            page: { title: 'Form — Validazione', description: 'Il widget Form raccoglie tutti i campi non validi in un unico passaggio prima di bloccare l\'invio. Sono supportati sia i campi obbligatori che i validatori personalizzati. Gli errori appaiono in linea sotto ogni campo; scompaiono non appena l\'utente inizia a digitare.' },
            sections: {
                createMode: { title: 'Modalità creazione — campi obbligatori e validatori', description: 'Clicca Salva senza compilare nulla: tutti i campi obbligatori si evidenziano simultaneamente. Il footer mostra una notifica di avviso accanto al pulsante Salva — persiste fino a quando non correggi gli errori e invii di nuovo.' },
                editMode: { title: 'Modalità modifica — salva e delete', description: 'Passa defaultValues che includono un campo _key per segnalare la modalità modifica. Il Form vede _key in defaultValues e imposta isNewRecord = false, mostrando entrambi i pulsanti Salva e Elimina.' },
                longForm: { title: 'Modulo lungo — scroll al primo errore', description: 'Quando un form è più alto del viewport, il form scorre automaticamente al primo campo non valido e lo focalizza dopo un invio fallito. Scorri fino in fondo e clicca Salva — la pagina torna al primo campo mancante.' },
                longFormHowToTry: 'Come provarlo: scorri oltre tutti i campi fino al pulsante Salva, poi cliccaci. La pagina torna al primo campo non valido.',
                insideModal: { title: 'Form dentro un modal', description: 'Un form validato può vivere dentro un Modal in qualsiasi posizione. Il pulsante Salva del modal delega al handleSave interno del form: la validazione viene eseguita, gli errori appaiono in linea, e il modal si chiude solo quando tutti i campi sono validi.' },
            },
        },
    },
});
