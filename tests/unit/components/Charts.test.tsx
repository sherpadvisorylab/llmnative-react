import { beforeAll, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
    AnimatedNumber, AreaChart, BarList, CalendarHeatmap, ColumnChart, DivergingBarChart, Heatmap, LineChart, ScatterChart, SequenceColumnChart, Sparkline, StackedColumnChart,
    chartToken, niceMax, ticks,
} from '../../../src/components';
import { I18nProvider } from '../../../src/I18n';
import { it as italian } from '../../../src/conf/i18n';

// Reduced motion: every chart shows its final values at once.
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: (query: string) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }),
    });
});

const table = (container: HTMLElement) => container.querySelector('table.sr-only');

describe('the shared parts of the charts', () => {
    it('names colours as theme tokens, cycling the palette of eight', () => {
        expect(chartToken(undefined)).toBe('--rf-chart-1');
        expect(chartToken(3)).toBe('--rf-chart-3');
        expect(chartToken(9)).toBe('--rf-chart-1');
        expect(chartToken('--rf-success')).toBe('--rf-success');
        expect(chartToken(undefined, 4)).toBe('--rf-chart-4');
    });

    it('rounds an axis to 1, 2, 2.5 or 5 × 10ⁿ and spaces its ticks evenly', () => {
        expect(niceMax(0)).toBe(1);
        expect(niceMax(7)).toBe(10);
        expect(niceMax(180)).toBe(200);
        expect(niceMax(2300)).toBe(2500);
        expect(niceMax(4100)).toBe(5000);
        expect(ticks(0, 100)).toEqual([0, 25, 50, 75, 100]);
    });
});

describe('ColumnChart', () => {
    const columns = [{ label: 'Mon', value: 4 }, { label: 'Tue', value: 9 }, { label: 'Wed', value: 0 }];

    it('draws one column per value, names itself and gives its data as a table', () => {
        const { container } = render(<ColumnChart columns={columns} ariaLabel="CRs closed" />);
        expect(screen.getByRole('img', { name: 'CRs closed' })).toBeTruthy();
        expect(container.querySelectorAll('rect[rx="3"]')).toHaveLength(3);
        const data = table(container)!;
        expect(data.textContent).toContain('Chart data: CRs closed');
        expect(data.querySelectorAll('tbody tr')).toHaveLength(3);
        expect(data.textContent).toContain('Tue9');
    });

    it('says so when it has nothing to draw, in the language of the app', () => {
        render(<I18nProvider config={{ locale: 'it', translations: { it: italian } }}><ColumnChart columns={[]} ariaLabel="Vuoto" /></I18nProvider>);
        expect(screen.getByText('Nessun dato')).toBeTruthy();
    });

    it('shows the tooltip of a column to the keyboard, and clicks', () => {
        let clicked = '';
        render(<ColumnChart columns={columns} ariaLabel="CRs closed" format={(value) => `${value} CR`} onColumnClick={(column) => { clicked = column.label; }} />);
        const tuesday = screen.getByRole('img', { name: 'Tue: CRs closed 9 CR' });
        fireEvent.focus(tuesday);
        expect(screen.getByRole('tooltip').textContent).toContain('9 CR');
        fireEvent.blur(tuesday);
        expect(screen.queryByRole('tooltip')).toBeNull();
        fireEvent.click(tuesday);
        expect(clicked).toBe('Tue');
    });
});

