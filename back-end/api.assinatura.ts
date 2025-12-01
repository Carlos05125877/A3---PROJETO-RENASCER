import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './Api';

export interface Assinatura {
  isAssinante: boolean;
  dataInicio?: string;
  dataFim?: string;
  tipoAssinatura?: 'usuario' | 'profissional';
  paymentId?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

/**
 * Verifica se o usuário é um assinante ativo
 */
export const verificarAssinatura = async (userId: string): Promise<boolean> => {
  try {
    console.log('=== VERIFICANDO ASSINATURA ===');
    console.log('UserId:', userId);
    
    // Verificar na coleção users
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (userDoc.exists()) {
      const dados = userDoc.data();
      console.log('Documento encontrado em users');
      console.log('Dados da assinatura:', JSON.stringify(dados.assinatura, null, 2));
      
      if (dados.assinatura) {
        const isAssinante = dados.assinatura.isAssinante;
        const status = dados.assinatura.status;
        
        console.log('isAssinante:', isAssinante);
        console.log('status:', status);
        
        if (isAssinante && status === 'approved') {
        // Verificar se a assinatura não expirou
        if (dados.assinatura.dataFim) {
          const dataFim = new Date(dados.assinatura.dataFim);
          const hoje = new Date();
            const naoExpirada = dataFim >= hoje;
            console.log('Data fim:', dataFim.toISOString());
            console.log('Data hoje:', hoje.toISOString());
            console.log('Não expirada:', naoExpirada);
            
            if (naoExpirada) {
              console.log('✅ Assinatura válida encontrada em users');
              return true;
            } else {
              console.log('❌ Assinatura expirada');
            }
          } else {
            console.log('✅ Assinatura válida encontrada em users (sem dataFim)');
            return true;
      }
        } else {
          console.log('❌ Assinatura não está ativa:', { isAssinante, status });
        }
      } else {
        console.log('❌ Campo assinatura não encontrado em users');
      }
    } else {
      console.log('Documento não encontrado em users');
    }

    // Verificar também na coleção de profissionais
    const profDoc = await getDoc(doc(firestore, 'profissionais', userId));
    if (profDoc.exists()) {
      const dados = profDoc.data();
      console.log('Documento encontrado em profissionais');
      console.log('Dados da assinatura:', JSON.stringify(dados.assinatura, null, 2));
      
      if (dados.assinatura) {
        const isAssinante = dados.assinatura.isAssinante;
        const status = dados.assinatura.status;
        
        console.log('isAssinante:', isAssinante);
        console.log('status:', status);
        
        if (isAssinante && status === 'approved') {
        if (dados.assinatura.dataFim) {
          const dataFim = new Date(dados.assinatura.dataFim);
          const hoje = new Date();
            const naoExpirada = dataFim >= hoje;
            console.log('Data fim:', dataFim.toISOString());
            console.log('Data hoje:', hoje.toISOString());
            console.log('Não expirada:', naoExpirada);
            
            if (naoExpirada) {
              console.log('✅ Assinatura válida encontrada em profissionais');
              return true;
            } else {
              console.log('❌ Assinatura expirada');
            }
          } else {
            console.log('✅ Assinatura válida encontrada em profissionais (sem dataFim)');
            return true;
      }
        } else {
          console.log('❌ Assinatura não está ativa:', { isAssinante, status });
        }
      } else {
        console.log('❌ Campo assinatura não encontrado em profissionais');
      }
    } else {
      console.log('Documento não encontrado em profissionais');
    }

    console.log('❌ Nenhuma assinatura válida encontrada');
    return false;
  } catch (error: any) {
    console.error('❌ Erro ao verificar assinatura:', error);
    console.error('Detalhes do erro:', error.message, error.code);
    return false;
  }
};

/**
 * Atualiza o status de assinatura do usuário no Firebase
 */
export const atualizarAssinatura = async (
  userId: string,
  assinatura: Assinatura,
  colecao: 'users' | 'profissionais' = 'users'
): Promise<void> => {
  try {
    console.log('=== ATUALIZANDO ASSINATURA NO FIRESTORE ===');
    console.log('Coleção:', colecao);
    console.log('UserId:', userId);
    console.log('Dados da assinatura:', assinatura);
    
    const userRef = doc(firestore, colecao, userId);
    
    // Verificar se o documento existe primeiro
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.warn('⚠️ Documento não existe na coleção', colecao, 'criando...');
      // Se não existe, criar o documento com a assinatura
      await setDoc(userRef, {
      assinatura: {
          ...assinatura,
          atualizadoEm: new Date().toISOString(),
          criadoEm: new Date().toISOString()
        }
      }, { merge: true });
    } else {
      // Se existe, atualizar apenas a assinatura
      // Preservar campos existentes que não foram fornecidos
      const dadosAtuais = userDoc.data();
      const assinaturaAtual = dadosAtuais?.assinatura || {};
      
      // Mesclar dados existentes com novos dados
      const assinaturaCompleta = {
        ...assinaturaAtual,
        ...assinatura,
        atualizadoEm: new Date().toISOString()
      };
      
      await updateDoc(userRef, {
        assinatura: assinaturaCompleta
    });
      
      console.log('Assinatura mesclada:', JSON.stringify(assinaturaCompleta, null, 2));
    }
    
    console.log('✅ Assinatura atualizada com sucesso no Firestore');
    
    // Verificar se foi salvo corretamente
    const docVerificado = await getDoc(userRef);
    if (docVerificado.exists()) {
      const dadosSalvos = docVerificado.data();
      console.log('Dados salvos no Firestore:', JSON.stringify(dadosSalvos.assinatura, null, 2));
      
      if (!dadosSalvos.assinatura) {
        console.error('❌ Assinatura não foi salva corretamente!');
        throw new Error('Assinatura não foi salva corretamente no Firestore');
      }
      
      // Validação adicional: verificar se os campos obrigatórios estão presentes
      const assinaturaSalva = dadosSalvos.assinatura;
      if (assinaturaSalva.isAssinante === undefined) {
        console.error('❌ Campo isAssinante não encontrado!');
        throw new Error('Campo isAssinante não foi salvo corretamente');
      }
      if (assinaturaSalva.status === undefined) {
        console.error('❌ Campo status não encontrado!');
        throw new Error('Campo status não foi salvo corretamente');
      }
      
      console.log('✅ Validação dos campos: OK');
      console.log('   - isAssinante:', assinaturaSalva.isAssinante);
      console.log('   - status:', assinaturaSalva.status);
      console.log('   - dataFim:', assinaturaSalva.dataFim || 'não definida');
    } else {
      console.error('❌ Documento não foi encontrado após salvar!');
      throw new Error('Documento não foi encontrado após salvar');
    }
  } catch (error: any) {
    console.error('❌ Erro ao atualizar assinatura:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem do erro:', error.message);
    throw error;
  }
};

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * 
 * NOTA: Para produção, esta função deve chamar um backend seguro.
 * Por enquanto, usa a API diretamente (apenas para desenvolvimento).
 */
