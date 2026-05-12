import React from 'react';
import { ActionButton, BackLink, GoSite, LoadingButton, ReferSite } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const SOLID_VARIANTS = ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'light', 'dark'] as const;
const OUTLINE_VARIANTS = ['primary', 'secondary', 'danger', 'success'] as const;
const BUTTON_CLASSES = [
    'btn-primary',
    'btn-secondary',
    'btn-success',
    'btn-danger',
    'btn-warning',
    'btn-info',
    'btn-light',
    'btn-dark',
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-danger',
    'btn-link',
];
const BADGE_TYPES = ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'];

const ACTION_BUTTON_PROPS: PropDef[] = [
    { name: 'onClick', type: '(e: any) => any', description: 'Click handler. The component prevents default and stops propagation before calling it.' },
    { name: 'icon', type: 'string', description: 'Icon name resolved by the active IconProvider', control: 'icon' },
    { name: 'label', type: 'string | ReactNode', description: 'Visible button label', control: 'text' },
    { name: 'badge', type: 'string', description: 'Optional badge content rendered on the top-right corner', control: 'text' },
    { name: 'title', type: 'string', description: 'Native button title attribute', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button', control: 'boolean' },
    { name: 'badgeType', type: 'BadgeType', description: 'Color variant for the optional badge', control: 'select', options: BADGE_TYPES },
    { name: 'iconClass', type: 'string', description: 'CSS classes applied to the icon element', control: 'text' },
    { name: 'style', type: 'React.CSSProperties', description: 'Inline style object' },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the button', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the button', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes applied to the wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the button', control: 'select', options: BUTTON_CLASSES },
];

const LOADING_BUTTON_PROPS: PropDef[] = [
    { name: 'onClick', type: 'async (e: any, setMessage?: fn) => Promise<any>', description: 'Async click handler. setMessage can update the loading text while the promise is pending.' },
    { name: 'icon', type: 'string', description: 'Icon name shown while idle', control: 'icon' },
    { name: 'label', type: 'string | ReactNode', description: 'Visible button label', control: 'text' },
    { name: 'badge', type: 'string', description: 'Optional badge content rendered while idle', control: 'text' },
    { name: 'title', type: 'string', description: 'Native button title attribute', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button', control: 'boolean' },
    { name: 'showLoader', type: 'boolean', default: 'false', description: 'Starts the button in loading state', control: 'boolean' },
    { name: 'badgeType', type: 'BadgeType', description: 'Color variant for the optional badge', control: 'select', options: BADGE_TYPES },
    { name: 'iconClass', type: 'string', description: 'CSS classes applied to the icon element', control: 'text' },
    { name: 'style', type: 'React.CSSProperties', description: 'Inline style object' },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the button', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the button', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes applied to the wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the button', control: 'select', options: BUTTON_CLASSES },
];

const LINK_PROPS: PropDef[] = [
    { name: 'label', type: 'string', description: 'Visible label' },
    { name: 'url', type: 'string', description: 'External URL for GoSite or ReferSite' },
    { name: 'title', type: 'string', description: 'ReferSite title and image alt text' },
    { name: 'imageUrl', type: 'string', description: 'ReferSite image source' },
    { name: 'width', type: 'number | string', description: 'ReferSite image width' },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the element' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the element' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes applied to the wrapper' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the rendered element' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'sm',
    props: LOADING_BUTTON_PROPS,
    defaultProps: {
        label: 'Save',
        icon: 'save',
        badge: '',
        title: 'Save changes',
        disabled: false,
        showLoader: false,
        badgeType: 'danger',
        iconClass: '',
        className: 'btn-primary',
        wrapClass: '',
        pre: '',
        post: '',
    },
    render: (p) => (
        <LoadingButton
            label={p.label}
            icon={p.icon || undefined}
            badge={p.badge || undefined}
            title={p.title || undefined}
            disabled={p.disabled}
            showLoader={p.showLoader}
            badgeType={p.badgeType || undefined}
            iconClass={p.iconClass || undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
            pre={p.pre || undefined}
            post={p.post || undefined}
            onClick={async (_e, setMessage) => {
                setMessage?.({ message: 'Saving...' });
                await new Promise((r) => setTimeout(r, 1200));
            }}
        />
    ),
};

export default function ButtonPage() {
    usePlayground(PLAYGROUND, 'LoadingButton');

    return (
        <PageLayout
            title="Button"
            description="Button utilities for immediate actions, async actions, back navigation and external references."
        >
            <Section
                title="Native button classes"
                description="The base btn classes are theme-aware and backed by react-firestrap CSS tokens."
                preview={
                    <div className="flex flex-wrap gap-2">
                        {SOLID_VARIANTS.map((v) => (
                            <button key={v} className={`btn btn-${v}`}>{v}</button>
                        ))}
                    </div>
                }
                code={`<button className="btn btn-primary">primary</button>
<button className="btn btn-secondary">secondary</button>
<button className="btn btn-danger">danger</button>
<button className="btn btn-success">success</button>`}
            />

            <Section
                title="Outline and link"
                preview={
                    <div className="flex flex-wrap gap-2 items-center">
                        {OUTLINE_VARIANTS.map((v) => (
                            <button key={v} className={`btn btn-outline-${v}`}>{v}</button>
                        ))}
                        <button className="btn btn-link">link</button>
                        <button className="btn btn-primary" disabled>disabled</button>
                    </div>
                }
                code={`<button className="btn btn-outline-primary">primary</button>
<button className="btn btn-link">link</button>
<button className="btn btn-primary" disabled>disabled</button>`}
            />

            <Section
                title="ActionButton"
                description="ActionButton wraps a button element, resolves provider icons and can render a Badge on top-right."
                preview={
                    <div className="flex flex-wrap gap-4">
                        <ActionButton className="btn-primary" icon="save" label="Save" />
                        <ActionButton className="btn-outline-secondary" icon="settings" label="Settings" badge="3" badgeType="danger" />
                        <ActionButton className="btn-danger" icon="trash" title="Delete" />
                    </div>
                }
                code={`import { ActionButton } from 'react-firestrap';

<ActionButton className="btn-primary" icon="save" label="Save" />
<ActionButton className="btn-outline-secondary" icon="settings" label="Settings" badge="3" />`}
            />

            <Section
                title="LoadingButton"
                description="LoadingButton disables itself while the async onClick promise is pending. Use setMessage to show progress text."
                preview={
                    <div className="flex flex-wrap gap-4">
                        <LoadingButton
                            className="btn-primary"
                            icon="save"
                            label="Save"
                            onClick={async (_e, setMessage) => {
                                setMessage?.({ message: 'Saving...' });
                                await new Promise((r) => setTimeout(r, 1500));
                            }}
                        />
                        <LoadingButton
                            className="btn-outline-danger"
                            icon="trash"
                            label="Delete"
                            badge="!"
                            badgeType="danger"
                            onClick={async () => {
                                await new Promise((r) => setTimeout(r, 1200));
                            }}
                        />
                    </div>
                }
                code={`import { LoadingButton } from 'react-firestrap';

<LoadingButton
  className="btn-primary"
  icon="save"
  label="Save"
  onClick={async (_e, setMessage) => {
    setMessage?.({ message: 'Saving...' });
    await saveData();
  }}
/>`}
            />

            <Section
                title="Navigation helpers"
                description="BackLink uses React Router navigation. GoSite and ReferSite render external references."
                preview={
                    <div className="flex flex-wrap items-center gap-4">
                        <BackLink className="btn-outline-secondary" />
                        <GoSite label="React" url="https://react.dev" className="text-lg font-semibold" />
                        <ReferSite
                            title="React"
                            url="https://react.dev"
                            imageUrl="https://react.dev/favicon.ico"
                            width={30}
                        />
                    </div>
                }
                code={`<BackLink className="btn-outline-secondary" />
<GoSite label="React" url="https://react.dev" />
<ReferSite title="React" url="https://react.dev" imageUrl="/logo.png" width={30} />`}
            />

            <PropsTable props={ACTION_BUTTON_PROPS} title="ActionButton props" />
            <PropsTable props={LOADING_BUTTON_PROPS} title="LoadingButton props" />
            <PropsTable props={LINK_PROPS} title="BackLink / GoSite / ReferSite props" />
        </PageLayout>
    );
}
