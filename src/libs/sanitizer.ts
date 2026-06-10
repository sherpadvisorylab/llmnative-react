import { converter } from "./converter";
import { smartTypeCast } from "./utils";

/* ----------------------------------------------
 * 🔹 Types
 * ---------------------------------------------- */
interface ExclusionItem {
  phrase: string;
}
interface Transformation {
  pattern: string;
  replace: string;
}

type ConverterMask =
  | keyof typeof converter
  | { func: keyof typeof converter; arg?: string };

export interface SanitizerRule {
  description?: string;
  exclusions?: ExclusionItem[];
  transformations?: Transformation[];
  mask?: ConverterMask[];
}

export type SanitizerConfig = Record<string, SanitizerRule>;

/** Map of field patterns → rule names */
export interface SanitizerMatch {
  pattern: string;       // supports wildcard like "email*", "*_price"
  use: keyof SanitizerConfig; // name of rule to apply
}

export const NORMALIZE_MAP: Record<string, string> = {
  // Plus/minus
  "＋": "+",
  "﹢": "+",
  "－": "-",
  "﹣": "-",
  "\u2013": "-",
  "\u2014": "-",

  // Symbols
  "＠": "@",
  "＃": "#",
  "＄": "$",
  "％": "%",
  "＆": "&",
  "＊": "*",

  // Digits (fullwidth → ASCII)
  "０": "0", "１": "1", "２": "2", "３": "3", "４": "4",
  "５": "5", "６": "6", "７": "7", "８": "8", "９": "9",

  // Letters (fullwidth → ASCII)
  "Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "Ｅ": "E",
  "Ｆ": "F", "Ｇ": "G", "Ｈ": "H", "Ｉ": "I", "Ｊ": "J",
  "Ｋ": "K", "Ｌ": "L", "Ｍ": "M", "Ｎ": "N", "Ｏ": "O",
  "Ｐ": "P", "Ｑ": "Q", "Ｒ": "R", "Ｓ": "S", "Ｔ": "T",
  "Ｕ": "U", "Ｖ": "V", "Ｗ": "W", "Ｘ": "X", "Ｙ": "Y", "Ｚ": "Z",
  "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e",
  "ｆ": "f", "ｇ": "g", "ｈ": "h", "ｉ": "i", "ｊ": "j",
  "ｋ": "k", "ｌ": "l", "ｍ": "m", "ｎ": "n", "ｏ": "o",
  "ｐ": "p", "ｑ": "q", "ｒ": "r", "ｓ": "s", "ｔ": "t",
  "ｕ": "u", "ｖ": "v", "ｗ": "w", "ｘ": "x", "ｙ": "y", "ｚ": "z"
};


const defaultRules: SanitizerConfig = {
  email: {
    description: "Email: no spaces -> Lower/Trim",
    transformations: [{ pattern: "\\s+", replace: "" }],
    mask: ["toLower", "trim"]
  },
  phone: {
    description: "Phone: Digits only",
    transformations: [{ pattern: "\\D", replace: "" }],
    mask: []
  },
  price: {
    description: "Price: Digits/Dot/Comma/Minus -> toCurrency",
    transformations: [
      { pattern: "[^0-9.-]", replace: "" },
      { pattern: ",", replace: "." }
    ],
    mask: ["toCurrency"]
  },
  name: {
    description: "Name: All chars -> UcWords/Trim",
    transformations: [],
    mask: ["ucwords", "trim"]
  },
  date: {
    description: "Date: All chars -> toDate (YYYY-MM-DD)",
    transformations: [],
    mask: [{ func: "toDate", arg: "YYYY-MM-DD" }]
  },
  slug: {
    description: "Slug: All chars -> toSlug",
    transformations: [],
    mask: ["toSlug"]
  }
}

const defaultMatches: SanitizerMatch[] = [
  { pattern: "email*", use: "email" },
  { pattern: "*_price", use: "price" },
  { pattern: "name*", use: "name" },
  { pattern: "date*", use: "date" }
]

