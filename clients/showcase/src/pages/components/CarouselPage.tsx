import React from 'react';
import { Carousel } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const slides = ['2563eb', '059669', 'dc2626'].map((color, index) => (
    <img
        key={color}
        src={`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="260" viewBox="0 0 640 260"%3E%3Crect width="640" height="260" fill="%23${color}"/%3E%3Ctext x="40" y="140" font-family="Arial" font-size="42" fill="white"%3ESlide ${index + 1}%3C/text%3E%3C/svg%3E`}
        alt={`Slide ${index + 1}`}
        {...({ description: `Demo slide ${index + 1}` } as unknown as React.ImgHTMLAttributes<HTMLImageElement>)}
        className="w-full rounded-md"
    />
));

const CAROUSEL_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactElement[]', required: true, description: 'Slide image elements' },
    { name: 'showIndicators', type: 'boolean', default: 'false', description: 'Shows slide indicators on hover', control: 'boolean' },
    { name: 'showControls', type: 'boolean', default: 'false', description: 'Shows previous/next controls on hover', control: 'boolean' },
    { name: 'showCaption', type: 'boolean', default: 'false', description: 'Shows captions from image alt/description on hover', control: 'boolean' },
    { name: 'dark', type: 'boolean', default: 'false', description: 'Uses dark control layout', control: 'boolean' },
    { name: 'autoPlay', type: 'AutoPlayConfig', description: 'Bootstrap carousel autoplay options', control: 'json', rows: 4, shortcuts: [
        { label: 'off', value: null, help: 'Disable autoplay.' },
        { label: 'default', value: { interval: 3000, pause: 'hover', wrap: true }, help: 'Standard autoplay with hover pause.' },
        { label: 'fast', value: { interval: 1200, pause: 'false', wrap: true }, help: 'Fast looping carousel.' },
    ], typeDetails: `{
  interval?: number;
  pause?: "hover" | "false" | "true";
  wrap?: boolean;
}` },
    { name: 'initialSlide', type: 'number', default: '0', description: 'Initial active slide index', control: 'number', min: 0, max: 2 },
    { name: 'renderCaption', type: '(image) => ReactElement', description: 'Custom caption renderer' },
    { name: 'onSlideClick', type: '(event) => void', description: 'Click handler on carousel inner area' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: CAROUSEL_PROPS,
    defaultProps: {
        showIndicators: true,
        showControls: true,
        showCaption: true,
        dark: false,
        autoPlay: null,
        initialSlide: 0,
    },
    render: (p) => (
        <Carousel
            showIndicators={p.showIndicators}
            showControls={p.showControls}
            showCaption={p.showCaption}
            dark={p.dark}
            autoPlay={p.autoPlay && typeof p.autoPlay === 'object' ? p.autoPlay : undefined}
            initialSlide={p.initialSlide}
        >
            {slides}
        </Carousel>
    ),
};

export default function CarouselPage() {
    usePlayground(PLAYGROUND, 'Carousel');

    return (
        <PageLayout title="Carousel" description="Image carousel wrapper with indicators, controls and caption support.">
            <Section
                title="Slides with captions"
                preview={<Carousel showIndicators showControls showCaption>{slides}</Carousel>}
                code={`import { Carousel } from '@llmnative/react';

<Carousel showIndicators showControls showCaption>
    <img src={slide1} alt="Slide 1" description="Demo slide" />
    <img src={slide2} alt="Slide 2" description="Demo slide" />
</Carousel>`}
            />

            <PropDocsTable props={CAROUSEL_PROPS} />
        </PageLayout>
    );
}