describe('the stacked charts', () => {
    const series = [{ id: 'dev', label: 'Developer', values: [2, 3] }, { id: 'qa', label: 'Tester', values: [1, 0] }];

    it('StackedColumnChart: a segment per series with a value, the totals in its table', () => {
        const { container } = render(<StackedColumnChart series={series} labels={['W1', 'W2']} ariaLabel="Hours by agent" />);
        expect(container.querySelector('figcaption')!.textContent).toBe('DeveloperTester');
        const data = table(container)!;
        expect(data.querySelector('thead')!.textContent).toBe('DeveloperTesterTotal');
        expect([...data.querySelectorAll('tbody tr')].map((row) => row.textContent)).toEqual(['W1213', 'W2303']);
    });

    it('AreaChart: one area per series, stacked, and the total at each point', () => {
        const { container } = render(<AreaChart series={series} labels={['Mon', 'Tue']} ariaLabel="Cumulative flow" />);
        expect(container.querySelectorAll('path[d$="Z"]')).toHaveLength(2);
        expect([...table(container)!.querySelectorAll('tbody tr')].map((row) => row.textContent)).toEqual(['Mon213', 'Tue303']);
    });

    it('DivergingBarChart: values above and below the zero line, no data as a dash', () => {
        const { container } = render(<DivergingBarChart bars={[{ label: 'Mon', up: 5, down: 3 }, { label: 'Tue', up: null, down: 2 }]} upLabel="Income" downLabel="Costs" ariaLabel="Balance" />);
        expect([...table(container)!.querySelectorAll('tbody tr')].map((row) => row.textContent)).toEqual(['Mon53', 'Tue—2']);
    });
});

describe('LineChart', () => {
    it('breaks a line where a value is missing, and dashes a comparison', () => {
        const { container } = render(
            <LineChart
                ariaLabel="Lead time"
                labels={['1', '2', '3', '4', '5']}
                series={[
                    { id: 'now', label: 'This month', values: [3, 4, null, 5, 6] },
                    { id: 'before', label: 'Last month', values: [2, 2, 2, 2, 2], dashed: true },
                ]}
            />,
        );
        // Two runs for the first series, one for the comparison.
        expect(container.querySelectorAll('path[fill="none"]')).toHaveLength(3);
        expect(container.querySelector('path[stroke-dasharray="5 4"]')).toBeTruthy();
        expect(table(container)!.textContent).toContain('3—2');
    });
});

describe('ScatterChart', () => {
    it('fits its axes to small values (cents, fractions), not to 1 at least', () => {
        const { container } = render(<ScatterChart ariaLabel="Small" xLabel="Cost" yLabel="Rework" formatX={(v) => `$${v.toFixed(2)}`} formatY={(v) => `${Math.round(v * 100)}%`} points={[{ id: 'a', label: 'A', x: 0.04, y: 0.2 }, { id: 'b', label: 'B', x: 0.11, y: 0.05 }]} />);
        const texts = [...container.querySelectorAll('svg text')].map((text) => text.textContent);
        // 0.11 × 1.05 → 0.20; 0.2 × 1.05 → 0.25.
        expect(texts).toContain('$0.20');
        expect(texts).toContain('25%');
        expect(texts).not.toContain('$1.00');
    });

    it('places a point per item, sized by the third quantity, labelled when few', () => {
        const { container } = render(
            <ScatterChart
                ariaLabel="Cost against rework"
                xLabel="Cost" yLabel="Rework" sizeLabel="Turns"
                series={[{ id: 'a', label: 'Sonnet' }, { id: 'b', label: 'Flash' }]}
                points={[{ id: '1', label: 'Developer', x: 2, y: 0.3, size: 10, series: 'a' }, { id: '2', label: 'Tester', x: 0.5, y: 0.1, size: 40, series: 'b' }]}
            />,
        );
        const circles = [...container.querySelectorAll('circle')];
        expect(circles).toHaveLength(2);
        expect(Number(circles[1]!.getAttribute('r'))).toBeGreaterThan(Number(circles[0]!.getAttribute('r')));
        expect([...container.querySelectorAll('svg text')].some((text) => text.textContent === 'Developer')).toBe(true);
        expect(table(container)!.querySelector('thead')!.textContent).toBe('CostReworkTurns');
    });
});

