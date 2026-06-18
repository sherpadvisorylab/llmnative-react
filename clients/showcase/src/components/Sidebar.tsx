import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMenu } from '@llmnative/react';
import { SideNav } from '@llmnative/react';
import type { SideNavItemDef } from '@llmnative/react';
import { useShowcaseCommonI18n } from '../showcase/i18n';

// ── Icon map: path prefix → lucide icon name ───────────────────────────────────

const ICON_MAP: Record<string, string> = {
    // Foundation
    '/components/motion':          'zap',
    // UI Primitives
    '/components/alert':           'alert-triangle',
    '/components/badge':           'tag',
    '/components/buttons':         'mouse-pointer-2',
    '/components/card':            'layout',
    '/components/code':            'code-2',
    '/components/dropdown':        'chevrons-up-down',
    '/components/gallery':         'images',
    '/components/grid-system':     'grid',
    '/components/icon':            'smile',
    '/components/image-avatar':    'user-circle',
    '/components/image':           'image',
    '/components/loader':          'loader',
    '/components/locale-switcher': 'languages',
    '/components/modal':           'layers',
    '/components/pagination':      'more-horizontal',
    '/components/percentage':      'percent',
    '/components/tab':             'layout-panel-top',
    '/components/table':           'table',
    // Widgets
    '/components/assistant-ai':    'bot',
    '/components/auth':            'shield-check',
    '/components/image-editor':    'wand-2',
    '/components/layout-builder':  'layout-panel-left',
    '/components/markdown-reader': 'file-text',
    '/components/prompt':          'message-square',
    '/components/repeat':          'repeat-2',
    '/components/tab-dynamic':     'panel-top',
    '/components/grid':            'table-2',
    '/components/form':            'clipboard-list',
    // Form fields
    '/components/autocomplete':    'text-search',
    '/components/checkbox':        'square-check',
    '/components/checklist':       'list-checks',
    '/components/image-field':      'image-plus',
    '/components/input':           'type',
    '/components/list-group':      'list',
    '/components/rich-text':       'text-cursor-input',
    '/components/select':          'chevrons-up-down',
    '/components/switch':          'toggle-left',
    '/components/textarea':        'align-left',
    '/components/upload':          'cloud-upload',
    // Blocks
    '/components/brand':           'star',
    '/components/breadcrumbs':     'chevrons-right',
    '/components/menu':            'menu',
    '/components/notifications':   'bell',
    '/components/search':          'search',
};

type RawItem = { path: string; title?: string; group?: string; children?: RawItem[]; [key: string]: any };

function injectIcons(items: RawItem[]): SideNavItemDef[] {
    return items.map(item => ({
        ...item,
        icon: ICON_MAP[item.path],
        children: item.children ? injectIcons(item.children) : undefined,
    }));
}

export default function Sidebar() {
    const { pathname } = useLocation();
    const common = useShowcaseCommonI18n();

    const docsItems       = useMenu('docs');
    const componentsItems = useMenu('components');
    const providersItems  = useMenu('providers');
    const examplesItems   = useMenu('examples');

    let raw: RawItem[] = [];
    if (pathname === '/docs' || pathname.startsWith('/docs/'))               raw = docsItems;
    else if (pathname.startsWith('/components'))                             raw = componentsItems;
    else if (pathname === '/providers' || pathname.startsWith('/providers/')) raw = providersItems;
    else if (pathname.startsWith('/examples'))                               raw = examplesItems;

    if (raw.length === 0) return null;

    const translatedGroups: Record<string, string> = {
        Foundation: common.groups.foundation,
        'UI Primitives': common.groups.uiPrimitives,
        Widgets: common.groups.widgets,
        'Form fields': common.groups.formFields,
        Blocks: common.groups.blocks,
        'Built-in drivers': common.groups.builtInDrivers,
        'Common patterns': common.groups.commonPatterns,
        'Auth flows': common.groups.authFlows,
    };

    const translateGroups = (items: RawItem[]): RawItem[] => (
        items.map((item) => ({
            ...item,
            group: item.group ? (translatedGroups[item.group] ?? item.group) : item.group,
            children: item.children ? translateGroups(item.children) : item.children,
        }))
    );

    const items = injectIcons(translateGroups(raw));

    return <SideNav items={items} />;
}
