/**
 * Script para adicionar usuários manualmente no Firestore
 * 
 * USO: Execute esta função no console do navegador
 * 
 * Exemplo:
 * adicionarUsuarioManual({
 *   email: 'jean.marqes@gmail.com',
 *   uid: 'UID_DO_USUARIO_AQUI',
 *   nome: 'Jean Marques',
 *   colecao: 'users' // ou 'profissionais'
 * })
 */

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore, auth } from './Api';

interface DadosUsuario {
  email: string;
  uid: string;
  nome?: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  colecao: 'users' | 'profissionais';
  crp?: string; // Apenas para profissionais
  biografia?: string; // Apenas para profissionais
  horariosAtendimento?: string[]; // Apenas para profissionais
}

/**
 * Adiciona um usuário manualmente no Firestore
 */
export async function adicionarUsuarioManual(dados: DadosUsuario): Promise<void> {
  try {
    console.log('=== ADICIONANDO USUÁRIO MANUALMENTE ===');
    console.log('Email:', dados.email);
    console.log('UID:', dados.uid);
    console.log('Coleção:', dados.colecao);

    // Verificar se o documento já existe
    const docRef = doc(firestore, dados.colecao, dados.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.warn('⚠️ Usuário já existe no Firestore! Atualizando dados...');
    }

    // Preparar dados do usuário
    const dadosUsuario: Record<string, any> = {
      email: dados.email,
      criadoEm: new Date().toLocaleString('pt-BR'),
    };

    // Adicionar campos opcionais
    if (dados.nome) dadosUsuario.nome = dados.nome;
    if (dados.cpf) dadosUsuario.cpf = dados.cpf;
    if (dados.telefone) dadosUsuario.telefone = dados.telefone;
    if (dados.dataNascimento) dadosUsuario.dataNascimento = dados.dataNascimento;

    // Campos específicos para profissionais
    if (dados.colecao === 'profissionais') {
      if (dados.crp) dadosUsuario.crp = dados.crp;
      if (dados.biografia) dadosUsuario.biografia = dados.biografia;
      dadosUsuario.horariosAtendimento = dados.horariosAtendimento || [];
    }

    // Criar/atualizar documento no Firestore
    await setDoc(docRef, dadosUsuario, { merge: true });

    console.log('✅ Usuário adicionado/atualizado com sucesso!');
    console.log('Dados salvos:', dadosUsuario);

    // Verificar se foi salvo corretamente
    const verificarDoc = await getDoc(docRef);
    if (verificarDoc.exists()) {
      console.log('✅ Verificação: Documento existe no Firestore');
      console.log('Dados verificados:', verificarDoc.data());
    } else {
      console.error('❌ Erro: Documento não foi criado corretamente');
    }

  } catch (error: any) {
    console.error('❌ Erro ao adicionar usuário:', error);
    throw error;
  }
}

/**
 * Adiciona o usuário atual autenticado no Firestore
 * Útil quando o usuário está logado mas não tem documento no Firestore
 */
export async function adicionarUsuarioAtual(dadosAdicionais?: Partial<DadosUsuario>): Promise<void> {
  try {
    const usuarioAtual = auth.currentUser;
    
    if (!usuarioAtual) {
      throw new Error('Nenhum usuário autenticado. Faça login primeiro.');
    }

    if (!usuarioAtual.email) {
      throw new Error('Usuário não possui email.');
    }

    console.log('=== ADICIONANDO USUÁRIO ATUAL AUTENTICADO ===');
    console.log('Email:', usuarioAtual.email);
    console.log('UID:', usuarioAtual.uid);

    // Determinar coleção (padrão: 'users')
    const colecao = dadosAdicionais?.colecao || 'users';

    await adicionarUsuarioManual({
      email: usuarioAtual.email,
      uid: usuarioAtual.uid,
      nome: dadosAdicionais?.nome || usuarioAtual.displayName || undefined,
      colecao,
      ...dadosAdicionais
    });

  } catch (error: any) {
    console.error('❌ Erro ao adicionar usuário atual:', error);
    throw error;
  }
}

/**
 * Adiciona múltiplos usuários de uma vez
 */
export async function adicionarUsuariosEmLote(usuarios: DadosUsuario[]): Promise<void> {
  console.log(`=== ADICIONANDO ${usuarios.length} USUÁRIOS ===`);
  
  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];
    console.log(`\n[${i + 1}/${usuarios.length}] Processando: ${usuario.email}`);
    
    try {
      await adicionarUsuarioManual(usuario);
      console.log(`✅ ${usuario.email} adicionado com sucesso`);
    } catch (error: any) {
      console.error(`❌ Erro ao adicionar ${usuario.email}:`, error.message);
    }
  }
  
  console.log('\n=== PROCESSAMENTO CONCLUÍDO ===');
}

// Expor funções globalmente para uso no console do navegador
if (typeof window !== 'undefined') {
  (window as any).adicionarUsuarioManual = adicionarUsuarioManual;
  (window as any).adicionarUsuariosEmLote = adicionarUsuariosEmLote;
  (window as any).adicionarUsuarioAtual = adicionarUsuarioAtual;
  console.log('✅ Funções disponíveis globalmente:');
  console.log('   - adicionarUsuarioManual(dados)');
  console.log('   - adicionarUsuariosEmLote([dados1, dados2, ...])');
  console.log('   - adicionarUsuarioAtual(dadosAdicionais?)');
  console.log('\n💡 Exemplo de uso:');
  console.log('   // Para adicionar usuário específico (precisa do UID):');
  console.log('   adicionarUsuarioManual({');
  console.log('     email: "usuario@exemplo.com",');
  console.log('     uid: "UID_DO_USUARIO",');
  console.log('     nome: "Nome do Usuário",');
  console.log('     colecao: "users"');
  console.log('   })');
  console.log('\n   // Para adicionar usuário atual autenticado:');
  console.log('   adicionarUsuarioAtual({ nome: "Nome", colecao: "users" })');
}

