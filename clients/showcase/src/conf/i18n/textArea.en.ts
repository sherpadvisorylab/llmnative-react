import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        textArea: {
            page: {
                title: 'TextArea',
                description: 'Controlled multiline text field integrated with Form context.',
            },
            sections: {
                basicTextarea: {
                    title: 'Basic textarea',
                },
                autoResize: {
                    title: 'Auto-resize with maxRows',
                    description: 'Set maxRows to make the textarea grow with its content. Once the row limit is reached it stops expanding and shows a scrollbar.',
                },
                feedbackPlaceholder: {
                    title: 'With feedback and placeholder',
                },
                addons: {
                    title: 'With pre/post addons',
                },
            },
            labels: {
                notes: 'Notes',
                writeShortNote: 'Write a short note...',
                initialNote: 'Initial note',
                bio: 'Bio',
                startTyping: 'Start typing - the textarea will grow as you add lines...',
                description: 'Description',
                describeIssue: 'Describe the issue in detail...',
                beSpecific: 'Be as specific as possible.',
                signedNote: 'Signed note',
                note: 'Note',
            },
            propsDocs: {
                title: 'TextArea props',
                items: {
                    name: { description: 'Field name used as form key.' },
                    label: { description: 'Label above the textarea.' },
                    placeholder: { description: 'Placeholder text.' },
                    required: { description: 'Marks the field as required.' },
                    disabled: { description: 'Disables the textarea.' },
                    readOnlyAfterSet: { description: 'Textarea becomes read-only once a value has been set.' },
                    defaultValue: { description: 'Initial textarea value supplied from outside the Form context.' },
                    rows: { description: 'Fixed number of visible rows. Ignored when maxRows is set and content is shorter.' },
                    maxRows: { description: 'Auto-resize up to this many rows, then show a scrollbar.' },
                    feedback: { description: 'Helper or validation text rendered below the field.' },
                    before: { description: 'Input-group content rendered before the textarea.' },
                    after: { description: 'Input-group content rendered after the textarea.' },
                    id: { description: 'Explicit id for the textarea element. Auto-generated when omitted.' },
                    onChange: { description: 'Custom change handler called by Form context.' },
                    textareaRef: { description: 'Ref forwarded to the underlying textarea element.' },
                    validator: { description: 'Custom validation function. Return an error message to block submission.' },
                    className: { description: 'Extra CSS classes applied to the textarea element.' },
                    wrapperClassName: { description: 'CSS classes applied to the outer wrapper div.' },
                    labelClassName: { description: 'CSS classes applied to the label element.' },
                },
            },
            playground: {
                title: 'TextArea',
            },
        },
    },
});
