import { auth, buscarDadosFirestore } from '@/back-end/Api';
import { verificarAssinatura } from '@/back-end/api.assinatura';
import {
    buscarPagamentoPorPreferencia,
    buscarPagamentoPorReferencia,
    diagnosticarConfirmacaoPagamento
} from '@/back-end/api.mercadoPago';
import { MERCADO_PAGO_ACCESS_TOKEN } from '@/back-end/mercadoPagoConfig';
import Topo from '@/components/topo';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Função helper para obter parâmetros da URL
const getUrlParams = (): URLSearchParams => {
  if (typeof window !== 'undefined' && window.location) {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

interface DiagnosticoItem {
  nome: string;
  status: 'success' | 'error' | 'warning' | 'info' | 'loading';
  mensagem: string;
  detalhes?: string;
  timestamp?: string;
}

export default function DiagnosticoPagamento() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoItem[]>([]);
  const [processando, setProcessando] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [externalReference, setExternalReference] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUser(usuario);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Tentar obter preferenceId e externalReference da URL ou localStorage
    const params = getUrlParams();
    const urlPreferenceId = params.get('preference_id') || '';
    const urlExternalRef = params.get('external_reference') || '';

    if (urlPreferenceId) setPreferenceId(urlPreferenceId);
    if (urlExternalRef) setExternalReference(urlExternalRef);

    // Tentar obter do localStorage
    if (typeof window !== 'undefined') {
      const storedPreferenceId = localStorage.getItem('last_preference_id');
      const storedExternalRef = localStorage.getItem('last_external_reference');
      
      if (storedPreferenceId && !urlPreferenceId) setPreferenceId(storedPreferenceId);
      if (storedExternalRef && !urlExternalRef) setExternalReference(storedExternalRef);
    }
  }, []);

  const adicionarDiagnostico = (
    nome: string,
    status: DiagnosticoItem['status'],
    mensagem: string,
    detalhes?: string
  ) => {
    setDiagnosticos(prev => [...prev, {
      nome,
      status,
      mensagem,
      detalhes,
      timestamp: new Date().toLocaleTimeString('pt-BR')
    }]);
  };

  const limparDiagnosticos = () => {
    setDiagnosticos([]);
  };

  const executarDiagnosticoCompleto = async () => {
    setProcessando(true);
    limparDiagnosticos();

    try {
      // 1. Verificar usuário
      adicionarDiagnostico('Verificação de Usuário', 'loading', 'Verificando usuário logado...');
      if (!user) {
        adicionarDiagnostico('Usuário Logado', 'error', 'Nenhum usuário logado', 'Faça login para continuar');
        setProcessando(false);
        return;
      }
      adicionarDiagnostico('Usuário Logado', 'success', `Usuário: ${user.uid.substring(0, 20)}...`);

      // 2. Verificar dados do usuário no Firestore
      adicionarDiagnostico('Dados do Firestore', 'loading', 'Buscando dados do usuário...');
      try {
        const dadosUsuario = await buscarDadosFirestore(user.uid);
        if (dadosUsuario) {
          const temAssinatura = !!dadosUsuario.assinatura;
          adicionarDiagnostico(
            'Dados do Firestore',
            'success',
            'Dados encontrados',
            temAssinatura 
              ? `Assinatura: ${dadosUsuario.assinatura.isAssinante ? 'Ativa' : 'Inativa'}`
              : 'Nenhuma assinatura encontrada'
          );
        } else {
          adicionarDiagnostico('Dados do Firestore', 'warning', 'Usuário não encontrado no Firestore');
        }
      } catch (error: any) {
        adicionarDiagnostico('Dados do Firestore', 'error', 'Erro ao buscar dados', error.message);
      }

      // 3. Verificar assinatura atual
      adicionarDiagnostico('Status da Assinatura', 'loading', 'Verificando assinatura...');
      try {
        const isAssinante = await verificarAssinatura(user.uid);
        adicionarDiagnostico(
          'Status da Assinatura',
          isAssinante ? 'success' : 'warning',
          isAssinante ? 'Usuário é assinante' : 'Usuário não é assinante'
        );
      } catch (error: any) {
        adicionarDiagnostico('Status da Assinatura', 'error', 'Erro ao verificar', error.message);
      }

      // 4. Verificar preferenceId e externalReference
      adicionarDiagnostico('Parâmetros de Pagamento', 'loading', 'Verificando parâmetros...');
      if (!preferenceId && !externalReference) {
        adicionarDiagnostico(
          'Parâmetros de Pagamento',
          'warning',
          'Nenhum parâmetro encontrado',
          'Faça uma tentativa de pagamento primeiro ou insira manualmente'
        );
      } else {
        if (preferenceId) {
          adicionarDiagnostico('Preference ID', 'info', `Encontrado: ${preferenceId.substring(0, 30)}...`);
        }
        if (externalReference) {
          adicionarDiagnostico('External Reference', 'info', `Encontrado: ${externalReference}`);
        }
      }

      // 5. Verificar pagamentos no Mercado Pago por Preference ID
      if (preferenceId) {
        adicionarDiagnostico('Busca por Preference ID', 'loading', 'Buscando pagamentos no Mercado Pago...');
        try {
          const pagamento = await buscarPagamentoPorPreferencia(preferenceId);
          if (pagamento) {
            const status = pagamento.status || pagamento.collection_status;
            adicionarDiagnostico(
              'Busca por Preference ID',
              status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'error',
              `Pagamento encontrado: ${status}`,
              `ID: ${pagamento.id}, Status: ${status}, Valor: R$ ${pagamento.transaction_amount || 'N/A'}`
            );
          } else {
            adicionarDiagnostico('Busca por Preference ID', 'warning', 'Nenhum pagamento encontrado');
          }
        } catch (error: any) {
          adicionarDiagnostico('Busca por Preference ID', 'error', 'Erro na busca', error.message);
        }
      }

      // 6. Verificar pagamentos no Mercado Pago por External Reference
      if (externalReference) {
        adicionarDiagnostico('Busca por External Reference', 'loading', 'Buscando pagamentos no Mercado Pago...');
        try {
          const pagamento = await buscarPagamentoPorReferencia(externalReference);
          if (pagamento) {
            const status = pagamento.status || pagamento.collection_status;
            adicionarDiagnostico(
              'Busca por External Reference',
              status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'error',
              `Pagamento encontrado: ${status}`,
              `ID: ${pagamento.id}, Status: ${status}, Valor: R$ ${pagamento.transaction_amount || 'N/A'}`
            );
          } else {
            adicionarDiagnostico('Busca por External Reference', 'warning', 'Nenhum pagamento encontrado');
          }
        } catch (error: any) {
          adicionarDiagnostico('Busca por External Reference', 'error', 'Erro na busca', error.message);
        }
      }

      // 7. Diagnóstico completo do Mercado Pago
      if (preferenceId || externalReference) {
        adicionarDiagnostico('Diagnóstico Completo MP', 'loading', 'Executando diagnóstico completo...');
        try {
          const resultado = await diagnosticarConfirmacaoPagamento(preferenceId || undefined, externalReference || undefined);
          if (resultado.sucesso) {
            adicionarDiagnostico(
              'Diagnóstico Completo MP',
              'success',
              resultado.mensagem,
              `Pagamentos encontrados: ${resultado.dados.pagamentosEncontrados}`
            );
            if (resultado.dados.pagamentoAprovado) {
              adicionarDiagnostico(
                'Pagamento Aprovado',
                'success',
                'Pagamento aprovado encontrado!',
                `ID: ${resultado.dados.pagamentoAprovado.id}, Status: ${resultado.dados.pagamentoAprovado.status}`
              );
            }
          } else {
            adicionarDiagnostico('Diagnóstico Completo MP', 'warning', resultado.mensagem);
          }
        } catch (error: any) {
          adicionarDiagnostico('Diagnóstico Completo MP', 'error', 'Erro no diagnóstico', error.message);
        }
      }

      // 8. Verificar URL atual
      adicionarDiagnostico('URL Atual', 'info', typeof window !== 'undefined' ? window.location.href : 'N/A');

      // 9. Verificar parâmetros da URL
      const params = getUrlParams();
      const paramsObj = Object.fromEntries(params.entries());
      if (Object.keys(paramsObj).length > 0) {
        adicionarDiagnostico('Parâmetros da URL', 'info', 'Parâmetros encontrados', JSON.stringify(paramsObj, null, 2));
      } else {
        adicionarDiagnostico('Parâmetros da URL', 'warning', 'Nenhum parâmetro na URL');
      }

      // 10. Verificar configuração do Access Token
      adicionarDiagnostico('Configuração do Token', 'loading', 'Verificando token...');
      try {
        if (MERCADO_PAGO_ACCESS_TOKEN && MERCADO_PAGO_ACCESS_TOKEN.trim() !== '') {
          const isTest = MERCADO_PAGO_ACCESS_TOKEN.includes('TEST-') || MERCADO_PAGO_ACCESS_TOKEN.startsWith('TEST');
          adicionarDiagnostico(
            'Configuração do Token',
            'success',
            `Token configurado (${isTest ? 'TESTE' : 'PRODUÇÃO'})`,
            `Token: ${MERCADO_PAGO_ACCESS_TOKEN.substring(0, 20)}...`
          );
        } else {
          adicionarDiagnostico('Configuração do Token', 'error', 'Token não configurado');
        }
      } catch (error: any) {
        adicionarDiagnostico('Configuração do Token', 'error', 'Erro ao verificar token', error.message);
      }

    } catch (error: any) {
      adicionarDiagnostico('Erro Geral', 'error', 'Erro inesperado', error.message);
    } finally {
      setProcessando(false);
    }
  };

  const verificarPagamentoEspecifico = async () => {
    if (!preferenceId && !externalReference) {
      Alert.alert('Atenção', 'Insira um Preference ID ou External Reference para verificar');
      return;
    }

    setProcessando(true);
    limparDiagnosticos();

    try {
      if (preferenceId) {
        adicionarDiagnostico('Verificação Específica', 'loading', `Verificando preference_id: ${preferenceId}...`);
        const pagamento = await buscarPagamentoPorPreferencia(preferenceId);
        if (pagamento) {
          adicionarDiagnostico(
            'Pagamento Encontrado',
            'success',
            `Status: ${pagamento.status || pagamento.collection_status}`,
            JSON.stringify(pagamento, null, 2)
          );
        } else {
          adicionarDiagnostico('Pagamento Encontrado', 'warning', 'Nenhum pagamento encontrado para este preference_id');
        }
      }

      if (externalReference) {
        adicionarDiagnostico('Verificação Específica', 'loading', `Verificando external_reference: ${externalReference}...`);
        const pagamento = await buscarPagamentoPorReferencia(externalReference);
        if (pagamento) {
          adicionarDiagnostico(
            'Pagamento Encontrado',
            'success',
            `Status: ${pagamento.status || pagamento.collection_status}`,
            JSON.stringify(pagamento, null, 2)
          );
        } else {
          adicionarDiagnostico('Pagamento Encontrado', 'warning', 'Nenhum pagamento encontrado para este external_reference');
        }
      }
    } catch (error: any) {
      adicionarDiagnostico('Erro', 'error', 'Erro ao verificar pagamento', error.message);
    } finally {
      setProcessando(false);
    }
  };

  const getStatusColor = (status: DiagnosticoItem['status']) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      case 'loading': return '#9E9E9E';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: DiagnosticoItem['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'loading': return '⏳';
      default: return '•';
    }
  };

  return (
    <View style={styles.container}>
      <Topo />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>🔬 Diagnóstico de Pagamento</Text>
        <Text style={styles.descricao}>
          Esta ferramenta verifica todos os aspectos do sistema de pagamento para identificar problemas.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Parâmetros de Busca</Text>
          <Text style={styles.label}>Preference ID (opcional):</Text>
          <Text style={styles.input}>{preferenceId || 'Não encontrado'}</Text>
          <Text style={styles.label}>External Reference (opcional):</Text>
          <Text style={styles.input}>{externalReference || 'Não encontrado'}</Text>
          <Text style={styles.aviso}>
            💡 Estes valores são obtidos automaticamente da última tentativa de pagamento ou da URL atual.
          </Text>
        </View>

        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoPrincipal]}
            onPress={executarDiagnosticoCompleto}
            disabled={processando}
          >
            {processando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.textoBotao}>🔍 Executar Diagnóstico Completo</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, styles.botaoSecundario]}
            onPress={verificarPagamentoEspecifico}
            disabled={processando || (!preferenceId && !externalReference)}
          >
            <Text style={styles.textoBotao}>🔎 Verificar Pagamento Específico</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, styles.botaoLimpar]}
            onPress={limparDiagnosticos}
            disabled={processando}
          >
            <Text style={styles.textoBotao}>🗑️ Limpar Resultados</Text>
          </TouchableOpacity>
        </View>

        {diagnosticos.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Resultados do Diagnóstico</Text>
            {diagnosticos.map((item, index) => (
              <View key={index} style={styles.diagnosticoItem}>
                <View style={styles.diagnosticoHeader}>
                  <Text style={styles.diagnosticoIcon}>{getStatusIcon(item.status)}</Text>
                  <Text style={[styles.diagnosticoNome, { color: getStatusColor(item.status) }]}>
                    {item.nome}
                  </Text>
                  {item.timestamp && (
                    <Text style={styles.diagnosticoTimestamp}>{item.timestamp}</Text>
                  )}
                </View>
                <Text style={styles.diagnosticoMensagem}>{item.mensagem}</Text>
                {item.detalhes && (
                  <Text style={styles.diagnosticoDetalhes}>{item.detalhes}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>💡 Como Usar</Text>
          <Text style={styles.cardTexto}>
            1. Faça uma tentativa de pagamento clicando em "Assinar Agora"{'\n'}
            2. Volte para esta página{'\n'}
            3. Clique em "Executar Diagnóstico Completo"{'\n'}
            4. Analise os resultados para identificar problemas
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 12,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
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
    marginBottom: 16,
  },
  cardTexto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  aviso: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 12,
    fontStyle: 'italic',
  },
  botoesContainer: {
    marginBottom: 20,
  },
  botao: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  botaoPrincipal: {
    backgroundColor: '#336BF7',
  },
  botaoSecundario: {
    backgroundColor: '#9C27B0',
  },
  botaoLimpar: {
    backgroundColor: '#757575',
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  diagnosticoItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  diagnosticoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  diagnosticoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  diagnosticoNome: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  diagnosticoTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  diagnosticoMensagem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  diagnosticoDetalhes: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

