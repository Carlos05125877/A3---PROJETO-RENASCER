import { firestore } from '@/back-end/Api';
import { ativarAssinaturaPorEmail } from '@/back-end/ativarAssinaturaManual';
import Topo from '@/components/topo';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Metricas {
  totalAssinantes: number;
  assinantesUsuarios: number;
  assinantesProfissionais: number;
  receitaTotal: number;
  assinaturasAprovadas: number;
  assinaturasPendentes: number;
  assinaturasRejeitadas: number;
}

export default function DashboardAdmin() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [emailAtivacao, setEmailAtivacao] = useState('');
  const [processandoAtivacao, setProcessandoAtivacao] = useState(false);

  useEffect(() => {
    // Verificar autenticação
    const verificarAutenticacao = () => {
      if (typeof window !== 'undefined') {
        const adminLoggedIn = window.localStorage.getItem('admin_logged_in');
        const adminTimestamp = window.localStorage.getItem('admin_timestamp');
        
        // Verificar se está logado e se a sessão não expirou (24 horas)
        if (adminLoggedIn === 'true' && adminTimestamp) {
          const timestamp = parseInt(adminTimestamp);
          const agora = Date.now();
          const horasPassadas = (agora - timestamp) / (1000 * 60 * 60);
          
          if (horasPassadas < 24) {
            setAutenticado(true);
            carregarMetricas();
          } else {
            window.localStorage.removeItem('admin_logged_in');
            window.localStorage.removeItem('admin_timestamp');
            router.replace('/admin/login_admin' as any);
          }
        } else {
          router.replace('/admin/login_admin' as any);
        }
      }
    };
    
    verificarAutenticacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarMetricas = async () => {
    try {
      setCarregando(true);
      
      // Buscar todos os usuários e profissionais
      const usersRef = collection(firestore, 'users');
      const profRef = collection(firestore, 'profissionais');
      
      const [usersSnapshot, profSnapshot] = await Promise.all([
        getDocs(usersRef),
        getDocs(profRef)
      ]);
      
      let totalAssinantes = 0;
      let assinantesUsuarios = 0;
      let assinantesProfissionais = 0;
      let assinaturasAprovadas = 0;
      let assinaturasPendentes = 0;
      let assinaturasRejeitadas = 0;
      
      // Processar usuários
      usersSnapshot.forEach((doc) => {
        const dados = doc.data();
        if (dados.assinatura?.isAssinante && dados.assinatura?.status === 'approved') {
          totalAssinantes++;
          assinantesUsuarios++;
          assinaturasAprovadas++;
        } else if (dados.assinatura?.status === 'pending') {
          assinaturasPendentes++;
        } else if (dados.assinatura?.status === 'rejected') {
          assinaturasRejeitadas++;
        }
      });
      
      // Processar profissionais
      profSnapshot.forEach((doc) => {
        const dados = doc.data();
        if (dados.assinatura?.isAssinante && dados.assinatura?.status === 'approved') {
          totalAssinantes++;
          assinantesProfissionais++;
          assinaturasAprovadas++;
        } else if (dados.assinatura?.status === 'pending') {
          assinaturasPendentes++;
        } else if (dados.assinatura?.status === 'rejected') {
          assinaturasRejeitadas++;
        }
      });
      
      // Calcular receita (R$ 9,99 por assinatura aprovada)
      const receitaTotal = assinaturasAprovadas * 9.99;
      
      setMetricas({
        totalAssinantes,
        assinantesUsuarios,
        assinantesProfissionais,
        receitaTotal,
        assinaturasAprovadas,
        assinaturasPendentes,
        assinaturasRejeitadas,
      });
      
    } catch (error: any) {
      console.error('Erro ao carregar métricas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as métricas');
    } finally {
      setCarregando(false);
    }
  };

  const handleAtivarAssinatura = async () => {
    if (!emailAtivacao || !emailAtivacao.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setProcessandoAtivacao(true);
    try {
      await ativarAssinaturaPorEmail(emailAtivacao);
      Alert.alert('Sucesso', `Assinatura ativada com sucesso para ${emailAtivacao}`);
      setEmailAtivacao('');
      // Recarregar métricas
      await carregarMetricas();
    } catch (error: any) {
      console.error('Erro ao ativar assinatura:', error);
      Alert.alert('Erro', error.message || 'Erro ao ativar assinatura');
    } finally {
      setProcessandoAtivacao(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('admin_logged_in');
      window.localStorage.removeItem('admin_timestamp');
    }
    router.replace('/admin/login_admin' as any);
  };

  if (!autenticado) {
    return (
      <View style={styles.container}>
        <Topo />
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#336BF7" />
          <Text style={styles.textoCarregando}>Verificando autenticação...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{  zIndex: 1 }}>
            <Topo />
          </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Dashboard Administrativo</Text>
            <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
              <Text style={styles.textoBotaoLogout}>Sair</Text>
            </TouchableOpacity>
          </View>

          {carregando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#336BF7" />
              <Text style={styles.textoCarregando}>Carregando métricas...</Text>
            </View>
          ) : metricas ? (
            <>
              {/* Métricas de Vendas */}
              <View style={styles.section}>
                <Text style={styles.sectionTitulo}>📊 Métricas de Vendas</Text>
                
                <View style={styles.metricaCard}>
                  <Text style={styles.metricaValor}>R$ {metricas.receitaTotal.toFixed(2)}</Text>
                  <Text style={styles.metricaLabel}>Receita Total</Text>
                </View>
                
                <View style={styles.metricasGrid}>
                  <View style={styles.metricaCard}>
                    <Text style={styles.metricaValor}>{metricas.assinaturasAprovadas}</Text>
                    <Text style={styles.metricaLabel}>Aprovadas</Text>
                  </View>
                  
                  <View style={styles.metricaCard}>
                    <Text style={styles.metricaValor}>{metricas.assinaturasPendentes}</Text>
                    <Text style={styles.metricaLabel}>Pendentes</Text>
                  </View>
                  
                  <View style={styles.metricaCard}>
                    <Text style={styles.metricaValor}>{metricas.assinaturasRejeitadas}</Text>
                    <Text style={styles.metricaLabel}>Rejeitadas</Text>
                  </View>
                </View>
              </View>

              {/* Métricas de Acessos */}
              <View style={styles.section}>
                <Text style={styles.sectionTitulo}>👥 Métricas de Acessos</Text>
                
                <View style={styles.metricaCard}>
                  <Text style={styles.metricaValor}>{metricas.totalAssinantes}</Text>
                  <Text style={styles.metricaLabel}>Total de Assinantes</Text>
                </View>
                
                <View style={styles.metricasGrid}>
                  <View style={styles.metricaCard}>
                    <Text style={styles.metricaValor}>{metricas.assinantesUsuarios}</Text>
                    <Text style={styles.metricaLabel}>Usuários</Text>
                  </View>
                  
                  <View style={styles.metricaCard}>
                    <Text style={styles.metricaValor}>{metricas.assinantesProfissionais}</Text>
                    <Text style={styles.metricaLabel}>Profissionais</Text>
                  </View>
                </View>
              </View>

              {/* Ativador de Acesso Manual */}
              <View style={styles.section}>
                <Text style={styles.sectionTitulo}>🔧 Ativador de Acesso Manual</Text>
                <Text style={styles.sectionDescricao}>
                  Ative a assinatura de um usuário manualmente inserindo o email
                </Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Email do usuário"
                  value={emailAtivacao}
                  onChangeText={setEmailAtivacao}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!processandoAtivacao}
                />
                
                <TouchableOpacity
                  style={[styles.botaoAtivar, processandoAtivacao && styles.botaoDisabled]}
                  onPress={handleAtivarAssinatura}
                  disabled={processandoAtivacao}
                >
                  {processandoAtivacao ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.textoBotaoAtivar}>Ativar Assinatura</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Botão para recarregar métricas */}
              <TouchableOpacity
                style={styles.botaoRecarregar}
                onPress={carregarMetricas}
                disabled={carregando}
              >
                <Text style={styles.textoBotaoRecarregar}>🔄 Recarregar Métricas</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.textoErro}>Erro ao carregar métricas</Text>
              <TouchableOpacity style={styles.botaoRecarregar} onPress={carregarMetricas}>
                <Text style={styles.textoBotaoRecarregar}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0b2157',
  },
  botaoLogout: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textoBotaoLogout: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  textoCarregando: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 8,
  },
  sectionDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  metricasGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  metricaCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  metricaValor: {
    fontSize: 24,
    fontWeight: '700',
    color: '#336BF7',
    marginBottom: 4,
  },
  metricaLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botaoAtivar: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoDisabled: {
    backgroundColor: '#999',
  },
  textoBotaoAtivar: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  botaoRecarregar: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  textoBotaoRecarregar: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  textoErro: {
    fontSize: 16,
    color: '#F44336',
    marginBottom: 16,
  },
});

