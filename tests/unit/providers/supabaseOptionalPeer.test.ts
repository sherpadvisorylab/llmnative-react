import { describe, expect, it, vi } from 'vitest';

// CR-153 — `@supabase/supabase-js` is an optional peer: here it is "not installed" (loading it throws).
vi.mock('@supabase/supabase-js', () => {
    throw new Error("Cannot find module '@supabase/supabase-js'");
});

describe('CR-153 — Supabase SDK as an optional peer', () => {
    it('the package imports without the Supabase SDK', async () => {
        const mod = await import('../../../src/index');
        expect(mod.SupabaseDataProvider).toBeTypeOf('function');
        expect(mod.SupabaseAuthProvider).toBeTypeOf('function');
    }, 60_000); // the whole package is transformed on the first import

    it('says to install it only when a Supabase client is needed', async () => {
        const { getSupabaseClient } = await import('../../../src/providers/supabase-init');
        await expect(getSupabaseClient('https://x.supabase.co', 'key')).rejects.toThrow('Install @supabase/supabase-js');
    });

    it('a provider reports the missing SDK through its own errors, not at construction', async () => {
        const { SupabaseDataProvider } = await import('../../../src/providers/data/supabase');
        const { SupabaseAuthProvider } = await import('../../../src/providers/auth/supabase/SupabaseAuthProvider');

        const data = new SupabaseDataProvider({ url: 'https://x.supabase.co', anonKey: 'key' });
        await expect(data.read('/users', { exception: true })).rejects.toThrow('Install @supabase/supabase-js');
        const onError = vi.fn();
        data.subscribe('/users', vi.fn(), { onError });
        await vi.waitFor(() => expect(onError).toHaveBeenCalled());

        const auth = new SupabaseAuthProvider({ url: 'https://x.supabase.co', anonKey: 'key' });
        expect(auth.getUser()).toBeNull();
        await expect(auth.signOut()).rejects.toThrow('Install @supabase/supabase-js');
    });
});
