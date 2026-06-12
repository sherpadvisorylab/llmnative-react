---
title: Head management
group: Architecture
order: 40
path: /docs/head
description: Declare document metadata, social tags, assets, PWA hints and structured data from any React component with nine focused hooks.
---

# Head management

`HeadProvider` is mounted automatically by `<App>` and owns the entire browser `<head>`. Your base `index.html` can stay minimal — each page or component declares only what it needs through focused hooks. Every hook undoes its changes when the component unmounts, so navigating away from a page always restores the previous state.

---

## Defaults

Three constant defaults ship with the framework. They apply until a page overrides them.

```ts
export const DEFAULT_HEAD_APP_NAME = 'LLM Native';

export const DEFAULT_DOCUMENT_HEAD = {
  charset: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
};

export const DEFAULT_LANGUAGE_HEAD = {
  lang: 'en',
};
```

Pass `appName` to `<App>` to change the default page title before any page sets its own:

```tsx
<App appName="My App" />
```

---

## Hook overview

| Hook | What it controls | Restores on unmount |
|------|-----------------|---------------------|
| `useHead` / `<Head>` | Page title, description, arbitrary meta tags | ✓ previous entry |
| `useDocumentHead` | charset, viewport, robots, canonical, keywords, base, HTTP-equiv | ✓ previous state (merge — only touched fields change) |
| `useSocialHead` | Open Graph and Twitter card tags | ✓ previous value |
| `useLanguageHead` | `<html lang>`, `dir`, alternate language links | ✓ framework defaults |
| `usePaginationHead` | `rel="prev"` / `rel="next"` links | ✓ empty |
| `useAssetsHead` | Scripts, stylesheets, fonts | ✓ empty |
| `usePwaHead` | Web manifest, theme color, favicon, Apple icons | ✓ empty |
| `useSchemaOrgHead` | JSON-LD structured data blocks | ✓ empty |
| `useHeadLinks` | Arbitrary `<link>` elements | ✓ previous value |

All hooks are no-ops when called without arguments — safe to use conditionally.

---

## Page title and description

Use `useHead` or the `<Head>` shorthand for the two most common fields: `title` and `description`. The title becomes `document.title`; the description is written as `<meta name="description">`.

```tsx
import { useHead, Head } from '@llmnative/react';

// hook form — use when you also need the controller reference
function ArticlePage() {
  useHead({
    title: 'Getting started',
    description: 'Install and scaffold a new @llmnative/react project.',
  });
  return <main>…</main>;
}

// component form — drop-in, no variable needed
function ContactPage() {
  return (
    <>
      <Head title="Contact" description="Send us a message." />
      <main>…</main>
    </>
  );
}
```

Multiple hooks can be active at once. The **last registered entry wins**, so a child component can override its parent's title.

When the component unmounts, its entry is removed and the previous title is restored automatically.

### `PageMetadataState` — full interface

```ts
interface PageMetadataState {
  title?:       string;              // sets document.title
  description?: string;             // <meta name="description">
  meta?:        Record<string, string | undefined>;  // arbitrary <meta name="…"> tags
}
```

The `meta` map lets you add any additional name/content pairs:

```tsx
useHead({
  title: 'Blog',
  meta: {
    author:      'Jane Smith',
    'theme-color': '#2563eb',
  },
});
```

---

## Document metadata

Use `useDocumentHead` for technical document settings. Values are **merged** on top of the current document state — only the fields you pass are changed, everything else (including the `charset` and `viewport` defaults) is preserved. When the component unmounts the previous state is fully restored.

```tsx
import { useDocumentHead } from '@llmnative/react';

function ProductPage() {
  useDocumentHead({
    robots:    'index,follow',
    canonical: 'https://example.com/products/widget',
    keywords:  ['react', 'ui', 'components'],
    referrer:  'strict-origin-when-cross-origin',
  });
  return <main>…</main>;
}
```

### `DocumentHeadState` — full interface

```ts
interface DocumentHeadState {
  charset?:    string;                     // <meta charset> — default: 'UTF-8'
  viewport?:   string;                     // <meta name="viewport"> — default: 'width=device-width, initial-scale=1.0'
  robots?:     string;                     // <meta name="robots">
  googlebot?:  string;                     // <meta name="googlebot">
  canonical?:  string;                     // <link rel="canonical">
  ampHtml?:    string;                     // <link rel="amphtml">
  sitemap?:    string;                     // <link rel="sitemap" type="application/xml">
  keywords?:   string | string[];          // <meta name="keywords"> — array joined with ', '
  author?:     string;                     // <meta name="author">
  publisher?:  string;                     // <meta name="publisher">
  referrer?:   string;                     // <meta name="referrer">
  base?:       { href?: string; target?: string };  // <base>
  httpEquiv?:  Record<string, string>;     // <meta http-equiv="…">
  meta?:       Record<string, string>;     // arbitrary <meta name="…"> tags
  links?:      HeadLinkDescriptor[];       // arbitrary <link> elements
}
```

---

## Social metadata

Use `useSocialHead` to set Open Graph and Twitter card tags together.

