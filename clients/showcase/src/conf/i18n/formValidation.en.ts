import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        formValidation: {
            page: { title: 'Form — Validation', description: 'The Form widget collects all invalid fields in a single pass before blocking submission. Both required fields and custom validators are supported. Errors appear inline below each field and disappear as soon as the user starts typing.' },
            sections: {
                createMode: { title: 'Create mode — required fields and validators', description: 'Click Save without filling anything: all required fields highlight simultaneously. The footer shows a warning notification next to the Save button — it persists until you fix the errors and resubmit.' },
                editMode: { title: 'Edit mode — save and delete', description: 'Pass defaultValues that include a _key field to signal edit mode. The Form sees _key in defaultValues and sets isNewRecord = false, showing both Save and Delete buttons.' },
                longForm: { title: 'Long form — scroll to first error', description: 'When a form is taller than the viewport, the form automatically scrolls to the first invalid field and focuses it after a failed submission. Scroll to the bottom and click Save — the page jumps back to the first missing field.' },
                longFormHowToTry: 'How to try it: scroll past all fields to the Save button, then click it. The page jumps back to the first invalid field.',
                insideModal: { title: 'Form inside a modal', description: 'A validated form can live inside a Modal in any position. The modal\'s Save button delegates to the form\'s internal handleSave: validation runs, errors appear inline, and the modal only closes when all fields are valid.' },
            },
        },
    },
});
