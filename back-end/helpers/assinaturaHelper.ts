/**
 * Funções auxiliares para gerenciar assinaturas no Firebase
 * Use estas funções para configurar assinaturas manualmente para testes
 */

import { buscarDadosFirestore } from '../Api';
import { Assinatura, atualizarAssinatura } from '../api.assinatura';

/**
 * Configura uma assinatura manualmente para um usuário (útil para testes)
 * 
 * @param userId ID do usuário no Firebase Auth
 * @param tipoAssinatura Tipo de assinatura: 'usuario' ou 'profissional'
 * @param ativar Se true, ativa a assinatura. Se false, desativa.
 * @param mesesDuracao Número de meses de duração (padrão: 1 mês)
 */
export const configurarAssinaturaManual = async (
  userId: string,
  tipoAssinatura: 'usuario' | 'profissional',
  ativar: boolean = true,
  mesesDuracao: number = 1
): Promise<void> => {
  try {
    console.log('=== CONFIGURANDO ASSINATURA MANUAL ===');
    console.log('UserId:', userId);
    console.log('Tipo:', tipoAssinatura);
    console.log('Ativar:', ativar);
    console.log('Duração:', mesesDuracao, 'meses');

    const hoje = new Date();
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + mesesDuracao);

    const assinatura: Assinatura = {
      isAssinante: ativar,
      dataInicio: hoje.toISOString(),
      dataFim: dataFim.toISOString(),
      tipoAssinatura,
      paymentId: `manual-${Date.now()}`,
      status: ativar ? 'approved' : 'cancelled'
    };

    const colecao = tipoAssinatura === 'profissional' ? 'profissionais' : 'users';
    
    await atualizarAssinatura(userId, assinatura, colecao);
    
    console.log('✅ Assinatura configurada com sucesso!');
    console.log('Dados:', assinatura);
  } catch (error: any) {
    console.error('❌ Erro ao configurar assinatura:', error);
    throw error;
  }
};

/**
 * Remove a assinatura de um usuário
 * 
 * @param userId ID do usuário no Firebase Auth
 */
export const removerAssinatura = async (userId: string): Promise<void> => {
  try {
    console.log('=== REMOVENDO ASSINATURA ===');
    console.log('UserId:', userId);

    // Determinar a coleção
    const dadosUsuario = await buscarDadosFirestore(userId);
    const colecao = dadosUsuario && 'crp' in dadosUsuario ? 'profissionais' : 'users';

    // Obter dados atuais da assinatura para preservar informações
    const assinaturaAtual = dadosUsuario?.assinatura || {};
    
    // Criar nova assinatura mantendo dados existentes mas desativando
    const assinatura: Assinatura = {
      ...assinaturaAtual, // Preservar dados existentes
      isAssinante: false,
      status: 'cancelled',
      tipoAssinatura: colecao === 'profissionais' ? 'profissional' : 'usuario',
      atualizadoEm: new Date().toISOString()
    };

    console.log('Assinatura a ser salva (removida):', assinatura);

    await atualizarAssinatura(userId, assinatura, colecao);
    
    console.log('✅ Assinatura removida com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao remover assinatura:', error);
    console.error('Detalhes do erro:', error.message, error.code);
    throw error;
  }
};

/**
 * Estende a assinatura de um usuário por mais meses
 * 
 * @param userId ID do usuário no Firebase Auth
 * @param mesesAdicionais Número de meses a adicionar
 */
