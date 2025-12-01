# 🚀 Deploy Rápido no Render (ALTERNATIVA FÁCIL)

## ⚡ Por que Render?

- ✅ **Deploy automático** do GitHub
- ✅ **Variáveis de ambiente** fáceis
- ✅ **Gratuito** para começar
- ✅ **Funciona em 5 minutos**

---

## 📝 Passo a Passo (5 minutos)

### 1. Criar Conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started for Free"**
3. Faça login com **GitHub**

### 2. Criar Novo Web Service

1. Clique em **"New +"** > **"Web Service"**
2. Conecte seu repositório: `A3---PROJETO-RENASCER`
3. Configure:
   - **Name:** `a3-webhook-mercadopago`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`

4. Clique em **"Create Web Service"**

### 3. Configurar Variáveis de Ambiente

1. Vá em **"Environment"**
2. Adicione estas variáveis:

```
FIREBASE_PROJECT_ID=a3-renascer
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@a3-renascer.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470
```

### 4. Obter URL do Webhook

1. Após o deploy, copie a URL (exemplo: `https://a3-webhook-mercadopago.onrender.com`)
2. Sua URL do webhook será: `https://a3-webhook-mercadopago.onrender.com/webhook/mercadopago`

### 5. Configurar no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Vá em **Webhooks**
3. Cole a URL do webhook
4. Selecione **"Pagamentos"**
5. Salve

---

## ✅ Pronto!

---

## ⚠️ Nota sobre Render Free

O plano gratuito do Render "dorme" após 15 minutos de inatividade. Para produção, considere:
- Railway (melhor para este caso)
- Ou upgrade para plano pago no Render

