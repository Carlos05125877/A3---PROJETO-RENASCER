# 🔧 Solução: Erro "Unmatched Route" no Netlify

## 🐛 Problema

Após realizar o pagamento, o Netlify retorna erro "Unmatched Route" ao tentar acessar `/screens/pagamentosucesso`.

## ✅ Solução

O Netlify precisa de configuração para funcionar como SPA (Single Page Application) com Expo Router.

### Arquivos Criados:

1. **`netlify.toml`** - Configuração do Netlify
2. **`public/_redirects`** - Redirecionamentos para SPA

---

## 📝 Configuração no Netlify

### 1. Verificar Build Settings no Netlify

1. Acesse: https://app.netlify.com
2. Vá no seu site: **renascerpsi**
3. Vá em **Site settings** > **Build & deploy**
4. Configure:

**Build command:**
```
npx expo export:web
```

**Publish directory:**
```
web-build
```

### 2. Verificar se os Arquivos Estão no Repositório

Os arquivos `netlify.toml` e `public/_redirects` devem estar commitados.

### 3. Fazer Deploy

1. Faça commit e push dos arquivos
2. O Netlify fará deploy automático
3. Aguarde alguns minutos

---

## 🔍 Verificar se Funcionou

Após o deploy, teste:

1. Acesse: `https://renascerpsi.netlify.app/screens/pagamentoSucesso`
   - Deve carregar a tela (não mais erro 404)

2. Faça um pagamento de teste
   - Após o pagamento, deve redirecionar corretamente
   - Não deve mais aparecer "Unmatched Route"

---

## ⚠️ Importante: Case Sensitivity

O arquivo é `pagamentoSucesso.tsx` (com 'S' maiúsculo), então a rota deve ser:
- ✅ `/screens/pagamentoSucesso` (correto)
- ❌ `/screens/pagamentosucesso` (errado - pode não funcionar)

O Mercado Pago pode estar redirecionando com minúsculas. Vamos verificar e corrigir se necessário.

---

## 🔄 Se Ainda Não Funcionar

1. **Verifique os logs do Netlify:**
   - Vá em **Deployments** > Deploy mais recente > **Deploy log**
   - Procure por erros

2. **Verifique se o build está gerando os arquivos:**
   - O diretório `web-build` deve ser criado após o build

3. **Teste localmente:**
   ```bash
   npx expo export:web
   ```
   - Deve gerar o diretório `web-build`

---

**Após fazer commit e push, o Netlify deve fazer deploy e as rotas devem funcionar!**

