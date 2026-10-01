import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: 'Read-only label → value pairs with native <dl>/<dt>/<dd> semantics, horizontal or stacked layout, responsive columns and theme-aware styling.',
            },
            sections: {
                horizontal: { title: 'Horizontal', description: 'Label beside the value. The pair stacks on mobile and respects labelWidth on larger screens.' },
                stacked: { title: 'Stacked columns', description: 'Label above the value, laid out in a responsive grid of 1–6 columns.' },
                emptyValues: { title: 'Empty values', description: 'null, undefined and empty strings render emptyValue (default "—").' },
                truncate: { title: 'Truncate', description: 'Keeps long values on a single line with an ellipsis and exposes the full text through a native title.' },
                theme: { title: 'Theme', description: 'Every slot can be styled through the DescriptionList theme key: wrapper, list, item, label and value.' },
            },
            labels: {
                email: 'Email',
                role: 'Role',
                admin: 'Administrator',
                fullName: 'Full name',
                company: 'Company',
                status: 'Status',
                phone: 'Phone',
                address: 'Address',
                notes: 'Notes',
                bio: 'Bio',
                longValue: 'A very long value that will not fit on a single line and needs truncation',
                empty: 'N/A',
            },
            propsDocs: { items: {
                items: { description: 'Pairs of label and value to render.' },
                layout: { description: 'Label position: beside the value (horizontal) or above it (stacked).' },
                columns: { description: 'Responsive column count in stacked layout (1–6). Ignored in horizontal.' },
                labelWidth: { description: 'Fixed label width in horizontal layout (any CSS length, e.g. "12rem").' },
                emptyValue: { description: 'Rendered when a value is null, undefined or empty. Defaults to "—".' },
                truncate: { description: 'Keeps values on one line with an ellipsis and sets a native title on text values.' },
                className: { description: 'CSS classes on the <dl> element.' },
                wrapperClassName: { description: 'CSS classes on the outer wrapper.' },
            } },
            playground: {
                title: 'DescriptionList',
                props: {
                    items: { description: 'Pairs of label and value to render.' },
                    layout: { description: 'Label position: beside the value (horizontal) or above it (stacked).' },
                    columns: { description: 'Responsive column count in stacked layout (1–6). Ignored in horizontal.' },
                    labelWidth: { description: 'Fixed label width in horizontal layout (any CSS length, e.g. "12rem").' },
                    emptyValue: { description: 'Rendered when a value is null, undefined or empty. Defaults to "—".' },
                    truncate: { description: 'Keeps values on one line with an ellipsis and sets a native title on text values.' },
                    className: { description: 'CSS classes on the <dl> element.' },
                    wrapperClassName: { description: 'CSS classes on the outer wrapper.' },
                },
            },
        },
    },
});
