# 📋 Como Ver Logs Completos do Webhook no Vercel

## 🔍 Ver Logs em Tempo Real

### 1. Acessar Logs do Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: **a3-projeto-renascer**
3. Vá em **Deployments**
4. Clique no **deploy mais recente**
5. Clique em **Functions** > **server.js**
6. Veja os logs em tempo real

### 2. Filtrar Logs do Webhook

Nos logs do Vercel, procure por:
- `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`
- `🔔 === PROCESSANDO WEBHOOK MERCADO PAGO ===`
- `🔍 Buscando detalhes do pagamento:`
- `❌ Erro ao buscar detalhes do pagamento:`
- `✅ Detalhes do pagamento obtidos:`
- `💾 Atualizando assinatura no Firestore...`
- `✅ Assinatura atualizada com sucesso no Firestore`

### 3. Logs Esperados Após Receber Notificação

Quando o webhook recebe uma notificação, você deve ver esta sequência:

```
🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===
Headers: {...}
Query: {...}
Body: {...}
📋 Dados processados: {...}
✅ Notificação recebida e confirmada com sucesso
📋 ID do pagamento: 123456
🔔 === PROCESSANDO WEBHOOK MERCADO PAGO ===
Dados recebidos: {...}
📋 ID do pagamento extraído: 123456
📋 Tipo de notificação: payment
📋 Ação: payment.updated
🔍 Buscando detalhes do pagamento na API do Mercado Pago...
🔍 Buscando detalhes do pagamento: 123456
```

**Se for um ID de teste (123456):**
```
⚠️ ID de teste do Mercado Pago detectado: 123456
⚠️ Notificações de teste não podem ser processadas completamente
⚠️ O ID é fictício e não existe na API do Mercado Pago
❌ Erro ao buscar detalhes do pagamento: ID de teste do Mercado Pago - não pode ser processado
⚠️ Esta é uma notificação de teste do Mercado Pago
⚠️ Notificações de teste não podem ser processadas porque o ID é fictício
⚠️ Para testar completamente, faça um pagamento real de teste
✅ Webhook processado com sucesso: Notificação de teste recebida (não processada - ID fictício)
```

**Se for um pagamento real:**
```
✅ Detalhes do pagamento obtidos: {...}
📊 Status do pagamento: approved
📋 External Reference: userId_tipo_timestamp
📋 UserId extraído: ...
📋 Tipo extraído: usuario
💾 Atualizando assinatura no Firestore...
✅ Assinatura atualizada com sucesso no Firestore
✅ Webhook processado com sucesso: Assinatura processada com sucesso
```

## 🐛 Problemas Comuns nos Logs

### Problema 1: Logs param em "Buscando detalhes do pagamento"

**Causa:** Erro ao buscar na API do Mercado Pago

**Solução:**
- Verifique se o `MERCADO_PAGO_ACCESS_TOKEN` está configurado no Vercel
- Verifique se o ID do pagamento é válido (não é de teste)
- Veja os logs de erro que devem aparecer após essa linha

### Problema 2: "Firebase Admin não está inicializado"

**Causa:** Variáveis de ambiente do Firebase não configuradas

**Solução:**
- Configure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY` no Vercel
- Faça um novo deploy após configurar

### Problema 3: "external_reference não encontrado"

**Causa:** O pagamento não tem external_reference

**Solução:**
- Verifique se o `external_reference` está sendo enviado na criação da preferência
- Verifique os logs completos do pagamento para ver todos os campos

## 📝 Exportar Logs

Para exportar os logs:

1. No Vercel, vá em **Deployments** > Deploy mais recente
2. Clique em **Functions** > **server.js**
3. Use o botão de download ou copie os logs manualmente

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel Logs:** https://vercel.com/docs/monitoring/logs

