import React, { useEffect, useRef } from 'react';

import { Wrapper } from './GridSystem';
import { UIProps } from '../..';
import {useTheme} from "../../Theme";
import {copyToClipboard} from "../../libs/utils";
import Prism from 'prismjs';
import { cn } from '../../libs/cn';

const LANGUAGES: Record<string, () => Promise<any>> = {
  // @ts-ignore
  markup: () => import('prismjs/components/prism-markup'),
  // @ts-ignore
  html: () => import('prismjs/components/prism-markup'),
  // @ts-ignore
  xml: () => import('prismjs/components/prism-markup'),
  // @ts-ignore
  svg: () => import('prismjs/components/prism-markup'),
  // @ts-ignore
  mathml: () => import('prismjs/components/prism-markup'),
  // @ts-ignore
  css: () => import('prismjs/components/prism-css'),
  // @ts-ignore
  clike: () => import('prismjs/components/prism-clike'),
  // @ts-ignore
  javascript: () => import('prismjs/components/prism-javascript'),
  // @ts-ignore
  js: () => import('prismjs/components/prism-javascript'),
  // @ts-ignore
  jsx: () => import('prismjs/components/prism-jsx'),
  // @ts-ignore
  typescript: () => import('prismjs/components/prism-typescript'),
  // @ts-ignore
  tsx: () => import('prismjs/components/prism-tsx'),
  // @ts-ignore
  json: () => import('prismjs/components/prism-json'),
  // @ts-ignore
  bash: () => import('prismjs/components/prism-bash'),
  // @ts-ignore
  shell: () => import('prismjs/components/prism-bash'),
  // @ts-ignore
  python: () => import('prismjs/components/prism-python'),
  // @ts-ignore
  java: () => import('prismjs/components/prism-java'),
  // @ts-ignore
  c: () => import('prismjs/components/prism-c'),
  // @ts-ignore
  cpp: () => import('prismjs/components/prism-cpp'),
  // @ts-ignore
  csharp: () => import('prismjs/components/prism-csharp'),
  // @ts-ignore
  go: () => import('prismjs/components/prism-go'),
  // @ts-ignore
  sql: () => import('prismjs/components/prism-sql'),
  // @ts-ignore
  php: () => import('prismjs/components/prism-php'),
  // @ts-ignore
  ruby: () => import('prismjs/components/prism-ruby'),
  // @ts-ignore
  yaml: () => import('prismjs/components/prism-yaml'),
  // @ts-ignore
  ini: () => import('prismjs/components/prism-ini'),
  // @ts-ignore
  docker: () => import('prismjs/components/prism-docker'),
  // @ts-ignore
  powershell: () => import('prismjs/components/prism-powershell'),
  // @ts-ignore
  git: () => import('prismjs/components/prism-git'),
  // @ts-ignore
  graphql: () => import('prismjs/components/prism-graphql'),
};

const THEMES = {
  // @ts-ignore
  prism: () => import('prismjs/themes/prism.css'),
  // @ts-ignore
  dark: () => import('prismjs/themes/prism-dark.css'),
  // @ts-ignore
  coy: () => import('prismjs/themes/prism-coy.css'),
  // @ts-ignore
  funky: () => import('prismjs/themes/prism-funky.css'),
  // @ts-ignore
  okaidia: () => import('prismjs/themes/prism-okaidia.css'),
  // @ts-ignore
  solarizedlight: () => import('prismjs/themes/prism-solarizedlight.css'),
  // @ts-ignore
  tomorrow: () => import('prismjs/themes/prism-tomorrow.css'),
  // @ts-ignore
  twilight: () => import('prismjs/themes/prism-twilight.css')
 };

type PrismLanguage = keyof typeof LANGUAGES;
type PrismTheme = keyof typeof THEMES;
export type PrismBackground =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'white'
  | 'black'
  | 'transparent'
  | 'default';

const BACKGROUND_CLASS: Record<PrismBackground, string | undefined> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-success text-success-foreground',
  danger: 'bg-destructive text-destructive-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
  light: 'bg-muted text-muted-foreground',
  dark: 'bg-foreground text-background',
  white: 'bg-white text-slate-950',
  black: 'bg-black text-white',
  transparent: 'bg-transparent',
  default: undefined,
};

interface CodeProps extends UIProps {
  children: string;
  language: PrismLanguage;
  showCopy?: boolean;
  theme?: PrismTheme;
  background?: PrismBackground;
}

const Code = ({
  language,
  children,
  pre,
  post,
  wrapClass,
  className,
  showCopy = true,
  theme = "tomorrow",
  background = "transparent",
}: CodeProps) => {
  const ref = useRef<HTMLPreElement>(null);
  const Theme = useTheme("code");

  useEffect(() => {
    const loadAndHighlight = async () => {
      // 1. Carica il linguaggio
      const loadLanguage = LANGUAGES[language];
      if (loadLanguage) {
        try {
          await loadLanguage();
        } catch (err) {
          console.warn(`Errore nel caricare il linguaggio Prism "${language}"`, err);
        }
      }

      // 2. Carica il tema Prism
      const loadTheme = THEMES[theme];
      if (loadTheme) {
        try {
          await loadTheme();
        } catch (err) {
          console.warn(`Errore nel caricare il tema Prism "${theme}"`, err);
        }
      }

      // 4. Esegui l’highlighting
      if (ref.current) {
        Prism.highlightAllUnder(ref.current);
      }
    };

    loadAndHighlight();
  }, [children, language, theme]);
  
  const backgroundClass = BACKGROUND_CLASS[background];

  return (
    <Wrapper className={wrapClass || Theme.Code.wrapClass}>
      <pre
        ref={ref}
        className={cn(
          "relative overflow-auto rounded-md border border-border p-4 text-sm",
          backgroundClass,
          className || Theme.Code.className
        )}
      >
        {pre}
        {showCopy && <button
          onClick={() => copyToClipboard(children)}
          className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Copy code"
          aria-label="Copy code"
        >
          <i className={Theme.getIcon("clipboard")} />
        </button>}
        <code className={`language-${language}`}>
          {children}
        </code>
        {post}
      </pre>
    </Wrapper>
  );
};


export default Code;
