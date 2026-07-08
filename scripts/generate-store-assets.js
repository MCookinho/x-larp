import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const outDir = join(import.meta.dirname, '..', 'browser-extension', 'screenshots');

function svgToPng(svg, name, w, h) {
  const svgPath = join(outDir, `${name}.svg`);
  const pngPath = join(outDir, `${name}.png`);
  writeFileSync(svgPath, svg);
  execSync(`rsvg-convert -w ${w} -h ${h} "${svgPath}" -o "${pngPath}"`, { stdio: 'pipe' });
  console.log(`  ${pngPath} (${w}x${h})`);
}

function popupSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
    <linearGradient id="popupBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1230"/>
      <stop offset="100%" stop-color="#120a1e"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="#000" flood-opacity=".5"/>
    </filter>
  </defs>
  <rect width="1280" height="800" fill="url(#bg)"/>
  <text x="640" y="60" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="#b388ff">🎭 Larp Social — Popup da Extensão</text>
  <g transform="translate(440, 100)">
    <rect width="400" height="580" rx="16" fill="url(#popupBg)" stroke="#b388ff" stroke-width="3" filter="url(#shadow)"/>
    <rect width="400" height="80" rx="16" fill="#2a1a40"/>
    <text x="80" y="35" font-family="sans-serif" font-size="28" fill="#fff">🎭</text>
    <text x="120" y="30" font-family="sans-serif" font-size="20" font-weight="700" fill="#ede4ff">Larp Social</text>
    <text x="120" y="55" font-family="sans-serif" font-size="13" fill="#b098d0">Extensão oficial do X LARP</text>
    <rect x="20" y="110" width="360" height="60" rx="12" fill="#0d2818" stroke="#2ED573" stroke-width="2"/>
    <text x="50" y="136" font-family="sans-serif" font-size="22" fill="#2ED573">✅</text>
    <text x="90" y="136" font-family="sans-serif" font-size="16" font-weight="700" fill="#2ED573">Cookies encontrados!</text>
    <text x="90" y="156" font-family="sans-serif" font-size="12" fill="#7dcea0">auth_token e ct0 disponíveis</text>
    <rect x="20" y="200" width="360" height="48" rx="10" fill="#b388ff" opacity=".15"/>
    <text x="80" y="230" font-family="sans-serif" font-size="15" fill="#b388ff">🔄 Verificar novamente</text>
    <rect x="20" y="260" width="360" height="48" rx="10" fill="#1e1230" stroke="#b388ff" stroke-width="1.5"/>
    <text x="80" y="290" font-family="sans-serif" font-size="15" fill="#b388ff">🚀 Abrir X LARP</text>
    <text x="360" y="290" font-family="sans-serif" font-size="12" fill="#6a5080">↗</text>
    <line x1="20" y1="330" x2="380" y2="330" stroke="#2a1a40" stroke-width="2"/>
    <text x="40" y="360" font-family="sans-serif" font-size="13" font-weight="700" fill="#b098d0">📋 O que essa extensão faz?</text>
    <text x="40" y="390" font-family="sans-serif" font-size="11" fill="#6a5080">A Larp Social lê os cookies auth_token e ct0</text>
    <text x="40" y="410" font-family="sans-serif" font-size="11" fill="#6a5080">da sua sessão do X.com e envia automagicamente</text>
    <text x="40" y="430" font-family="sans-serif" font-size="11" fill="#6a5080">pro X LARP. Isso permite buscar todos os tweets</text>
    <text x="40" y="450" font-family="sans-serif" font-size="11" fill="#6a5080">de qualquer conta com paginação completa.</text>
    <text x="40" y="480" font-family="sans-serif" font-size="11" fill="#4a3560">🔒 Os cookies ficam só no seu navegador</text>
    <text x="40" y="500" font-family="sans-serif" font-size="11" fill="#4a3560">(localStorage) — nunca são enviados pra servidor.</text>
    <text x="200" y="560" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#4a3560">Feito com 💜 por MCookinho</text>
  </g>
