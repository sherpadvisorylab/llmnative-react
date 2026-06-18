import React, { useId, useEffect, useState, useCallback, useRef } from 'react';
import { Wrapper } from '../GridSystem';
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import { Label, FieldError, fieldFeedbackClass, fieldGroupClass, fieldAddonClass } from './Input';
import { cn } from '../../../libs/cn';
import { useTheme } from '../../../Theme';
import { useEditorHeight } from '../../../libs/editorHeight';

export type CodeEditorLanguage = 'liquid' | 'html' | 'json' | 'js' | 'ts' | 'css';

export interface CodeEditorProps extends FormFieldProps {
    language?: CodeEditorLanguage;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    feedback?: string;
    labelClassName?: string;
}

const getLangLoader = (lang: CodeEditorLanguage): () => Promise<unknown> => {
    switch (lang) {
        case 'html': case 'liquid':
            return () => import('@codemirror/lang-html').then(m => m.html());
        case 'json':
            return () => import('@codemirror/lang-json').then(m => m.json());
        case 'js':
            return () => import('@codemirror/lang-javascript').then(m => m.javascript());
        case 'ts':
            return () => import('@codemirror/lang-javascript').then(m => m.javascript({ typescript: true }));
        case 'css':
            return () => import('@codemirror/lang-css').then(m => m.css());
    }
};

const loadCM = async (lang: CodeEditorLanguage) => {
    const [codemirror, view, state, language] = await Promise.all([
        import('codemirror'),
        import('@codemirror/view'),
        import('@codemirror/state'),
        getLangLoader(lang)(),
    ]);
    return {
        basicSetup: codemirror.basicSetup,
        EditorView: view.EditorView,
        EditorState: state.EditorState,
        language,
    };
};

type CMModules = Awaited<ReturnType<typeof loadCM>>;

let _cmCache: Record<string, CMModules | null> = {};
let _cmPending: Record<string, Promise<CMModules> | null> = {};

