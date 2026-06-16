import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        listGroup: {
            page: {
                title: 'ListGroup',
                description: 'Jian rong Bootstrap de list group, zhi chi active, disabled, loading, click he drag zhuang tai.',
            },
            sections: {
                statusList: {
                    title: 'Zhuang tai lie biao',
                    description: 'Shi yong active, disabled he badge zhuang tai lai biao da workflow jie duan huo fen zu dao hang xiang.',
                },
            },
            labels: {
                workflow: 'Workflow',
                backlog: 'Backlog',
                inProgress: 'In progress',
                review: 'Review',
                done: 'Done',
            },
            propsDocs: {
                items: {
                    children: { description: 'Lie biao xiang nei rong.' },
                    label: { description: 'Lie biao shang fang de ke xuan biao qian.' },
                    onClick: { description: 'Rang lie biao xiang ke yi dian ji.' },
                    draggable: { description: 'Rang lie biao xiang ke yi tuo zhuai.' },
                    onDrop: { description: 'Zai fang ru dataTransfer zhi qian, dui tuo zhuai wen ben jin xing zhuan huan.' },
                    activeIndices: { description: 'Bei xuan ran wei active de suo yin.', shortcuts: { none: { label: 'none', help: 'Mei you active xiang.' }, first: { label: 'first', help: 'Di yi xiang wei active.' }, multi: { label: 'multi', help: 'Duo ge xiang wei active.' } } },
                    disabledIndices: { description: 'Bei xuan ran wei disabled de suo yin.', shortcuts: { none: { label: 'none', help: 'Mei you disabled xiang.' }, last: { label: 'last', help: 'Jin yong zui hou yi xiang.' }, mixed: { label: 'mixed', help: 'Jin yong di yi he zui hou yi xiang.' } } },
                    loadingIndices: { description: 'Bei xuan ran wei loading de suo yin.', shortcuts: { none: { label: 'none', help: 'Mei you loading zhuang tai.' }, single: { label: 'single', help: 'Di er xiang loading.' }, multi: { label: 'multi', help: 'Duo ge xiang loading.' } } },
                    before: { description: 'Lie biao qian de nei rong.' },
                    after: { description: 'Lie biao hou de nei rong.' },
                    className: { description: 'List-group shang de CSS lei ming.' },
                    wrapperClassName: { description: 'Wrapper shang de CSS lei ming.' },
                    itemClassName: { description: 'Mei ge xiang shang de CSS lei ming.' },
                },
            },
            playground: {
                title: 'ListGroup',
            },
        },
    },
});
