import { describe, it, expect } from 'vitest';
import path from '../../../src/libs/path';

describe('path.basename', () => {
    it('returns last segment of a normal path', () => {
        expect(path.basename('/users/1')).toBe('1');
    });
    it('returns last segment with extension', () => {
        expect(path.basename('/files/doc.pdf')).toBe('doc.pdf');
    });
    it('returns empty string for root', () => {
        expect(path.basename('/')).toBe('');
    });
    it('returns segment for single-segment path', () => {
        expect(path.basename('users')).toBe('users');
    });
    it('handles trailing slash', () => {
        expect(path.basename('/users/')).toBe('users');
    });
});

describe('path.extname', () => {
    it('returns extension with dot', () => {
        expect(path.extname('doc.pdf')).toBe('.pdf');
    });
    it('returns empty string for no extension', () => {
        expect(path.extname('README')).toBe('');
    });
    it('returns empty string for dotfile with no extension after base', () => {
        expect(path.extname('.gitignore')).toBe('');
    });
    it('handles multiple dots', () => {
        expect(path.extname('archive.tar.gz')).toBe('.gz');
    });
    it('handles path with directory', () => {
        expect(path.extname('/files/doc.pdf')).toBe('.pdf');
    });
});

describe('path.dirname', () => {
    it('returns directory portion of path', () => {
        expect(path.dirname('/users/1')).toBe('/users');
    });
    it('returns root for top-level path', () => {
        expect(path.dirname('/users')).toBe('/');
    });
    it('handles nested path', () => {
        expect(path.dirname('/a/b/c')).toBe('/a/b');
    });
    it('handles file path', () => {
        expect(path.dirname('/files/doc.pdf')).toBe('/files');
    });
});

describe('path.filename', () => {
    it('returns name without extension', () => {
        expect(path.filename('doc.pdf')).toBe('doc');
    });
    it('returns full name when no extension', () => {
        expect(path.filename('README')).toBe('README');
    });
    it('handles multiple dots', () => {
        expect(path.filename('archive.tar.gz')).toBe('archive.tar');
    });
    it('returns empty for dotfiles', () => {
        expect(path.filename('.gitignore')).toBe('');
    });
    it('handles path with directory', () => {
        expect(path.filename('/files/doc.pdf')).toBe('doc');
    });
});

describe('path.parentBasename', () => {
    it('returns immediate parent directory name', () => {
        expect(path.parentBasename('/users/1')).toBe('users');
    });
    it('returns empty string for top-level path', () => {
        expect(path.parentBasename('/users')).toBe('');
    });
    it('handles deep nesting', () => {
        expect(path.parentBasename('/a/b/c/d')).toBe('c');
    });
    it('handles file path', () => {
        expect(path.parentBasename('/docs/2024/report.pdf')).toBe('2024');
    });
});

describe('path.parentDirname', () => {
    it('returns path two levels up', () => {
        expect(path.parentDirname('/a/b/c')).toBe('/a');
    });
    it('returns root for two-level path', () => {
        expect(path.parentDirname('/a/b')).toBe('/');
    });
    it('handles file deep', () => {
        expect(path.parentDirname('/x/y/z/file.txt')).toBe('/x/y');
    });
});

describe('path.parentFilename', () => {
    it('returns parent filename without extension', () => {
        expect(path.parentFilename('/docs/2024/report.pdf')).toBe('2024');
    });
    it('handles parent with extension', () => {
        expect(path.parentFilename('/archive.tar.gz/readme.txt')).toBe('archive.tar');
    });
    it('returns empty for top-level', () => {
        expect(path.parentFilename('/file.txt')).toBe('');
    });
});

describe('path.append', () => {
    it('appends suffix before extension', () => {
        expect(path.append('doc.pdf', '_draft')).toBe('doc_draft.pdf');
    });
    it('handles path with directory', () => {
        expect(path.append('/files/doc.pdf', '_v2')).toBe('/files/doc_v2.pdf');
    });
    it('handles file without extension', () => {
        expect(path.append('README', '.md')).toBe('README.md');
    });
    it('handles empty suffix', () => {
        expect(path.append('doc.pdf', '')).toBe('doc.pdf');
    });
});

describe('path.prepend', () => {
    it('prepends prefix before filename', () => {
        expect(path.prepend('doc.pdf', 'draft_')).toBe('draft_doc.pdf');
    });
    it('handles path with directory', () => {
        expect(path.prepend('/files/doc.pdf', 'final_')).toBe('/files/final_doc.pdf');
    });
    it('handles file without extension', () => {
        expect(path.prepend('README', 'DRAFT_')).toBe('DRAFT_README');
    });
});

describe('path.changeFilename', () => {
    it('adds prefix', () => {
        expect(path.changeFilename('doc.pdf', { prefix: 'draft_' })).toBe('draft_doc.pdf');
    });
    it('adds suffix', () => {
        expect(path.changeFilename('doc.pdf', { suffix: '_v2' })).toBe('doc_v2.pdf');
    });
    it('changes extension', () => {
        expect(path.changeFilename('doc.pdf', { ext: 'txt' })).toBe('doc.txt');
    });
    it('changes extension with dot', () => {
        expect(path.changeFilename('doc.pdf', { ext: '.txt' })).toBe('doc.txt');
    });
    it('removes extension when ext is empty string', () => {
        expect(path.changeFilename('doc.pdf', { ext: '' })).toBe('doc');
    });
    it('combines prefix, suffix and new extension', () => {
        expect(path.changeFilename('doc.pdf', { prefix: 'draft_', suffix: '_v2', ext: 'txt' })).toBe('draft_doc_v2.txt');
    });
    it('handles path with directory', () => {
        expect(path.changeFilename('/files/doc.pdf', { prefix: 'final_' })).toBe('/files/final_doc.pdf');
    });
    it('handles file without extension', () => {
        expect(path.changeFilename('README', { ext: 'md' })).toBe('README.md');
    });
});

describe('path.join', () => {
    it('joins path segments', () => {
        expect(path.join('a', 'b', 'c')).toBe('a/b/c');
    });
    it('removes double slashes', () => {
        expect(path.join('a/', '/b')).toBe('a/b');
    });
    it('handles leading slash', () => {
        expect(path.join('/a', 'b')).toBe('/a/b');
    });
    it('handles trailing slash', () => {
        expect(path.join('a', 'b/')).toBe('a/b/');
    });
    it('handles single segment', () => {
        expect(path.join('a')).toBe('a');
    });
    it('handles empty string segments', () => {
        expect(path.join('a', '', 'b')).toBe('a/b');
    });
});

describe('path.parse', () => {
    it('parses full path', () => {
        const result = path.parse('/files/doc.pdf');
        expect(result.root).toBe('/');
        expect(result.dir).toBe('/files');
        expect(result.base).toBe('doc.pdf');
        expect(result.ext).toBe('.pdf');
        expect(result.name).toBe('doc');
    });
    it('parses root-only path', () => {
        const result = path.parse('/');
        expect(result.root).toBe('/');
        expect(result.dir).toBe('/');
        expect(result.base).toBe('');
        expect(result.ext).toBe('');
        expect(result.name).toBe('');
    });
    it('parses relative path', () => {
        const result = path.parse('doc.pdf');
        expect(result.root).toBe('');
        expect(result.dir).toBe('/');
        expect(result.base).toBe('doc.pdf');
        expect(result.ext).toBe('.pdf');
        expect(result.name).toBe('doc');
    });
    it('parses file without extension', () => {
        const result = path.parse('/README');
        expect(result.ext).toBe('');
        expect(result.name).toBe('README');
    });
});
