# Instruções para Adicionar Usuários Manualmente no Firestore

## Problema
Alguns usuários foram criados no Firebase Auth, mas não foram criados no Firestore. Isso pode acontecer se houver um erro durante o processo de cadastro.

## Usuários que precisam ser adicionados:
1. jean.marqes@gmail.com
2. anajuliagarcia2222@gmail.com
3. gootavio41@gmail.com

## Como obter o UID de cada usuário:

### Opção 1: Firebase Console (Recomendado)
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Authentication** > **Users**
4. Procure pelo email do usuário
5. Clique no usuário para ver os detalhes
6. O **UID** estará visível no topo da página

### Opção 2: Console do Navegador (quando o usuário está logado)
Se o usuário fizer login no sistema, você pode obter o UID no console:
```javascript
// No console do navegador, após o usuário fazer login:
import { auth } from './back-end/Api';
console.log(auth.currentUser?.uid);
```

## Como adicionar os usuários:

### Método 1: Console do Navegador (Recomendado)

1. Abra o console do navegador (F12)
2. Certifique-se de que o módulo foi carregado (as funções estarão disponíveis automaticamente)
3. Execute o seguinte código para cada usuário:

```javascript
// Exemplo para jean.marqes@gmail.com
adicionarUsuarioManual({
  email: 'jean.marqes@gmail.com',
  uid: 'UID_AQUI', // Substitua pelo UID real do Firebase Console
  nome: 'Jean Marques', // Opcional
  colecao: 'users'
});

// Exemplo para anajuliagarcia2222@gmail.com
adicionarUsuarioManual({
  email: 'anajuliagarcia2222@gmail.com',
  uid: 'UID_AQUI', // Substitua pelo UID real
  nome: 'Ana Julia Garcia', // Opcional
  colecao: 'users'
});

// Exemplo para gootavio41@gmail.com
adicionarUsuarioManual({
  email: 'gootavio41@gmail.com',
  uid: 'UID_AQUI', // Substitua pelo UID real
  nome: 'Gustavo', // Opcional
  colecao: 'users'
});
```

### Método 2: Adicionar todos de uma vez

```javascript
adicionarUsuariosEmLote([
  {
    email: 'jean.marqes@gmail.com',
    uid: 'UID_JEAN',
    nome: 'Jean Marques',
    colecao: 'users'
  },
  {
    email: 'anajuliagarcia2222@gmail.com',
    uid: 'UID_ANA',
    nome: 'Ana Julia Garcia',
    colecao: 'users'
  },
  {
    email: 'gootavio41@gmail.com',
    uid: 'UID_GUSTAVO',
    nome: 'Gustavo',
    colecao: 'users'
  }
]);
```

### Método 3: Se o usuário estiver logado

Se o usuário fizer login no sistema, você pode usar a função que adiciona o usuário atual:

```javascript
// O usuário precisa estar logado
adicionarUsuarioAtual({
  nome: 'Nome do Usuário', // Opcional
  colecao: 'users'
});
```

## Verificação

Após adicionar, verifique no Firebase Console:
1. Vá em **Firestore Database**
2. Verifique a coleção `users`
3. Procure pelo UID do usuário
4. Confirme que o documento foi criado com os dados corretos

## Notas Importantes

- O UID é obrigatório e deve ser obtido do Firebase Console
- O campo `colecao` deve ser `'users'` para usuários comuns ou `'profissionais'` para profissionais
- Campos opcionais: `nome`, `cpf`, `telefone`, `dataNascimento`
- Para profissionais, também pode incluir: `crp`, `biografia`, `horariosAtendimento`