</svg>`;
}

function toastSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800">
  <defs>
    <linearGradient id="pageBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#120a1e"/>
      <stop offset="100%" stop-color="#1e1230"/>
    </linearGradient>
    <linearGradient id="toastBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1230"/>
      <stop offset="100%" stop-color="#2a1a40"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="6" dy="6" stdDeviation="0" flood-color="#000" flood-opacity=".5"/>
    </filter>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1280" height="800" fill="url(#pageBg)"/>
  <text x="50" y="60" font-family="sans-serif" font-size="28" font-weight="700" fill="#FFC048">🎭 X LARP</text>
  <text x="50" y="95" font-family="sans-serif" font-size="14" fill="#6a5080">Analytics Dashboard</text>
  <rect x="50" y="120" width="1180" height="140" rx="16" fill="#2a1a40" stroke="#b388ff" stroke-width="2"/>
  <text x="100" y="165" font-family="sans-serif" font-size="22" font-weight="700" fill="#ede4ff">🐦 @MCookinho</text>
  <text x="100" y="195" font-family="sans-serif" font-size="14" fill="#b098d0">🎭 Persona: O Coach Quântico</text>
  <text x="100" y="225" font-family="sans-serif" font-size="13" fill="#6a5080">📊 5.230 tweets analisados · 🗓️ 3 anos de atividade</text>
  <rect x="50" y="280" width="270" height="160" rx="12" fill="#1a1030" stroke="#FFC048" stroke-width="1.5"/>
  <text x="130" y="320" font-family="sans-serif" font-size="30" fill="#FFC048" filter="url(#glow)">🔥</text>
  <text x="60" y="350" font-family="sans-serif" font-size="22" font-weight="700" fill="#FFC048">42</text>
  <text x="60" y="375" font-family="sans-serif" font-size="13" fill="#b098d0">Clones detectados</text>
  <text x="60" y="400" font-family="sans-serif" font-size="11" fill="#6a5080">pessoas te copiando</text>
  <rect x="350" y="280" width="270" height="160" rx="12" fill="#1a1030" stroke="#b388ff" stroke-width="1.5"/>
  <text x="430" y="320" font-family="sans-serif" font-size="30" fill="#b388ff" filter="url(#glow)">💀</text>
  <text x="60" y="350" font-family="sans-serif" font-size="22" font-weight="700" fill="#b388ff">#1</text>
  <text x="60" y="375" font-family="sans-serif" font-size="13" fill="#b098d0">Shame Ranking</text>
  <text x="60" y="400" font-family="sans-serif" font-size="11" fill="#6a5080">maior taxa de engajamento</text>
  <rect x="650" y="280" width="270" height="160" rx="12" fill="#1a1030" stroke="#4d9eff" stroke-width="1.5"/>
  <text x="730" y="320" font-family="sans-serif" font-size="30" fill="#4d9eff" filter="url(#glow)">☁️</text>
  <text x="60" y="350" font-family="sans-serif" font-size="13" fill="#b098d0">Nuvem de palavras</text>
  <text x="60" y="400" font-family="sans-serif" font-size="11" fill="#6a5080">"mercado" "bitcoin" "deus"</text>
  <text x="680" y="500" font-family="sans-serif" font-size="14" fill="#6a5080">📈 Atividade · 💬 Interações · 👥 Best Friends</text>
  <g transform="translate(760, 520)">
    <rect width="400" height="160" rx="16" fill="url(#toastBg)" stroke="#b388ff" stroke-width="3" filter="url(#shadow)"/>
    <text x="15" y="25" font-family="sans-serif" font-size="22" fill="#fff">🎭</text>
    <text x="50" y="25" font-family="sans-serif" font-size="16" font-weight="700" fill="#b388ff">Larp Social</text>
    <text x="15" y="55" font-family="sans-serif" font-size="14" fill="#ede4ff">🍪 Cookies do X importados!</text>
    <text x="15" y="80" font-family="sans-serif" font-size="12" fill="#b098d0">auth_token e ct0 salvos no X LARP</text>
    <rect x="15" y="105" width="370" height="35" rx="8" fill="#0d2818" stroke="#2ED573" stroke-width="1.5"/>
    <text x="25" y="128" font-family="sans-serif" font-size="12" fill="#2ED573">✅ auth_token</text>
    <text x="25" y="128" font-family="sans-serif" font-size="12" fill="#2ED573" text-anchor="end" dx="365">🟢 conectado</text>
  </g>
  <text x="50" y="750" font-family="sans-serif" font-size="13" fill="#4a3560">← Toast de notificação da extensão injetando cookies automaticamente no dashboard</text>
</svg>`;
}

