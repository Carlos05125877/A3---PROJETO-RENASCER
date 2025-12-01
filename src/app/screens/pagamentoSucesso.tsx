import { auth, buscarDadosFirestore } from '@/back-end/Api';
import { processarCallbackPagamento, verificarAssinatura } from '@/back-end/api.assinatura';
import { buscarPagamentoPorPreferencia, buscarPagamentoPorReferencia, verificarStatusPagamento } from '@/back-end/api.mercadoPago';
import Topo from '@/components/topo';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Função helper para obter parâmetros da URL
const getUrlParams = (): URLSearchParams => {
  if (typeof window !== 'undefined' && window.location) {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

export default function PagamentoSucesso() {
  const router = useRouter();
  const [processando, setProcessando] = useState(true);
  const [sucesso, setSucesso] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUser(usuario);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const processarPagamento = async () => {
      try {
        console.log('=== PÁGINA PAGAMENTO SUCESSO CARREGADA ===');
        console.log('URL atual:', typeof window !== 'undefined' ? window.location.href : 'N/A');
        
        const params = getUrlParams();
        console.log('=== PROCESSANDO CALLBACK DE PAGAMENTO ===');
        console.log('Parâmetros recebidos:', Object.fromEntries(params.entries()));
        console.log('Query string completa:', typeof window !== 'undefined' ? window.location.search : 'N/A');
        
        // O Mercado Pago retorna diferentes parâmetros na URL
        // payment_id: ID do pagamento (quando disponível)
        // preference_id: ID da preferência de pagamento
        // collection_id: ID da cobrança (alternativa ao payment_id)
        // collection_status: status do pagamento (approved, pending, rejected, etc.)
        // status: status alternativo
        // external_reference: referência externa que enviamos (userId_tipo_timestamp)
        
        const paymentId = params.get('payment_id') || params.get('collection_id') || params.get('preference_id') || '';
        // Priorizar status da URL, depois collection_status, depois padrão
        const status = params.get('status') || params.get('collection_status') || 'waiting';
        const userId = params.get('user_id') || user?.uid || '';
        const externalReference = params.get('external_reference') || '';
        const tipoParam = params.get('tipo') as 'usuario' | 'profissional' | null;
        
        // Se status é 'waiting', significa que estamos aguardando confirmação do pagamento
        const isWaiting = status === 'waiting';
        
        console.log('Dados extraídos:', { paymentId, status, userId, externalReference });
        
        // Se não temos userId, tentar extrair do external_reference
        let finalUserId = userId;
        let tipo: 'usuario' | 'profissional' = 'usuario';
        
        if (!finalUserId && externalReference) {
          const parts = externalReference.split('_');
          if (parts.length >= 2) {
            finalUserId = parts[0];
            tipo = parts[1] as 'usuario' | 'profissional';
            console.log('UserId extraído do external_reference:', finalUserId, tipo);
          }
        }
        
        // Se ainda não temos userId, usar o usuário logado
        if (!finalUserId && user?.uid) {
          finalUserId = user.uid;
          // Tentar determinar o tipo pela coleção do usuário
          try {
            const dadosUsuario = await buscarDadosFirestore(user.uid);
            tipo = dadosUsuario && 'crp' in dadosUsuario ? 'profissional' : 'usuario';
            console.log('Tipo determinado pela coleção:', tipo);
          } catch (error) {
            console.warn('Erro ao buscar dados do usuário:', error);
          }
        }
        
        // Se não temos tipo, usar o parâmetro da URL ou padrão
        if ((!tipo || tipo !== 'usuario' && tipo !== 'profissional') && tipoParam) {
          tipo = tipoParam;
        }
        if (!tipo || tipo !== 'usuario' && tipo !== 'profissional') {
          tipo = 'usuario'; // Padrão
        }

        console.log('Dados finais para processamento:', { paymentId, status, userId: finalUserId, tipo });

        if (!finalUserId) {
          console.error('❌ UserId não encontrado');
          setMensagem('Não foi possível identificar o usuário. Por favor, faça login novamente.');
          setSucesso(false);
          setProcessando(false);
          return;
        }

        // Se estamos aguardando confirmação (status=waiting), apenas configurar mensagem
        // A verificação periódica será feita em um useEffect separado
        if (isWaiting && finalUserId) {
          console.log('⏳ Aguardando confirmação do pagamento...');
          setMensagem('Aguardando confirmação do pagamento. Por favor, complete o pagamento na nova aba que foi aberta. Esta página verificará automaticamente quando o pagamento for confirmado.');
          setProcessando(true);
          // Retornar aqui para não processar o callback ainda
          return;
        }

        // Se temos paymentId, verificar o status real via API do Mercado Pago
        let statusFinal = status;
        if (paymentId && (paymentId.startsWith('MP-') || !isNaN(Number(paymentId)))) {
          try {
            console.log('Verificando status do pagamento via API...');
            const paymentData = await verificarStatusPagamento(paymentId);
            statusFinal = paymentData.status || paymentData.collection_status || status;
            console.log('Status verificado via API:', statusFinal);
            console.log('Dados completos do pagamento:', paymentData);
          } catch (error: any) {
            console.warn('Não foi possível verificar status via API, usando status da URL:', error.message);
            // Continuar com o status da URL
          }
        }

        // Processar o callback APENAS se tiver parâmetros REAIS do Mercado Pago
        // Não processar apenas por verificar assinatura - precisa ter confirmação do Mercado Pago
        const hasRealPaymentParams = paymentId || 
                                     params.get('collection_id') || 
                                     params.get('preference_id') ||
                                     params.get('collection_status') ||
                                     externalReference;
        
        if (finalUserId && !isWaiting && hasRealPaymentParams) {
          console.log('✅ Processando callback com parâmetros REAIS do Mercado Pago:', { paymentId, statusFinal, userId: finalUserId, tipo });
          await processarCallbackPagamento(paymentId || 'pending', statusFinal, finalUserId, tipo);
          console.log('✅ Callback processado com sucesso');
          
          // Aguardar um pouco e verificar novamente para garantir
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Verificar múltiplas vezes para garantir que foi salvo
          let verificado = false;
          for (let tentativa = 0; tentativa < 3; tentativa++) {
            verificado = await verificarAssinatura(finalUserId);
            console.log(`Verificação ${tentativa + 1}/3:`, verificado ? '✅ Confirmado' : '❌ Não confirmado');
            if (verificado) break;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1s entre tentativas
          }
          
          setSucesso(statusFinal === 'approved');
          setMensagem(
            statusFinal === 'approved'
              ? verificado
                ? 'Sua assinatura foi ativada com sucesso!'
                : 'Pagamento aprovado! Processando sua assinatura...'
              : statusFinal === 'pending'
              ? 'Seu pagamento está pendente. Você receberá um e-mail quando for aprovado.'
              : 'Seu pagamento foi processado, mas o status não é aprovado. Entre em contato com o suporte.'
          );
          
          // Se foi aprovado, mostrar mensagem de sucesso (sem redirecionamento automático)
          // IMPORTANTE: Usuário pode escolher quando navegar
          if (statusFinal === 'approved' && hasRealPaymentParams) {
            console.log('✅ Pagamento confirmado pelo Mercado Pago!');
            setSucesso(true);
            setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
            setProcessando(false);
          } else if (statusFinal === 'approved' && !hasRealPaymentParams) {
            console.warn('⚠️ Status aprovado mas sem parâmetros do Mercado Pago');
            setMensagem('Pagamento aprovado, mas aguardando confirmação completa do Mercado Pago...');
          }
        } else if (finalUserId && !isWaiting && !hasRealPaymentParams) {
          console.warn('⚠️ Usuário encontrado mas sem parâmetros do Mercado Pago. Verificando se webhook já processou...');
          
          // SEMPRE verificar Firestore primeiro antes de mostrar qualquer mensagem
          try {
            const assinante = await verificarAssinatura(finalUserId);
            if (assinante) {
              console.log('✅ Assinatura já ativada no Firestore! Webhook processou.');
              setSucesso(true);
              setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
              setProcessando(false);
              return;
            }
          } catch (error) {
            console.warn('Erro ao verificar assinatura no Firestore:', error);
          }
          
          // Se não encontrou, aguardar e verificar periodicamente (não mostrar erro)
          setProcessando(true);
          setMensagem('Aguardando confirmação do pagamento. Verificando automaticamente...');
        } else {
          console.warn('⚠️ Sem userId ou parâmetros. Verificando se webhook já processou...');
          
          // Última tentativa: verificar se o webhook já processou mesmo sem parâmetros
          if (user?.uid) {
            try {
              const assinante = await verificarAssinatura(user.uid);
              if (assinante) {
                console.log('✅ Assinatura encontrada no Firestore! Webhook processou.');
                setSucesso(true);
                setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
                setProcessando(false);
                return;
              }
            } catch (error) {
              console.warn('Erro ao verificar assinatura:', error);
            }
          }
          
          // Se não encontrou, manter em processando (não mostrar erro imediatamente)
          setProcessando(true);
          setMensagem('Aguardando confirmação do pagamento. Verificando automaticamente...');
        }
      } catch (error: any) {
        console.error('❌ Erro ao processar pagamento:', error);
        setSucesso(false);
        setMensagem(`Erro ao processar pagamento: ${error.message || 'Erro desconhecido'}`);
      } finally {
        setProcessando(false);
      }
    };

    // Aguardar um pouco para garantir que os parâmetros estão disponíveis
    const timer = setTimeout(() => {
      const params = getUrlParams();
      
      // Verificar se há parâmetros REAIS do Mercado Pago ou se é status=waiting
      const hasMercadoPagoParams = params.get('payment_id') || 
                                   params.get('collection_id') || 
                                   params.get('preference_id') ||
                                   params.get('collection_status') ||
                                   params.get('external_reference');
      const isWaiting = params.get('status') === 'waiting';
      const hasUserId = params.get('user_id') || user?.uid;
      
      // Processar apenas se:
      // 1. Tem parâmetros reais do Mercado Pago, OU
      // 2. É status=waiting (aguardando confirmação)
      if (hasMercadoPagoParams || (isWaiting && hasUserId)) {
        console.log('Processando pagamento - tem parâmetros do Mercado Pago ou está aguardando');
        processarPagamento();
      } else if (user && user.emailVerified && !hasMercadoPagoParams && !isWaiting) {
        // Se não tem parâmetros do Mercado Pago e não está aguardando, verificar Firestore primeiro
        console.warn('⚠️ Sem parâmetros do Mercado Pago e não está aguardando. Verificando Firestore...');
        
        // Verificar se webhook já processou antes de mostrar qualquer mensagem
        (async () => {
          try {
            const assinante = await verificarAssinatura(user.uid);
            if (assinante) {
              console.log('✅ Assinatura já ativada no Firestore!');
              setSucesso(true);
              setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
              setProcessando(false);
              return;
            }
          } catch (error) {
            console.warn('Erro ao verificar assinatura:', error);
          }
          
          // Se não encontrou, manter em processando (não mostrar erro)
          setProcessando(true);
          setMensagem('Aguardando confirmação do pagamento. Verificando automaticamente...');
        })();
      } else {
        console.warn('Aguardando usuário ou parâmetros...');
        
        // Se tem usuário, verificar Firestore antes de mostrar erro
        if (user?.uid) {
          (async () => {
            try {
              const assinante = await verificarAssinatura(user.uid);
              if (assinante) {
                console.log('✅ Assinatura encontrada no Firestore!');
                setSucesso(true);
                setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
                setProcessando(false);
                return;
              }
            } catch (error) {
              console.warn('Erro ao verificar assinatura:', error);
            }
            
            // Se não encontrou, manter em processando
            setProcessando(true);
            setMensagem('Aguardando confirmação do pagamento. Verificando automaticamente...');
          })();
        } else {
          // Sem usuário, manter em processando por mais tempo antes de mostrar erro
          setProcessando(true);
          setMensagem('Aguardando confirmação do pagamento. Verificando automaticamente...');
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);
  
  // Verificação periódica quando status é 'waiting' - verificar via API do Mercado Pago
  useEffect(() => {
    // Aguardar um pouco para garantir que o primeiro useEffect terminou
    const initTimer = setTimeout(async () => {
      const params = getUrlParams();
      const status = params.get('status');
      const userId = params.get('user_id') || user?.uid || '';
      const externalReference = params.get('external_reference') || '';
      const preferenceId = params.get('preference_id') || '';
      const tipoParam = params.get('tipo') as 'usuario' | 'profissional' | null;
      const tipo = tipoParam || 'usuario';
      
      // Verificar se há parâmetros REAIS do Mercado Pago na URL (não apenas waiting)
      const hasMercadoPagoParams = params.get('payment_id') || 
                                    params.get('collection_id') || 
                                    params.get('collection_status');
      
      // FALLBACK: Buscar external_reference e preference_id do localStorage se não encontrou na URL
      let finalExternalReference = externalReference;
      let finalPreferenceId = preferenceId;
      
      if (!finalExternalReference && typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('last_external_reference');
        if (stored) {
          finalExternalReference = stored;
          console.log('📦 External Reference obtido do localStorage (fallback):', finalExternalReference);
        }
      }
      
      if (!finalPreferenceId && typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('last_preference_id');
        if (stored) {
          finalPreferenceId = stored;
          console.log('📦 Preference ID obtido do localStorage (fallback):', finalPreferenceId);
        }
      }
      
      console.log('=== DIAGNÓSTICO DE PARÂMETROS ===');
      console.log('URL completa:', typeof window !== 'undefined' ? window.location.href : 'N/A');
      console.log('Query string:', typeof window !== 'undefined' ? window.location.search : 'N/A');
      console.log('Parâmetros da URL:', {
        payment_id: params.get('payment_id') || 'NÃO ENCONTRADO',
        collection_id: params.get('collection_id') || 'NÃO ENCONTRADO',
        preference_id: params.get('preference_id') || 'NÃO ENCONTRADO',
        external_reference: params.get('external_reference') || 'NÃO ENCONTRADO',
        collection_status: params.get('collection_status') || 'NÃO ENCONTRADO',
        status: params.get('status') || 'NÃO ENCONTRADO',
        user_id: params.get('user_id') || 'NÃO ENCONTRADO'
      });
      console.log('Dados finais que serão usados:', {
        userId,
        externalReference: finalExternalReference || 'NÃO DISPONÍVEL',
        preferenceId: finalPreferenceId || 'NÃO DISPONÍVEL',
        tipo
      });
      
      // Verificar se deve iniciar verificação periódica
      // IMPORTANTE: Verificar se status é waiting E se temos userId E (processando OU não temos parâmetros)
      if (status === 'waiting' && userId && !hasMercadoPagoParams) {
        console.log('⏳ Iniciando verificação periódica via API do Mercado Pago...');
        console.log('Dados para verificação:', { 
          externalReference: finalExternalReference, 
          preferenceId: finalPreferenceId, 
          userId 
        });
        
        // Verificar IMEDIATAMENTE no Firestore primeiro (webhook pode ter processado)
        try {
          const assinante = await verificarAssinatura(userId);
          if (assinante) {
            console.log('✅ Assinatura já ativada no Firestore! Webhook processou antes da verificação periódica.');
            setSucesso(true);
            setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso! Você será redirecionado para o blog em instantes...');
            setProcessando(false);
            
            setTimeout(() => {
              router.push('/screens/blogDicas');
            }, 2000);
            return;
          }
        } catch (error) {
          console.warn('Erro ao verificar assinatura no Firestore:', error);
        }
        
        // Garantir que processando está true
        setProcessando(true);
        
        let tentativas = 0;
        const maxTentativas = 120; // 10 minutos (120 * 5 segundos)
        
        // Verificar periodicamente via API do Mercado Pago E também no Firestore
        const checkInterval = setInterval(async () => {
          tentativas++;
          
          try {
            // Primeiro, verificar se há parâmetros na URL (redirecionamento do Mercado Pago)
            const currentParams = getUrlParams();
            const hasUrlParams = currentParams.get('payment_id') || 
                                currentParams.get('collection_id') || 
                                currentParams.get('collection_status');
            
            if (hasUrlParams) {
              console.log('✅ Parâmetros do Mercado Pago detectados na URL! Recarregando...');
              clearInterval(checkInterval);
              clearTimeout(initTimer);
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
              return;
            }
            
            // PRIORIDADE 1: Verificar se assinatura já foi ativada no Firestore (caso webhook tenha processado)
            // Esta é a verificação mais rápida e confiável - verificar PRIMEIRO
            try {
              const assinante = await verificarAssinatura(userId);
              if (assinante) {
                console.log('✅ Assinatura já ativada no Firestore! Webhook processou o pagamento.');
                clearInterval(checkInterval);
                clearTimeout(initTimer);
                
                setSucesso(true);
                setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
                setProcessando(false);
                return;
              }
            } catch (error) {
              console.warn('Erro ao verificar assinatura no Firestore:', error);
            }
            
            // FALLBACK 2: Buscar via API usando external_reference ou preference_id
            let paymentData = null;
            
            console.log(`\n🔍 === BUSCA DE PAGAMENTO - TENTATIVA ${tentativas}/${maxTentativas} ===`);
            
            if (finalExternalReference) {
              console.log(`[1/2] Buscando pagamento via API usando external_reference: ${finalExternalReference}`);
              try {
                paymentData = await buscarPagamentoPorReferencia(finalExternalReference);
                if (paymentData) {
                  console.log('✅ Pagamento encontrado via external_reference!', {
                    id: paymentData.id,
                    status: paymentData.status,
                    external_reference: paymentData.external_reference,
                    date_created: paymentData.date_created
                  });
                } else {
                  console.log('⏳ Nenhum pagamento encontrado com este external_reference ainda');
                }
              } catch (error: any) {
                console.warn(`⚠️ Erro ao buscar por external_reference (tentativa ${tentativas}):`, error.message);
                console.error('Detalhes do erro:', error);
              }
            } else {
              console.log('⚠️ External Reference não disponível para busca');
            }
            
            if (!paymentData && finalPreferenceId) {
              console.log(`[2/2] Buscando pagamento via API usando preference_id: ${finalPreferenceId}`);
              try {
                paymentData = await buscarPagamentoPorPreferencia(finalPreferenceId);
                if (paymentData) {
                  console.log('✅ Pagamento encontrado via preference_id!', {
                    id: paymentData.id,
                    status: paymentData.status,
                    preference_id: paymentData.preference_id,
                    date_created: paymentData.date_created
                  });
                } else {
                  console.log('⏳ Nenhum pagamento encontrado com este preference_id ainda');
                }
              } catch (error: any) {
                console.warn(`⚠️ Erro ao buscar por preference_id (tentativa ${tentativas}):`, error.message);
                console.error('Detalhes do erro:', error);
              }
            } else if (!finalPreferenceId) {
              console.log('⚠️ Preference ID não disponível para busca');
            }
            
            if (!paymentData) {
              console.log(`⏳ Nenhum pagamento encontrado ainda (tentativa ${tentativas}/${maxTentativas})`);
            }
            
            // Se encontrou um pagamento aprovado, processar
            if (paymentData) {
              const paymentStatus = paymentData.status || paymentData.collection_status;
              console.log('✅ Pagamento encontrado via API!', { 
                id: paymentData.id, 
                status: paymentStatus,
                external_reference: paymentData.external_reference
              });
              
              if (paymentStatus === 'approved' || paymentStatus === 'authorized') {
                console.log('✅ Pagamento aprovado detectado via API! Processando...');
                clearInterval(checkInterval);
                clearTimeout(initTimer);
                
                // Processar o pagamento
                try {
                  await processarCallbackPagamento(
                    paymentData.id?.toString() || 'confirmed',
                    'approved',
                    userId,
                    tipo
                  );
                  console.log('✅ Assinatura processada com sucesso!');
                  
                  setSucesso(true);
                  setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
                  setProcessando(false);
                } catch (error: any) {
                  console.error('Erro ao processar assinatura:', error);
                  setMensagem(`Erro ao processar assinatura: ${error.message}`);
                  setProcessando(false);
                }
              } else if (paymentStatus === 'pending') {
                console.log(`⏳ [Tentativa ${tentativas}] Pagamento ainda pendente...`);
              } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
                console.log(`❌ [Tentativa ${tentativas}] Pagamento rejeitado ou cancelado: ${paymentStatus}`);
                clearInterval(checkInterval);
                clearTimeout(initTimer);
                setProcessando(false);
                setSucesso(false);
                setMensagem('Pagamento foi rejeitado ou cancelado. Por favor, tente novamente.');
              } else {
                console.log(`⚠️ [Tentativa ${tentativas}] Pagamento com status: ${paymentStatus}`);
              }
            } else {
              console.log(`⏳ [Tentativa ${tentativas}/${maxTentativas}] Ainda aguardando confirmação do pagamento...`);
            }
            
            // Limitar número de tentativas
            if (tentativas >= maxTentativas) {
              console.log('⏱️ Limite de tentativas atingido. Parando verificação...');
              clearInterval(checkInterval);
              clearTimeout(initTimer);
              setProcessando(false);
              setSucesso(false);
              setMensagem('Tempo de espera esgotado. Se você já completou o pagamento, o Mercado Pago pode estar processando. Verifique sua assinatura na página de assinatura.');
            }
          } catch (error: any) {
            console.error(`Erro na verificação periódica (tentativa ${tentativas}):`, error);
          }
        }, 3000); // Verificar a cada 3 segundos (mais rápido para melhor UX)
        
        // Limpar intervalos quando o componente desmontar
        return () => {
          clearInterval(checkInterval);
          clearTimeout(initTimer);
          console.log('🛑 Parando verificação periódica via API');
        };
      }
    }, 2000); // Aguardar 2 segundos antes de iniciar verificação (dar tempo para webhook processar)
    
    return () => clearTimeout(initTimer);
  }, [user]); // Remover dependência de processando para garantir que sempre rode

  // Log de debug para verificar se a página está sendo renderizada
  console.log('🔍 PagamentoSucesso renderizando - processando:', processando, 'sucesso:', sucesso);

  if (processando) {
    return (
      <View style={styles.container}>
        <Topo />
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#336BF7" />
          <Text style={styles.textoProcessando}>
            {mensagem || 'Processando pagamento...'}
          </Text>
          {mensagem && mensagem.includes('Aguardando') && (
            <Text style={styles.textoAguardando}>
              ⏳ Verificando automaticamente a cada 3 segundos...
            </Text>
          )}
          <Text style={styles.textoDebug}>
            {typeof window !== 'undefined' ? `URL: ${window.location.pathname}${window.location.search}` : 'Carregando...'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View >
      <Topo />
      <View style={styles.content}>
        {sucesso ? (
          <>
            <Text style={styles.iconeSucesso}>✓</Text>
            <Text style={styles.titulo}>Pagamento Aprovado!</Text>
            <Text style={styles.descricao}>
              {mensagem || 'Sua assinatura foi ativada com sucesso. Agora você tem acesso completo ao blog e todos os conteúdos exclusivos.'}
            </Text>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => {
                // Redirecionar imediatamente para o blog
                // O BloqueioAssinatura detectará automaticamente a assinatura
                console.log('🔄 Usuário clicou para acessar blog imediatamente');
                router.push('/screens/blogDicas');
              }}
            >
              <Text style={styles.textoBotao}>Acessar Blog Agora</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botao, styles.botaoSecundario]}
              onPress={() => router.push('/')}
            >
              <Text style={styles.textoBotaoSecundario}>Voltar para Home</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.iconeErro}>✗</Text>
            <Text style={styles.titulo}>Erro no Pagamento</Text>
            <Text style={styles.descricao}>
              {mensagem || 'Não foi possível processar seu pagamento. Por favor, tente novamente ou entre em contato com o suporte.'}
            </Text>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => router.push('/screens/assinatura')}
            >
              <Text style={styles.textoBotao}>Tentar Novamente</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textoProcessando: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  textoDebug: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  textoAguardando: {
    marginTop: 12,
    fontSize: 14,
    color: '#336BF7',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  iconeSucesso: {
    fontSize: 64,
    color: '#4CAF50',
    marginBottom: 16,
  },
  iconeErro: {
    fontSize: 64,
    color: '#F44336',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 16,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    maxWidth: 500,
  },
  textoRedirecionamento: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
    maxWidth: 500,
  },
  botao: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  botaoSecundario: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#336BF7',
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  textoBotaoSecundario: {
    color: '#336BF7',
    fontSize: 18,
    fontWeight: '700',
  },
});

