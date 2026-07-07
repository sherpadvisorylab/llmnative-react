// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import * as componentExports from '../../src/components/index';

const repoRoot = process.cwd();
const showcaseRoot = path.join(repoRoot, 'clients', 'showcase', 'src');
const distModulePath = path.join(repoRoot, 'dist', 'index.mjs');
const distTypesPath = path.join(repoRoot, 'dist', 'types', 'src', 'index.d.ts');

const distBuilt = fs.existsSync(distModulePath);

type ImportSets = {
    runtime: Set<string>;
    typeOnly: Set<string>;
};

function walkFiles(root: string, callback: (filePath: string) => void): void {
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        const fullPath = path.join(root, entry.name);
        if (entry.isDirectory()) {
            walkFiles(fullPath, callback);
            continue;
        }

        if (/\.(ts|tsx)$/.test(entry.name)) {
            callback(fullPath);
        }
    }
}

function collectShowcaseImports(): ImportSets {
    const runtime = new Set<string>();
    const typeOnly = new Set<string>();

    walkFiles(showcaseRoot, (filePath) => {
        const source = fs.readFileSync(filePath, 'utf8');
        const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

        for (const statement of sourceFile.statements) {
            if (!ts.isImportDeclaration(statement)) continue;
            if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
            if (statement.moduleSpecifier.text !== '@llmnative/react') continue;

            const importClause = statement.importClause;
            if (!importClause?.namedBindings || !ts.isNamedImports(importClause.namedBindings)) continue;

            for (const element of importClause.namedBindings.elements) {
                const name = element.propertyName?.text || element.name.text;
                if (importClause.isTypeOnly || element.isTypeOnly) {
                    typeOnly.add(name);
                } else {
                    runtime.add(name);
                }
            }
        }
    });

    return { runtime, typeOnly };
}

function resolveDeclarationModule(fromFile: string, moduleName: string): string | null {
    const basePath = path.resolve(path.dirname(fromFile), moduleName);
    const candidates = [
        `${basePath}.d.ts`,
        path.join(basePath, 'index.d.ts'),
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) return candidate;
    }

    return null;
}

function collectTypeExportsFromDts(entryFile = distTypesPath, visited = new Set<string>()): Set<string> {
    if (visited.has(entryFile)) return new Set<string>();
    visited.add(entryFile);

    const source = fs.readFileSync(entryFile, 'utf8');
    const sourceFile = ts.createSourceFile(entryFile, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const exported = new Set<string>();

    for (const statement of sourceFile.statements) {
        if (ts.isExportDeclaration(statement)) {
            if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
                for (const element of statement.exportClause.elements) {
                    exported.add(element.name.text);
                }
            }

            if (
                statement.moduleSpecifier &&
                ts.isStringLiteral(statement.moduleSpecifier) &&
                statement.moduleSpecifier.text.startsWith('.')
            ) {
                const target = resolveDeclarationModule(entryFile, statement.moduleSpecifier.text);
                if (target) {
                    for (const name of collectTypeExportsFromDts(target, visited)) {
                        exported.add(name);
                    }
                }
            }

            continue;
        }

        if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;

        if (
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement) ||
            ts.isClassDeclaration(statement) ||
            ts.isFunctionDeclaration(statement) ||
            ts.isEnumDeclaration(statement)
        ) {
            if (statement.name) exported.add(statement.name.text);
        }
    }

    return exported;
}

describe('public export contract', () => {
    it('covers every runtime symbol imported by the showcase package consumer', async () => {
        if (!distBuilt) return;
        const showcaseImports = collectShowcaseImports();
        const distModule = await import(distModulePath);
        const runtimeExports = new Set(Object.keys(distModule));
        const missing = [...showcaseImports.runtime].filter((name) => !runtimeExports.has(name)).sort();
        expect(missing).toEqual([]);
    });

    it('covers every type-only symbol imported by the showcase package consumer', () => {
        if (!distBuilt) return;
        const showcaseImports = collectShowcaseImports();
        const typeExports = collectTypeExportsFromDts();
        const missing = [...showcaseImports.typeOnly].filter((name) => !typeExports.has(name)).sort();
        expect(missing).toEqual([]);
    });

    it('keeps public component runtime exports reachable from the root bundle', async () => {
        if (!distBuilt) return;
        const distModule = await import(distModulePath);
        const runtimeExports = new Set(Object.keys(distModule));
        const missing = Object.keys(componentExports).filter((name) => !runtimeExports.has(name)).sort();
        expect(missing).toEqual([]);
    });
});
