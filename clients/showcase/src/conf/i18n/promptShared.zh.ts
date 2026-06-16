import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({ showcase: { promptShared: { propsDocs: { groups: { shared: '共享', specific: '专用' }, items: { name: { description: '用作表单键的字段名' }, label: { description: '显示在组件上方的字段标签' }, required: { description: '将当前 textarea 标记为必填', default: 'false' }, defaultValue: { description: '初始 prompt 元数据：模板文本、enabled 标记以及 AI 设置（model、role、language、voice、style、temperature）。', typeDetails: `{
  value?: string;
  enabled?: boolean;
  role?: string;
  language?: string;
  voice?: string;
  style?: string;
  model?: string;
  temperature?: number;
}` }, rows: { description: '滚动前 textarea 的最大行数' }, before: { description: '渲染在 prompt 块之前的内容' }, after: { description: '渲染在 prompt 块之后的内容' }, onChange: { description: '由 Form 上下文调用的自定义变更处理器' }, className: { description: '传给当前 textarea 的 CSS 类' }, wrapperClassName: { description: '传给外层 wrapper 的 CSS 类' }, inheritWrapperClassName: { description: '为 true 时，字段会从父级 Form 上下文继承 wrapperClassName', default: 'true' }, editorMode: { description: '用于编写和保存 prompt 模板。提供 enabled 开关来启用或关闭 prompt 元数据。', default: '"edit"' }, runMode: { description: '针对当前表单记录执行已保存的模板，并将结果写回同一字段。', default: '"run"' }, plainMode: { description: 'plain fallback 仍然使用 run mode，但 defaultValue.enabled = false。', default: '"run"' }, renderAIUnavailableEdit: { description: '未配置 AI provider 时显示的自定义内联渲染器。' }, renderAIUnavailableRun: { description: '未配置 AI provider 时显示的不可用提示自定义渲染器。' }, onRunPrompt: { description: '可选的自定义执行器。提供后会在默认 AI provider 之前调用。适合测试、mock 或自定义 AI 接线。' }, variables: { description: '在预览和执行时注入到模板中的外部键值对。键名对应 {placeholder} token。会与表单记录合并，冲突时 variables 优先。', typeDetails: 'Record<string, unknown>' }, commands: { description: '通过 run 模式 footer 中的 / 按钮显示的 slash 命令。选择后会以当前 textarea 值调用其 handler。', typeDetails: `{
  name: string;
  description?: string;
  icon?: string;
  handler?: (currentValue: string) => string | Promise<string>;
}[]` }, attachments: { description: '启用 footer 中的回形针按钮。附件会显示在结果 textarea 上方，并作为多模态输入转发给兼容的 AI provider。', default: 'false' }, actions: { description: 'run 模式 footer 中的自定义图标按钮。tokenUsage 键会在每次执行后启用内置的 token 使用弹窗。', typeDetails: `{
  key: string;
  icon: string;
  label?: string;
  content?: ReactNode;
}[]` }, statusItems: { description: "每次执行后显示在 footer 下方状态栏中的命名项。内置键包括：'tokensIn'、'tokensOut'、'contextPercent'、'model'、'duration'。", typeDetails: `('tokensIn' | 'tokensOut' | 'contextPercent' | 'model' | 'duration' | { key: string; render: (stats: PromptRunStats) => ReactNode })[]` }, renderFallbackRun: { description: '当 prompt 模式被禁用（enabled=false）时显示的自定义渲染器，会替换默认的 plain textarea。' }, renderFallbackPlain: { description: '当 prompt 模式被禁用时显示的自定义渲染器。' } } }, playground: { inspector: { providerLabel: 'AI provider', providerDescription: '选择 provider 并粘贴 API key，即可把 playground 直接接到内置 AI registry。将 key 留空可查看 unavailable 状态。', apiKeyPlaceholder: '粘贴所选 provider 的 API key', compatibleBaseUrlPlaceholder: 'OpenAI-compatible endpoint 的 Base URL' }, defaults: { projectName: 'projectName', customerName: 'customerName', company: 'company', summaryLabel: 'Summary', summaryPromptLabel: 'Summary prompt', aiSummaryLabel: 'AI summary', atlasConsole: 'Atlas Console', northwindRevamp: 'Northwind Revamp', shortHumanSummary: 'A short human-written summary.', conciseProjectSummary: 'Write a concise project summary for {projectName}.', followUpEmail: 'Draft a short follow-up email for {customerName} from {company}.', english: 'English', friendly: 'friendly', concise: 'concise' }, shortcuts: { summary: { label: 'summary', help: '已启用实时执行的摘要 prompt。' }, email: { label: 'email', help: '客户跟进 prompt。' }, plain: { label: 'plain', help: '不启用 prompt 模式的已保存文本。' }, none: { label: 'none', help: '无外部变量，仅使用表单记录。' }, product: { label: 'product', help: '产品上下文变量。' }, customer: { label: 'customer', help: '客户上下文变量。' } }, mockAi: { header: '[Mock AI - 语言: {language} · 风格: {style} · temp: {temperature}]', defaultValue: 'default' } } } } });
