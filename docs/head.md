---
title: Head management
group: Architecture
order: 50
path: /docs/head
description: Manage document metadata, social tags, assets, PWA hints and structured data from React.
---

# Head management

`HeadProvider` is mounted by `App` and owns the browser `<head>`. The base HTML can stay minimal while pages and components declare the metadata they need through focused hooks.

The default document head is defined by the framework:

```tsx
export const DEFAULT_HEAD_APP_NAME = 'react-firestrap';
export const DEFAULT_DOCUMENT_HEAD = {
  charset: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
};
export const DEFAULT_LANGUAGE_HEAD = {
  lang: 'en',
};
```

`App` passes its `appName` to `HeadProvider`, so the app name becomes the default `<title>` until a page overrides it.

```tsx
<App appName="react-firestrap showcase" />;
```

## Page Metadata

Use `useHead` or the `<Head />` helper for page-level metadata: title, description and simple meta tags.

```tsx
import { Head, useHead } from 'react-firestrap';

function DocsPage() {
  useHead({
    title: 'Installation',
    description: 'Install react-firestrap in a Vite React project.',
  });

  return <main>...</main>;
}

function CompactDocsPage() {
  return <Head title="Quick start" description="Start a new react-firestrap app." />;
}
```

When a page unmounts, the previous metadata is restored. This lets the showcase use a default app title on the home page and page-specific titles inside Markdown docs.

## Document Metadata

Use `useDocumentHead` for technical document metadata such as charset, viewport, robots, canonical URLs, base URL, HTTP-equivalent meta tags and extra document links.

```tsx
import { useDocumentHead } from 'react-firestrap';

function ArticlePage() {
  useDocumentHead({
    robots: 'index,follow',
    canonical: 'https://example.test/docs/head',
    keywords: ['react', 'firestrap', 'head'],
    referrer: 'strict-origin-when-cross-origin',
    base: { href: 'https://example.test/' },
  });

  return <main>...</main>;
}
```

## Social Metadata

Use `useSocialHead` as the single entry point for Open Graph and Twitter metadata.

```tsx
import { useSocialHead } from 'react-firestrap';

function ShareablePage() {
  useSocialHead({
    openGraph: {
      title: 'Head management',
      type: 'article',
      url: 'https://example.test/docs/head',
      image: 'https://example.test/cover.png',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Head management',
      image: 'https://example.test/cover.png',
    },
  });

  return <main>...</main>;
}
```

## Language And Pagination

Use `useLanguageHead` for the current HTML language and alternate language links. It updates `<html lang>` and optional `dir`.

```tsx
useLanguageHead({
  lang: 'it',
  dir: 'ltr',
  alternates: [
    { hrefLang: 'en', href: 'https://example.test/en/docs/head' },
    { hrefLang: 'it', href: 'https://example.test/it/docs/head' },
  ],
});
```

Use `usePaginationHead` for `rel="prev"` and `rel="next"` links.

```tsx
usePaginationHead({
  prev: 'https://example.test/docs/page-1',
  next: 'https://example.test/docs/page-3',
});
```

## Assets And PWA

Use `useAssetsHead` for scripts, styles and fonts. A script or style item can include both external and inline content; they are rendered consecutively.

```tsx
useAssetsHead({
  fonts: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
      preconnect: ['https://fonts.gstatic.com'],
      crossOrigin: 'anonymous',
    },
  ],
  styles: [
    {
      href: '/docs.css',
      inline: '.docs-page { scroll-margin-top: 4rem; }',
    },
  ],
  scripts: [
    {
      src: '/analytics.js',
      defer: true,
      inline: 'window.analyticsReady = true;',
    },
  ],
});
```

Use `usePwaHead` for app-like browser metadata: manifest, theme color, color scheme, app name and icons.

```tsx
usePwaHead({
  manifest: '/manifest.webmanifest',
  themeColor: '#2563eb',
  colorScheme: 'light dark',
  applicationName: 'react-firestrap showcase',
  favicon: '/favicon.ico',
  appleTouchIcon: '/apple-touch-icon.png',
});
```

## Structured Data

Use `useSchemaOrgHead` for JSON-LD blocks.

```tsx
useSchemaOrgHead({
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Head management',
    description: 'Manage browser head metadata from React.',
  },
});
```

## Markdown Docs

`MarkdownReader` accepts a `head` prop with page metadata. The showcase docs use Markdown frontmatter to set the browser title and meta description for each page.

```tsx
<MarkdownReader
  content={doc.content}
  head={{
    title: doc.meta.title,
    description: doc.meta.description,
  }}
/>
```

This keeps page content, sidebar metadata and HTML metadata aligned from the same Markdown source.
