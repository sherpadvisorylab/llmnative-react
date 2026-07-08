import React, { useId, useEffect, useState, useCallback, useRef } from 'react';
import { Wrapper } from '../GridSystem';
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import { Label, FieldError, fieldFeedbackClass, fieldGroupClass, fieldAddonClass } from './Input';
import { cn } from '../../../libs/cn';
import { useTheme } from '../../../Theme';
import { useEditorHeight } from '../../../libs/editorHeight';
import Icon from '../Icon';
import type { FieldValue } from '../../../providers/data/DataProvider';
import type { Parser, TreeCursor } from '@lezer/common';
import {
    buildTextCommandContext,
    ContextMenu,
    CONTEXT_MENU_SEARCH_THRESHOLD,
    matchCommandTrigger,
    type ContextMenuHandle,
    type ContextMenuItem,
    type EditorCommand,
    type EditorContext,
} from './ContextMenu';

export type CodeEditorLanguage = 'liquid' | 'html' | 'json' | 'js' | 'ts' | 'css';

export interface CodeSyntaxErrorDetails {
    language: CodeEditorLanguage;
    from: number;
    to: number;
    line: number;
    column: number;
    nodeName?: string;
}

export class CodeSyntaxError extends Error {
    readonly language: CodeEditorLanguage;
    readonly from: number;
    readonly to: number;
    readonly line: number;
    readonly column: number;
    readonly nodeName?: string;

    constructor(message: string, details: CodeSyntaxErrorDetails) {
        super(message);
        this.name = 'CodeSyntaxError';
        this.language = details.language;
        this.from = details.from;
        this.to = details.to;
        this.line = details.line;
        this.column = details.column;
        this.nodeName = details.nodeName;
    }
}

export interface CodeValidationResult {
    valid: boolean;
    error?: CodeSyntaxError;
}

type ParserFactory = () => Promise<Parser>;

const parserCache: Partial<Record<Exclude<CodeEditorLanguage, 'liquid'>, Promise<Parser>>> = {};
let liquidEnginePromise: Promise<{ parse: (source: string) => unknown }> | null = null;

const getParserFactory = (language: Exclude<CodeEditorLanguage, 'liquid'>): ParserFactory => {
    switch (language) {
        case 'html':
            return async () => {
                const { html } = await import('@codemirror/lang-html');
                return html({ matchClosingTags: true }).language.parser;
            };
        case 'json':
            return async () => {
                const { json } = await import('@codemirror/lang-json');
                return json().language.parser;
            };
        case 'js':
            return async () => {
                const { javascript } = await import('@codemirror/lang-javascript');
                return javascript().language.parser;
            };
        case 'ts':
            return async () => {
                const { javascript } = await import('@codemirror/lang-javascript');
                return javascript({ typescript: true }).language.parser;
            };
        case 'css':
            return async () => {
                const { css } = await import('@codemirror/lang-css');
                return css().language.parser;
            };
    }
};

const getParser = (language: Exclude<CodeEditorLanguage, 'liquid'>): Promise<Parser> => {
    parserCache[language] ??= getParserFactory(language)();
    return parserCache[language]!;
};

const getLiquidEngine = async (): Promise<{ parse: (source: string) => unknown }> => {
    // Keep Liquid validation out of the initial bundle and load it only on demand.
    liquidEnginePromise ??= import('liquidjs').then(({ Liquid }) => new Liquid({
        strictFilters: true,
        strictVariables: true,
    }));
    return liquidEnginePromise;
};

const getLineColumn = (source: string, offset: number) => {
    let line = 1;
    let column = 1;

    for (let i = 0; i < offset && i < source.length; i++) {
        if (source[i] === '\n') {
            line += 1;
            column = 1;
        } else {
            column += 1;
        }
    }

    return { line, column };
};

const buildSyntaxError = (
    code: string,
    language: CodeEditorLanguage,
    from: number,
    to: number,
    nodeName?: string,
    label = 'Syntax error'
) => {
    const { line, column } = getLineColumn(code, from);
    const suffix = nodeName ? ` near ${nodeName}` : '';
    return new CodeSyntaxError(
        `${label}${suffix} at line ${line}, column ${column}.`,
        { language, from, to, line, column, nodeName }
    );
};

