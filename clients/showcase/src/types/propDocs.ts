export type PropDoc<TProps> = {
    name: keyof TProps & string;
    type: string;
    description: string;
    shape?: string;
    example?: string;
    default?: string;
    required?: boolean;
    category?: string;
};

export type PropDocsInput = {
    name: string;
    type: string;
    description?: string;
    shape?: string;
    example?: string;
    default?: string;
    required?: boolean;
    category?: string;
    typeDetails?: string;
    group?: string;
};

export type PropDocsConfig<TProps> = readonly (PropDoc<TProps> & Record<string, unknown>)[];

export function definePropDocs<TProps>() {
    return <T extends readonly (PropDoc<TProps> & Record<string, unknown>)[]>(docs: T) => docs;
}
