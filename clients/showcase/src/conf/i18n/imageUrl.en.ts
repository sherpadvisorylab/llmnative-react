import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageUrl: {
            page: {
                title: 'ImageUrl',
                description: 'Compound form field for image URL, alt prompt metadata, width, height and live preview.',
            },
            sections: {
                imageMetadata: {
                    title: 'Image metadata',
                },
            },
            labels: {
                hero: 'hero',
                heroImage: 'Hero image',
                blueHeroIllustration: 'Blue hero illustration',
                squareThumbnail: 'Square thumbnail',
            },
            propsDocs: {
                title: 'ImageUrl props',
                items: {
                    name: { description: 'Object field name in the Form record.' },
                    label: { description: 'Label for the URL field.' },
                    required: { description: 'Marks nested fields as required.' },
                    defaultValue: { description: 'Initial nested image object.' },
                    value: { description: 'Controlled value for the current nested image object managed externally.' },
                    inheritWrapperClassName: { description: 'When true the field inherits wrapperClassName from the parent Form context.' },
                    mode: { description: 'Prompt mode used for alt text.' },
                    before: { description: 'Content before the field group.' },
                    after: { description: 'Content after the field group.' },
                    onChange: { description: 'Custom change handler called by Form context.' },
                    className: { description: 'CSS classes on the URL input.' },
                    wrapperClassName: { description: 'CSS classes on the wrapper.' },
                },
            },
            playground: {
                title: 'ImageUrl',
            },
        },
    },
});
