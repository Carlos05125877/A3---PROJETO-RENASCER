# ⚡ Verificação Rápida: Webhook Não Confirma Pagamento

## 🔍 Passos Rápidos para Diagnosticar

### 1. Verificar Logs do Vercel (5 minutos)

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: **a3-projeto-renascer**
3. Vá em **Deployments** > Deploy mais recente > **Logs**
4. Procure por estas mensagens:

**✅ Se aparecer:**
```
🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===
```
→ O webhook está recebendo notificações! Continue para o passo 2.

**❌ Se NÃO aparecer:**
→ O Mercado Pago não está enviando notificações. Verifique:
- URL do webhook no painel do Mercado Pago
- Se a preferência de pagamento tem `notification_url`

---

### 2. Verificar Firebase Admin (2 minutos)

**Nos logs do Vercel, procure por:**

**✅ Se aparecer:**
```
✅ Firebase Admin inicializado com variáveis de ambiente
```
→ Firebase Admin está OK! Continue para o passo 3.

**❌ Se aparecer:**
```
⚠️ Firebase Admin inicializado apenas com projectId (pode não funcionar para atualizar Firestore)
```
→ **PROBLEMA ENCONTRADO!** Configure as variáveis:
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

**❌ Se aparecer:**
```
❌ Erro ao inicializar Firebase Admin
```
→ **PROBLEMA ENCONTRADO!** Verifique as variáveis de ambiente.

---

### 3. Verificar Processamento do Webhook (2 minutos)

**Nos logs do Vercel, procure por:**

**✅ Se aparecer:**
```
✅ Webhook processado com sucesso: Assinatura processada com sucesso
```
→ Tudo funcionando! Verifique o Firestore.

**❌ Se aparecer:**
```
❌ Erro ao processar webhook: ...
```
→ Veja a mensagem de erro específica e corrija.

**❌ Se aparecer:**
```
❌ Erro ao atualizar Firestore: ...
```
→ Firebase Admin não está configurado corretamente.

---

### 4. Verificar Variáveis de Ambiente no Vercel (3 minutos)

1. No Vercel, vá em **Settings** > **Environment Variables**
2. Verifique se TODAS estas variáveis estão configuradas:

```
✅ MERCADO_PAGO_ACCESS_TOKEN
✅ FIREBASE_PROJECT_ID = a3-renascer
✅ FIREBASE_PRIVATE_KEY = (chave privada completa)
✅ FIREBASE_CLIENT_EMAIL = (email do service account)
```

**Se alguma estiver faltando:**
1. Adicione a variável
2. Aguarde o redeploy automático (ou faça deploy manual)

---

### 5. Verificar Webhook no Mercado Pago (2 minutos)

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Webhooks**
3. Verifique se a URL está:
   ```
   https://a3-projeto-renascer.vercel.app/webhook/mercadopago
   ```
4. Clique em **Testar URL**
   - Deve retornar: **200 OK**

---

## 🎯 Solução Mais Comum

**90% dos casos:** Firebase Admin não está configurado!

**Solução:**
1. No Vercel, vá em **Settings** > **Environment Variables**
2. Adicione:
   - `FIREBASE_PRIVATE_KEY` = (cole a chave privada do serviceAccountKey.json)
   - `FIREBASE_CLIENT_EMAIL` = (cole o client_email do serviceAccountKey.json)
3. Aguarde o redeploy

---

## 📋 Checklist Rápido

- [ ] Logs mostram: `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`
- [ ] Logs mostram: `✅ Firebase Admin inicializado com variáveis de ambiente`
- [ ] Logs mostram: `✅ Webhook processado com sucesso`
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Webhook configurado no Mercado Pago
- [ ] URL do webhook testada e funcionando

---

**Se todos os itens estiverem ✅ mas ainda não funcionar, me envie os logs do Vercel!**

