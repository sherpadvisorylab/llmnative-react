import React from 'react';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const DROPDOWN_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Dropdown menu content' },
    { name: 'toggleButton', type: 'string | ReactNode | { icon?: string; text?: string }', required: true, description: 'Button content or icon/text config', control: 'text' },
    { name: 'badge', type: 'ReactNode | { content; type? }', description: 'Badge displayed on the toggle', control: 'text' },
    { name: 'header', type: 'ReactNode', description: 'Header content above menu items', control: 'text' },
    { name: 'footer', type: 'ReactNode', description: 'Footer content below menu items', control: 'text' },
    { name: 'keepDropdownOpen', type: 'boolean', default: 'false', description: 'Stops click propagation inside menu', control: 'boolean' },
    { name: 'position', type: '"start" | "end"', description: 'Menu alignment', control: 'select', options: ['', 'start', 'end'] },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on dropdown root', control: 'text' },
    { name: 'buttonClass', type: 'string', description: 'CSS classes on toggle button', control: 'text' },
    { name: 'badgeClass', type: 'string', description: 'CSS classes on badge', control: 'text' },
    { name: 'menuClass', type: 'string', description: 'CSS classes on dropdown-menu', control: 'text' },
    { name: 'headerClass', type: 'string', description: 'CSS classes on header wrapper', control: 'text' },
    { name: 'footerClass', type: 'string', description: 'CSS classes on footer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: DROPDOWN_PROPS,
    defaultProps: {
        toggleButton: 'Actions',
        badge: '3',
        header: 'Menu',
        footer: 'Footer',
        keepDropdownOpen: false,
        position: 'end',
        wrapClass: '',
        className: '',
        buttonClass: 'btn btn-outline-primary',
        badgeClass: '',
        menuClass: 'show static mt-2',
        headerClass: '',
        footerClass: '',
    },
    render: (p) => (
        <Dropdown
            toggleButton={p.toggleButton || 'Actions'}
            badge={p.badge || undefined}
            header={p.header || undefined}
            footer={p.footer || undefined}
            keepDropdownOpen={p.keepDropdownOpen}
            position={p.position || undefined}
            wrapClass={p.wrapClass || undefined}
            className={p.className || undefined}
            buttonClass={p.buttonClass || undefined}
            badgeClass={p.badgeClass || undefined}
            menuClass={p.menuClass || undefined}
            headerClass={p.headerClass || undefined}
            footerClass={p.footerClass || undefined}
        >
            <DropdownItem icon="edit">Edit</DropdownItem>
            <DropdownItem icon="copy">Duplicate</DropdownItem>
            <DropdownDivider />
            <DropdownItem icon="trash">Delete</DropdownItem>
        </Dropdown>
    ),
};

export default function DropdownPage() {
    usePlayground(PLAYGROUND, 'Dropdown');

    return (
        <PageLayout title="Dropdown" description="Composed dropdown menu with toggle, badge, header, footer and item helpers.">
            <Section
                title="Action menu"
                preview={
                    <Dropdown toggleButton="Actions" buttonClass="btn btn-outline-primary" menuClass="show static mt-2" header="Menu">
                        <DropdownHeader>Record actions</DropdownHeader>
                        <DropdownItem icon="edit">Edit</DropdownItem>
                        <DropdownItem icon="copy">Duplicate</DropdownItem>
                        <DropdownDivider />
                        <DropdownItem icon="trash">Delete</DropdownItem>
                    </Dropdown>
                }
                code={`import { Dropdown, DropdownItem } from 'react-firestrap';

<Dropdown toggleButton="Actions" header="Menu">
    <DropdownItem icon="edit">Edit</DropdownItem>
    <DropdownItem icon="copy">Duplicate</DropdownItem>
    <DropdownItem icon="trash">Delete</DropdownItem>
</Dropdown>`}
            />

            <PropsTable props={DROPDOWN_PROPS} />
        </PageLayout>
    );
}
