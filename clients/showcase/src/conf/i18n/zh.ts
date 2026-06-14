import type { DeepPartial } from '@llmnative/react';
import type { I18nDict } from '@llmnative/react';

const zh: DeepPartial<I18nDict> = {
    common: {
        save: '保存', cancel: '取消', delete: '删除', close: '关闭',
        back: '返回', search: '搜索', loading: '加载中...',
        noDataFound: '未找到数据', pageNavigation: '页面导航',
        previous: '上一页', next: '下一页',
        notFoundMessage: '哎呀！页面未找到。', goHome: '返回首页',
    },
    auth: {
        signIn: '登录', signOut: '退出', connect: '连接',
        connected: '已连接', authenticated: '已认证',
        notConfigured: '授权提供商"{provider}"未配置。请检查API密钥。',
        notImplemented: '提供商未实现signIn()。',
    },
    form: {
        headerAdd: '添加', headerEdit: '编辑', buttonSave: '保存',
        buttonDelete: '删除', buttonBack: '返回',
        requiredField: '字段"{field}"为必填项',
        requiredFieldGeneric: '必填字段未填写',
        saveSuccess: '保存成功', deleteSuccess: '删除成功',
        noticeRequiredFields: '请在保存前填写必填字段。',
    },
    grid: {
        buttonAdd: '添加',
        deleteConfirm: '确定要删除此项目吗？',
        emptyState: '暂无数据',
    },
    select: { placeholder: '请选择...' },
    modal: { save: '保存', delete: '删除', cancel: '取消', close: '关闭' },
    upload: {
        clickOrDrag: '点击或拖拽上传...', dropToUpload: '松开上传',
        uploadMore: '添加更多文件', editFileName: '编辑文件名',
        editorImage: '图片编辑器', loaded: '已加载', removeFile: '删除',
        uploadAnother: '上传另一个文件', dropToParse: '松开解析',
    },
    notifications: { title: '通知', seeAll: '查看全部' },
    code: { copyCode: '复制代码', copy: '复制', copied: '已复制！', codeLanguageDefault: '文本' },
    table: {
        noDataFound: '未找到数据', selectAllRows: '选择所有行',
        sortBy: '按{label}排序', sortByCurrent: '按{label}排序（{direction}）',
        selectRow: '选择行{key}', reorderRow: '重排行{key}',
    },
    gallery: { selectItem: '选择项目{key}' },
    crop: {
        enableCrop: '启用{scale}比例裁剪', variants: '变体',
        outputFile: '输出文件', active: '活跃',
        removeVariant: '删除变体{scale}', fileName: '文件名',
    },
    imageEditor: {
        title: '图片编辑器', save: '保存', undo: '撤销', redo: '重做',
        zoomOut: '缩小', zoomIn: '放大', crop: '裁剪',
        flipHorizontal: '水平翻转', flipVertical: '垂直翻转',
        rotate: '旋转90°', freeDrawing: '自由绘制', arrow: '箭头', text: '文本',
        rectangle: '矩形', circle: '圆形', triangle: '三角形',
    },
    prompt: {
        noProviders: '没有已注册的AI提供商。',
        aiNotConfiguredEdit: 'AI未配置。您仍然可以编辑并保存此提示词。',
        aiNotConfiguredRun: 'AI未配置。无法运行此提示词。',
        toggleOnTitle: '禁用AI', toggleOffTitle: '启用AI',
        closeEditor: '关闭编辑器', editSettings: '编辑设置',
        attachFiles: '附加文件', run: '运行', noMatchingCommands: '没有匹配的命令',
        tokenUsage: 'Token用量', tokenInput: '输入：{count} Token',
        tokenOutput: '输出：{count} Token', tokenContext: '上下文：{count} Token',
        tokenCost: '费用：{cost} USD', tokenTime: '时间：{ms}毫秒', tokenUsageEmpty: '-',
        hidePreview: '隐藏预览', showPreview: '显示解析预览',
        noProvider: '无提供商', noResponse: '无响应',
    },
    layout: {
        maxElements: '行中已有12个元素：请先删除一个。',
        noSpace: '空间不足：无法缩小元素以插入此字段。',
        dragToMove: '拖拽移动', remove: '删除',
        dragToResize: '拖拽调整大小', dragHere: '拖拽元素到此处',
    },
};

export default zh;
