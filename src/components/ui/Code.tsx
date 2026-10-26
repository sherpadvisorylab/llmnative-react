import React, { useEffect, useRef } from 'react';

import { UIProps } from '../..';
import { useTheme } from '../../Theme';
import { useI18n } from '../../I18n';
import { cn } from '../../libs/cn';
import { copyToClipboard } from '../../libs/utils';
import Icon from './Icon';
import { Wrapper } from './GridSystem';
import { PRISM_LANGUAGES as LANGUAGES, ensurePrismStyles, loadPrism, loadPrismLanguage } from '../../libs/prism';

const THEMES = {
  prism: 'rf-code-theme-prism',
  dark: 'rf-code-theme-dark',
  coy: 'rf-code-theme-coy',
  funky: 'rf-code-theme-funky',
  okaidia: 'rf-code-theme-okaidia',
  solarizedlight: 'rf-code-theme-solarizedlight',
  tomorrow: 'rf-code-theme-tomorrow',
  twilight: 'rf-code-theme-twilight',
};

type PrismLanguage = string;
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
  /** Syntax highlight language (e.g. `"tsx"`, `"python"`). */
  language?: PrismLanguage;
  /** Show a copy-to-clipboard button. */
  showCopy?: boolean;
  /** Prism color theme. */
  theme?: PrismTheme;
  /** Background style variant. */
  background?: PrismBackground;
}

function isRecordKey<T extends Record<string, unknown>>(record: T, value: unknown): value is keyof T {
  return typeof value === 'string' && value in record;
}

const Code = ({
  language,
  children,
  before,
  after,
  wrapperClassName,
  className,
  showCopy = true,
  theme = 'tomorrow',
  background = 'default',
}: CodeProps) => {
  const codeRef = useRef<HTMLElement>(null);
  const themeConfig = useTheme('code');
  const dict = useI18n('code');
  const codeText = typeof children === 'string' ? children : String(children ?? '');
  const resolvedLanguage = isRecordKey(LANGUAGES, language) ? language : 'tsx';
  const resolvedTheme = isRecordKey(THEMES, theme) ? theme : 'tomorrow';
  const resolvedBackground = isRecordKey(BACKGROUND_CLASS, background) ? background : 'transparent';

  useEffect(() => {
    let cancelled = false;

    const loadAndHighlight = async () => {
      // Load theme styles first (lazy, once)
      await ensurePrismStyles();

      let Prism: Awaited<ReturnType<typeof loadPrism>>;
      try {
        Prism = await loadPrism();
      } catch (err) {
        console.warn('Errore nel caricare Prism core', err);
        return;
      }

      try {
        await loadPrismLanguage(resolvedLanguage);
      } catch (err) {
        console.warn(`Errore nel caricare il linguaggio Prism "${resolvedLanguage}"`, err);
      }

      if (!cancelled && codeRef.current) {
        try {
          Prism.highlightElement(codeRef.current);
        } catch (err) {
          console.warn(`Errore nell'evidenziare il blocco Prism "${resolvedLanguage}"`, err);
        }
      }
    };

    loadAndHighlight();
    return () => {
      cancelled = true;
    };
  }, [codeText, resolvedLanguage]);

  return (
    <Wrapper className={wrapperClassName || themeConfig.Code.wrapperClassName}>
      <div className={cn('flex w-full items-stretch gap-2', (before || after) && 'overflow-x-auto')}>
        {before && <div className="flex shrink-0 items-center text-sm text-muted-foreground">{before}</div>}
        <pre
          data-rf-code-theme={resolvedTheme}
          data-rf-code-background={resolvedBackground}
          className={cn(
            'relative min-w-0 flex-1 overflow-auto rounded-md border border-border p-4 text-sm',
            THEMES[resolvedTheme],
            BACKGROUND_CLASS[resolvedBackground],
            className || themeConfig.Code.className
          )}
        >
          {showCopy && (
            <button
              onClick={() => copyToClipboard(codeText)}
              className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title={dict.copyCode}
              aria-label={dict.copyCode}
            >
              <Icon name="clipboard" size={14} />
            </button>
          )}
          <code ref={codeRef} className={`language-${resolvedLanguage}`}>
            {codeText}
          </code>
        </pre>
        {after && <div className="flex shrink-0 items-center text-sm text-muted-foreground">{after}</div>}
      </div>
    </Wrapper>
  );
};

export default Code;
