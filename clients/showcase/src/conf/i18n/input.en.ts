import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        input: {
            page: {
                title: 'Input',
                description: 'Text, number, email, password, color, date, datetime, week, month and textarea variants. All inputs are form-context-aware and integrate automatically with Form.',
            },
            sections: {
                textVariants: {
                    title: 'Text variants',
                    description: 'The most common input types. All support label, required, placeholder and disabled props.',
                },
                numberRange: {
                    title: 'Number and range',
                },
                dateTime: {
                    title: 'Date and time',
                },
                colorPicker: {
                    title: 'Color picker',
                },
                textarea: {
                    title: 'Textarea',
                    description: 'Multi-line text with configurable rows.',
                },
                checkbox: {
                    title: 'Checkbox',
                },
                disabledReadOnlyAfterSet: {
                    title: 'Disabled and readOnlyAfterSet',
                    description: 'readOnlyAfterSet disables the field once a value has been set.',
                },
            },
            labels: {
                fieldLabel: 'Field label',
                typeSomething: 'Type something...',
                firstName: 'First name',
                email: 'Email',
                password: 'Password',
                website: 'Website',
                age: 'Age',
                score: 'Score (0-100)',
                birthday: 'Birthday',
                startTime: 'Start time',
                appointment: 'Appointment',
                week: 'Week',
                month: 'Month',
                brandColor: 'Brand color',
                bio: 'Bio',
                tellUsAboutYourself: 'Tell us about yourself...',
                acceptTerms: 'I accept the terms and conditions',
                recordId: 'Record ID',
                slug: 'Slug',
            },
            propsDocs: {
                title: 'Input props',
                items: {
                    name: { description: 'Field name used as form key and dot-notation path.' },
                    label: { description: 'Label displayed above the input.' },
                    type: { description: 'HTML input type.' },
                    placeholder: { description: 'Placeholder text.' },
                    required: { description: 'Marks the field as required and shows an asterisk on the label.' },
                    disabled: { description: 'Makes the field read-only.' },
                    readOnlyAfterSet: { description: 'Field becomes read-only once a value has been set.' },
                    defaultValue: { description: 'Initial value when not managed by a Form.' },
                    min: { description: 'Minimum value for number and range inputs.' },
                    max: { description: 'Maximum value for number and range inputs.' },
                    step: { description: 'Step increment for number and range inputs.' },
                    feedback: { description: 'Validation feedback shown below the field.' },
                    id: { description: 'Explicit id for the input element. Auto-generated when omitted.' },
                    labelClassName: { description: 'CSS classes applied to the label element.' },
                    validator: { description: 'Custom validation function. Return an error message to block submission.' },
                    className: { description: 'CSS classes on the input element.' },
                    wrapperClassName: { description: 'CSS classes on the outer wrapper.' },
                },
            },
            playground: {
                title: 'Input',
            },
        },
    },
});
