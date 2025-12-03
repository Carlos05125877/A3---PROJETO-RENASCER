/**
 * API para integração com Mercado Pago
 * 
 * IMPORTANTE: Para produção, estas funções devem ser executadas em um backend seguro
 * para proteger suas credenciais (Access Token). Este arquivo é apenas uma estrutura
 * que deve ser adaptada para seu backend.
 */

import { MERCADO_PAGO_ACCESS_TOKEN } from './mercadoPagoConfig';

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * 
 * @param valor Valor em reais (ex: 9.00 para R$9,00)
 * @param descricao Descrição do produto/serviço
 * @param userId ID do usuário
 * @param tipoAssinatura Tipo de assinatura ('usuario' ou 'profissional')
 * @returns URL de checkout do Mercado Pago
 */
export const criarPreferenciaPagamento = async (
  valor: number,
  descricao: string,
  userId: string,
  tipoAssinatura: 'usuario' | 'profissional'
): Promise<string> => {
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: descricao,
            quantity: 1,
            unit_price: valor,
            currency_id: 'BRL'
          }
        ],
        payer: {
          email: '', // Será preenchido pelo usuário no checkout
        },
        back_urls: {
          success: `${window.location.origin}/pagamento/sucesso?user_id=${userId}&tipo=${tipoAssinatura}`,
          failure: `${window.location.origin}/pagamento/falha?user_id=${userId}&tipo=${tipoAssinatura}`,
          pending: `${window.location.origin}/pagamento/pendente?user_id=${userId}&tipo=${tipoAssinatura}`
        },
        auto_return: 'approved',
        external_reference: `${userId}_${tipoAssinatura}_${Date.now()}`,
        notification_url: `${window.location.origin}/api/webhook/mercado-pago`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar preferência de pagamento');
    }

    const data = await response.json();
    
    // Retorna a URL de checkout
    // Em produção, use data.init_point
    // Em sandbox, use data.sandbox_init_point
    return data.init_point || data.sandbox_init_point || '';
  } catch (error: any) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
};

/**
 * Verifica o status de um pagamento
 */
export const verificarStatusPagamento = async (paymentId: string): Promise<any> => {
  try {
    // Importar Access Token do arquivo de configuração
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN.trim() === '') {
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    console.log('Verificando status do pagamento:', paymentId);
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta da API:', response.status, errorData);
      throw new Error(`Erro ao verificar status do pagamento: ${errorData.message || response.statusText}`);
    }

    const paymentData = await response.json();
    console.log('Status do pagamento verificado:', paymentData.status || paymentData.collection_status);
    
    return paymentData;
  } catch (error: any) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
};

/**
 * Busca pagamentos por external_reference (referência externa)
 * Útil para verificar pagamentos quando não recebemos os parâmetros na URL
 */
export const buscarPagamentoPorReferencia = async (externalReference: string): Promise<any> => {
  try {
    // Importar Access Token do arquivo de configuração
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN.trim() === '') {
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    console.log('Buscando pagamento por external_reference:', externalReference);
    
    // Buscar pagamentos usando a API de search
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(externalReference)}&sort=date_created&criteria=desc`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta da API:', response.status, errorData);
      throw new Error(`Erro ao buscar pagamento: ${errorData.message || response.statusText}`);
    }

    const searchData = await response.json();
    console.log('Resultado da busca:', searchData);
    
    // Retornar o primeiro resultado se houver
    if (searchData.results && searchData.results.length > 0) {
      const payment = searchData.results[0];
      console.log('Pagamento encontrado:', {
        id: payment.id,
        status: payment.status,
        external_reference: payment.external_reference
      });
      return payment;
    }
    
    return null;
  } catch (error: any) {
    console.error('Erro ao buscar pagamento por referência:', error);
    throw error;
  }
};

/**
 * Busca pagamentos por preference_id
 */
export const buscarPagamentoPorPreferencia = async (preferenceId: string): Promise<any> => {
  try {
    // Importar Access Token do arquivo de configuração
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN.trim() === '') {
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    console.log('Buscando pagamento por preference_id:', preferenceId);
    
    // Buscar pagamentos relacionados à preferência
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?preference_id=${encodeURIComponent(preferenceId)}&sort=date_created&criteria=desc`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta da API:', response.status, errorData);
      throw new Error(`Erro ao buscar pagamento: ${errorData.message || response.statusText}`);
    }

    const searchData = await response.json();
    console.log('Resultado da busca por preferência:', searchData);
    
    // Retornar o primeiro resultado se houver
    if (searchData.results && searchData.results.length > 0) {
      const payment = searchData.results[0];
      console.log('Pagamento encontrado:', {
        id: payment.id,
        status: payment.status,
        preference_id: payment.preference_id
      });
      return payment;
    }
    
    return null;
  } catch (error: any) {
    console.error('Erro ao buscar pagamento por preferência:', error);
    throw error;
  }
};

/**
 * Verifica TODOS os pagamentos recentes de uma preferência
 * Útil para diagnóstico - mostra todos os pagamentos relacionados
 */
export const verificarTodosPagamentosPreferencia = async (preferenceId: string): Promise<any[]> => {
  try {
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN.trim() === '') {
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    console.log('🔍 Verificando TODOS os pagamentos da preferência:', preferenceId);
    
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?preference_id=${encodeURIComponent(preferenceId)}&sort=date_created&criteria=desc&limit=50`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro ao buscar pagamentos: ${errorData.message || response.statusText}`);
    }

    const searchData = await response.json();
    console.log('📊 Total de pagamentos encontrados:', searchData.paging?.total || 0);
    console.log('📋 Lista completa de pagamentos:', searchData.results);
    
    return searchData.results || [];
  } catch (error: any) {
    console.error('Erro ao verificar pagamentos da preferência:', error);
    throw error;
  }
};

