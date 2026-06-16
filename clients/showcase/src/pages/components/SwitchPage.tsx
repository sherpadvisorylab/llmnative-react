import React from 'react';
import { Form, Switch } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseSwitchI18n } from '../../showcase/i18n';

export default function SwitchPage() {
    const t = useShowcaseSwitchI18n();

    const switchProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'ariaLabel', type: 'string', description: t.propsDocs.items.ariaLabel.description, control: 'text' },
        { name: 'inheritWrapperClassName', type: 'boolean', default: 'true', description: t.propsDocs.items.inheritWrapperClassName.description, control: 'boolean' },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'valueChecked', type: 'string | number', default: '"on"', description: t.propsDocs.items.valueChecked.description, control: 'text' },
        { name: 'defaultValue', type: 'string | number', description: t.propsDocs.items.defaultValue.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: switchProps,
        showFormRecord: true,
        defaultProps: {
            name: 'published',
            label: t.labels.published,
            title: t.labels.togglePublishedState,
            required: false,
            valueChecked: 'yes',
            defaultValue: 'yes',
            before: '',
            after: '',
            className: '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" onChange={onValuesChange}>
                <Switch name="published" {...p} />
            </Form>
        ),
    }), [switchProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.booleanToggle.title}
                preview={(
                    <Form appearance="empty" defaultValues={{ published: 'yes' }}>
                        <Switch name="published" label={t.labels.published} valueChecked="yes" />
                    </Form>
                )}
                code={`import { Form, Switch } from '@llmnative/react';

<Form defaultValues={{ published: 'yes' }}>
    <Switch name="published" label="Published" valueChecked="yes" />
</Form>`}
            />

            <PropDocsTable props={switchProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
