import { auth, buscarDadosFirestore } from '@/back-end/Api';
import { processarCallbackPagamento, verificarAssinatura } from '@/back-end/api.assinatura';
import { buscarPagamentoPorPreferencia, buscarPagamentoPorReferencia, verificarStatusPagamento } from '@/back-end/api.mercadoPago';
import Topo from '@/components/topo';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
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

  // Garantir que a rota seja reconhecida pelo Expo Router quando acessada via redirecionamento externo
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      
      // Normalizar a URL para garantir compatibilidade com Expo Router
      // Se não começar com /screens/pagamento_sucesso, corrigir
      if (!path.startsWith('/screens/pagamento_sucesso')) {
        // Se contém pagamento_sucesso mas em formato diferente, corrigir
        if (path.includes('pagamento_sucesso') || path.includes('pagamento')) {
          const newPath = '/screens/pagamento_sucesso';
          window.history.replaceState({}, '', `${newPath}${search}${hash}`);
          console.log('✅ URL corrigida para:', `${newPath}${search}${hash}`);
        }
      }
    }
  }, []);

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

        // Verificar se temos parâmetros REAIS do Mercado Pago na URL
        // Isso indica que o usuário foi redirecionado pelo Mercado Pago após o pagamento
        const hasRealPaymentParams = paymentId || 
                                     params.get('collection_id') || 
                                     params.get('preference_id') ||
                                     params.get('collection_status');
        
        // Se temos parâmetros do Mercado Pago, processar IMEDIATAMENTE
        if (hasRealPaymentParams && finalUserId && !isWaiting) {
          console.log('✅ PARÂMETROS DO MERCADO PAGO DETECTADOS! Processando imediatamente...');
          console.log('Parâmetros encontrados:', {
            payment_id: params.get('payment_id'),
            collection_id: params.get('collection_id'),
            preference_id: params.get('preference_id'),
            collection_status: params.get('collection_status'),
            status: params.get('status')
          });
          
          // Verificar o status real via API do Mercado Pago
          let statusFinal = status;
          if (paymentId && (paymentId.startsWith('MP-') || !isNaN(Number(paymentId)) || paymentId.length > 5)) {
            try {
              console.log('🔍 Verificando status do pagamento via API do Mercado Pago...');
              const paymentData = await verificarStatusPagamento(paymentId);
              statusFinal = paymentData.status || paymentData.collection_status || status;
              console.log('✅ Status verificado via API:', statusFinal);
              console.log('📋 Dados completos do pagamento:', {
                id: paymentData.id,
                status: paymentData.status,
                collection_status: paymentData.collection_status,
                external_reference: paymentData.external_reference
              });
            } catch (error: any) {
              console.warn('⚠️ Não foi possível verificar status via API, usando status da URL:', error.message);
              // Continuar com o status da URL
            }
          }
          
          // Normalizar status
          if (statusFinal === 'aprovado' || statusFinal === 'approved') {
            statusFinal = 'approved';
          } else if (statusFinal === 'pendente' || statusFinal === 'pending') {
            statusFinal = 'pending';
          }
          
          console.log('🔄 Processando callback com parâmetros do Mercado Pago:', { 
            paymentId, 
            statusFinal, 
            userId: finalUserId, 
            tipo 
          });
          
          // Processar o pagamento
          try {
            await processarCallbackPagamento(
              paymentId || params.get('collection_id') || 'pending', 
              statusFinal, 
              finalUserId, 
              tipo
            );
            console.log('✅ Callback processado com sucesso');
            
            // Aguardar um pouco e verificar novamente para garantir
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verificar múltiplas vezes para garantir que foi salvo
            let verificado = false;
            for (let tentativa = 0; tentativa < 5; tentativa++) {
              verificado = await verificarAssinatura(finalUserId);
              console.log(`🔍 Verificação ${tentativa + 1}/5:`, verificado ? '✅ Confirmado' : '❌ Não confirmado');
              if (verificado) break;
              await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1s entre tentativas
            }
            
            if (statusFinal === 'approved') {
              // Se foi verificado, mostrar sucesso imediatamente
              if (verificado) {
                setSucesso(true);
                setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
                setProcessando(false);
              } else {
                // Se não foi verificado ainda, aguardar um pouco e recarregar para forçar atualização
                console.log('⏳ Pagamento aprovado mas assinatura ainda não confirmada. Recarregando...');
                setMensagem('Pagamento aprovado! Processando sua assinatura...');
                
                // Recarregar a página após alguns segundos para mostrar a tela de sucesso
                setTimeout(async () => {
                  const verificadoNovo = await verificarAssinatura(finalUserId);
                  if (verificadoNovo) {
                    // Recarregar a página com os parâmetros corretos para mostrar tela de sucesso
                    const currentParams = getUrlParams();
                    const redirectParams = new URLSearchParams({
                      user_id: finalUserId,
                      tipo: tipo,
                      payment_id: paymentId || currentParams.get('collection_id') || '',
                      collection_status: 'approved',
                      status: 'approved',
                      external_reference: externalReference || ''
                    });
                    
                    if (typeof window !== 'undefined') {
                      window.location.href = `/screens/pagamento_sucesso?${redirectParams.toString()}`;
                    }
                  } else {
                    // Se ainda não foi verificado, recarregar mesmo assim para tentar novamente
                    if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                  }
                }, 3000);
              }
            } else if (statusFinal === 'pending') {
              setSucesso(false);
              setMensagem('Seu pagamento está pendente. Você receberá um e-mail quando for aprovado.');
              setProcessando(false);
            } else {
              setSucesso(false);
              setMensagem('Seu pagamento foi processado, mas o status não é aprovado. Entre em contato com o suporte.');
              setProcessando(false);
            }
            
            return; // Sair aqui para não continuar com outras verificações
          } catch (error: any) {
            console.error('❌ Erro ao processar callback:', error);
            setMensagem(`Erro ao processar pagamento: ${error.message || 'Erro desconhecido'}`);
            setProcessando(false);
            return;
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
  
  // Função auxiliar para verificar pagamento
  const verificarPagamentoCompleto = useCallback(async (
    userId: string,
    externalReference: string,
    preferenceId: string,
    tipo: 'usuario' | 'profissional'
  ): Promise<boolean> => {
    try {
      // PRIORIDADE 1: Verificar Firestore primeiro (mais rápido)
      const assinante = await verificarAssinatura(userId);
      if (assinante) {
        console.log('✅ Assinatura já ativada no Firestore!');
        setSucesso(true);
        setMensagem('Pagamento confirmado! Sua assinatura foi ativada com sucesso!');
        setProcessando(false);
        return true;
      }

      // PRIORIDADE 2: Buscar via API do Mercado Pago
      let paymentData = null;
      
      if (externalReference) {
        try {
          paymentData = await buscarPagamentoPorReferencia(externalReference);
        } catch (error) {
          console.warn('Erro ao buscar por external_reference:', error);
        }
      }
      
      if (!paymentData && preferenceId) {
        try {
          paymentData = await buscarPagamentoPorPreferencia(preferenceId);
        } catch (error) {
          console.warn('Erro ao buscar por preference_id:', error);
        }
      }
      
      if (paymentData) {
        const paymentStatus = paymentData.status || paymentData.collection_status;
        
        if (paymentStatus === 'approved' || paymentStatus === 'authorized') {
          console.log('✅ Pagamento aprovado detectado! Processando e redirecionando...');
          
          // Processar o pagamento
          await processarCallbackPagamento(
            paymentData.id?.toString() || 'confirmed',
            'approved',
            userId,
            tipo
          );
          
          // Aguardar um pouco para garantir que foi processado
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Verificar se foi salvo
          const assinanteVerificado = await verificarAssinatura(userId);
          
          if (assinanteVerificado) {
            console.log('✅ Pagamento confirmado e assinatura ativada! Redirecionando para tela de sucesso...');
            
            // Redirecionar para a tela de sucesso com os parâmetros do Mercado Pago
            // Isso força um recarregamento e mostra a tela de sucesso
            const params = new URLSearchParams({
              user_id: userId,
              tipo: tipo,
              payment_id: paymentData.id?.toString() || '',
              collection_status: 'approved',
              status: 'approved',
              external_reference: externalReference || paymentData.external_reference || ''
            });
            
            if (typeof window !== 'undefined') {
              // Usar window.location.href para forçar recarregamento completo
              window.location.href = `/screens/pagamento_sucesso?${params.toString()}`;
            } else {
              // Fallback para router
              router.replace(`/screens/pagamento_sucesso?${params.toString()}` as any);
            }
            
            return true;
          } else {
            // Se não foi verificado ainda, mostrar mensagem mas continuar verificando
            setSucesso(true);
            setMensagem('Pagamento confirmado! Processando sua assinatura...');
            setProcessando(false);
            return true;
          }
        }
      }
      
      return false;
    } catch (error: any) {
      console.error('Erro ao verificar pagamento:', error);
      return false;
    }
  }, [router]);

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
      
      // Verificar se deve iniciar verificação periódica
      // IMPORTANTE: Verificar se status é waiting E se temos userId E (processando OU não temos parâmetros)
      if ((status === 'waiting' || !hasMercadoPagoParams) && userId) {
        console.log('⏳ Iniciando verificação periódica via API do Mercado Pago...');
        
        // Verificar IMEDIATAMENTE primeiro
        const verificado = await verificarPagamentoCompleto(userId, finalExternalReference, finalPreferenceId, tipo);
        if (verificado) {
          return;
        }
        
        // Garantir que processando está true
        setProcessando(true);
        setMensagem('Aguardando confirmação do pagamento. Verificando automaticamente...');
        
        let tentativas = 0;
        const maxTentativas = 200; // Aumentado para 200 tentativas (16 minutos a cada 5 segundos)
        
        // Verificar periodicamente - mais frequente agora (a cada 2 segundos)
        const checkInterval = setInterval(async () => {
          tentativas++;
          
          try {
            // Primeiro, verificar se há parâmetros na URL (redirecionamento do Mercado Pago)
            const currentParams = getUrlParams();
            const hasUrlParams = currentParams.get('payment_id') || 
                                currentParams.get('collection_id') || 
                                currentParams.get('collection_status');
            
            if (hasUrlParams) {
              console.log('✅ Parâmetros do Mercado Pago detectados na URL durante verificação periódica!');
              console.log('Parâmetros encontrados:', {
                payment_id: currentParams.get('payment_id'),
                collection_id: currentParams.get('collection_id'),
                collection_status: currentParams.get('collection_status'),
                status: currentParams.get('status')
              });
              
              // Processar imediatamente sem recarregar
              clearInterval(checkInterval);
              clearTimeout(initTimer);
              
              const paymentIdFromUrl = currentParams.get('payment_id') || currentParams.get('collection_id') || '';
              const statusFromUrl = currentParams.get('status') || currentParams.get('collection_status') || 'approved';
              
              try {
                // Verificar status via API
                let statusFinal = statusFromUrl;
                if (paymentIdFromUrl) {
                  try {
                    const paymentData = await verificarStatusPagamento(paymentIdFromUrl);
                    statusFinal = paymentData.status || paymentData.collection_status || statusFromUrl;
                    console.log('✅ Status verificado via API:', statusFinal);
                  } catch (error) {
                    console.warn('Erro ao verificar via API, usando status da URL');
                  }
                }
                
                // Processar pagamento
                await processarCallbackPagamento(
                  paymentIdFromUrl || 'confirmed',
                  statusFinal === 'aprovado' || statusFinal === 'approved' ? 'approved' : statusFinal,
                  userId,
                  tipo
                );
                
                // Verificar assinatura
                await new Promise(resolve => setTimeout(resolve, 2000));
                const assinante = await verificarAssinatura(userId);
                
                if (assinante || statusFinal === 'approved' || statusFinal === 'aprovado') {
                  console.log('✅ Pagamento confirmado! Redirecionando para tela de sucesso...');
                  
                  // Redirecionar para a tela de sucesso com os parâmetros corretos
                  // Isso força um recarregamento e mostra a tela de sucesso
                  const params = new URLSearchParams({
                    user_id: userId,
                    tipo: tipo,
                    payment_id: paymentIdFromUrl,
                    collection_status: 'approved',
                    status: 'approved',
                    external_reference: externalReference || ''
                  });
                  
                  if (typeof window !== 'undefined') {
                    // Usar window.location.href para forçar recarregamento completo
                    window.location.href = `/screens/pagamento_sucesso?${params.toString()}`;
                  }
                } else {
                  setMensagem('Pagamento processado. Aguardando confirmação final...');
                }
              } catch (error: any) {
                console.error('Erro ao processar parâmetros do Mercado Pago:', error);
                // Recarregar como fallback
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }
              return;
            }
            
            // Verificar pagamento
            const verificado = await verificarPagamentoCompleto(userId, finalExternalReference, finalPreferenceId, tipo);
            if (verificado) {
              clearInterval(checkInterval);
              clearTimeout(initTimer);
              return;
            }
            
            console.log(`⏳ [Tentativa ${tentativas}/${maxTentativas}] Ainda aguardando confirmação do pagamento...`);
            
            // Limitar número de tentativas
            if (tentativas >= maxTentativas) {
              console.log('⏱️ Limite de tentativas atingido. Parando verificação...');
              clearInterval(checkInterval);
              clearTimeout(initTimer);
              setProcessando(false);
              setSucesso(false);
              setMensagem('Tempo de espera esgotado. Se você já completou o pagamento, verifique sua assinatura na página de assinatura ou entre em contato com o suporte.');
            }
          } catch (error: any) {
            console.error(`Erro na verificação periódica (tentativa ${tentativas}):`, error);
          }
        }, 2000); // Verificar a cada 2 segundos (mais frequente)
        
        // Limpar intervalos quando o componente desmontar
        return () => {
          clearInterval(checkInterval);
          clearTimeout(initTimer);
          console.log('🛑 Parando verificação periódica via API');
        };
      }
    }, 1000); // Reduzido para 1 segundo para iniciar mais rápido
    
    return () => clearTimeout(initTimer);
  }, [user]);

  // Verificar quando a janela ganha foco (usuário volta da aba do Mercado Pago)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleFocus = async () => {
      console.log('🔄 Janela ganhou foco - verificando pagamento...');
      
      const params = getUrlParams();
      const userId = params.get('user_id') || user?.uid || '';
      const externalReference = params.get('external_reference') || '';
      const preferenceId = params.get('preference_id') || '';
      const tipoParam = params.get('tipo') as 'usuario' | 'profissional' | null;
      const tipo = tipoParam || 'usuario';
      
      // Buscar do localStorage se não estiver na URL
      let finalExternalReference = externalReference;
      let finalPreferenceId = preferenceId;
      
      if (!finalExternalReference && window.localStorage) {
        const stored = window.localStorage.getItem('last_external_reference');
        if (stored) finalExternalReference = stored;
      }
      
      if (!finalPreferenceId && window.localStorage) {
        const stored = window.localStorage.getItem('last_preference_id');
        if (stored) finalPreferenceId = stored;
      }
      
      if (userId && (finalExternalReference || finalPreferenceId)) {
        await verificarPagamentoCompleto(userId, finalExternalReference, finalPreferenceId, tipo);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleFocus();
      }
    });
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

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
            <>
              <Text style={styles.textoAguardando}>
                ⏳ Verificando automaticamente a cada 2 segundos...
              </Text>
              <Text style={styles.textoInstrucao}>
                💡 Se você já completou o pagamento no Mercado Pago, esta página detectará automaticamente em alguns segundos.
              </Text>
              <Text style={styles.textoInstrucao}>
                Você pode continuar navegando - sua assinatura será ativada automaticamente quando o pagamento for confirmado.
              </Text>
            </>
          )}
          <TouchableOpacity
            style={[styles.botao, styles.botaoSecundario, { marginTop: 20 }]}
            onPress={async () => {
              // Forçar verificação imediata
              const params = getUrlParams();
              const userId = params.get('user_id') || user?.uid || '';
              const externalReference = params.get('external_reference') || '';
              const preferenceId = params.get('preference_id') || '';
              const tipoParam = params.get('tipo') as 'usuario' | 'profissional' | null;
              const tipo = tipoParam || 'usuario';
              
              let finalExternalReference = externalReference;
              let finalPreferenceId = preferenceId;
              
              if (!finalExternalReference && typeof window !== 'undefined' && window.localStorage) {
                const stored = window.localStorage.getItem('last_external_reference');
                if (stored) finalExternalReference = stored;
              }
              
              if (!finalPreferenceId && typeof window !== 'undefined' && window.localStorage) {
                const stored = window.localStorage.getItem('last_preference_id');
                if (stored) finalPreferenceId = stored;
              }
              
              if (userId) {
                setMensagem('Verificando pagamento agora...');
                const verificado = await verificarPagamentoCompleto(userId, finalExternalReference, finalPreferenceId, tipo);
                if (!verificado) {
                  setMensagem('Pagamento ainda não confirmado. Continue aguardando ou verifique novamente em alguns instantes.');
                }
              }
            }}
          >
            <Text style={styles.textoBotaoSecundario}>Verificar Pagamento Agora</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
                router.push('/screens/blog_dicas' as any);
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
  textoInstrucao: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    maxWidth: 500,
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

