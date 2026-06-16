# @llmnative/react — Claude Code

Leggi `llms-full.txt` per l'intera API surface: componenti, provider, hook, tipi, esempi.
Leggi `llms.txt` per orientamento rapido e provider matrix.

## Specificità Claude Code

**Build**
```bash
npm run build       # dist/index.mjs + dist/index.js + dist/index.css + types
npm run build:dev   # build development con declarations
npm run watch:dev   # watch mode per sviluppo
npm run test        # Vitest — tutti i test devono passare
```

**Verifica obbligatoria prima di ogni commit**
```bash
npx tsc --noEmit    # 0 errori TypeScript
npx vitest run      # tutti i test verdi
```

**CLI scaffold**
```bash
npx @llmnative/react create
npx @llmnative/react create --yes --provider=mock
```

**Regole di dipendenza del codice sorgente**
- `src/libs/` non conosce React
- `src/components/` non importa da `src/providers/` direttamente
- tutto fluisce verso l'alto: libs ← components ← providers ← App

**Regola TypeScript**
No `any`. Usare `unknown`, `Record<string, unknown>`, interfacce specifiche.
Eccezioni giustificate annotate con `// CR-042` inline.

**Branch attivo:** `main`
