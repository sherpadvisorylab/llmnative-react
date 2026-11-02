import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        charts: {
            page: {
                title: "Charts",
                description: "SVG charts with no dependencies: theme colours and dark mode, motion that respects reduced motion, a tooltip that follows the pointer and the keyboard, and a data table for screen readers.",
            },
            sections: {
                columns: { title: "Columns", description: "One series of buckets, with values on top and markers (a median, a percentile)." },
                stacked: { title: "Stacked columns", description: "Buckets split by series, with the total in the tooltip; an optional comparison tick." },
                lines: { title: "Lines", description: "Series over time: a null breaks the line, a dashed series compares, a threshold marks a limit." },
                areas: { title: "Stacked areas", description: "The cumulative flow of work through its stages, or the composition of a total." },
                scatter: { title: "Scatter", description: "Two quantities per point and a third as its area, coloured by series: cost against rework per agent." },
                diverging: { title: "Diverging bars", description: "Two quantities around a zero line on one scale: value above, cost below." },
                lists: { title: "Lists and figures", description: "Rankings with a trailing change, a number that counts up, a sparkline." },
                heatmaps: { title: "Heatmaps", description: "A grid of rows × columns, and a calendar of days from Monday: darker is more." },
            },
            labels: {
                otherWeek: "Other week",
                closedPerDay: "CRs closed per day",
                median: "median",
                hoursByAgent: "Hours by agent",
                leadTime: "Lead time",
                target: "target",
                thisPeriod: "This period",
                lastPeriod: "Last period",
                cumulativeFlow: "Cumulative flow",
                closed: "Closed",
                backlog: "Backlog",
                costAgainstRework: "Cost against rework",
                costPerCr: "Cost per CR",
                rework: "Rework",
                turns: "Turns",
                valueAndCost: "Value and cost",
                value: "Value",
                cost: "Cost",
                costByAgent: "Cost by agent",
                costTrend: "Cost trend",
                turnsByHour: "Turns by hour",
                turnsByDay: "Turns by day",
            },
        },
    },
});
