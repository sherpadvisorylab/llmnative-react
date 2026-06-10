import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@llmnative/react';
import PageLayout from '../showcase/page';

// Token counts pre-computed with the GPT-4 cl100k_base tokenizer (gpt-tokenizer package).
// To regenerate after changing a snippet:
//   node clients/showcase/scripts/computeBenchmarkTokens.mjs
const TOKEN_COUNTS: Record<string, number> = {
    CRUD_FRAMEWORK: 112,
    CRUD_VANILLA: 1118,
    FORM_FRAMEWORK: 144,
    FORM_VANILLA: 752,
    PROVIDER_FRAMEWORK: 119,
    PROVIDER_VANILLA: 466,
    AUTH_FRAMEWORK: 150,
    AUTH_VANILLA: 481,
}

// ─── Code snippets ────────────────────────────────────────────────────────────

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

  if (loading) return <div>Loading…</div>

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

// ─────────────────────────────────────────────────────────────────────────────

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

  if (loading) return <div>Loading…</div>

  return (
    <div className="card p-4">
      <button onClick={() => navigate(-1)}>← Back</button>
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
            <option value="">Select…</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}`;

// ─────────────────────────────────────────────────────────────────────────────

const PROVIDER_FRAMEWORK = `\
// One line change in providers config — every component in your
// app automatically uses the new backend.

// mock (local in-memory, zero network)
services: { data: 'mock' }

// Firebase Realtime DB
services: { data: 'dbRealtime' }

// Cloud Firestore (with onSnapshot realtime)
services: { data: 'firestoreDb' }

// Supabase Postgres (with Realtime)
services: { data: 'supabaseDb' }

// Grid, Form, Select.db and every provider-aware component
// are already wired to the abstraction. Zero component changes.`;

const PROVIDER_VANILLA = `\
// Without a framework you build the abstraction yourself —
// or skip it and couple every component to Firebase directly.

// ── Option A: no abstraction (quick but hard to switch) ─────────
// Every component calls Firebase directly. Switching to Supabase
// means refactoring each one individually. Zero upfront cost,
// high migration cost later.

// ── Option B: DIY data service (~60 lines) ──────────────────────
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

// Wire up (one place — same config as the framework)
export const dataService = import.meta.env.VITE_PROVIDER === 'supabase'
  ? supabaseService
  : firebaseService

// Every component still needs to call dataService.list() / .subscribe()
// explicitly. Grid, Form, Select get no abstraction benefit unless you
// build component wrappers too. The framework ships all of this.`;

// ─────────────────────────────────────────────────────────────────────────────

const AUTH_FRAMEWORK = `\
// 1. Declare the provider once in <App> config:
providers={{
  google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
  services: { auth: 'googleAuth' },
}}

// 2. Wrap any page in <Auth> to require sign-in:
import { Auth } from '@llmnative/react'

export default function Dashboard() {
  return (
    <Auth>
      <h1>Welcome!</h1>
    </Auth>
  )
}

// 3. Access the signed-in user anywhere:
import { useAuthProvider } from '@llmnative/react'

const auth = useAuthProvider()
const user = auth.getUser() // { name, email, picture } | null`;

