import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@llmnative/react';
import PageLayout from '../showcase/page';
import { useShowcaseBenchmarkI18n } from '../showcase/i18n';

// Token counts pre-computed with the GPT-4 cl100k_base tokenizer (gpt-tokenizer package).
// To regenerate after changing a snippet:
//   node clients/showcase/scripts/computeBenchmarkTokens.mjs
const TOKEN_COUNTS: Record<string, number> = {
    CRUD_FRAMEWORK: 112,
    CRUD_VANILLA: 1117,
    FORM_FRAMEWORK: 144,
    FORM_VANILLA: 748,
    PROVIDER_FRAMEWORK: 118,
    PROVIDER_VANILLA: 450,
    AUTH_FRAMEWORK: 195,
    AUTH_VANILLA: 480,
};

const CRUD_FRAMEWORK = `\
import { Grid } from '@llmnative/react'

export default function UserList() {
  return (
    <Grid
      path="/users"
      columns={[
        { key: 'name',  label: 'Name',  sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'role',  label: 'Role',  render: 'badge' },
      ]}
      actions={['add', 'edit', 'delete']}
      pagination={{ limit: 20 }}
    />
  )
}`;

const CRUD_VANILLA = `\
import React, { useState, useEffect, useCallback } from 'react'
import {
  getDatabase, ref, onValue,
  push, update, remove,
} from 'firebase/database'

interface User { id: string; name: string; email: string; role: string }
type FormState = Omit<User, 'id'>

const PAGE_SIZE = 20

export default function UserList() {
  const [users, setUsers]           = useState<User[]>([])
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(0)
  const [modal, setModal]           = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [form, setForm] = useState<FormState>({ name:'', email:'', role:'' })
  const db = getDatabase()

  useEffect(() => {
    return onValue(ref(db, '/users'), (snap) => {
      const data = snap.val() ?? {}
      setUsers(
        Object.entries(data).map(([id, v]) => ({
          id, ...(v as Omit<User,'id'>),
        }))
      )
      setLoading(false)
    })
  }, [db])

  const openAdd = () => {
    setForm({ name:'', email:'', role:'' })
    setEditTarget(null)
    setModal(true)
  }
  const openEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, role: u.role })
    setEditTarget(u)
    setModal(true)
  }

  const handleSave = useCallback(async () => {
    if (editTarget)
      await update(ref(db, \`/users/\${editTarget.id}\`), form)
    else
      await push(ref(db, '/users'), form)
    setModal(false)
  }, [db, editTarget, form])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    await remove(ref(db, \`/users/\${deleteTarget.id}\`))
    setDeleteTarget(null)
  }, [db, deleteTarget])

  const sorted = [...users].sort((a, b) => a.name.localeCompare(b.name))
  const paged  = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const pages  = Math.ceil(sorted.length / PAGE_SIZE)

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <h2>Users</h2>
        <button onClick={openAdd}>+ Add</button>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th /></tr>
        </thead>
        <tbody>
          {paged.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className="badge">{u.role}</span></td>
              <td>
                <button onClick={() => openEdit(u)}>Edit</button>
                <button onClick={() => setDeleteTarget(u)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display:'flex', gap:4, marginTop:8 }}>
        {Array.from({ length: pages }, (_, i) => (
          <button key={i} onClick={() => setPage(i)}
            style={{ fontWeight: i === page ? 'bold' : 'normal' }}>
            {i + 1}
          </button>
        ))}
      </div>
      {modal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <h3>{editTarget ? 'Edit' : 'Add'} User</h3>
            <input placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input placeholder="Role"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <p>Delete {deleteTarget.name}?</p>
            <button onClick={handleDelete}>Confirm</button>
            <button onClick={() => setDeleteTarget(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}`;

const FORM_FRAMEWORK = `\
import { Form, Input, Select } from '@llmnative/react'

export default function UserForm() {
  return (
    <Form path="/users" appearance="card" showBack>
      <Input  name="name"  label="Full name" required />
      <Input  name="email" label="Email" inputType="email" required />
      <Select
        name="role"
        label="Role"
        options={[
          { label: 'Admin',  value: 'admin'  },
          { label: 'Editor', value: 'editor' },
          { label: 'Viewer', value: 'viewer' },
        ]}
      />
    </Form>
  )
}`;

