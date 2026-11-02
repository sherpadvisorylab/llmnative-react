import React from 'react';
import {
    AnimatedNumber, AreaChart, BarList, CalendarHeatmap, ColumnChart, DivergingBarChart, Heatmap, LineChart, ScatterChart, Sparkline, StackedColumnChart,
} from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import { useShowcaseChartsI18n } from '../../showcase/i18n';

// Example data: the work of a few agents over two weeks.
const DAYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
const DEVELOPER = [3, 4, 2, 5, 6, 3, 1, 4, 5, 7, 6, 4, 2, 5];
const REVIEWER = [1, 2, 1, 2, 3, 1, 1, 2, 2, 3, 2, 2, 1, 2];
const TESTER = [1, 1, 1, 2, 2, 1, 0, 1, 2, 2, 3, 1, 1, 2];
const hours = (value: number) => `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} h`;
const dollars = (value: number) => `$${value.toFixed(2)}`;
const calendar = Array.from({ length: 84 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 3 + index));
    return { date: date.toISOString().slice(0, 10), value: index % 7 > 4 ? null : (index * 37) % 9 };
});

export default function ChartsPage() {
    const t = useShowcaseChartsI18n();
    const [week, setWeek] = React.useState(0);
    const slice = (values: number[]) => values.slice(week * 7, week * 7 + 7);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.columns.title}
                description={t.sections.columns.description}
                preview={(
                    <div className="space-y-3">
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setWeek((current) => 1 - current)}>{t.labels.otherWeek}</button>
                        <ColumnChart
                            ariaLabel={t.labels.closedPerDay}
                            columns={slice(DEVELOPER).map((value, index) => ({ label: DAYS[week * 7 + index]!, value }))}
                            markers={[{ position: 3.5, label: t.labels.median, dashed: true }]}
                        />
                    </div>
                )}
                code={`<ColumnChart
  ariaLabel="CRs closed per day"
  columns={days.map((day) => ({ label: day.label, value: day.closed }))}
  markers={[{ position: 3.5, label: 'median', dashed: true }]}
/>`}
            />
            <Section
                title={t.sections.stacked.title}
                description={t.sections.stacked.description}
                preview={(
                    <StackedColumnChart
                        ariaLabel={t.labels.hoursByAgent}
                        labels={DAYS}
                        labelEvery={2}
                        format={hours}
                        series={[
                            { id: 'developer', label: 'Developer', values: DEVELOPER },
                            { id: 'reviewer', label: 'Reviewer', values: REVIEWER },
                            { id: 'tester', label: 'Tester', values: TESTER },
                        ]}
                    />
                )}
                code={`<StackedColumnChart
  ariaLabel="Hours by agent"
  labels={days}
  format={(value) => \`\${value} h\`}
  series={[
    { id: 'developer', label: 'Developer', values: developer },
    { id: 'reviewer', label: 'Reviewer', values: reviewer },
  ]}
/>`}
            />
            <Section
                title={t.sections.lines.title}
                description={t.sections.lines.description}
                preview={(
                    <LineChart
                        ariaLabel={t.labels.leadTime}
                        labels={DAYS}
                        labelEvery={2}
                        format={hours}
                        threshold={{ value: 6.5, label: t.labels.target }}
                        series={[
                            { id: 'now', label: t.labels.thisPeriod, values: DEVELOPER.map((value, index) => (index === 6 ? null : value)), area: true },
                            { id: 'before', label: t.labels.lastPeriod, values: REVIEWER.map((value) => value * 2), dashed: true },
                        ]}
                    />
                )}
                code={`<LineChart
  ariaLabel="Lead time"
  labels={days}
  threshold={{ value: 6.5, label: 'target' }}
  series={[
    { id: 'now', label: 'This period', values: leadTimes, area: true },   // null breaks the line
    { id: 'before', label: 'Last period', values: previous, dashed: true },
  ]}
/>`}
            />
            <Section
                title={t.sections.areas.title}
                description={t.sections.areas.description}
                preview={(
                    <AreaChart
                        ariaLabel={t.labels.cumulativeFlow}
                        labels={DAYS}
                        labelEvery={2}
                        series={[
                            { id: 'closed', label: t.labels.closed, values: DAYS.map((_, index) => index * 2) },
                            { id: 'test', label: 'Tester', values: TESTER },
                            { id: 'dev', label: 'Developer', values: DEVELOPER },
                            { id: 'backlog', label: t.labels.backlog, values: DAYS.map((_, index) => 30 - index * 2) },
                        ]}
                    />
                )}
                code={`<AreaChart
  ariaLabel="Cumulative flow"
  labels={days}
  series={[
    { id: 'closed', label: 'Closed', values: closed },
    { id: 'dev', label: 'Developer', values: inDevelopment },
    { id: 'backlog', label: 'Backlog', values: backlog },
  ]}
/>`}
            />
            <Section
                title={t.sections.scatter.title}
                description={t.sections.scatter.description}
                preview={(
                    <ScatterChart
                        ariaLabel={t.labels.costAgainstRework}
                        xLabel={t.labels.costPerCr}
                        yLabel={t.labels.rework}
                        sizeLabel={t.labels.turns}
                        formatX={dollars}
                        formatY={(value) => `${Math.round(value * 100)}%`}
                        series={[{ id: 'sonnet', label: 'Sonnet' }, { id: 'flash', label: 'Flash' }]}
                        points={[
                            { id: '1', label: 'Analyst', x: 0.08, y: 0.05, size: 12, series: 'sonnet' },
                            { id: '2', label: 'Architect', x: 0.14, y: 0.1, size: 9, series: 'sonnet' },
                            { id: '3', label: 'Developer', x: 0.04, y: 0.3, size: 30, series: 'flash' },
                            { id: '4', label: 'Reviewer', x: 0.02, y: 0.12, size: 25, series: 'flash' },
                            { id: '5', label: 'Tester', x: 0.03, y: 0.08, size: 18, series: 'flash' },
                        ]}
                    />
                )}
                code={`<ScatterChart
  ariaLabel="Cost against rework"
  xLabel="Cost per CR" yLabel="Rework" sizeLabel="Turns"
  series={[{ id: 'sonnet', label: 'Sonnet' }, { id: 'flash', label: 'Flash' }]}
  points={agents.map((agent) => ({ id: agent.id, label: agent.name, x: agent.cost, y: agent.rework, size: agent.turns, series: agent.model }))}
/>`}
            />
            <Section
                title={t.sections.diverging.title}
                description={t.sections.diverging.description}
                preview={(
                    <DivergingBarChart
                        ariaLabel={t.labels.valueAndCost}
                        upLabel={t.labels.value}
                        downLabel={t.labels.cost}
                        format={dollars}
                        bars={DAYS.slice(0, 10).map((label, index) => ({ label, up: index === 4 ? null : DEVELOPER[index]! * 40, down: REVIEWER[index]! * 3 }))}
                    />
                )}
                code={`<DivergingBarChart
  ariaLabel="Value and cost"
  upLabel="Value" downLabel="Cost"
  bars={days.map((day) => ({ label: day.label, up: day.value, down: day.cost }))}   // null: no data
/>`}
            />
            <Section
                title={t.sections.lists.title}
                description={t.sections.lists.description}
                preview={(
                    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                        <BarList
                            ariaLabel={t.labels.costByAgent}
                            format={dollars}
                            rows={[
                                { id: 'dev', label: 'Developer', value: 1.84, trailing: { text: '+12%', tone: 'bad' } },
                                { id: 'arch', label: 'Architect', value: 0.92, trailing: { text: '−4%', tone: 'good' } },
                                { id: 'rev', label: 'Reviewer', value: 0.61, trailing: { text: '0%', tone: 'neutral' } },
                                { id: 'test', label: 'Tester', value: 0.48, trailing: { text: '+2%', tone: 'bad' } },
                            ]}
                        />
                        <div className="space-y-1 rounded-lg border border-border p-3">
                            <p className="text-xs text-muted-foreground">{t.labels.cost}</p>
                            <p className="text-2xl font-semibold tabular-nums"><AnimatedNumber value={3.85} format={dollars} /></p>
                            <Sparkline values={[0.4, 0.6, 0.5, null, 0.9, 1.1, 0.8]} ariaLabel={t.labels.costTrend} />
                        </div>
                    </div>
                )}
                code={`<BarList ariaLabel="Cost by agent" rows={rows} format={(value) => \`$\${value}\`} />

<AnimatedNumber value={3.85} format={(value) => \`$\${value.toFixed(2)}\`} />
<Sparkline values={[0.4, 0.6, 0.5, null, 0.9]} ariaLabel="Cost trend" />`}
            />
            <Section
                title={t.sections.heatmaps.title}
                description={t.sections.heatmaps.description}
                preview={(
                    <div className="space-y-6">
                        <Heatmap
                            ariaLabel={t.labels.turnsByHour}
                            rowLabels={['Analyst', 'Architect', 'Developer', 'Reviewer', 'Tester']}
                            columnLabels={Array.from({ length: 12 }, (_, hour) => `${hour + 8}`)}
                            columnLabelEvery={2}
                            values={[0, 1, 2, 3, 4].map((row) => Array.from({ length: 12 }, (_, hour) => ((row + 2) * (hour + 3)) % 7))}
                        />
                        <CalendarHeatmap ariaLabel={t.labels.turnsByDay} days={calendar} />
                    </div>
                )}
                code={`<Heatmap ariaLabel="Turns by hour" rowLabels={agents} columnLabels={hours} values={turns} />

<CalendarHeatmap ariaLabel="Turns by day" days={[{ date: '2026-11-02', value: 4 }, /* … */]} />`}
            />
        </PageLayout>
    );
}
