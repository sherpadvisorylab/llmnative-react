import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import {
    DataProviderAdapter,
    DatabaseOptions,
    ReadOptions,
    SetChunksOptions,
    RecordProps,
    RecordArray,
    WhereClause,
    OrderClause,
    Condition,
    RECORD_KEY,
} from './DataProvider';
import { getSupabaseClient, createSupabaseClient, disposeSupabaseClient, getSupabaseConfigurationState } from '../supabase-init';
import type { ProviderConfigurationState } from '../ProviderConfiguration';

// ── Config ────────────────────────────────────────────────────────────────────

export interface SupabaseDataConfig {
    url: string;
    anonKey: string;
    /**
     * Name of the primary-key column in every Supabase table.
     * Default: 'id'. Must be a text/uuid column.
     */
    primaryKey?: string;
    /**
     * Tenant-session JWT signed by the control-plane, scoped to this project.
     * When present, the adapter uses an uncached, disposable client with this
     * bearer token instead of the shared single-project client — see
     * createSupabaseClient() in supabase-init.ts.
     */
    accessToken?: string;
}

// ── Path helpers ──────────────────────────────────────────────────────────────

const normalizePath = (p: string) => p.replace(/^\/+|\/+$/g, '');

function parsePath(path: string): { table: string; id: string | null } {
    const segments = normalizePath(path).split('/').filter(Boolean);
    return {
        table: segments[0] ?? '',
        id:    segments.length >= 2 ? segments.slice(1).join('/') : null,
    };
}

// ── Error helper ──────────────────────────────────────────────────────────────

function handleError(action: string, error: unknown, exception: boolean): void {
    const message = `SupabaseDataProvider.${action}: ${error instanceof Error ? error.message : String(error)}`;
    if (exception) throw new Error(message);
    console.error(message);
}

// ── Operator mapping ──────────────────────────────────────────────────────────

type SupabaseFilterOp = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'not.in';

const OP_MAP: Record<string, SupabaseFilterOp> = {
    eq:  'eq',
    lt:  'lt',
    lte: 'lte',
    gt:  'gt',
    gte: 'gte',
    in:  'in',
    nin: 'not.in',
};

// ── Query builders ────────────────────────────────────────────────────────────

// CR-042: Supabase fluent query builder has no intermediate typed form; query chain returns opaque builder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyWhere(query: any, where: WhereClause): any {
    for (const [field, condition] of Object.entries(where)) {
        if (condition === null || condition === undefined) {
            query = query.is(field, null);
        } else if (typeof condition !== 'object' || Array.isArray(condition)) {
            query = query.eq(field, condition);
        } else {
            const cond = condition as Condition;
            if (cond.eq  !== undefined) query = query.eq(field, cond.eq);
            if (cond.lt  !== undefined) query = query.lt(field, cond.lt);
            if (cond.lte !== undefined) query = query.lte(field, cond.lte);
            if (cond.gt  !== undefined) query = query.gt(field, cond.gt);
            if (cond.gte !== undefined) query = query.gte(field, cond.gte);
            if (cond.in)  query = query.in(field, cond.in);
            if (cond.nin) query = query.not(field, 'in', cond.nin);
        }
    }
    return query;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyOrder(query: any, order: OrderClause): any {
    for (const [field, direction] of Object.entries(order)) {
        query = query.order(field, { ascending: direction === 'asc' });
    }
    return query;
}

// ── Record mapping ────────────────────────────────────────────────────────────

/**
 * Strips framework-internal fields before writing to Supabase,
 * and maps `_key` → primaryKey column.
 */
function toDbRecord(
    data: object,
    id: string | null,
    pk: string
): Record<string, any> { // CR-042: Supabase row shape is open; returned as RecordProps by caller
    const { _key, _index, ...rest } = data as any;
    if (id) rest[pk] = id;
    return rest;
}

/**
 * Adds `_key` and `_index` to a row read from Supabase.
 */
