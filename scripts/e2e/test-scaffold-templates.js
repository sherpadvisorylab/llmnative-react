const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../..');
const cliPath = path.join(repoRoot, 'bin/cli.js');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const TEMPLATES = ['blank', 'admin', 'crm', 'inventory', 'project'];

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function exists(filePath) {
    return fs.existsSync(filePath);
}

function createTempProject(prefix) {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function ensureFrameworkBuilt() {
    const declaration = path.join(repoRoot, 'dist/types/src/index.d.ts');
    if (!exists(declaration)) {
        console.log('dist/types missing — running npm run build first…');
        execFileSync(npm, ['run', 'build'], { cwd: repoRoot, stdio: 'inherit' });
    }
}

function packFramework() {
    const output = execFileSync(npm, ['pack', '--json'], {
        cwd: repoRoot,
        stdio: ['ignore', 'pipe', 'inherit'],
    }).toString();
    const [entry] = JSON.parse(output);
    return {
        tarball: path.join(repoRoot, entry.filename),
        files: entry.files.map((file) => file.path),
    };
}

function runScaffold(workdir, args) {
    execFileSync(process.execPath, [cliPath, 'create', '--yes', ...args], {
        cwd: workdir,
        stdio: 'pipe',
    });
}

function installProject(projectRoot, tarball) {
    execFileSync(npm, ['install', tarball, '--no-audit', '--no-fund'], {
        cwd: projectRoot,
        stdio: ['ignore', 'pipe', 'inherit'],
    });
}

function typecheckAndBuild(projectRoot) {
    const tsc = path.join(projectRoot, 'node_modules/.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
    const vite = path.join(projectRoot, 'node_modules/.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
    execFileSync(tsc, ['--noEmit'], { cwd: projectRoot, stdio: 'inherit' });
    execFileSync(vite, ['build'], { cwd: projectRoot, stdio: 'inherit' });
}

function assertNoHandRolledUi(projectRoot) {
    const sectionsDir = path.join(projectRoot, 'src/sections');
    const files = fs.readdirSync(sectionsDir).map((name) => path.join(sectionsDir, name));
    for (const file of files) {
        const content = read(file);
        assert.doesNotMatch(content, /<button\b/, `${file} still contains a hand-rolled <button>`);
        assert.doesNotMatch(content, /animate-spin/, `${file} still contains a hand-rolled spinner`);
    }
}

function assertPackageContents(files) {
    const has = (prefix) => files.some((file) => file === prefix || file.startsWith(`${prefix}/`));
    assert.ok(has('templates'), 'tarball must include templates/');
    assert.ok(files.includes('templates/_shared/sections/Header.tsx'), 'tarball must include shared sections');
    assert.ok(files.includes('llms.txt'), 'tarball must include llms.txt');
    assert.ok(files.includes('llms-full.txt'), 'tarball must include llms-full.txt');
}

function assertCommonScaffold(projectRoot) {
    const appConfig = read(path.join(projectRoot, 'src/conf/app.ts'));
    const indexFile = read(path.join(projectRoot, 'src/index.tsx'));

    assert.doesNotMatch(indexFile, /aiConfig/, 'index.tsx must not reference aiConfig');
    assert.match(indexFile, /LayoutDefault=\{Default\}/, 'index.tsx must pass LayoutDefault={Default}');
    assert.match(appConfig, /ai:\s*\{/, 'AI config must live in providers.ai');
    assert.match(appConfig, /auth:\s*authDriver/, 'services.auth must use the provider-aware driver');
}

function testTemplate(template, tarball) {
    const projectRoot = createTempProject(`llmnative-scaffold-${template}-`);
    console.log(`\n[${template}] scaffolding in ${projectRoot}`);
    runScaffold(projectRoot, [`--name=${template}-app`, '--provider=mock', `--template=${template}`]);

    assertCommonScaffold(projectRoot);
    assertNoHandRolledUi(projectRoot);
    assert.ok(exists(path.join(projectRoot, 'src/layouts/Default.tsx')), 'shared layout must be copied');
    assert.ok(exists(path.join(projectRoot, 'src/sections/Header.tsx')), 'shared sections must be copied');

    installProject(projectRoot, tarball);
    typecheckAndBuild(projectRoot);
    console.log(`[${template}] tsc --noEmit + vite build passed`);
}

function testFirebaseProvider(tarball) {
    const projectRoot = createTempProject('llmnative-scaffold-firebase-');
    console.log(`\n[firebase] scaffolding in ${projectRoot}`);
    runScaffold(projectRoot, ['--name=firebase-app', '--provider=firebase', '--template=blank']);

    assertCommonScaffold(projectRoot);
    const appConfig = read(path.join(projectRoot, 'src/conf/app.ts'));
    assert.match(appConfig, /'firestoreDb'/);
    assert.match(appConfig, /'firebaseAuth'/);
    assert.doesNotMatch(appConfig, /'dbRealtime'/);

    const firebaseJson = JSON.parse(read(path.join(projectRoot, 'firebase.json')));
    assert.ok(firebaseJson.firestore, 'firebase.json must include a firestore section');
    assert.equal(firebaseJson.database, undefined, 'firebase.json must not include RTDB');
    assert.ok(exists(path.join(projectRoot, 'firestore.rules')), 'firestore.rules must be generated');
    assert.ok(exists(path.join(projectRoot, 'firestore.indexes.json')), 'firestore.indexes.json must be generated');
    assert.equal(exists(path.join(projectRoot, 'database.rules.json')), false, 'database.rules.json must not be generated');

    installProject(projectRoot, tarball);
    typecheckAndBuild(projectRoot);
    console.log('[firebase] tsc --noEmit + vite build passed');
}

function testSupabaseProvider(tarball) {
    const projectRoot = createTempProject('llmnative-scaffold-supabase-');
    console.log(`\n[supabase] scaffolding in ${projectRoot}`);
    runScaffold(projectRoot, ['--name=supabase-app', '--provider=supabase', '--template=blank']);

    assertCommonScaffold(projectRoot);
    const appConfig = read(path.join(projectRoot, 'src/conf/app.ts'));
    assert.match(appConfig, /'supabaseDb'/);
    assert.match(appConfig, /'supabaseAuth'/);

    installProject(projectRoot, tarball);
    typecheckAndBuild(projectRoot);
    console.log('[supabase] tsc --noEmit + vite build passed');
}

function testUnknownTemplate() {
    const projectRoot = createTempProject('llmnative-scaffold-unknown-');
    let failed = false;
    try {
        runScaffold(projectRoot, ['--name=unknown-app', '--provider=mock', '--template=does-not-exist']);
    } catch (error) {
        failed = true;
        const stderr = `${error.stderr ?? ''}${error.stdout ?? ''}`;
        assert.match(stderr, /Unknown template "does-not-exist"/, 'error must name the unknown template');
    }
    assert.ok(failed, 'scaffolding an unknown template must fail');
    assert.equal(exists(path.join(projectRoot, 'src')), false, 'no source files should be written for an unknown template');
    console.log('[unknown template] explicit error verified');
}

function testDocsHaveNoRemovedApi() {
    const targets = [path.join(repoRoot, 'llms-full.txt'), path.join(repoRoot, 'docs')];
    const offenders = [];
    const walk = (target) => {
        if (fs.statSync(target).isDirectory()) {
            for (const entry of fs.readdirSync(target)) walk(path.join(target, entry));
            return;
        }
        const content = read(target);
        if (/Input\.(Number|Email|Date)|inputType\s*=/.test(content)) offenders.push(path.relative(repoRoot, target));
    };
    targets.forEach(walk);
    assert.deepEqual(offenders, [], `removed Input API still documented in: ${offenders.join(', ')}`);
    console.log('[docs] no Input.Number/Email/Date or inputType left');
}

function main() {
    ensureFrameworkBuilt();
    const { tarball, files } = packFramework();
    assertPackageContents(files);

    for (const template of TEMPLATES) testTemplate(template, tarball);
    testFirebaseProvider(tarball);
    testSupabaseProvider(tarball);
    testUnknownTemplate();
    testDocsHaveNoRemovedApi();

    console.log('\nScaffold template end-to-end checks passed.');
}

main();
