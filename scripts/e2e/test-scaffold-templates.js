// End-to-end check of `llmnative create` as consumers get it from npm (CR-089):
// pack the framework, scaffold every template from the packed CLI, install the tarball,
// then type-check and build the generated app without touching it.
// Packs the current dist: run `npm run build` first.
//
//   npm run test:e2e:scaffold                 # every case
//   npm run test:e2e:scaffold -- crm firebase # only cases whose name contains all filters
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, execSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../..');
const filters = process.argv.slice(2);

const CASES = [
    { template: 'blank', provider: 'mock' },
    { template: 'admin', provider: 'mock' },
    { template: 'crm', provider: 'mock' },
    { template: 'inventory', provider: 'mock' },
    { template: 'project', provider: 'mock' },
    { template: 'blank', provider: 'firebase' },
    { template: 'blank', provider: 'supabase' },
].filter(({ template, provider }) => filters.every((f) => `${template}-${provider}`.includes(f)));

const EXPECTED_DRIVERS = {
    mock: { data: 'mock', auth: 'googleAuth' },
    firebase: { data: 'firestoreDb', auth: 'firebaseAuth' },
    supabase: { data: 'supabaseDb', auth: 'supabaseAuth' },
};

function run(command, cwd) {
    execSync(command, { cwd, stdio: 'pipe', env: { ...process.env, CI: '1' } });
}

function packFramework(workdir) {
    const output = execSync(`npm pack --json --pack-destination "${workdir}"`, { cwd: repoRoot, encoding: 'utf8' });
    const tarball = path.join(workdir, JSON.parse(output)[0].filename);
    const extracted = path.join(workdir, 'pkg');
    fs.mkdirSync(extracted);
    // Relative paths: GNU tar reads "C:\..." as a remote host.
    execFileSync('tar', ['-xzf', path.relative(extracted, tarball)], { cwd: extracted });
    return { tarball, cliPath: path.join(extracted, 'package/bin/cli.js') };
}

function assertGeneratedSources(projectRoot, { template, provider }) {
    const read = (file) => fs.readFileSync(path.join(projectRoot, file), 'utf8');
    const appConfig = read('src/conf/app.ts');
    const indexFile = read('src/index.tsx');

    assert.ok(fs.existsSync(path.join(projectRoot, 'src/conf/menu.ts')), `${template}: conf/menu.ts missing`);
    assert.ok(fs.existsSync(path.join(projectRoot, 'src/layouts/Default.tsx')), `${template}: layouts/Default.tsx missing`);
    assert.doesNotMatch(indexFile, /aiConfig=/);
    assert.match(indexFile, /LayoutDefault=\{Default\}/);
    assert.match(appConfig, new RegExp(`'${EXPECTED_DRIVERS[provider].data}'`));
    assert.match(appConfig, new RegExp(`'${EXPECTED_DRIVERS[provider].auth}'`));

    // Consumer UI directive: generated code uses only public framework components and current APIs.
    const forbidden = /<button|SignInButton|\bcontext=|inputType=|recordId=/;
    const offenders = listFiles(path.join(projectRoot, 'src'))
        .flatMap((file) => fs.readFileSync(file, 'utf8').split(/\r?\n/)
            .map((line, i) => (forbidden.test(line) ? `${path.relative(projectRoot, file)}:${i + 1}: ${line.trim()}` : null))
            .filter(Boolean));
    assert.deepEqual(offenders, [], `${template}: hand-rolled controls or removed APIs in generated sources`);
}

function listFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? listFiles(full) : [full];
    });
}

function scaffoldCase(workdir, pack, testCase) {
    const name = `${testCase.template}-${testCase.provider}`;
    const projectRoot = path.join(workdir, name);
    fs.mkdirSync(projectRoot);

    execFileSync(process.execPath, [
        pack.cliPath,
        'create',
        '--yes',
        `--name=scaffold-${name}`,
        `--template=${testCase.template}`,
        `--provider=${testCase.provider}`,
    ], { cwd: projectRoot, stdio: 'pipe' });

    assertGeneratedSources(projectRoot, testCase);

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.dependencies['@llmnative/react'] = `file:${pack.tarball}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    run('npm install --no-audit --no-fund', projectRoot);
    run('npx tsc --noEmit', projectRoot);
    run('npx vite build', projectRoot);
    return name;
}

function main() {
    assert.ok(CASES.length > 0, `No case matches: ${filters.join(' ')}`);
    const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'llmnative-scaffold-'));
    const pack = packFramework(workdir);
    const failures = [];

    for (const testCase of CASES) {
        const name = `${testCase.template}-${testCase.provider}`;
        try {
            scaffoldCase(workdir, pack, testCase);
            console.log(`ok   ${name}`);
        } catch (error) {
            const detail = [error.message, error.stdout?.toString(), error.stderr?.toString()].filter(Boolean).join('\n');
            failures.push(`${name}\n${detail}`);
            console.log(`FAIL ${name}`);
        }
    }

    if (failures.length) {
        console.error(`\n${failures.join('\n\n')}\n\nWork directory kept for inspection: ${workdir}`);
        process.exit(1);
    }
    fs.rmSync(workdir, { recursive: true, force: true });
    console.log(`\nAll ${CASES.length} scaffold cases type-check and build.`);
}

main();
