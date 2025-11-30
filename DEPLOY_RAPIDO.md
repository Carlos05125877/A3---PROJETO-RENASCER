# 🚀 Deploy Rápido do Webhook - Passo a Passo

## Opção Mais Fácil: Vercel (Recomendado) ⭐

### 1. Preparar o Código

✅ **Já está pronto!** Os arquivos necessários já foram criados:
- `server.js` - Servidor webhook
- `webhook-processor.js` - Processador de webhooks
- `vercel.json` - Configuração do Vercel
- `package.json` - Dependências

### 2. Fazer Deploy no Vercel

1. **Acesse:** https://vercel.com
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Selecione seu repositório** do GitHub
5. **Configure:**
   - Framework Preset: **Other**
   - Root Directory: **./** (raiz)
   - Build Command: (deixe vazio)
   - Output Directory: (deixe vazio)
6. **Clique em "Deploy"**

### 3. Configurar Variáveis de Ambiente

Após o deploy, vá em **Settings > Environment Variables** e adicione:

```
MERCADO_PAGO_ACCESS_TOKEN = seu_access_token_aqui
FIREBASE_PROJECT_ID = a3-renascer
```

**Para usar Firebase Admin (opcional, mas recomendado):**
```
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@a3-renascer.iam.gserviceaccount.com
```

**Como obter as credenciais do Firebase:**
1. Acesse: https://console.firebase.google.com/project/a3-renascer/settings/serviceaccounts/adminsdk
2. Clique em "Gerar nova chave privada"
3. Copie o `private_key` e `client_email` do arquivo JSON

### 4. Obter URL do Webhook

Após o deploy, o Vercel gerará uma URL como:
```
https://seu-projeto.vercel.app
```

Seu webhook estará em:
```
https://seu-projeto.vercel.app/webhook/mercadopago
```

### 5. Configurar no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Webhooks**
3. Configure a URL: `https://seu-projeto.vercel.app/webhook/mercadopago`
4. Teste a URL

### 6. Testar

1. Acesse: `https://seu-projeto.vercel.app/health`
   - Deve retornar: `{"status":"ok",...}`

2. Acesse: `https://seu-projeto.vercel.app/webhook/mercadopago`
   - Deve retornar uma mensagem de confirmação

3. Faça um pagamento de teste no app
4. Verifique os logs no Vercel (aba "Logs")

---

## ✅ Pronto!

Agora seu webhook está rodando 24/7 sem precisar manter seu computador ligado!

---

## 🔄 Atualizações Futuras

Toda vez que você fizer `git push` para o repositório, o Vercel fará deploy automático!

---

## 🆘 Problemas?

- **Erro ao fazer deploy:** Verifique se todas as dependências estão no `package.json`
- **Webhook não funciona:** Verifique as variáveis de ambiente no Vercel
- **Firebase não atualiza:** Configure as credenciais do Firebase Admin

---

**Dica:** O Vercel oferece 100GB de bandwidth grátis por mês, mais que suficiente para webhooks!

