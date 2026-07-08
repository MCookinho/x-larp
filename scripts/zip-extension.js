import { readdirSync, statSync, existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const root = resolve(import.meta.dirname, '..');
const tmpDir = join(root, 'dist/.ext-tmp');
const src = join(root, 'browser-extension');

if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const ignoreFilter = (f) => !f.endsWith('.svg') && !f.includes('screenshots');
cpSync(src, tmpDir, { recursive: true, filter: ignoreFilter });

const files = [];
function collect(dir, base = '') {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      collect(path, join(base, name));
    } else {
      files.push({ path: resolve(dir, name), arc: join(base, name) });
    }
  }
}
collect(tmpDir);

const writes = files.map(f =>
  `    z.write(${JSON.stringify(f.path)}, ${JSON.stringify(f.arc)})`
).join('\n');

const script = `import zipfile, os
with zipfile.ZipFile(${JSON.stringify(join(root, 'dist/larp-social.zip'))}, 'w', zipfile.ZIP_DEFLATED) as z:
${writes}
`;

execSync('python3', { input: script, cwd: root });
cpSync(join(root, 'dist/larp-social.zip'), join(root, 'dist/larp-social.xpi'));
rmSync(tmpDir, { recursive: true });
console.log('✅ Extensão zipada: dist/larp-social.zip + .xpi');
