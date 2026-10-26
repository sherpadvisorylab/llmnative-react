import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '../../../libs/cn';
import { highlightCode, resolvePrismLanguage } from '../../../libs/prism';
import { repairStreamingMarkdown } from '../../../libs/streamingMarkdown';
import { useI18n } from '../../../I18n';
import Icon from '../../ui/Icon';

/** Classes for the parts of a `ChatMarkdown`, added to the defaults. */
export interface ChatMarkdownClassNames {
    root?: string;
    paragraph?: string;
    heading?: string;
    list?: string;
    blockquote?: string;
    /** The scrolling box around a table. */
    tableWrapper?: string;
    table?: string;
    th?: string;
    td?: string;
    codeBlock?: string;
    codeHeader?: string;
    code?: string;
    inlineCode?: string;
    link?: string;
}

export interface ChatMarkdownProps {
    /** GitHub-flavoured Markdown of the message. */
    content: string;
    /**
     * The text is still arriving: what its end left open (a code fence, a table header, `**bold`,
     * a link) is closed before rendering, so the layout does not jump. Leave it off for a finished message.
     */
    streaming?: boolean;
    /** `muted` for secondary text, such as the reasoning of the model. */
    tone?: 'default' | 'muted';
    /** Syntax highlighting of fenced code (Prism, loaded on demand). Default `true`. */
    highlight?: boolean;
    /** Called on a link to a route of the app (not an address, not `#anchor`); it prevents the navigation. */
    onLinkClick?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
    /** Overrides of single elements, as in `react-markdown`. */
    components?: Components;
    className?: string;
    classNames?: ChatMarkdownClassNames;
}

const isExternalLink = (href: string): boolean =>
    /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');

const getText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getText).join('');
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) return getText(node.props.children);
    return '';
};

