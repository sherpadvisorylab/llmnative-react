import React from 'react';
import { Col, Container, Row, Wrapper } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const GRID_SYSTEM_PROPS: PropDef[] = [
    { name: 'component', type: '"Wrapper" | "Container" | "Row" | "Col"', required: true, description: 'Grid system component to preview', control: 'select', options: ['Wrapper', 'Container', 'Row', 'Col'] },
    { name: 'children', type: 'ReactNode', description: 'Nested content' },
    { name: 'className', type: 'string', description: 'CSS classes added to the selected component', control: 'text' },
    { name: 'style', type: 'CSSProperties', description: 'Inline styles', control: 'json' },
    { name: 'onClick', type: '() => void', description: 'Click handler supported by Wrapper only' },
    { name: 'xs', type: 'number | "auto"', description: 'Col size at xs breakpoint', control: 'select', options: ['', 'auto', '1', '2', '3', '4', '6', '12'] },
    { name: 'sm', type: 'number | "auto"', description: 'Col size at sm breakpoint', control: 'select', options: ['', 'auto', '1', '2', '3', '4', '6', '12'] },
    { name: 'md', type: 'number | "auto"', description: 'Col size at md breakpoint', control: 'select', options: ['', 'auto', '1', '2', '3', '4', '6', '12'] },
    { name: 'lg', type: 'number | "auto"', description: 'Col size at lg breakpoint', control: 'select', options: ['', 'auto', '1', '2', '3', '4', '6', '12'] },
    { name: 'xl', type: 'number | "auto"', description: 'Col size at xl breakpoint', control: 'select', options: ['', 'auto', '1', '2', '3', '4', '6', '12'] },
    { name: 'xxl', type: 'number | "auto"', description: 'Col size at xxl breakpoint', control: 'select', options: ['', 'auto', '1', '2', '3', '4', '6', '12'] },
];

const normalizeCol = (value: any) => value === '' ? undefined : value === 'auto' ? 'auto' : Number(value);

const PLAYGROUND: PlaygroundConfig = {
    props: GRID_SYSTEM_PROPS,
    defaultProps: {
        component: 'Row',
        className: 'rounded-md border bg-muted/40 p-3',
        style: {},
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
        xxl: '',
    },
    render: (p) => {
        const content = <div className="rounded bg-primary/10 px-3 py-2 text-sm">Grid content</div>;
        if (p.component === 'Wrapper') return <Wrapper className={p.className} style={p.style}>{content}</Wrapper>;
        if (p.component === 'Container') return <Container className={p.className} style={p.style}>{content}</Container>;
        if (p.component === 'Col') {
            return <Col className={p.className} style={p.style} xs={normalizeCol(p.xs)} sm={normalizeCol(p.sm)} md={normalizeCol(p.md)} lg={normalizeCol(p.lg)} xl={normalizeCol(p.xl)} xxl={normalizeCol(p.xxl)}>{content}</Col>;
        }
        return <Row className={p.className} style={p.style}><Col xs={6}>{content}</Col><Col xs={6}>{content}</Col></Row>;
    },
};

export default function GridSystemPage() {
    usePlayground(PLAYGROUND, 'GridSystem');

    return (
        <PageLayout title="GridSystem" description="Bootstrap-compatible layout helpers: Wrapper, Container, Row and Col.">
            <Section
                title="Responsive columns"
                preview={<Row className="gap-2"><Col xs={6} className="rounded bg-primary/10 p-3">xs=6</Col><Col xs={6} className="rounded bg-primary/10 p-3">xs=6</Col></Row>}
                code={`import { Col, Row } from 'react-firestrap';

<Row>
    <Col xs={6}>Left</Col>
    <Col xs={6}>Right</Col>
</Row>`}
            />

            <PropsTable props={GRID_SYSTEM_PROPS} />
        </PageLayout>
    );
}
