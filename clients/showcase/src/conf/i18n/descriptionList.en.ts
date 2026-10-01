import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: 'Read-only label → value pairs rendered as a semantic <dl>: profile data, the facts of a record, summaries.',
            },
            sections: {
                horizontal: { title: 'Horizontal', description: 'Label column on the left, values on the right; on small screens each pair stacks.' },
                stacked: { title: 'Stacked in columns', description: 'Label above the value, laid out in responsive columns: good for the header facts of a record.' },
            },
            labels: {
                email: 'Login email',
                role: 'Role',
                dealer: 'Dealer',
                phone: 'Phone',
                status: 'Status',
                buyer: 'Buyer',
                shipped: 'Shipped on',
                price: 'Unit price',
                admin: 'Administrator',
                delivered: 'Delivered',
            },
            propsDocs: { items: {
                items: { description: 'Pairs to show: { key?, label, value?, title? }.' },
                layout: { description: 'horizontal: label column on the left; stacked: label above the value.' },
                columns: { description: 'Stacked layout only: columns from the lg breakpoint (1–6).' },
                labelWidth: { description: 'Horizontal layout only: width of the label column (CSS length).' },
                emptyValue: { description: 'Shown for null, undefined or empty-string values.' },
                truncate: { description: 'Keep values on one line with an ellipsis; string values become their tooltip.' },
                className: { description: 'Classes on the <dl>.' },
                wrapperClassName: { description: 'Classes on an optional wrapper <div>.' },
            } },
            playground: { title: 'DescriptionList playground' },
        },
    },
});