const getCodeLanguage = (node: React.ReactNode): string | undefined => {
    const child = Array.isArray(node) ? node[0] : node;
    if (!React.isValidElement<{ className?: string }>(child)) return undefined;
    return /language-([\w#+-]+)/.exec(child.props.className || '')?.[1];
};

interface ChatCodeBlockProps {
    code: string;
    language?: string;
    highlight: boolean;
    classNames?: ChatMarkdownClassNames;
}

/** A fenced code block: language, copy button, highlighting that keeps the last result while the code grows. */
function ChatCodeBlock({ code, language, highlight, classNames }: ChatCodeBlockProps) {
    const dict = useI18n('code');
    const [copied, setCopied] = React.useState(false);
    const [html, setHtml] = React.useState<string | null>(null);
    const prismLanguage = highlight ? resolvePrismLanguage(language) : undefined;

    React.useEffect(() => {
        if (!prismLanguage) { setHtml(null); return; }
        let current = true;
        void highlightCode(code, prismLanguage).then((result) => {
            if (current) setHtml(result);
        });
        return () => { current = false; };
    }, [code, prismLanguage]);

    React.useEffect(() => {
        if (!copied) return;
        const timer = window.setTimeout(() => setCopied(false), 1600);
        return () => window.clearTimeout(timer);
    }, [copied]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className={cn('rf-chat-code my-3 min-w-0 overflow-hidden rounded-md border border-border bg-muted/40', classNames?.codeBlock)}>
            <div className={cn('flex h-8 items-center justify-between gap-2 border-b border-border px-3', classNames?.codeHeader)}>
                <span className="truncate font-mono text-xs text-muted-foreground">{language || dict.codeLanguageDefault}</span>
                <button
                    type="button"
                    onClick={copy}
                    aria-label={copied ? dict.copied : dict.copyCode}
                    title={copied ? dict.copied : dict.copyCode}
                    className="inline-flex h-6 items-center gap-1 rounded px-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Icon name={copied ? 'check' : 'copy'} size={13} />
                    <span>{copied ? dict.copied : dict.copy}</span>
                </button>
            </div>
            <pre className="m-0 overflow-x-auto p-3 text-xs leading-relaxed">
                {html !== null
                    ? <code className={cn(`language-${prismLanguage}`, classNames?.code)} dangerouslySetInnerHTML={{ __html: html }} />
                    : <code className={cn(language ? `language-${language}` : undefined, classNames?.code)}>{code}</code>}
            </pre>
        </div>
    );
}

function createComponents(
    classNames: ChatMarkdownClassNames | undefined,
    highlight: boolean,
    onLinkClick: ChatMarkdownProps['onLinkClick'],
): Components {
    const heading = (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'): Components['h1'] => function Heading({ className, node: _node, ...props }) {
        const size = tag === 'h1' ? 'text-lg' : tag === 'h2' ? 'text-base' : 'text-sm';
        return React.createElement(tag, { className: cn('mb-2 mt-4 font-semibold first:mt-0', size, classNames?.heading, className), ...props });
    };
    return {
        h1: heading('h1'),
        h2: heading('h2'),
        h3: heading('h3'),
        h4: heading('h4'),
        h5: heading('h5'),
        h6: heading('h6'),
        p: ({ className, node: _node, ...props }) => <p className={cn('my-2 first:mt-0 last:mb-0', classNames?.paragraph, className)} {...props} />,
        ul: ({ className, node: _node, ...props }) => <ul className={cn('my-2 ms-5 list-disc space-y-1 first:mt-0 last:mb-0 [&_ul]:my-1 [&_ol]:my-1', classNames?.list, className)} {...props} />,
        ol: ({ className, node: _node, ...props }) => <ol className={cn('my-2 ms-5 list-decimal space-y-1 first:mt-0 last:mb-0 [&_ul]:my-1 [&_ol]:my-1', classNames?.list, className)} {...props} />,
        li: ({ className, node: _node, ...props }) => <li className={cn('ps-1 [&>p]:my-1', className)} {...props} />,
        blockquote: ({ className, node: _node, ...props }) => (
            <blockquote className={cn('my-2 border-s-4 border-border ps-3 text-muted-foreground', classNames?.blockquote, className)} {...props} />
        ),
        table: ({ className, node: _node, ...props }) => (
            <div className={cn('my-3 max-w-full overflow-x-auto rounded-md border border-border', classNames?.tableWrapper)}>
                <table className={cn('w-max min-w-full border-collapse text-xs', classNames?.table, className)} {...props} />
            </div>
        ),
        th: ({ className, node: _node, ...props }) => <th className={cn('border-b border-border bg-muted px-3 py-1.5 text-start font-semibold whitespace-nowrap', classNames?.th, className)} {...props} />,
        td: ({ className, node: _node, ...props }) => <td className={cn('max-w-[24rem] border-t border-border px-3 py-1.5 align-top', classNames?.td, className)} {...props} />,
        hr: ({ className, node: _node, ...props }) => <hr className={cn('my-4 border-border', className)} {...props} />,
        img: ({ className, node: _node, alt, ...props }) => <img className={cn('my-2 max-w-full rounded-md', className)} alt={alt ?? ''} loading="lazy" {...props} />,
        a: ({ className, href = '', onClick, node: _node, ...props }) => {
            const external = isExternalLink(href);
            return (
                <a
                    className={cn('font-medium text-primary underline-offset-2 hover:underline', classNames?.link, className)}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    onClick={(event) => {
                        onClick?.(event);
                        if (!event.defaultPrevented && onLinkClick && href && !external && !href.startsWith('#')) {
                            event.preventDefault();
                            onLinkClick(href, event);
                        }
                    }}
                    {...props}
                />
            );
        },
        pre: ({ children }) => (
            <ChatCodeBlock code={getText(children).replace(/\n$/, '')} language={getCodeLanguage(children)} highlight={highlight} classNames={classNames} />
        ),
        code: ({ className, children, node: _node, ...props }) => (
            <code className={cn('rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]', classNames?.inlineCode, className)} {...props}>{children}</code>
        ),
        input: ({ className, node: _node, ...props }) => <input className={cn('me-1.5 align-middle', className)} disabled {...props} />,
    };
}

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeSanitize];

/**
 * CR-109 — Markdown of a chat message: GFM (tables, task lists, strikethrough, autolinks), compact
 * spacing, tables that scroll inside themselves, code with highlighting and a copy button, links to
 * addresses in a new tab. Sanitized (`rehype-sanitize`): raw HTML and `javascript:` links are dropped.
 * With `streaming` the end of the text is repaired as it arrives.
 */
export default function ChatMarkdown({
    content,
    streaming = false,
    tone = 'default',
    highlight = true,
    onLinkClick,
    components,
    className,
    classNames,
}: ChatMarkdownProps) {
    const text = React.useMemo(() => (streaming ? repairStreamingMarkdown(content ?? '') : content ?? ''), [content, streaming]);
    const defaults = React.useMemo(() => createComponents(classNames, highlight, onLinkClick), [classNames, highlight, onLinkClick]);
    const merged = React.useMemo(() => ({ ...defaults, ...components }), [defaults, components]);

    return (
        <div
            className={cn(
                'rf-chat-markdown min-w-0 max-w-full break-words text-sm leading-relaxed',
                tone === 'muted' ? 'text-muted-foreground' : 'text-foreground',
                classNames?.root,
                className,
            )}
            aria-busy={streaming || undefined}
        >
            <ReactMarkdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS} components={merged}>
                {text}
            </ReactMarkdown>
        </div>
    );
}