export const criarPreferenciaPagamento = async (
  valor: number,
  descricao: string,
  userId: string,
  tipoAssinatura: 'usuario' | 'profissional'
): Promise<{ checkoutUrl: string; preferenceId: string; externalReference: string }> => {
  console.log('=== INICIANDO CRIAÇÃO DE PREFERÊNCIA ===');
  console.log('Parâmetros recebidos:', { valor, descricao, userId: userId.substring(0, 10) + '...', tipoAssinatura });
  
  try {
    // Validações iniciais
    if (!valor || valor <= 0) {
      console.error('Validação falhou: valor inválido', valor);
      throw new Error('Valor inválido para o pagamento');
    }
    
    if (!descricao || descricao.trim() === '') {
      console.error('Validação falhou: descrição vazia');
      throw new Error('Descrição do pagamento é obrigatória');
    }
    
    if (!userId || userId.trim() === '') {
      console.error('Validação falhou: userId vazio');
      throw new Error('ID do usuário é obrigatório');
    }

    console.log('Validações passaram, importando Access Token...');
    
    // Importar Access Token do arquivo de configuração
    const { MERCADO_PAGO_ACCESS_TOKEN } = await import('./mercadoPagoConfig');
    
    console.log('Access Token importado:', MERCADO_PAGO_ACCESS_TOKEN ? MERCADO_PAGO_ACCESS_TOKEN.substring(0, 20) + '...' : 'VAZIO');
    
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN.trim() === '') {
      console.error('Access Token não configurado');
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    // Obter origin de forma compatível com React Native e Web
    let origin = 'http://localhost:8081';
    if (typeof window !== 'undefined' && window.location) {
      origin = window.location.origin;
      // Remover qualquer /screens/ duplicado do origin
      origin = origin.replace(/\/screens\/?$/, '');
    } else if (typeof global !== 'undefined' && (global as any).location) {
      origin = (global as any).location.origin;
      origin = origin.replace(/\/screens\/?$/, '');
    }

    // Garantir que o valor está no formato correto (número com 2 casas decimais)
    const valorFormatado = parseFloat(valor.toFixed(2));
    
    // Preparar URLs de retorno - TODAS apontam para PagamentoSucesso
    // Após o pagamento, o Mercado Pago redirecionará para PagamentoSucesso
    // IMPORTANTE: No Expo Router, a rota é baseada no caminho do arquivo
    // src/app/screens/pagamentoSucesso.tsx = /screens/pagamentoSucesso
    const basePathSucesso = '/screens/pagamentoSucesso';
    
    // Garantir que origin não tenha barra no final
    const originClean = origin.replace(/\/$/, '');
    
    // TODAS as URLs de retorno apontam para PagamentoSucesso para garantir processamento
    const successUrl = `${originClean}${basePathSucesso}?user_id=${encodeURIComponent(userId)}&tipo=${encodeURIComponent(tipoAssinatura)}&status=approved`;
    const failureUrl = `${originClean}${basePathSucesso}?user_id=${encodeURIComponent(userId)}&tipo=${encodeURIComponent(tipoAssinatura)}&status=failure`;
    const pendingUrl = `${originClean}${basePathSucesso}?user_id=${encodeURIComponent(userId)}&tipo=${encodeURIComponent(tipoAssinatura)}&status=pending`;
    
    console.log('=== URLs DE RETORNO CONFIGURADAS ===');
    console.log('Origin:', originClean);
    console.log('Base Path:', basePathSucesso);
    console.log('URLs completas:', {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl
    });
    console.log('Teste manual: Acesse esta URL para testar:', successUrl);
    
    console.log('URLs de retorno:', { successUrl, failureUrl, pendingUrl });
    
    // Validar que as URLs não estão vazias
    if (!successUrl || successUrl.trim() === '') {
      throw new Error('URL de sucesso não pode estar vazia');
    }
    
    // Preparar dados da preferência
    const preferenceData: any = {
      items: [
        {
          title: descricao.substring(0, 127), // Limitar tamanho do título
          quantity: 1,
          unit_price: valorFormatado,
          currency_id: 'BRL'
        }
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl
      },
      external_reference: `${userId}_${tipoAssinatura}_${Date.now()}`,
      statement_descriptor: 'RENASCER',
      binary_mode: false
    };
    
    // Configurar auto_return apenas se não for localhost
    // O Mercado Pago rejeita auto_return com URLs de localhost
    // Em localhost, o usuário precisará retornar manualmente ou usar o botão de verificação
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      preferenceData.auto_return = 'approved';
      console.log('auto_return configurado para: approved');
    } else {
      console.log('auto_return não configurado (localhost detectado - Mercado Pago não aceita)');
      console.log('O usuário precisará retornar manualmente após o pagamento');
    }
    
    // Adicionar notification_url para receber webhooks (opcional, mas recomendado)
    // Configurar webhook para receber notificações do Mercado Pago em tempo real
    const { MERCADO_PAGO_CONFIG } = await import('./mercadoPagoConfig');
    const webhookUrl = MERCADO_PAGO_CONFIG.webhookUrl;
    if (webhookUrl && webhookUrl.trim() !== '') {
      preferenceData.notification_url = webhookUrl;
      console.log('✅ Webhook configurado:', webhookUrl);
    } else {
      console.warn('⚠️ Webhook não configurado - notificações não serão recebidas automaticamente');
    }
    
    console.log('Dados completos da preferência:', JSON.stringify(preferenceData, null, 2));
    
    console.log('Dados da preferência preparados:', {
      valor: valorFormatado,
      descricao: descricao.substring(0, 50),
      userId: userId.substring(0, 10) + '...',
      origin,
      hasBackUrls: true,
      hasAutoReturn: !!preferenceData.auto_return
    });
    
    console.log('Enviando requisição para Mercado Pago...');
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `${userId}_${Date.now()}`
      },
      body: JSON.stringify(preferenceData)
    });

    console.log('Status da resposta:', response.status, response.statusText);
    
    const responseData = await response.json();
    console.log('Resposta do Mercado Pago:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('❌ ERRO na resposta do Mercado Pago:', responseData);
      const errorMessage = responseData.message || 
                          responseData.error || 
                          responseData.cause?.[0]?.description ||
                          `Erro ${response.status}: ${response.statusText}`;
      throw new Error(`Erro ao criar preferência de pagamento: ${errorMessage}`);
    }

    // Verificar se temos a URL de checkout
    const checkoutUrl = responseData.init_point || responseData.sandbox_init_point;
    
    console.log('URLs disponíveis:', {
      init_point: responseData.init_point ? 'SIM' : 'NÃO',
      sandbox_init_point: responseData.sandbox_init_point ? 'SIM' : 'NÃO',
      checkout_url: checkoutUrl ? checkoutUrl.substring(0, 50) + '...' : 'NÃO ENCONTRADA'
    });
    
    if (!checkoutUrl) {
      console.error('❌ Resposta do Mercado Pago sem URL de checkout:', responseData);
      throw new Error('URL de checkout não retornada pelo Mercado Pago. Verifique as credenciais e a configuração.');
    }

    const preferenceId = responseData.id;
    const externalReference = preferenceData.external_reference;

    console.log('✅ Preferência criada com sucesso!', {
      preference_id: preferenceId,
      external_reference: externalReference,
      checkout_url: checkoutUrl.substring(0, 50) + '...'
    });

    return {
      checkoutUrl,
      preferenceId: preferenceId || '',
      externalReference: externalReference || ''
    };
  } catch (error: any) {
    console.error('Erro ao criar preferência de pagamento:', error);
    
    // Em caso de erro, tentar retornar uma URL de fallback para não bloquear o usuário
    // Mas ainda assim lançar o erro para que o frontend saiba que houve problema
    const errorMessage = error.message || 'Erro desconhecido ao criar preferência de pagamento';
    console.warn('Tentando criar URL de fallback devido ao erro:', errorMessage);
    
    // Retornar erro mais detalhado
    throw new Error(errorMessage);
  }
};