export const estenderAssinatura = async (
  userId: string,
  mesesAdicionais: number
): Promise<void> => {
  try {
    console.log('=== ESTENDENDO ASSINATURA ===');
    console.log('UserId:', userId);
    console.log('Meses adicionais:', mesesAdicionais);

    // Buscar dados atuais
    const dadosUsuario = await buscarDadosFirestore(userId);
    const colecao = dadosUsuario && 'crp' in dadosUsuario ? 'profissionais' : 'users';
    
    if (!dadosUsuario?.assinatura) {
      throw new Error('Usuário não possui assinatura para estender');
    }

    const assinaturaAtual = dadosUsuario.assinatura;
    const dataFimAtual = assinaturaAtual.dataFim 
      ? new Date(assinaturaAtual.dataFim)
      : new Date();
    
    const novaDataFim = new Date(dataFimAtual);
    novaDataFim.setMonth(novaDataFim.getMonth() + mesesAdicionais);

    const assinatura: Assinatura = {
      ...assinaturaAtual,
      dataFim: novaDataFim.toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    await atualizarAssinatura(userId, assinatura, colecao);
    
    console.log('✅ Assinatura estendida com sucesso!');
    console.log('Nova data de término:', novaDataFim.toISOString());
  } catch (error: any) {
    console.error('❌ Erro ao estender assinatura:', error);
    throw error;
  }
};

/**
 * Obtém informações detalhadas da assinatura de um usuário
 * 
 * @param userId ID do usuário no Firebase Auth
 * @returns Informações da assinatura ou null se não existir
 */
export const obterInfoAssinatura = async (userId: string): Promise<Assinatura | null> => {
  try {
    const dadosUsuario = await buscarDadosFirestore(userId);
    return dadosUsuario?.assinatura || null;
  } catch (error: any) {
    console.error('❌ Erro ao obter informações da assinatura:', error);
    return null;
  }
};

/**
 * Simula o processamento de um callback de pagamento (útil para testes)
 * Esta função simula o que acontece quando o Mercado Pago retorna após o pagamento
 * 
 * @param userId ID do usuário no Firebase Auth
 * @param tipoAssinatura Tipo de assinatura: 'usuario' ou 'profissional'
 * @param status Status do pagamento: 'approved', 'pending', 'rejected', 'cancelled'
 */
export const simularCallbackPagamento = async (
  userId: string,
  tipoAssinatura: 'usuario' | 'profissional',
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' = 'approved'
): Promise<void> => {
  try {
    console.log('=== SIMULANDO CALLBACK DE PAGAMENTO ===');
    console.log('UserId:', userId);
    console.log('Tipo:', tipoAssinatura);
    console.log('Status:', status);

    // Importar a função de processamento
    const { processarCallbackPagamento } = await import('../api.assinatura');
    
    // Simular um payment ID
    const paymentId = `MP-TEST-${Date.now()}`;
    
    // Processar como se fosse um callback real
    await processarCallbackPagamento(paymentId, status, userId, tipoAssinatura);
    
    console.log('✅ Simulação de callback concluída com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao simular callback:', error);
    throw error;
  }
};

/**
 * Verifica se o fluxo de pagamento está funcionando corretamente
 * Executa uma série de verificações para garantir que tudo está configurado
 * 
 * @param userId ID do usuário no Firebase Auth
 * @returns Objeto com o resultado das verificações
 */
export const verificarFluxoPagamento = async (userId: string): Promise<{
  sucesso: boolean;
  verificacoes: Array<{ nome: string; status: boolean; mensagem: string }>;
}> => {
  const verificacoes: Array<{ nome: string; status: boolean; mensagem: string }> = [];
  
  try {
    // Verificação 1: Usuário existe
    const dadosUsuario = await buscarDadosFirestore(userId);
    verificacoes.push({
      nome: 'Usuário existe no Firestore',
      status: !!dadosUsuario,
      mensagem: dadosUsuario ? 'Usuário encontrado' : 'Usuário não encontrado'
    });

    // Verificação 2: Estrutura de dados
    if (dadosUsuario) {
      const temAssinatura = !!dadosUsuario.assinatura;
      verificacoes.push({
        nome: 'Campo assinatura existe',
        status: temAssinatura,
        mensagem: temAssinatura ? 'Campo assinatura encontrado' : 'Campo assinatura não encontrado'
      });

      if (temAssinatura) {
        const assinatura = dadosUsuario.assinatura;
        verificacoes.push({
          nome: 'isAssinante está definido',
          status: assinatura.isAssinante !== undefined,
          mensagem: assinatura.isAssinante !== undefined 
            ? `isAssinante: ${assinatura.isAssinante}` 
            : 'Campo isAssinante não definido'
        });

        verificacoes.push({
          nome: 'status está definido',
          status: !!assinatura.status,
          mensagem: assinatura.status 
            ? `status: ${assinatura.status}` 
            : 'Campo status não definido'
        });

        if (assinatura.dataFim) {
          const dataFim = new Date(assinatura.dataFim);
          const hoje = new Date();
          const dataValida = dataFim >= hoje;
          verificacoes.push({
            nome: 'dataFim é válida (futura)',
            status: dataValida,
            mensagem: dataValida 
              ? `Data válida: ${dataFim.toLocaleDateString('pt-BR')}` 
              : `Data expirada: ${dataFim.toLocaleDateString('pt-BR')}`
          });
        }
      }
    }

    // Verificação 3: Função de verificação funciona
    const { verificarAssinatura } = await import('../api.assinatura');
    const isAssinante = await verificarAssinatura(userId);
    verificacoes.push({
      nome: 'Função verificarAssinatura funciona',
      status: true,
      mensagem: `Retornou: ${isAssinante ? 'Assinante' : 'Não assinante'}`
    });

    const todasPassaram = verificacoes.every(v => v.status);
    
    return {
      sucesso: todasPassaram,
      verificacoes
    };
  } catch (error: any) {
    verificacoes.push({
      nome: 'Erro na verificação',
      status: false,
      mensagem: error.message || 'Erro desconhecido'
    });
    
    return {
      sucesso: false,
      verificacoes
    };
  }
};

