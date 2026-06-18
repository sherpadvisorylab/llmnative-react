import React from 'react';
import { Form, CodeEditor } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCodeEditorI18n } from '../../showcase/i18n';

const SAMPLE_HTML = ` <header class="hero">
  <h1>Welcome</h1>
  <p>This is a sample HTML template.</p>
</header>`;

const SAMPLE_JSON = `{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}`;

const SAMPLE_JS = `function greet(name) {
  return \`Hello, \${name}!\`;
}

const users = ['Alice', 'Bob'];
users.forEach(u => console.log(greet(u)));`;

const SAMPLE_CSS = `.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}`;

const SAMPLE_LIQUID = `{% assign featured = collections.posts | limit: 3 %}
<div class="featured">
  {% for post in featured %}
    <article>
      <h2>{{ post.title }}</h2>
      <p>{{ post.excerpt }}</p>
    </article>
  {% endfor %}
</div>`;

export default function CodeEditorPage() {
    const t = useShowcaseCodeEditorI18n();

    const props = React.useMemo<PropDef[]>(() => [
        { name: 'name',            type: 'string',            required: true,  description: t.propsDocs.items.name.description,           control: 'text' },
        { name: 'label',           type: 'string',                             description: t.propsDocs.items.label.description,          control: 'text' },
        { name: 'required',        type: 'boolean',           default: 'false', description: t.propsDocs.items.required.description,      control: 'boolean' },
        { name: 'language',        type: 'string',            default: 'html',  description: t.propsDocs.items.language.description,       control: 'select', options: ['html', 'json', 'js', 'ts', 'css', 'liquid'] },
        { name: 'placeholder',     type: 'string',                             description: t.propsDocs.items.placeholder.description,    control: 'text' },
        { name: 'disabled',        type: 'boolean',           default: 'false', description: t.propsDocs.items.disabled.description,      control: 'boolean' },
        { name: 'minHeight',       type: 'number',            default: '200',   description: t.propsDocs.items.minHeight.description,      control: 'number' },
        { name: 'maxHeight',       type: 'number',            default: '600',   description: t.propsDocs.items.maxHeight.description,      control: 'number' },
        { name: 'labelClassName',  type: 'string',                             description: t.propsDocs.items.labelClassName.description, control: 'text' },
        { name: 'defaultValue',    type: 'string',                             description: t.propsDocs.items.defaultValue.description,   control: 'textarea', rows: 6, shortcuts: [
            { label: 'html',    value: SAMPLE_HTML,   help: 'HTML template.' },
            { label: 'json',    value: SAMPLE_JSON,   help: 'JSON config.' },
            { label: 'js',      value: SAMPLE_JS,     help: 'JavaScript.' },
            { label: 'css',     value: SAMPLE_CSS,    help: 'Stylesheet.' },
            { label: 'liquid',  value: SAMPLE_LIQUID, help: 'Liquid template.' },
            { label: 'empty',   value: '',             help: 'Empty starting value.' },
        ] },
        { name: 'value',           type: 'string',                             description: t.propsDocs.items.value.description },
        { name: 'feedback',        type: 'string',                             description: t.propsDocs.items.feedback.description,       control: 'text' },
        { name: 'before',          type: 'ReactNode',                          description: t.propsDocs.items.before.description,         control: 'text' },
        { name: 'after',           type: 'ReactNode',                          description: t.propsDocs.items.after.description,          control: 'text' },
        { name: 'onChange',        type: 'FieldOnChange',                      description: t.propsDocs.items.onChange.description },
        { name: 'className',       type: 'string',                             description: t.propsDocs.items.className.description,      control: 'text' },
        { name: 'wrapperClassName', type: 'string',                            description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props,
        showFormRecord: true,
        size: 'lg',
        defaultProps: {
            name:         'code',
            label:        t.labels.templateBody,
            language:     'html',
            required:     false,
            defaultValue: SAMPLE_HTML,
            disabled:     false,
            placeholder:  '',
            minHeight:    200,
            maxHeight:    600,
            feedback:     '',
            before:       '',
            after:        '',
            className:    '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form key={p.defaultValue + '-' + p.language} appearance="empty" onChange={onValuesChange}>
                <CodeEditor
                    name={p.name || 'code'}
                    label={p.label || undefined}
                    language={p.language || 'html'}
                    placeholder={p.placeholder || undefined}
                    required={p.required}
                    defaultValue={p.defaultValue}
                    disabled={p.disabled}
                    minHeight={p.minHeight}
                    maxHeight={p.maxHeight}
                    feedback={p.feedback || undefined}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [props, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.basicUsage.title}
                preview={(
                    <Form appearance="empty">
                        <CodeEditor
                            name="code"
                            label={t.labels.templateBody}
                            language="html"
                            defaultValue={SAMPLE_HTML}
                        />
                    </Form>
                )}
                code={`import { Form, CodeEditor } from '@llmnative/react';

<Form>
    <CodeEditor
        name="code"
        label="Template body"
        language="html"
        defaultValue={'<h1>Hello</h1>'}
    />
</Form>`}
            />

            <Section
                title={t.sections.languageModes.title}
                preview={(
                    <Form appearance="empty">
                        <div className="flex flex-col gap-6">
                            <CodeEditor
                                name="jsonConfig"
                                label={t.labels.jsonConfig}
                                language="json"
                                minHeight={120}
                                defaultValue={JSON.stringify({ name: 'My App', version: '1.0.0' }, null, 2)}
                            />
                            <CodeEditor
                                name="script"
                                label={t.labels.script}
                                language="js"
                                minHeight={120}
                                defaultValue={SAMPLE_JS}
                            />
                            <CodeEditor
                                name="stylesheet"
                                label={t.labels.stylesheet}
                                language="css"
                                minHeight={120}
                                defaultValue={SAMPLE_CSS}
                            />
                            <CodeEditor
                                name="liquidTemplate"
                                label={t.labels.liquidTemplate}
                                language="liquid"
                                minHeight={120}
                                defaultValue={SAMPLE_LIQUID}
                            />
                        </div>
                    </Form>
                )}
                code={`import { Form, CodeEditor } from '@llmnative/react';

<Form>
    <CodeEditor name="config"  language="json" label="JSON config" />
    <CodeEditor name="script"  language="js"   label="Script" />
    <CodeEditor name="style"   language="css"  label="Stylesheet" />
    <CodeEditor name="template" language="liquid" label="Liquid" />
</Form>`}
            />

            <Section
                title={t.sections.disabledState.title}
                preview={(
                    <Form appearance="empty">
                        <CodeEditor
                            name="disabledCode"
                            label={t.labels.templateBody}
                            language="html"
                            defaultValue={SAMPLE_HTML}
                            disabled
                        />
                    </Form>
                )}
                code={`import { Form, CodeEditor } from '@llmnative/react';

<Form>
    <CodeEditor
        name="code"
        label="Template body"
        language="html"
        defaultValue={'<h1>Hello</h1>'}
        disabled
    />
</Form>`}
            />

            <PropDocsTable props={props} title={t.propsDocs.title} />
        </PageLayout>
    );
}
