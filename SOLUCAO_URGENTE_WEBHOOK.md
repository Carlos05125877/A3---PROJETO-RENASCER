# 🚨 SOLUÇÃO URGENTE - Deploy do Webhook em 5 Minutos

## 🎯 Opção Mais Rápida: Railway

### ⚡ Por que Railway?
- ✅ **MAIS FÁCIL** - Conecta GitHub e faz tudo sozinho
- ✅ **5 minutos** para configurar
- ✅ **Gratuito** para começar
- ✅ **Logs em tempo real**
- ✅ **URL permanente** (não muda)

---

## 📋 Passo a Passo Rápido

### 1. Criar Conta (1 minuto)
1. Acesse: **https://railway.app**
2. Clique em **"Login"** → **"GitHub"**
3. Autorize o Railway

### 2. Deploy Automático (2 minutos)
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha: `A3---PROJETO-RENASCER`
4. Branch: `main`
5. **PRONTO!** O Railway faz deploy automático

### 3. Configurar Variáveis (2 minutos)
1. No projeto Railway, clique em **"Variables"**
2. Adicione estas 4 variáveis:

**Variável 1:**
```
Nome: FIREBASE_PROJECT_ID
Valor: a3-renascer
```

**Variável 2:**
```
Nome: FIREBASE_CLIENT_EMAIL
Valor: (copie do serviceAccountKey.json, campo "client_email")
```

**Variável 3:**
```
Nome: FIREBASE_PRIVATE_KEY
Valor: (copie do serviceAccountKey.json, campo "private_key" COMPLETO, incluindo -----BEGIN e -----END)
```

**Variável 4:**
```
Nome: MERCADO_PAGO_ACCESS_TOKEN
Valor: APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470
```

### 4. Obter URL do Webhook (30 segundos)
1. No Railway, vá em **"Settings"** > **"Domains"**
2. Clique em **"Generate Domain"**
3. Copie a URL (exemplo: `https://a3-projeto-renascer-production.up.railway.app`)
4. Sua URL do webhook: `https://a3-projeto-renascer-production.up.railway.app/webhook/mercadopago`

### 5. Configurar no Mercado Pago (1 minuto)
1. Acesse: **https://www.mercadopago.com.br/developers/panel/app**
2. Vá em **"Webhooks"**
3. Cole a URL: `https://a3-projeto-renascer-production.up.railway.app/webhook/mercadopago`
4. Marque **"Pagamentos"**
5. Clique em **"Salvar"**

---

## ✅ PRONTO! Funcionando em 5 minutos!

---

## 🔍 Testar

1. Faça um pagamento de teste no seu site
2. Veja os logs no Railway: **"Deployments"** > Deploy mais recente > **"View Logs"**

---

## 🆘 Problemas?

### Deploy não inicia?
- Verifique se o repositório está público ou o Railway tem acesso
- Aguarde 1-2 minutos

### Variáveis não funcionam?
- Certifique-se de copiar a chave privada **COMPLETA** (com `-----BEGIN` e `-----END`)
- Não adicione aspas nas variáveis

### URL não funciona?
- Aguarde 2-3 minutos após o deploy
- Teste acessando: `https://sua-url.railway.app/` (deve mostrar JSON)

---

## 📝 Arquivos Necessários

O Railway usa automaticamente:
- ✅ `server.js` (já existe)
- ✅ `webhook-processor.js` (já existe)
- ✅ `package.json` (já existe)

**TUDO JÁ ESTÁ PRONTO!** Só precisa fazer o deploy.

---

## 🎯 Alternativa: Render (se Railway não funcionar)

Se Railway der problema, use **Render**:
1. Acesse: **https://render.com**
2. **"New +"** > **"Web Service"**
3. Conecte GitHub
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Configure as mesmas variáveis

---

## ✅ Resumo

1. ✅ Railway.app → Login GitHub
2. ✅ New Project → Deploy GitHub
3. ✅ Variables → Adicionar 4 variáveis
4. ✅ Copiar URL → Configurar no Mercado Pago
5. ✅ PRONTO!

**Tempo total: 5 minutos!**

