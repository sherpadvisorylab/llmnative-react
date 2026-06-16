import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modal: {
            page: {
                title: 'Modal',
                description: 'Centered dialogs and edge panels. Fullscreen toggle, async save/delete actions and portal rendering.',
            },
            sections: {
                positions: {
                    title: 'Positions',
                    description: 'Click a button to open the modal in the corresponding position.',
                },
            },
            demo: {
                dialogTitleCenter: 'Dialog - center',
                panelTitle: 'Panel - {position}',
                dialogBody: 'Centered dialog. Supports `sm`, `md`, `lg`, `xl`, `2xl` and `fullscreen` sizes.',
                panelBody: 'Side panel with **{position}** position. Renders into `document.body` via a React portal.',
                openButton: 'Open modal',
                defaultTitle: 'Dialog title',
                defaultBody: 'Modal body content goes here.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Modal body content' },
                    title: { description: 'Modal title shown in the header' },
                    header: { description: 'Custom header content (overrides title)', example: 'header={<div className="text-sm text-muted-foreground">Extra context above the body.</div>}' },
                    footer: { description: 'Custom footer content, or false to hide footer entirely', typeDetails: 'ReactNode | false', example: `footer={(
  <div className="flex justify-end gap-2">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
)}` },
                    size: { description: 'Dialog width' },
                    position: { description: 'Where the modal appears. Non-center positions render as edge panels.' },
                    onClose: { description: 'Called when the user dismisses the modal' },
                    onSave: { description: 'Async save handler. Return true to close, false to keep open.', typeDetails: `type ModalSaveHandler = (
  e: React.MouseEvent<HTMLElement>
) => Promise<boolean>`, example: `onSave={async () => {
  await saveRecord();
  return true;
}}` },
                    onDelete: { description: 'Async delete handler. Shows a delete button in the footer.', typeDetails: `type ModalDeleteHandler = (
  e: React.MouseEvent<HTMLElement>
) => Promise<boolean>`, example: `onDelete={async () => {
  await deleteRecord();
  return true;
}}` },
                    closeOnBackdrop: { description: 'Close the modal when the backdrop is clicked' },
                    allowFullscreen: { description: 'Show fullscreen toggle button in the header' },
                    showCancel: { description: 'Show the Cancel button in the footer when onClose is provided' },
                    zIndex: { description: 'CSS z-index override - useful when stacking multiple modals' },
                    headerClassName: { description: 'CSS classes on the header container' },
                    titleClassName: { description: 'CSS classes on the title element' },
                    subtitleClassName: { description: 'CSS classes on the subtitle element (rendered when both title and header are set)' },
                    bodyClassName: { description: 'CSS classes on the body container' },
                    footerClassName: { description: 'CSS classes on the footer container' },
                    wrapperClassName: { description: 'CSS classes on the outermost dialog wrapper element' },
                    className: { description: 'CSS classes on the inner content flex container' },
                    before: { description: 'Content rendered before the inner content container, inside the dialog wrapper' },
                    after: { description: 'Content rendered after the inner content container, inside the dialog wrapper' },
                    motion: { description: 'Named motion preset or inline MotionProps override for the dialog entrance/exit animation', typeDetails: 'string | MotionEffect | false' },
                },
            },
        },
    },
});
