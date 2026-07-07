# 🐦 X LARP

> A única verdade sobre o Twitter/X é que todo mundo tá larpando. Nós só estamos aqui pra mostrar que é verdade!!

## 🚀 Deploy

### GitHub Pages (dados fictícios)

O site já está em https://mcookinho.github.io/x-larp/ com dados mockados.

### Vercel (com API real)

Pra usar dados reais da API do X:

```bash
npm i -g vercel
vercel
```

Configure as variáveis de ambiente no Vercel (opcional) ou use o frontend pra configurar.

## 🔧 Como configurar a API real

1. Crie uma conta em https://developer.twitter.com (gratuito)
2. Crie um Project + App
3. Vá em "Keys and tokens" e gere um **Bearer Token** (v2)
4. Clique no ⚙️ no site → cole a URL do proxy + Bearer Token

## 📡 Proxy API (Vercel)

O proxy Vercel em `api/twitter.ts` faz a ponte entre o frontend e a API do X,
resolvendo o problema de CORS. O Bearer Token nunca fica armazenado no servidor —
só é repassado pra API do X.

## 🎭 Funcionalidades

- 📊 Gráficos de interação por contexto (resenha, flerte, tristeza...)
- 👥 Melhores amigos (quem você mais perturba)
- 🤔 Classificação de persona + Cringe Meter
- 🔤 Nuvem de palavras mais usadas
- ⏰ Relógio comportamental (horário que mais tuíta)
- 👥 Seus clones (personalidades dos tweets)
- 🏆 Ranking da vergonha
- 🔍 Filtros de tweets (mais curtidos, reposts, views...)
- 🤫 Tradutor de tweet (o que você realmente quis dizer)
- 📋 Copypasta detector
- 🕵️ Rastreador de seguidores

## 🛠️ Stack

- React 19 + TypeScript + Vite
- Recharts (gráficos)
- Vercel Serverless Functions (proxy API)
- Tema: Dark Cartoon (Bangers + Fredoka + Comic Neue)

## 📄 Licença

MIT — faça o que quiser, só não leve a sério.
