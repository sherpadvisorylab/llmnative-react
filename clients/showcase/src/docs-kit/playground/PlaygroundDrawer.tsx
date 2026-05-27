import React from 'react';
import PlaygroundAccordion from './PlaygroundAccordion';
import PlaygroundControls from './PlaygroundControls';
import MockDataEditor from './MockDataEditor';
import { usePlaygroundContext } from './PlaygroundProvider';
import type { PlaygroundConfig } from './playground.types';

interface PlaygroundDrawerProps {
    title: string;
    config: PlaygroundConfig;
    open: boolean;
    onClose: () => void;
}

export default function PlaygroundDrawer({ title, config, open, onClose }: PlaygroundDrawerProps) {
    const { environment } = usePlaygroundContext();
    const { Icon, Modal, MockProvider } = environment;
    const [props, setProps] = React.useState<Record<string, any>>(config.defaultProps);
    const [mockSeed, setMockSeed] = React.useState<Record<string, Record<string, any>>>(config.mockSeed ?? {});
    const [formValues, setFormValues] = React.useState<Record<string, any> | null>(null);

    React.useEffect(() => {
        setProps(config.defaultProps);
        setMockSeed(config.mockSeed ?? {});
        setFormValues(null);
    }, [config]);

    if (!open) return null;

    const updateProp = (name: string, value: any) => {
        setProps((prev) => ({ ...prev, [name]: value }));
    };

    const header = (
        <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
                <Icon name="play" size={15} className="shrink-0 text-primary" />
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold leading-none">Playground</h3>
                    <div className="mt-1 truncate text-sm text-muted-foreground">{title}</div>
                </div>
            </div>
        </div>
    );

    const rendered = config.render(props, setFormValues);
    const preview = config.mockSeed !== undefined && MockProvider
        ? <MockProvider seed={mockSeed}>{rendered}</MockProvider>
        : rendered;
    const splitLayout = config.layout === 'split';

    return (
        <Modal header={header} size={config.size ?? 'md'} onClose={onClose}>
            <div className={splitLayout ? 'grid h-full min-h-0 lg:grid-cols-[minmax(20rem,26rem)_1fr]' : 'flex h-full flex-col'}>
                <div className={splitLayout ? 'min-h-0 overflow-y-auto border-b px-4 pb-3 pt-4 lg:border-b-0 lg:border-r' : 'min-h-0 flex-1 overflow-y-auto border-b px-4 pb-3 pt-4'}>
                    <PlaygroundControls props={props} definitions={config.props} onUpdateProp={updateProp} />
                </div>

                <div className={splitLayout ? 'flex min-h-0 flex-col overflow-hidden' : 'shrink-0'}>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <PlaygroundAccordion Icon={Icon} icon="eye" label="Preview" defaultOpen>
                            <div className={splitLayout ? 'min-h-0 overflow-auto px-5 pb-5 pt-3' : 'min-h-72 overflow-auto px-4 pb-4 pt-2 pr-8'}>
                                <div className="min-w-0">
                                    {preview}
                                </div>
                            </div>
                        </PlaygroundAccordion>

                        {config.showFormRecord && (
                            <PlaygroundAccordion Icon={Icon} icon="code" label="Form record (JSON)" defaultOpen>
                                <div className="px-4 pb-4">
                                    <pre className="w-full overflow-x-auto whitespace-pre-wrap break-all rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground">
                                        {formValues !== null ? JSON.stringify(formValues, null, 2) : '- interact with the preview to see the record -'}
                                    </pre>
                                </div>
                            </PlaygroundAccordion>
                        )}
                    </div>

                    {config.mockSeed !== undefined && (
                        <div className="mt-auto shrink-0">
                            <MockDataEditor Icon={Icon} seed={mockSeed} onApply={setMockSeed} />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
