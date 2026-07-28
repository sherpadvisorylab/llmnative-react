import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Prompt as PromptConf } from '../../conf/Prompt';
import { useI18n } from '../../I18n';
import { Dropdown, DropdownItem } from '../blocks/Dropdown';
import Icon from '../ui/Icon';
import {
    buildTextCommandContext,
    ContextMenu,
    CONTEXT_MENU_SEARCH_THRESHOLD,
    getAutoClosedSuffixLength,
    type ContextMenuItem,
    type EditorCommand,
    type EditorContext as ContextMenuEditorContext,
} from '../ui/fields/ContextMenu';
import { Wrapper } from '../ui/GridSystem';
import { useEditorHeight } from '../../libs/editorHeight';
import { useTheme } from '../../Theme';

/**
 * Chatbot — l'input/composer AI condiviso, estratto da `Prompt` (CR-071): textarea,
 * slash-command, allegati, model picker, dropdown tono/stile/lingua/voce/temperatura
 * opzionali, bottone invio/stop. NON dipende da `Form` (nessun `useFormContext`), NON
 * conosce provider AI/variabili di template — riceve solo ciò che gli viene passato e
 * restituisce a `onSubmit` il pacchetto risolto dell'interazione dell'utente. Chi lo usa
 * (`Prompt` in modalità RUN, o un consumer di conversazione multi-turno come Agentico nel
 * CMS) decide cosa fare con quel pacchetto — questa è la sua "politica", mai
 * responsabilità di Chatbot. Non renderizza una lista messaggi/transcript: quello resta
 * specifico di chi lo usa.
 */
export type ChatbotAction = {
    key: string;
    icon: string;
    label?: string;
    content?: React.ReactNode;
};

export interface ChatbotSubmitPayload {
    text: string;
    /** Grezzi — la conversione a un formato specifico (es. AIAttachment base64) resta
     * scelta del chiamante, mai di Chatbot. */
    files: File[];
    model: string;
    role?: string;
    voice?: string;
    style?: string;
    language?: string;
    temperature?: number;
}

export interface ChatbotModelOption {
    label: string;
    value: string;
}

export interface ChatbotProps {
    /** Attributo `name` nativo sulla textarea sottostante — puro attributo DOM, MAI un
     * binding a Form (Chatbot non lo legge/scrive): serve solo a chi ha bisogno di un
     * selettore stabile (test, e2e) sull'elemento reale. */
    name?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** Turno in corso — mai usato per disabilitare il click (vedi bottone invio/stop
     * sotto): uno stato "stopping" transitorio parte subito al click, indipendente dal
     * vero completamento dell'abort. */
    running?: boolean;
    onStop?: () => void;
    /** "Non posso inviare ora" — il motivo (AI non configurata, ecc.) resta del chiamante,
     * Chatbot si limita a disabilitare il bottone invio. */
    disabled?: boolean;
    onSubmit: (payload: ChatbotSubmitPayload) => void;
    attachments?: boolean;
    commands?: EditorCommand[];
    commandsTrigger?: string;
    models?: ChatbotModelOption[];
    selectedModel?: string;
    onModelChange?: (id: string) => void;
    /** Dropdown ruolo/lingua/voce/stile/temperatura — stato interno non controllato
     * (seedato da default*), incluso nel payload di ogni submit. Default `false`: un
     * consumer di chat libera (Agentico) non ne ha bisogno. */
    showSettings?: boolean;
    defaultRole?: string;
    defaultVoice?: string;
    defaultStyle?: string;
    defaultLanguage?: string;
    defaultTemperature?: number;
    actions?: ChatbotAction[];
    minHeight?: number;
    maxHeight?: number;
    wrapperClassName?: string;
    className?: string;
}

const chatbotGhostIcon = 'h-7 w-7 cursor-pointer rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
const chatbotModelTrigger = 'h-7 max-w-[140px] rounded-md px-2 text-xs gap-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground truncate';
const chatbotTextareaClass = 'w-full resize-none border-0 bg-transparent px-4 py-3 text-sm shadow-none outline-none focus-visible:ring-0 placeholder:text-muted-foreground';

function modelShortLabel(modelRef?: string): string | null {
    if (!modelRef) return null;
    const afterSlash = modelRef.includes('/') ? modelRef.split('/').pop() : modelRef;
    return afterSlash || modelRef;
}

