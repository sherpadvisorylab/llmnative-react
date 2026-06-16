import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        switch: {
            page: {
                title: 'Switch',
                description: 'Switch-styled checkbox using the same value contract as Checkbox.',
            },
            sections: {
                booleanToggle: {
                    title: 'Boolean-like toggle',
                },
            },
            labels: {
                published: 'Published',
                togglePublishedState: 'Toggle published state',
            },
            propsDocs: {
                title: 'Switch props',
                items: {
                    name: { description: 'Field name used as form key.' },
                    label: { description: 'Label next to the switch.' },
                    title: { description: 'Native title attribute.' },
                    ariaLabel: { description: 'Accessible label for the switch input when no visible label is provided.' },
                    inheritWrapperClassName: { description: 'When false, ignores wrapperClassName inherited from the parent Form context.' },
                    required: { description: 'Marks the field as required.' },
                    valueChecked: { description: 'Value saved when enabled.' },
                    defaultValue: { description: 'Initial enabled value.' },
                    before: { description: 'Content before the switch.' },
                    after: { description: 'Content after the switch.' },
                    onChange: { description: 'Custom change handler called by Form context.' },
                    className: { description: 'CSS classes on the checkbox input.' },
                    wrapperClassName: { description: 'CSS classes on the wrapper.' },
                },
            },
            playground: {
                title: 'Switch',
            },
        },
    },
});
