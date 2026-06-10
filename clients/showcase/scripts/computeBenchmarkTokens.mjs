/**
 * Recomputes token counts for BenchmarkPage snippets.
 * Run after changing any code snippet in BenchmarkPage.tsx:
 *
 *   node clients/showcase/scripts/computeBenchmarkTokens.mjs
 *
 * Copy the output into the TOKEN_COUNTS constant in BenchmarkPage.tsx.
 * Requires gpt-tokenizer (already a showcase devDependency).
 */

import { readFileSync } from 'fs'
import { encode } from '../node_modules/gpt-tokenizer/esm/main.js'

const tok = s => encode(s.trim()).length

const src = readFileSync(
    new URL('../src/pages/BenchmarkPage.tsx', import.meta.url),
    'utf8'
)

const re = /const ([A-Z_]+) = `([\s\S]+?)`;/g
const results = []
let m

while ((m = re.exec(src)) !== null) {
    results.push({ name: m[1], tokens: tok(m[2]) })
}

console.log('\nToken counts (gpt-tokenizer cl100k_base):\n')
console.log('const TOKEN_COUNTS: Record<string, number> = {')
for (const { name, tokens } of results) {
    console.log(`    ${name}: ${tokens},`)
}
console.log('}')

const framework = results.filter(r => r.name.endsWith('_FRAMEWORK'))
const vanilla   = results.filter(r => r.name.endsWith('_VANILLA'))
const totalFw   = framework.reduce((n, r) => n + r.tokens, 0)
const totalVn   = vanilla.reduce((n, r) => n + r.tokens, 0)

console.log(`\nTotal framework: ${totalFw}`)
console.log(`Total vanilla:   ${totalVn}`)
console.log(`Savings:         ${Math.round((1 - totalFw / totalVn) * 100)}%`)