// Fair comparison: uses @react-oauth/google (best-in-class library),
// not manual GIS — this is what a careful developer would actually write.
const AUTH_VANILLA = `\
// Using @react-oauth/google — the standard library for Google sign-in.
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
//   <GoogleOAuthProvider clientId="..."><AuthProvider>…</AuthProvider></GoogleOAuthProvider>
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

// ─── Types & data ─────────────────────────────────────────────────────────────

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
    /** Keys into TOKEN_COUNTS for pre-computed token values */
    tokenKey: string;
}

const SCENARIOS: Scenario[] = [
    {
        title: 'CRUD Grid with realtime + pagination',
        description:
            'Full create/read/update/delete table backed by Firebase Realtime DB, ' +
            'with live updates, sorting, pagination and modal dialogs.',
        tags: ['Grid', 'Form', 'Modal', 'Firebase'],
        fwLabel: '@llmnative/react',
        vnLabel: 'React + Firebase',
        demoPath: '/components/grid',
        framework: CRUD_FRAMEWORK,
        vanilla: CRUD_VANILLA,
        tokenKey: 'CRUD',
    },
    {
        title: 'Form with validation + load/save',
        description:
            'Edit or create a record: loads existing data from the provider, ' +
            'validates required fields and email format, saves back.',
        tags: ['Form', 'Input', 'Select', 'Validation'],
        fwLabel: '@llmnative/react',
        vnLabel: 'React + Firebase',
        demoPath: '/components/form',
        framework: FORM_FRAMEWORK,
        vanilla: FORM_VANILLA,
        tokenKey: 'FORM',
    },
    {
        title: 'Switch data backend',
        description:
            'Change the data source for the entire app — mock, Firebase RTDB, ' +
            'Firestore or Supabase — without touching a single component.',
        tags: ['DataProvider', 'Ports & Adapters'],
        fwLabel: 'Config change (1 line)',
        vnLabel: 'DIY abstraction layer',
        vnNote: 'A careful developer would build a DataService adapter (~60 lines). ' +
                'The framework ships the same abstraction pre-built and pre-wired to Grid, Form and Select.',
        demoPath: '/providers',
        framework: PROVIDER_FRAMEWORK,
        vanilla: PROVIDER_VANILLA,
        tokenKey: 'PROVIDER',
    },
    {
        title: 'Google Auth + protected route',
        description:
            'Require Google sign-in on any page, access the user profile ' +
            'anywhere, handle loading and sign-out states.',
        tags: ['Auth', 'Google', 'Protected route'],
        fwLabel: '@llmnative/react',
        vnLabel: '@react-oauth/google',
        vnNote: 'Uses the standard @react-oauth/google library — the fairest vanilla comparison, ' +
                'not raw GIS boilerplate.',
        demoPath: '/components/auth',
        framework: AUTH_FRAMEWORK,
        vanilla: AUTH_VANILLA,
        tokenKey: 'AUTH',
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TokenPill({ count }: { count: number }) {
    return (
        <span className="inline-flex items-center text-xs font-mono font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {count.toLocaleString()} tokens
        </span>
    );
}

function SavingsPill({ pct }: { pct: number }) {
    return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-success/15 text-success px-2.5 py-1 rounded-full">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 6L5 3L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {pct}% fewer tokens
        </span>
    );
}

function ScenarioCard({ s }: { s: Scenario }) {
    const fw  = TOKEN_COUNTS[`${s.tokenKey}_FRAMEWORK`] ?? 0;
    const vn  = TOKEN_COUNTS[`${s.tokenKey}_VANILLA`] ?? 0;
    const pct = Math.round((1 - fw / vn) * 100);

    return (
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b bg-card flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{s.title}</h3>
                        {s.demoPath && (
                            <Link
                                to={s.demoPath}
                                className="text-xs text-primary hover:underline shrink-0"
                            >
                                See live →
                            </Link>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{s.description}</p>
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                        {s.tags.map(t => (
                            <Badge key={t}>{t}</Badge>
                        ))}
                    </div>
                </div>
                <SavingsPill pct={pct} />
            </div>

            {/* Code columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y divide-border lg:divide-y-0 lg:divide-x">
                {/* Framework */}
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-success">{s.fwLabel}</span>
                        <TokenPill count={fw} />
                    </div>
                    <pre className="text-xs font-mono bg-muted/40 rounded-lg p-3 overflow-auto max-h-72 leading-relaxed whitespace-pre flex-1">{s.framework}</pre>
                </div>

                {/* Vanilla */}
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">{s.vnLabel}</span>
                        <TokenPill count={vn} />
                    </div>
                    {s.vnNote && (
                        <p className="text-xs text-muted-foreground italic leading-relaxed">{s.vnNote}</p>
                    )}
                    <pre className="text-xs font-mono bg-muted/40 rounded-lg p-3 overflow-auto max-h-72 leading-relaxed whitespace-pre flex-1">{s.vanilla}</pre>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BenchmarkPage() {
    const totalFw  = SCENARIOS.reduce((n, s) => n + (TOKEN_COUNTS[`${s.tokenKey}_FRAMEWORK`] ?? 0), 0);
    const totalVn  = SCENARIOS.reduce((n, s) => n + (TOKEN_COUNTS[`${s.tokenKey}_VANILLA`] ?? 0), 0);
    const totalPct = Math.round((1 - totalFw / totalVn) * 100);
    const saved    = totalVn - totalFw;

    return (
        <PageLayout
            title="Token Benchmark"
            description="How much less code — and how many fewer tokens — an AI needs to describe the same UI using @llmnative/react vs plain React."
        >
            {/* ── Methodology note ── */}
            <div className="text-sm text-muted-foreground bg-muted/40 rounded-lg px-4 py-3 mb-8 leading-relaxed space-y-1.5">
                <p>
                    <span className="font-medium text-foreground">Token counting</span>
                    {' '}uses the{' '}
                    <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">gpt-tokenizer</code>
                    {' '}library (GPT-4 cl100k_base tokenizer). Other models tokenize slightly differently;
                    {' '}the relative difference between columns is what matters, not the absolute numbers.
                </p>
                <p>
                    <span className="font-medium text-foreground">Fair comparisons</span>
                    {' '}— each "vanilla" column uses best-in-class libraries and patterns
                    {' '}(e.g. <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">@react-oauth/google</code> for auth,
                    {' '}a proper DataService abstraction for the provider switch scenario),
                    {' '}not hand-rolled boilerplate.
                    {' '}The goal is to measure the framework's API compression, not to cherry-pick bad vanilla code.
                </p>
            </div>

            {/* ── Aggregate summary ── */}
            <div className="rounded-xl border bg-card px-6 py-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Across all 4 scenarios</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                        {totalPct}%
                        <span className="text-base font-normal text-muted-foreground ml-2">fewer tokens</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {totalFw.toLocaleString()} tokens with @llmnative/react
                        {' '}vs {totalVn.toLocaleString()} tokens with plain React
                        {' '}— a saving of {saved.toLocaleString()} tokens
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 shrink-0">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-success">{totalFw.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">@llmnative/react</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-muted-foreground">{totalVn.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Plain React</p>
                    </div>
                </div>
            </div>

            {/* ── Scenarios ── */}
            <div className="space-y-6">
                {SCENARIOS.map(s => (
                    <ScenarioCard key={s.title} s={s} />
                ))}
            </div>

            {/* ── Why it matters ── */}
            <div className="mt-10 rounded-xl border bg-card px-6 py-5">
                <h2 className="font-semibold text-foreground mb-3">Why fewer tokens matter</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                        <p className="font-medium text-foreground mb-1">Faster generation</p>
                        <p>An AI agent that writes 80% less code per feature completes tasks proportionally faster and stays within context limits longer.</p>
                    </div>
                    <div>
                        <p className="font-medium text-foreground mb-1">Lower cost</p>
                        <p>Every AI API call is billed per token. Fewer output tokens per feature means lower cost per feature — at scale the difference is significant.</p>
                    </div>
                    <div>
                        <p className="font-medium text-foreground mb-1">Higher reliability</p>
                        <p>Less code means less surface area for hallucinations, import errors and state bugs. The framework owns the boilerplate; the AI owns the intent.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
