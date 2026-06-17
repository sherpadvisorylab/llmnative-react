import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        richText: {
            page: {
                title: 'RichText',
                description: 'WYSIWYG rich text editor integrated with Form context. Lazy-loads TipTap only when mounted. Supports fixed and floating toolbars, tables, image/document upload, source-code mode and an optional status bar.',
            },
            sections: {
                basicUsage: {
                    title: 'Basic usage',
                    description: 'Drop RichText inside a Form like any other field. The value is stored as HTML by default and syncs with the form record on every editor update.',
                },
                toolbarModes: {
                    title: 'Toolbar modes',
                    description: '"fixed" shows a persistent toolbar above the editor. "floating" shows a bubble toolbar on text selection. false hides the toolbar entirely.',
                },
                customCommands: {
                    title: 'Custom toolbar commands',
                    description: 'Pass toolbarCommands to choose which buttons to show and in what order. Use "|" as a visual separator between groups.',
                },
                tableSupport: {
                    title: 'Table support',
                    description: 'Add "table" to toolbarCommands to enable the insert-table button. A default 3×3 table with a header row is inserted at the cursor position.',
                },
                sourceCode: {
                    title: 'Source code mode',
                    description: 'Add "sourceCode" to toolbarCommands to let users toggle between the WYSIWYG editor and a raw HTML textarea.',
                },
                statusBar: {
                    title: 'Status bar',
                    description: 'Set statusBar={true} to show the default status bar (DOM tag breadcrumb at the cursor + word count). Pass a StatusBarConfig object to enable or disable individual items.',
                },
                outputFormats: {
                    title: 'Output formats',
                    description: '"html" (default) stores HTML. "json" stores the TipTap JSON document (serializable, ideal for re-rendering). "text" stores plain text only.',
                },
                disabledState: {
                    title: 'Disabled',
                    description: 'The disabled prop makes the entire editor read-only. The toolbar is still visible but all interactions are blocked.',
                },
                imageUpload: {
                    title: 'Image upload with responsive variants',
                    description: 'Pass imageUpload to the RichText to enable the imageUpload toolbar command. Set srcsetWidths to auto-generate responsive variants on upload — each variant is stored as <name>_<width>w.<ext> and the srcset attribute is written directly into the inserted <img> tag. The demo uses an in-memory mock storage.',
                },
            },
            labels: {
                articleBody: 'Article body',
                postContent: 'Post content',
                description: 'Description',
                comment: 'Comment',
                notes: 'Notes',
                content: 'Content',
                startTyping: 'Start typing...',
            },
            propsDocs: {
                title: 'RichText props',
                items: {
                    name: { description: 'Field name used as form key and dot-notation path.' },
                    label: { description: 'Label rendered above the editor.' },
                    required: { description: 'Marks the field as required. Blocks form submission when the editor is empty.' },
                    placeholder: { description: 'Placeholder text shown inside the editor when empty.' },
                    disabled: { description: 'Makes the entire editor read-only.' },
                    toolbar: { description: 'Toolbar position: "fixed" (above editor), "floating" (bubble on selection), or false (hidden).' },
                    toolbarCommands: { description: 'Ordered list of toolbar command keys. Use "|" as a visual separator. Defaults to all available commands.' },
                    outputFormat: { description: 'Format used to store the field value: "html" (default), "json" (TipTap document), or "text" (plain text).' },
                    statusBar: { description: 'Enable the status bar below the editor. true uses defaults (tag breadcrumb + word count). Pass a StatusBarConfig for fine-grained control.' },
                    minHeight: { description: 'Minimum editor height in pixels. Default: 120.' },
                    maxHeight: { description: 'Maximum editor height in pixels. Content scrolls internally beyond this value.' },
                    imageUpload: { description: 'Image upload config object: { path, srcsetWidths, accept, maxBytes }. Pass to enable the imageUpload toolbar command. Omit to keep images as base64 data URIs.' },
                    documentUpload: { description: 'Document upload config object: { path, accept, maxBytes }. Pass to enable the documentUpload toolbar command and upload files to storage. Omit to use data URI fallback. Inserted as a clickable file chip with filename and size.' },
                    uploadPath: { description: '@deprecated — use imageUpload.path instead.' },
                    feedback: { description: 'Helper text rendered below the editor.' },
                    defaultValue: { description: 'Initial value when used outside a Form context.' },
                    validator: { description: 'Custom validation function. Return an error string to block form submission.' },
                    id: { description: 'Explicit id for the editor element. Auto-generated when omitted.' },
                    labelClassName: { description: 'CSS classes applied to the label element.' },
                    className: { description: 'CSS classes applied to the editor container.' },
                    wrapperClassName: { description: 'CSS classes applied to the outer wrapper.' },
                    before: { description: 'Content rendered before the editor wrapper.' },
                    after: { description: 'Content rendered after the editor wrapper.' },
                    onChange: { description: 'Custom change handler called by Form context on every editor update.' },
                },
            },
            playground: {
                title: 'RichText',
            },
        },
    },
});
