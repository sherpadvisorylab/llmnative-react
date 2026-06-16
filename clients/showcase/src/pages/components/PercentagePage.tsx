import React from 'react';
import { Badge, Percentage } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcasePercentageI18n } from '../../showcase/i18n';

const COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

export default function PercentagePage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcasePercentageI18n();

    const percentageProps = React.useMemo<PropDef[]>(() => [
        { name: 'value', type: 'number', default: '0', description: t.playground.props.value.description, control: 'number', min: -50, max: 250 },
        { name: 'max', type: 'number', default: '100', description: t.playground.props.max.description, control: 'number', min: 1, max: 250 },
        { name: 'min', type: 'number', default: '0', description: t.playground.props.min.description, control: 'number', min: -50, max: 150 },
        { name: 'appearance', type: '"bar" | "circle"', default: '"bar"', description: t.playground.props.appearance.description, control: 'select', options: ['bar', 'circle'] },
        { name: 'variant', type: 'ColorType', default: '"primary"', description: t.playground.props.variant.description, control: 'select', options: COLORS },
        { name: 'trackVariant', type: 'ColorType', default: '"secondary"', description: t.playground.props.trackVariant.description, control: 'select', options: COLORS },
        { name: 'thickness', type: 'number', default: '10', description: t.playground.props.thickness.description, control: 'number', min: 4, max: 36 },
        { name: 'showText', type: 'boolean', default: 'true', description: t.playground.props.showText.description, control: 'boolean' },
        { name: 'size', type: 'number', default: '100', description: t.playground.props.size.description, control: 'number', min: 40, max: 260 },
        { name: 'fontSize', type: 'number', default: '16', description: t.playground.props.fontSize.description, control: 'number', min: 8, max: 36 },
        { name: 'label', type: 'string', description: t.playground.props.label.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.playground.props.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.playground.props.after.description, control: 'text' },
        { name: 'className', type: 'string', description: t.playground.props.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.playground.props.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: percentageProps,
        defaultProps: { value: 72, max: 100, min: 0, appearance: 'bar', variant: 'primary', trackVariant: 'secondary', thickness: 22, showText: true, size: 100, fontSize: 13, label: t.playground.defaultLabel, before: '', after: '', className: '', wrapperClassName: '' },
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
    }), [percentageProps, t.playground.defaultLabel]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.bars.title}
                description={t.sections.bars.description}
                preview={
                    <div className="w-full max-w-xl space-y-5">
                        <Percentage label={t.labels.storage} value={64} variant="success" thickness={22} fontSize={13} wrapperClassName="w-full" />
                        <Percentage label={t.labels.budgetUsed} value={38} variant="warning" thickness={18} fontSize={12} showText wrapperClassName="w-full" />
                        <Percentage label={t.labels.risk} value={12} variant="danger" thickness={16} fontSize={12} wrapperClassName="w-full" />
                    </div>
                }
                code={`import { Percentage } from '@llmnative/react';

<Percentage label="Storage" value={64} variant="success" thickness={22} />
<Percentage label="Budget used" value={38} variant="warning" thickness={18} />
<Percentage label="Risk" value={12} variant="danger" thickness={16} />`}
            />

            <Section
                title={t.sections.circles.title}
                description={t.sections.circles.description}
                preview={
                    <div className="flex flex-wrap gap-8">
                        <div className="text-center">
                            <Percentage appearance="circle" value={82} variant="primary" trackVariant="secondary" size={120} thickness={12} />
                            <div className="mt-2 text-sm font-medium">{t.labels.quality}</div>
                        </div>
                        <div className="text-center">
                            <Percentage appearance="circle" value={54} variant="info" trackVariant="secondary" size={120} thickness={12} />
                            <div className="mt-2 text-sm font-medium">{t.labels.coverage}</div>
                        </div>
                        <div className="text-center">
                            <Percentage appearance="circle" value={91} variant="success" trackVariant="secondary" size={120} thickness={12} showText={false} />
                            <div className="mt-2 text-sm font-medium">{t.labels.noText}</div>
                        </div>
                    </div>
                }
                code={`<Percentage appearance="circle" value={82} size={120} thickness={12} />
<Percentage appearance="circle" value={54} variant="info" size={120} thickness={12} />
<Percentage appearance="circle" value={91} variant="success" showText={false} />`}
            />

            <Section
                title={t.sections.normalization.title}
                description={t.sections.normalization.description}
                preview={
                    <div className="w-full max-w-xl space-y-5">
                        <Percentage label={t.labels.revenueTarget} value={75} min={0} max={150} variant="primary" thickness={22} />
                        <Percentage label={t.labels.temperatureRange} value={30} min={20} max={40} variant="info" thickness={22} />
                        <Percentage label={t.labels.clampedAboveMax} value={220} min={0} max={200} variant="success" thickness={22} />
                    </div>
                }
                code={`<Percentage label="Revenue target" value={75} min={0} max={150} />
<Percentage label="Temperature range" value={30} min={20} max={40} />
<Percentage label="Clamped above max" value={220} max={200} />`}
            />

            <Section
                title={t.sections.variants.title}
                description={t.sections.variants.description}
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

            <PropDocsTable props={percentageProps} title={common.sections.props} />
        </PageLayout>
    );
}
