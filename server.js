const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para log de requisições (depois do body parser)
app.use((req, res, next) => {
  console.log(`\n📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Verificar query params de forma segura
  if (req.query && typeof req.query === 'object') {
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length > 0) {
      console.log('Query:', req.query);
    }
  }
  
  // Verificar body de forma segura
  if (req.body && typeof req.body === 'object') {
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.length > 0) {
      console.log('Body:', JSON.stringify(req.body, null, 2));
    }
  }
  
  next();
});

// Endpoint de teste (GET) - Para verificar se está funcionando
app.get('/webhook/mercadopago', (req, res) => {
  console.log('✅ Endpoint de teste acessado via GET');
  res.status(200).json({ 
    message: 'Webhook endpoint está ativo e funcionando!',
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
});

// Endpoint do webhook (POST) - Recebe notificações do Mercado Pago
app.post('/webhook/mercadopago', async (req, res) => {
  try {
    console.log('\n🔔 === WEBHOOK MERCADO PAGO RECEBIDO ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
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
    // O Mercado Pago espera resposta em até 22 segundos
    res.status(200).json({ 
      status: 'received',
      message: 'Notificação recebida com sucesso',
      timestamp: new Date().toISOString(),
      paymentId: notificationData.id || 'N/A'
    });

    // Log de confirmação
    console.log('✅ Notificação recebida e confirmada com sucesso');
    console.log('📋 ID do pagamento:', notificationData.id || 'N/A');

    // AQUI você pode adicionar o processamento assíncrono
    // Por enquanto, apenas logamos os dados
    // No próximo passo, vamos adicionar o processamento real

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
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
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
  console.log('📝 Próximo passo: Expor com localtunnel');
  console.log(`   Execute: npx localtunnel --port ${PORT}\n`);
});

