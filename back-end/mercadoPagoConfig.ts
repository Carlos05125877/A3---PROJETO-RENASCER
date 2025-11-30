/**
 * Configuração do Mercado Pago
 * 
 * IMPORTANTE: Este arquivo contém credenciais sensíveis.
 * Em produção, use variáveis de ambiente ou um backend seguro.
 * 
 * Para desenvolvimento, você pode usar este arquivo diretamente.
 * Para produção, remova as credenciais daqui e use variáveis de ambiente.
 * 
 * 🔐 VALIDAÇÃO DE EMAIL EM CONTAS DE TESTE:
 * Se o Mercado Pago pedir validação de email e você não tiver acesso ao email,
 * use os ÚLTIMOS 6 DÍGITOS do Access Token produtivo (abaixo) ou do User ID.
 * Exemplo: Se o token termina em "3026971470", use "1470" (últimos 6 dígitos).
 * Veja: COMO_OBTER_CODIGO_VALIDACAO.md para mais detalhes.
 */

// Access Token do Mercado Pago
// IMPORTANTE: Para testar com cartões de teste, você precisa de um Access Token de TESTE (Sandbox)
// Obtenha em: https://www.mercadopago.com.br/developers/panel -> Suas integrações -> Teste

// Token de TESTE (Sandbox) - Use este para desenvolvimento e testes com cartões de teste
export const MERCADO_PAGO_ACCESS_TOKEN_TEST = 
  process.env.REACT_APP_MERCADO_PAGO_ACCESS_TOKEN_TEST || 
  ''; // Cole aqui seu Access Token de TESTE

// Token de PRODUÇÃO - Use apenas em produção com pagamentos reais
export const MERCADO_PAGO_ACCESS_TOKEN_PROD = 
  process.env.REACT_APP_MERCADO_PAGO_ACCESS_TOKEN_PROD || 
  'APP_USR-7288585500067152-112921-8ba2a74447902672df10a77bbc8ad853-3026971470';

// Token alternativo (caso precise)
export const MERCADO_PAGO_ACCESS_TOKEN_ALT = 
  'APP_USR-271b7d72-ad6b-42c3-afe5-182aea3aeebf';

// Seleciona automaticamente o token baseado no ambiente
// Em desenvolvimento, usa TESTE. Em produção, usa PRODUÇÃO
export const MERCADO_PAGO_ACCESS_TOKEN = 
  process.env.REACT_APP_MERCADO_PAGO_ACCESS_TOKEN || 
  (process.env.NODE_ENV === 'production' 
    ? MERCADO_PAGO_ACCESS_TOKEN_PROD 
    : MERCADO_PAGO_ACCESS_TOKEN_TEST || MERCADO_PAGO_ACCESS_TOKEN_PROD); // Fallback para produção se teste não estiver configurado

// Configurações adicionais
export const MERCADO_PAGO_CONFIG = {
  // Ambiente: 'sandbox' para testes, 'production' para produção
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  
  // URLs de retorno (serão configuradas dinamicamente)
  backUrls: {
    success: '/pagamento/sucesso',
    failure: '/pagamento/falha',
    pending: '/pagamento/pendente'
  },
  
  // URL do webhook para receber notificações do Mercado Pago
  // O webhook será chamado automaticamente quando houver atualizações no pagamento
  webhookUrl: process.env.REACT_APP_MERCADO_PAGO_WEBHOOK_URL || 
              'https://angry-dryers-show.loca.lt/webhook/mercadopago'
};

