# Configuração de Webhook do Mercado Pago

## 📋 Visão Geral

O webhook permite que o Mercado Pago notifique seu sistema automaticamente quando houver atualizações em um pagamento, sem precisar verificar manualmente via API.

## 🔗 URL do Webhook Configurada

```
https://angry-dryers-show.loca.lt/webhook/mercadopago
```

## ✅ O Que Foi Configurado

### 1. Código Atualizado

O webhook foi configurado automaticamente em todas as preferências de pagamento criadas através de `criarPreferenciaPagamento` em `back-end/api.assinatura.ts`.

**O que acontece:**
- Toda vez que uma preferência de pagamento é criada, o `notification_url` é automaticamente incluído
- O Mercado Pago enviará notificações para esta URL quando houver mudanças no status do pagamento

### 2. Configuração no Arquivo

A URL do webhook está configurada em `back-end/mercadoPagoConfig.ts`:

```typescript
webhookUrl: 'https://angry-dryers-show.loca.lt/webhook/mercadopago'
```

## 🔧 Configuração no Painel do Mercado Pago

Além de configurar no código, você também precisa configurar no painel do Mercado Pago:

### Passo 1: Acessar o Painel
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login
3. Selecione sua aplicação

### Passo 2: Configurar Webhook
1. No menu lateral, clique em **"Webhooks"** ou **"Notificações"**
2. Clique em **"Adicionar URL"** ou **"Configurar Webhook"**
3. Cole a URL: `https://angry-dryers-show.loca.lt/webhook/mercadopago`
4. Selecione os eventos que deseja receber:
   - ✅ **payment** (Pagamentos)
   - ✅ **merchant_order** (Pedidos)
5. Clique em **"Salvar"** ou **"Confirmar"**

### Passo 3: Verificar Configuração
1. Após salvar, você verá a URL configurada na lista
2. O status deve mostrar como **"Ativo"** ou **"Ativado"**
3. Você pode testar enviando uma notificação de teste (se disponível)

## 📨 Como o Webhook Funciona

### Fluxo de Notificação

1. **Usuário faz pagamento** no checkout do Mercado Pago
2. **Mercado Pago processa** o pagamento
3. **Mercado Pago envia POST** para o webhook com os dados do pagamento
4. **Seu servidor recebe** a notificação
5. **Seu servidor processa** e atualiza a assinatura no Firebase

### Formato da Notificação

O Mercado Pago envia uma requisição POST com os seguintes dados:

```json
{
  "action": "payment.created",
  "api_version": "v1",
  "data": {
    "id": "123456789"
  },
  "date_created": "2024-01-01T00:00:00.000-04:00",
  "id": 123456789,
  "live_mode": false,
  "type": "payment",
  "user_id": "123456789"
}
```

### Parâmetros na Query String

O Mercado Pago também pode enviar parâmetros na URL:

```
https://angry-dryers-show.loca.lt/webhook/mercadopago?topic=payment&id=123456789
```

Onde:
- `topic`: Tipo de evento (`payment`, `merchant_order`, etc.)
- `id`: ID do pagamento ou pedido

## 🔍 Verificando se o Webhook Está Funcionando

### 1. Verificar Logs do Servidor

Se você tiver acesso aos logs do servidor que recebe o webhook, verifique:
- Requisições POST recebidas
- Status das respostas (deve ser 200 ou 201)
- Dados recebidos

### 2. Verificar no Painel do Mercado Pago

1. Acesse o painel do Mercado Pago
2. Vá em **"Webhooks"**
3. Veja o histórico de notificações enviadas
4. Verifique se há erros ou falhas

### 3. Testar Manualmente

Você pode testar o webhook fazendo um pagamento de teste:
1. Faça um pagamento de teste
2. Verifique se o webhook recebeu a notificação
3. Verifique se a assinatura foi ativada no Firebase

## ⚠️ Requisitos do Webhook

### Resposta do Servidor

O servidor que recebe o webhook **DEVE** responder com:
- **Status HTTP 200** ou **201** para indicar sucesso
- Resposta em até **22 segundos**

Se o servidor não responder corretamente:
- O Mercado Pago tentará reenviar a notificação
- Tentativas a cada 15 minutos
- Até 10 tentativas