```tsx
import { useSocialHead } from '@llmnative/react';

function BlogPostPage() {
  useSocialHead({
    openGraph: {
      title:       'Why React hooks changed everything',
      type:        'article',
      url:         'https://example.com/blog/hooks',
      image:       'https://example.com/blog/hooks-cover.png',
      description: 'A deep dive into the hooks model.',
      siteName:    'Example Blog',
    },
    twitter: {
      card:    'summary_large_image',
      title:   'Why React hooks changed everything',
      image:   'https://example.com/blog/hooks-cover.png',
      creator: '@example',
    },
  });
  return <article>…</article>;
}
```

Keys that already include a colon (`og:video:width`) are written as-is. Plain keys are prefixed automatically: `title` → `og:title`, `siteName` → `og:site_name`.

### `SocialHeadState` — full interface

```ts
interface SocialHeadState {
  openGraph?: OpenGraphHeadState;
  twitter?:   TwitterHeadState;
}

interface OpenGraphHeadState {
  title?:       string;   // og:title
  type?:        string;   // og:type  ('website' | 'article' | 'profile' | …)
  image?:       string;   // og:image
  url?:         string;   // og:url
  description?: string;   // og:description
  siteName?:    string;   // og:site_name
  locale?:      string;   // og:locale
  [key: string]: string | undefined;  // any additional og:* tag
}

interface TwitterHeadState {
  card?:        'summary' | 'summary_large_image' | 'app' | 'player' | string;
  site?:        string;   // @username of the site
  creator?:     string;   // @username of the content author
  title?:       string;
  description?: string;
  image?:       string;
  [key: string]: string | undefined;  // any additional twitter:* tag
}
```

---

## Language and alternates

`useLanguageHead` updates `<html lang>` and `<html dir>`, and adds `<link rel="alternate" hreflang="…">` for multilingual sites.

```tsx
import { useLanguageHead } from '@llmnative/react';

function ItalianPage() {
  useLanguageHead({
    lang: 'it',
    dir:  'ltr',
    alternates: [
      { hrefLang: 'en',        href: 'https://example.com/en/page' },
      { hrefLang: 'it',        href: 'https://example.com/it/page' },
      { hrefLang: 'x-default', href: 'https://example.com/page' },
    ],
  });
  return <main>…</main>;
}
```

### `LanguageHeadState` — full interface

```ts
interface LanguageHeadState {
  lang?:       string;           // ISO 639-1 language code, e.g. 'en', 'it', 'de'
  dir?:        'ltr' | 'rtl' | 'auto';
  alternates?: LanguageAlternateLink[];
}

interface LanguageAlternateLink {
  href:      string;
  hrefLang:  string;   // 'en', 'it', 'x-default', …
  media?:    string;
  type?:     string;
  title?:    string;
}
```

---

## Pagination links

Use `usePaginationHead` to declare `rel="prev"` and `rel="next"` for paginated content.

```tsx
import { usePaginationHead } from '@llmnative/react';

function BlogListPage({ page }: { page: number }) {
  usePaginationHead({
    prev: page > 1     ? `https://example.com/blog?page=${page - 1}` : undefined,
    next: hasNextPage  ? `https://example.com/blog?page=${page + 1}` : undefined,
  });
  return <main>…</main>;
}
```

---

## Assets — scripts, styles and fonts

Use `useAssetsHead` to inject external and inline scripts, stylesheets and font resources. Each item can carry both an external `src`/`href` and an `inline` string; they are rendered consecutively in the head.

```tsx
import { useAssetsHead } from '@llmnative/react';

function DocsPage() {
  useAssetsHead({
    fonts: [
      {
        href:       'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
        preconnect: ['https://fonts.gstatic.com'],
        crossOrigin: 'anonymous',
      },
    ],
    styles: [
      {
        href:   '/docs.css',
        inline: '.docs-page { scroll-margin-top: 4rem; }',
      },
    ],
    scripts: [
      {
        src:    '/analytics.js',
        defer:  true,
        inline: 'window.analyticsReady = true;',
      },
    ],
  });
  return <main>…</main>;
}
```

### `AssetsHeadState` — full interface

```ts
interface AssetsHeadState {
  scripts?: HeadScriptAsset[];
  styles?:  HeadStyleAsset[];
  fonts?:   HeadFontAsset[];
}

interface HeadScriptAsset {
  src?:             string;
  inline?:          string;     // rendered as a separate inline <script>
  type?:            string;     // default: 'text/javascript'
  async?:           boolean;
  defer?:           boolean;
  nonce?:           string;
  integrity?:       string;
  crossOrigin?:     string;
  referrerPolicy?:  string;
  id?:              string;
}

interface HeadStyleAsset {
  href?:        string;
  inline?:      string;         // rendered as a separate inline <style>
  media?:       string;
  title?:       string;
  type?:        string;
  disabled?:    boolean;
  integrity?:   string;
  crossOrigin?: string;
}

