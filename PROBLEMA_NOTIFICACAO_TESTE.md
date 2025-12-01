# ⚠️ Problema: Notificações de Teste Não Funcionam

## 🐛 O Problema

Os logs mostram que o webhook está funcionando, mas aparece:
```
⚠️ NOTIFICAÇÃO DE TESTE DETECTADA
⚠️ Notificações de teste não podem ser processadas porque o ID é fictício
```

## ✅ Solução: Fazer Pagamento REAL de Teste

As notificações de teste do Mercado Pago (via painel) usam IDs fictícios que não existem na API. Para testar completamente, você precisa fazer um **pagamento REAL de teste**.

---

## 📝 Como Fazer Pagamento Real de Teste

### 1. Acessar seu Site

1. Acesse: `https://renascerpsi.netlify.app`
2. Faça login
3. Vá na página de assinatura

### 2. Iniciar Assinatura

1. Clique em **"Assinar"**
2. Será aberta a tela do Mercado Pago

### 3. Usar Cartão de Teste

Use estes dados de cartão de teste do Mercado Pago:

**Cartão Aprovado:**
- **Número:** `5031 4332 1540 6351`
- **CVV:** `123`
- **Nome:** `APRO`
- **Vencimento:** Qualquer data futura (ex: 12/25)
- **CPF:** Qualquer CPF válido (ex: 12345678900)

**Cartão Recusado (para testar erro):**
- **Número:** `5031 4332 1540 6351`
- **CVV:** `123`
- **Nome:** `OTHE`
- **Vencimento:** Qualquer data futura

### 4. Completar Pagamento

1. Preencha os dados do cartão
2. Clique em **"Pagar"**
3. O Mercado Pago processará o pagamento

### 5. Verificar Resultado

Após o pagamento:
1. O Mercado Pago enviará uma notificação REAL para o webhook
2. O webhook processará o pagamento REAL
3. A assinatura será ativada no Firestore
4. A tela de sucesso aparecerá

---

## 🔍 Verificar se Funcionou

### 1. Ver Logs no Railway

1. Acesse: https://railway.app
2. Vá em **"Deployments"**
3. Veja os logs em tempo real

**Logs esperados (pagamento REAL):**
```
🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===
🔔 === PROCESSANDO WEBHOOK MERCADO PAGO ===
🔍 Buscando detalhes do pagamento: [ID REAL]
✅ Detalhes do pagamento obtidos: {...}
📊 Status do pagamento: approved
💾 Atualizando assinatura no Firestore...
✅ Assinatura atualizada com sucesso no Firestore
✅ Webhook processado com sucesso: Assinatura processada com sucesso
```

### 2. Verificar Firestore

1. Acesse: https://console.firebase.google.com
2. Vá em **Firestore Database**
3. Procure pelo documento do usuário na coleção `users`
4. Verifique se o campo `assinatura` foi atualizado:
   ```json
   {
     "assinatura": {
       "isAssinante": true,
       "status": "approved",
       "dataInicio": "...",
       "dataFim": "...",
       "tipoAssinatura": "usuario",
       "paymentId": "[ID REAL]"
     }
   }
   ```

### 3. Verificar no Site

1. Após o pagamento, a tela de sucesso deve aparecer
2. Você deve ser redirecionado para o blog
3. O conteúdo bloqueado deve estar acessível

---

## ⚠️ Diferença: Teste vs Real

### Notificação de Teste (Painel Mercado Pago)
- ❌ ID fictício (`123456`)
- ❌ Não existe na API
- ❌ Não pode ser processado
- ✅ Serve apenas para verificar se o webhook recebe notificações

### Pagamento Real de Teste
- ✅ ID real (ex: `13593620099`)
- ✅ Existe na API
- ✅ Pode ser processado
- ✅ Ativa a assinatura no Firestore

---

## 🎯 Resumo

1. ❌ **Notificações de teste** (via painel) = Não funcionam (ID fictício)
2. ✅ **Pagamento real de teste** (via site) = Funciona (ID real)

**Para testar completamente, faça um pagamento REAL de teste usando o cartão de teste do Mercado Pago!**