function promoSvgSmall() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1230"/>
      <stop offset="100%" stop-color="#0a0614"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b388ff"/>
      <stop offset="100%" stop-color="#FFC048"/>
    </linearGradient>
  </defs>
  <rect width="440" height="280" fill="url(#bg)"/>
  <rect width="440" height="280" fill="url(#bg)" opacity=".3"/>
  <text x="220" y="80" text-anchor="middle" font-family="sans-serif" font-size="64" fill="#fff">🎭</text>
  <text x="220" y="145" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="900" fill="url(#accent)">LARP SOCIAL</text>
  <text x="220" y="180" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#b098d0">🍪 Um clique. Cookies do X pro dashboard.</text>
  <rect x="140" y="210" width="160" height="36" rx="10" fill="#b388ff"/>
  <text x="220" y="234" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#120a1e">ADICIONAR EXTENSÃO</text>
</svg>`;
}

function promoSvgLarge() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="560">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1230"/>
      <stop offset="100%" stop-color="#0a0614"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b388ff"/>
      <stop offset="100%" stop-color="#FFC048"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="560" fill="url(#bg)"/>
  <text x="200" y="240" text-anchor="middle" font-family="sans-serif" font-size="96" fill="#fff">🎭</text>
  <text x="480" y="220" font-family="sans-serif" font-size="56" font-weight="900" fill="url(#accent)">LARP SOCIAL</text>
  <text x="480" y="270" font-family="sans-serif" font-size="22" fill="#b098d0">🍪 Um clique. Seus cookies do X.com automaticamente</text>
  <text x="480" y="305" font-family="sans-serif" font-size="22" fill="#b098d0">no dashboard do X LARP. Sem copiar e colar.</text>
  <rect x="480" y="340" width="220" height="50" rx="12" fill="#b388ff"/>
  <text x="590" y="373" text-anchor="middle" font-family="sans-serif" font-size="17" font-weight="700" fill="#120a1e">ADICIONAR EXTENSÃO</text>
  <g transform="translate(850, 100)">
    <rect width="420" height="380" rx="20" fill="#1a1030" stroke="#b388ff" stroke-width="2"/>
    <text x="210" y="60" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#ede4ff">🎭 Como funciona</text>
    <text x="0" y="0" font-family="sans-serif" font-size="0" fill="#fff">spacer</text>
    <circle cx="50" cy="130" r="24" fill="#2ED573"/>
    <text x="50" y="136" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#0d2818">1</text>
    <text x="90" y="136" font-family="sans-serif" font-size="16" font-weight="700" fill="#ede4ff">Instale a extensão</text>
    <text x="90" y="158" font-family="sans-serif" font-size="12" fill="#6a5080">Um clique, funciona em qualquer Chromium</text>
    <circle cx="50" cy="210" r="24" fill="#b388ff"/>
    <text x="50" y="216" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#120a1e">2</text>
    <text x="90" y="216" font-family="sans-serif" font-size="16" font-weight="700" fill="#ede4ff">Navegue no X.com</text>
    <text x="90" y="238" font-family="sans-serif" font-size="12" fill="#6a5080">A extensão lê auth_token + ct0</text>
    <circle cx="50" cy="290" r="24" fill="#FFC048"/>
    <text x="50" y="296" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#120a1e">3</text>
    <text x="90" y="296" font-family="sans-serif" font-size="16" font-weight="700" fill="#ede4ff">Abra o X LARP</text>
    <text x="90" y="318" font-family="sans-serif" font-size="12" fill="#6a5080">Cookies injetados automaticamente 🎉</text>
  </g>
</svg>`;
}

console.log('Gerando screenshots e promo tiles...');
svgToPng(popupSvg(), 'screenshot-popup', 1280, 800);
svgToPng(toastSvg(), 'screenshot-toast', 1280, 800);
svgToPng(promoSvgSmall(), 'promo-small', 440, 280);
svgToPng(promoSvgLarge(), 'promo-large', 1400, 560);
console.log('✅ Assets gerados em browser-extension/screenshots/');
