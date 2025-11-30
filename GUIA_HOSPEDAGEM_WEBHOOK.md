# Guia de Hospedagem do Servidor Webhook

Este guia explica como hospedar o servidor webhook em serviços gratuitos para que funcione 24/7 sem precisar manter seu computador ligado.

## 📋 Opções de Hospedagem Gratuita

### 1. **Vercel** (Recomendado - Mais Fácil) ⭐
- ✅ Grátis
- ✅ Deploy automático via GitHub
- ✅ HTTPS automático
- ✅ Sem necessidade de configuração complexa
- ✅ Suporta Node.js
- ⚠️ Limite: 100GB de bandwidth/mês

### 2. **Railway**
- ✅ Grátis (com créditos mensais)
- ✅ Deploy via GitHub
- ✅ HTTPS automático
- ✅ Fácil configuração
- ⚠️ Limite: $5 de crédito grátis/mês

### 3. **Render**
- ✅ Grátis (com limitações)
- ✅ Deploy via GitHub
- ✅ HTTPS automático
- ⚠️ Limite: Serviços gratuitos "dormem" após 15min de inatividade

### 4. **Fly.io**
- ✅ Grátis (com limitações)
- ✅ Deploy via GitHub
- ✅ HTTPS automático
- ⚠️ Limite: 3 VMs grátis

---

## 🚀 Opção 1: Vercel (Recomendado)

### Passo 1: Preparar o Projeto

1. **Criar arquivo `vercel.json` na raiz do projeto:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. **Atualizar `server.js` para funcionar no Vercel:**
   - O Vercel já fornece a porta via `process.env.PORT`
   - Não precisa mudar nada, já está correto!

### Passo 2: Fazer Deploy

1. **Criar conta no Vercel:**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Conectar repositório:**
   - Clique em "New Project"
   - Selecione seu repositório do GitHub
   - Configure:
     - **Framework Preset:** Other
     - **Root Directory:** ./
     - **Build Command:** (deixe vazio)
     - **Output Directory:** (deixe vazio)

3. **Configurar Variáveis de Ambiente:**
   - Na página do projeto, vá em "Settings" > "Environment Variables"
   - Adicione:
     - `MERCADO_PAGO_ACCESS_TOKEN` = seu access token
     - `FIREBASE_PROJECT_ID` = a3-renascer
     - Outras variáveis se necessário

4. **Fazer Deploy:**
   - Clique em "Deploy"
   - Aguarde alguns minutos
   - Copie a URL gerada (ex: `https://seu-projeto.vercel.app`)

### Passo 3: Configurar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Webhooks"
3. Configure a URL: `https://seu-projeto.vercel.app/webhook/mercadopago`
4. Teste a URL

---

## 🚂 Opção 2: Railway

### Passo 1: Preparar o Projeto

1. **Criar arquivo `Procfile` na raiz:**
```
web: node server.js
```

2. **Criar arquivo `railway.json` (opcional):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Passo 2: Fazer Deploy

1. **Criar conta no Railway:**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório

3. **Configurar variáveis:**
   - Vá em "Variables"
   - Adicione as variáveis de ambiente necessárias

4. **Obter URL:**
   - Railway gera uma URL automaticamente
   - Copie a URL (ex: `https://seu-projeto.up.railway.app`)

---

## 🎨 Opção 3: Render

### Passo 1: Preparar o Projeto

1. **Criar arquivo `render.yaml` (opcional):**
```yaml
services:
  - type: web
    name: webhook-mercadopago
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
```

### Passo 2: Fazer Deploy

1. **Criar conta no Render:**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar novo Web Service:**
   - Clique em "New" > "Web Service"
   - Conecte seu repositório
   - Configure:
     - **Name:** webhook-mercadopago
     - **Environment:** Node
     - **Build Command:** npm install
     - **Start Command:** node server.js

3. **Configurar variáveis:**
   - Vá em "Environment"
   - Adicione as variáveis necessárias

4. **Obter URL:**
   - Render gera uma URL automaticamente
   - Copie a URL (ex: `https://webhook-mercadopago.onrender.com`)

---

## 🔐 Configuração de Variáveis de Ambiente

Independente da plataforma escolhida, você precisa configurar estas variáveis:

### Variáveis Obrigatórias:

1. **MERCADO_PAGO_ACCESS_TOKEN**
   - Seu Access Token do Mercado Pago
   - Obtenha em: https://www.mercadopago.com.br/developers/panel

2. **FIREBASE_PROJECT_ID**
   - Valor: `a3-renascer`

### Variáveis do Firebase Admin (se usar Service Account):

Se você quiser usar Service Account do Firebase, você precisa:

1. **Opção A: Usar variáveis de ambiente**
   - `FIREBASE_PRIVATE_KEY` = chave privada (com `\n` preservados)
   - `FIREBASE_CLIENT_EMAIL` = email do service account

2. **Opção B: Usar arquivo de credenciais**
   - ⚠️ **NÃO RECOMENDADO** para produção (não commite o arquivo!)
   - Se usar, adicione ao `.gitignore`

---

## 📝 Atualizar server.js para Produção

O `server.js` atual já está quase pronto, mas vamos fazer algumas melhorias:

1. **Usar variáveis de ambiente para credenciais**
2. **Melhorar tratamento de erros**
3. **Adicionar logs estruturados**

---

## 🔄 Atualizar Webhook no Mercado Pago

Após fazer o deploy:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Webhooks"
3. Edite o webhook existente ou crie um novo
4. Configure a nova URL (ex: `https://seu-projeto.vercel.app/webhook/mercadopago`)
5. Teste a URL

---

## ✅ Checklist de Deploy

- [ ] Escolher plataforma de hospedagem
- [ ] Criar conta na plataforma
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy
- [ ] Testar endpoint `/health`
- [ ] Testar endpoint `/webhook/mercadopago` (GET)
- [ ] Atualizar URL do webhook no Mercado Pago
- [ ] Testar webhook com pagamento de teste
- [ ] Verificar logs para confirmar que está funcionando

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
- **Solução:** Certifique-se de que todas as dependências estão no `package.json`

### Erro: "Firebase Admin não inicializado"
- **Solução:** Verifique se as variáveis de ambiente do Firebase estão configuradas

### Webhook não está sendo chamado
- **Solução:** 
  1. Verifique se a URL está correta no painel do Mercado Pago
  2. Teste a URL manualmente no navegador
  3. Verifique os logs da plataforma de hospedagem

### Servidor "dorme" após inatividade (Render)
- **Solução:** 
  1. Use um serviço de "ping" para manter ativo (UptimeRobot, etc.)
  2. Ou migre para Vercel/Railway que não têm esse problema

---

## 📊 Monitoramento

### Vercel
- Logs disponíveis no dashboard
- Métricas de uso

### Railway
- Logs em tempo real
- Métricas de uso

### Render
- Logs disponíveis no dashboard
- Alertas configuráveis

---

## 💡 Dica Final

**Recomendação:** Use **Vercel** para começar:
- É o mais fácil de configurar
- Não tem limitações de "dormir"
- HTTPS automático
- Deploy automático via GitHub

---

**Próximo passo:** Escolha uma plataforma e siga os passos acima. Se precisar de ajuda com alguma etapa específica, me avise!

