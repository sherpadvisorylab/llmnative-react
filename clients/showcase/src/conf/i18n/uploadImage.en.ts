import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadImage: {
            page: {
                title: 'UploadImage',
                description: 'Image upload field with inline thumbnail preview, hover overlay actions and optional multi-image support. Stores file descriptors in the Form record.',
            },
            sections: {
                singleImage: {
                    title: 'Single image',
                    description: 'Default usage: one image at a time with a fixed-size thumbnail. After upload, use the hover overlay actions to preview or remove the image.',
                },
                multipleImages: {
                    title: 'Multiple images',
                    description: 'Pass multiple to allow selecting several images. Each file renders as a separate thumbnail. Upload stops once the max limit is reached.',
                },
                editableCrop: {
                    title: 'Editable (crop)',
                    description: 'Add editable to show a pencil icon on hover. Clicking it opens the image editor with crop and scale tools, and the generated variants are saved on that file entry in the Form record.',
                },
                acceptFilter: {
                    title: 'Accept filter',
                    description: 'Restrict the file picker to specific MIME types. The browser enforces the filter in the native file chooser.',
                },
                responsiveSrcset: {
                    title: 'Responsive images (srcset)',
                    description: 'Pass generateSrcset together with an uploadPath to auto-generate canvas-resized 400w and 800w variants. Each variant is uploaded to storage with a _400w / _800w filename suffix. The resulting srcset and sizes strings land in the Form record alongside the original URL — ready to drop into an <img> tag. The demo below uses an in-memory mock storage so uploads are visible without a cloud backend.',
                },
            },
            labels: {
                avatar: 'Avatar',
                galleryMax: 'Gallery (max 6)',
                coverPhotoEditable: 'Cover photo (editable)',
                pngOnly: 'PNG only',
                heroImage: 'Hero image',
            },
            propsDocs: {
                title: 'UploadImage props',
                items: {
                    name: { description: 'Field name bound to the Form record' },
                    label: { description: 'Label rendered above the upload area' },
                    multiple: { description: 'Allow selecting more than one image at a time', default: 'false' },
                    editable: { description: 'Show crop/edit button on hover; opens the image editor', default: 'false' },
                    previewWidth: { description: 'Thumbnail width in pixels', default: '100' },
                    previewHeight: { description: 'Thumbnail height in pixels', default: '100' },
                    accept: { description: 'Accepted MIME types (e.g. "image/png,image/jpeg")', default: '"image/*"' },
                    max: { description: 'Maximum number of files allowed', default: '100' },
                    required: { description: 'Mark field as required; blocks form submit when empty', default: 'false' },
                    onChange: { description: 'Called on every file list change with the updated value and form context' },
                    before: { description: 'Content rendered before the image grid, inside the outer wrapper' },
                    after: { description: 'Content rendered after the image grid, inside the outer wrapper' },
                    className: { description: 'CSS classes on the inner container' },
                    wrapperClassName: { description: 'CSS classes on the outer wrapper' },
                    uploadPath: { description: 'Storage path prefix for uploaded files. Requires a StorageProvider ancestor. When generateSrcset is also set, each width variant is stored at <uploadPath>/<name>_400w.<ext>.' },
                    srcsetWidths: { description: 'Array of pixel widths for responsive variants (e.g. [400, 800]). Each variant is stored as <name>_<width>w.<ext> and populates srcset/sizes in the Form record. Requires uploadPath and a StorageProvider.' },
                },
            },
            playground: {
                title: 'UploadImage playground',
                defaultLabel: 'Gallery',
            },
        },
    },
});
