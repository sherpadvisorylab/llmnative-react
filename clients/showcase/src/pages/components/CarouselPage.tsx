import React from 'react';
import { Carousel } from '@llmnative/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const slides = ['2563eb', '059669', 'dc2626'].map((color, index) => (
    <img
        key={color}
        src={`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="260" viewBox="0 0 640 260"%3E%3Crect width="640" height="260" fill="%23${color}"/%3E%3Ctext x="40" y="140" font-family="Arial" font-size="42" fill="white"%3ESlide ${index + 1}%3C/text%3E%3C/svg%3E`}
        alt={`Slide ${index + 1}`}
        description={`Demo slide ${index + 1}`}
        className="w-full rounded-md"
    />
));

const CAROUSEL_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactElement[]', required: true, description: 'Slide image elements' },
    { name: 'showIndicators', type: 'boolean', default: 'false', description: 'Shows slide indicators on hover', control: 'boolean' },
    { name: 'showControls', type: 'boolean', default: 'false', description: 'Shows previous/next controls on hover', control: 'boolean' },
    { name: 'showCaption', type: 'boolean', default: 'false', description: 'Shows captions from image alt/description on hover', control: 'boolean' },
    { name: 'layoutDark', type: 'boolean', default: 'false', description: 'Uses dark control layout', control: 'boolean' },
    { name: 'autoPlay', type: 'AutoPlayConfig', description: 'Bootstrap carousel autoplay options', control: 'json', typeDetails: `{
  interval?: number;
  pause?: "hover" | false;
  wrap?: boolean;
}` },
    { name: 'startSlide', type: 'number', default: '0', description: 'Initial active slide index', control: 'number', min: 0, max: 2 },
    { name: 'onParseCaption', type: '(image) => ReactElement', description: 'Custom caption renderer' },
    { name: 'onClick', type: '(event) => void', description: 'Click handler on carousel inner area' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: CAROUSEL_PROPS,
    defaultProps: {
        showIndicators: true,
        showControls: true,
        showCaption: true,
        layoutDark: false,
        autoPlay: null,
        startSlide: 0,
    },
    render: (p) => (
        <Carousel
            showIndicators={p.showIndicators}
            showControls={p.showControls}
            showCaption={p.showCaption}
            layoutDark={p.layoutDark}
            autoPlay={p.autoPlay && typeof p.autoPlay === 'object' ? p.autoPlay : undefined}
            startSlide={p.startSlide}
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
