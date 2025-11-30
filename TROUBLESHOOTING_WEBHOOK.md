# 🔍 Troubleshooting: Webhook Não Está Confirmando Pagamento

## 📋 Checklist de Verificação

### 1. ✅ Verificar se o Webhook Está Recebendo Notificações

**No Dashboard do Vercel:**
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: **a3-projeto-renascer**
3. Vá em **Deployments** > Clique no deploy mais recente
4. Vá na aba **Logs**
5. Procure por: `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`

**Se NÃO aparecer:**
- O Mercado Pago não está enviando notificações
- Verifique se a URL do webhook está correta no painel do Mercado Pago
- Teste a URL manualmente no navegador

**Se aparecer:**
- O webhook está recebendo notificações
- Continue para o próximo passo

---

### 2. ✅ Verificar Variáveis de Ambiente no Vercel

**No Dashboard do Vercel:**
1. Vá em **Settings** > **Environment Variables**
2. Verifique se estas variáveis estão configuradas:

#### Variáveis Obrigatórias:

- ✅ **MERCADO_PAGO_ACCESS_TOKEN**
  - Deve conter seu Access Token do Mercado Pago
  - Exemplo: `APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470`

- ✅ **FIREBASE_PROJECT_ID**
  - Valor: `a3-renascer`

#### Variáveis do Firebase Admin (OBRIGATÓRIAS para atualizar Firestore):

- ✅ **FIREBASE_PRIVATE_KEY**
  - Deve conter a chave privada completa do serviceAccountKey.json
  - **IMPORTANTE:** Deve incluir `\n` (quebras de linha)
  - Formato: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuCs9SVA8/L8eW\n...\n-----END PRIVATE KEY-----\n`

- ✅ **FIREBASE_CLIENT_EMAIL**
  - Deve conter o email do service account
  - Exemplo: `firebase-adminsdk-fbsvc@a3-renascer.iam.gserviceaccount.com`

**Se alguma variável estiver faltando:**
- Adicione no Vercel
- Faça um novo deploy (ou aguarde o redeploy automático)

---

### 3. ✅ Verificar Logs do Vercel para Erros

**No Dashboard do Vercel:**
1. Vá em **Deployments** > Deploy mais recente > **Logs**
2. Procure por erros como:

**Erro: "Firebase Admin não está inicializado"**
- **Solução:** Configure `FIREBASE_PRIVATE_KEY` e `FIREBASE_CLIENT_EMAIL`

**Erro: "Cannot find module 'firebase-admin'"**
- **Solução:** Verifique se `firebase-admin` está no `package.json`

**Erro: "Access Token do Mercado Pago não configurado"**
- **Solução:** Configure `MERCADO_PAGO_ACCESS_TOKEN`

**Erro: "external_reference não encontrado"**
- **Solução:** Verifique se a preferência de pagamento está sendo criada com `external_reference`

**Erro: "Erro ao atualizar assinatura no Firestore"**
- **Solução:** Verifique as credenciais do Firebase Admin

---

### 4. ✅ Verificar se o Webhook Está Configurado no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Webhooks**
3. Verifique se a URL está correta:
   ```
   https://a3-projeto-renascer.vercel.app/webhook/mercadopago
   ```
4. Clique em **Testar URL**
   - Deve retornar status 200 OK

---

### 5. ✅ Verificar se a Preferência de Pagamento Tem notification_url

Verifique se ao criar a preferência de pagamento, o `notification_url` está sendo configurado.

**No código (`back-end/api.assinatura.ts`):**
```typescript
notification_url: 'https://a3-projeto-renascer.vercel.app/webhook/mercadopago'
```

---

### 6. ✅ Testar Manualmente

**Teste 1: Health Check**
```
https://a3-projeto-renascer.vercel.app/health
```
Deve retornar: `{"status":"ok",...}`

**Teste 2: Webhook Endpoint (GET)**
```
https://a3-projeto-renascer.vercel.app/webhook/mercadopago
```
Deve retornar uma mensagem de confirmação

**Teste 3: Fazer um Pagamento de Teste**
1. Faça um pagamento de teste no app
2. Verifique os logs do Vercel
3. Deve aparecer: `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Webhook recebe notificação mas não atualiza Firestore

**Causa:** Firebase Admin não está inicializado corretamente

**Solução:**
1. Verifique se `FIREBASE_PRIVATE_KEY` está configurada no Vercel
2. Verifique se `FIREBASE_CLIENT_EMAIL` está configurada no Vercel
3. Verifique se a chave privada está completa (com `\n`)
4. Verifique os logs do Vercel para erros específicos

### Problema 2: Webhook não recebe notificações

**Causa:** URL do webhook incorreta ou não configurada

**Solução:**
1. Verifique a URL no painel do Mercado Pago
2. Teste a URL manualmente no navegador
3. Verifique se a preferência de pagamento tem `notification_url` configurada

### Problema 3: Pagamento aprovado mas assinatura não ativada

**Causa:** Erro ao processar webhook ou atualizar Firestore

**Solução:**
1. Verifique os logs do Vercel
2. Verifique se o `external_reference` está no formato correto: `userId_tipo_timestamp`
3. Verifique se o usuário existe no Firestore

### Problema 4: Erro "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**
1. Verifique se `firebase-admin` está no `package.json`
2. O Vercel instala automaticamente via `npm install`
3. Verifique os logs de build no Vercel

---

## 📝 Como Verificar os Logs no Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: **a3-projeto-renascer**
3. Vá em **Deployments**
4. Clique no deploy mais recente
5. Vá na aba **Logs**
6. Procure por:
   - `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`
   - `✅ Webhook processado com sucesso`
   - `❌ Erro ao processar webhook`
   - `💾 Atualizando assinatura no Firestore`

---

## 🔧 Comandos Úteis para Debug

### Verificar se Firebase Admin está inicializado:
Procure nos logs: `✅ Firebase Admin inicializado`

### Verificar se webhook está recebendo:
Procure nos logs: `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`

### Verificar se pagamento foi encontrado:
Procure nos logs: `✅ Detalhes do pagamento obtidos`

### Verificar se Firestore foi atualizado:
Procure nos logs: `✅ Assinatura atualizada com sucesso no Firestore`

---

## ✅ Checklist Final

- [ ] Webhook está recebendo notificações (verificar logs)
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Firebase Admin inicializado (verificar logs)
- [ ] Webhook configurado no painel do Mercado Pago
- [ ] URL do webhook está correta
- [ ] Preferência de pagamento tem `notification_url`
- [ ] Fazer pagamento de teste e verificar logs
- [ ] Verificar se assinatura foi atualizada no Firestore

---

**Se ainda não funcionar após seguir todos os passos, me envie os logs do Vercel para análise!**

