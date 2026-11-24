import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// CR-154 — `firebase`, `lucide-react` and `@phosphor-icons/react` are optional peers: here none is "installed".
const { missing } = vi.hoisted(() => ({
    missing: (name: string) => () => { throw new Error(`Cannot find module '${name}'`); },
}));
vi.mock('firebase/app', missing('firebase/app'));
vi.mock('firebase/auth', missing('firebase/auth'));
vi.mock('firebase/firestore', missing('firebase/firestore'));
vi.mock('firebase/database', missing('firebase/database'));
vi.mock('firebase/storage', missing('firebase/storage'));
vi.mock('lucide-react', missing('lucide-react'));
vi.mock('@phosphor-icons/react', missing('@phosphor-icons/react'));

describe('CR-154 — Firebase and the icon providers as optional peers', () => {
    it('the package imports without firebase, lucide-react and @phosphor-icons/react', async () => {
        const mod = await import('../../../src/index');
        expect(mod.FirestoreDataProvider).toBeTypeOf('function');
        expect(mod.FirebaseAuthProvider).toBeTypeOf('function');
        expect(mod.LucideIconProvider).toBeTypeOf('function');
    }, 60_000); // the whole package is transformed on the first import

    it('a Firebase provider says to install it only when used', async () => {
        const { FirestoreDataProvider } = await import('../../../src/providers/data/firestore');
        const { FirebaseDataProvider } = await import('../../../src/providers/data/firebase');
        const { FirebaseStorageProvider } = await import('../../../src/providers/storage/firebase');
        const { FirebaseAuthProvider } = await import('../../../src/providers/auth/firebase/FirebaseAuthProvider');

        await expect(new FirestoreDataProvider().read('/users', { exception: true })).rejects.toThrow('Install firebase');
        await expect(new FirebaseDataProvider().read('/users', { exception: true })).rejects.toThrow('Install firebase');
        await expect(new FirebaseStorageProvider().getURL('a.png')).resolves.toBeUndefined();

        const onError = vi.fn();
        new FirestoreDataProvider().subscribe('/users', vi.fn(), { onError });
        await vi.waitFor(() => expect(onError).toHaveBeenCalled());

        const auth = new FirebaseAuthProvider();
        expect(auth.getUser()).toBeNull();
        await expect(auth.signOut()).rejects.toThrow('Install firebase');
        const onAuth = vi.fn();
        auth.onAuthChange(onAuth);
        await vi.waitFor(() => expect(onAuth).toHaveBeenCalledWith(null));
    });

    it('without the icon package an icon keeps its place, and the app is not broken', async () => {
        const { default: Icon } = await import('../../../src/components/ui/Icon');
        const { LucideIconProvider } = await import('../../../src/providers/icon/LucideIconProvider');
        const { container } = render(<Icon name="plus" size={20} provider={new LucideIconProvider()} />);
        const placeholder = container.querySelector('[data-rf-icon-pending]') as HTMLElement;
        expect(placeholder).not.toBeNull();
        expect(placeholder.style.width).toBe('20px');
        expect(new LucideIconProvider().list()).toEqual([]);
    });
});
