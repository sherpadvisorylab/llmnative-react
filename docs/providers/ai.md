---
title: AIProvider
group: Service providers
order: 60
path: /providers/ai
description: Use the active AI service through one stable orchestration layer, regardless of the underlying model vendor.
---

# AIProvider

`AIProvider` is the fifth framework service slot. It powers AI-first components such as `Prompt`, `WorkflowAI` and any custom workflow that calls `AI.fetch(...)`.

The goal is the same as for `data`, `storage`, `auth` and `email`: keep the external interface stable while allowing the underlying provider and model to change.

## Supported AI services

| Driver | Backend | Best for |
|---|---|---|
| `openai` | OpenAI API | GPT models and broad ecosystem compatibility |
| `openrouter` | OpenRouter API | Aggregated vendor routing through one OpenAI-style endpoint |
| `opencode` | OpenCode Zen API | OpenCode-hosted coding models exposed through chat completions |
| `openai-compatible` | Your OpenAI-style endpoint | proxies, gateways, local servers, private routers |
| `deepseek` | DeepSeek API | DeepSeek chat/reasoning models |
| `gemini` | Google Gemini API | Gemini-native projects and Google ecosystem |
| `anthropic` | Anthropic API | Claude models |
| `mistral` | Mistral API | Mistral-hosted text models |
| `glm` | ZhipuAI API | GLM chat models |
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
- `openrouter/openai/gpt-4`
- `opencode/kimi-k2.6`
- `deepseek/deepseek-chat`
- `gemini/gemini-2.5-pro`
- `anthropic/claude-opus-4.1`
- `mistral/mistral-large-latest`
- `glm/glm-4-plus`

This avoids ambiguity and keeps stored prompt settings deterministic even when multiple providers are configured at the same time.

For routers such as OpenRouter, only the first slash is treated as the framework separator. So `openrouter/openai/gpt-4` means:

- provider: `openrouter`
- model id sent upstream: `openai/gpt-4`

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
- `openrouter` checks `ai.openRouterApiKey`
- `opencode` checks `ai.openCodeApiKey`
- `openai-compatible` checks `ai.openAICompatible.apiKey` and `ai.openAICompatible.baseUrl`
- `deepseek` checks `ai.deepSeekApiKey`
- `gemini` checks `ai.geminiApiKey`
- `anthropic` checks `ai.anthropicApiKey`
- `mistral` checks `ai.mistralApiKey`
- `glm` checks `ai.glmApiKey`

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

All built-in providers now follow this pattern:

- `openai`, `openrouter`, `deepseek`, `mistral`, `openai-compatible` -> `GET /models`
- `gemini` -> `GET /v1beta/models`
- `anthropic` -> `GET /v1/models`
- `opencode` -> `GET /zen/v1/models`, filtered to the `chat/completions`-compatible subset

## Public unified catalog

If multiple AI providers are configured, use the public catalog helper to get one merged model list plus provider-grouped breakdown.

```ts
import { createAIProviderRegistry, getAIModelCatalog } from '@llmnative/react';

const registry = createAIProviderRegistry(aiConfig);
const catalog = await getAIModelCatalog(registry);

console.log(catalog.models);
console.log(catalog.modelsByProvider);
console.log(catalog.capabilitiesByProvider);
```

`catalog.models` is the unified list.

Each item already carries its provider:

```ts
{
  id: 'openrouter/openai/gpt-4',
  provider: 'openrouter',
  model: 'openai/gpt-4',
  label: 'OpenRouter / openai/gpt-4'
}
```

## Use AI in Prompt

`Prompt` reads model options and capabilities from the active AI provider registry.

```tsx
import { Prompt, PromptMode } from '@llmnative/react';

<Prompt
  name="summary"
  label="Summary"
  mode={PromptMode.RUN}
  defaultValue={{
    enabled: true,
    value: 'Write a concise launch summary for {projectName}.',
    model: 'openai/gpt-5',
    temperature: 0.4,
  }}
/>
```

The component does not need to know how OpenAI, Gemini or Anthropic build their HTTP payloads. That stays inside the provider adapter.

## Built-in provider structure

Built-in AI adapters now live one file per provider inside `src/providers/ai/`:

- `openai.ts`
- `openrouter.ts`
- `opencode.ts`
- `openaiCompatible.ts`
- `deepseek.ts`
- `gemini.ts`
- `anthropic.ts`
- `mistral.ts`
- `shared.ts` for the common runtime adapter/cache helpers
- `index.ts` to assemble the built-in registry

This keeps the public API unchanged while making the provider layer easier to extend and audit.

`openrouter` is implemented as a dedicated preset on top of the shared `openaiCompatible.ts` base adapter. `opencode` uses the official Zen model catalog, then filters to the `chat/completions`-compatible subset so the prompt UI only offers models that match the current transport.

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
    openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    openCodeApiKey: import.meta.env.VITE_OPENCODE_API_KEY,
    deepSeekApiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
    openAICompatible: {
      apiKey: import.meta.env.VITE_GATEWAY_API_KEY,
      baseUrl: import.meta.env.VITE_GATEWAY_BASE_URL,
      defaultModel: 'my-default-model',
    },
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

The framework keeps API keys centralized at the `<App>` boundary through `aiConfig`. Components such as `Prompt` and `WorkflowAI` never receive raw API keys.

That means:

- switching providers does not change end-user component code;
- secrets/config stay centralized;
- provider availability can be diagnosed in one place;
- model discovery can be filtered to configured providers only.

## Browser CORS and the proxy service

Some providers work poorly or not at all when called directly from the browser because their endpoints reject CORS preflight requests.

Built-in AI adapters do not build proxy URLs themselves anymore. They use the framework fetch helpers, which delegate to `proxyFetch(...)`. When the active proxy provider is enabled, `proxyFetch(...)` rewrites outbound provider calls through that same-origin relay before issuing the request.

```tsx
<App
  aiConfig={{
    openCodeApiKey: import.meta.env.VITE_OPENCODE_API_KEY,
  }}
  providers={{
    proxy: {
      enabled: import.meta.env.VITE_PROXY_ENABLED === 'true',
    },
    services: {
      ai: 'opencode',
      proxy: 'viteDevProxy',
    },
  }}
/>
```

This does not eliminate the need for a relay somewhere, but it does make the relay contract framework-native so browser apps can adopt it without custom per-provider wiring.

Important boundary:

- `proxyFetch(...)` belongs to the library runtime
- the `/api/proxy` route belongs to the application project

Scaffolded Vite projects generate that relay as a dedicated app-level file (`dev/proxy.ts`) when `--proxy-provider=viteDevProxy` is selected.

See [Proxy relay](/docs/proxy) for the detailed architecture.
