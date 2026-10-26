import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        chatMessages: {
            page: {
                title: "聊天消息",
                description: "模型回复的组成部分：流式 Markdown、模型的推理和交互式问题。ChatMarkdown、ChatReasoning 和 ChatQuestions。",
            },
            sections: {
                markdown: {
                    title: "流式 Markdown",
                    description: "ChatMarkdown 渲染 GFM（表格、列表、标题、引用、带高亮和复制的代码）。开启 streaming 时，它会补全文本末尾未闭合的结构，因此表格或代码块在到达过程中不会跳动。在窄面板中，表格在自身内部滚动。",
                },
                reasoning: {
                    title: "推理",
                    description: "ChatReasoning 把模型的推理放在单独的块中：流式输出时展开，结束后折叠在“推理了 12 秒”之后。",
                },
                questions: {
                    title: "交互式问题",
                    description: "ChatQuestions：每个问题一个标签页，带编号的选项并突出推荐项，单选或多选，“其他”可自由输入，检查页和一个提交按钮。按键：数字选择，方向键移动，Enter 继续。",
                },
                answered: {
                    title: "已回答",
                    description: "传入 answers 时，同样的问题以只读方式显示已给出的回答：用于对话中的历史消息。",
                },
            },
            demo: {
                replay: "开始流式输出",
                streaming: "正在到达…",
                again: "重新回答",
                markdown: "## 发布计划\n\n三个步骤，**每周一个**：\n\n1. 冻结 `main` 分支\n2. 运行~~手动~~自动检查\n3. 发布\n\n| 步骤 | 负责人 | 时间 | 备注 |\n| --- | --- | --- | --- |\n| 冻结 | Ada | 周一 | 中午前在频道里通知 |\n| 检查 | Linus | 周三 | 包括视觉回归测试 |\n| 发布 | Grace | 周五 | npm 和变更日志 |\n\n```ts\nexport async function publish(version: string) {\n  await run(`npm publish --tag ${version}`);\n}\n```\n\n> 周五发布前请先确认。参见 [指南](https://github.com/sherpadvisorylab/llmnative-react).",
                reasoning: "用户希望在**周五**发布。\n\n- 检查需要两天\n- 周三是进行检查的最后安全日期\n\n所以周一必须冻结。",
                reasoningAnswer: "**周一**冻结，周三检查，周五发布。",
                q1Header: "数据库",
                q1Question: "项目应该使用哪个数据库？",
                q1Option1: "Postgres",
                q1Option1Description: "关系型，作为服务运行",
                q1Option2: "SQLite",
                q1Option2Description: "一个文件，无需启动",
                q2Header: "功能",
                q2Question: "第一个版本包含哪些功能？",
                q2Option1: "登录",
                q2Option2: "搜索",
                q2Option3: "导出为 CSV",
            },
            propsDocs: {
                markdown: {
                    content: {
                        description: "消息的 GFM Markdown。",
                    },
                    streaming: {
                        description: "文本仍在到达：渲染前修复其末尾。",
                    },
                    tone: {
                        description: "muted 用于次要文本，例如推理。",
                    },
                    highlight: {
                        description: "代码语法高亮（Prism，按需加载）。",
                    },
                    onLinkClick: {
                        description: "点击指向应用路由的链接时调用；外部地址在新标签页打开。",
                    },
                    components: {
                        description: "替换单个元素，与 react-markdown 相同。",
                    },
                    classNames: {
                        description: "root、paragraph、heading、list、blockquote、tableWrapper、table、th、td、codeBlock、codeHeader、code、inlineCode、link 的类名。",
                    },
                },
                reasoning: {
                    content: {
                        description: "推理内容，Markdown 格式。",
                    },
                    streaming: {
                        description: "仍在到达：展开（除非用户关闭），图标闪烁。",
                    },
                    duration: {
                        description: "推理秒数：“推理了 12 秒”。",
                    },
                    defaultOpen: {
                        description: "非流式时默认展开。",
                    },
                    open: {
                        description: "受控的展开状态。",
                    },
                    onOpenChange: {
                        description: "点击摘要行时调用。",
                    },
                    label: {
                        description: "替换摘要文本。",
                    },
                    icon: {
                        description: "摘要行的图标。",
                    },
                    classNames: {
                        description: "root、trigger、content 的类名。",
                    },
                },
                questions: {
                    questions: {
                        description: "问题，格式与 opencode 的 question 工具和 MCP elicitation 一致。",
                    },
                    onSubmit: {
                        description: "按顺序给出所有回答：选中的标签和/或自由文本。会等待 Promise；完成后显示已回答状态。",
                    },
                    numbering: {
                        description: "1-2-3 或 A-B-C；默认按标签的写法。",
                    },
                    allowOther: {
                        description: "每个问题都提供带自由输入的“其他”。",
                    },
                    answers: {
                        description: "已给出的回答：以只读方式代替表单显示。",
                    },
                    disabled: {
                        description: "显示表单但不允许修改或提交。",
                    },
                    autoFocus: {
                        description: "聚焦第一个选项，数字键立即可用。",
                    },
                    submitLabel: {
                        description: "提交按钮的文字。",
                    },
                    classNames: {
                        description: "root、tabs、tab、panel、question、option、optionSelected、footer、summary 的类名。",
                    },
                },
            },
            playground: {
                title: "ChatMarkdown",
            },
            propsTitle: "属性",
        },
    },
});
