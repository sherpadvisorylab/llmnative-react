import React from 'react';
import { Badge, Percentage } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

const PERCENTAGE_PROPS: PropDef[] = [
    { name: 'value', type: 'number', default: '0', description: 'Current value before min/max normalization', control: 'number', min: -50, max: 250 },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value mapped to 100%', control: 'number', min: 1, max: 250 },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value mapped to 0%', control: 'number', min: -50, max: 150 },
    { name: 'appearance', type: '"bar" | "circle"', default: '"bar"', description: 'Progress shape', control: 'select', options: ['bar', 'circle'] },
    { name: 'variant', type: 'ColorType', default: '"primary"', description: 'Progress fill color', control: 'select', options: COLORS },
    { name: 'trackVariant', type: 'ColorType', default: '"secondary"', description: 'Track/background color', control: 'select', options: COLORS },
    { name: 'thickness', type: 'number', default: '10', description: 'Bar height or circle stroke width', control: 'number', min: 4, max: 36 },
    { name: 'showText', type: 'boolean', default: 'true', description: 'Show the normalized percentage text', control: 'boolean' },
    { name: 'size', type: 'number', default: '100', description: 'Bar width percentage or circle size in pixels', control: 'number', min: 40, max: 260 },
    { name: 'fontSize', type: 'number', default: '16', description: 'Percentage text size in pixels', control: 'number', min: 8, max: 36 },
    { name: 'label', type: 'string', description: 'Label above the percentage', control: 'text' },
    { name: 'before', type: 'ReactNode', description: 'Content before the control', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Content after the control', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the rendered meter', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PERCENTAGE_PROPS,
    defaultProps: {
        value: 72,
        max: 100,
        min: 0,
        appearance: 'bar',
        variant: 'primary',
        trackVariant: 'secondary',
        thickness: 22,
        showText: true,
        size: 100,
        fontSize: 13,
        label: 'Completion',
        before: '',
        after: '',
        className: '',
        wrapperClassName: '',
    },
    render: (p) => (
        <Percentage
            value={p.value}
            max={p.max}
            min={p.min}
            appearance={p.appearance}
            variant={p.variant}
            trackVariant={p.trackVariant}
            thickness={p.thickness}
            showText={p.showText}
            size={p.size}
            fontSize={p.fontSize}
            label={p.label || undefined}
            before={p.before || undefined}
            after={p.after || undefined}
            className={p.className || undefined}
            wrapperClassName={p.wrapperClassName || undefined}
        />
    ),
};

export default function PercentagePage() {
    usePlayground(PLAYGROUND, 'Percentage');

    return (
        <PageLayout title="Percentage" description="Progress indicator rendered as a horizontal bar or circular meter, with min/max normalization and theme-aware colors.">
            <Section
                title="Bar meters"
                description="Use bars for dense dashboards and table detail panels. val is normalized between min and max."
                preview={
                    <div className="w-full max-w-xl space-y-5">
                        <Percentage label="Storage" value={64} variant="success" thickness={22} fontSize={13} wrapperClassName="w-full" />
                        <Percentage label="Budget used" value={38} variant="warning" thickness={18} fontSize={12} showText wrapperClassName="w-full" />
                        <Percentage label="Risk" value={12} variant="danger" thickness={16} fontSize={12} wrapperClassName="w-full" />
                    </div>
                }
                code={`import { Percentage } from '@llmnative/react';

<Percentage label="Storage" value={64} variant="success" thickness={22} />
<Percentage label="Budget used" value={38} variant="warning" thickness={18} />
<Percentage label="Risk" value={12} variant="danger" thickness={16} />`}
            />

            <Section
                title="Circular meters"
                description="Use circles for summary metrics where the percentage is the primary visual signal."
                preview={
                    <div className="flex flex-wrap gap-8">
                        <div className="text-center">
                            <Percentage appearance="circle" value={82} variant="primary" trackVariant="secondary" size={120} thickness={12} />
                            <div className="mt-2 text-sm font-medium">Quality</div>
                        </div>
                        <div className="text-center">
                            <Percentage appearance="circle" value={54} variant="info" trackVariant="secondary" size={120} thickness={12} />
                            <div className="mt-2 text-sm font-medium">Coverage</div>
                        </div>
                        <div className="text-center">
                            <Percentage appearance="circle" value={91} variant="success" trackVariant="secondary" size={120} thickness={12} showText={false} />
                            <div className="mt-2 text-sm font-medium">No text</div>
                        </div>
                    </div>
                }
                code={`<Percentage appearance="circle" value={82} size={120} thickness={12} />
<Percentage appearance="circle" value={54} variant="info" size={120} thickness={12} />
<Percentage appearance="circle" value={91} variant="success" showText={false} />`}
            />

            <Section
                title="Min/max normalization"
                description="The displayed percent is calculated from (val - min) / (max - min), then clamped between 0 and 100."
                preview={
                    <div className="w-full max-w-xl space-y-5">
                        <Percentage label="Revenue target: 75 of 150" value={75} min={0} max={150} variant="primary" thickness={22} />
                        <Percentage label="Temperature range: 30 in 20-40" value={30} min={20} max={40} variant="info" thickness={22} />
                        <Percentage label="Clamped above max" value={220} min={0} max={200} variant="success" thickness={22} />
                    </div>
                }
                code={`<Percentage label="Revenue target" value={75} min={0} max={150} />
<Percentage label="Temperature range" value={30} min={20} max={40} />
<Percentage label="Clamped above max" value={220} max={200} />`}
            />

            <Section
                title="Color variants and slots"
                description="type controls the fill. background controls the track. pre/post can add surrounding context."
                preview={
                    <div className="w-full max-w-xl space-y-4">
                        {COLORS.filter((color) => color !== 'light').map((color, index) => (
                            <div key={color} className="flex items-center gap-3">
                                <Badge variant={color as any}>{color}</Badge>
                                <Percentage value={(index + 2) * 12} variant={color as any} thickness={14} fontSize={11} wrapperClassName="flex-1" />
                            </div>
                        ))}
                        <Percentage before={<span className="text-sm text-muted-foreground">0%</span>} after={<span className="text-sm text-muted-foreground">100%</span>} value={48} variant="primary" thickness={18} wrapperClassName="flex items-center gap-3" />
                    </div>
                }
                code={`<Percentage value={72} variant="primary" trackVariant="secondary" />
<Percentage
    before={<span>0%</span>}
    after={<span>100%</span>}
    value={48}
/>`}
            />

            <PropDocsTable props={PERCENTAGE_PROPS} />
        </PageLayout>
    );
}
