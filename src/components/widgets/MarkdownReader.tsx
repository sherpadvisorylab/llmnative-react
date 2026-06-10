import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '../../libs/cn';
import { copyToClipboard } from '../../libs/utils';
import { useHead, type PageMetadataState } from '../../Head';

type MarkdownComponents = Components;

export interface MarkdownReaderProps {
    content: string;
    components?: MarkdownComponents;
    className?: string;
    wrapperClassName?: string;
    metadata?: PageMetadataState;
    onInternalLinkClick?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface MarkdownCodeBlockProps {
    code: string;
    language?: string;
}

const isExternalLink = (href: string): boolean =>
    /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');

const isInternalLink = (href: string): boolean =>
    Boolean(href) && !isExternalLink(href) && !href.startsWith('#');

const isHashLink = (href: string): boolean =>
    href.startsWith('#');

const getText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getText).join('');
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) return getText(node.props.children);
    return '';
};

const getCodeLanguage = (node: React.ReactNode): string | undefined => {
    if (!React.isValidElement<{ className?: string }>(node)) return undefined;
    const match = /language-([\w-]+)/.exec(node.props.className || '');
    return match?.[1];
};

function MarkdownCodeBlock({ code, language }: MarkdownCodeBlockProps) {
    const [copied, setCopied] = React.useState(false);

    const copy = () => {
        copyToClipboard(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <div className="relative my-4 overflow-hidden rounded-md border bg-muted/50">
            <div className="flex h-9 items-center justify-between border-b px-3">
                <span className="text-xs font-medium text-muted-foreground">
                    {language || 'text'}
                </span>
                <button
                    type="button"
                    className="rounded border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={copy}
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <pre className="m-0 overflow-x-auto p-4 text-xs leading-relaxed">
                <code className={language ? `language-${language}` : undefined}>{code}</code>
            </pre>
        </div>
    );
}

const createDefaultComponents = (
    onInternalLinkClick?: MarkdownReaderProps['onInternalLinkClick']
): MarkdownComponents => ({
    h1: ({ className, ...props }) => <h1 className={cn('mt-8 scroll-m-20 text-3xl font-bold tracking-normal first:mt-0 [&>a]:no-underline [&>a:hover]:opacity-80', className)} {...props} />,
    h2: ({ className, ...props }) => <h2 className={cn('mt-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-normal first:mt-0 [&>a]:no-underline [&>a:hover]:opacity-80', className)} {...props} />,
    h3: ({ className, ...props }) => <h3 className={cn('mt-6 scroll-m-20 text-xl font-semibold tracking-normal [&>a]:no-underline [&>a:hover]:opacity-80', className)} {...props} />,
    h4: ({ className, ...props }) => <h4 className={cn('mt-5 scroll-m-20 text-base font-semibold tracking-normal [&>a]:no-underline [&>a:hover]:opacity-80', className)} {...props} />,
    p: ({ className, ...props }) => <p className={cn('my-4 leading-7 text-foreground', className)} {...props} />,
    ul: ({ className, ...props }) => <ul className={cn('my-4 ml-6 list-disc space-y-2', className)} {...props} />,
    ol: ({ className, ...props }) => <ol className={cn('my-4 ml-6 list-decimal space-y-2', className)} {...props} />,
    li: ({ className, ...props }) => <li className={cn('leading-7', className)} {...props} />,
    blockquote: ({ className, ...props }) => (
        <blockquote className={cn('my-4 border-l-4 border-primary bg-muted/40 px-4 py-3 text-sm text-muted-foreground', className)} {...props} />
    ),
    table: ({ className, ...props }) => (
        <div className="my-4 w-full overflow-x-auto">
            <table className={cn('w-full border-collapse text-sm', className)} {...props} />
        </div>
    ),
    th: ({ className, ...props }) => <th className={cn('border bg-muted px-3 py-2 text-left font-semibold', className)} {...props} />,
    td: ({ className, ...props }) => <td className={cn('border px-3 py-2 align-top', className)} {...props} />,
    hr: ({ className, ...props }) => <hr className={cn('my-8 border-border', className)} {...props} />,
    a: ({ className, href = '', onClick, ...props }) => (
        <a
            className={cn(
                isHashLink(href)
                    ? 'text-primary no-underline transition-opacity hover:opacity-80'
                    : 'font-medium text-primary no-underline transition-opacity hover:opacity-80',
                className
            )}
            href={href}
            target={isExternalLink(href) ? '_blank' : undefined}
            rel={isExternalLink(href) ? 'noreferrer' : undefined}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented && onInternalLinkClick && isInternalLink(href)) {
                    event.preventDefault();
                    onInternalLinkClick(href, event);
                }
            }}
            {...props}
        />
    ),
    pre: ({ children }) => (
        <MarkdownCodeBlock code={getText(children).replace(/\n$/, '')} language={getCodeLanguage(children)} />
    ),
    code: ({ className, children, ...props }: any) => { // CR-042: react-markdown ExtraProps lacks TS index signature; props shape is correct at runtime
        const isBlock = typeof className === 'string' && className.startsWith('language-');
        if (isBlock) return <code className={className} {...props}>{children}</code>;
        return (
            <code className={cn('rounded bg-muted px-1.5 py-0.5 text-[0.9em]', className)} {...props}>
                {children}
            </code>
        );
    },
    input: ({ className, ...props }) => (
        <input className={cn('mr-2 align-middle', className)} disabled {...props} />
    ),
});

export default function MarkdownReader({
    content,
    components,
    className,
    wrapperClassName,
    metadata,
    onInternalLinkClick,
}: MarkdownReaderProps) {
    const h1Title = React.useMemo(() => content.match(/^#[ \t]+(.+)/m)?.[1]?.trim(), [content]);
    const effectiveHead: PageMetadataState | undefined = (metadata || h1Title)
        ? { ...(metadata ?? {}), title: metadata?.title ?? h1Title }
        : undefined;
    useHead(effectiveHead);

    const defaultComponents = React.useMemo(
        () => createDefaultComponents(onInternalLinkClick),
        [onInternalLinkClick]
    );

    return (
        <div className={cn('rf-markdown-reader max-w-none text-sm text-foreground', wrapperClassName, className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    rehypeSanitize,
                ]}
                components={{ ...defaultComponents, ...components }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
