# 🔗 URL do Webhook - Railway

## ✅ Domínio Railway

**Domínio:** `web-production-c0585.up.railway.app`

## 🔗 URL do Webhook

**URL completa do webhook:**
```
https://web-production-c0585.up.railway.app/webhook/mercadopago
```

---

## 📝 Configurar no Mercado Pago

### 1. Acessar Painel do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Faça login na sua conta

### 2. Configurar Webhook

1. Vá em **"Webhooks"** (no menu lateral)
2. Se já tiver um webhook configurado, clique em **"Editar"**
3. Se não tiver, clique em **"Criar webhook"**

### 3. Preencher Dados

**URL do webhook:**
```
https://web-production-c0585.up.railway.app/webhook/mercadopago
```

**Eventos:**
- ✅ Marque **"Pagamentos"** (obrigatório)
- Outros eventos são opcionais

**Modo:**
- Selecione **"Modo de teste"** para testar primeiro
- Depois mude para **"Modo de produção"**

### 4. Salvar

1. Clique em **"Salvar"** ou **"Criar webhook"**
2. Pronto!

---

## ✅ Testar o Webhook

### 1. Testar no Mercado Pago

1. No painel do Mercado Pago, vá em **"Webhooks"**
2. Clique em **"Testar notificação"** ou **"Simular notificação"**
3. Deve retornar **200 OK**

### 2. Verificar Logs no Railway

1. Acesse: https://railway.app
2. Vá no seu projeto
3. Clique em **"Deployments"**
4. Clique no deploy mais recente
5. Veja os logs em tempo real

**Logs esperados:**
```
🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===
✅ Notificação recebida
📋 ID do pagamento: ...
🔔 === PROCESSANDO WEBHOOK MERCADO PAGO ===
```

---

## 🔍 Verificar se Está Funcionando

### 1. Testar Endpoint Manualmente

Acesse no navegador:
```
https://web-production-c0585.up.railway.app/
```

**Deve retornar:**
```json
{
  "message": "Webhook Server do Mercado Pago",
  "status": "online",
  "endpoints": {
    "health": "/health",
    "webhook": "/webhook/mercadopago"
  }
}
```

### 2. Testar Health Check

Acesse:
```
https://web-production-c0585.up.railway.app/health
```

**Deve retornar:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

### 3. Testar Webhook (GET)

Acesse:
```
https://web-production-c0585.up.railway.app/webhook/mercadopago
```

**Deve retornar:**
```json
{
  "message": "Webhook endpoint está ativo e funcionando!",
  "timestamp": "...",
  "method": "GET"
}
```

---

## ⚠️ Importante

### Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas no Railway:

1. ✅ `FIREBASE_PROJECT_ID` = `a3-renascer`
2. ✅ `FIREBASE_CLIENT_EMAIL` = (do serviceAccountKey.json)
3. ✅ `FIREBASE_PRIVATE_KEY` = (do serviceAccountKey.json - COMPLETA)
4. ✅ `MERCADO_PAGO_ACCESS_TOKEN` = `APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470`

**Para verificar:**
1. No Railway, vá em **"Variables"**
2. Verifique se todas as 4 variáveis estão lá

---

## 🎯 Próximos Passos

1. ✅ **Configurar no Mercado Pago** (usar a URL acima)
2. ✅ **Testar webhook** via Mercado Pago
3. ✅ **Verificar logs** no Railway
4. ✅ **Fazer pagamento de teste** no site
5. ✅ **Verificar se assinatura foi ativada** no Firestore

---

## 🆘 Problemas?

### Webhook não responde?
- Verifique se o deploy está ativo no Railway
- Verifique os logs do Railway
- Teste a URL manualmente no navegador

### Erro 404?
- Certifique-se de usar a URL completa: `/webhook/mercadopago`
- Verifique se o `server.js` está sendo executado

### Variáveis não funcionam?
- Verifique se copiou a chave privada COMPLETA
- Não adicione aspas nas variáveis
- Certifique-se de que não há espaços extras

---

**URL do Webhook:** `https://web-production-c0585.up.railway.app/webhook/mercadopago`

