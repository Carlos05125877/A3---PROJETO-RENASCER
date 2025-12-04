/**
 * EXEMPLO: Script para adicionar os 3 usuários que estão no Auth mas não no Firestore
 * 
 * INSTRUÇÕES:
 * 1. Obtenha os UIDs de cada usuário no Firebase Console (Authentication > Users)
 * 2. Substitua os valores 'UID_AQUI' pelos UIDs reais
 * 3. Execute este script no console do navegador ou importe em uma página temporária
 */

import { adicionarUsuariosEmLote } from './adicionarUsuarioManual';

// Dados dos usuários que precisam ser adicionados
const usuariosParaAdicionar = [
  {
    email: 'jean.marqes@gmail.com',
    uid: 'UID_AQUI', // ⚠️ SUBSTITUA pelo UID real do Firebase Console
    nome: 'Jean Marques', // Opcional
    colecao: 'users' as const
  },
  {
    email: 'anajuliagarcia2222@gmail.com',
    uid: 'UID_AQUI', // ⚠️ SUBSTITUA pelo UID real do Firebase Console
    nome: 'Ana Julia Garcia', // Opcional
    colecao: 'users' as const
  },
  {
    email: 'gootavio41@gmail.com',
    uid: 'UID_AQUI', // ⚠️ SUBSTITUA pelo UID real do Firebase Console
    nome: 'Gustavo', // Opcional
    colecao: 'users' as const
  }
];

/**
 * Função para executar a adição dos usuários
 * Execute: adicionarUsuariosFaltantes()
 */
export async function adicionarUsuariosFaltantes() {
  console.log('⚠️ ATENÇÃO: Certifique-se de ter substituído os UIDs no arquivo antes de executar!');
  console.log('📋 Usuários a serem adicionados:', usuariosParaAdicionar.map(u => u.email));
  
  // Verificar se os UIDs foram substituídos
  const uidsNaoSubstituidos = usuariosParaAdicionar.filter(u => u.uid === 'UID_AQUI');
  if (uidsNaoSubstituidos.length > 0) {
    console.error('❌ ERRO: Você precisa substituir os UIDs antes de executar!');
    console.error('Usuários sem UID:', uidsNaoSubstituidos.map(u => u.email));
    console.log('\n💡 Como obter os UIDs:');
    console.log('1. Acesse https://console.firebase.google.com/');
    console.log('2. Vá em Authentication > Users');
    console.log('3. Procure pelo email de cada usuário');
    console.log('4. Clique no usuário para ver o UID');
    return;
  }

  try {
    await adicionarUsuariosEmLote(usuariosParaAdicionar);
    console.log('✅ Todos os usuários foram adicionados com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao adicionar usuários:', error);
  }
}

// Expor globalmente se estiver no navegador
if (typeof window !== 'undefined') {
  (window as any).adicionarUsuariosFaltantes = adicionarUsuariosFaltantes;
  console.log('✅ Função disponível: adicionarUsuariosFaltantes()');
  console.log('⚠️ Lembre-se de substituir os UIDs no código antes de executar!');
}

