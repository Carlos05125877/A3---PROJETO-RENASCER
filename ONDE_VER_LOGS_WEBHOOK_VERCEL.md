# 📍 ONDE VER OS LOGS DO WEBHOOK NO VERCEL

## ⚠️ IMPORTANTE: Você está vendo os logs errados!

Os logs que você está vendo (GET /favicon, GET /, etc.) são **logs gerais do servidor**, não os logs da **função serverless** onde o webhook é processado.

## ✅ Como Ver os Logs Corretos do Webhook

### Passo a Passo:

1. **Acesse o Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Faça login na sua conta

2. **Selecione o Projeto:**
   - Clique em **a3-projeto-renascer**

3. **Vá em Deployments:**
   - No menu lateral, clique em **Deployments**
   - Ou acesse diretamente: https://vercel.com/[seu-usuario]/a3-projeto-renascer/deployments

4. **Selecione o Deploy Mais Recente:**
   - Clique no deploy mais recente (o que tem o ícone de "Production" ou "Preview")

5. **Acesse as Functions:**
   - No topo da página, você verá abas: **Overview**, **Build Logs**, **Functions**, etc.
   - **Clique em "Functions"**

6. **Selecione server.js:**
   - Você verá uma lista de funções
   - **Clique em "server.js"** (ou o nome da sua função)

7. **Veja os Logs:**
   - Agora você verá os logs **específicos da função serverless**
   - Procure por mensagens como:
     - `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`
     - `🔍 Buscando detalhes do pagamento:`
     - `✅ Assinatura atualizada com sucesso`

## 🔍 Diferença Entre os Logs

### ❌ Logs Gerais (que você está vendo):
```
GET 404 /favicon.png
GET 200 /
GET 200 /health
```
- São logs de **todas as requisições** ao servidor
- Não mostram o processamento interno do webhook

### ✅ Logs da Função (que você precisa ver):
```
🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===
📋 Headers: {...}
📋 Body: {...}
🔍 Buscando detalhes do pagamento: 123456
...
```
- São logs **específicos da função serverless**
- Mostram todo o processamento do webhook

## 🧪 Testar se os Logs Estão Funcionando

### 1. Teste o Endpoint de Teste:

Acesse no navegador:
```
https://a3-projeto-renascer-eta.vercel.app/webhook/mercadopago
```

Você deve ver:
```json
{
  "message": "Webhook endpoint está ativo e funcionando!",
  "timestamp": "...",
  "method": "GET"
}
```

### 2. Veja os Logs:

Depois de acessar, vá nos logs da função (seguindo os passos acima) e procure por:
```
✅ ===== ENDPOINT DE TESTE ACESSADO VIA GET =====
📋 Timestamp: ...
```

Se você ver essa mensagem, os logs estão funcionando!

## 📸 Screenshot de Referência

A estrutura no Vercel é assim:

```
Dashboard
  └── Projeto: a3-projeto-renascer
      └── Deployments
          └── [Deploy mais recente]
              └── Abas: Overview | Build Logs | Functions | ...
                  └── Functions
                      └── server.js
                          └── [AQUI ESTÃO OS LOGS DO WEBHOOK]
```

## 🐛 Se Ainda Não Ver os Logs

1. **Verifique se o deploy foi concluído:**
   - O deploy deve estar com status "Ready" (verde)

2. **Aguarde alguns segundos:**
   - Os logs podem demorar alguns segundos para aparecer

3. **Teste novamente:**
   - Faça um novo teste via Mercado Pago
   - Ou acesse o endpoint de teste

4. **Verifique se está na função correta:**
   - Certifique-se de estar em **Functions > server.js**
   - Não em "Build Logs" ou "Overview"

## 🔗 Links Diretos

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Endpoint de Teste:** https://a3-projeto-renascer-eta.vercel.app/webhook/mercadopago

---

**Lembre-se:** Os logs do webhook aparecem apenas na aba **Functions > server.js**, não nos logs gerais do servidor!

