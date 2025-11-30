/**
 * Processador de Webhook do Mercado Pago
 * 
 * Este módulo processa notificações do Mercado Pago e atualiza as assinaturas no Firestore.
 */

const admin = require('firebase-admin');

// Access Token do Mercado Pago (vem de variável de ambiente ou configuração)
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || 
  'APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470';

/**
 * Busca detalhes de um pagamento na API do Mercado Pago
 */
async function verificarStatusPagamento(paymentId) {
  try {
    console.log('🔍 Buscando detalhes do pagamento:', paymentId);
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro ao verificar status: ${errorData.message || response.statusText}`);
    }

    const paymentData = await response.json();
    console.log('✅ Detalhes do pagamento obtidos:', {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference
    });
    
    return paymentData;
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes do pagamento:', error);
    throw error;
  }
}

/**
 * Atualiza a assinatura no Firestore usando Firebase Admin SDK
 */
async function atualizarAssinaturaNoFirestore(userId, assinatura, colecao = 'users') {
  try {
    console.log('💾 Atualizando assinatura no Firestore...');
    console.log('Coleção:', colecao, 'UserId:', userId);
    console.log('Dados da assinatura:', assinatura);

    if (!admin.apps.length) {
      throw new Error('Firebase Admin não está inicializado. Configure as credenciais.');
    }

    const db = admin.firestore();
    const docRef = db.collection(colecao).doc(userId);
    
    await docRef.update({
      assinatura: assinatura
    });

    console.log('✅ Assinatura atualizada com sucesso no Firestore');
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar assinatura no Firestore:', error);
    throw error;
  }
}

/**
 * Processa uma notificação do webhook do Mercado Pago
 */
async function processarWebhookMercadoPago(notificationData) {
  try {
    console.log('🔔 === PROCESSANDO WEBHOOK MERCADO PAGO ===');
    console.log('Dados recebidos:', JSON.stringify(notificationData, null, 2));

    // Extrair ID do pagamento
    let paymentId = null;
    if (notificationData.data?.id) {
      paymentId = String(notificationData.data.id);
    } else if (notificationData.id) {
      paymentId = String(notificationData.id);
    }

    if (!paymentId) {
      console.error('❌ ID do pagamento não encontrado na notificação');
      return {
        sucesso: false,
        mensagem: 'ID do pagamento não encontrado na notificação'
      };
    }

    console.log('📋 ID do pagamento extraído:', paymentId);

    // Verificar o tipo de notificação
    const type = notificationData.type || notificationData.topic || '';
    const action = notificationData.action || '';

    console.log('📋 Tipo de notificação:', type);
    console.log('📋 Ação:', action);

    // Processar apenas notificações de pagamento
    if (type !== 'payment' && !action.includes('payment')) {
      console.log('⚠️ Notificação não é de pagamento, ignorando...');
      return {
        sucesso: true,
        mensagem: 'Notificação não é de pagamento, ignorada'
      };
    }

    // Buscar detalhes do pagamento via API do Mercado Pago
    console.log('🔍 Buscando detalhes do pagamento na API do Mercado Pago...');
    const paymentData = await verificarStatusPagamento(paymentId);

    // Verificar se o pagamento foi aprovado
    const status = paymentData.status || paymentData.collection_status;
    console.log('📊 Status do pagamento:', status);

    if (status !== 'approved' && status !== 'authorized') {
      console.log(`⚠️ Pagamento não está aprovado (status: ${status}), não processando assinatura`);
      return {
        sucesso: true,
        mensagem: `Pagamento com status ${status}, não processando assinatura`
      };
    }

    // Extrair userId e tipo do external_reference
    // Formato: userId_tipo_timestamp
    const externalReference = paymentData.external_reference;
    if (!externalReference) {
      console.error('❌ external_reference não encontrado no pagamento');
      return {
        sucesso: false,
        mensagem: 'external_reference não encontrado no pagamento'
      };
    }

    console.log('📋 External Reference:', externalReference);

    const parts = externalReference.split('_');
    if (parts.length < 2) {
      console.error('❌ external_reference em formato inválido:', externalReference);
      return {
        sucesso: false,
        mensagem: 'external_reference em formato inválido'
      };
    }

    const userId = parts[0];
    const tipo = parts[1]; // 'usuario' ou 'profissional'

    console.log('📋 UserId extraído:', userId);
    console.log('📋 Tipo extraído:', tipo);

    // Preparar dados da assinatura
    const hoje = new Date();
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + 1); // Assinatura mensal

    const assinatura = {
      isAssinante: true,
      dataInicio: hoje.toISOString(),
      dataFim: dataFim.toISOString(),
      tipoAssinatura: tipo,
      paymentId: paymentId,
      status: 'approved'
    };

    // Determinar a coleção
    const colecao = tipo === 'profissional' ? 'profissionais' : 'users';

    // Atualizar assinatura no Firestore
    console.log('🔄 Atualizando assinatura no Firestore...');
    await atualizarAssinaturaNoFirestore(userId, assinatura, colecao);

    console.log('✅ Assinatura processada com sucesso!');
    
    return {
      sucesso: true,
      mensagem: 'Assinatura processada com sucesso'
    };
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return {
      sucesso: false,
      mensagem: `Erro ao processar webhook: ${error.message}`
    };
  }
}

module.exports = {
  processarWebhookMercadoPago,
  verificarStatusPagamento,
  atualizarAssinaturaNoFirestore
};

