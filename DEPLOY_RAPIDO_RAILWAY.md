# 🚀 Deploy Rápido no Railway (MAIS FÁCIL)

## ⚡ Por que Railway?

- ✅ **Deploy automático** do GitHub
- ✅ **Variáveis de ambiente** fáceis de configurar
- ✅ **Logs em tempo real**
- ✅ **Gratuito** para começar
- ✅ **Funciona em 5 minutos**

---

## 📝 Passo a Passo (5 minutos)

### 1. Criar Conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Login"** ou **"Start a New Project"**
3. Faça login com **GitHub**

### 2. Criar Novo Projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório: `A3---PROJETO-RENASCER`
4. Selecione a branch: `main`

### 3. Configurar o Projeto

1. Railway detecta automaticamente que é Node.js
2. Se não detectar, clique em **"Settings"** > **"Generate"** > **"Node"**
3. O Railway vai fazer deploy automaticamente

### 4. Configurar Variáveis de Ambiente

1. Vá em **"Variables"** (ou **"Settings"** > **"Variables"**)
2. Adicione estas variáveis:

```
FIREBASE_PROJECT_ID
a3-renascer
```

```
FIREBASE_CLIENT_EMAIL
firebase-adminsdk-xxxxx@a3-renascer.iam.gserviceaccount.com
```
*(Copie do arquivo `serviceAccountKey.json`)*

```
FIREBASE_PRIVATE_KEY
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```
*(Copie a chave privada COMPLETA do `serviceAccountKey.json`, incluindo `\n`)*

```
MERCADO_PAGO_ACCESS_TOKEN
APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470
```

### 5. Obter URL do Webhook

1. Após o deploy, vá em **"Settings"** > **"Domains"**
2. Clique em **"Generate Domain"** (ou use o domínio já gerado)
3. Copie a URL (exemplo: `https://a3-projeto-renascer-production.up.railway.app`)
4. Sua URL do webhook será: `https://a3-projeto-renascer-production.up.railway.app/webhook/mercadopago`

### 6. Configurar no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Vá em **Webhooks**
3. Cole a URL: `https://a3-projeto-renascer-production.up.railway.app/webhook/mercadopago`
4. Selecione **"Pagamentos"**
5. Salve

---

## ✅ Pronto!

Agora o webhook está funcionando. Teste fazendo um pagamento de teste.

---

## 🔍 Ver Logs

1. No Railway, vá em **"Deployments"**
2. Clique no deploy mais recente
3. Veja os logs em tempo real

---

## 🆘 Problemas?

- **Deploy falhou?** Verifique se o `package.json` tem `"main": "server.js"` ou ajuste no Railway
- **Variáveis não funcionam?** Certifique-se de copiar a chave privada COMPLETA
- **URL não funciona?** Aguarde 1-2 minutos após o deploy

---

## 🎯 Vantagens do Railway

- ✅ Mais fácil que Vercel para este caso
- ✅ Logs melhores
- ✅ Deploy automático do GitHub
- ✅ Gratuito para começar

