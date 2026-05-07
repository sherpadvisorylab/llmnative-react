---
title: Introduction
group: Getting started
order: 10
path: /docs
description: What react-firestrap is, when to use it, and how to navigate the documentation.
---

# Introduction

react-firestrap is a **schema-driven React framework** for building data-heavy interfaces quickly. It turns field definitions into working UI, state handling, validation and persistence with much less code than hand-written CRUD screens.

It is not a generic design system. It is opinionated around a few recurring application needs:

- structured data that must be listed, created, edited and deleted;
- consistent application screens across a project;
- provider-backed persistence that can move from Firebase to mock, Supabase or custom backends;
- fast delivery for admin tools, internal apps, dashboards and prototypes.

## What It Does

- CRUD screens with `Grid` and `Form`
- Context-aware form state, validation, nested objects and dynamic arrays
- Data grids with sorting, pagination, grouping and modal editing
- File uploads for images, documents and CSV files
- Provider abstractions for data, storage, auth and email
- App-managed themes and icon providers
- Vite-first scaffolding through the CLI

## What It Does Not Do

- It does not replace your business layer or domain rules.
- It does not aim to be a marketing-site framework.
- It does not replace advanced global state tools such as Zustand or Redux for complex apps.
- It is client-side first; SSR/SSG is not the current target.

## Schema-Driven Core

The central idea is simple: define data shape and UI intent once, then let the framework render and persist the screen.

```tsx
<Form dataStoragePath="/users">
  <Input name="name" label="Name" required />
  <Input name="email" label="Email" inputType="email" />
  <Select name="role" label="Role" options={roleOptions} />
</Form>
```

The same principle powers `Grid`: columns describe the data and the widget handles the repetitive UI behavior.

```tsx
<Grid
  dataStoragePath="/users"
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]}
  allowedActions={['add', 'edit', 'delete']}
  modal={{ mode: 'form' }}
/>
```

## Architecture In 30 Seconds

```text
App
  -> providers, routing, theme, icons
Pages
  -> compose widgets
Widgets
  -> Form, Grid, MarkdownReader
Fields
  -> Input, Select, Upload
UI primitives
  -> Button, Card, Modal, Table
Providers
  -> Firebase, Supabase, mock, custom adapters
```

Next: [Installation](./installation.md), [Quick start](./quick-start.md), or [Provider pattern](./providers.md).