### Segurança

**IMPORTANTE**: O webhook deve validar a origem da requisição:

1. **Verificar o IP** do Mercado Pago
2. **Validar o header** `x-signature` (se configurado)
3. **Verificar o Access Token** nas requisições

## 🔄 Processamento da Notificação

Quando o webhook receber uma notificação, você deve:

1. **Extrair o ID do pagamento** da notificação
2. **Buscar os detalhes** do pagamento via API do Mercado Pago
3. **Verificar o status** do pagamento
4. **Se aprovado**, atualizar a assinatura no Firebase
5. **Responder com 200** para confirmar o recebimento

### Exemplo de Processamento

```typescript
// No seu endpoint do webhook
app.post('/webhook/mercadopago', async (req, res) => {
  try {
    const { topic, id } = req.query;
    
    if (topic === 'payment') {
      // Buscar detalhes do pagamento
      const payment = await buscarPagamentoPorId(id);
      
      if (payment.status === 'approved') {
        // Extrair userId do external_reference
        const externalRef = payment.external_reference;
        const [userId, tipo] = externalRef.split('_');
        
        // Ativar assinatura
        await processarCallbackPagamento(
          payment.id,
          'approved',
          userId,
          tipo
        );
      }
    }
    
    // Responder com sucesso
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).send('Erro');
  }
});
```

## 🛠️ Troubleshooting

### Erro 503 - Service Unavailable

**Causa:** O servidor não está respondendo ou não está acessível.

**Soluções:**
1. Verifique se o servidor local está rodando
2. Verifique se o localtunnel está ativo
3. Teste a URL manualmente no navegador
4. Verifique se o endpoint está implementado corretamente
5. Consulte `SOLUCAO_ERRO_503_WEBHOOK.md` para mais detalhes

### Webhook não está recebendo notificações

**Possíveis causas:**
1. URL não está acessível publicamente (localhost não funciona)
2. URL não está configurada no painel do Mercado Pago
3. Servidor não está respondendo corretamente
4. Firewall bloqueando requisições do Mercado Pago

**Soluções:**
1. Use um serviço de túnel (como ngrok, localtunnel, etc.) para expor localhost
2. Verifique se a URL está correta no painel
3. Verifique os logs do servidor
4. Configure o firewall para permitir requisições do Mercado Pago

### Webhook recebe mas não processa

**Possíveis causas:**
1. Erro no código de processamento
2. Problema ao acessar a API do Mercado Pago
3. Problema ao atualizar o Firebase

**Soluções:**
1. Verifique os logs de erro
2. Teste a conexão com a API do Mercado Pago
3. Verifique as credenciais do Firebase

### Notificações duplicadas

**Causa:** O Mercado Pago pode enviar múltiplas notificações para o mesmo evento.

**Solução:** Implemente idempotência - verifique se o pagamento já foi processado antes de processar novamente.

## 📝 Notas Importantes

1. **URLs locais não funcionam**: O webhook precisa ser acessível publicamente. Use um serviço de túnel para desenvolvimento.

2. **HTTPS é recomendado**: O Mercado Pago recomenda usar HTTPS para webhooks em produção.

3. **Timeout**: O servidor deve responder em até 22 segundos, caso contrário o Mercado Pago tentará novamente.

4. **Idempotência**: Implemente verificação para evitar processar a mesma notificação múltiplas vezes.

5. **Logs**: Mantenha logs de todas as notificações recebidas para debugging.

## 🔗 Links Úteis

- [Documentação de Webhooks do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers/panel)
- [Lista de IPs do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/ip-addresses)

## ✅ Checklist de Configuração

- [x] Webhook configurado no código (`back-end/api.assinatura.ts`)
- [x] URL do webhook definida em `back-end/mercadoPagoConfig.ts`
- [ ] Webhook configurado no painel do Mercado Pago
- [ ] Eventos selecionados (payment, merchant_order)
- [ ] Servidor webhook implementado e funcionando
- [ ] Teste de notificação realizado com sucesso
- [ ] Logs de webhook configurados
- [ ] Validação de segurança implementada

