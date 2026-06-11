import React, { useState } from 'react';
import { Code } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const LANGUAGES = [
    'markup',
    'html',
    'css',
    'javascript',
    'js',
    'jsx',
    'typescript',
    'tsx',
    'json',
    'bash',
    'powershell',
    'python',
    'sql',
    'yaml',
    'graphql',
];

const THEMES = ['prism', 'dark', 'coy', 'funky', 'okaidia', 'solarizedlight', 'tomorrow', 'twilight'];
const BACKGROUNDS = ['default', 'transparent', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'white', 'black'];

const SAMPLE_TSX = `import { Code } from '@llmnative/react';

export function Example() {
  return (
    <Code language="tsx" theme="tomorrow" showCopy>
      {\`const total = rows.reduce((sum, row) => sum + row.amount, 0);\`}
    </Code>
  );
}`;

const SAMPLE_JSON = `{
  "name": "@llmnative/react",
  "component": "Code",
  "features": ["syntax highlight", "copy", "theme"]
}`;

const SAMPLE_BASH = `npm install @llmnative/react
npm run build`;

const CODE_PROPS: PropDef[] = [
    {
        name: 'children',
        type: 'string',
        required: true,
        description: 'Code text rendered inside the block',
        control: 'textarea',
        rows: 10,
        shortcuts: [
            { label: 'tsx', value: SAMPLE_TSX, help: 'Component example in TSX.' },
            { label: 'json', value: SAMPLE_JSON, help: 'JSON payload snippet.' },
            { label: 'bash', value: SAMPLE_BASH, help: 'CLI install commands.' },
        ],
    },
    { name: 'language', type: 'PrismLanguage', default: '"tsx"', description: 'Prism language used for syntax highlighting', control: 'select', options: LANGUAGES },
    { name: 'showCopy', type: 'boolean', default: 'true', description: 'Shows the copy-to-clipboard action', control: 'boolean' },
    { name: 'theme', type: 'PrismTheme', default: '"tomorrow"', description: 'Prism theme stylesheet loaded for the block', control: 'select', options: THEMES },
    { name: 'background', type: 'PrismBackground', default: '"default"', description: 'Optional background utility applied to the pre element', control: 'select', options: BACKGROUNDS },
    { name: 'before', type: 'ReactNode', description: 'Content rendered to the left of the code block, vertically centered', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered to the right of the code block, vertically centered', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes applied to the wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the pre element', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: CODE_PROPS,
    defaultProps: {
        children: SAMPLE_TSX,
        language: 'tsx',
        showCopy: true,
        theme: 'tomorrow',
        background: 'default',
        before: '',
        after: '',
        wrapperClassName: '',
        className: '',
    },
    render: (p) => (
        <Code
            language={p.language}
            showCopy={p.showCopy}
            theme={p.theme}
            background={p.background}
            before={p.before || undefined}
            after={p.after || undefined}
            wrapperClassName={p.wrapperClassName || undefined}
            className={p.className || undefined}
        >
            {p.children}
        </Code>
    ),
};

export default function CodePage() {
    usePlayground(PLAYGROUND, 'Code');
    const [activeTheme, setActiveTheme] = useState<string>('tomorrow');

    return (
        <PageLayout
            title="Code"
            description="Syntax highlighted code block powered by Prism, with optional copy action, language loading and theme selection."
        >
            <Section
                title="TSX block"
                description="Use Code for examples, snippets and generated source previews."
                preview={
                    <div className="w-full">
                        <Code language="tsx" theme="tomorrow" className="rounded-md border border-border p-4 text-sm">
                            {SAMPLE_TSX}
                        </Code>
                    </div>
                }
                code={`import { Code } from '@llmnative/react';

<Code language="tsx" theme="tomorrow">
  {source}
</Code>`}
            />

            <Section
                title="Languages"
                description="The component lazy-loads the Prism grammar for the selected language."
                preview={
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Code language="json" theme="tomorrow" className="rounded-md border border-border p-4 text-sm">
                            {SAMPLE_JSON}
                        </Code>
                        <Code language="bash" theme="tomorrow" className="rounded-md border border-border p-4 text-sm">
                            {SAMPLE_BASH}
                        </Code>
                    </div>
                }
                code={`<Code language="json">{json}</Code>
<Code language="bash">{command}</Code>`}
            />

            <Section
                title="Themes and copy"
                description="Click a theme to preview it. showCopy controls the clipboard button."
                preview={
                    <div className="space-y-4 w-full">
                        <div className="flex flex-wrap gap-2">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => setActiveTheme(theme)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                        activeTheme === theme
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                    }`}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                        <Code language="typescript" theme={activeTheme as any} showCopy={false} className="rounded-md border border-border p-4 text-sm">
                            {`type Status = 'idle' | 'loading' | 'ready';`}
                        </Code>
                    </div>
                }
                code={`<Code language="typescript" theme="${activeTheme}" showCopy={false}>
  {source}
</Code>`}
            />

            <Section
                title="Slots and wrapper"
                description="pre and post sit outside the code block as left and right side adornments. wrapperClassName and className let the block fit inside richer documentation layouts."
                preview={
                    <Code
                        language="tsx"
                        theme="tomorrow"
                        before={<span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Example.tsx</span>}
                        after={<span className="text-xs text-muted-foreground">End</span>}
                        wrapperClassName="w-full"
                        className="rounded-md border border-border p-4 text-sm"
                    >
                        {`<Button type="primary">Save</Button>`}
                    </Code>
                }
                code={`<Code
  language="tsx"
  before={<span>Example.tsx</span>}
  after={<span>End</span>}
  wrapperClassName="w-full"
  className="rounded-md border border-border p-4 text-sm"
>
  {\`<Button type="primary">Save</Button>\`}
</Code>`}
            />

            <PropDocsTable props={CODE_PROPS} />
        </PageLayout>
    );
}
