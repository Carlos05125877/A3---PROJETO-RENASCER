/**
 * Script para ativar assinatura manualmente por email
 * 
 * USO: Execute esta função no console do navegador ou crie um botão temporário
 * para ativar a assinatura de um usuário específico.
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './Api';
import { atualizarAssinatura, Assinatura } from './api.assinatura';

/**
 * Busca o UID do usuário pelo email
 */
async function buscarUserIdPorEmail(email: string): Promise<{ userId: string; colecao: 'users' | 'profissionais' } | null> {
  try {
    console.log('Buscando usuário com email:', email);
    
    // Buscar nas coleções do Firestore
    const usersRef = collection(firestore, 'users');
    const profRef = collection(firestore, 'profissionais');
    
    const usersQuery = query(usersRef, where('email', '==', email));
    const profQuery = query(profRef, where('email', '==', email));
    
    const [usersSnapshot, profSnapshot] = await Promise.all([
      getDocs(usersQuery),
      getDocs(profQuery)
    ]);
    
    if (!usersSnapshot.empty) {
      const doc = usersSnapshot.docs[0];
      console.log('✅ Usuário encontrado na coleção users:', doc.id);
      return { userId: doc.id, colecao: 'users' };
    }
    
    if (!profSnapshot.empty) {
      const doc = profSnapshot.docs[0];
      console.log('✅ Usuário encontrado na coleção profissionais:', doc.id);
      return { userId: doc.id, colecao: 'profissionais' };
    }
    
    console.warn('⚠️ Usuário não encontrado no Firestore com email:', email);
    return null;
  } catch (error: any) {
    console.error('❌ Erro ao buscar usuário:', error);
    throw error;
  }
}

/**
 * Ativa a assinatura manualmente para um usuário pelo email
 */
export async function ativarAssinaturaPorEmail(email: string): Promise<void> {
  try {
    console.log('=== ATIVANDO ASSINATURA MANUALMENTE ===');
    console.log('Email:', email);
    
    // Buscar o usuário
    const resultado = await buscarUserIdPorEmail(email);
    
    if (!resultado) {
      throw new Error(`Usuário com email ${email} não encontrado`);
    }
    
    const { userId, colecao } = resultado;
    console.log('Usuário encontrado:', { userId, colecao });
    
    // Criar assinatura ativa
    const hoje = new Date();
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + 1); // Assinatura mensal
    
    const assinatura: Assinatura = {
      isAssinante: true,
      dataInicio: hoje.toISOString(),
      dataFim: dataFim.toISOString(),
      tipoAssinatura: colecao === 'profissionais' ? 'profissional' : 'usuario',
      status: 'approved',
      paymentId: 'manual_activation'
    };
    
    console.log('Ativando assinatura:', assinatura);
    
    // Atualizar assinatura
    await atualizarAssinatura(userId, assinatura, colecao);
    
    console.log('✅ Assinatura ativada com sucesso!');
    console.log('Usuário:', email);
    console.log('UserId:', userId);
    console.log('Coleção:', colecao);
    
    // Verificar se foi ativada corretamente
    const { verificarAssinatura } = await import('./api.assinatura');
    const verificado = await verificarAssinatura(userId);
    
    if (verificado) {
      console.log('✅ Verificação: Assinatura está ativa!');
    } else {
      console.warn('⚠️ Verificação: Assinatura pode não estar ativa. Verifique manualmente.');
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao ativar assinatura:', error);
    throw error;
  }
}

// Expor função globalmente para uso no console do navegador
if (typeof window !== 'undefined') {
  (window as any).ativarAssinaturaPorEmail = ativarAssinaturaPorEmail;
  console.log('✅ Função ativarAssinaturaPorEmail disponível globalmente');
  console.log('💡 Use: ativarAssinaturaPorEmail("email@exemplo.com")');
  
  // Executar automaticamente para o email especificado quando o módulo for importado
  // Isso será executado quando a página /screens/ativarAssinatura for carregada
}

