import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loadingButton: {
            page: { title: 'LoadingButton', description: 'Async button that disables itself while work is pending. Supports streaming label updates mid-flight via setMessage.' },
            sections: {
                asyncSave: { title: 'Async save', description: 'Pass an async onClick. The button spins and blocks re-click until the promise resolves.' },
                customLabel: { title: 'Custom loading label', description: 'loadingLabel replaces the default "Save…" while the spinner is active.' },
                streaming: { title: 'Streaming label via setMessage', description: 'The second argument of onClick is setMessage — call it any time during the async work to update the loading label live. Useful for multi-step operations.' },
                disabled: { title: 'Disabled state', description: 'disabled keeps the button permanently inactive regardless of the loading cycle.' },
                controlled: { title: 'Controlled loading (loading)', description: 'loading lets a parent component control the loading state externally — useful when the button is part of a larger form submit flow.' },
                variants: { description: 'LoadingButton supports the same variant tokens as ActionButton.' },
            },
        },
    },
});
