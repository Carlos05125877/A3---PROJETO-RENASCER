/**
 * Exemplo de Servidor Express para Webhook do Mercado Pago
 * 
 * INSTRUÇÕES COMPLETAS:
 * 1. Instale as dependências: npm install express
 * 2. Renomeie este arquivo para server.js OU copie o conteúdo para server.js
 * 3. Execute: node server.js
 * 4. Em outro terminal, exponha com localtunnel: npx localtunnel --port 3000
 * 5. Configure a URL no painel do Mercado Pago
 * 
 * Veja PASSO_A_PASSO_WEBHOOK.md para instruções detalhadas.
 */

const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para log de todas as requisições
app.use((req, res, next) => {
  console.log(`\n📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Query:', req.query);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Endpoint de teste (GET) - Para verificar se o servidor está funcionando
app.get('/webhook/mercadopago', (req, res) => {
  console.log('✅ Endpoint de teste acessado');
  res.status(200).json({ 
    message: 'Webhook endpoint está ativo',
    timestamp: new Date().toISOString(),
    url: req.url
  });
});

// Endpoint do webhook (POST) - Recebe notificações do Mercado Pago
app.post('/webhook/mercadopago', async (req, res) => {
  try {
    console.log('\n🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===');
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // O Mercado Pago pode enviar dados no body ou na query string
    const notificationData = {
      ...req.body,
      topic: req.query.topic || req.body.type || req.body.topic,
      id: req.query.id || req.body.data?.id || req.body.id
    };

    console.log('📋 Dados processados:', JSON.stringify(notificationData, null, 2));

    // IMPORTANTE: Responder imediatamente com 200 para evitar timeout
    // O processamento pode ser feito de forma assíncrona
    res.status(200).json({ 
      status: 'received',
      message: 'Notificação recebida com sucesso',
      timestamp: new Date().toISOString()
    });

    // Processar a notificação de forma assíncrona (após responder)
    // NOTA: Você precisará adaptar este código para usar suas funções
    // Exemplo:
    /*
    try {
      const { processarWebhookMercadoPago } = require('./back-end/webhook.mercadopago');
      const resultado = await processarWebhookMercadoPago(notificationData);
      console.log('✅ Resultado do processamento:', resultado);
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
    }
    */

    // Por enquanto, apenas logar os dados
    console.log('✅ Notificação recebida e confirmada');

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    // SEMPRE responder com 200 para evitar reenvios do Mercado Pago
    res.status(200).json({ 
      status: 'error', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`🚀 Servidor webhook rodando na porta ${PORT}`);
  console.log(`🔗 Endpoint local: http://localhost:${PORT}/webhook/mercadopago`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('🚀 ========================================\n');
  console.log('📝 Para expor publicamente, execute:');
  console.log(`   npx localtunnel --port ${PORT}`);
  console.log('\n');
});

