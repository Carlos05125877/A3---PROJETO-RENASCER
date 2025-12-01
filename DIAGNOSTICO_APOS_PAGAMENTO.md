# 🔍 Diagnóstico: Site Não Encontra Assinatura Após Pagamento

## 🐛 Problema

Após realizar o pagamento no Mercado Pago, o site não encontra a assinatura.

## ✅ Melhorias Implementadas

1. **Logs detalhados** - Agora o console mostra exatamente o que está acontecendo
2. **Fallback para localStorage** - Se não encontrar parâmetros na URL, busca no localStorage
3. **Busca melhorada** - Tenta buscar por `external_reference` e `preference_id`

---

## 🔍 Como Diagnosticar

### 1. Abrir Console do Navegador

1. Após fazer o pagamento, abra o **Console do Desenvolvedor** (F12)
2. Vá na aba **Console**
3. Procure por mensagens que começam com:
   - `=== DIAGNÓSTICO DE PARÂMETROS ===`
   - `🔍 === BUSCA DE PAGAMENTO ===`
   - `✅ Pagamento encontrado` ou `⏳ Nenhum pagamento encontrado`

### 2. Verificar Parâmetros da URL

O console mostrará algo como:

```
=== DIAGNÓSTICO DE PARÂMETROS ===
URL completa: https://renascerpsi.netlify.app/screens/pagamentoSucesso?...
Query string: ?status=waiting&user_id=...
Parâmetros da URL: {
  payment_id: "NÃO ENCONTRADO" ou "13593620099",
  collection_id: "NÃO ENCONTRADO" ou "...",
  preference_id: "NÃO ENCONTRADO" ou "...",
  external_reference: "NÃO ENCONTRADO" ou "...",
  ...
}
```

**O que verificar:**
- ✅ Se `external_reference` ou `preference_id` aparecem na URL
- ✅ Se aparecem no localStorage (fallback)
- ✅ Se a busca está sendo executada

### 3. Verificar Busca de Pagamento

O console mostrará:

```
🔍 === BUSCA DE PAGAMENTO - TENTATIVA 1/120 ===
[1/2] Buscando pagamento via API usando external_reference: ...
✅ Pagamento encontrado via external_reference! { id: ..., status: ... }
```

**O que verificar:**
- ✅ Se a busca está sendo executada
- ✅ Se encontra o pagamento
- ✅ Qual o status do pagamento encontrado

---

## 🎯 Possíveis Problemas e Soluções

### Problema 1: Parâmetros Não Aparecem na URL

**Sintoma:**
```
external_reference: "NÃO ENCONTRADO"
preference_id: "NÃO ENCONTRADO"
```

**Causa:** O Mercado Pago pode não estar retornando os parâmetros na URL de retorno.

**Solução:**
1. Verificar se o `external_reference` foi salvo no localStorage
2. O código agora busca automaticamente do localStorage como fallback
3. Verificar se o `back_urls` está configurado corretamente na criação da preferência

### Problema 2: Busca Não Encontra Pagamento

**Sintoma:**
```
⏳ Nenhum pagamento encontrado com este external_reference ainda
```

**Causa:** O pagamento pode ainda não ter sido processado pelo Mercado Pago.

**Solução:**
1. Aguardar alguns segundos (o código verifica a cada 3 segundos)
2. Verificar se o pagamento foi realmente aprovado no painel do Mercado Pago
3. Verificar se o `external_reference` está correto

### Problema 3: Pagamento Encontrado Mas Status Não É "approved"

**Sintoma:**
```
✅ Pagamento encontrado via external_reference! { status: "pending" }
```

**Causa:** O pagamento ainda está sendo processado.

**Solução:**
1. Aguardar - o código continuará verificando
2. Alguns métodos de pagamento demoram mais (boleto, PIX)

### Problema 4: Erro na Busca

**Sintoma:**
```
⚠️ Erro ao buscar por external_reference: ...
```

**Causa:** Problema com a API do Mercado Pago ou Access Token.

**Solução:**
1. Verificar se o Access Token está correto
2. Verificar se a API do Mercado Pago está funcionando
3. Verificar se não há bloqueios de CORS

---

## 📋 Checklist de Verificação

Após fazer um pagamento de teste, verifique:

- [ ] Console mostra `=== DIAGNÓSTICO DE PARÂMETROS ===`
- [ ] `external_reference` ou `preference_id` aparecem (na URL ou localStorage)
- [ ] Console mostra `🔍 === BUSCA DE PAGAMENTO ===`
- [ ] Busca está sendo executada (não mostra erro)
- [ ] Pagamento é encontrado (mostra `✅ Pagamento encontrado`)
- [ ] Status do pagamento é `approved` ou `authorized`
- [ ] Assinatura é ativada no Firestore
- [ ] Tela de sucesso aparece

---

## 🔧 Próximos Passos

1. **Fazer um pagamento de teste** usando o cartão de teste do Mercado Pago
2. **Abrir o console** e verificar os logs
3. **Copiar os logs** e me enviar para análise
4. **Verificar no painel do Mercado Pago** se o pagamento foi processado

---

## 📝 Exemplo de Logs Esperados (Sucesso)

```
=== DIAGNÓSTICO DE PARÂMETROS ===
URL completa: https://renascerpsi.netlify.app/screens/pagamentoSucesso?status=waiting&user_id=abc123
Parâmetros da URL: {
  external_reference: "abc123_usuario_1234567890",
  preference_id: "1234567890-abc123-def456",
  ...
}
Dados finais que serão usados: {
  userId: "abc123",
  externalReference: "abc123_usuario_1234567890",
  preferenceId: "1234567890-abc123-def456"
}

🔍 === BUSCA DE PAGAMENTO - TENTATIVA 1/120 ===
[1/2] Buscando pagamento via API usando external_reference: abc123_usuario_1234567890
✅ Pagamento encontrado via external_reference! {
  id: "13593620099",
  status: "approved",
  external_reference: "abc123_usuario_1234567890"
}

✅ Pagamento aprovado detectado via API! Processando...
✅ Assinatura processada com sucesso!
```

---

## ⚠️ Importante

- Os logs agora são **muito mais detalhados** - use-os para diagnosticar
- O código tenta buscar do **localStorage** se não encontrar na URL
- A busca é feita **a cada 3 segundos** por até 10 minutos
- O webhook também processa o pagamento (verificação paralela)

