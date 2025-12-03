import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './Api';
import { MERCADO_PAGO_ACCESS_TOKEN, MERCADO_PAGO_ACCESS_TOKEN_ALT, MERCADO_PAGO_CONFIG } from './mercadoPagoConfig';

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
        
        // Verificar se o status é 'approved' - se for, considerar como assinante ativo
        // Mesmo que isAssinante não esteja explicitamente como true
        if (status === 'approved') {
          // Se o status é approved, garantir que isAssinante seja true
          if (!isAssinante) {
            console.log('⚠️ Status é approved mas isAssinante é false. Corrigindo...');
            // Atualizar o documento para garantir consistência
            try {
              await updateDoc(doc(firestore, 'users', userId), {
                'assinatura.isAssinante': true
              });
              console.log('✅ isAssinante corrigido para true');
            } catch (error) {
              console.error('Erro ao corrigir isAssinante:', error);
            }
          }
          
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
        } else if (isAssinante && status === 'approved') {
          // Fallback: se isAssinante é true e status é approved
          if (dados.assinatura.dataFim) {
            const dataFim = new Date(dados.assinatura.dataFim);
            const hoje = new Date();
            const naoExpirada = dataFim >= hoje;
            if (naoExpirada) {
              console.log('✅ Assinatura válida encontrada em users');
              return true;
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
        
        // Verificar se o status é 'approved' - se for, considerar como assinante ativo
        // Mesmo que isAssinante não esteja explicitamente como true
        if (status === 'approved') {
          // Se o status é approved, garantir que isAssinante seja true
          if (!isAssinante) {
            console.log('⚠️ Status é approved mas isAssinante é false. Corrigindo...');
            // Atualizar o documento para garantir consistência
            try {
              await updateDoc(doc(firestore, 'profissionais', userId), {
                'assinatura.isAssinante': true
              });
              console.log('✅ isAssinante corrigido para true');
            } catch (error) {
              console.error('Erro ao corrigir isAssinante:', error);
            }
          }
          
          // Verificar se a assinatura não expirou
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
        } else if (isAssinante && status === 'approved') {
          // Fallback: se isAssinante é true e status é approved
          if (dados.assinatura.dataFim) {
            const dataFim = new Date(dados.assinatura.dataFim);
            const hoje = new Date();
            const naoExpirada = dataFim >= hoje;
            if (naoExpirada) {
              console.log('✅ Assinatura válida encontrada em profissionais');
              return true;
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
      // IMPORTANTE: Os novos dados devem sempre sobrescrever os antigos
      // Especialmente isAssinante e status devem ser atualizados
      const assinaturaCompleta = {
        ...assinaturaAtual,
        ...assinatura, // Novos dados sobrescrevem os antigos
        atualizadoEm: new Date().toISOString()
      };
      
      // Garantir que se o status é 'approved', isAssinante seja true
      if (assinaturaCompleta.status === 'approved') {
        assinaturaCompleta.isAssinante = true;
      }
      
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

    console.log('Validações passaram, usando Access Token...');
    
    // Log detalhado para diagnóstico
    console.log('=== DIAGNÓSTICO DE CREDENCIAIS ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Access Token (primeiros 30 chars):', MERCADO_PAGO_ACCESS_TOKEN ? MERCADO_PAGO_ACCESS_TOKEN.substring(0, 30) + '...' : 'VAZIO');
    console.log('Access Token completo:', MERCADO_PAGO_ACCESS_TOKEN || 'NÃO CONFIGURADO');
    console.log('Token começa com APP_USR:', MERCADO_PAGO_ACCESS_TOKEN?.startsWith('APP_USR') ? 'SIM' : 'NÃO');
    
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
    
    // Preparar URLs de retorno - todas apontam para PagamentoSucesso
    // A tela de sucesso verificará automaticamente o status do pagamento
    const basePathSucesso = '/screens/pagamento_sucesso';
    
    // Garantir que origin não tenha barra no final
    const originClean = origin.replace(/\/$/, '');
    
    // Criar external_reference ANTES de construir as URLs
    const externalReference = `${userId}_${tipoAssinatura}_${Date.now()}`;
    
    // URLs com parâmetros para facilitar identificação quando o usuário retornar
    // O Mercado Pago adicionará payment_id, collection_id, collection_status, etc.
    // Nós adicionamos user_id, external_reference e preference_id para facilitar
    const paramsBase = new URLSearchParams({
      user_id: userId,
      tipo: tipoAssinatura,
      external_reference: externalReference
    });
    
    const successUrl = `${originClean}${basePathSucesso}?${paramsBase.toString()}`;
    const failureUrl = `${originClean}${basePathSucesso}?${paramsBase.toString()}`;
    const pendingUrl = `${originClean}${basePathSucesso}?${paramsBase.toString()}`;
    
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
      external_reference: externalReference,
      statement_descriptor: 'RENASCER',
      binary_mode: false,
      // Configurações adicionais para garantir que o checkout funcione corretamente
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12 // Permitir até 12 parcelas
      }
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
    
    // Função para tentar criar preferência com um token específico
    const tentarCriarPreferencia = async (token: string, tokenName: string) => {
      console.log(`Tentando criar preferência com ${tokenName}...`);
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Idempotency-Key': `${userId}_${Date.now()}`
        },
        body: JSON.stringify(preferenceData)
      });
      return { response, token, tokenName };
    };
    
    // Tentar primeiro com o token principal
    let { response, token: tokenUsado, tokenName } = await tentarCriarPreferencia(MERCADO_PAGO_ACCESS_TOKEN, 'token principal');
    
    // Se falhar com 403, tentar com token alternativo
    if (!response.ok && response.status === 403) {
      console.warn('⚠️ Token principal retornou 403, tentando com token alternativo...');
      if (MERCADO_PAGO_ACCESS_TOKEN_ALT && MERCADO_PAGO_ACCESS_TOKEN_ALT !== MERCADO_PAGO_ACCESS_TOKEN) {
        const resultadoAlt = await tentarCriarPreferencia(MERCADO_PAGO_ACCESS_TOKEN_ALT, 'token alternativo');
        response = resultadoAlt.response;
        tokenUsado = resultadoAlt.token;
        tokenName = resultadoAlt.tokenName;
      }
    }

    console.log('Status da resposta:', response.status, response.statusText);
    
    const responseData = await response.json();
    console.log('Resposta do Mercado Pago:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('❌ ERRO na resposta do Mercado Pago:', responseData);
      console.error('Status:', response.status);
      console.error('Headers da resposta:', Object.fromEntries(response.headers.entries()));
      
      // Tratamento específico para erro 403
      if (response.status === 403) {
        const errorCode = responseData.code;
        const errorMessage = responseData.message || 'Acesso negado pelo Mercado Pago';
        
        console.error('🔒 Erro 403 - Acesso Negado');
        console.error('Código do erro:', errorCode);
        console.error('Mensagem:', errorMessage);
        console.error('Possíveis causas:');
        console.error('  1. Access Token incorreto ou expirado');
        console.error('  2. Token não tem permissões necessárias');
        console.error('  3. Conta do Mercado Pago precisa ser verificada');
        console.error('  4. Políticas da conta bloqueiam esta operação');
        console.error('Access Token usado:', tokenUsado ? tokenUsado.substring(0, 30) + '...' : 'NÃO CONFIGURADO');
        console.error('Nome do token:', tokenName);
        
        throw new Error(`Erro de autorização (403): ${errorMessage}. Verifique o Access Token e as configurações da conta no painel do Mercado Pago.`);
      }
      
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

    // Normalizar o status - aceitar várias variações
    const statusNormalizado = status.toLowerCase().trim();
    const isApproved = statusNormalizado === 'approved' || 
                      statusNormalizado === 'aprovado' || 
                      statusNormalizado === 'authorized' ||
                      statusNormalizado === 'autorizado';
    
    console.log('Status recebido:', status);
    console.log('Status normalizado:', statusNormalizado, 'isApproved:', isApproved);

    // Determinar o status final (sempre usar 'approved' se o pagamento foi aprovado)
    let statusFinal: 'pending' | 'approved' | 'rejected' | 'cancelled' = 'pending';
    if (isApproved) {
      statusFinal = 'approved';
    } else if (statusNormalizado === 'rejected' || statusNormalizado === 'rejeitado') {
      statusFinal = 'rejected';
    } else if (statusNormalizado === 'cancelled' || statusNormalizado === 'cancelado') {
      statusFinal = 'cancelled';
    } else {
      statusFinal = 'pending';
    }

    const assinatura: Assinatura = {
      isAssinante: isApproved, // Sempre true quando aprovado
      dataInicio: hoje.toISOString(),
      dataFim: dataFim.toISOString(),
      tipoAssinatura,
      paymentId,
      status: statusFinal
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

