import React from 'react';
import { Badge, Code } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

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
const BACKGROUNDS = ['transparent', 'default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'white', 'black'];

const SAMPLE_TSX = `import { Code } from 'react-firestrap';

export function Example() {
  return (
    <Code language="tsx" theme="tomorrow" showCopy>
      {\`const total = rows.reduce((sum, row) => sum + row.amount, 0);\`}
    </Code>
  );
}`;

const SAMPLE_JSON = `{
  "name": "react-firestrap",
  "component": "Code",
  "features": ["syntax highlight", "copy", "theme"]
}`;

const SAMPLE_BASH = `npm install react-firestrap
npm run build`;

const CODE_PROPS: PropDef[] = [
    { name: 'children', type: 'string', required: true, description: 'Code text rendered inside the block', control: 'textarea' },
    { name: 'language', type: 'PrismLanguage', required: true, default: '"tsx"', description: 'Prism language used for syntax highlighting', control: 'select', options: LANGUAGES },
    { name: 'showCopy', type: 'boolean', default: 'true', description: 'Shows the copy-to-clipboard action', control: 'boolean' },
    { name: 'theme', type: 'PrismTheme', default: '"tomorrow"', description: 'Prism theme stylesheet loaded for the block', control: 'select', options: THEMES },
    { name: 'background', type: 'PrismBackground', default: '"transparent"', description: 'Optional background utility applied to the pre element', control: 'select', options: BACKGROUNDS },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the code element', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the code element', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes applied to the wrapper', control: 'text' },
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
        background: 'transparent',
        pre: '',
        post: '',
        wrapClass: '',
        className: '',
    },
    render: (p) => (
        <Code
            language={p.language}
            showCopy={p.showCopy}
            theme={p.theme}
            background={p.background}
            pre={p.pre || undefined}
            post={p.post || undefined}
            wrapClass={p.wrapClass || undefined}
            className={p.className || undefined}
        >
            {p.children}
        </Code>
    ),
};

export default function CodePage() {
    usePlayground(PLAYGROUND, 'Code');

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
                code={`import { Code } from 'react-firestrap';

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
                description="showCopy controls the clipboard button. theme selects the Prism CSS theme to load."
                preview={
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {THEMES.map((theme) => (
                                <Badge key={theme} type="secondary">{theme}</Badge>
                            ))}
                        </div>
                        <Code language="typescript" theme="okaidia" showCopy={false} className="rounded-md border border-border p-4 text-sm">
                            {`type Status = 'idle' | 'loading' | 'ready';`}
                        </Code>
                    </div>
                }
                code={`<Code language="typescript" theme="okaidia" showCopy={false}>
  {source}
</Code>`}
            />

            <Section
                title="Slots and wrapper"
                description="pre, post, wrapClass and className let the block fit inside richer documentation layouts."
                preview={
                    <Code
                        language="tsx"
                        theme="tomorrow"
                        pre={<div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Example.tsx</div>}
                        post={<div className="mt-3 text-xs text-muted-foreground">End of snippet</div>}
                        wrapClass="w-full"
                        className="rounded-md border border-border p-4 text-sm"
                    >
                        {`<Button type="primary">Save</Button>`}
                    </Code>
                }
                code={`<Code
  language="tsx"
  pre={<div>Example.tsx</div>}
  post={<div>End of snippet</div>}
  wrapClass="w-full"
  className="rounded-md border border-border p-4 text-sm"
>
  {\`<Button type="primary">Save</Button>\`}
</Code>`}
            />

            <PropsTable props={CODE_PROPS} />
        </PageLayout>
    );
}
