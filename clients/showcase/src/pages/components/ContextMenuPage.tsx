import React from 'react';
import { ContextMenu } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDocsInput } from '../../docs-kit/docs/propDocs.types';

const contextMenuProps: PropDocsInput[] = [
    {
        name: 'trigger',
        type: 'string',
        required: true,
        description: 'Single character that opens the menu (e.g. "/" or "@").',
    },
    {
        name: 'searchable',
        type: 'boolean',
        default: 'false',
        description: 'When true, typing after the trigger filters items by label or value.',
    },
    {
        name: 'onSelect',
        type: '(item, editorContext) => void',
        description: 'Called when an item is selected. Receives the item and an EditorContext with insert() and replace() helpers.',
    },
    {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'ContextMenu.Item, ContextMenu.Heading, ContextMenu.Separator plus the textarea/input element.',
    },
];

const itemProps: PropDocsInput[] = [
    { name: 'label', type: 'string', required: true, description: 'Display text in the menu.' },
    { name: 'value', type: 'string', required: true, description: 'Text inserted into the field on selection.' },
    { name: 'icon', type: 'string', description: 'Lucide/Phosphor icon name rendered before the label.' },
];

const textareaBase = 'flex min-h-[8rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm';

export default function ContextMenuPage() {
    return (
        <PageLayout
            title="ContextMenu"
            description="Floating trigger-based menu for slash commands, @mentions and inline actions. Wraps any textarea or input and intercepts keyboard events."
        >
            <Section
                title="Slash commands"
                description="Type / in the textarea to open a menu of quick-insert items. Selecting an item replaces the trigger and any text typed after it."
                preview={(
                    <div className="w-full max-w-lg">
                        <ContextMenu trigger="/">
                            <ContextMenu.Heading>Headings</ContextMenu.Heading>
                            <ContextMenu.Item label="Heading 1" value="# " icon="heading" />
                            <ContextMenu.Item label="Heading 2" value="## " icon="heading" />
                            <ContextMenu.Item label="Heading 3" value="### " icon="heading" />
                            <ContextMenu.Separator />
                            <ContextMenu.Heading>Format</ContextMenu.Heading>
                            <ContextMenu.Item label="Bold" value="**bold**" icon="bold" />
                            <ContextMenu.Item label="Italic" value="_italic_" icon="italic" />
                            <ContextMenu.Separator />
                            <ContextMenu.Item label="Bullet list" value="- " icon="list" />
                            <ContextMenu.Item label="Numbered list" value="1. " icon="list" />
                            <textarea
                                className={textareaBase}
                                placeholder="Type / to see commands..."
                            />
                        </ContextMenu>
                    </div>
                )}
                code={`import { ContextMenu } from '@llmnative/react';

<ContextMenu trigger="/">
    <ContextMenu.Heading>Headings</ContextMenu.Heading>
    <ContextMenu.Item label="Heading 1" value="# " icon="heading" />
    <ContextMenu.Separator />
    <ContextMenu.Item label="Bold" value="**bold**" icon="bold" />
    <textarea placeholder="Type / to see commands..." />
</ContextMenu>`}
            />

            <Section
                title="Searchable"
                description="Add searchable to filter items as you type after the trigger. Useful for large lists like emoji pickers or @mentions."
                preview={(
                    <div className="w-full max-w-lg">
                        <ContextMenu trigger="/" searchable>
                            <ContextMenu.Heading>Markdown</ContextMenu.Heading>
                            <ContextMenu.Item label="Heading" value="# " icon="heading" />
                            <ContextMenu.Item label="Bold" value="**bold**" icon="bold" />
                            <ContextMenu.Item label="Italic" value="_italic_" icon="italic" />
                            <ContextMenu.Item label="Strikethrough" value="~~text~~" icon="italic" />
                            <ContextMenu.Item label="Code" value="`code`" icon="code" />
                            <ContextMenu.Item label="Code block" value="```\n" icon="code" />
                            <ContextMenu.Item label="Blockquote" value="> " icon="quote" />
                            <ContextMenu.Item label="Bullet list" value="- " icon="list" />
                            <ContextMenu.Item label="Ordered list" value="1. " icon="list" />
                            <ContextMenu.Item label="Link" value="[text](url)" icon="link" />
                            <ContextMenu.Item label="Image" value="![alt](url)" icon="image" />
                            <ContextMenu.Item label="Table" value="| col | col |\n| --- | --- |\n|  |  |" icon="table" />
                            <ContextMenu.Item label="HR" value="---\n" icon="minus" />
                            <textarea
                                className={textareaBase}
                                placeholder="Type /he to filter headings, /ta for tables..."
                            />
                        </ContextMenu>
                    </div>
                )}
                code={`<ContextMenu trigger="/" searchable>
    <ContextMenu.Item label="Heading" value="# " icon="heading" />
    <ContextMenu.Item label="Bold" value="**bold**" icon="bold" />
    <ContextMenu.Item label="Table" value="| ..." icon="table" />
    <textarea />
</ContextMenu>`}
            />

            <Section
                title="@mention with custom onSelect"
                description="Use onSelect to run custom logic. Here typing @ shows user names and inserts a formatted mention link."
                preview={(
                    <div className="w-full max-w-lg">
                        <ContextMenu
                            trigger="@"
                            searchable
                            onSelect={(item, { insert }) => {
                                insert(`[@${item.label}](/user/${item.value})`);
                            }}
                        >
                            <ContextMenu.Heading>Team members</ContextMenu.Heading>
                            <ContextMenu.Item label="Alice" value="alice" icon="user" />
                            <ContextMenu.Item label="Bob" value="bob" icon="user" />
                            <ContextMenu.Item label="Charlie" value="charlie" icon="user" />
                            <ContextMenu.Item label="Diana" value="diana" icon="user" />
                            <ContextMenu.Item label="Eve" value="eve" icon="user" />
                            <textarea
                                className={textareaBase}
                                placeholder="Type @ to mention a user..."
                            />
                        </ContextMenu>
                    </div>
                )}
                code={`<ContextMenu trigger="@" searchable
    onSelect={(item, { insert }) => {
        insert(\`[@\${item.label}](/user/\${item.value})\`);
    }}
>
    <ContextMenu.Heading>Team members</ContextMenu.Heading>
    <ContextMenu.Item label="Alice" value="alice" icon="user" />
    <ContextMenu.Item label="Bob" value="bob" icon="user" />
    <textarea />
</ContextMenu>`}
            />

            <Section
                title="Multiple triggers"
                description="Nest ContextMenu components for different triggers. Each menu only activates on its own trigger character."
                preview={(
                    <div className="w-full max-w-lg">
                        <ContextMenu trigger="/" searchable>
                            <ContextMenu.Item label="Heading" value="# " icon="heading" />
                            <ContextMenu.Item label="Bold" value="**bold**" icon="bold" />
                            <ContextMenu.Item label="List" value="- " icon="list" />
                            <ContextMenu trigger="@" searchable>
                                <ContextMenu.Heading>Users</ContextMenu.Heading>
                                <ContextMenu.Item label="Alice" value="alice" icon="user" />
                                <ContextMenu.Item label="Bob" value="bob" icon="user" />
                                <textarea
                                    className={textareaBase}
                                    placeholder="Type / for commands, @ for users..."
                                />
                            </ContextMenu>
                        </ContextMenu>
                    </div>
                )}
                code={`<ContextMenu trigger="/" searchable>
    <ContextMenu.Item label="Heading" value="# " />
    <ContextMenu trigger="@" searchable>
        <ContextMenu.Item label="Alice" value="alice" />
        <textarea />
    </ContextMenu>
</ContextMenu>`}
            />

            <PropDocsTable props={contextMenuProps} title="ContextMenu props" />
            <PropDocsTable props={itemProps} title="ContextMenu.Item props" />
        </PageLayout>
    );
}
