---
title: AIProvider
group: Service providers
order: 60
path: /providers/ai
description: Use the active AI service through one stable orchestration layer, regardless of the underlying model vendor.
---

# AIProvider

`AIProvider` is the fifth framework service slot. It powers AI-first components such as `Prompt`, `AssistantAI` and any custom workflow that calls `AI.fetch(...)`.

The goal is the same as for `data`, `storage`, `auth` and `email`: keep the external interface stable while allowing the underlying provider and model to change.

## Supported AI services

| Driver | Backend | Best for |
|---|---|---|
| `openai` | OpenAI API | GPT models and broad ecosystem compatibility |
| `gemini` | Google Gemini API | Gemini-native projects and Google ecosystem |
| `anthropic` | Anthropic API | Claude models |
| `mistral` | Mistral API | Mistral-hosted text models |
| custom | Your adapter | internal gateways, proxy routers, vendor aggregators |

For complete configuration, see [AppProvidersConfig](/docs/app-configuration#appprovidersconfig) and [AIConfig](/docs/app-configuration#aiconfig--centralized-api-keys-for-the-ai-service).

## Core idea: one external model reference

At the component boundary, the canonical model identifier is:

```ts
provider/model
```

Examples:

- `openai/gpt-5`
- `openai/gpt-5-mini`
- `gemini/gemini-2.5-pro`
- `anthropic/claude-opus-4.1`

This avoids ambiguity and keeps stored prompt settings deterministic even when multiple providers are configured at the same time.

## How the orchestrator works

The AI service has two layers:

1. **Central config + registry**
   - `<App aiConfig={...} providers={{ services: { ai: 'openai' } }}>`
   - enables only providers that actually have an API key configured
2. **Runtime orchestration**
   - resolves the active provider
   - parses `provider/model`
   - queries provider capabilities and available models
   - caches model discovery in `localStorage`
   - sends the completion request through the selected adapter

So the end-user API stays stable even if the provider changes.

```tsx
const summary = await AI.fetch(
  'Summarize this record',
  { model: 'openai/gpt-5', temperature: 0.4 },
  { title: 'Quarterly report' }
);
```

If later you switch to:

```tsx
services: { ai: 'gemini' }
```

the components do not change. Only the provider selection does.

## Configuration state

Built-in AI providers expose configuration state like the other service providers.

- `openai` checks `ai.openaiApiKey`
- `gemini` checks `ai.geminiApiKey`
- `anthropic` checks `ai.anthropicApiKey`
- `mistral` checks `ai.mistralApiKey`

That lets UI stay visible but disabled when a provider is not configured.

```ts
const ai = useAIProvider();
const state = ai?.getConfigurationState?.();

console.log(state?.configured, state?.missingKeys);
```

## Dynamic model discovery

Built-in AI providers do not rely only on a hardcoded model list.

At runtime the orchestrator:

- enables only providers with a configured API key;
- calls the provider model-list endpoint when available;
- normalizes the result into `{ id, provider, model, label }`;
- caches it in `localStorage` for 24 hours;
- falls back to a minimal static list if discovery fails.

This is what powers the `Prompt` model selector.

## Use AI in Prompt

`Prompt` reads model options and capabilities from the active AI provider registry.

```tsx
import { Prompt, PromptMode } from '@llmnative/react';

<Prompt
  name="summary"
  label="Summary"
  mode={PromptMode.LIVE}
  defaultValue={{
    enabled: true,
    value: 'Write a concise launch summary for {projectName}.',
    model: 'openai/gpt-5',
    temperature: 0.4,
  }}
/>
```

The component does not need to know how OpenAI, Gemini or Anthropic build their HTTP payloads. That stays inside the provider adapter.

## Use AI in AssistantAI

```tsx
import { AssistantAI } from '@llmnative/react';

<AssistantAI
  name="copilot"
  label="Copilot"
  model="openai/gpt-5-mini"
  temperature={0.2}
/>
```

## Use AI directly in custom workflows

```tsx
import { AI } from '@llmnative/react';

async function generateHeadline(title: string) {
  return AI.fetch(
    'Generate a product headline for {title}',
    { model: 'gemini/gemini-2.5-pro', temperature: 0.6 },
    { title }
  );
}
```

## Access the provider directly

Use hooks when you need direct provider access or diagnostics.

```tsx
import { useAIProvider, useAIProviderRegistry } from '@llmnative/react';

function AIStatus() {
  const provider = useAIProvider();
  const registry = useAIProviderRegistry();

  return (
    <pre>
      default: {provider?.id}
      available: {Object.keys(registry?.registry ?? {}).join(', ')}
    </pre>
  );
}
```

## Minimal configuration

```tsx
<App
  aiConfig={{
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  }}
  providers={{
    services: {
      ai: 'openai',
    },
  }}
/>
```

If `services.ai` is omitted, the orchestrator picks the first configured provider in the runtime registry.

## Custom AIProvider

Use a custom provider when your app talks to:

- an internal proxy;
- a multi-vendor router;
- Azure-hosted variants;
- self-hosted inference;
- any service not covered by the built-in adapters.

```ts
import type {
  AICompleteRequest,
  AIProviderAdapter,
  AIProviderCapabilities,
} from '@llmnative/react';

class GatewayAIProvider implements AIProviderAdapter {
  id = 'gateway';
  label = 'Gateway';
  defaultModel = 'gateway/default';

  isConfigured() {
    return true;
  }

  async getCapabilities(): Promise<AIProviderCapabilities> {
    return {
      supportsTemperature: true,
      models: [
        {
          id: 'gateway/default',
          provider: 'gateway',
          model: 'default',
          label: 'Gateway / default',
        },
      ],
    };
  }

  async complete(request: AICompleteRequest) {
    const response = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.text ?? null;
  }
}
```

Register it:

```tsx
<App
  providers={{
    custom: { ai: new GatewayAIProvider() },
    services: { ai: 'custom' },
  }}
/>
```

## Relationship with API keys

The framework keeps API keys centralized at the `<App>` boundary through `aiConfig`. Components such as `Prompt` and `AssistantAI` never receive raw API keys.

That means:

- switching providers does not change end-user component code;
- secrets/config stay centralized;
- provider availability can be diagnosed in one place;
- model discovery can be filtered to configured providers only.
