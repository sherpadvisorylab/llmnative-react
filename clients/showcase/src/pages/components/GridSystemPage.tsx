import React from 'react';
import { Col, Container, Row, Wrapper } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const COL_SIZE_OPTIONS = ['', 'auto', '1', '2', '3', '4', '5', '6', '8', '9', '12'];

const GRID_SYSTEM_PLAYGROUND_PROPS: PropDef[] = [
    { name: 'containerClass', group: 'Container', type: 'string', description: 'Classes appended to Container.', control: 'text' },
    {
        name: 'containerStyle',
        group: 'Container',
        type: 'CSSProperties',
        description: 'Inline styles applied to Container.',
        control: 'json',
        rows: 5,
        shortcuts: [
            { label: 'none', value: {}, help: 'No inline styles.' },
            { label: 'card', value: { padding: '16px', border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: '16px' }, help: 'Card-like container frame.' },
            { label: 'panel', value: { padding: '20px', background: 'rgba(15, 23, 42, 0.04)', borderRadius: '20px' }, help: 'Soft panel background.' },
        ],
    },
    { name: 'rowClass', group: 'Row', type: 'string', description: 'Classes appended to Row.', control: 'text' },
    {
        name: 'rowStyle',
        group: 'Row',
        type: 'CSSProperties',
        description: 'Inline styles applied to Row.',
        control: 'json',
        rows: 5,
        shortcuts: [
            { label: 'none', value: {}, help: 'No inline styles.' },
            { label: 'air', value: { rowGap: '12px' }, help: 'More vertical breathing room.' },
            { label: 'highlight', value: { padding: '12px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '16px' }, help: 'Highlight the row area.' },
        ],
    },
    { name: 'leftLabel', group: 'Left Col', type: 'ReactNode', description: 'Visible content for the left Col.', control: 'text' },
    { name: 'leftXs', group: 'Left Col', type: 'number | "auto"', description: 'Left Col xs size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'leftSm', group: 'Left Col', type: 'number | "auto"', description: 'Left Col sm size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'leftMd', group: 'Left Col', type: 'number | "auto"', description: 'Left Col md size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'leftLg', group: 'Left Col', type: 'number | "auto"', description: 'Left Col lg size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'leftXl', group: 'Left Col', type: 'number | "auto"', description: 'Left Col xl size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'leftXxl', group: 'Left Col', type: 'number | "auto"', description: 'Left Col xxl size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'leftClass', group: 'Left Col', type: 'string', description: 'Classes appended to the left Col.', control: 'text' },
    { name: 'selectedLabel', group: 'Selected Col', type: 'ReactNode', description: 'Visible content for the selected Col.', control: 'text' },
    { name: 'selectedXs', group: 'Selected Col', type: 'number | "auto"', description: 'Selected Col xs size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'selectedSm', group: 'Selected Col', type: 'number | "auto"', description: 'Selected Col sm size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'selectedMd', group: 'Selected Col', type: 'number | "auto"', description: 'Selected Col md size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'selectedLg', group: 'Selected Col', type: 'number | "auto"', description: 'Selected Col lg size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'selectedXl', group: 'Selected Col', type: 'number | "auto"', description: 'Selected Col xl size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'selectedXxl', group: 'Selected Col', type: 'number | "auto"', description: 'Selected Col xxl size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'selectedClass', group: 'Selected Col', type: 'string', description: 'Classes appended to the selected Col.', control: 'text' },
    { name: 'rightLabel', group: 'Right Col', type: 'ReactNode', description: 'Visible content for the right Col.', control: 'text' },
    { name: 'rightXs', group: 'Right Col', type: 'number | "auto"', description: 'Right Col xs size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'rightSm', group: 'Right Col', type: 'number | "auto"', description: 'Right Col sm size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'rightMd', group: 'Right Col', type: 'number | "auto"', description: 'Right Col md size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'rightLg', group: 'Right Col', type: 'number | "auto"', description: 'Right Col lg size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'rightXl', group: 'Right Col', type: 'number | "auto"', description: 'Right Col xl size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'rightXxl', group: 'Right Col', type: 'number | "auto"', description: 'Right Col xxl size.', control: 'select', options: COL_SIZE_OPTIONS },
    { name: 'rightClass', group: 'Right Col', type: 'string', description: 'Classes appended to the right Col.', control: 'text' },
];

const GRID_SYSTEM_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Content rendered inside Wrapper, Container, Row or Col.' },
    { name: 'className', type: 'string', description: 'Additional classes merged with the generated Bootstrap-like classes.' },
    { name: 'style', type: 'CSSProperties', description: 'Inline style forwarded to the rendered element.' },
    { name: 'onClick', type: 'MouseEventHandler', description: 'Click handler forwarded to the rendered element.' },
    { name: 'xs', type: 'boolean | number | "auto"', default: 'undefined', description: 'Column span for the xs breakpoint. true or undefined uses fluid .col behavior.' },
    { name: 'sm', type: 'boolean | number | "auto"', default: 'undefined', description: 'Column span for the sm breakpoint.' },
    { name: 'md', type: 'boolean | number | "auto"', default: 'undefined', description: 'Column span for the md breakpoint.' },
    { name: 'lg', type: 'boolean | number | "auto"', default: 'undefined', description: 'Column span for the lg breakpoint.' },
    { name: 'xl', type: 'boolean | number | "auto"', default: 'undefined', description: 'Column span for the xl breakpoint.' },
    { name: 'xxl', type: 'boolean | number | "auto"', default: 'undefined', description: 'Column span for the xxl breakpoint.' },
];

const normalizeCol = (value: any) => value === '' ? undefined : value === 'auto' ? 'auto' : Number(value);

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

function PlaygroundPreview({ props }: {
    props: Record<string, any>;
}) {
    return (
        <Container
            className={`rounded-md border border-dashed bg-muted/20 py-3 ${props.containerClass || ''}`}
            style={props.containerStyle && typeof props.containerStyle === 'object' ? props.containerStyle : undefined}
        >
            <div className="mb-2 font-mono text-xs font-semibold uppercase text-muted-foreground">container</div>
            <div className="rounded-md border border-dashed border-border bg-background p-3">
                <div className="mb-2 font-mono text-xs font-semibold uppercase text-muted-foreground">row</div>
                <Row
                    className={props.rowClass || undefined}
                    style={props.rowStyle && typeof props.rowStyle === 'object' ? props.rowStyle : undefined}
                >
                    <Col {...colPropsFrom(props, 'left')} className={props.leftClass || undefined}>
                        <GridCell label={props.leftLabel || 'left Col'} tone="muted" />
                    </Col>
                    <Col {...colPropsFrom(props, 'selected')} className={props.selectedClass || undefined}>
                        <GridCell label={props.selectedLabel || 'selected Col'} tone="emphasis" />
                    </Col>
                    <Col {...colPropsFrom(props, 'right')} className={props.rightClass || undefined}>
                        <GridCell label={props.rightLabel || 'right Col'} tone="muted" />
                    </Col>
                </Row>
            </div>
        </Container>
    );
}

const PLAYGROUND: PlaygroundConfig = {
    props: GRID_SYSTEM_PLAYGROUND_PROPS,
    size: 'xl',
    layout: 'split',
    defaultProps: {
        containerClass: '',
        containerStyle: {},
        rowClass: '',
        rowStyle: {},
        leftLabel: 'left col',
        leftXs: '12',
        leftSm: '',
        leftMd: '3',
        leftLg: '3',
        leftXl: '',
        leftXxl: '',
        leftClass: '',
        selectedLabel: 'selected col',
        selectedXs: '12',
        selectedSm: '',
        selectedMd: '6',
        selectedLg: '6',
        selectedXl: '',
        selectedXxl: '',
        selectedClass: '',
        rightLabel: 'right col',
        rightXs: '12',
        rightSm: '',
        rightMd: '3',
        rightLg: '3',
        rightXl: '',
        rightXxl: '',
        rightClass: '',
    },
    render: (p) => {
        return <PlaygroundPreview props={p} />;
    },
};

export default function GridSystemPage() {
    usePlayground(PLAYGROUND, 'GridSystem');

    return (
        <PageLayout title="GridSystem" description="Bootstrap-compatible layout primitives for composing responsive component demos and application screens.">
            <Section
                title="Equal-width columns"
                description="A Row creates the negative-gutter context. Unsized Col children divide the available row width equally, just like Bootstrap .col."
                preview={
                    <div className="w-full space-y-3">
                        <DemoRow label="three equal columns">
                            <Col><GridCell label="col" /></Col>
                            <Col><GridCell label="col" /></Col>
                            <Col><GridCell label="col" /></Col>
                        </DemoRow>
                        <DemoRow label="two equal columns">
                            <Col><GridCell label="col" /></Col>
                            <Col><GridCell label="col" /></Col>
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
                title="Setting one column width"
                description="Set a numeric span on one Col and leave the siblings unsized. The fixed span takes its fraction of the 12-column grid; the others share what remains."
                preview={
                    <div className="w-full space-y-3">
                        <DemoRow label="center column fixed at 6 / 12">
                            <Col><GridCell label="col" /></Col>
                            <Col xs={6}><GridCell label="xs=6" tone="emphasis" /></Col>
                            <Col><GridCell label="col" /></Col>
                        </DemoRow>
                        <DemoRow label="content and sidebar">
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
                title="Variable-width content"
                description="Use auto when a column should shrink to the width of its content. This mirrors Bootstrap's col-md-auto pattern."
                preview={
                    <div className="w-full space-y-3">
                        <DemoRow label="auto content in the middle">
                            <Col lg={2}><GridCell label="lg=2" /></Col>
                            <Col md="auto"><GridCell label="md=auto variable width content" tone="emphasis" /></Col>
                            <Col lg={2}><GridCell label="lg=2" /></Col>
                        </DemoRow>
                        <DemoRow label="auto side tools with fluid center">
                            <Col xs="auto"><GridCell label="auto" tone="emphasis" /></Col>
                            <Col><GridCell label="fluid col" /></Col>
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
                title="Responsive stack"
                description="Declare different spans per breakpoint. These columns are full width by default, split 8/4 from md, and 9/3 from xl."
                preview={
                    <DemoRow label="xs=12, md split, xl split">
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
                title="Container and Wrapper"
                description="Container adds the Bootstrap-compatible container class. Wrapper is a safe helper for conditional wrappers: without className it returns only its children."
                preview={
                    <div className="w-full space-y-4">
                        <Container className="rounded-md border border-dashed bg-muted/20 py-4">
                            <Row className="gap-y-3">
                                <Col xs={12} md={6}><GridCell label="container > row > col" /></Col>
                                <Col xs={12} md={6}><GridCell label="controlled max width" /></Col>
                            </Row>
                        </Container>
                        <Wrapper className="block rounded-md border border-dashed p-3">
                            <GridCell label="Wrapper with className renders a div" tone="muted" />
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

            <PropDocsTable props={GRID_SYSTEM_PROPS} />
        </PageLayout>
    );
}
