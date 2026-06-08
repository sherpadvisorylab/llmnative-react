import React, { useState } from 'react';
import { ImageEditor } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

// SVG data URLs fail with tui-image-editor (fabric.js crossOrigin: 'Anonymous' quirk).
// We generate a real PNG via the Canvas API at component init time instead.
function makeSamplePng(): string {
    const c = document.createElement('canvas');
    c.width = 700; c.height = 500;
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 700, 500);
    grad.addColorStop(0, '#2563eb');
    grad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 700, 500);
    // Yellow circle
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(560, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    // Dark wave
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 350); ctx.lineTo(150, 220); ctx.lineTo(290, 320);
    ctx.lineTo(430, 160); ctx.lineTo(590, 280); ctx.lineTo(700, 210);
    ctx.lineTo(700, 500); ctx.lineTo(0, 500);
    ctx.closePath();
    ctx.fill();
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText('Sample', 40, 90);
    ctx.font = '18px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('Sample - edit this image', 40, 130);
    return c.toDataURL('image/png');
}

const PROPS_CONFIG: PropDef[] = [
    { name: 'imageUrl', type: 'string', required: true, description: 'URL or data URL of the image to edit.' },
    { name: 'title', type: 'string', description: 'Title shown in the modal header (only when modal=true).', default: '"Image Editor"' },
    { name: 'width', type: 'number', description: 'Max CSS width of the canvas in pixels.', default: '700' },
    { name: 'height', type: 'number', description: 'Max CSS height of the canvas in pixels.', default: '500' },
    { name: 'modal', type: 'boolean', description: 'Render inside a modal overlay instead of inline.', default: 'false' },
    { name: 'onImageLoad', type: '() => void', description: 'Callback fired when the image finishes loading into the editor.' },
    { name: 'onClose', type: '() => void', description: 'Callback fired when the user closes the modal (modal=true only).' },
    { name: 'onSave', type: '(dataUrl: string) => void | Promise<void>', description: 'Callback fired when the user clicks Save. Receives the edited image as a data URL.' },
];

export default function ImageEditorPage() {
    const [sampleImage] = useState(makeSamplePng);
    const [modalOpen, setModalOpen] = useState(false);
    const [savedDataUrl, setSavedDataUrl] = useState<string | null>(null);

    return (
        <PageLayout
            title="ImageEditor"
            description="Full-featured image editing widget powered by tui-image-editor. Supports crop, flip, rotate, free drawing, shapes, text and zoom. Available inline or inside a modal."
        >
            <Section
                title="Inline editor"
                description="Drop the editor directly on the page. The toolbar appears at the top; the canvas fills the width."
                preview={
                    <div className="w-full">
                        <ImageEditor
                            imageUrl={sampleImage}
                            width={700}
                            height={400}
                            onSave={(dataUrl) => setSavedDataUrl(dataUrl)}
                        />
                        {savedDataUrl && (
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground mb-2">Last saved output:</p>
                                <img
                                    src={savedDataUrl}
                                    alt="Saved result"
                                    className="max-w-full rounded border border-border"
                                    style={{ maxHeight: 200 }}
                                />
                            </div>
                        )}
                    </div>
                }
                code={`import { ImageEditor } from '@llmnative/react';

<ImageEditor
  imageUrl={imageUrl}
  width={700}
  height={400}
  onSave={(dataUrl) => uploadToStorage(dataUrl)}
/>`}
            />

            <Section
                title="Modal editor"
                description="Pass modal to open the editor in a full-screen overlay. The title and toolbar are merged into a single clean header row. onClose is called when the user dismisses it."
                preview={
                    <div className="w-full">
                        <button
                            className="btn btn-primary"
                            onClick={() => setModalOpen(true)}
                        >
                            Open editor in modal
                        </button>
                        {modalOpen && (
                            <ImageEditor
                                imageUrl={sampleImage}
                                title="Edit photo"
                                modal
                                width={700}
                                height={480}
                                onClose={() => setModalOpen(false)}
                                onSave={async (dataUrl) => {
                                    setSavedDataUrl(dataUrl);
                                    setModalOpen(false);
                                }}
                            />
                        )}
                        {savedDataUrl && (
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground mb-2">Saved result:</p>
                                <img
                                    src={savedDataUrl}
                                    alt="Saved"
                                    className="max-w-xs rounded border border-border"
                                />
                            </div>
                        )}
                    </div>
                }
                code={`import { ImageEditor } from '@llmnative/react';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Edit image</button>

{open && (
  <ImageEditor
    imageUrl={imageUrl}
    title="Edit photo"
    modal
    width={700}
    height={480}
    onClose={() => setOpen(false)}
    onSave={async (dataUrl) => {
      await uploadToStorage(dataUrl);
      setOpen(false);
    }}
  />
)}`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