describe('the lists and grids', () => {
    it('BarList: a bar per row with its value and its trailing note', () => {
        render(<BarList ariaLabel="Cost by agent" rows={[{ id: 'd', label: 'Developer', value: 3.5, trailing: { text: '+12%', tone: 'bad' } }, { id: 'r', label: 'Reviewer', value: 1 }]} format={(value) => `$${value}`} />);
        expect(screen.getAllByText('$3.5').length).toBeGreaterThan(0);
        expect(screen.getByText('+12%')).toBeTruthy();
    });

    it('Heatmap: one cell per row and column', () => {
        const { container } = render(<Heatmap ariaLabel="Turns by hour" rowLabels={['Mon', 'Tue']} columnLabels={['9', '10', '11']} values={[[1, 2, 3], [0, 0, 5]]} />);
        expect(container.querySelectorAll('svg rect')).toHaveLength(6);
    });

    it('CalendarHeatmap: a square per day from the first, weeks from Monday, a scale from less to more', () => {
        // 2026-11-04 is a Wednesday: its week starts on Monday the 2nd, left empty.
        const days = [{ date: '2026-11-04', value: 2 }, { date: '2026-11-05', value: null }, { date: '2026-11-09', value: 8 }];
        const { container } = render(<CalendarHeatmap ariaLabel="Turns by day" days={days} />);
        // From Wednesday 4 to Monday 9: six days drawn.
        expect(container.querySelectorAll('svg rect')).toHaveLength(6);
        expect(screen.getByText('Less')).toBeTruthy();
        expect(screen.getByText('More')).toBeTruthy();
    });

    it('Sparkline: decorative without a label, an image with one', () => {
        const { container, rerender } = render(<Sparkline values={[1, 3, null, 2]} />);
        expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
        rerender(<Sparkline values={[1, 3, null, 2]} ariaLabel="Cost trend" />);
        expect(screen.getByRole('img', { name: 'Cost trend' })).toBeTruthy();
    });

    it('AnimatedNumber: ends on the value, formatted', () => {
        render(<AnimatedNumber value={1234.5} format={(value) => `${value.toFixed(1)} h`} />);
        expect(screen.getByText('1234.5 h')).toBeTruthy();
    });
});

describe('SequenceColumnChart', () => {
    const series = [{ id: 'architect', label: 'Architect' }, { id: 'developer', label: 'Developer' }, { id: 'reviewer', label: 'Reviewer' }];
    const columns = [
        // A rework: the developer and the reviewer come back, each a segment of its own, in order.
        { label: '#38', title: 'CR #38', segments: [{ series: 'architect', value: 4 }, { series: 'developer', value: 12 }, { series: 'reviewer', value: 3 }, { series: 'developer', value: 8 }, { series: 'reviewer', value: 2 }] },
        { label: '#41', segments: [{ series: 'developer', value: 10 }, { series: 'reviewer', value: 0 }] },
    ];

    it('keeps the order of each column, a series coming back as a segment of its own, of its colour', () => {
        const { container } = render(<SequenceColumnChart series={series} columns={columns} ariaLabel="Minutes per CR" format={(value) => `${value} min`} />);
        const first = [...container.querySelectorAll('[data-rf-sequence-column="0"] [data-rf-sequence-segment]')].map((rect) => rect.getAttribute('data-rf-sequence-segment'));
        expect(first).toEqual(['--rf-chart-1', '--rf-chart-2', '--rf-chart-3', '--rf-chart-2', '--rf-chart-3']);
        // A segment of nothing is not drawn.
        expect(container.querySelectorAll('[data-rf-sequence-column="1"] [data-rf-sequence-segment]')).toHaveLength(1);
        const rows = [...table(container)!.querySelectorAll('tbody tr')].map((row) => row.textContent);
        expect(rows[0]).toBe('CR #38Architect 4 min → Developer 12 min → Reviewer 3 min → Developer 8 min → Reviewer 2 min29 min');
    });

    it('tells the sequence in its tooltip, numbered, and clicks', () => {
        let clicked = '';
        render(<SequenceColumnChart series={series} columns={columns} ariaLabel="Minutes per CR" format={(value) => `${value} min`} onColumnClick={(column) => { clicked = column.label; }} />);
        const column = screen.getByRole('img', { name: /^CR #38 · Total 29 min: 1\. Architect 4 min, 2\. Developer 12 min/ });
        fireEvent.focus(column);
        expect(screen.getByRole('tooltip').textContent).toContain('4. Developer');
        fireEvent.click(column);
        expect(clicked).toBe('#38');
    });
});