interface HeadFontAsset {
  href:           string;       // URL of the font CSS or font file
  preload?:       boolean;      // adds <link rel="preload">
  preconnect?:    string[];     // adds <link rel="preconnect"> for each origin
  dnsPrefetch?:   string[];     // adds <link rel="dns-prefetch"> for each origin
  crossOrigin?:   string;
  as?:            string;       // 'font' | 'style'
  type?:          string;       // e.g. 'font/woff2'
  media?:         string;
}
```

---

## PWA metadata

Use `usePwaHead` for app-like browser hints: web manifest, theme color, color scheme, application name and icons.

```tsx
import { usePwaHead } from '@llmnative/react';

function App() {
  usePwaHead({
    manifest:               '/manifest.webmanifest',
    themeColor:             '#2563eb',
    colorScheme:            'light dark',
    applicationName:        'My App',
    favicon:                '/favicon.ico',
    appleTouchIcon:         '/apple-touch-icon.png',
    mobileWebAppCapable:    true,
    appleMobileWebAppCapable: true,
  });
  return <main>…</main>;
}
```

### `PwaHeadState` — full interface

```ts
interface PwaHeadState {
  manifest?:                    string;   // <link rel="manifest">
  themeColor?:                  string;   // <meta name="theme-color">
  backgroundColor?:             string;   // <meta name="background-color">
  colorScheme?:                 'normal' | 'light' | 'dark' | 'light dark' | 'dark light' | string;
  applicationName?:             string;   // <meta name="application-name">
  mobileWebAppCapable?:         boolean;  // <meta name="mobile-web-app-capable" content="yes">
  appleMobileWebAppCapable?:    boolean;  // <meta name="apple-mobile-web-app-capable">
  appleMobileWebAppTitle?:      string;   // <meta name="apple-mobile-web-app-title">
  appleMobileWebAppStatusBarStyle?: 'default' | 'black' | 'black-translucent';
  favicon?:                     string;   // <link rel="icon">
  appleTouchIcon?:               string;  // <link rel="apple-touch-icon">
  icons?:                       PwaIconLink[];  // additional icon link variants
}
```

---

## Structured data (JSON-LD)

Use `useSchemaOrgHead` to inject one or more `<script type="application/ld+json">` blocks.

```tsx
import { useSchemaOrgHead } from '@llmnative/react';

function ProductPage({ product }) {
  useSchemaOrgHead({
    jsonLd: {
      '@context': 'https://schema.org',
      '@type':    'Product',
      name:       product.name,
      description: product.description,
      offers: {
        '@type': 'Offer',
        price:   product.price,
        priceCurrency: 'EUR',
      },
    },
  });
  return <main>…</main>;
}
```

Pass an array to inject multiple blocks on the same page:

```tsx
useSchemaOrgHead({
  jsonLd: [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Home' },
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'Acme Corp' },
  ],
});
```

---

## Arbitrary link tags

Use `useHeadLinks` for any `<link>` element not covered by the specialized hooks.

```tsx
import { useHeadLinks } from '@llmnative/react';

function ArticlePage() {
  useHeadLinks({
    links: [
      { rel: 'preload', href: '/hero.png', as: 'image' },
      { rel: 'license',  href: 'https://creativecommons.org/licenses/by/4.0/' },
    ],
  });
  return <article>…</article>;
}
```

---

## Combining hooks on one page

All hooks can coexist on the same page. Each manages its own slice of the head independently.

```tsx
function FullBlogPost({ post }) {
  useHead({ title: post.title, description: post.summary });

  useDocumentHead({
    robots:    'index,follow',
    canonical: `https://example.com/blog/${post.slug}`,
    keywords:  post.tags,
  });

  useSocialHead({
    openGraph: { title: post.title, type: 'article', image: post.coverUrl, url: post.url },
    twitter:   { card: 'summary_large_image', title: post.title, image: post.coverUrl },
  });

  useSchemaOrgHead({
    jsonLd: {
      '@context':   'https://schema.org',
      '@type':      'BlogPosting',
      headline:     post.title,
      datePublished: post.publishedAt,
      author:       { '@type': 'Person', name: post.author },
    },
  });

  return <article>…</article>;
}
```

---

## Markdown docs

`MarkdownReader` accepts a `head` prop to set title and description from Markdown frontmatter. This keeps page content, sidebar metadata and HTML metadata aligned from the same source.

```tsx
<MarkdownReader
  content={doc.content}
  head={{
    title:       doc.meta.title,
    description: doc.meta.description,
  }}
/>
```

In the scaffold, every page in `src/pages/` can call `<Head>` at the top of its JSX to register metadata without any extra wiring:

```tsx
import { Head } from '@llmnative/react';

export default function ContactsPage() {
  return (
    <>
      <Head title="Contacts" description="Manage your contact list." />
      <Grid path="/contacts" … />
    </>
  );
}
```

---

## Navigation and cleanup

Each hook registers its value when the component mounts and removes it (or restores the previous value) when the component unmounts. This means:

- Navigating **to** a page: the page's head hooks run → head updates.
- Navigating **away** from a page: cleanup runs → head reverts to what it was before.
- A page with **no head hooks** restores the app-level defaults (title = `appName`, charset = `UTF-8`, lang = `en`).

There is no global route-change flush — the system relies entirely on React's mount/unmount lifecycle. Every page that cares about its browser title should call at least `<Head title="…" />` or `useHead({ title: '…' })`.

