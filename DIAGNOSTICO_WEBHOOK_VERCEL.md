# 🔍 Diagnóstico: Webhook não está confirmando pagamento

## 🐛 Problema

O webhook está recebendo notificações (retorna 200 OK), mas o pagamento não está sendo confirmado no Firestore.

## ✅ Checklist de Verificação

### 1. Verificar Variáveis de Ambiente no Vercel

Acesse: https://vercel.com/dashboard

1. Vá no seu projeto: **a3-projeto-renascer**
2. Vá em **Settings** > **Environment Variables**
3. Verifique se as seguintes variáveis estão configuradas:

```
FIREBASE_PROJECT_ID=a3-renascer
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@a3-renascer.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-7288585500067152-112921-...
```

**⚠️ IMPORTANTE:**
- O `FIREBASE_PRIVATE_KEY` deve incluir `\n` (quebras de linha) ou o código substitui automaticamente
- Copie a chave privada COMPLETA do arquivo `serviceAccountKey.json`

### 2. Verificar Logs do Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá no seu projeto
3. Clique em **Deployments**
4. Clique no deploy mais recente
5. Clique em **Functions** > **server.js**
6. Veja os logs em tempo real

**Procure por:**
- ✅ `Firebase Admin inicializado com variáveis de ambiente`
- ✅ `PROCESSANDO WEBHOOK MERCADO PAGO`
- ✅ `Assinatura atualizada com sucesso no Firestore`
- ❌ `Firebase Admin não está inicializado`
- ❌ `external_reference não encontrado`
- ❌ `Erro ao atualizar assinatura no Firestore`

### 3. Testar Webhook Manualmente

1. Acesse: https://a3-projeto-renascer-eta.vercel.app/webhook/mercadopago
   - Deve retornar: `{"message": "Webhook endpoint está ativo e funcionando!"}`

2. Teste via Mercado Pago:
   - Acesse: https://www.mercadopago.com.br/developers/panel/app
   - Vá em **Webhooks** > **Testar notificação**
   - Envie uma notificação de teste
   - Verifique os logs no Vercel

### 4. Verificar Formato do external_reference

O `external_reference` deve estar no formato: `userId_tipo_timestamp`

Exemplo:
```
jOFIsoZjdxdSZIwN5inoGE3tPKI1_usuario_1733016000000
```

O webhook extrai:
- `userId`: primeira parte
- `tipo`: segunda parte (`usuario` ou `profissional`)

### 5. Verificar Firestore

1. Acesse: https://console.firebase.google.com
2. Vá em **Firestore Database**
3. Procure pelo documento do usuário na coleção `users` ou `profissionais`
4. Verifique se o campo `assinatura` foi atualizado:
   ```json
   {
     "assinatura": {
       "isAssinante": true,
       "dataInicio": "2025-12-01T...",
       "dataFim": "2026-01-01T...",
       "tipoAssinatura": "usuario",
       "paymentId": "13593620099",
       "status": "approved"
     }
   }
   ```

## 🔧 Soluções Comuns

### Problema 1: Firebase Admin não inicializado

**Sintoma:** Logs mostram `Firebase Admin não está inicializado`

**Solução:**
1. Verifique se as variáveis de ambiente estão configuradas no Vercel
2. Certifique-se de que `FIREBASE_PRIVATE_KEY` inclui as quebras de linha `\n`
3. Faça um novo deploy após configurar as variáveis

### Problema 2: external_reference não encontrado

**Sintoma:** Logs mostram `external_reference não encontrado no pagamento`

**Solução:**
1. Verifique se o `external_reference` está sendo enviado na criação da preferência
2. Verifique os logs do webhook para ver os dados completos do pagamento
3. O Mercado Pago pode não estar enviando o `external_reference` na notificação, mas ele deve estar nos detalhes do pagamento quando buscamos via API

### Problema 3: Erro ao atualizar Firestore

**Sintoma:** Logs mostram `Erro ao atualizar assinatura no Firestore`

**Solução:**
1. Verifique se o documento do usuário existe no Firestore
2. Verifique se as permissões do Firebase Admin estão corretas
3. Verifique se o `userId` está correto

## 📝 Próximos Passos

1. **Verifique os logs do Vercel** após um pagamento de teste
2. **Copie os logs** e analise onde está falhando
3. **Teste manualmente** o webhook via Mercado Pago
4. **Verifique o Firestore** para ver se a assinatura foi atualizada

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Firebase Console:** https://console.firebase.google.com
- **Mercado Pago Developers:** https://www.mercadopago.com.br/developers/panel

