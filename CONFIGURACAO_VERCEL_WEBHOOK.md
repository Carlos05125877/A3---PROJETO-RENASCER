# 🚀 Configuração do Webhook no Vercel - Passo a Passo

## 📋 Configurações na Tela "New Project"

### 1. Framework Preset
**⚠️ IMPORTANTE:** Mude de "Create React App" para **"Other"**

- Clique no dropdown "Framework Preset"
- Selecione **"Other"** (não use Create React App, Next.js, etc.)

### 2. Root Directory
- Deixe como está: **`./`** (raiz do projeto)

### 3. Build and Output Settings
Clique em "Build and Output Settings" para expandir:

- **Build Command:** Deixe **VAZIO** ou remova qualquer comando
- **Output Directory:** Deixe **VAZIO** ou remova qualquer diretório
- **Install Command:** Pode deixar como `npm install` (padrão)

### 4. Environment Variables
Clique em "Environment Variables" para expandir e adicione:

#### Variáveis Obrigatórias:

1. **MERCADO_PAGO_ACCESS_TOKEN**
   - Value: Seu Access Token do Mercado Pago
   - Exemplo: `APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470`

2. **FIREBASE_PROJECT_ID**
   - Value: `a3-renascer`

#### Variáveis do Firebase Admin (para atualizar Firestore):

3. **FIREBASE_PRIVATE_KEY**
   - Value: A chave privada do serviceAccountKey.json
   - **IMPORTANTE:** Copie exatamente como está, incluindo `\n`
   - Exemplo: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuCs9SVA8/L8eW\n...\n-----END PRIVATE KEY-----\n`

4. **FIREBASE_CLIENT_EMAIL**
   - Value: O email do service account
   - Exemplo: `firebase-adminsdk-fbsvc@a3-renascer.iam.gserviceaccount.com`

**Como obter as credenciais do Firebase:**
1. Acesse: https://console.firebase.google.com/project/a3-renascer/settings/serviceaccounts/adminsdk
2. Clique em "Gerar nova chave privada"
3. Abra o arquivo JSON baixado
4. Copie o `private_key` (completo, incluindo BEGIN e END)
5. Copie o `client_email`

### 5. Project Name
- Pode deixar como está: `a3-projeto-renascer`
- Ou mude para algo mais descritivo: `webhook-mercadopago`

### 6. Deploy
- Clique no botão **"Deploy"** no final da página
- Aguarde alguns minutos enquanto o Vercel faz o deploy

---

## ✅ Após o Deploy

### 1. Obter a URL do Webhook

Após o deploy, o Vercel gerará uma URL como:
```
https://a3-projeto-renascer.vercel.app
```

Seu webhook estará em:
```
https://a3-projeto-renascer.vercel.app/webhook/mercadopago
```

### 2. Testar o Webhook

1. **Health Check:**
   ```
   https://a3-projeto-renascer.vercel.app/health
   ```
   Deve retornar: `{"status":"ok",...}`

2. **Endpoint do Webhook (GET):**
   ```
   https://a3-projeto-renascer.vercel.app/webhook/mercadopago
   ```
   Deve retornar uma mensagem de confirmação

### 3. Configurar no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Webhooks**
3. Configure a URL: `https://a3-projeto-renascer.vercel.app/webhook/mercadopago`
4. Teste a URL

---

## 🔍 Verificando se Funcionou

### Logs do Vercel
1. No dashboard do Vercel, vá em seu projeto
2. Clique na aba **"Logs"**
3. Você verá os logs do servidor em tempo real

### Teste de Pagamento
1. Faça um pagamento de teste no app
2. Verifique os logs do Vercel
3. Deve aparecer: `🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===`
4. Verifique se a assinatura foi atualizada no Firestore

---

## 🚨 Problemas Comuns

### Erro: "Build failed"
- **Solução:** Verifique se o Framework Preset está como "Other"
- Verifique se não há Build Command configurado

### Erro: "Cannot find module"
- **Solução:** Verifique se todas as dependências estão no `package.json`
- O Vercel instala automaticamente via `npm install`

### Webhook não recebe notificações
- **Solução:** 
  1. Verifique se a URL está correta no Mercado Pago
  2. Teste a URL manualmente no navegador
  3. Verifique os logs do Vercel

### Firebase não atualiza
- **Solução:** 
  1. Verifique se as variáveis de ambiente do Firebase estão configuradas
  2. Verifique se o `FIREBASE_PRIVATE_KEY` está completo (com `\n`)
  3. Verifique os logs do Vercel para erros

---

## 📝 Resumo das Configurações

```
Framework Preset: Other
Root Directory: ./
Build Command: (vazio)
Output Directory: (vazio)

Environment Variables:
- MERCADO_PAGO_ACCESS_TOKEN
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL
```

---

**Pronto!** Seu webhook estará rodando 24/7 no Vercel! 🎉

