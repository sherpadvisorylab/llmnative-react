import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        chatMessages: {
            page: {
                title: "رسائل الدردشة",
                description: "أجزاء رد النموذج: Markdown أثناء البث، وتفكير النموذج، والأسئلة التفاعلية. ChatMarkdown وChatReasoning وChatQuestions.",
            },
            sections: {
                markdown: {
                    title: "Markdown أثناء البث",
                    description: "يعرض ChatMarkdown تنسيق GFM (جداول، قوائم، عناوين، اقتباسات، شيفرة مع التلوين والنسخ). مع streaming يغلق ما تركه النص مفتوحًا، فلا يقفز الجدول أو كتلة الشيفرة أثناء وصولها. في لوحة ضيقة يتمرر الجدول داخل نفسه.",
                },
                reasoning: {
                    title: "التفكير",
                    description: "يحتفظ ChatReasoning بتفكير النموذج في كتلة خاصة به: مفتوحة أثناء البث، ثم مطوية خلف \"فكّر لمدة 12 ث\".",
                },
                questions: {
                    title: "أسئلة تفاعلية",
                    description: "ChatQuestions: علامة تبويب لكل سؤال، خيارات مرقمة مع إبراز الموصى به، اختيار واحد أو متعدد، \"أخرى\" مع نص حر، مراجعة وزر إرسال واحد. المفاتيح: الأرقام تختار، الأسهم تتنقل، Enter يتابع.",
                },
                answered: {
                    title: "تمت الإجابة",
                    description: "مع answers تعرض الأسئلة نفسها الإجابات المعطاة للقراءة فقط: لرسالة سابقة في المحادثة.",
                },
            },
            demo: {
                replay: "ابدأ البث",
                streaming: "يصل…",
                again: "أجب مرة أخرى",
                markdown: "## خطة الإصدار\n\nثلاث خطوات، **خطوة كل أسبوع**:\n\n1. تجميد الفرع `main`\n2. تشغيل الفحوصات ~~اليدوية~~ الآلية\n3. النشر\n\n| الخطوة | المسؤول | الموعد | ملاحظات |\n| --- | --- | --- | --- |\n| التجميد | Ada | الإثنين | الإعلان في القناة قبل الظهر |\n| الفحوصات | Linus | الأربعاء | تشمل اختبارات الانحدار المرئي |\n| النشر | Grace | الجمعة | npm وسجل التغييرات |\n\n```ts\nexport async function publish(version: string) {\n  await run(`npm publish --tag ${version}`);\n}\n```\n\n> اسأل قبل النشر يوم الجمعة. راجع [الدليل](https://github.com/sherpadvisorylab/llmnative-react).",
                reasoning: "يريد المستخدم إصدارًا يوم **الجمعة**.\n\n- تستغرق الفحوصات يومين\n- الأربعاء هو آخر يوم آمن لها\n\nلذلك يجب التجميد يوم الإثنين.",
                reasoningAnswer: "التجميد يوم **الإثنين**، والفحوصات يوم الأربعاء، والنشر يوم الجمعة.",
                q1Header: "قاعدة البيانات",
                q1Question: "أي قاعدة بيانات يجب أن يستخدمها المشروع؟",
                q1Option1: "Postgres",
                q1Option1Description: "علائقية، تعمل كخدمة",
                q1Option2: "SQLite",
                q1Option2Description: "ملف واحد، لا شيء لتشغيله",
                q2Header: "الميزات",
                q2Question: "ما الميزات التي تدخل في الإصدار الأول؟",
                q2Option1: "تسجيل الدخول",
                q2Option2: "البحث",
                q2Option3: "التصدير إلى CSV",
            },
            propsDocs: {
                markdown: {
                    content: {
                        description: "Markdown بتنسيق GFM للرسالة.",
                    },
                    streaming: {
                        description: "النص ما زال يصل: يُصلح آخره قبل العرض.",
                    },
                    tone: {
                        description: "muted لنص ثانوي، مثل التفكير.",
                    },
                    highlight: {
                        description: "تلوين صياغة الشيفرة (Prism، يُحمّل عند الحاجة).",
                    },
                    onLinkClick: {
                        description: "يُستدعى عند رابط إلى مسار في التطبيق؛ العناوين تفتح في علامة تبويب جديدة.",
                    },
                    components: {
                        description: "استبدال عناصر مفردة، كما في react-markdown.",
                    },
                    classNames: {
                        description: "أصناف لـ root وparagraph وheading وlist وblockquote وtableWrapper وtable وth وtd وcodeBlock وcodeHeader وcode وinlineCode وlink.",
                    },
                },
                reasoning: {
                    content: {
                        description: "التفكير بصيغة Markdown.",
                    },
                    streaming: {
                        description: "ما زال يصل: مفتوح (ما لم يغلقه المستخدم) مع أيقونة نابضة.",
                    },
                    duration: {
                        description: "ثواني التفكير: \"فكّر لمدة 12 ث\".",
                    },
                    defaultOpen: {
                        description: "مفتوح عندما لا يكون في البث.",
                    },
                    open: {
                        description: "حالة فتح متحكم بها.",
                    },
                    onOpenChange: {
                        description: "يُستدعى عند النقر على سطر الملخص.",
                    },
                    label: {
                        description: "يستبدل نص الملخص.",
                    },
                    icon: {
                        description: "أيقونة سطر الملخص.",
                    },
                    classNames: {
                        description: "أصناف لـ root وtrigger وcontent.",
                    },
                },
                questions: {
                    questions: {
                        description: "الأسئلة، بشكل أداة question في opencode وMCP elicitation.",
                    },
                    onSubmit: {
                        description: "كل الإجابات بالترتيب: التسميات المختارة و/أو النص الحر. يُنتظر الوعد؛ وعند اكتماله تظهر حالة الإجابة.",
                    },
                    numbering: {
                        description: "1-2-3 أو A-B-C؛ افتراضيًا كما كُتبت التسميات.",
                    },
                    allowOther: {
                        description: "\"أخرى\" مع إجابة حرة في كل سؤال.",
                    },
                    answers: {
                        description: "إجابات معطاة مسبقًا: تُعرض للقراءة فقط بدل النموذج.",
                    },
                    disabled: {
                        description: "يعرض النموذج دون السماح بتغييره أو إرساله.",
                    },
                    autoFocus: {
                        description: "يضع التركيز على الخيار الأول لتعمل الأرقام فورًا.",
                    },
                    submitLabel: {
                        description: "نص زر الإرسال.",
                    },
                    classNames: {
                        description: "أصناف لـ root وtabs وtab وpanel وquestion وoption وoptionSelected وfooter وsummary.",
                    },
                },
            },
            playground: {
                title: "ChatMarkdown",
            },
            propsTitle: "الخصائص",
        },
    },
});
