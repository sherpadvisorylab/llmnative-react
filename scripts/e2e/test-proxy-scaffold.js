const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../..');
const cliPath = path.join(repoRoot, 'bin/cli.js');

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function exists(filePath) {
    return fs.existsSync(filePath);
}

function createTempProject(prefix) {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function runScaffold(workdir, proxyProvider) {
    execFileSync(process.execPath, [
        cliPath,
        'create',
        '--yes',
        '--name=proxy-e2e',
        '--provider=mock',
        `--proxy-provider=${proxyProvider}`,
    ], {
        cwd: workdir,
        stdio: 'pipe',
    });
}

function assertCommonFiles(projectRoot, proxyProvider) {
    const envFile = read(path.join(projectRoot, '.env'));
    const appConfig = read(path.join(projectRoot, 'src/conf/app.ts'));
    const indexFile = read(path.join(projectRoot, 'src/index.tsx'));

    assert.match(envFile, new RegExp(`VITE_PROXY_PROVIDER=${proxyProvider}`));
    assert.match(envFile, /VITE_PROXY_ENABLED=(true|false)/);
    assert.doesNotMatch(envFile, /VITE_PROXY_ROUTE/);

    assert.match(appConfig, /proxy:\s*\{/);
    assert.match(appConfig, /enabled:\s*env\.VITE_PROXY_ENABLED === 'true'/);
    assert.doesNotMatch(appConfig, /selectedProxyProvider/);

    assert.doesNotMatch(indexFile, /proxyURI/);
}

function testNoneProxy() {
    const projectRoot = createTempProject('llmnative-proxy-none-');
    runScaffold(projectRoot, 'none');

    assertCommonFiles(projectRoot, 'none');
    assert.equal(exists(path.join(projectRoot, 'dev/proxy.ts')), false);
    assert.equal(exists(path.join(projectRoot, 'server/proxy.ts')), false);

    const viteConfig = read(path.join(projectRoot, 'vite.config.ts'));
    assert.doesNotMatch(viteConfig, /createProxyPlugin/);
}

function testViteProxy() {
    const projectRoot = createTempProject('llmnative-proxy-vite-');
    runScaffold(projectRoot, 'viteDevProxy');

    assertCommonFiles(projectRoot, 'viteDevProxy');
    assert.equal(exists(path.join(projectRoot, 'dev/proxy.ts')), true);
    assert.equal(exists(path.join(projectRoot, 'server/proxy.ts')), false);

    const viteConfig = read(path.join(projectRoot, 'vite.config.ts'));
    const proxyFile = read(path.join(projectRoot, 'dev/proxy.ts'));
    const envFile = read(path.join(projectRoot, '.env'));

    assert.match(envFile, /VITE_PROXY_ENABLED=true/);
    assert.match(viteConfig, /loadEnv/);
    assert.match(viteConfig, /createProxyPlugin/);
    assert.match(viteConfig, /env\.VITE_PROXY_PROVIDER === 'viteDevProxy'/);
    assert.match(proxyFile, /PROXY_PATH = '\/api\/proxy'/);
}

function testExpressProxy() {
    const projectRoot = createTempProject('llmnative-proxy-express-');
    runScaffold(projectRoot, 'expressProxy');

    assertCommonFiles(projectRoot, 'expressProxy');
    assert.equal(exists(path.join(projectRoot, 'dev/proxy.ts')), false);
    assert.equal(exists(path.join(projectRoot, 'server/proxy.ts')), true);

    const viteConfig = read(path.join(projectRoot, 'vite.config.ts'));
    const proxyFile = read(path.join(projectRoot, 'server/proxy.ts'));
    const envFile = read(path.join(projectRoot, '.env'));

    assert.match(envFile, /VITE_PROXY_ENABLED=true/);
    assert.doesNotMatch(viteConfig, /createProxyPlugin/);
    assert.match(proxyFile, /registerProxy/);
    assert.match(proxyFile, /PROXY_PATH = '\/api\/proxy'/);
}

function main() {
    testNoneProxy();
    testViteProxy();
    testExpressProxy();
    console.log('Proxy scaffold end-to-end checks passed.');
}

main();
