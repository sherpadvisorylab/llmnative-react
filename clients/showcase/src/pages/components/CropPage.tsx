import React from 'react';
import { CropImage, Form, UploadImage } from '@llmnative/react';
import type { CropProps, FileProps } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDocsInput } from '../../docs-kit/docs/propDocs.types';

const demoSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <circle cx="1040" cy="180" r="120" fill="rgba(255,255,255,0.18)"/>
  <circle cx="220" cy="560" r="150" fill="rgba(255,255,255,0.12)"/>
  <rect x="96" y="96" width="420" height="220" rx="24" fill="rgba(255,255,255,0.12)"/>
  <text x="120" y="184" fill="white" font-size="76" font-family="Arial, sans-serif" font-weight="700">Acme Studio</text>
  <text x="120" y="254" fill="rgba(255,255,255,0.88)" font-size="34" font-family="Arial, sans-serif">Hero image for crop variants</text>
</svg>
`);

const demoFile: FileProps = {
    key: 'acme-hero.png',
    fileName: 'acme-hero.png',
    size: 128000,
    type: 'image/png',
    progress: 100,
    url: `data:image/svg+xml;charset=utf-8,${demoSvg}`,
    variants: {},
};

const cropVariantShape = `type CropProps = {
  fileName: string;
  type: string;
  scale: string;
  top: number;
  left: number;
  width: number;
  height: number;
  base64?: string;
}`;

const cropPropsDocs: PropDocsInput[] = [
    {
        name: 'img',
        type: 'FileProps & { variants: Record<string, CropProps> }',
        required: true,
        description: 'Source image plus any previously-saved crop variants.',
        shape: `type FileProps = {
  key: string;
  fileName: string;
  size: number;
  type: string;
  progress: number;
  url: string;
  base64?: string;
  variants: Record<string, CropProps>;
}`,
    },
    {
        name: 'title',
        type: 'string',
        description: 'Optional heading rendered above the crop workspace.',
    },
    {
        name: 'scales',
        type: 'Record<string, number>',
        description: 'Aspect ratio registry. Defaults to 1:1, 3:4 and 4:3.',
        example: `{
  "1:1": 1,
  "16:9": 16 / 9,
  "3:4": 3 / 4
}`,
    },
    {
        name: 'ref.handleSave()',
        type: '() => { fileName: string; variants: Record<string, CropProps> }',
        description: 'Imperative API used by UploadImage to collect the final crop payload before save.',
        shape: cropVariantShape,
    },
];

export default function CropPage() {
    const cropRef = React.useRef<{ handleSave: () => { fileName: string; variants: Record<string, CropProps> } } | null>(null);
    const [savedPreview, setSavedPreview] = React.useState<string[]>([]);

    const handleCapture = () => {
        const result = cropRef.current?.handleSave();
        if (!result) return;
        setSavedPreview(Object.keys(result.variants));
    };

    return (
        <PageLayout
            title="Crop"
            description="Image crop workspace used by UploadImage when editable variants are enabled. It keeps variant ratios consistent and returns base64 payloads on save."
        >
            <Section
                title="UploadImage integration"
                description="In real forms you usually reach the crop workflow through UploadImage with editable previews."
                preview={(
                    <Form appearance="empty">
                        <UploadImage
                            name="hero"
                            label="Hero image"
                            editable
                            previewWidth={160}
                            previewHeight={104}
                        />
                    </Form>
                )}
                code={`import { Form, UploadImage } from '@llmnative/react';

<Form>
  <UploadImage
    name="hero"
    label="Hero image"
    editable
    previewWidth={160}
    previewHeight={104}
  />
</Form>`}
            />

            <Section
                title="Standalone CropImage"
                description="CropImage can also be embedded directly when you need a custom asset workflow outside UploadImage."
                preview={(
                    <div className="w-full space-y-4">
                        <div className="h-[32rem] overflow-hidden rounded-xl border bg-card p-4">
                            <CropImage
                                ref={cropRef}
                                img={demoFile}
                                title="Hero variants"
                                scales={{
                                    '1:1': 1,
                                    '3:4': 3 / 4,
                                    '4:3': 4 / 3,
                                    '16:9': 16 / 9,
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCapture}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Read handleSave()
                            </button>
                            <span className="text-sm text-muted-foreground">
                                {savedPreview.length > 0
                                    ? `Captured variants: ${savedPreview.join(', ')}`
                                    : 'Move and resize the crop box, then read the generated variants.'}
                            </span>
                        </div>
                    </div>
                )}
                code={`import { CropImage } from '@llmnative/react';

const cropRef = useRef(null);

<CropImage
  ref={cropRef}
  img={file}
  scales={{ '1:1': 1, '16:9': 16 / 9 }}
/>;

const result = cropRef.current?.handleSave();`}
            />

            <PropDocsTable props={cropPropsDocs} />
        </PageLayout>
    );
}
