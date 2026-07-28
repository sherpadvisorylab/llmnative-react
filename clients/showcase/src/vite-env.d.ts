/// <reference types="vite/client" />

declare module '*.md?raw' {
    const content: string;
    export default content;
}

declare module '*.css' {
    const content: string;
    export default content;
}

declare module 'prismjs/components/*' {
    const component: unknown;
    export default component;
}
