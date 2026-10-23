import React from 'react';
import { Identicon } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseIdenticonI18n } from '../../showcase/i18n';

const NAMES = ['acme/app', 'acme/web', 'dealdesk', 'playbook', 'llmnative-react', 'Ada Lovelace'];

export default function IdenticonPage() {
    const t = useShowcaseIdenticonI18n();

    const propsConfig = React.useMemo<PropDef[]>(() => ([
        { name: 'value', type: 'string', required: true, description: t.propsDocs.items.value.description, control: 'text' },
        { name: 'size', type: 'number', description: t.propsDocs.items.size.description, control: 'number', min: 16, max: 160 },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ]), [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'md',
        props: propsConfig,
        defaultProps: { value: 'acme/app', size: 64, title: 'acme/app', className: '' },
        render: (p) => (
            <Identicon
                value={p.value || ''}
                size={Number(p.size) || 64}
                title={p.title || undefined}
                after={p.after || undefined}
                before={p.before || undefined}
                className={p.className || undefined}
            />
        ),
    }), [propsConfig]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.values.title}
                description={t.sections.values.description}
                preview={(
                    <div className="flex flex-wrap gap-6">
                        {NAMES.map((name) => (
                            <div key={name} className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                                <Identicon value={name} size={56} title={name} />
                                {name}
                            </div>
                        ))}
                    </div>
                )}
                code={`import { Identicon } from '@llmnative/react';

<Identicon value="acme/app" size={56} title="acme/app" />`}
            />
            <Section
                title={t.sections.sizes.title}
                description={t.sections.sizes.description}
                preview={(
                    <div className="flex items-end gap-4">
                        {[16, 24, 32, 48, 64].map((size) => <Identicon key={size} value="dealdesk" size={size} />)}
                    </div>
                )}
                code={`<Identicon value="dealdesk" size={24} />
<Identicon value="dealdesk" size={64} />`}
            />
            <Section
                title={t.sections.inRow.title}
                description={t.sections.inRow.description}
                preview={(
                    <div className="space-y-3">
                        {['acme/app', 'acme/web'].map((name) => (
                            <Identicon
                                key={name}
                                value={name}
                                size={32}
                                className="rounded-full bg-muted"
                                after={<div><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">{t.labels.repository}</p></div>}
                            />
                        ))}
                    </div>
                )}
                code={`<Identicon
  value="acme/app"
  size={32}
  className="rounded-full bg-muted"
  after={<span>acme/app</span>}
/>`}
            />
            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
