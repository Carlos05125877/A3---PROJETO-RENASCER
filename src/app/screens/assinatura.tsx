import { auth, buscarDadosFirestore } from '@/back-end/Api';
import { criarPreferenciaPagamento, processarCallbackPagamento, verificarAssinatura } from '@/back-end/api.assinatura';
import Topo from '@/components/topo';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Função helper para obter parâmetros da URL
const getUrlParams = (): URLSearchParams => {
  if (typeof window !== 'undefined' && window.location) {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

export default function Assinatura() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAssinante, setIsAssinante] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [processandoPagamento, setProcessandoPagamento] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (usuario && usuario.emailVerified) {
        setUser(usuario);
        const assinante = await verificarAssinatura(usuario.uid);
        setIsAssinante(assinante);
      } else {
        setUser(null);
        setIsAssinante(false);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  // PROCESSAR PAGAMENTO AUTOMATICAMENTE quando detectar parâmetros do Mercado Pago
  // Isso garante que o pagamento seja processado ANTES de qualquer redirecionamento
  useEffect(() => {
    const processarPagamentoAutomatico = async () => {
      const params = getUrlParams();
      
      // Verificar se há parâmetros indicando retorno do pagamento
      const paymentId = params.get('payment_id') || params.get('collection_id') || params.get('preference_id');
      const status = params.get('collection_status') || params.get('status');
      const externalRef = params.get('external_reference');
      const userIdParam = params.get('user_id');
      
      if (paymentId || status || externalRef) {
        console.log('=== 🔄 PROCESSANDO PAGAMENTO AUTOMATICAMENTE ===');
        console.log('Parâmetros detectados:', { paymentId, status, externalRef, userIdParam });
        
        // Se o usuário está logado, processar o pagamento IMEDIATAMENTE
        if (user && user.emailVerified) {
          try {
            // Determinar userId e tipo
            let finalUserId = userIdParam || user.uid;
            let tipo: 'usuario' | 'profissional' = 'usuario';
            
            // Extrair do external_reference se disponível
            if (externalRef) {
              const parts = externalRef.split('_');
              if (parts.length >= 2) {
                finalUserId = parts[0] || finalUserId;
                tipo = (parts[1] as 'usuario' | 'profissional') || 'usuario';
              }
            }
            
            // Determinar status final
            let statusFinal = status || 'approved';
            if (statusFinal === 'aprovado') statusFinal = 'approved';
            
            console.log('Processando callback com:', { paymentId, statusFinal, userId: finalUserId, tipo });
            
            // IMPORTANTE: Processar o callback ANTES de qualquer verificação
            // Isso garante que o Firestore seja atualizado
            if (finalUserId && (statusFinal === 'approved' || statusFinal === 'pending')) {
              await processarCallbackPagamento(
                paymentId || 'pending',
                statusFinal,
                finalUserId,
                tipo
              );
              console.log('✅ Pagamento processado e salvo no Firestore!');
            }
            
            // Aguardar um pouco para garantir que foi salvo
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar se foi salvo corretamente
            const assinante = await verificarAssinatura(finalUserId);
            setIsAssinante(assinante);
            
            if (assinante) {
              console.log('✅ Assinatura confirmada após processamento automático!');
              Alert.alert(
                'Pagamento Aprovado!',
                'Sua assinatura foi ativada com sucesso! Agora você tem acesso completo ao blog.',
                [{ text: 'OK', onPress: () => {
                  // Limpar parâmetros da URL
                  if (typeof window !== 'undefined') {
                    window.history.replaceState({}, '', '/screens/assinatura');
                  }
                  router.replace('/screens/assinatura');
                }}]
              );
            } else if (statusFinal === 'approved' || statusFinal === 'aprovado') {
              console.log('⚠️ Pagamento aprovado mas assinatura ainda não detectada');
              Alert.alert(
                'Pagamento em Processamento',
                'Seu pagamento foi aprovado e está sendo processado. Aguarde alguns instantes...',
                [{ text: 'OK' }]
              );
              // Verificar novamente após alguns segundos
              setTimeout(async () => {
                const assinanteNovo = await verificarAssinatura(finalUserId);
                if (assinanteNovo) {
                  setIsAssinante(true);
                  Alert.alert(
                    'Assinatura Ativada!',
                    'Sua assinatura foi ativada com sucesso!',
                    [{ text: 'OK' }]
                  );
                }
              }, 3000);
            }
          } catch (error: any) {
            console.error('❌ Erro ao processar pagamento automaticamente:', error);
            Alert.alert(
              'Erro ao Processar',
              'Houve um erro ao processar seu pagamento. Por favor, tente novamente ou entre em contato com o suporte.',
              [{ text: 'OK' }]
            );
          }
        }
      }
    };

    if (user && !carregando) {
      processarPagamentoAutomatico();
    }
  }, [user, carregando]);

  // Verificar assinatura periodicamente quando não é assinante (para detectar pagamento aprovado)
  useEffect(() => {
    if (!isAssinante && user && user.emailVerified && !carregando) {
      console.log('Usuário não é assinante, verificando periodicamente...');
      
      // Verificação imediata ao montar o componente
      const verificarImediatamente = async () => {
        const assinante = await verificarAssinatura(user.uid);
        if (assinante && !isAssinante) {
          console.log('✅ Assinatura detectada na verificação imediata! Redirecionando para PagamentoSucesso...');
          setIsAssinante(true);
          // Redirecionar para PagamentoSucesso para mostrar confirmação
          router.push(`/screens/pagamentoSucesso?user_id=${user.uid}&status=approved`);
        }
      };
      
      verificarImediatamente();
      
      // Verificação periódica a cada 3 segundos para detectar pagamento
      // Quando detectar, redireciona para PagamentoSucesso
      const interval = setInterval(async () => {
        console.log('Verificando assinatura periodicamente...');
        const assinante = await verificarAssinatura(user.uid);
        if (assinante && !isAssinante) {
          console.log('✅ Assinatura detectada! Redirecionando para PagamentoSucesso...');
          setIsAssinante(true);
          clearInterval(interval); // Parar verificação
          
          // Redirecionar para PagamentoSucesso para mostrar confirmação
          router.push(`/screens/pagamentoSucesso?user_id=${user.uid}&status=approved`);
        }
      }, 3000); // Verificar a cada 3 segundos (mais frequente)

      return () => clearInterval(interval);
    }
  }, [isAssinante, user, carregando]);

  const handleAssinar = async () => {
    console.log('=== BOTÃO ASSINAR CLICADO ===');
    
    if (!user) {
      console.log('Usuário não logado, redirecionando para login');
      Alert.alert('Atenção', 'Você precisa estar logado para assinar. Redirecionando para login...');
      router.push('/screens/login');
      return;
    }

    console.log('Usuário logado:', user.uid);
    setProcessandoPagamento(true);

    try {
      console.log('Buscando dados do usuário...');
      // Buscar dados do usuário para determinar a coleção
      const dadosUsuario = await buscarDadosFirestore(user.uid);
      console.log('Dados do usuário:', dadosUsuario ? 'encontrados' : 'não encontrados');
      
      const colecao = dadosUsuario && 'crp' in dadosUsuario ? 'profissionais' : 'users';
      const tipoAssinatura = colecao === 'profissionais' ? 'profissional' : 'usuario';
      const valor = tipoAssinatura === 'profissional' ? 39.00 : 9.99;
      const descricao = tipoAssinatura === 'profissional' 
        ? 'Assinatura Profissional - Renascer' 
        : 'Assinatura Usuário - Renascer';
      
      console.log('Configuração:', { tipoAssinatura, valor, descricao });

      // Criar preferência de pagamento
      console.log('Criando preferência de pagamento...');
      let checkoutUrl: string | null = null;
      let preferenceId: string | null = null;
      let externalReference: string | null = null;
      
      try {
        const resultado = await criarPreferenciaPagamento(valor, descricao, user.uid, tipoAssinatura);
        checkoutUrl = resultado.checkoutUrl;
        preferenceId = resultado.preferenceId;
        externalReference = resultado.externalReference;
        
        console.log('✅ URL de checkout gerada:', checkoutUrl ? checkoutUrl.substring(0, 50) + '...' : 'vazia');
        console.log('✅ Preference ID:', preferenceId);
        console.log('✅ External Reference:', externalReference);
      } catch (error: any) {
        console.error('❌ Erro ao criar preferência:', error);
        setProcessandoPagamento(false);
        Alert.alert(
          'Erro ao processar pagamento',
          error.message || 'Não foi possível criar a preferência de pagamento. Verifique suas credenciais do Mercado Pago e tente novamente.',
          [{ text: 'OK' }]
        );
        return; // Sair se não conseguiu criar a preferência
      }
      
      if (!checkoutUrl || checkoutUrl.trim() === '') {
        console.error('❌ URL de checkout vazia');
        setProcessandoPagamento(false);
        Alert.alert(
          'Erro',
          'URL de checkout não foi gerada. Verifique as credenciais do Mercado Pago.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Abrir URL de checkout em NOVA ABA
      console.log('🔗 Abrindo checkout do Mercado Pago em NOVA ABA...');
      console.log('URL completa:', checkoutUrl);
      
      // Para web, SEMPRE abrir em nova aba para permitir que o usuário continue navegando
      if (typeof window !== 'undefined') {
        console.log('🌐 Ambiente web detectado - abrindo em nova aba');
        
        // Estratégia 1: window.open com _blank (abre em nova aba)
        try {
          console.log('Abrindo em nova aba com window.open...');
          const newWindow = window.open(
            checkoutUrl, 
            '_blank',
            'noopener,noreferrer'
          );
          
            if (newWindow) {
            console.log('✅ Nova aba aberta com sucesso!');
            setProcessandoPagamento(false);
            
            // Salvar preferenceId e externalReference no localStorage para diagnóstico
            if (typeof window !== 'undefined' && window.localStorage) {
              if (preferenceId) {
                localStorage.setItem('last_preference_id', preferenceId);
                console.log('💾 Preference ID salvo no localStorage:', preferenceId);
              }
              if (externalReference) {
                localStorage.setItem('last_external_reference', externalReference);
                console.log('💾 External Reference salvo no localStorage:', externalReference);
              }
            }
            
            // IMEDIATAMENTE redirecionar para PagamentoSucesso na aba original
            // A página PagamentoSucesso ficará aguardando e verificando o pagamento automaticamente
            // Passar external_reference e preference_id para verificação via API
            // IMPORTANTE: Sempre passar external_reference e preference_id se disponíveis
            const params = new URLSearchParams({
              user_id: user.uid,
              tipo: tipoAssinatura,
              status: 'waiting'
            });
            
            // Adicionar external_reference e preference_id se disponíveis
            if (externalReference) {
              params.set('external_reference', externalReference);
              console.log('✅ External Reference adicionado aos parâmetros:', externalReference);
            } else {
              console.warn('⚠️ External Reference não disponível!');
            }
            
            if (preferenceId) {
              params.set('preference_id', preferenceId);
              console.log('✅ Preference ID adicionado aos parâmetros:', preferenceId);
            } else {
              console.warn('⚠️ Preference ID não disponível!');
            }
            
            console.log('🔄 Redirecionando para PagamentoSucesso para aguardar confirmação...');
            console.log('Parâmetros enviados:', Object.fromEntries(params.entries()));
            console.log('URL completa:', `/screens/pagamentoSucesso?${params.toString()}`);
            
            router.push(`/screens/pagamentoSucesso?${params.toString()}`);
            return;
          } else {
            console.warn('⚠️ window.open retornou null (pode ser bloqueado por popup blocker)');
          }
        } catch (err) {
          console.error('Erro com window.open:', err);
        }
        
        // Estratégia 2: Tentar novamente sem configurações extras
        try {
          console.log('Tentando abrir novamente (segunda tentativa)...');
          const retryWindow = window.open(checkoutUrl, '_blank');
          if (retryWindow) {
            console.log('✅ Nova aba aberta na segunda tentativa');
            setProcessandoPagamento(false);
            Alert.alert(
              'Pagamento Aberto',
              'A página de pagamento foi aberta em uma nova aba. Complete o pagamento e continue navegando aqui.',
              [{ text: 'OK' }]
            );
            return;
          }
        } catch (err) {
          console.error('Erro na segunda tentativa:', err);
        }
        
        // Se chegou aqui, popup foi bloqueado
        console.error('❌ Não foi possível abrir em nova aba (popup bloqueado?)');
        Alert.alert(
          'Popup Bloqueado',
          'Não foi possível abrir o pagamento em uma nova aba. Por favor, permita pop-ups para este site e tente novamente, ou clique em "Abrir na Mesma Aba".',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Abrir na Mesma Aba', 
              onPress: () => {
                window.location.href = checkoutUrl;
              }
            }
          ]
        );
        setProcessandoPagamento(false);
        return;
      }
      
      // Para React Native, usar Linking
      if (Linking && Linking.canOpenURL) {
        try {
          console.log('📱 Ambiente React Native detectado');
          const canOpen = await Linking.canOpenURL(checkoutUrl);
          if (canOpen) {
            await Linking.openURL(checkoutUrl);
            console.log('✅ URL aberta com Linking');
            return;
          } else {
            console.error('❌ Linking.canOpenURL retornou false');
          }
        } catch (linkError) {
          console.error('❌ Erro ao usar Linking:', linkError);
        }
      }
      
      // Último fallback
      console.error('❌ Nenhum método de redirecionamento disponível');
      setProcessandoPagamento(false);
      Alert.alert(
        'Erro',
        `Não foi possível abrir o link de pagamento automaticamente. Por favor, acesse manualmente:\n\n${checkoutUrl}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('❌ Erro geral ao processar assinatura:', error);
      setProcessandoPagamento(false);
      Alert.alert(
        'Erro', 
        `Não foi possível processar o pagamento: ${error.message || 'Erro desconhecido'}. Tente novamente mais tarde.`
      );
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <Topo />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#336BF7" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  if (isAssinante) {
    return (
      <View style={styles.container}>
        <Topo />
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.successCard}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Você já é um assinante!</Text>
              <Text style={styles.successText}>
                Sua assinatura está ativa e você tem acesso completo ao blog e todos os conteúdos exclusivos.
              </Text>
              <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => router.push('/')}
              >
                <Text style={styles.textoBotaoVoltar}>Voltar para Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    
      <View style={{flex: 1}}>
        <View style={{  zIndex: 1 }}>
          <Topo />
        </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.titulo}>Assinatura Renascer</Text>
          <View style={styles.linha} />

          <View style={styles.cardPlano}>
            <Text style={styles.tituloPlano}>Plano Mensal</Text>
            <View style={styles.precoContainer}>
              <Text style={styles.preco}>R$ 9,99</Text>
              <Text style={styles.precoPeriodo}>/mês</Text>
            </View>
            <Text style={styles.descricaoPlano}>
              Acesso completo ao blog com artigos exclusivos sobre saúde mental
            </Text>

            <View style={styles.beneficiosContainer}>
              <Text style={styles.beneficiosTitulo}>Benefícios:</Text>
              <View style={styles.beneficioItem}>
                <Text style={styles.beneficioIcon}>✓</Text>
                <Text style={styles.beneficioTexto}>Acesso ilimitado a todos os artigos do blog</Text>
              </View>
              <View style={styles.beneficioItem}>
                <Text style={styles.beneficioIcon}>✓</Text>
                <Text style={styles.beneficioTexto}>Conteúdo exclusivo e atualizado</Text>
              </View>
              <View style={styles.beneficioItem}>
                <Text style={styles.beneficioIcon}>✓</Text>
                <Text style={styles.beneficioTexto}>Suporte prioritário</Text>
              </View>
              <View style={styles.beneficioItem}>
                <Text style={styles.beneficioIcon}>✓</Text>
                <Text style={styles.beneficioTexto}>Cancelamento a qualquer momento</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.botaoAssinar, processandoPagamento && styles.botaoAssinarDisabled]}
              onPress={() => {
                console.log('Botão pressionado!');
                handleAssinar();
              }}
              disabled={processandoPagamento}
              activeOpacity={0.7}
            >
              {processandoPagamento ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.textoBotaoAssinar}>Assinar Agora</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.textoAviso}>
              Pagamento seguro via Mercado Pago. O pagamento será aberto em uma nova aba para que você possa continuar navegando aqui.
            </Text>
            <Text style={styles.textoAvisoImportante}>
              ✅ O pagamento será aberto em uma nova aba. Após completar o pagamento, você será redirecionado automaticamente para a tela de confirmação. Se isso não acontecer, você pode continuar navegando aqui - sua assinatura será ativada automaticamente em alguns segundos.
            </Text>
            
            
            
          </View>

          <View style={styles.infoAdicional}>
            <Text style={styles.infoTitulo}>Como funciona?</Text>
            <Text style={styles.infoTexto}>
              1. Clique em "Assinar Agora"{'\n'}
              2. Você será redirecionado para o Mercado Pago{'\n'}
              3. Complete o pagamento{'\n'}
              4. Após o pagamento, retorne para esta página (use o botão voltar do navegador ou acesse: /screens/assinatura){'\n'}
              5. Sua assinatura será ativada automaticamente em alguns segundos{'\n'}
              6. O acesso ao blog será liberado automaticamente!
            </Text>
            <Text style={styles.infoTextoImportante}>
              💡 Dica: Após pagar no Mercado Pago, você pode simplesmente fechar a aba e voltar para esta página. O sistema detectará automaticamente seu pagamento!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
  titulo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 8,
    textAlign: 'center',
  },
  linha: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 24,
    width: '100%',
  },
  cardPlano: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  tituloPlano: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0b2157',
    marginBottom: 16,
    textAlign: 'center',
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  preco: {
    fontSize: 48,
    fontWeight: '700',
    color: '#336BF7',
  },
  precoPeriodo: {
    fontSize: 20,
    color: '#666',
    marginLeft: 8,
  },
  descricaoPlano: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  beneficiosContainer: {
    marginBottom: 32,
  },
  beneficiosTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b2157',
    marginBottom: 16,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  beneficioIcon: {
    fontSize: 20,
    color: '#336BF7',
    marginRight: 12,
    fontWeight: '700',
  },
  beneficioTexto: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  botaoAssinar: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  botaoAssinarDisabled: {
    opacity: 0.6,
  },
  textoBotaoAssinar: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  textoAviso: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  textoAvisoImportante: {
    fontSize: 13,
    color: '#4CAF50',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    fontWeight: '600',
  },
  infoAdicional: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 600,
  },
  infoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b2157',
    marginBottom: 12,
  },
  infoTexto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  infoTextoImportante: {
    fontSize: 13,
    color: '#4CAF50',
    lineHeight: 20,
    marginTop: 12,
    fontStyle: 'italic',
  },
  botaoDiagnostico: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoDiagnostico: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successIcon: {
    fontSize: 64,
    color: '#4CAF50',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  botaoVoltar: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  textoBotaoVoltar: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

