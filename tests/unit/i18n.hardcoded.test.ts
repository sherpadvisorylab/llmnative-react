import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * CR-097 — anti-regression guard.
 *
 * Scans the component files touched by CR-097 and fails if one of the English
 * literals that were moved into the i18n dictionaries reappears hardcoded in
 * the component source. The patterns target the original JSX text nodes,
 * attributes and string literals, so they do not match the dictionary keys.
 */

interface Guard {
    file: string;
    patterns: RegExp[];
}

const GUARDS: Guard[] = [
    {
        file: 'src/components/blocks/Notifications.tsx',
        patterns: [
            />\s*Mark all read\s*</,
            />\s*No notifications\s*</,
            /You're all caught up/,
            /'See all notifications'/,
        ],
    },
    {
        file: 'src/components/ErrorBoundary.tsx',
        patterns: [
            />\s*This page ran into a problem\s*</,
            />\s*An unexpected error occurred while rendering this content\.\s*</,
            />\s*Technical details\s*</,
            />\s*Debug information\s*</,
            />\s*Context\s*</,
            />\s*URL\s*</,
            />\s*Time\s*</,
            />\s*Agent\s*</,
            />\s*Component tree\s*</,
            /'Copy debug info'/,
            /'Copied!'/,
            />\s*Try again\s*</,
            />\s*Go to home\s*</,
            /'Send report'/,
            /'Sending\.\.\.'/,
            /'Report sent ✓'/,
            /'Failed - retry'/,
        ],
    },
    {
        file: 'src/components/blocks/ThemeSwitcher.tsx',
        patterns: [
            />\s*Color mode\s*</,
            />\s*Primary color\s*</,
            />\s*Border radius\s*</,
            />\s*Sharp\s*</,
            />\s*Rounded\s*</,
            />\s*Font\s*</,
            />\s*Status colors\s*</,
            />\s*Theme\s*</,
            />\s*Icon library\s*</,
            />\s*Weight\s*</,
            /'Customize theme'/,
            /'Live theme tokens and mode controls with no reload\.'/,
            /'Theme available in the current registry\.'/,
            /'Clean outline icon set'/,
            /'Flexible icon weights and styles'/,
        ],
    },
    {
        file: 'src/components/ui/fields/ImageField.tsx',
        patterns: [
            /title="Open original"/,
            /title="Crop"/,
            /`Crop — \$\{/,
        ],
    },
    {
        file: 'src/components/ui/fields/RichText.tsx',
        patterns: [
            /title="Paragraph style"/,
            /title="Insert Table"/,
            /title="Upload Image"/,
            /title="Upload Document"/,
            /title="Source Code"/,
            /title="Open original"/,
            /title="Crop"/,
            /title="Edit image"/,
            /title="Crop image"/,
            /title="Edit link"/,
            /title="Remove link"/,
            />\s*New tab\s*</,
            />\s*Same tab\s*</,
            /`Crop — \$\{/,
        ],
    },
    {
        file: 'src/components/ui/fields/Upload.tsx',
        patterns: [/label="File name"/],
    },
    {
        file: 'src/components/ui/TabDynamic.tsx',
        patterns: [/title="Add tab"/],
    },
    {
        file: 'src/components/widgets/TabDynamic.tsx',
        patterns: [/title="Add tab"/],
    },
    {
        file: 'src/components/widgets/grid-core/GridCore.tsx',
        patterns: [
            /ariaLabel="Table view"/,
            /title="Table view"/,
            /ariaLabel="Gallery view"/,
            /title="Gallery view"/,
        ],
    },
    {
        file: 'src/components/widgets/Chatbot.tsx',
        patterns: [
            /title: 'Role'/,
            /title: 'Language'/,
            /title: 'Voice'/,
            /title: 'Style'/,
            /title: 'Temperature'/,
            /aria-label="Temperature"/,
            /'Stopping…'/,
            /'Stop'/,
        ],
    },
    {
        file: 'src/components/blocks/Breadcrumbs.tsx',
        patterns: [/aria-label="Breadcrumb"/],
    },
];

describe('i18n — nessun testo inglese fisso nei componenti CR-097', () => {
    for (const { file, patterns } of GUARDS) {
        it(`${file} non contiene i letterali rimossi`, () => {
            const source = readFileSync(resolve(process.cwd(), file), 'utf8');
            const offenders = patterns
                .filter((pattern) => pattern.test(source))
                .map((pattern) => pattern.source);
            expect(offenders).toEqual([]);
        });
    }
});
