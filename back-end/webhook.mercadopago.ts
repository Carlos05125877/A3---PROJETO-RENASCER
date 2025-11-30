/**
 * Endpoint de Webhook do Mercado Pago
 * 
 * Este arquivo contém a lógica para processar notificações do Mercado Pago.
 * 
 * IMPORTANTE: Este código deve ser executado em um servidor backend (Node.js, Express, etc.)
 * Não pode ser executado diretamente no frontend.
 * 
 * Para usar este código:
 * 1. Crie um servidor Express (ou similar)
 * 2. Configure a rota POST /webhook/mercadopago
 * 3. Use as funções deste arquivo para processar as notificações
 */

import { processarCallbackPagamento } from './api.assinatura';
import { verificarStatusPagamento } from './api.mercadoPago';

/**
 * Processa uma notificação do webhook do Mercado Pago
 * 
 * @param notificationData Dados da notificação recebida do Mercado Pago
 * @returns Promise com o resultado do processamento
 */
export const processarWebhookMercadoPago = async (notificationData: {
  action?: string;
  type?: string;
  data?: { id?: string };
  id?: string | number;
  topic?: string;
}): Promise<{ sucesso: boolean; mensagem: string }> => {
  try {
    console.log('🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===');
    console.log('Dados recebidos:', JSON.stringify(notificationData, null, 2));

    // Extrair ID do pagamento
    // O Mercado Pago pode enviar o ID de diferentes formas:
    // 1. No campo data.id
    // 2. No campo id
    // 3. Como parâmetro na query string (topic=payment&id=123)
    let paymentId: string | null = null;

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
      console.log('✅ Detalhes do pagamento obtidos:', {
        id: paymentData.id,
        status: paymentData.status || paymentData.collection_status,
        external_reference: paymentData.external_reference
      });
    } catch (error: any) {
      console.error('❌ Erro ao buscar detalhes do pagamento:', error);
      return {
        sucesso: false,
        mensagem: `Erro ao buscar detalhes do pagamento: ${error.message}`
      };
    }

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
    const tipo = parts[1] as 'usuario' | 'profissional';

    console.log('📋 UserId extraído:', userId);
    console.log('📋 Tipo extraído:', tipo);

    // Processar o callback do pagamento (ativar assinatura)
    console.log('🔄 Processando callback do pagamento...');
    try {
      await processarCallbackPagamento(
        paymentId,
        'approved',
        userId,
        tipo
      );
      console.log('✅ Assinatura processada com sucesso!');
      
      return {
        sucesso: true,
        mensagem: 'Assinatura processada com sucesso'
      };
    } catch (error: any) {
      console.error('❌ Erro ao processar callback do pagamento:', error);
      return {
        sucesso: false,
        mensagem: `Erro ao processar callback: ${error.message}`
      };
    }
  } catch (error: any) {
    console.error('❌ Erro geral ao processar webhook:', error);
    return {
      sucesso: false,
      mensagem: `Erro geral: ${error.message}`
    };
  }
};

/**
 * Exemplo de implementação do endpoint para Express.js
 * 
 * Copie este código para seu servidor Express:
 * 
 * ```typescript
 * import express from 'express';
 * import { processarWebhookMercadoPago } from './back-end/webhook.mercadopago';
 * 
 * const app = express();
 * app.use(express.json());
 * 
 * app.post('/webhook/mercadopago', async (req, res) => {
 *   try {
 *     // Log da requisição recebida
 *     console.log('📨 Webhook recebido:', {
 *       body: req.body,
 *       query: req.query,
 *       headers: req.headers
 *     });
 * 
 *     // O Mercado Pago pode enviar dados no body ou na query string
 *     const notificationData = {
 *       ...req.body,
 *       topic: req.query.topic || req.body.type,
 *       id: req.query.id || req.body.data?.id || req.body.id
 *     };
 * 
 *     // Processar a notificação
 *     const resultado = await processarWebhookMercadoPago(notificationData);
 * 
 *     if (resultado.sucesso) {
 *       // Responder com 200 para confirmar recebimento
 *       res.status(200).json({ 
 *         status: 'ok', 
 *         message: resultado.mensagem 
 *       });
 *     } else {
 *       // Mesmo em caso de erro, responder 200 para evitar reenvios
 *       // Mas logar o erro para investigação
 *       console.error('Erro ao processar webhook:', resultado.mensagem);
 *       res.status(200).json({ 
 *         status: 'error', 
 *         message: resultado.mensagem 
 *       });
 *     }
 *   } catch (error: any) {
 *     console.error('Erro ao processar webhook:', error);
 *     // Sempre responder 200 para evitar reenvios do Mercado Pago
 *     res.status(200).json({ 
 *       status: 'error', 
 *       message: error.message 
 *     });
 *   }
 * });
 * 
 * const PORT = process.env.PORT || 3000;
 * app.listen(PORT, () => {
 *   console.log(`🚀 Servidor webhook rodando na porta ${PORT}`);
 * });
 * ```
 */


