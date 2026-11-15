// JSON Schema for the structured answers of the AI providers (CR-132): the subset the providers accept
// (object, array, string with enum, number, integer, boolean, null, required, description, nullable,
// minimum/maximum, minItems/maxItems, additionalProperties). Pure: no React, it runs on a server too.

/** A JSON Schema in the subset the AI providers take. */
export type JsonSchema = {
    type?: JsonSchemaType | JsonSchemaType[];
    description?: string;
    enum?: unknown[];
    properties?: Record<string, JsonSchema>;
    required?: string[];
    additionalProperties?: boolean | JsonSchema;
    items?: JsonSchema;
    minItems?: number;
    maxItems?: number;
    minimum?: number;
    maximum?: number;
    /** OpenAPI style, as Gemini writes it: the value may also be `null`. */
    nullable?: boolean;
    [keyword: string]: unknown;
};

export type JsonSchemaType = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';

const typeOf = (value: unknown): JsonSchemaType => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
    return typeof value as JsonSchemaType;
};

const matchesType = (value: unknown, type: JsonSchemaType): boolean => {
    const actual = typeOf(value);
    return actual === type || (type === 'number' && actual === 'integer');
};

const at = (path: string, key: string | number) => (typeof key === 'number' ? `${path}[${key}]` : path ? `${path}.${key}` : key);

/**
 * The errors of `value` against `schema`, one line each with its path (`richieste[0].servizio: required`);
 * none when it is valid. Unknown keywords are ignored.
 */
export function validateJsonSchema(schema: JsonSchema, value: unknown, path = ''): string[] {
    const where = path || '(root)';
    if (value === null && schema.nullable) return [];
    const types = schema.type === undefined ? [] : Array.isArray(schema.type) ? schema.type : [schema.type];
    if (types.length > 0 && !types.some((type) => matchesType(value, type))) {
        return [`${where}: expected ${types.join(' | ')}, got ${typeOf(value)}`];
    }
    if (schema.enum && !schema.enum.some((option) => option === value)) {
        return [`${where}: must be one of ${schema.enum.map((option) => JSON.stringify(option)).join(', ')}`];
    }
    const errors: string[] = [];
    if (typeof value === 'number') {
        if (typeof schema.minimum === 'number' && value < schema.minimum) errors.push(`${where}: must be >= ${schema.minimum}`);
        if (typeof schema.maximum === 'number' && value > schema.maximum) errors.push(`${where}: must be <= ${schema.maximum}`);
    }
    if (Array.isArray(value)) {
        if (typeof schema.minItems === 'number' && value.length < schema.minItems) errors.push(`${where}: at least ${schema.minItems} items`);
        if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) errors.push(`${where}: at most ${schema.maxItems} items`);
        if (schema.items) value.forEach((item, index) => errors.push(...validateJsonSchema(schema.items!, item, at(path, index))));
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const record = value as Record<string, unknown>;
        for (const key of schema.required ?? []) {
            if (record[key] === undefined) errors.push(`${at(path, key)}: required`);
        }
        for (const [key, child] of Object.entries(record)) {
            const property = schema.properties?.[key];
            if (property) errors.push(...validateJsonSchema(property, child, at(path, key)));
            else if (schema.additionalProperties === false) errors.push(`${at(path, key)}: not allowed`);
            else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
                errors.push(...validateJsonSchema(schema.additionalProperties, child, at(path, key)));
            }
        }
    }
    return errors;
}

/**
 * The JSON value in a model's answer: the whole text, or the first fenced block, or the first balanced
 * `{…}`/`[…]` in it. `undefined` when there is none that parses.
 */
export function extractJson(text: string): unknown {
    const attempts: string[] = [text.trim()];
    const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
    if (fenced) attempts.push(fenced[1].trim());
    const start = text.search(/[[{]/);
    if (start >= 0) {
        const open = text[start];
        const close = open === '{' ? '}' : ']';
        let depth = 0;
        let inString = false;
        for (let index = start; index < text.length; index += 1) {
            const char = text[index];
            if (inString) {
                if (char === '\\') index += 1;
                else if (char === '"') inString = false;
                continue;
            }
            if (char === '"') inString = true;
            else if (char === open) depth += 1;
            else if (char === close && --depth === 0) {
                attempts.push(text.slice(start, index + 1));
                break;
            }
        }
    }
    for (const attempt of attempts) {
        try {
            return JSON.parse(attempt);
        } catch {
            // the next way of reading it
        }
    }
    return undefined;
}
