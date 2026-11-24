/**
 * CR-154 — a package that is an optional peer, loaded with a dynamic import the first time it is needed, never when
 * `@llmnative/react` is imported: an app without it imports the package in the browser and in Node (Vitest, SSR,
 * scripts). Once loaded the module is kept, so the code that uses it can go back to being synchronous (`peek`).
 */
export interface LazyModule<M> {
    /** Loads the module (once; again after a failure, e.g. the package installed later). */
    load(): Promise<M>;
    /** The module when already loaded, else `undefined`. */
    peek(): M | undefined;
    /** The module, or the "install it" error when it is not loaded yet. */
    get(): M;
    /** A function of the module, called on the loaded module: same signature, throws until it is loaded. */
    fn<K extends keyof M>(name: K): M[K];
}

/**
 * @param importer `() => import('pkg')`, with the literal name so that bundlers see it.
 * @param missing the message when the package is not installed (also when Vite gives the empty module of a missing
 *   optional peer: no export but `default`).
 */
export function lazyModule<M extends object>(importer: () => Promise<M>, missing: string): LazyModule<M> {
    let loaded: M | undefined;
    let pending: Promise<M> | undefined;

    const load = (): Promise<M> => {
        if (loaded) return Promise.resolve(loaded);
        pending ??= importer().then(
            (mod) => {
                if (!mod || !Object.keys(mod).some((key) => key !== 'default')) throw new Error(missing);
                loaded = mod;
                return mod;
            },
            (cause: unknown) => { throw new Error(missing, { cause }); },
        ).catch((error: unknown) => {
            pending = undefined;
            throw error;
        });
        return pending;
    };

    const get = (): M => {
        if (!loaded) throw new Error(`${missing} (not loaded yet: await its load() first)`);
        return loaded;
    };

    return {
        load,
        peek: () => loaded,
        get,
        fn: <K extends keyof M>(name: K) => ((...args: unknown[]) =>
            (get()[name] as unknown as (...a: unknown[]) => unknown)(...args)) as unknown as M[K],
    };
}
