import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync } from 'fs';

const extDir = 'dist/browser-extension';
const src = 'browser-extension';

if (!existsSync(extDir)) mkdirSync(extDir, { recursive: true });

cpSync(src, extDir, {
  recursive: true,
  filter: (f) => !f.endsWith('.svg'),
});

try {
  execSync('cd dist && zip -r larp-social.zip browser-extension', { stdio: 'inherit' });
  console.log('✅ Extensão zipada: dist/larp-social.zip');
} catch {
  try {
    execSync('cd dist && tar -czf larp-social.tar.gz browser-extension', { stdio: 'inherit' });
    console.log('✅ Extensão zipada: dist/larp-social.tar.gz');
  } catch {
    console.log('ℹ️ Extension files copied to dist/browser-extension/ (install without zip)');
  }
}
