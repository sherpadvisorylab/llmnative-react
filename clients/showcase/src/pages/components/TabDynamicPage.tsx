import React from 'react';
import { Form, Input, TabDynamic } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseTabDynamicI18n } from '../../showcase/i18n';

export default function TabDynamicPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseTabDynamicI18n();

    const tabDynamicProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'children', type: 'ReactNode | (record) => ReactNode', required: true, description: t.propsDocs.items.children.description },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'onAdd', type: '(value: any[]) => void', description: t.propsDocs.items.onAdd.description },
        { name: 'onRemove', type: '(index: number) => void', description: t.propsDocs.items.onRemove.description },
        { name: 'label', type: 'string', default: '"Tab"', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'min', type: 'number', default: '1', description: t.propsDocs.items.min.description, control: 'number', min: 0, max: 5 },
        { name: 'max', type: 'number', description: t.propsDocs.items.max.description, control: 'number', min: 1, max: 8 },
        { name: 'activeIndex', type: 'number', default: '0', description: t.propsDocs.items.activeIndex.description, control: 'number', min: 0, max: 4 },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'readOnly', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnly.description, control: 'boolean' },
        { name: 'tabPosition', type: 'TabPosition', default: '"default"', description: t.propsDocs.items.tabPosition.description, control: 'select', options: ['default', 'top', 'bottom', 'left', 'right'] },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: tabDynamicProps,
        showFormRecord: true,
        defaultProps: {
            name: 'sections',
            label: t.labels.section,
            min: 1,
            max: 4,
            activeIndex: 0,
            title: t.labels.dynamicSections,
            readOnly: false,
            tabPosition: 'default',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" defaultValues={{ [p.name || 'sections']: [{ title: t.labels.intro }] }} onChange={onValuesChange}>
                <TabDynamic
                    name={p.name || 'sections'}
                    label={p.label || t.labels.section}
                    min={p.min}
                    max={p.max}
                    activeIndex={p.activeIndex}
                    title={p.title || undefined}
                    readOnly={p.readOnly}
                    tabPosition={p.tabPosition || 'default'}
                >
                    <Input name="title" label={t.labels.title} />
                </TabDynamic>
            </Form>
        ),
    }), [t, tabDynamicProps]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.editableTabs.title}
                description={t.sections.editableTabs.description}
                preview={
                    <Form appearance="empty" defaultValues={{ sections: [{ title: t.labels.intro }] }}>
                        <TabDynamic name="sections" label={t.labels.section} title={t.labels.dynamicSections}>
                            <Input name="title" label={t.labels.title} />
                        </TabDynamic>
                    </Form>
                }
                code={`import { Form, Input, TabDynamic } from '@llmnative/react';

<Form defaultValues={{ sections: [{ title: 'Intro' }] }}>
    <TabDynamic name="sections" label="Section">
        <Input name="title" label="Title" />
    </TabDynamic>
</Form>`}
            />

            <PropDocsTable props={tabDynamicProps} title={common.sections.props} />
        </PageLayout>
    );
}
