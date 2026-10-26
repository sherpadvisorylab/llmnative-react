/**
 * Prism loaded on demand, shared by `Code` and `ChatMarkdown`.
 *
 * The core and each language pack are imported lazily the first time they are needed, so the root
 * bundle does not carry the grammars.
 */

export const PRISM_LANGUAGES: Record<string, () => Promise<unknown>> = {
    markup: () => import('prismjs/components/prism-markup'),
    html: () => import('prismjs/components/prism-markup'),
    xml: () => import('prismjs/components/prism-markup'),
    svg: () => import('prismjs/components/prism-markup'),
    mathml: () => import('prismjs/components/prism-markup'),
    css: () => import('prismjs/components/prism-css'),
    clike: () => import('prismjs/components/prism-clike'),
    javascript: () => import('prismjs/components/prism-javascript'),
    js: () => import('prismjs/components/prism-javascript'),
    jsx: () => import('prismjs/components/prism-jsx'),
    typescript: () => import('prismjs/components/prism-typescript'),
    tsx: () => import('prismjs/components/prism-tsx'),
    json: () => import('prismjs/components/prism-json'),
    bash: () => import('prismjs/components/prism-bash'),
    shell: () => import('prismjs/components/prism-bash'),
    python: () => import('prismjs/components/prism-python'),
    java: () => import('prismjs/components/prism-java'),
    c: () => import('prismjs/components/prism-c'),
    cpp: () => import('prismjs/components/prism-cpp'),
    csharp: () => import('prismjs/components/prism-csharp'),
    go: () => import('prismjs/components/prism-go'),
    sql: () => import('prismjs/components/prism-sql'),
    php: () => import('prismjs/components/prism-php'),
    ruby: () => import('prismjs/components/prism-ruby'),
    yaml: () => import('prismjs/components/prism-yaml'),
    ini: () => import('prismjs/components/prism-ini'),
    docker: () => import('prismjs/components/prism-docker'),
    powershell: () => import('prismjs/components/prism-powershell'),
    git: () => import('prismjs/components/prism-git'),
    graphql: () => import('prismjs/components/prism-graphql'),
};

const LANGUAGE_DEPENDENCIES: Record<string, string[]> = {
    html: ['markup'],
    xml: ['markup'],
    svg: ['markup'],
    mathml: ['markup'],
    javascript: ['clike'],
    js: ['clike', 'javascript'],
    jsx: ['markup', 'clike', 'javascript'],
    typescript: ['clike', 'javascript'],
    tsx: ['markup', 'clike', 'javascript', 'jsx', 'typescript'],
    c: ['clike'],
    cpp: ['c'],
    csharp: ['clike'],
    java: ['clike'],
    php: ['markup'],
};

/** Names a fence may use for a language Prism knows under another name. */
const LANGUAGE_ALIASES: Record<string, string> = {
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    zsh: 'bash',
    console: 'bash',
    yml: 'yaml',
    dockerfile: 'docker',
    ps1: 'powershell',
    'c++': 'cpp',
    cs: 'csharp',
    'c#': 'csharp',
    golang: 'go',
    rb: 'ruby',
    gql: 'graphql',
    toml: 'ini',
    diff: 'git',
};

/** The Prism grammar name for a fence language, or `undefined` when Prism has no grammar for it. */
export function resolvePrismLanguage(language: string | undefined): string | undefined {
    if (!language) return undefined;
    const name = language.toLowerCase();
    const resolved = LANGUAGE_ALIASES[name] ?? name;
    return resolved in PRISM_LANGUAGES ? resolved : undefined;
}

export async function loadPrismLanguage(language: string, loaded = new Set<string>()): Promise<void> {
    if (loaded.has(language)) return;
    for (const dependency of LANGUAGE_DEPENDENCIES[language] ?? []) {
        if (dependency in PRISM_LANGUAGES) await loadPrismLanguage(dependency, loaded);
    }
    await PRISM_LANGUAGES[language]?.();
    loaded.add(language);
}

/** Minimal shape of the Prism object used by the framework. */
export interface PrismLike {
    languages: Record<string, unknown>;
    highlight: (code: string, grammar: unknown, language: string) => string;
    highlightElement: (element: Element) => void;
}

type PrismWindow = Window & { Prism?: Partial<PrismLike> & { manual?: boolean } };

/** Loads the Prism core (once), with the global the language packs extend. */
export async function loadPrism(): Promise<PrismLike> {
    const w = window as PrismWindow;
    // manual=true before the first import, so Prism skips its auto-highlightAll().
    if (!w.Prism?.highlightElement) w.Prism = { ...(w.Prism ?? {}), manual: true };
    const mod = await import('prismjs');
    const Prism = mod.default as unknown as PrismLike;
    // Language component scripts look for Prism on the global object.
    w.Prism = Prism;
    return Prism;
}

let prismStylesLoaded = false;

/** Loads the scoped Prism themes of `Code` (lazy, once). */
export async function ensurePrismStyles(): Promise<void> {
    if (prismStylesLoaded) return;
    prismStylesLoaded = true;
    await import('../styles/prism-themes.css');
}

/**
 * Highlights `code` as HTML (Prism escapes the text), or `null` when the language has no grammar or
 * Prism cannot load.
 */
export async function highlightCode(code: string, language: string | undefined): Promise<string | null> {
    const resolved = resolvePrismLanguage(language);
    if (!resolved) return null;
    try {
        const Prism = await loadPrism();
        await loadPrismLanguage(resolved);
        const grammar = Prism.languages[resolved];
        if (!grammar) return null;
        return Prism.highlight(code, grammar, resolved);
    } catch {
        return null;
    }
}