export function Chatbot({
    name,
    value,
    onChange,
    placeholder,
    running = false,
    onStop,
    disabled = false,
    onSubmit,
    attachments = false,
    commands,
    commandsTrigger,
    models = [],
    selectedModel,
    onModelChange,
    showSettings = false,
    defaultRole = '',
    defaultVoice = '',
    defaultStyle = '',
    defaultLanguage = '',
    defaultTemperature,
    actions,
    minHeight = 96,
    maxHeight = 220,
    wrapperClassName,
    className,
}: ChatbotProps) {
    const theme = useTheme('prompt');
    const dict = useI18n('prompt');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const attachInputRef = useRef<HTMLInputElement>(null);
    const fieldId = useId();

    const [attachedFiles, setAttachedFiles] = useState<{ file: File; objectUrl: string }[]>([]);
    const [dragActive, setDragActive] = useState(false);
    // Contatore invece di un booleano semplice — il drag over l'area attraversa più
    // elementi figli (attachment tray, textarea, toolbar), ognuno genera un proprio
    // dragenter/dragleave: senza contare gli "enter" pendenti, il dragleave del figlio
    // interno disattiva l'overlay mentre il puntatore è ancora dentro il wrapper esterno.
    const dragCounterRef = useRef(0);
    const [stopping, setStopping] = useState(false);
    const [role, setRole] = useState(defaultRole);
    const [voice, setVoice] = useState(defaultVoice);
    const [style, setStyle] = useState(defaultStyle);
    const [language, setLanguage] = useState(defaultLanguage);
    const [temperature, setTemperature] = useState<number | undefined>(defaultTemperature);

    useEffect(() => { if (!running) setStopping(false); }, [running]);

    useEffect(() => {
        return () => { attachedFiles.forEach(({ objectUrl }) => URL.revokeObjectURL(objectUrl)); };
    }, [attachedFiles]);

    const removeAttachment = useCallback((idx: number) => {
        setAttachedFiles((prev) => {
            URL.revokeObjectURL(prev[idx].objectUrl);
            return prev.filter((_, i) => i !== idx);
        });
    }, []);

    // Condiviso tra il file input nascosto e il drop handler sotto — stessa conversione a
    // objectUrl in entrambi i casi, un solo posto che decide come un File "grezzo" diventa
    // un allegato in coda.
    const addFiles = useCallback((files: FileList | File[]) => {
        const newFiles = Array.from(files).map((file) => ({ file, objectUrl: URL.createObjectURL(file) }));
        setAttachedFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        if (!attachments || !e.dataTransfer.types.includes('Files')) return;
        e.preventDefault();
        dragCounterRef.current += 1;
        setDragActive(true);
    }, [attachments]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        if (!attachments || !e.dataTransfer.types.includes('Files')) return;
        e.preventDefault();
    }, [attachments]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        if (!attachments) return;
        e.preventDefault();
        dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
        if (dragCounterRef.current === 0) setDragActive(false);
    }, [attachments]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        if (!attachments) return;
        e.preventDefault();
        dragCounterRef.current = 0;
        setDragActive(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [attachments, addFiles]);

    // Auto-grow — stessa logica di TextArea (react/src/components/ui/fields/Input.tsx),
    // riapplicata qui perché TextArea è vincolato a useFormContext e Chatbot non deve
    // dipendere da Form.
    const height = useEditorHeight({ minHeight, maxHeight });
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        const nextHeight = Math.max(el.scrollHeight, height.resolvedMinHeight);
        const cappedHeight = height.resolvedMaxHeight ? Math.min(nextHeight, height.resolvedMaxHeight) : nextHeight;
        el.style.height = `${cappedHeight}px`;
        el.style.overflowY = height.resolvedMaxHeight && nextHeight > height.resolvedMaxHeight ? 'auto' : 'hidden';
    }, [value, height.resolvedMinHeight, height.resolvedMaxHeight]);

    const resolvedCommandsTrigger = commands?.length ? (commandsTrigger ?? '/') : undefined;
    const commandsSearchable = (commands?.length ?? 0) >= CONTEXT_MENU_SEARCH_THRESHOLD;
    const commandLookup = React.useMemo(
        () => new Map((commands ?? []).map((cmd) => [cmd.name, cmd])),
        [commands],
    );
    const commandMenuItems = React.useMemo(
        () => (commands ?? []).map((cmd) => ({
            key: cmd.name,
            label: `${resolvedCommandsTrigger ?? '/'}${cmd.name}`,
            value: cmd.name,
            icon: cmd.icon,
        })),
        [commands, resolvedCommandsTrigger],
    );
    const applyCommandSelection = useCallback(async (item: ContextMenuItem, context: ContextMenuEditorContext) => {
        const cmd = commandLookup.get(item.value);
        if (!cmd) return;

        if (cmd.handler) {
            const newValue = await cmd.handler(buildTextCommandContext(context));
            const suffixLength = cmd.consumeSuffix
                ? getAutoClosedSuffixLength(context.textAfterCaret, cmd.consumeSuffix)
                : 0;
            context.replace(context.triggerRange.start, context.triggerRange.end + suffixLength, newValue);
            return;
        }

        context.replace(context.triggerRange.start, context.triggerRange.end, `${context.trigger}${cmd.name} `);
    }, [commandLookup]);

    const modelLabel = modelShortLabel(selectedModel);

    const handleSubmit = () => {
        if (disabled || running) return;
        const files = attachedFiles.map((a) => a.file);
        onSubmit({
            text: value,
            files,
            model: selectedModel ?? '',
            ...(showSettings ? { role, voice, style, language, temperature } : {}),
        });
        attachedFiles.forEach(({ objectUrl }) => URL.revokeObjectURL(objectUrl));
        setAttachedFiles([]);
    };

    const handleClick = () => {
        if (running) { setStopping(true); onStop?.(); return; }
        handleSubmit();
    };

    const textarea = (
        <textarea
            id={fieldId}
            name={name}
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={className || chatbotTextareaClass}
            style={{ maxHeight }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !resolvedCommandsTrigger) {
                    e.preventDefault();
                    handleClick();
                }
            }}
        />
    );

    return (
        <Wrapper className={wrapperClassName || theme.Prompt.wrapperClassName}>
            <div
                className={`group relative rounded-xl border shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 ${
                    dragActive ? 'border-primary ring-2 ring-primary' : 'border-input'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {attachments && dragActive && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-primary/5">
                        <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-primary shadow">
                            <Icon name="paperclip" size={13} />
                            {dict.dropFilesHere}
                        </div>
                    </div>
                )}
                <div className="overflow-hidden rounded-t-xl">
                    {attachedFiles.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto border-b border-input px-3 py-2.5">
                            {attachedFiles.map(({ file, objectUrl }, i) => (
                                <div key={objectUrl} className="relative shrink-0">
                                    {file.type.startsWith('image/') ? (
                                        <div className="h-16 w-16 overflow-hidden rounded-lg border border-input bg-muted/30">
                                            <img src={objectUrl} alt={file.name} className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-2.5 py-2 text-xs">
                                            <Icon name="file-text" size={18} className="shrink-0 text-muted-foreground" />
                                            <div className="max-w-[100px]">
                                                <p className="truncate font-medium text-foreground">{file.name}</p>
                                                <p className="text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="absolute -right-1.5 -top-1.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow"
                                        onClick={() => removeAttachment(i)}
                                    >
                                        <Icon name="x" size={9} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {resolvedCommandsTrigger && commandMenuItems.length > 0 ? (
                        <ContextMenu
                            trigger={resolvedCommandsTrigger}
                            searchable={commandsSearchable}
                            onSelect={(item, context) => { void applyCommandSelection(item, context); }}
                        >
                            {commandMenuItems.map((item) => (
                                <ContextMenu.Item key={item.key} label={item.label} value={item.value} icon={item.icon} />
                            ))}
                            {textarea}
                        </ContextMenu>
                    ) : textarea}
                </div>

                {attachments && (
                    <input
                        ref={attachInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) {
                                addFiles(e.target.files);
                                e.target.value = '';
                            }
                        }}
                    />
                )}

                <div className="relative flex items-center gap-1 rounded-b-xl border-t border-input px-2 py-1">
                    {(attachments || (actions?.length ?? 0) > 0) && (
                        <>
                            {attachments && (
                                <button
                                    type="button"
                                    title={dict.attachFiles}
                                    className={`${chatbotGhostIcon} flex items-center justify-center`}
                                    onClick={() => attachInputRef.current?.click()}
                                >
                                    <Icon name="paperclip" size={13} />
                                </button>
                            )}
                            {actions?.map((action) => (
                                action.content ? (
                                    <Dropdown
                                        key={action.key}
                                        trigger={{ icon: action.icon, title: action.label }}
                                        placement="top"
                                        position="start"
                                        triggerClassName={chatbotGhostIcon}
                                    >
                                        {action.content}
                                    </Dropdown>
                                ) : (
                                    <button
                                        key={action.key}
                                        type="button"
                                        title={action.label}
                                        className={`${chatbotGhostIcon} flex items-center justify-center`}
                                    >
                                        <Icon name={action.icon} size={13} />
                                    </button>
                                )
                            ))}
                            <div className="mx-1 h-4 w-px shrink-0 bg-border" />
                        </>
                    )}

                    {models.length > 0 && (
                        <Dropdown
                            trigger={{ icon: 'cpu', text: modelLabel ?? dict.defaultOption }}
                            placement="top"
                            position="start"
                            triggerClassName={chatbotModelTrigger}
                        >
                            {models.map((opt) => (
                                <DropdownItem key={opt.value} onClick={() => onModelChange?.(opt.value)}>
                                    {opt.label}
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    )}

                    {showSettings && (
                        <>
                            <Dropdown trigger={{ icon: 'user', title: 'Role' }} placement="top" position="start" triggerClassName={chatbotGhostIcon}>
                                <DropdownItem onClick={() => setRole('')}>{dict.defaultOption}</DropdownItem>
                                {PromptConf.getRoles().map((v) => (
                                    <DropdownItem key={v} onClick={() => setRole(v)}>{v}</DropdownItem>
                                ))}
                            </Dropdown>
                            <Dropdown trigger={{ icon: 'globe', title: 'Language' }} placement="top" position="start" triggerClassName={chatbotGhostIcon}>
                                <DropdownItem onClick={() => setLanguage('')}>{dict.defaultOption}</DropdownItem>
                                {PromptConf.getLangs().map((v) => (
                                    <DropdownItem key={v} onClick={() => setLanguage(v)}>{v}</DropdownItem>
                                ))}
                            </Dropdown>
                            <Dropdown trigger={{ icon: 'mic', title: 'Voice' }} placement="top" position="start" triggerClassName={chatbotGhostIcon}>
                                <DropdownItem onClick={() => setVoice('')}>{dict.defaultOption}</DropdownItem>
                                {PromptConf.getVoices().map((v) => (
                                    <DropdownItem key={v} onClick={() => setVoice(v)}>{v}</DropdownItem>
                                ))}
                            </Dropdown>
                            <Dropdown trigger={{ icon: 'feather', title: 'Style' }} placement="top" position="start" triggerClassName={chatbotGhostIcon}>
                                <DropdownItem onClick={() => setStyle('')}>{dict.defaultOption}</DropdownItem>
                                {PromptConf.getStyles().map((v) => (
                                    <DropdownItem key={v} onClick={() => setStyle(v)}>{v}</DropdownItem>
                                ))}
                            </Dropdown>
                            <Dropdown trigger={{ icon: 'thermometer', title: 'Temperature' }} placement="top" position="start" triggerClassName={chatbotGhostIcon}>
                                <DropdownItem>
                                    <input
                                        type="range"
                                        aria-label="Temperature"
                                        min={0} max={1} step={0.1}
                                        value={temperature ?? 0}
                                        onChange={(e) => setTemperature(Number(e.target.value))}
                                        className="w-full cursor-pointer accent-primary"
                                    />
                                </DropdownItem>
                            </Dropdown>
                        </>
                    )}

                    <div className="flex-1" />

                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={running ? !onStop : disabled}
                        title={stopping ? 'Stopping…' : running ? 'Stop' : dict.run}
                        aria-label={stopping ? 'Stopping…' : running ? 'Stop' : dict.run}
                        className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            running ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                    >
                        {stopping || (running && !onStop)
                            ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            : <Icon name={running ? 'square' : 'send'} size={14} />}
                    </button>
                </div>
            </div>
        </Wrapper>
    );
}

export default Chatbot;