function fromDbRecord(row: Record<string, any>, pk: string, index = 0): RecordProps { // CR-042: Supabase query row has open schema
    return { ...row, [RECORD_KEY]: String(row[pk] ?? index), _index: index };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export class SupabaseDataProvider implements DataProviderAdapter {
    private config: SupabaseDataConfig;
    private get pk(): string { return this.config.primaryKey ?? 'id'; }

    // A scoped (accessToken) client is created once per instance and never shared —
    // each tenant switch produces a new SupabaseDataProvider, never mutates this one.
    private scopedClient: SupabaseClient | undefined;
    private get client(): SupabaseClient {
        if (!this.config.accessToken) return getSupabaseClient(this.config.url, this.config.anonKey);
        if (!this.scopedClient) this.scopedClient = createSupabaseClient(this.config.url, this.config.anonKey, this.config.accessToken);
        return this.scopedClient;
    }

    constructor(config: SupabaseDataConfig) {
        this.config = config;
    }

    /** Force-closes any realtime channels left open before this adapter is discarded. No-op for the shared (non-scoped) client. */
    dispose = async (): Promise<void> => {
        if (this.scopedClient) await disposeSupabaseClient(this.scopedClient);
    };

    getConfigurationState(): ProviderConfigurationState {
        return getSupabaseConfigurationState(this.config);
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    // ── read ─────────────────────────────────────────────────────────────────

    read = async (path: string, options: ReadOptions = {}): Promise<any> => {
        const { table, id } = parsePath(path);
        if (!table) return undefined;

        try {
            if (id) {
                // Single document
                const { data, error } = await this.client
                    .from(table)
                    .select('*')
                    .eq(this.pk, id)
                    .maybeSingle();

                if (error) throw error;
                if (!data) return undefined;
                return fromDbRecord(data, this.pk);
            }

            // Collection
            let query = this.client.from(table).select('*');
            if (options.where) query = applyWhere(query, options.where);
            if (options.order) query = applyOrder(query, options.order);

            const { data, error } = await query;
            if (error) throw error;
            if (!data || data.length === 0) return options.toArray ? [] : {};

            const rows = data.map((row, i) => fromDbRecord(row, this.pk, i));

            if (options.toArray) return rows;

            // Return object keyed by primary key (framework standard)
            return Object.fromEntries(rows.map((r) => [String(r[this.pk] ?? r[RECORD_KEY]), r]));
        } catch (err) {
            handleError('read', err, options.exception ?? false);
            return options.toArray ? [] : undefined;
        }
    };

    // ── set ──────────────────────────────────────────────────────────────────

    set = async (path: string, data: object, exception = false): Promise<void> => {
        const { table, id } = parsePath(path);
        if (!table) { handleError('set', 'path must include a table name', exception); return; }

        try {
            const record = toDbRecord(data, id, this.pk);
            const { error } = await this.client
                .from(table)
                .upsert(record, { onConflict: this.pk });
            if (error) throw error;
        } catch (err) {
            handleError('set', err, exception);
        }
    };

    // ── update ───────────────────────────────────────────────────────────────

    update = async (path: string, data: object, exception = false): Promise<void> => {
        const { table, id } = parsePath(path);
        if (!table) { handleError('update', 'path must include a table name', exception); return; }

        try {
            const { _key, _index, ...rest } = data as any;

            if (id) {
                // Merge existing record with partial update
                const { data: existing } = await this.client
                    .from(table)
                    .select('*')
                    .eq(this.pk, id)
                    .maybeSingle();

                const merged = { ...(existing ?? {}), ...rest, [this.pk]: id };
                const { error } = await this.client
                    .from(table)
                    .upsert(merged, { onConflict: this.pk });
                if (error) throw error;
            } else {
                // No id in path - insert as new record
                const { error } = await this.client.from(table).insert(rest);
                if (error) throw error;
            }
        } catch (err) {
            handleError('update', err, exception);
        }
    };

    // ── remove ───────────────────────────────────────────────────────────────

    remove = async (path: string, exception = false): Promise<void> => {
        const { table, id } = parsePath(path);
        if (!table || !id) {
            handleError('remove', 'path must include both table and id', exception);
            return;
        }

        try {
            const { error } = await this.client
                .from(table)
                .delete()
                .eq(this.pk, id);
            if (error) throw error;
        } catch (err) {
            handleError('remove', err, exception);
        }
    };

    // ── subscribe ─────────────────────────────────────────────────────────────

    /**
     * Real-time subscription via Supabase Postgres Changes.
     * Requires the table to have Realtime enabled in the Supabase dashboard.
     * Falls back gracefully if the channel cannot be created.
     */
    subscribe = (
        path: string | undefined,
        setRecords: (records: RecordArray) => void,
        options: DatabaseOptions = {}
    ): (() => void) => {
        if (!path) return () => undefined;
        const { table } = parsePath(path);
        if (!table) return () => undefined;

        let channel: RealtimeChannel | null = null;
        let active = true;

        const load = async () => {
            if (!active) return;
            try {
                let query = this.client.from(table).select('*');
                if (options.where) query = applyWhere(query, options.where);
                if (options.order) query = applyOrder(query, options.order);
                const { data } = await query;
                if (!active) return;
                const rows = (data ?? []).map((row, i) => fromDbRecord(row, this.pk, i));
                setRecords(rows);
            } catch {
                setRecords([]);
            }
        };

        void load();

        try {
            channel = this.client
                .channel(`llmnative:${table}`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table },
                    () => void load()
                )
                .subscribe();
        } catch {
            // Realtime not available - subscription works with initial fetch only
        }

        return () => {
            active = false;
            if (channel) {
                this.client.removeChannel(channel).catch(() => {});
                channel = null;
            }
        };
    };

    // ── count ─────────────────────────────────────────────────────────────────

    count = async (path: string): Promise<number> => {
        const { table } = parsePath(path);
        if (!table) return 0;

        try {
            const { count, error } = await this.client
                .from(table)
                .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return count ?? 0;
        } catch (err) {
            console.error('SupabaseDataProvider.count:', err);
            return 0;
        }
    };

    // ── setChunks ─────────────────────────────────────────────────────────────

    /**
     * Writes a large dataset in batches.
     * If opts.purge = true, deletes all existing rows before writing.
     */
    setChunks = async (
        path: string,
        data: object,
        opts: SetChunksOptions = {}
    ): Promise<void> => {
        const { table } = parsePath(path);
        if (!table) return;

        const { chunkSize = 500, purge = false, onProgress } = opts;
        const entries = Object.entries(data as Record<string, object>);

        try {
            if (purge) {
                // Delete all existing rows - use neq trick since Supabase requires a filter
                await this.client.from(table).delete().neq(this.pk, '__purge_all__');
            }

            for (let i = 0; i < entries.length; i += chunkSize) {
                const chunk = entries
                    .slice(i, i + chunkSize)
                    .map(([id, record]) => toDbRecord(record, id, this.pk));

                const { error } = await this.client
                    .from(table)
                    .upsert(chunk, { onConflict: this.pk });
                if (error) throw error;

                onProgress?.(
                    Math.min(i + chunkSize, entries.length),
                    entries.length,
                    `Wrote ${Math.min(i + chunkSize, entries.length)}/${entries.length}`
                );
            }
        } catch (err) {
            console.error('SupabaseDataProvider.setChunks:', err);
            throw err;
        }
    };
}