const NORMALIZE_REGEX = new RegExp(Object.keys(NORMALIZE_MAP).join("|"), "g");

export function normalizeVisualChars(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFKC") // Unicode normalization first
    .replace(NORMALIZE_REGEX, match => NORMALIZE_MAP[match] ?? match);
}

/* ----------------------------------------------
 * ⚙️ Sanitizer class
 * ---------------------------------------------- */

export class Sanitizer {
  private config: SanitizerConfig;
  private matches: SanitizerMatch[];

  constructor(config: SanitizerConfig = {}, matches: SanitizerMatch[] = []) {
    this.config = { ...defaultRules, ...config };
    this.matches = [...defaultMatches, ...matches];
  }

  /* ----------------------------------------------
   * 🧮 Apply a specific rule directly
   * ---------------------------------------------- */
  apply(ruleName: keyof SanitizerConfig, value: unknown, autoCast: boolean = false): unknown {
    const rule = this.config[ruleName];
    if (!rule) {
      //console.warn(`Rule "${String(ruleName)}" not found`);
      return autoCast ? smartTypeCast(value) : value;
    }

    let result: unknown = value;

    // 🔹 1. visual normalization always first
    result = normalizeVisualChars(String(result ?? ''));

    // 🔹 2. exclusions check
    const exclusions = rule.exclusions;

    if (Array.isArray(exclusions) && exclusions.length) {
      const lowerResult = String(result).toLowerCase();

      for (const item of exclusions) {
        const term = (item?.phrase ?? "").trim().toLowerCase();
        if (!term) continue;

        if (lowerResult.includes(term)) {
          result = "";
          break;
        }
      }
    }

    // 🔹 3. Apply RegExp transformations
    for (const { pattern, replace = "" } of rule.transformations || []) {
      try {
        result = String(result).replace(new RegExp(pattern, "g"), String(replace));
      } catch (e) {
        console.warn(`Invalid regex in rule ${String(ruleName)}: ${pattern}`);
      }
    }



    // 🔹 4. Apply converter masks
    for (const mask of rule.mask || []) {
      let func: keyof typeof converter;
      let arg: string | undefined;

      if (typeof mask === "object" && mask !== null && "func" in mask) {
        func = mask.func;
        arg = mask.arg;
      } else {
        func = mask as keyof typeof converter;
      }

      const fn = converter[func];
      if (typeof fn === "function") {
        try {
          result = fn(result, arg);
        } catch (e) {
          console.warn(`Error applying mask ${func} for rule ${ruleName}:`, e);
        }
      }
    }

    // 🔹 5. smart type cast opzionale
    return autoCast ? smartTypeCast(result) : result;
  }

  /* ----------------------------------------------
   * 🌐 Apply matches to an entire object
   * ---------------------------------------------- */
  applyMatches<T extends Record<string, unknown>>(obj: T, autoCast: boolean = false): T {
    const output: Record<string, unknown> = { ...obj };

    for (const [field, value] of Object.entries(obj)) {
      for (const match of this.matches) {
        const regex = this.wildcardToRegExp(match.pattern);
        if (regex.test(field)) {
          output[field] = this.apply(match.use, value, autoCast);
          break; // stop after first match
        }
      }
    }

    return output as T;
  }

  getOptions(): Record<string, string>[] {
    return Object.keys(this.config).sort().map((key) => ({ label: this.config[key].description ?? converter.toCamel(key), value: key }));
  }


  /* ----------------------------------------------
   * 🧰 Helpers
   * ---------------------------------------------- */

  addRule(name: keyof SanitizerConfig, rule: SanitizerRule): void {
    this.config[name] = rule;
  }

  addMatch(pattern: string, use: keyof SanitizerConfig): void {
    this.matches.push({ pattern, use });
  }

  private wildcardToRegExp(pattern: string): RegExp {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`^${escaped.replace(/\*/g, ".*")}$`, "i");
  }
}