/**
 * Verifica TODOS os pagamentos recentes por external_reference
 * Útil para diagnóstico - mostra todos os pagamentos com a mesma referência
 */
export const verificarTodosPagamentosReferencia = async (externalReference: string): Promise<any[]> => {
  try {
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN.trim() === '') {
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    console.log('🔍 Verificando TODOS os pagamentos com external_reference:', externalReference);
    
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(externalReference)}&sort=date_created&criteria=desc&limit=50`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro ao buscar pagamentos: ${errorData.message || response.statusText}`);
    }

    const searchData = await response.json();
    console.log('📊 Total de pagamentos encontrados:', searchData.paging?.total || 0);
    console.log('📋 Lista completa de pagamentos:', searchData.results);
    
    return searchData.results || [];
  } catch (error: any) {
    console.error('Erro ao verificar pagamentos por referência:', error);
    throw error;
  }
};

/**
 * Diagnóstico completo: Verifica se o Mercado Pago está enviando confirmações
 * 
 * @param preferenceId ID da preferência de pagamento
 * @param externalReference Referência externa do pagamento
 * @returns Relatório completo de diagnóstico
 */
export const diagnosticarConfirmacaoPagamento = async (
  preferenceId?: string,
  externalReference?: string
): Promise<{
  sucesso: boolean;
  mensagem: string;
  dados: {
    preferenceId?: string;
    externalReference?: string;
    pagamentosEncontrados: number;
    pagamentos: any[];
    pagamentoAprovado?: any;
    ultimoPagamento?: any;
  };
}> => {
  try {
    console.log('🔬 === INICIANDO DIAGNÓSTICO DE CONFIRMAÇÃO DO MERCADO PAGO ===');
    console.log('Parâmetros:', { preferenceId, externalReference });
    
    let todosPagamentos: any[] = [];
    
    // Buscar por preference_id se disponível
    if (preferenceId) {
      console.log('🔍 Buscando pagamentos por preference_id...');
      const pagamentosPreferencia = await verificarTodosPagamentosPreferencia(preferenceId);
      todosPagamentos = [...todosPagamentos, ...pagamentosPreferencia];
    }
    
    // Buscar por external_reference se disponível
    if (externalReference) {
      console.log('🔍 Buscando pagamentos por external_reference...');
      const pagamentosReferencia = await verificarTodosPagamentosReferencia(externalReference);
      // Evitar duplicatas
      const idsExistentes = new Set(todosPagamentos.map(p => p.id));
      todosPagamentos = [
        ...todosPagamentos,
        ...pagamentosReferencia.filter(p => !idsExistentes.has(p.id))
      ];
    }
    
    // Ordenar por data (mais recente primeiro)
    todosPagamentos.sort((a, b) => {
      const dateA = new Date(a.date_created || 0).getTime();
      const dateB = new Date(b.date_created || 0).getTime();
      return dateB - dateA;
    });
    
    console.log('📊 Total de pagamentos únicos encontrados:', todosPagamentos.length);
    
    // Encontrar pagamento aprovado
    const pagamentoAprovado = todosPagamentos.find(
      p => p.status === 'approved' || p.status === 'authorized'
    );
    
    // Último pagamento
    const ultimoPagamento = todosPagamentos[0];
    
    // Gerar relatório
    const relatorio = {
      sucesso: !!pagamentoAprovado,
      mensagem: pagamentoAprovado
        ? `✅ Pagamento aprovado encontrado! ID: ${pagamentoAprovado.id}, Status: ${pagamentoAprovado.status}`
        : todosPagamentos.length > 0
        ? `⚠️ ${todosPagamentos.length} pagamento(s) encontrado(s), mas nenhum está aprovado. Último status: ${ultimoPagamento?.status || 'N/A'}`
        : '❌ Nenhum pagamento encontrado no Mercado Pago. O pagamento pode não ter sido processado ainda.',
      dados: {
        preferenceId,
        externalReference,
        pagamentosEncontrados: todosPagamentos.length,
        pagamentos: todosPagamentos,
        pagamentoAprovado: pagamentoAprovado || null,
        ultimoPagamento: ultimoPagamento || null
      }
    };
    
    console.log('📋 === RELATÓRIO DE DIAGNÓSTICO ===');
    console.log(JSON.stringify(relatorio, null, 2));
    
    return relatorio;
  } catch (error: any) {
    console.error('❌ Erro no diagnóstico:', error);
    return {
      sucesso: false,
      mensagem: `Erro ao realizar diagnóstico: ${error.message}`,
      dados: {
        pagamentosEncontrados: 0,
        pagamentos: []
      }
    };
  }
};

/**
 * NOTA IMPORTANTE:
 * 
 * Para usar esta integração em produção:
 * 
 * 1. Crie um backend (Node.js, Python, etc.) que:
 *    - Armazene seu Access Token do Mercado Pago de forma segura
 *    - Exponha endpoints para criar preferências de pagamento
 *    - Processe webhooks do Mercado Pago
 * 
 * 2. Configure as variáveis de ambiente:
 *    - REACT_APP_MERCADO_PAGO_ACCESS_TOKEN (apenas para desenvolvimento)
 * 
 * 3. Para obter suas credenciais:
 *    - Acesse: https://www.mercadopago.com.br/developers/panel
 *    - Crie uma aplicação
 *    - Obtenha seu Access Token (teste e produção)
 * 
 * 4. Configure webhooks no painel do Mercado Pago para receber
 *    notificações de pagamento em tempo real
 */