/**
 * Processa o callback do Mercado Pago após pagamento
 */
export const processarCallbackPagamento = async (
  paymentId: string,
  status: string,
  userId: string,
  tipoAssinatura: 'usuario' | 'profissional'
): Promise<void> => {
  try {
    console.log('=== PROCESSANDO CALLBACK DE ASSINATURA ===');
    console.log('Dados recebidos:', { paymentId, status, userId, tipoAssinatura });
    
    const colecao = tipoAssinatura === 'profissional' ? 'profissionais' : 'users';
    const hoje = new Date();
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + 1); // Assinatura mensal

    // Normalizar o status
    const statusNormalizado = status.toLowerCase();
    const isApproved = statusNormalizado === 'approved' || statusNormalizado === 'aprovado';
    
    console.log('Status normalizado:', statusNormalizado, 'isApproved:', isApproved);

    const assinatura: Assinatura = {
      isAssinante: isApproved,
      dataInicio: hoje.toISOString(),
      dataFim: dataFim.toISOString(),
      tipoAssinatura,
      paymentId,
      status: (statusNormalizado === 'approved' ? 'approved' :
               statusNormalizado === 'pending' ? 'pending' :
               statusNormalizado === 'rejected' ? 'rejected' :
               statusNormalizado === 'cancelled' ? 'cancelled' : 'pending') as 'pending' | 'approved' | 'rejected' | 'cancelled'
    };

    console.log('Assinatura a ser salva:', assinatura);
    console.log('Coleção:', colecao, 'UserId:', userId);

    await atualizarAssinatura(userId, assinatura, colecao);
    
    console.log('✅ Assinatura atualizada com sucesso no Firestore');
    
    // Verificar se foi salvo corretamente
    console.log('=== VERIFICANDO ASSINATURA APÓS SALVAMENTO ===');
    const verificado = await verificarAssinatura(userId);
    console.log('Resultado da verificação:', verificado ? '✅ Assinante confirmado' : '❌ Assinante não confirmado');
    
    if (!verificado && isApproved) {
      console.error('⚠️ PROBLEMA DETECTADO: Assinatura foi salva mas a verificação retornou false!');
      console.error('Isso pode indicar:');
      console.error('  1. O campo status não está como "approved"');
      console.error('  2. O campo isAssinante não está como true');
      console.error('  3. A dataFim está no passado (se definida)');
      console.error('  4. O documento está na coleção errada');
      
      // Tentar obter os dados para debug
      try {
        const userDoc = await getDoc(doc(firestore, colecao, userId));
        if (userDoc.exists()) {
          const dados = userDoc.data();
          console.error('Dados atuais no Firestore:', JSON.stringify(dados.assinatura, null, 2));
        }
      } catch (debugError) {
        console.error('Erro ao obter dados para debug:', debugError);
      }
      
      throw new Error('Assinatura foi salva mas não está sendo reconhecida. Verifique os logs acima.');
    } else if (verificado && isApproved) {
      console.log('✅ FLUXO COMPLETO: Assinatura salva e verificada com sucesso!');
      console.log('   O usuário agora tem acesso completo ao conteúdo.');
    }
  } catch (error: any) {
    console.error('❌ Erro ao processar callback de pagamento:', error);
    throw error;
  }
};

