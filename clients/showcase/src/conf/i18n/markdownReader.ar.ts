import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        markdownReader: {
            page: {
                title: 'MarkdownReader',
                description: 'يعرض Markdown بتنسيق @llmnative/react مع دعم GFM ونسخ الكود ومعالجة الروابط الداخلية.',
            },
            sections: {
                renderedMarkdown: {
                    title: 'Markdown المعروض',
                    description: 'يمكن قراءة نفس سلسلة Markdown داخل المستودع ثم عرضها داخل التطبيق.',
                },
            },
            labels: {
                internalNavigationIntercepted: 'تم اعتراض التنقل الداخلي:',
            },
            demo: {
                content: `# MarkdownReader

اعرض Markdown مناسب للمستودع باستخدام تنسيق @llmnative/react.

## المزايا

- GitHub Flavored Markdown
- روابط مرجعية للعناوين
- اعتراض الروابط الداخلية
- كتل كود قابلة للنسخ

| الميزة | الحالة |
| --- | --- |
| الجداول | مدعومة |
| قوائم المهام | مدعومة |

- [x] عرض التوثيق
- [ ] ربط صفحات بنمط wiki

> يظل Markdown قابلا للقراءة للبشر وAI، بينما يعرضه التطبيق كواجهة UI ذات طابع موحد.

\`\`\`tsx
<MarkdownReader content={markdown} />
\`\`\`

تابع الى [Quick start](/docs/quick-start).`,
                metadataTitle: 'MarkdownReader',
                metadataDescription: 'يعرض Markdown مع دعم GFM ومكونات ذات طابع موحد.',
            },
            propsDocs: {
                title: 'خصائص MarkdownReader',
                items: {
                    content: { description: 'سلسلة Markdown المطلوب عرضها.' },
                    metadata: { description: 'بيانات SEO الوصفية التي يتم حقنها عبر مكون Head.', typeDetails: `{
  title?: string;
  description?: string;
}` },
                    onInternalLinkClick: { description: 'يعترض النقرات على الروابط الداخلية ذات المسارات النسبية. استخدمه للتنقل عبر React Router.' },
                    components: { description: 'تخصيصات مكونات react-markdown التي يتم دمجها فوق العارضات المضمنة ذات الطابع الموحد مثل h1-h4 و p و ul و ol و table و a و pre و code.' },
                    className: { description: 'فئات CSS اضافية على غلاف prose.' },
                    wrapperClassName: { description: 'فئات CSS اضافية على عنصر div الخارجي الاكثر علوا، وتطبق بجانب className.' },
                },
            },
            playground: {
                title: 'Markdown Reader',
            },
        },
    },
});