const findErrorNode = (cursor: TreeCursor): { from: number; to: number; nodeName?: string } | null => {
    do {
        if (cursor.type.isError) {
            return {
                from: cursor.from,
                to: cursor.to,
                nodeName: cursor.name,
            };
        }
    } while (cursor.next());

    return null;
};

export const validateCodeSyntax = async (code: string, language: CodeEditorLanguage): Promise<void> => {
    if (!code.trim()) return;

    if (language === 'liquid') {
        try {
            const liquid = await getLiquidEngine();
            liquid.parse(code);
        } catch (error) {
            if (error instanceof CodeSyntaxError) throw error;

            const maybeToken = error && typeof error === 'object' && 'token' in error
                ? (error as { token?: { begin?: number; end?: number; name?: string } }).token
                : undefined;
            const from = maybeToken?.begin ?? 0;
            const to = maybeToken?.end ?? from;
            const label = error instanceof Error
                ? error.message.split(', line:')[0]
                : 'Invalid Liquid syntax';

            throw buildSyntaxError(code, language, from, to, maybeToken?.name, label);
        }
        return;
    }

    try {
        const parser = await getParser(language);
        const tree = parser.parse(code);
        const errorNode = findErrorNode(tree.cursor());
        if (errorNode) {
            throw buildSyntaxError(code, language, errorNode.from, errorNode.to, errorNode.nodeName);
        }
    } catch (error) {
        if (error instanceof CodeSyntaxError) throw error;

        if (language === 'json' && error instanceof Error) {
            const match = error.message.match(/position\s+(\d+)/i);
            const offset = match ? Number(match[1]) : 0;
            throw buildSyntaxError(code, language, offset, offset, undefined, 'Invalid JSON');
        }

        throw new CodeSyntaxError(
            `Unable to validate ${language} code.`,
            { language, from: 0, to: 0, line: 1, column: 1 }
        );
    }
};

export const getCodeValidationResult = async (
    code: string,
    language: CodeEditorLanguage
): Promise<CodeValidationResult> => {
    try {
        await validateCodeSyntax(code, language);
        return { valid: true };
    } catch (error) {
        if (error instanceof CodeSyntaxError) {
            return { valid: false, error };
        }
        throw error;
    }
};

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
    validateSyntax?: boolean;
    validator?: (value: FieldValue) => string | undefined | Promise<string | undefined>;
    extensions?: unknown[];
    commands?: EditorCommand[];
    commandsTrigger?: string;
}

type CodeEditorCommandSession = {
    open: boolean;
    query: string;
    anchorPosition: { top: number; left: number } | null;
    editorContext: EditorContext | null;
};