const FORM_VANILLA = `\
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDatabase, ref, get, set, push } from 'firebase/database'

interface FormData { name: string; email: string; role: string }
interface Errors   { name?: string; email?: string }

export default function UserForm() {
  const { id }   = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const db       = getDatabase()

  const [data, setData]       = useState<FormData>({ name:'', email:'', role:'' })
  const [errors, setErrors]   = useState<Errors>({})
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) return
    get(ref(db, \`/users/\${id}\`)).then(snap => {
      if (snap.exists()) setData(snap.val() as FormData)
      setLoading(false)
    })
  }, [id, db])

  const validate = (): boolean => {
    const e: Errors = {}
    if (!data.name.trim())  e.name  = 'Required'
    if (!data.email.trim()) e.email = 'Required'
    else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email))
      e.email = 'Invalid email'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (id) await set(ref(db, \`/users/\${id}\`), data)
      else    await push(ref(db, '/users'), data)
      navigate(-1)
    } finally { setSaving(false) }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="rounded-lg border bg-card p-4">
      <button onClick={() => navigate(-1)}>Back</button>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Full name</label>
          <input
            value={data.name}
            onChange={e => setData(d => ({ ...d, name: e.target.value }))}
          />
          {errors.name && <span style={{ color:'red' }}>{errors.name}</span>}
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={data.email}
            onChange={e => setData(d => ({ ...d, email: e.target.value }))}
          />
          {errors.email && <span style={{ color:'red' }}>{errors.email}</span>}
        </div>
        <div>
          <label>Role</label>
          <select value={data.role}
            onChange={e => setData(d => ({ ...d, role: e.target.value }))}>
            <option value="">Select...</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}`;

const PROVIDER_FRAMEWORK = `\
// One line change in providers config - every component in your
// app automatically uses the new backend.

// mock (local in-memory, zero network)
services: { data: 'mock' }

// Firebase Realtime DB
services: { data: 'dbRealtime' }

// Cloud Firestore (with onSnapshot realtime)
services: { data: 'firestoreDb' }

// Supabase Postgres (with Realtime)
services: { data: 'supabaseDb' }

// Grid, Form, Select and other provider-aware components
// are already wired to the abstraction. Zero component changes.`;

const PROVIDER_VANILLA = `\
// Without a framework you build the abstraction yourself -
// or skip it and couple every component to Firebase directly.

// Option A: no abstraction (quick but hard to switch)
// Every component calls Firebase directly. Switching to Supabase
// means refactoring each one individually. Zero upfront cost,
// high migration cost later.

// Option B: DIY data service (~60 lines)
interface DataService {
  list(path: string): Promise<Record<string, unknown>[]>
  set(path: string, data: object): Promise<void>
  remove(path: string): Promise<void>
  subscribe(path: string, cb: (rows: Record<string,unknown>[]) => void): () => void
}

// Firebase adapter (~25 lines)
const firebaseService: DataService = {
  list: async (path) => { /* get + Object.entries */ return [] },
  set: async (path, data) => { /* set / push */ },
  remove: async (path) => { /* remove */ },
  subscribe: (path, cb) => { /* onValue */ return () => undefined },
}

// Supabase adapter (~25 lines)
const supabaseService: DataService = {
  list: async (table) => {
    const { data } = await supabase.from(table).select('*')
    return data ?? []
  },
  set: async (table, data) => { await supabase.from(table).upsert(data) },
  remove: async (id) => { /* delete */ },
  subscribe: (table, cb) => {
    const ch = supabase.channel(table)
      .on('postgres_changes', { event:'*', schema:'public', table },
          () => supabaseService.list(table).then(cb))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  },
}

// Wire up (one place - same config as the framework)
export const dataService = import.meta.env.VITE_PROVIDER === 'supabase'
  ? supabaseService
  : firebaseService

// Every component still needs to call dataService.list() / .subscribe()
// explicitly. Grid, Form and Select get no abstraction benefit unless you
// build component wrappers too. The framework ships all of this.`;

const AUTH_FRAMEWORK = `\
// 1. Declare the provider once in <App> config:
providers={{
  google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
  services: { auth: 'googleAuth' },
}}

// 2. Use the provider-driven auth UI and gate content off the auth adapter:
import { AuthButton, useAuthProvider } from '@llmnative/react'

export default function Dashboard() {
  const auth = useAuthProvider()
  const user = auth.getUser()

  if (!user) {
    return <AuthButton provider="googleAuth" intent="signIn" />
  }

  return (
    <section>
      <h1>Welcome, {user.name ?? user.email ?? 'there'}!</h1>
    </section>
  )
}

// 3. Access the signed-in user anywhere:
// const auth = useAuthProvider()
// const user = auth.getUser() // { name, email, picture } | null`;

