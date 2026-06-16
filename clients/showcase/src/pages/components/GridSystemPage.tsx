import React from 'react';
import { Col, Container, Row, Wrapper } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseGridSystemI18n } from '../../showcase/i18n';

const COL_SIZE_OPTIONS = ['', 'auto', '1', '2', '3', '4', '5', '6', '8', '9', '12'];

const normalizeCol = (value: unknown): number | 'auto' | undefined =>
    value === '' || value == null ? undefined : value === 'auto' ? 'auto' : Number(value);

const colPropsFrom = (p: Record<string, any>, prefix: string) => ({
    xs: normalizeCol(p[`${prefix}Xs`]),
    sm: normalizeCol(p[`${prefix}Sm`]),
    md: normalizeCol(p[`${prefix}Md`]),
    lg: normalizeCol(p[`${prefix}Lg`]),
    xl: normalizeCol(p[`${prefix}Xl`]),
    xxl: normalizeCol(p[`${prefix}Xxl`]),
});

function GridCell({ label, tone = 'default' }: { label: string; tone?: 'default' | 'emphasis' | 'muted' }) {
    const toneClass = {
        default: 'border-border bg-muted/70 text-foreground',
        emphasis: 'border-primary/30 bg-primary/10 text-primary',
        muted: 'border-border bg-background text-muted-foreground',
    }[tone];

    return (
        <div className={`flex min-h-14 items-center justify-center rounded border px-3 py-3 text-center text-sm font-semibold ${toneClass}`}>
            {label}
        </div>
    );
}

function DemoRow({ children, label }: { children: React.ReactNode; label?: string }) {
    return (
        <div className="w-full rounded-md border border-dashed border-border bg-muted/20 p-3">
            {label && <div className="mb-2 font-mono text-xs font-semibold uppercase text-muted-foreground">{label}</div>}
            <Row className="gap-y-3">
                {children}
            </Row>
        </div>
    );
}

function PlaygroundPreview({
    props,
    labels,
}: {
    props: Record<string, any>;
    labels: ReturnType<typeof useShowcaseGridSystemI18n>['labels'];
}) {
    return (
        <Container
            className={`rounded-md border border-dashed bg-muted/20 py-3 ${props.containerClass || ''}`}
            style={props.containerStyle && typeof props.containerStyle === 'object' ? props.containerStyle : undefined}
        >
            <div className="mb-2 font-mono text-xs font-semibold uppercase text-muted-foreground">{labels.container}</div>
            <div className="rounded-md border border-dashed border-border bg-background p-3">
                <div className="mb-2 font-mono text-xs font-semibold uppercase text-muted-foreground">{labels.row}</div>
                <Row
                    className={props.rowClass || undefined}
                    style={props.rowStyle && typeof props.rowStyle === 'object' ? props.rowStyle : undefined}
                >
                    <Col {...colPropsFrom(props, 'left')} className={props.leftClass || undefined}>
                        <GridCell label={props.leftLabel || labels.leftCol} tone="muted" />
                    </Col>
                    <Col {...colPropsFrom(props, 'selected')} className={props.selectedClass || undefined}>
                        <GridCell label={props.selectedLabel || labels.selectedCol} tone="emphasis" />
                    </Col>
                    <Col {...colPropsFrom(props, 'right')} className={props.rightClass || undefined}>
                        <GridCell label={props.rightLabel || labels.rightCol} tone="muted" />
                    </Col>
                </Row>
            </div>
        </Container>
    );
}

