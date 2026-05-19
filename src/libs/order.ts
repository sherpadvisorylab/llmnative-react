import { getRecordValue } from './utils';
import type { RecordProps } from '../providers/data/DataProvider';

export type OrderDirection = 'asc' | 'desc';

export type OrderConfig = {
    field: string;
    dir?: OrderDirection;
};

export const DEFAULT_ORDER: Required<OrderConfig> = {
    field: '',
    dir: 'asc',
};

const isDateValue = (value: unknown): value is string =>
    typeof value === 'string' && !Number.isNaN(Date.parse(value));

const comparePrimitiveValues = (a: unknown, b: unknown): number => {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return Number(a) - Number(b);
    }

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() - b.getTime();
    }

    if (isDateValue(a) && isDateValue(b)) {
        return Date.parse(a) - Date.parse(b);
    }

    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
};

export const Order = {
    normalize(order?: OrderConfig | null): Required<OrderConfig> | undefined {
        if (!order?.field) return undefined;
        return {
            field: order.field,
            dir: order.dir === 'desc' ? 'desc' : 'asc',
        };
    },

    toggle(current: OrderConfig | undefined, field: string): Required<OrderConfig> {
        if (!current || current.field !== field) {
            return { field, dir: 'asc' };
        }

        return {
            field,
            dir: current.dir === 'asc' ? 'desc' : 'asc',
        };
    },

    compareValues(a: unknown, b: unknown, dir: OrderDirection = 'asc'): number {
        const comparison = comparePrimitiveValues(a, b);
        return dir === 'desc' ? -comparison : comparison;
    },

    compareRecords<T extends RecordProps>(a: T, b: T, order: OrderConfig): number {
        const normalized = this.normalize(order);
        if (!normalized) return 0;

        const aValue = getRecordValue(a, normalized.field);
        const bValue = getRecordValue(b, normalized.field);
        return this.compareValues(aValue, bValue, normalized.dir);
    },

    records<T extends RecordProps>(records: T[] | undefined, order?: OrderConfig | null): T[] | undefined {
        if (!records) return records;

        const normalized = this.normalize(order);
        if (!normalized) return [...records];

        return [...records].sort((left, right) => this.compareRecords(left, right, normalized));
    },
};