const AUTH_VANILLA = `\
// Using @react-oauth/google - the standard library for Google sign-in.
// A careful developer would write this, not raw GIS boilerplate.

import React, { createContext, useContext, useState } from 'react'
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  googleLogout,
} from '@react-oauth/google'

interface User { name: string; email: string; picture: string }
interface AuthCtx { user: User | null; login: () => void; signOut: () => void }

const Ctx = createContext<AuthCtx>({
  user: null, login: () => undefined, signOut: () => undefined,
})

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const info = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: \`Bearer \${access_token}\` } }
      ).then(r => r.json() as Promise<User>)
      setUser(info)
    },
  })

  const signOut = () => { googleLogout(); setUser(null) }
  return (
    <Ctx.Provider value={{ user, login, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, login } = useContext(Ctx)
  if (!user) return <button onClick={login}>Sign in with Google</button>
  return <>{children}</>
}

// In index.tsx: wrap App in
//   <GoogleOAuthProvider clientId="..."><AuthProvider>...</AuthProvider></GoogleOAuthProvider>
// Wrap every protected page in <ProtectedRoute>.
export default function Dashboard() {
  const { user, signOut } = useContext(Ctx)
  return (
    <ProtectedRoute>
      <img src={user?.picture} alt={user?.name} width={32} height={32} />
      <span>{user?.name}</span>
      <button onClick={signOut}>Sign out</button>
      <h1>Welcome!</h1>
    </ProtectedRoute>
  )
}`;

interface Scenario {
    title: string;
    description: string;
    tags: string[];
    fwLabel: string;
    vnLabel: string;
    vnNote?: string;
    demoPath?: string;
    framework: string;
    vanilla: string;
    tokenKey: string;
}

function TokenPill({ count, label }: { count: number; label: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
            {count.toLocaleString()} {label}
        </span>
    );
}

function SavingsPill({ pct, label }: { pct: number; label: string }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 6L5 3L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {pct}% {label}
        </span>
    );
}

function ScenarioCard({
    scenario,
    seeLiveLabel,
    tokenLabel,
    fewerTokensLabel,
}: {
    scenario: Scenario;
    seeLiveLabel: string;
    tokenLabel: string;
    fewerTokensLabel: string;
}) {
    const fw = TOKEN_COUNTS[`${scenario.tokenKey}_FRAMEWORK`] ?? 0;
    const vn = TOKEN_COUNTS[`${scenario.tokenKey}_VANILLA`] ?? 0;
    const pct = Math.round((1 - fw / vn) * 100);

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b bg-card px-5 py-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{scenario.title}</h3>
                        {scenario.demoPath && (
                            <Link to={scenario.demoPath} className="shrink-0 text-xs text-primary hover:underline">
                                {seeLiveLabel} {'->'}
                            </Link>
                        )}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{scenario.description}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {scenario.tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                        ))}
                    </div>
                </div>
                <SavingsPill pct={pct} label={fewerTokensLabel} />
            </div>

            <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-success">{scenario.fwLabel}</span>
                        <TokenPill count={fw} label={tokenLabel} />
                    </div>
                    <pre className="max-h-72 flex-1 overflow-auto whitespace-pre rounded-lg bg-muted/40 p-3 font-mono text-xs leading-relaxed">{scenario.framework}</pre>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">{scenario.vnLabel}</span>
                        <TokenPill count={vn} label={tokenLabel} />
                    </div>
                    {scenario.vnNote && (
                        <p className="text-xs italic leading-relaxed text-muted-foreground">{scenario.vnNote}</p>
                    )}
                    <pre className="max-h-72 flex-1 overflow-auto whitespace-pre rounded-lg bg-muted/40 p-3 font-mono text-xs leading-relaxed">{scenario.vanilla}</pre>
                </div>
            </div>
        </div>
    );
}