export default function GridSystemPage() {
    const t = useShowcaseGridSystemI18n();

    const gridSystemPlaygroundProps = React.useMemo<PropDef[]>(() => [
        { name: 'containerClass', group: t.playground.groups.container, type: 'string', description: t.playground.props.containerClass.description, control: 'text' },
        {
            name: 'containerStyle',
            group: t.playground.groups.container,
            type: 'CSSProperties',
            description: t.playground.props.containerStyle.description,
            control: 'json',
            rows: 5,
            shortcuts: [
                { label: t.playground.props.containerStyle.shortcuts?.none.label || 'none', value: {}, help: t.playground.props.containerStyle.shortcuts?.none.help },
                { label: t.playground.props.containerStyle.shortcuts?.card.label || 'card', value: { padding: '16px', border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: '16px' }, help: t.playground.props.containerStyle.shortcuts?.card.help },
                { label: t.playground.props.containerStyle.shortcuts?.panel.label || 'panel', value: { padding: '20px', background: 'rgba(15, 23, 42, 0.04)', borderRadius: '20px' }, help: t.playground.props.containerStyle.shortcuts?.panel.help },
            ],
        },
        { name: 'rowClass', group: t.playground.groups.row, type: 'string', description: t.playground.props.rowClass.description, control: 'text' },
        {
            name: 'rowStyle',
            group: t.playground.groups.row,
            type: 'CSSProperties',
            description: t.playground.props.rowStyle.description,
            control: 'json',
            rows: 5,
            shortcuts: [
                { label: t.playground.props.rowStyle.shortcuts?.none.label || 'none', value: {}, help: t.playground.props.rowStyle.shortcuts?.none.help },
                { label: t.playground.props.rowStyle.shortcuts?.air.label || 'air', value: { rowGap: '12px' }, help: t.playground.props.rowStyle.shortcuts?.air.help },
                { label: t.playground.props.rowStyle.shortcuts?.highlight.label || 'highlight', value: { padding: '12px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '16px' }, help: t.playground.props.rowStyle.shortcuts?.highlight.help },
            ],
        },
        { name: 'leftLabel', group: t.playground.groups.leftCol, type: 'ReactNode', description: t.playground.props.leftLabel.description, control: 'text' },
        { name: 'leftXs', group: t.playground.groups.leftCol, type: 'number | "auto"', description: t.playground.props.leftXs.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'leftSm', group: t.playground.groups.leftCol, type: 'number | "auto"', description: t.playground.props.leftSm.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'leftMd', group: t.playground.groups.leftCol, type: 'number | "auto"', description: t.playground.props.leftMd.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'leftLg', group: t.playground.groups.leftCol, type: 'number | "auto"', description: t.playground.props.leftLg.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'leftXl', group: t.playground.groups.leftCol, type: 'number | "auto"', description: t.playground.props.leftXl.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'leftXxl', group: t.playground.groups.leftCol, type: 'number | "auto"', description: t.playground.props.leftXxl.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'leftClass', group: t.playground.groups.leftCol, type: 'string', description: t.playground.props.leftClass.description, control: 'text' },
        { name: 'selectedLabel', group: t.playground.groups.selectedCol, type: 'ReactNode', description: t.playground.props.selectedLabel.description, control: 'text' },
        { name: 'selectedXs', group: t.playground.groups.selectedCol, type: 'number | "auto"', description: t.playground.props.selectedXs.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'selectedSm', group: t.playground.groups.selectedCol, type: 'number | "auto"', description: t.playground.props.selectedSm.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'selectedMd', group: t.playground.groups.selectedCol, type: 'number | "auto"', description: t.playground.props.selectedMd.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'selectedLg', group: t.playground.groups.selectedCol, type: 'number | "auto"', description: t.playground.props.selectedLg.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'selectedXl', group: t.playground.groups.selectedCol, type: 'number | "auto"', description: t.playground.props.selectedXl.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'selectedXxl', group: t.playground.groups.selectedCol, type: 'number | "auto"', description: t.playground.props.selectedXxl.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'selectedClass', group: t.playground.groups.selectedCol, type: 'string', description: t.playground.props.selectedClass.description, control: 'text' },
        { name: 'rightLabel', group: t.playground.groups.rightCol, type: 'ReactNode', description: t.playground.props.rightLabel.description, control: 'text' },
        { name: 'rightXs', group: t.playground.groups.rightCol, type: 'number | "auto"', description: t.playground.props.rightXs.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'rightSm', group: t.playground.groups.rightCol, type: 'number | "auto"', description: t.playground.props.rightSm.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'rightMd', group: t.playground.groups.rightCol, type: 'number | "auto"', description: t.playground.props.rightMd.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'rightLg', group: t.playground.groups.rightCol, type: 'number | "auto"', description: t.playground.props.rightLg.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'rightXl', group: t.playground.groups.rightCol, type: 'number | "auto"', description: t.playground.props.rightXl.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'rightXxl', group: t.playground.groups.rightCol, type: 'number | "auto"', description: t.playground.props.rightXxl.description, control: 'select', options: COL_SIZE_OPTIONS },
        { name: 'rightClass', group: t.playground.groups.rightCol, type: 'string', description: t.playground.props.rightClass.description, control: 'text' },
    ], [t]);

    const gridSystemProps = React.useMemo<PropDef[]>(() => [
        { name: 'children', type: 'ReactNode', required: true, description: t.propsDocs.items.children.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description },
        { name: 'style', type: 'CSSProperties', description: t.propsDocs.items.style.description },
        { name: 'onClick', type: 'MouseEventHandler', description: t.propsDocs.items.onClick.description },
        { name: 'defaultSize', type: 'number', default: 'undefined', description: t.propsDocs.items.defaultSize.description },
        { name: 'xs', type: 'number | "auto"', default: 'undefined', description: t.propsDocs.items.xs.description },
        { name: 'sm', type: 'number | "auto"', default: 'undefined', description: t.propsDocs.items.sm.description },
        { name: 'md', type: 'number | "auto"', default: 'undefined', description: t.propsDocs.items.md.description },
        { name: 'lg', type: 'number | "auto"', default: 'undefined', description: t.propsDocs.items.lg.description },
        { name: 'xl', type: 'number | "auto"', default: 'undefined', description: t.propsDocs.items.xl.description },
        { name: 'xxl', type: 'number | "auto"', default: 'undefined', description: t.propsDocs.items.xxl.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: gridSystemPlaygroundProps,
        size: 'xl',
        layout: 'split',
        defaultProps: {
            containerClass: '',
            containerStyle: {},
            rowClass: '',
            rowStyle: {},
            leftLabel: t.labels.leftCol,
            leftXs: '12',
            leftSm: '',
            leftMd: '3',
            leftLg: '3',
            leftXl: '',
            leftXxl: '',
            leftClass: '',
            selectedLabel: t.labels.selectedCol,
            selectedXs: '12',
            selectedSm: '',
            selectedMd: '6',
            selectedLg: '6',
            selectedXl: '',
            selectedXxl: '',
            selectedClass: '',
            rightLabel: t.labels.rightCol,
            rightXs: '12',
            rightSm: '',
            rightMd: '3',
            rightLg: '3',
            rightXl: '',
            rightXxl: '',
            rightClass: '',
        },
        render: (p) => <PlaygroundPreview props={p} labels={t.labels} />,
    }), [gridSystemPlaygroundProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.equalWidthColumns.title}
                description={t.sections.equalWidthColumns.description}
                preview={
                    <div className="w-full space-y-3">
                        <DemoRow label={t.labels.equalThree}>
                            <Col><GridCell label={t.labels.col} /></Col>
                            <Col><GridCell label={t.labels.col} /></Col>
                            <Col><GridCell label={t.labels.col} /></Col>
                        </DemoRow>
                        <DemoRow label={t.labels.equalTwo}>
                            <Col><GridCell label={t.labels.col} /></Col>
                            <Col><GridCell label={t.labels.col} /></Col>
                        </DemoRow>
                    </div>
                }
                code={`import { Col, Row } from '@llmnative/react';

<Row>
    <Col>1 of 3</Col>
    <Col>2 of 3</Col>
    <Col>3 of 3</Col>
</Row>

<Row>
    <Col>1 of 2</Col>
    <Col>2 of 2</Col>
</Row>`}
            />

            <Section
                title={t.sections.settingOneColumnWidth.title}
                description={t.sections.settingOneColumnWidth.description}
                preview={
                    <div className="w-full space-y-3">
                        <DemoRow label={t.labels.centerFixed}>
                            <Col><GridCell label={t.labels.col} /></Col>
                            <Col xs={6}><GridCell label="xs=6" tone="emphasis" /></Col>
                            <Col><GridCell label={t.labels.col} /></Col>
                        </DemoRow>
                        <DemoRow label={t.labels.contentSidebar}>
                            <Col xs={8}><GridCell label="xs=8" /></Col>
                            <Col xs={4}><GridCell label="xs=4" tone="muted" /></Col>
                        </DemoRow>
                    </div>
                }
                code={`import { Col, Row } from '@llmnative/react';

<Row>
    <Col>1 of 3</Col>
    <Col xs={6}>2 of 3 wider</Col>
    <Col>3 of 3</Col>
</Row>

<Row>
    <Col xs={8}>Content</Col>
    <Col xs={4}>Aside</Col>
</Row>`}
            />

            <Section
                title={t.sections.variableWidthContent.title}
                description={t.sections.variableWidthContent.description}
                preview={
                    <div className="w-full space-y-3">
                        <DemoRow label={t.labels.autoMiddle}>
                            <Col lg={2}><GridCell label="lg=2" /></Col>
                            <Col md="auto"><GridCell label="md=auto variable width content" tone="emphasis" /></Col>
                            <Col lg={2}><GridCell label="lg=2" /></Col>
                        </DemoRow>
                        <DemoRow label={t.labels.autoSideTools}>
                            <Col xs="auto"><GridCell label="auto" tone="emphasis" /></Col>
                            <Col><GridCell label={t.labels.fluidCol} /></Col>
                            <Col xs="auto"><GridCell label="auto" tone="emphasis" /></Col>
                        </DemoRow>
                    </div>
                }
                code={`import { Col, Row } from '@llmnative/react';

<Row>
    <Col lg={2}>1 of 3</Col>
    <Col md="auto">Variable width content</Col>
    <Col lg={2}>3 of 3</Col>
</Row>

<Row>
    <Col xs="auto">Left tool</Col>
    <Col>Fluid content</Col>
    <Col xs="auto">Right tool</Col>
</Row>`}
            />

            <Section
                title={t.sections.responsiveStack.title}
                description={t.sections.responsiveStack.description}
                preview={
                    <DemoRow label={t.labels.responsiveSplit}>
                        <Col xs={12} md={8} xl={9}><GridCell label="xs=12 md=8 xl=9" /></Col>
                        <Col xs={12} md={4} xl={3}><GridCell label="xs=12 md=4 xl=3" tone="muted" /></Col>
                    </DemoRow>
                }
                code={`import { Col, Row } from '@llmnative/react';

<Row>
    <Col xs={12} md={8} xl={9}>Main</Col>
    <Col xs={12} md={4} xl={3}>Aside</Col>
</Row>`}
            />

            <Section
                title={t.sections.containerAndWrapper.title}
                description={t.sections.containerAndWrapper.description}
                preview={
                    <div className="w-full space-y-4">
                        <Container className="rounded-md border border-dashed bg-muted/20 py-4">
                            <Row className="gap-y-3">
                                <Col xs={12} md={6}><GridCell label={t.labels.containerRowCol} /></Col>
                                <Col xs={12} md={6}><GridCell label={t.labels.controlledMaxWidth} /></Col>
                            </Row>
                        </Container>
                        <Wrapper className="block rounded-md border border-dashed p-3">
                            <GridCell label={t.labels.wrapperRendersDiv} tone="muted" />
                        </Wrapper>
                    </div>
                }
                code={`import { Col, Container, Row, Wrapper } from '@llmnative/react';

<Container>
    <Row>
        <Col xs={12} md={6}>Left</Col>
        <Col xs={12} md={6}>Right</Col>
    </Row>
</Container>

<Wrapper className="rounded border p-3">
    Content
</Wrapper>`}
            />

            <PropDocsTable props={gridSystemProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
