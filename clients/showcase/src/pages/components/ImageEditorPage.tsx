import React, { useMemo, useState } from 'react';
import { ImageEditor } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';
import { useShowcaseImageEditorI18n } from '../../showcase/i18n';

function makeSamplePng(title: string, subtitle: string): string {
    const c = document.createElement('canvas');
    c.width = 700;
    c.height = 500;
    const ctx = c.getContext('2d');
    if (!ctx) return '';

    const grad = ctx.createLinearGradient(0, 0, 700, 500);
    grad.addColorStop(0, '#2563eb');
    grad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 700, 500);

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(560, 100, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(150, 220);
    ctx.lineTo(290, 320);
    ctx.lineTo(430, 160);
    ctx.lineTo(590, 280);
    ctx.lineTo(700, 210);
    ctx.lineTo(700, 500);
    ctx.lineTo(0, 500);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText(title, 40, 90);
    ctx.font = '18px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(subtitle, 40, 130);
    return c.toDataURL('image/png');
}

export default function ImageEditorPage() {
    const t = useShowcaseImageEditorI18n();
    const sampleImage = useMemo(
        () => makeSamplePng(t.labels.sampleTitle, t.labels.sampleSubtitle),
        [t.labels.sampleSubtitle, t.labels.sampleTitle],
    );
    const propsConfig = useMemo<PropDef[]>(() => ([
        { name: 'src', type: 'string', required: true, description: t.propsDocs.items.src.description },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, default: t.propsDocs.items.title.default },
        { name: 'width', type: 'number', description: t.propsDocs.items.width.description, default: t.propsDocs.items.width.default },
        { name: 'height', type: 'number', description: t.propsDocs.items.height.description, default: t.propsDocs.items.height.default },
        { name: 'mode', type: '"modal" | "inline"', description: t.propsDocs.items.mode.description, default: t.propsDocs.items.mode.default },
        { name: 'onImageLoad', type: '() => void', description: t.propsDocs.items.onImageLoad.description },
        { name: 'onClose', type: '() => void', description: t.propsDocs.items.onClose.description },
        { name: 'onSave', type: '(dataUrl: string) => void | Promise<void>', description: t.propsDocs.items.onSave.description },
    ]), [t]);
    const [modalOpen, setModalOpen] = useState(false);
    const [savedDataUrl, setSavedDataUrl] = useState<string | null>(null);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.inlineEditor.title}
                description={t.sections.inlineEditor.description}
                preview={(
                    <div className="w-full">
                        <ImageEditor
                            src={sampleImage}
                            width={700}
                            height={400}
                            onSave={(dataUrl) => setSavedDataUrl(dataUrl)}
                        />
                        {savedDataUrl && (
                            <div className="mt-4">
                                <p className="mb-2 text-sm text-muted-foreground">{t.labels.lastSavedOutput}</p>
                                <img
                                    src={savedDataUrl}
                                    alt={t.labels.savedResultAlt}
                                    className="max-w-full rounded border border-border"
                                    style={{ maxHeight: 200 }}
                                />
                            </div>
                        )}
                    </div>
                )}
                code={`import { ImageEditor } from '@llmnative/react';

<ImageEditor
  src={imageSrc}
  width={700}
  height={400}
  onSave={(dataUrl) => uploadToStorage(dataUrl)}
/>`}
            />

            <Section
                title={t.sections.modalEditor.title}
                description={t.sections.modalEditor.description}
                preview={(
                    <div className="w-full">
                        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                            {t.labels.openEditorInModal}
                        </button>
                        {modalOpen && (
                            <ImageEditor
                                src={sampleImage}
                                title={t.labels.editPhoto}
                                mode="modal"
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
                                <p className="mb-2 text-sm text-muted-foreground">{t.labels.savedResult}</p>
                                <img
                                    src={savedDataUrl}
                                    alt={t.labels.savedAlt}
                                    className="max-w-xs rounded border border-border"
                                />
                            </div>
                        )}
                    </div>
                )}
                code={`import { ImageEditor } from '@llmnative/react';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Edit image</button>

{open && (
  <ImageEditor
    src={imageSrc}
    title="Edit photo"
    mode="modal"
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

            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
