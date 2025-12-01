# 🔍 Verificar Configuração do Netlify

## ✅ Configuração Atual

O `netlify.toml` está configurado corretamente:

```toml
[build]
  publish = "dist"
  command = "npx expo export --platform web"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔍 Verificações Necessárias

### 1. Verificar Build Settings no Netlify

1. Acesse: https://app.netlify.com
2. Vá no seu site: **renascerpsi**
3. Vá em **Site settings** > **Build & deploy** > **Build settings**

**Verificar:**
- ✅ **Build command:** `npx expo export --platform web`
- ✅ **Publish directory:** `dist`

### 2. Verificar Variáveis de Ambiente (se necessário)

Se o Firebase precisar de variáveis de ambiente no frontend:

1. Vá em **Site settings** > **Environment variables**
2. Adicione se necessário (geralmente não precisa, Firebase usa configuração do código)

### 3. Verificar Deploy

1. Vá em **Deployments**
2. Verifique se o último deploy foi bem-sucedido
3. Se falhou, veja os logs e corrija

---

## 🐛 Problemas Comuns no Netlify

### Problema 1: Rotas não funcionam

**Sintoma:** Erro 404 ao acessar rotas como `/screens/pagamentoSucesso`

**Solução:** O `netlify.toml` já está configurado com redirects. Se não funcionar:
1. Verifique se o arquivo `netlify.toml` está na raiz do projeto
2. Faça um novo deploy
3. Verifique se o diretório `dist` está sendo gerado corretamente

### Problema 2: Build falha

**Sintoma:** Deploy falha no Netlify

**Solução:**
1. Verifique os logs do build
2. Certifique-se de que `npx expo export --platform web` funciona localmente
3. Verifique se todas as dependências estão no `package.json`

### Problema 3: Firebase não conecta

**Sintoma:** Erro ao conectar com Firebase

**Solução:**
1. Verifique se o `firebaseConfig.ts` está correto
2. Verifique se as credenciais do Firebase estão corretas
3. Verifique se não há bloqueios de CORS no Firebase Console

---

## 🔍 Verificar CORS no Firebase

### 1. Acessar Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto: **a3-renascer**

### 2. Verificar Configurações

1. Vá em **Authentication** > **Settings** > **Authorized domains**
2. Certifique-se de que `netlify.app` está na lista
3. Se não estiver, adicione: `renascerpsi.netlify.app`

### 3. Verificar Firestore Rules

1. Vá em **Firestore Database** > **Rules**
2. Verifique se as regras permitem leitura/escrita para usuários autenticados

---

## ✅ Checklist

- [ ] Build command está correto: `npx expo export --platform web`
- [ ] Publish directory está correto: `dist`
- [ ] `netlify.toml` está na raiz do projeto
- [ ] Deploy foi bem-sucedido
- [ ] Domínio do Netlify está autorizado no Firebase
- [ ] Firestore rules permitem acesso

---

## 🎯 Próximos Passos

1. ✅ Verificar build settings no Netlify
2. ✅ Verificar se o deploy foi bem-sucedido
3. ✅ Verificar CORS no Firebase
4. ✅ Fazer pagamento REAL de teste (não apenas notificação de teste)

**O problema principal não é o Netlify, mas sim que você precisa fazer um PAGAMENTO REAL de teste, não apenas usar a notificação de teste do painel do Mercado Pago!**

