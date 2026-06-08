/**
 * GmailEmailProvider test suite.
 * Tests isConfigured(), getConfigurationState() and send() via mocked
 * auth config and the internal sendEmail helper.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock auth config ──────────────────────────────────────────────────────────

vi.mock('../../../src/providers/auth/google/auth', () => ({
    authConfig: vi.fn(),
}));

// ── Mock sendEmail ────────────────────────────────────────────────────────────

vi.mock('../../../src/providers/email/google/email', () => ({
    sendEmail: vi.fn(async () => ({ id: 'msg-1', threadId: 'thread-1' })),
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { GmailEmailProvider } from '../../../src/providers/email/google/GmailEmailProvider';
import * as authModule from '../../../src/providers/auth/google/auth';
import * as emailModule from '../../../src/providers/email/google/email';

beforeEach(() => vi.clearAllMocks());

// ── isConfigured() ────────────────────────────────────────────────────────────

describe('isConfigured()', () => {
    it('returns true when oAuth2.clientId is set', () => {
        vi.mocked(authModule.authConfig).mockReturnValue({ clientId: 'test-client-id' });
        expect(new GmailEmailProvider().isConfigured()).toBe(true);
    });

    it('returns false when oAuth2 config is missing', () => {
        vi.mocked(authModule.authConfig).mockReturnValue(undefined);
        expect(new GmailEmailProvider().isConfigured()).toBe(false);
    });

    it('returns false when clientId is an empty string', () => {
        vi.mocked(authModule.authConfig).mockReturnValue({ clientId: '' });
        expect(new GmailEmailProvider().isConfigured()).toBe(false);
    });
});

// ── getConfigurationState() ───────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured:true when clientId is present', () => {
        vi.mocked(authModule.authConfig).mockReturnValue({ clientId: 'abc' });
        const state = new GmailEmailProvider().getConfigurationState();
        expect(state.configured).toBe(true);
        expect(state.missingKeys).toHaveLength(0);
    });

    it('reports configured:false and lists the missing key', () => {
        vi.mocked(authModule.authConfig).mockReturnValue(undefined);
        const state = new GmailEmailProvider().getConfigurationState();
        expect(state.configured).toBe(false);
        expect(state.missingKeys).toContain('google.oAuth2.clientId');
    });

    it('includes a human-readable reason when not configured', () => {
        vi.mocked(authModule.authConfig).mockReturnValue(undefined);
        const state = new GmailEmailProvider().getConfigurationState();
        expect(state.reason).toMatch(/not configured/i);
    });
});

// ── send() ────────────────────────────────────────────────────────────────────

describe('send()', () => {
    beforeEach(() => {
        vi.mocked(authModule.authConfig).mockReturnValue({ clientId: 'test-client-id' });
    });

    it('delegates to sendEmail with subject and message', async () => {
        await new GmailEmailProvider().send({ to: 'a@b.com', subject: 'Hi', message: '<p>Hello</p>' });
        expect(vi.mocked(emailModule.sendEmail)).toHaveBeenCalledWith(
            expect.objectContaining({ subject: 'Hi', message: '<p>Hello</p>' }),
        );
    });

    it('normalizes a string to into a single-element array', async () => {
        await new GmailEmailProvider().send({ to: 'only@x.com', subject: 'S', message: 'M' });
        const call = vi.mocked(emailModule.sendEmail).mock.calls[0][0];
        expect(call.to).toEqual(['only@x.com']);
    });

    it('passes an array to as-is', async () => {
        await new GmailEmailProvider().send({ to: ['a@b.com', 'c@d.com'], subject: 'S', message: 'M' });
        const call = vi.mocked(emailModule.sendEmail).mock.calls[0][0];
        expect(call.to).toEqual(['a@b.com', 'c@d.com']);
    });

    it('normalizes a string bcc into an array', async () => {
        await new GmailEmailProvider().send({ to: 'a@b.com', bcc: 'bcc@x.com', subject: 'S', message: 'M' });
        const call = vi.mocked(emailModule.sendEmail).mock.calls[0][0];
        expect(call.bcc).toEqual(['bcc@x.com']);
    });

    it('passes an array bcc as-is', async () => {
        await new GmailEmailProvider().send({ to: 'a@b.com', bcc: ['x@y.com', 'z@w.com'], subject: 'S', message: 'M' });
        const call = vi.mocked(emailModule.sendEmail).mock.calls[0][0];
        expect(call.bcc).toEqual(['x@y.com', 'z@w.com']);
    });

    it('omits bcc from sendEmail when not provided', async () => {
        await new GmailEmailProvider().send({ to: 'a@b.com', subject: 'S', message: 'M' });
        const call = vi.mocked(emailModule.sendEmail).mock.calls[0][0];
        expect(call.bcc).toBeUndefined();
    });

    it('throws when provider is not configured', async () => {
        vi.mocked(authModule.authConfig).mockReturnValue(undefined);
        await expect(
            new GmailEmailProvider().send({ to: 'a@b.com', subject: 'S', message: 'M' }),
        ).rejects.toThrow();
    });

    it('calls sendEmail exactly once per send() call', async () => {
        await new GmailEmailProvider().send({ to: 'a@b.com', subject: 'S', message: 'M' });
        expect(vi.mocked(emailModule.sendEmail)).toHaveBeenCalledTimes(1);
    });
});
