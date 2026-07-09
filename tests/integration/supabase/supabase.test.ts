import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const CLIENT_OPTS = { realtime: { transport: WebSocket } };

function dbQuery(sql: string) {
    const tmpFile = join(mkdtempSync(join(tmpdir(), 'supatest-')), 'query.sql');
    writeFileSync(tmpFile, sql, 'utf-8');
    execSync(`"${join(require('os').homedir(), '.local', 'bin', 'supabase.exe')}" db query --local --file "${tmpFile}"`, {
        stdio: 'pipe',
        timeout: 15000,
    });
}

let supabase: SupabaseClient;
let adminClient: SupabaseClient;

const TEST_TABLE = 'integration_test_items';

beforeAll(() => {
    dbQuery([
        `CREATE TABLE IF NOT EXISTS public.${TEST_TABLE} (`,
        `    id BIGSERIAL PRIMARY KEY,`,
        `    title TEXT NOT NULL,`,
        `    status TEXT DEFAULT 'active',`,
        `    created_at TIMESTAMPTZ DEFAULT NOW()`,
        `)`,
    ].join('\n'));
    dbQuery(`ALTER TABLE public.${TEST_TABLE} ENABLE ROW LEVEL SECURITY`);
    dbQuery(`DROP POLICY IF EXISTS anon_all ON public.${TEST_TABLE}`);
    dbQuery(`CREATE POLICY anon_all ON public.${TEST_TABLE} FOR ALL TO anon USING (true) WITH CHECK (true)`);
    dbQuery(`GRANT SELECT, INSERT, UPDATE, DELETE ON public.${TEST_TABLE} TO anon, authenticated, service_role`);
    dbQuery(`GRANT USAGE ON SEQUENCE public.${TEST_TABLE}_id_seq TO anon, authenticated, service_role`);

    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, CLIENT_OPTS);
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, CLIENT_OPTS);
});

afterAll(() => {
    dbQuery(`DROP TABLE IF EXISTS public.${TEST_TABLE} CASCADE`);
});

describe('Supabase Database CRUD', () => {
    it('inserts a record', async () => {
        const { data, error } = await supabase
            .from(TEST_TABLE)
            .insert({ title: 'Test Item', status: 'active' })
            .select()
            .single();
        expect(error).toBeNull();
        expect(data?.title).toBe('Test Item');
        expect(data?.status).toBe('active');
        expect(data?.id).toBeGreaterThan(0);
    });

    it('reads records', async () => {
        await adminClient.from(TEST_TABLE).delete().neq('id', 0);
        await adminClient.from(TEST_TABLE).insert([
            { title: 'Item A', status: 'active' },
            { title: 'Item B', status: 'inactive' },
            { title: 'Item C', status: 'active' },
        ]);

        const { data, error } = await supabase
            .from(TEST_TABLE)
            .select('*')
            .order('id', { ascending: true });
        expect(error).toBeNull();
        expect(data).toHaveLength(3);
        expect(data![0].title).toBe('Item A');
        expect(data![2].title).toBe('Item C');
    });

    it('updates a record', async () => {
        const { data: inserted } = await adminClient
            .from(TEST_TABLE)
            .insert({ title: 'Original Title', status: 'draft' })
            .select()
            .single();
        expect(inserted).not.toBeNull();

        const { data, error } = await supabase
            .from(TEST_TABLE)
            .update({ title: 'Updated Title' })
            .eq('id', inserted!.id)
            .select()
            .single();
        expect(error).toBeNull();
        expect(data?.title).toBe('Updated Title');
        expect(data?.status).toBe('draft');
    });

    it('deletes a record', async () => {
        const { data: inserted } = await adminClient
            .from(TEST_TABLE)
            .insert({ title: 'To Delete', status: 'active' })
            .select()
            .single();
        expect(inserted).not.toBeNull();

        const { error } = await supabase
            .from(TEST_TABLE)
            .delete()
            .eq('id', inserted!.id);
        expect(error).toBeNull();

        const { data } = await supabase
            .from(TEST_TABLE)
            .select('*')
            .eq('id', inserted!.id);
        expect(data).toHaveLength(0);
    });
});

describe('Supabase Auth', () => {
    const TEST_EMAIL = `test-${Date.now()}@example.com`;
    const TEST_PASSWORD = 'TestPass123!';

    it('signs up a new user', async () => {
        const { data, error } = await supabase.auth.signUp({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        expect(error).toBeNull();
        expect(data.user?.email).toBe(TEST_EMAIL);
    });

    it('signs in with email and password', async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        expect(error).toBeNull();
        expect(data.user?.email).toBe(TEST_EMAIL);
        expect(data.session).not.toBeNull();
    });

    it('gets the current user', async () => {
        const { data, error } = await supabase.auth.getUser();
        expect(error).toBeNull();
        expect(data.user?.email).toBe(TEST_EMAIL);
    });

    it('signs out', async () => {
        const { error } = await supabase.auth.signOut();
        expect(error).toBeNull();
        const { data } = await supabase.auth.getUser();
        expect(data.user).toBeNull();
    });
});