export default function BenchmarkPage() {
    const t = useShowcaseBenchmarkI18n();

    const scenarios = React.useMemo<Scenario[]>(() => ([
        {
            title: t.scenarios.crud.title,
            description: t.scenarios.crud.description,
            tags: [t.scenarios.crud.tags.grid, t.scenarios.crud.tags.form, t.scenarios.crud.tags.modal, t.scenarios.crud.tags.firebase],
            fwLabel: t.scenarios.crud.frameworkLabel,
            vnLabel: t.scenarios.crud.vanillaLabel,
            demoPath: '/components/grid',
            framework: CRUD_FRAMEWORK,
            vanilla: CRUD_VANILLA,
            tokenKey: 'CRUD',
        },
        {
            title: t.scenarios.form.title,
            description: t.scenarios.form.description,
            tags: [t.scenarios.form.tags.form, t.scenarios.form.tags.input, t.scenarios.form.tags.select, t.scenarios.form.tags.validation],
            fwLabel: t.scenarios.form.frameworkLabel,
            vnLabel: t.scenarios.form.vanillaLabel,
            demoPath: '/components/form',
            framework: FORM_FRAMEWORK,
            vanilla: FORM_VANILLA,
            tokenKey: 'FORM',
        },
        {
            title: t.scenarios.provider.title,
            description: t.scenarios.provider.description,
            tags: [t.scenarios.provider.tags.dataProvider, t.scenarios.provider.tags.portsAdapters],
            fwLabel: t.scenarios.provider.frameworkLabel,
            vnLabel: t.scenarios.provider.vanillaLabel,
            vnNote: t.scenarios.provider.vanillaNote,
            demoPath: '/providers',
            framework: PROVIDER_FRAMEWORK,
            vanilla: PROVIDER_VANILLA,
            tokenKey: 'PROVIDER',
        },
        {
            title: t.scenarios.auth.title,
            description: t.scenarios.auth.description,
            tags: [t.scenarios.auth.tags.auth, t.scenarios.auth.tags.google, t.scenarios.auth.tags.protectedRoute],
            fwLabel: t.scenarios.auth.frameworkLabel,
            vnLabel: t.scenarios.auth.vanillaLabel,
            vnNote: t.scenarios.auth.vanillaNote,
            demoPath: '/components/auth',
            framework: AUTH_FRAMEWORK,
            vanilla: AUTH_VANILLA,
            tokenKey: 'AUTH',
        },
    ]), [t]);

    const totalFw = scenarios.reduce((n, s) => n + (TOKEN_COUNTS[`${s.tokenKey}_FRAMEWORK`] ?? 0), 0);
    const totalVn = scenarios.reduce((n, s) => n + (TOKEN_COUNTS[`${s.tokenKey}_VANILLA`] ?? 0), 0);
    const totalPct = Math.round((1 - totalFw / totalVn) * 100);
    const saved = totalVn - totalFw;

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <div className="mb-8 space-y-1.5 rounded-lg bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                    <span className="font-medium text-foreground">{t.methodology.tokenCountingTitle}</span>{' '}
                    {t.methodology.tokenCountingBodyBefore}{' '}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{t.methodology.tokenCountingLib}</code>{' '}
                    {t.methodology.tokenCountingBodyAfter}
                </p>
                <p>
                    <span className="font-medium text-foreground">{t.methodology.fairComparisonsTitle}</span>{' '}
                    {t.methodology.fairComparisonsBodyBefore}{' '}
                    (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{t.methodology.fairComparisonsLib}</code>{' '}
                    {t.methodology.fairComparisonsBodyMiddle}){' '}
                    {t.methodology.fairComparisonsBodyAfter}
                </p>
                <p>
                    <span className="font-medium text-foreground">{t.methodology.representativeSnippetsTitle}</span>{' '}
                    {t.methodology.representativeSnippetsBody}
                </p>
            </div>

            <div className="mb-8 flex flex-col items-start gap-6 rounded-xl border bg-card px-6 py-5 sm:flex-row sm:items-center">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t.labels.acrossAllScenarios}</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">
                        {totalPct}%
                        <span className="ml-2 text-base font-normal text-muted-foreground">{t.labels.fewerTokens}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {totalFw.toLocaleString()} {t.labels.tokens} with @llmnative/react vs {totalVn.toLocaleString()} {t.labels.tokens} with {t.labels.plainReact} - {t.labels.savingOf} {saved.toLocaleString()} {t.labels.tokens}
                    </p>
                </div>
                <div className="grid shrink-0 grid-cols-2 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-success">{totalFw.toLocaleString()}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{t.summary.frameworkLabel}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-muted-foreground">{totalVn.toLocaleString()}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{t.summary.vanillaLabel}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {scenarios.map((scenario) => (
                    <ScenarioCard
                        key={scenario.title}
                        scenario={scenario}
                        seeLiveLabel={t.labels.seeLive}
                        tokenLabel={t.labels.tokens}
                        fewerTokensLabel={t.labels.fewerTokens}
                    />
                ))}
            </div>

            <div className="mt-10 rounded-xl border bg-card px-6 py-5">
                <h2 className="mb-3 font-semibold text-foreground">{t.labels.whyFewerTokensMatter}</h2>
                <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-3">
                    <div>
                        <p className="mb-1 font-medium text-foreground">{t.why.fasterGeneration.title}</p>
                        <p>{t.why.fasterGeneration.description}</p>
                    </div>
                    <div>
                        <p className="mb-1 font-medium text-foreground">{t.why.lowerCost.title}</p>
                        <p>{t.why.lowerCost.description}</p>
                    </div>
                    <div>
                        <p className="mb-1 font-medium text-foreground">{t.why.higherReliability.title}</p>
                        <p>{t.why.higherReliability.description}</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
