import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageField: {
            page: {
                title: 'ImageField',
                description: 'Form field for managing an image — URL, alt text, inline crop editor, and optional eager responsive srcset generation.',
            },
            sections: {
                basic: { title: 'Basic usage' },
                withVariants: { title: 'With responsive variants' },
            },
            labels: {
                heroImage: 'Hero image',
                sampleImageAlt: 'Blue hero illustration',
            },
            propsDocs: {
                title: 'ImageField props',
                items: {
                    name: { description: 'Object field name in the Form record.' },
                    label: { description: 'Label above the field.' },
                    required: { description: 'Marks alt text as required.' },
                    defaultValue: { description: 'Initial value: { src, alt, srcset?, sizes? }.' },
                    value: { description: 'Controlled value managed externally.' },
                    srcsetWidths: { description: 'Pixel widths for eager canvas-resized variants. Example: [400, 800]. Empty array disables generation.' },
                    uploadPath: { description: 'Storage path prefix — if set and a StorageProvider is present, variants are uploaded and srcset uses durable URLs.' },
                    disabled: { description: 'Disables all inputs and the crop button.' },
                    feedback: { description: 'Helper text shown below the field when there is no error.' },
                    before: { description: 'Content rendered before the field.' },
                    after: { description: 'Content rendered after the field.' },
                    onChange: { description: 'Custom change handler called by Form context.' },
                    className: { description: 'CSS classes on the field container.' },
                    wrapperClassName: { description: 'CSS classes on the wrapper.' },
                },
            },
            playground: {
                title: 'ImageField',
            },
        },
    },
});
