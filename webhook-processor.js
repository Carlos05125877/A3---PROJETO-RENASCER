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
    
    // Verificar se é um ID de teste do Mercado Pago
    if (paymentId === '123456' || paymentId === '123456789') {
      console.warn('⚠️ ID de teste do Mercado Pago detectado:', paymentId);
      console.warn('⚠️ Notificações de teste não podem ser processadas completamente');
      console.warn('⚠️ O ID é fictício e não existe na API do Mercado Pago');
      throw new Error('ID de teste do Mercado Pago - não pode ser processado');
    }
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusText = response.statusText;
      const status = response.status;
      
      console.error('❌ Erro na API do Mercado Pago:');
      console.error('📋 Status:', status);
      console.error('📋 Status Text:', statusText);
      console.error('📋 Error Data:', JSON.stringify(errorData, null, 2));
      
      // Se for 404, pode ser um ID de teste
      if (status === 404) {
        console.warn('⚠️ Pagamento não encontrado (404) - pode ser um ID de teste');
      }
      
      throw new Error(`Erro ao verificar status (${status}): ${errorData.message || statusText}`);
    }

    const paymentData = await response.json();
    console.log('✅ Detalhes do pagamento obtidos:', {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
      date_created: paymentData.date_created
    });
    
    return paymentData;
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes do pagamento:', error);
    console.error('📋 Payment ID:', paymentId);
    console.error('📋 Error message:', error.message);
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
    console.log('Dados da assinatura:', JSON.stringify(assinatura, null, 2));

    if (!admin.apps.length) {
      console.error('❌ Firebase Admin não está inicializado!');
      console.error('📋 Verificando variáveis de ambiente...');
      console.error('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'NÃO DEFINIDO');
      console.error('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'DEFINIDO' : 'NÃO DEFINIDO');
      console.error('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'DEFINIDO' : 'NÃO DEFINIDO');
      throw new Error('Firebase Admin não está inicializado. Configure as credenciais.');
    }

    const db = admin.firestore();
    const docRef = db.collection(colecao).doc(userId);
    
    // Verificar se o documento existe
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      console.warn('⚠️ Documento não existe, criando novo documento...');
      await docRef.set({
        assinatura: assinatura
      }, { merge: true });
    } else {
      console.log('✅ Documento existe, atualizando...');
      await docRef.update({
        assinatura: assinatura
      });
    }

    console.log('✅ Assinatura atualizada com sucesso no Firestore');
    
    // Verificar se foi realmente atualizado
    const docVerificado = await docRef.get();
    if (docVerificado.exists) {
      const dadosAtualizados = docVerificado.data();
      console.log('📋 Dados atualizados no Firestore:', JSON.stringify(dadosAtualizados.assinatura, null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar assinatura no Firestore:', error);
    console.error('📋 Detalhes do erro:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
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
    let paymentData;
    
    try {
      paymentData = await verificarStatusPagamento(paymentId);
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do pagamento:', error.message);
      
      // Se for um erro de ID de teste, retornar sucesso mas avisar
      if (error.message.includes('ID de teste') || error.message.includes('404')) {
        console.warn('⚠️ Esta é uma notificação de teste do Mercado Pago');
        console.warn('⚠️ Notificações de teste não podem ser processadas porque o ID é fictício');
        console.warn('⚠️ Para testar completamente, faça um pagamento real de teste');
        return {
          sucesso: true,
          mensagem: 'Notificação de teste recebida (não processada - ID fictício)'
        };
      }
      
      // Para outros erros, retornar falha
      return {
        sucesso: false,
        mensagem: `Erro ao buscar detalhes do pagamento: ${error.message}`
      };
    }

    // Verificar se o pagamento foi aprovado
    const status = paymentData.status || paymentData.collection_status || paymentData.payment_status;
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
      console.error('📋 Dados completos do pagamento:', JSON.stringify(paymentData, null, 2));
      return {
        sucesso: false,
        mensagem: 'external_reference não encontrado no pagamento'
      };
    }

    console.log('📋 External Reference:', externalReference);

    const parts = externalReference.split('_');
    if (parts.length < 2) {
      console.error('❌ external_reference em formato inválido:', externalReference);
      console.error('📋 Partes extraídas:', parts);
      return {
        sucesso: false,
        mensagem: 'external_reference em formato inválido'
      };
    }

    // Pegar userId (primeira parte) e tipo (segunda parte)
    // Ignorar timestamp (terceira parte e além, se houver)
    const userId = parts[0];
    const tipo = parts[1]; // 'usuario' ou 'profissional'
    
    console.log('📋 Partes do external_reference:', parts);
    console.log('📋 Total de partes:', parts.length);

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
    try {
      await atualizarAssinaturaNoFirestore(userId, assinatura, colecao);
      console.log('✅ Assinatura processada com sucesso!');
      
      return {
        sucesso: true,
        mensagem: 'Assinatura processada com sucesso'
      };
    } catch (firestoreError) {
      console.error('❌ Erro ao atualizar Firestore:', firestoreError);
      console.error('Detalhes do erro:', {
        message: firestoreError.message,
        code: firestoreError.code,
        stack: firestoreError.stack
      });
      return {
        sucesso: false,
        mensagem: `Erro ao atualizar Firestore: ${firestoreError.message}`
      };
    }
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    console.error('Stack trace:', error.stack);
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

