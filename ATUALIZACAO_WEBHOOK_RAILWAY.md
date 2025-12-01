# ✅ Webhook Atualizado para Railway

## 🔧 O Que Foi Corrigido

A URL do webhook estava configurada com a URL antiga do LocalTunnel:
- ❌ **Antes:** `https://angry-dryers-show.loca.lt/webhook/mercadopago`
- ✅ **Agora:** `https://web-production-c0585.up.railway.app/webhook/mercadopago`

## 📝 Arquivo Atualizado

O arquivo `back-end/mercadoPagoConfig.ts` foi atualizado para usar a URL do Railway.

## 🚀 Próximos Passos

### 1. Aguardar Deploy no Netlify

O código foi enviado para o GitHub. O Netlify deve fazer o deploy automaticamente. Aguarde alguns minutos.

### 2. Verificar se o Deploy Foi Bem-Sucedido

1. Acesse: https://app.netlify.com
2. Vá no seu site: **renascerpsi**
3. Verifique se há um novo deploy em **Deployments**
4. Aguarde até que o status seja **"Published"**

### 3. Testar Novamente

Após o deploy:

1. **Acesse o site:** https://renascerpsi.netlify.app
2. **Faça login**
3. **Vá na página de assinatura**
4. **Clique em "Assinar"**
5. **Complete um pagamento de teste**

### 4. Verificar se a URL Está Correta

Após criar a preferência de pagamento, verifique no console do navegador:

```
✅ Webhook configurado: https://web-production-c0585.up.railway.app/webhook/mercadopago
```

Se aparecer a URL antiga, o deploy ainda não foi concluído. Aguarde mais alguns minutos.

## 🔍 Verificar no Mercado Pago

Você também pode verificar no painel do Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Suas integrações** > **Webhooks**
3. Verifique se a URL está configurada como: `https://web-production-c0585.up.railway.app/webhook/mercadopago`

**Nota:** O webhook também pode ser configurado automaticamente quando você cria uma preferência de pagamento com `notification_url`. Não é necessário configurar manualmente no painel.

## ✅ Confirmação

Após o deploy, quando você criar uma nova preferência de pagamento, a URL do webhook será:

```
https://web-production-c0585.up.railway.app/webhook/mercadopago
```

E os logs do Railway mostrarão as notificações sendo recebidas corretamente!

