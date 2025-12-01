const express = require('express');
const admin = require('firebase-admin');
const { processarWebhookMercadoPago } = require('./webhook-processor');
const app = express();

// Inicializar Firebase Admin
// IMPORTANTE: O arquivo serviceAccountKey.json deve estar na raiz do projeto
// E deve estar no .gitignore para não ser commitado
// Em produção (Vercel, Railway, etc.), use variáveis de ambiente
if (!admin.apps.length) {
  try {
    // Tentar carregar serviceAccountKey.json (desenvolvimento local)
    let serviceAccount;
    try {
      serviceAccount = require('./serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin inicializado com serviceAccountKey.json');
    } catch (e) {
      // Se não encontrar o arquivo, tentar com variáveis de ambiente (produção)
      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID || "a3-renascer",
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
          })
        });
        console.log('✅ Firebase Admin inicializado com variáveis de ambiente');
      } else {
        // Fallback: apenas projectId (pode não funcionar para atualizar Firestore)
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || "a3-renascer"
        });
        console.log('⚠️ Firebase Admin inicializado apenas com projectId (pode não funcionar para atualizar Firestore)');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
    console.error('⚠️ Configure as credenciais do Firebase Admin para processar webhooks');
  }
}

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

    // Log de confirmação
    console.log('✅ Notificação recebida');
    console.log('📋 ID do pagamento:', notificationData.id || 'N/A');

    // IMPORTANTE: No Vercel, funções serverless podem ser encerradas após a resposta
    // Para garantir que os logs apareçam, vamos processar ANTES de responder
    // O Mercado Pago espera resposta em até 22 segundos, então temos tempo
    console.log('🔄 Iniciando processamento do webhook (antes de responder)...');
    
    try {
      const resultado = await processarWebhookMercadoPago(notificationData);
      
      console.log('📋 ===== RESULTADO DO PROCESSAMENTO DO WEBHOOK =====');
      if (resultado.sucesso) {
        console.log('✅ Webhook processado com sucesso:', resultado.mensagem);
      } else {
        console.error('❌ Erro ao processar webhook:', resultado.mensagem);
        console.error('📋 Resultado completo:', JSON.stringify(resultado, null, 2));
      }
      console.log('📋 =================================================');
      
      // Agora responder com o resultado
      res.status(200).json({ 
        status: resultado.sucesso ? 'processed' : 'error',
        message: resultado.mensagem,
        timestamp: new Date().toISOString(),
        paymentId: notificationData.id || 'N/A'
      });
    } catch (error) {
      console.error('❌ ===== ERRO INESPERADO AO PROCESSAR WEBHOOK =====');
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error('❌ ===============================================');
      
      // Responder mesmo em caso de erro
      res.status(200).json({ 
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
        paymentId: notificationData.id || 'N/A'
      });
    }

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

// Rota raiz - Informações do servidor
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Webhook Server do Mercado Pago',
    status: 'online',
    endpoints: {
      health: '/health',
      webhook: '/webhook/mercadopago'
    },
    timestamp: new Date().toISOString()
  });
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

// Exportar app para Vercel (serverless)
// No Vercel, não usamos app.listen(), apenas exportamos o app
module.exports = app;

// Para desenvolvimento local, iniciar servidor
if (require.main === module) {
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
}

