/**
 * Página de teste para configurar assinaturas manualmente
 * Acesse: /screens/testeAssinatura
 * 
 * ATENÇÃO: Esta página deve ser removida ou protegida em produção!
 */

import { auth, buscarDadosFirestore } from '@/back-end/Api';
import { verificarAssinatura } from '@/back-end/api.assinatura';
import { diagnosticarConfirmacaoPagamento } from '@/back-end/api.mercadoPago';
import { configurarAssinaturaManual, obterInfoAssinatura, removerAssinatura, simularCallbackPagamento, verificarFluxoPagamento } from '@/back-end/helpers/assinaturaHelper';
import Topo from '@/components/topo';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TesteAssinatura() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [infoAssinatura, setInfoAssinatura] = useState<any>(null);
  const [isAssinante, setIsAssinante] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (usuario && usuario.emailVerified) {
        setUser(usuario);
        // Verificar assinatura atual
        const assinante = await verificarAssinatura(usuario.uid);
        setIsAssinante(assinante);
        // Obter informações detalhadas
        const info = await obterInfoAssinatura(usuario.uid);
        setInfoAssinatura(info);
      } else {
        setUser(null);
        setIsAssinante(false);
        setInfoAssinatura(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const atualizarInfo = async () => {
    if (user) {
      const assinante = await verificarAssinatura(user.uid);
      setIsAssinante(assinante);
      const info = await obterInfoAssinatura(user.uid);
      setInfoAssinatura(info);
    }
  };

  const handleAtivarAssinatura = async (tipo: 'usuario' | 'profissional') => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    setProcessando(true);
    try {
      await configurarAssinaturaManual(user.uid, tipo, true, 1);
      Alert.alert('Sucesso', 'Assinatura ativada com sucesso!');
      await atualizarInfo();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao ativar assinatura');
    } finally {
      setProcessando(false);
    }
  };

  const handleRemoverAssinatura = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja remover a assinatura?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setProcessando(true);
            try {
              await removerAssinatura(user.uid);
              Alert.alert('Sucesso', 'Assinatura removida com sucesso!');
              await atualizarInfo();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao remover assinatura');
            } finally {
              setProcessando(false);
            }
          }
        }
      ]
    );
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

  if (!user) {
    return (
      <View style={styles.container}>
        <Topo />
        <View style={styles.content}>
          <Text style={styles.titulo}>Acesso Restrito</Text>
          <Text style={styles.descricao}>
            Você precisa estar logado para acessar esta página.
          </Text>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => router.push('/screens/login')}
          >
            <Text style={styles.textoBotao}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Topo />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.titulo}>Teste de Assinatura</Text>
          <Text style={styles.aviso}>
            ⚠️ Esta página é apenas para testes. Remova ou proteja em produção!
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Status Atual</Text>
            <Text style={styles.cardTexto}>
              Usuário: {user.email}
            </Text>
            <Text style={styles.cardTexto}>
              UserId: {user.uid}
            </Text>
            <Text style={[styles.cardTexto, isAssinante ? styles.ativo : styles.inativo]}>
              Assinante: {isAssinante ? '✅ Sim' : '❌ Não'}
            </Text>
          </View>

          {infoAssinatura && (
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Informações da Assinatura</Text>
              <Text style={styles.cardTexto}>
                Status: {infoAssinatura.status || 'N/A'}
              </Text>
              <Text style={styles.cardTexto}>
                Tipo: {infoAssinatura.tipoAssinatura || 'N/A'}
              </Text>
              <Text style={styles.cardTexto}>
                Data Início: {infoAssinatura.dataInicio ? new Date(infoAssinatura.dataInicio).toLocaleDateString('pt-BR') : 'N/A'}
              </Text>
              <Text style={styles.cardTexto}>
                Data Fim: {infoAssinatura.dataFim ? new Date(infoAssinatura.dataFim).toLocaleDateString('pt-BR') : 'N/A'}
              </Text>
              <Text style={styles.cardTexto}>
                Payment ID: {infoAssinatura.paymentId || 'N/A'}
              </Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Ações</Text>
            
            <TouchableOpacity
              style={[styles.botaoAcao, styles.botaoAtivar]}
              onPress={() => handleAtivarAssinatura('usuario')}
              disabled={processando}
            >
              <Text style={styles.textoBotaoAcao}>
                {processando ? 'Processando...' : 'Ativar Assinatura (Usuário)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoAcao, styles.botaoAtivar]}
              onPress={() => handleAtivarAssinatura('profissional')}
              disabled={processando}
            >
              <Text style={styles.textoBotaoAcao}>
                {processando ? 'Processando...' : 'Ativar Assinatura (Profissional)'}
              </Text>
            </TouchableOpacity>

            {isAssinante && (
              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoRemover]}
                onPress={handleRemoverAssinatura}
                disabled={processando}
              >
                <Text style={styles.textoBotaoAcao}>
                  Remover Assinatura
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.botaoAcao, styles.botaoAtualizar]}
              onPress={atualizarInfo}
              disabled={processando}
            >
              <Text style={styles.textoBotaoAcao}>
                Atualizar Informações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoAcao, styles.botaoTestar]}
              onPress={async () => {
                if (!user) {
                  Alert.alert('Erro', 'Você precisa estar logado');
                  return;
                }

                setProcessando(true);
                try {
                  Alert.alert(
                    'Simular Pagamento',
                    'Isso simulará o fluxo completo de pagamento. Deseja continuar?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Simular',
                        onPress: async () => {
                          try {
                            // Determinar tipo
                            const dadosUsuario = await buscarDadosFirestore(user.uid);
                            const tipo = dadosUsuario && 'crp' in dadosUsuario ? 'profissional' : 'usuario';
                            
                            await simularCallbackPagamento(user.uid, tipo, 'approved');
                            Alert.alert('Sucesso', 'Fluxo de pagamento simulado com sucesso!');
                            await atualizarInfo();
                          } catch (error: any) {
                            Alert.alert('Erro', error.message || 'Erro ao simular pagamento');
                          }
                        }
                      }
                    ]
                  );
                } finally {
                  setProcessando(false);
                }
              }}
              disabled={processando}
            >
              <Text style={styles.textoBotaoAcao}>
                {processando ? 'Processando...' : 'Simular Fluxo de Pagamento'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoAcao, styles.botaoVerificar]}
              onPress={async () => {
                if (!user) {
                  Alert.alert('Erro', 'Você precisa estar logado');
                  return;
                }

                setProcessando(true);
                try {
                  const resultado = await verificarFluxoPagamento(user.uid);
                  const mensagem = resultado.verificacoes
                    .map(v => `${v.status ? '✅' : '❌'} ${v.nome}: ${v.mensagem}`)
                    .join('\n');
                  
                  Alert.alert(
                    resultado.sucesso ? 'Verificação OK' : 'Problemas Encontrados',
                    mensagem,
                    [{ text: 'OK' }]
                  );
                } catch (error: any) {
                  Alert.alert('Erro', error.message || 'Erro ao verificar fluxo');
                } finally {
                  setProcessando(false);
                }
              }}
              disabled={processando}
            >
              <Text style={styles.textoBotaoAcao}>
                {processando ? 'Verificando...' : 'Verificar Fluxo Completo'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.botaoAcao, { backgroundColor: '#2196F3', marginTop: 12 }]}
            onPress={async () => {
              if (!user) {
                Alert.alert('Erro', 'Você precisa estar logado');
                return;
              }

              setProcessando(true);
              try {
                // Obter external_reference e preference_id da última assinatura
                const info = await obterInfoAssinatura(user.uid);
                // Buscar dados completos do Firestore para obter external_reference e preference_id
                const dadosCompletos = await buscarDadosFirestore(user.uid);
                const externalRef = (dadosCompletos?.assinatura as any)?.external_reference || 
                                   (info as any)?.external_reference || '';
                const preferenceId = (dadosCompletos?.assinatura as any)?.preference_id || 
                                    (info as any)?.preference_id || '';
                
                if (!externalRef && !preferenceId) {
                  Alert.alert(
                    'Informação Necessária',
                    'Para diagnosticar, você precisa ter feito pelo menos uma tentativa de pagamento.\n\nSe você acabou de fazer um pagamento, aguarde alguns segundos e tente novamente.',
                    [{ text: 'OK' }]
                  );
                  setProcessando(false);
                  return;
                }
                
                console.log('🔬 Iniciando diagnóstico de confirmação do Mercado Pago...');
                console.log('Dados disponíveis:', { externalRef, preferenceId });
                
                const diagnostico = await diagnosticarConfirmacaoPagamento(
                  preferenceId || undefined,
                  externalRef || undefined
                );
                
                const detalhes = `📊 RELATÓRIO:\n\n${diagnostico.mensagem}\n\n📋 Detalhes:\n• Preference ID: ${diagnostico.dados.preferenceId || 'N/A'}\n• External Reference: ${diagnostico.dados.externalReference || 'N/A'}\n• Pagamentos Encontrados: ${diagnostico.dados.pagamentosEncontrados}\n\n${diagnostico.dados.ultimoPagamento ? `📝 Último Pagamento:\n• ID: ${diagnostico.dados.ultimoPagamento.id}\n• Status: ${diagnostico.dados.ultimoPagamento.status}\n• Data: ${new Date(diagnostico.dados.ultimoPagamento.date_created || 0).toLocaleString('pt-BR')}\n` : '⚠️ Nenhum pagamento encontrado.'}\n\n💡 Verifique o console para mais detalhes.`;
                
                Alert.alert(
                  diagnostico.sucesso ? '✅ Confirmação Encontrada' : '⚠️ Confirmação Não Encontrada',
                  detalhes,
                  [{ text: 'OK' }]
                );
                
                console.log('📋 Relatório completo:', diagnostico);
              } catch (error: any) {
                console.error('❌ Erro no diagnóstico:', error);
                Alert.alert('Erro', `Erro ao verificar: ${error.message}\n\nVerifique o console.`);
              } finally {
                setProcessando(false);
              }
            }}
            disabled={processando}
          >
            <Text style={styles.textoBotaoAcao}>
              {processando ? 'Diagnosticando...' : '🔬 Diagnosticar Confirmação Mercado Pago'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botao}
            onPress={() => router.push('/screens/assinatura')}
          >
            <Text style={styles.textoBotao}>Ir para Página de Assinatura</Text>
          </TouchableOpacity>
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
  aviso: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    width: '100%',
    maxWidth: 600,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 600,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0b2157',
    marginBottom: 12,
  },
  cardTexto: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  ativo: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  inativo: {
    color: '#F44336',
    fontWeight: '600',
  },
  botaoAcao: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  botaoAtivar: {
    backgroundColor: '#4CAF50',
  },
  botaoRemover: {
    backgroundColor: '#F44336',
  },
  botaoAtualizar: {
    backgroundColor: '#336BF7',
  },
  botaoTestar: {
    backgroundColor: '#9C27B0',
  },
  botaoVerificar: {
    backgroundColor: '#FF9800',
  },
  textoBotaoAcao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  botao: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  descricao: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
});

