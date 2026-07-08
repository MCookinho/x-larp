# Submissão do Larp Social para as Lojas

## 📦 Arquivos Prontos

Após `npm run build`:

| Arquivo | Loja | Localização |
|---|---|---|
| `dist/larp-social.zip` | Edge Add-ons (Chrome) | `dist/larp-social.zip` |
| `dist/larp-social.xpi` | Mozilla Add-ons (Firefox) | `dist/larp-social.xpi` |
| Screenshots (1280x800) | Ambas | `browser-extension/screenshots/screenshot-popup.png` |
| Screenshots (1280x800) | Ambas | `browser-extension/screenshots/screenshot-toast.png` |
| Promo tile (440x280) | Edge | `browser-extension/screenshots/promo-small.png` |
| Promo tile (1400x560) | Edge | `browser-extension/screenshots/promo-large.png` |

---

## 🦊 Mozilla Add-ons (AMO)

**URL:** https://addons.mozilla.org/developers/

### 1. Criar conta

1. Acesse https://addons.mozilla.org/developers/
2. Faça login com uma conta Firefox (ou crie uma)
3. Clique em **"Submit Your First Add-on"**

### 2. Submeter extensão

1. Escolha **"On this version"** (não "On a future version")
2. Selecione o arquivo **`dist/larp-social.xpi`**
3. Clique em **Continue**

### 3. Informações da lista

| Campo | Valor |
|---|---|
| **Add-on name** | Larp Social |
| **Summary** (máx 250 chars) | Extrai cookies de sessão do X.com e injeta automaticamente no X LARP. Um clique e pronto! |
| **Description** | 🎭 **O que é?**<br><br>Larp Social é a extensão oficial do X LARP, o dashboard de analytics humorístico do X/Twitter. Ela lê os cookies `auth_token` e `ct0` da sua sessão do X.com e envia automaticamente pro dashboard.<br><br>🔑 **Por que preciso disso?**<br><br>O X LARP precisa desses cookies para autenticar as requisições à API do X/Twitter. Com eles, você consegue buscar **todos os tweets** de qualquer conta (não só as gigantes), com paginação completa de até 5.000 tweets.<br><br>🎯 **Como usar:**<br><br>1. Instale a extensão<br>2. Faça login no X.com (se já estiver logado, só navegar)<br>3. Abra o X LARP (https://mcookinho.github.io/x-larp/)<br>4. Pronto! Os cookies são injetados automaticamente 🎉<br><br>🔒 **Privacidade:**<br><br>Os cookies NUNCA saem do seu navegador. A extensão lê os cookies do X.com e salva no localStorage do X LARP. Apenas o dashboard (via proxy Vercel) usa os cookies pra fazer requisições à API do X/Twitter. Nenhum servidor terceiro recebe seus dados. |
| **Categories** | ✅ **Feeds, News & Blogging**<br>✅ **Web Development** |
| **Tags** | `x` `twitter` `cookies` `analytics` `dashboard` `larp` `auth` |
| **Homepage URL** | https://mcookinho.github.io/x-larp/ |
| **Support email** | _(seu email)_ |
| **Privacy policy** | https://mcookinho.github.io/x-larp/privacy ou texto inline |

### 4. Screenshots

Envie **pelo menos 1 screenshot** (máx 6):

1. **`screenshot-popup.png`** (1280x800) — Popup da extensão exibindo "Cookies encontrados!"
2. **`screenshot-toast.png`** (1280x800) — Toast de notificação no dashboard

### 5. Revisão

- A Mozilla faz revisão automática na maioria dos casos
- Se for revisão manual, leva de algumas horas a alguns dias
- Firefox exige que o código seja open source ou revisado — como é open source (MIT), é tranquilo

---

## 🌐 Microsoft Edge Add-ons

**URL:** https://partner.microsoft.com/dashboard/microsoftedge/

### 1. Criar conta

1. Acesse https://partner.microsoft.com/dashboard/microsoftedge/
2. Faça login com uma conta Microsoft
3. Complete o cadastro do Partner Center (pode precisar de dados fiscais)

### 2. Criar novo add-on

1. Clique em **"Create new"** → **"Extension"**
2. Envie o arquivo **`dist/larp-social.zip`**

### 3. Informações da lista

| Campo | Valor |
|---|---|
| **Name** | Larp Social |
| **Short description** (máx 100 chars) | Extrai cookies do X.com e injeta no X LARP automaticamente. |
| **Description** | _(mesma descrição do Firefox, acima)_ |
| **Privacy policy URL** | https://mcookinho.github.io/x-larp/privacy |
| **Website URL** | https://mcookinho.github.io/x-larp/ |
| **Support contact info** | _(seu email)_ |
| **Categories** | **Social & Communication** |

### 4. Imagens

| Imagem | Arquivo | Tamanho |
|---|---|---|
| **Store logo** | `browser-extension/icons/icon128.png` | 128x128 |
| **Small promotional tile** | `promo-small.png` | 440x280 |
| **Large promotional tile** | `promo-large.png` | 1400x560 |
| **Screenshots (1-10)** | `screenshot-popup.png`, `screenshot-toast.png` | 1280x800 |

### 5. Revisão

- A Microsoft faz revisão automática
- Geralmente aprovado em algumas horas
- Precisa de uma conta Microsoft (gratuita, mas pode pedir dados fiscais mesmo pra extensão gratuita)

---

## 🔄 Atualizações

Quando atualizar a extensão:

1. Mude a **versão** no `manifest.json` (ex: `1.0.1`)
2. Rode `npm run build`
3. Suba o novo `.xpi` ou `.zip` na respectiva loja
4. Escreva release notes

---

## 📝 Checklist de Pré-Submissão

- [ ] `npm run build` roda sem erros
- [ ] `manifest.json` tem `version` atualizada
- [ ] `browser_specific_settings.gecko.id` presente (Firefox)
- [ ] `developer.name` e `developer.url` presentes
- [ ] Screenshots gerados em `browser-extension/screenshots/`
- [ ] Promo tiles gerados (Edge)
- [ ] Ícones 16x16, 48x48, 128x128 presentes
- [ ] Extensão testada localmente (npm run dev)