const getLangLoader = (lang: CodeEditorLanguage): () => Promise<unknown> => {
    switch (lang) {
        case 'html':
            return () => import('@codemirror/lang-html').then(m => m.html());
        case 'liquid':
            return () => import('@codemirror/lang-liquid').then(m => m.liquid());
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
        keymap: view.keymap,
        language,
        Prec: state.Prec,
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

const getCodeEditorQueryMatch = (value: string, caret: number, trigger: string) => {
    return matchCommandTrigger(value, caret, trigger, {
        queryPattern: /^[A-Za-z0-9-]*$/,
    });
};

const buildCodeEditorCommandContext = (
    view: { state: { doc: { toString: () => string }; selection: { main: { from: number; to: number } } }; dispatch: (spec: { changes: { from: number; to: number; insert: string }; selection?: { anchor: number; head?: number } }) => void; focus: () => void; },
    trigger: string,
): EditorContext | null => {
    const value = view.state.doc.toString();
    const selection = view.state.selection.main;
    if (selection.from !== selection.to) return null;

    const match = getCodeEditorQueryMatch(value, selection.from, trigger);
    if (!match) return null;

    return {
        value,
        textBeforeCaret: value.slice(0, selection.from),
        textAfterCaret: value.slice(selection.to),
        trigger,
        query: match.query,
        triggerRange: { start: match.start, end: match.end },
        insert: (text: string) => {
            const currentSelection = view.state.selection.main;
            view.dispatch({
                changes: { from: currentSelection.from, to: currentSelection.to, insert: text },
                selection: { anchor: currentSelection.from + text.length },
            });
            view.focus();
        },
        replace: (start: number, end: number, text: string) => {
            view.dispatch({
                changes: { from: start, to: end, insert: text },
                selection: { anchor: start + text.length },
            });
            view.focus();
        },
    };
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    className = undefined,
    label,
    language = 'html',
    placeholder,
    minHeight,
    maxHeight,
    required,
    disabled,
    feedback,
    labelClassName,
    validateSyntax = true,
    validator,
    extensions: customExtensions,
    commands,
    commandsTrigger,
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
    const error = useFieldValidation(name, {
        required,
        label,
        validator: async (fieldValue) => {
            const nextValue = typeof fieldValue === 'string' ? fieldValue : `${fieldValue ?? ''}`;

            if (validateSyntax) {
                try {
                    await validateCodeSyntax(nextValue, language);
                } catch (validationError) {
                    if (validationError instanceof CodeSyntaxError) {
                        return validationError.message;
                    }
                    throw validationError;
                }
            }

            return await validator?.(fieldValue);
        },
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<{ destroy: () => void; dom: HTMLElement; scrollDOM: HTMLElement } | null>(null);
    const contextMenuRef = useRef<ContextMenuHandle | null>(null);
    const [loading, setLoading] = useState(true);
    const [commandSession, setCommandSession] = useState<CodeEditorCommandSession>({
        open: false,
        query: '',
        anchorPosition: null,
        editorContext: null,
    });

    const currentValueRef = useRef<string>((value as string) ?? '');
    const commandSessionRef = useRef(commandSession);
    commandSessionRef.current = commandSession;
    const resolvedCommandsTrigger = commands?.length ? (commandsTrigger ?? '/') : undefined;
    const commandsSearchable = (commands?.length ?? 0) >= CONTEXT_MENU_SEARCH_THRESHOLD;
    const commandLookup = React.useMemo(
        () => new Map((commands ?? []).map((command) => [command.name, command])),
        [commands],
    );
    const commandMenuItems = React.useMemo(
        () => (commands ?? []).map((command) => ({
            key: command.name,
            label: `${resolvedCommandsTrigger ?? '/'}${command.name}`,
            value: command.name,
            icon: command.icon,
        })),
        [commands, resolvedCommandsTrigger],
    );

    useEffect(() => {
        if (!viewRef.current) {
            currentValueRef.current = (value as string) ?? '';
        }
    }, [value]);

    const onUpdate = useCallback((newValue: string) => {
        currentValueRef.current = newValue;
        handleChange({ target: { name, value: newValue } });
    }, [handleChange, name]);

    const closeCommandMenu = useCallback(() => {
        setCommandSession({
            open: false,
            query: '',
            anchorPosition: null,
            editorContext: null,
        });
    }, []);

    const applyCommandSelection = useCallback(async (item: ContextMenuItem, context: EditorContext) => {
        const command = commandLookup.get(item.value);
        if (!command) return;

        if (command.handler) {
            const nextValue = await command.handler(buildTextCommandContext(context));
            context.replace(context.triggerRange.start, context.triggerRange.end, nextValue);
            return;
        }

        context.replace(
            context.triggerRange.start,
            context.triggerRange.end,
            `${context.trigger}${command.name} `,
        );
    }, [commandLookup]);

    useEffect(() => {
        let cancelled = false;
        let currentView: { destroy: () => void; dom: HTMLElement; scrollDOM: HTMLElement } | null = null;

        ensureCM(language).then(cm => {
            if (cancelled || !containerRef.current) return;

            const viewTheme = cm.EditorView.theme({
                '&': { backgroundColor: 'var(--rf-background)', height: '100%' },
                '.cm-scroller': {
                    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, monospace)',
                    paddingBottom: '0.5rem',
                },
                '.cm-content': {
                    caretColor: 'var(--rf-foreground)',
                    color: 'var(--rf-foreground)',
                    paddingBottom: '0.75rem',
                },
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
                ...(customExtensions ?? []),
            ];

            if (resolvedCommandsTrigger) {
                extensions.push(
                    cm.EditorView.updateListener.of((update: { state: { doc: { toString: () => string }; selection: { main: { from: number; to: number } } }; view: { coordsAtPos: (pos: number) => { left: number; bottom: number } | null; state: { doc: { toString: () => string }; selection: { main: { from: number; to: number } } }; dispatch: (spec: { changes: { from: number; to: number; insert: string }; selection?: { anchor: number; head?: number } }) => void; focus: () => void; } }) => {
                        const selection = update.state.selection.main;
                        if (selection.from !== selection.to) {
                            if (commandSessionRef.current.open) closeCommandMenu();
                            return;
                        }

                        const value = update.state.doc.toString();
                        const match = getCodeEditorQueryMatch(value, selection.from, resolvedCommandsTrigger);
                        if (!match) {
                            if (commandSessionRef.current.open) closeCommandMenu();
                            return;
                        }

                        const coords = update.view.coordsAtPos(selection.from);
                        const editorContext = buildCodeEditorCommandContext(update.view, resolvedCommandsTrigger);
                        if (!coords || !editorContext) return;

                        setCommandSession({
                            open: true,
                            query: match.query,
                            anchorPosition: { top: coords.bottom, left: coords.left },
                            editorContext,
                        });
                    }),
                    cm.Prec.highest(cm.keymap.of([
                        {
                            key: 'ArrowDown',
                            run: () => {
                                if (!commandSessionRef.current.open) return false;
                                contextMenuRef.current?.moveNext();
                                return true;
                            },
                        },
                        {
                            key: 'ArrowUp',
                            run: () => {
                                if (!commandSessionRef.current.open) return false;
                                contextMenuRef.current?.movePrev();
                                return true;
                            },
                        },
                        {
                            key: 'Enter',
                            run: () => {
                                if (!commandSessionRef.current.open) return false;
                                contextMenuRef.current?.selectActive();
                                return true;
                            },
                        },
                        {
                            key: 'Tab',
                            run: () => {
                                if (!commandSessionRef.current.open) return false;
                                contextMenuRef.current?.selectActive();
                                return true;
                            },
                        },
                        {
                            key: 'Escape',
                            run: () => {
                                if (!commandSessionRef.current.open) return false;
                                contextMenuRef.current?.close();
                                return true;
                            },
                        },
                    ])),
                    cm.EditorView.domEventHandlers({
                        keydown: (event: KeyboardEvent) => {
                            if (!commandSessionRef.current.open) return false;

                            switch (event.key) {
                                case 'ArrowDown':
                                    event.preventDefault();
                                    contextMenuRef.current?.moveNext();
                                    return true;
                                case 'ArrowUp':
                                    event.preventDefault();
                                    contextMenuRef.current?.movePrev();
                                    return true;
                                case 'Enter':
                                case 'Tab':
                                    event.preventDefault();
                                    contextMenuRef.current?.selectActive();
                                    return true;
                                case 'Escape':
                                    event.preventDefault();
                                    contextMenuRef.current?.close();
                                    return true;
                                default:
                                    return false;
                            }
                        },
                    }),
                );
            }

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
    }, [closeCommandMenu, customExtensions, disabled, language, onUpdate, placeholder, resolvedCommandsTrigger]);

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
        className,
        loading && 'flex items-center justify-center bg-muted text-muted-foreground text-sm',
        error && 'border-destructive',
        before ? 'rounded-l-none' : 'rounded-l-md',
        after ? 'rounded-r-none' : 'rounded-r-md',
    );

    const editorShell = (
        <div className={cn('min-w-0 flex-1', editorClass)}>
            {loading && (
                <div style={{ minHeight: height.resolvedMinHeight }} className="flex items-center justify-center">
                    <Icon name="loader-circle" size={16} className="animate-spin text-muted-foreground" />
                </div>
            )}
            <div ref={containerRef} className={cn(loading && 'hidden')} />
        </div>
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
                {resolvedCommandsTrigger && commandMenuItems.length > 0 ? (
                    <ContextMenu
                        ref={contextMenuRef}
                        trigger={resolvedCommandsTrigger}
                        searchable={commandsSearchable}
                        controlled={commandSession.editorContext ? {
                            open: commandSession.open,
                            anchorPosition: commandSession.anchorPosition,
                            query: commandSession.query,
                            editorContext: commandSession.editorContext,
                            onClose: closeCommandMenu,
                        } : undefined}
                        onSelect={(item, context) => {
                            void applyCommandSelection(item, context);
                        }}
                    >
                        {commandMenuItems.map((item) => (
                            <ContextMenu.Item
                                key={item.key}
                                label={item.label}
                                value={item.value}
                                icon={item.icon}
                            />
                        ))}
                        {editorShell}
                    </ContextMenu>
                ) : (
                    editorShell
                )}
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