const ensureCM = (lang: CodeEditorLanguage): Promise<CMModules> => {
    if (_cmCache[lang]) return Promise.resolve(_cmCache[lang]!);
    if (!_cmPending[lang]) {
        _cmPending[lang] = loadCM(lang).then(m => {
            _cmCache[lang] = m;
            return m;
        });
    }
    return _cmPending[lang]!;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    label,
    language = 'html',
    placeholder,
    minHeight,
    maxHeight,
    required,
    disabled,
    feedback,
    labelClassName,
    wrapperClassName,
    inheritWrapperClassName = true,
    before,
    after,
}) => {
    const id = useId();
    const themeCfg = useTheme('CodeEditor');
    const height = useEditorHeight({ minHeight, maxHeight });

    const { value, handleChange, formWrapClass } = useFormContext({
        name, onChange, defaultValue, wrapperClassName, inheritWrapperClassName,
    });
    const error = useFieldValidation(name, { required, label });

    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<{ destroy: () => void; dom: HTMLElement; scrollDOM: HTMLElement } | null>(null);
    const [loading, setLoading] = useState(true);

    const currentValueRef = useRef<string>((value as string) ?? '');

    useEffect(() => {
        currentValueRef.current = (value as string) ?? '';
    }, [value]);

    const onUpdate = useCallback((newValue: string) => {
        currentValueRef.current = newValue;
        handleChange({ target: { name, value: newValue } });
    }, [handleChange, name]);

    useEffect(() => {
        let cancelled = false;
        let currentView: { destroy: () => void; dom: HTMLElement; scrollDOM: HTMLElement } | null = null;

        ensureCM(language).then(cm => {
            if (cancelled || !containerRef.current) return;

            const viewTheme = cm.EditorView.theme({
                '&': { backgroundColor: 'var(--rf-background)', height: '100%' },
                '.cm-scroller': { fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, monospace)' },
                '.cm-content': { caretColor: 'var(--rf-foreground)', color: 'var(--rf-foreground)' },
                '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--rf-primary)' },
                '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
                    backgroundColor: 'var(--rf-primary)',
                },
                '.cm-activeLine': { backgroundColor: 'var(--rf-muted)' },
                '.cm-gutters': {
                    backgroundColor: 'var(--rf-muted)',
                    color: 'var(--rf-muted-foreground)',
                    border: 'none',
                },
                '.cm-activeLineGutter': { backgroundColor: 'var(--rf-accent)' },
                '.cm-foldPlaceholder': { backgroundColor: 'var(--rf-muted)', color: 'var(--rf-muted-foreground)' },
                '.cm-tooltip': {
                    backgroundColor: 'var(--rf-popover)',
                    border: '1px solid var(--rf-border)',
                    color: 'var(--rf-popover-foreground)',
                },
                '.cm-tooltip-autocomplete ul li[aria-selected]': {
                    backgroundColor: 'var(--rf-accent)',
                    color: 'var(--rf-accent-foreground)',
                },
                '&.cm-focused': { outline: 'none' },
                '.cm-placeholder': { color: 'var(--rf-muted-foreground)' },
            });

            const extensions: any[] = [
                cm.basicSetup,
                cm.language,
                viewTheme,
                cm.EditorView.updateListener.of((update: { docChanged: boolean; state: { doc: { toString: () => string } } }) => {
                    if (update.docChanged) {
                        onUpdate(update.state.doc.toString());
                    }
                }),
            ];

            if (disabled) {
                extensions.push(cm.EditorView.editable.of(false));
            }

            const state = cm.EditorState.create({
                doc: currentValueRef.current,
                extensions,
            });

            currentView = new cm.EditorView({
                state,
                parent: containerRef.current,
            });

            currentView.scrollDOM.style.minHeight = `${height.resolvedMinHeight}px`;
            if (height.resolvedMaxHeight) currentView.scrollDOM.style.maxHeight = `${height.resolvedMaxHeight}px`;

            viewRef.current = currentView;
            setLoading(false);
        }).catch(err => {
            if (!cancelled) {
                console.error('[CodeEditor] Failed to load CodeMirror:', err);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
            if (currentView) {
                currentView.destroy();
                viewRef.current = null;
            }
        };
    }, [language, placeholder, disabled, onUpdate]);

    useEffect(() => {
        const externalValue = (value as string) ?? '';
        const view = viewRef.current as { state: { doc: { length: number } }; dispatch: (spec: { changes: { from: number; to: number; insert: string } }) => void } | null;
        if (view && externalValue !== currentValueRef.current) {
            currentValueRef.current = externalValue;
            view.dispatch({
                changes: { from: 0, to: view.state.doc.length, insert: externalValue },
            });
        }
    }, [value]);

    useEffect(() => {
        const view = viewRef.current as { scrollDOM: HTMLElement } | null;
        if (!view) return;
        view.scrollDOM.style.minHeight = `${height.resolvedMinHeight}px`;
        if (height.resolvedMaxHeight) {
            view.scrollDOM.style.maxHeight = `${height.resolvedMaxHeight}px`;
        } else {
            view.scrollDOM.style.maxHeight = '';
        }
    }, [height.resolvedMinHeight, height.resolvedMaxHeight]);

    const editorClass = cn(
        'w-full overflow-hidden border border-input',
        themeCfg.CodeEditor?.className,
        loading && 'flex items-center justify-center bg-muted text-muted-foreground text-sm',
        error && 'border-destructive',
        before ? 'rounded-l-none' : 'rounded-l-md',
        after ? 'rounded-r-none' : 'rounded-r-md',
    );

    return (
        <Wrapper className={cn(formWrapClass, themeCfg.CodeEditor?.wrapperClassName)}>
            {label && <Label label={label} required={required} htmlFor={id} className={labelClassName} />}
            <div className={cn(before || after ? fieldGroupClass : '')}>
                {before && (
                    <span className={cn(fieldAddonClass, 'rounded-l-md rounded-r-none border-r-0')}>
                        {before}
                    </span>
                )}
                <div className={cn('min-w-0 flex-1', editorClass)}>
                    {loading && (
                        <div style={{ minHeight: height.resolvedMinHeight }} className="flex items-center justify-center">
                            <span>Loading editor…</span>
                        </div>
                    )}
                    <div ref={containerRef} className={cn(loading && 'hidden')} />
                </div>
                {after && (
                    <span className={cn(fieldAddonClass, 'rounded-l-none rounded-r-md border-l-0')}>
                        {after}
                    </span>
                )}
            </div>
            {error && <FieldError message={error} />}
            {feedback && <p className={fieldFeedbackClass}>{feedback}</p>}
        </Wrapper>
    );
};

export default CodeEditor;
