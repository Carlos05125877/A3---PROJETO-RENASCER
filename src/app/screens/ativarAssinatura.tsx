import { ativarAssinaturaPorEmail } from '@/back-end/ativarAssinaturaManual';
import Topo from '@/components/topo';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AtivarAssinatura() {
  const [email, setEmail] = useState('julianagarcia7l2011@gmail.com');
  const [processando, setProcessando] = useState(false);

  // Executar automaticamente ao carregar a página
  useEffect(() => {
    const executarAtivacao = async () => {
      const emailParaAtivar = 'julianagarcia7l2011@gmail.com';
      if (emailParaAtivar && emailParaAtivar.includes('@')) {
        setProcessando(true);
        try {
          console.log('🔄 Iniciando ativação de assinatura para:', emailParaAtivar);
          await ativarAssinaturaPorEmail(emailParaAtivar);
          console.log('✅ Assinatura ativada com sucesso!');
          Alert.alert('Sucesso', `Assinatura ativada com sucesso para ${emailParaAtivar}`);
        } catch (error: any) {
          console.error('❌ Erro ao ativar assinatura:', error);
          Alert.alert('Erro', error.message || 'Erro ao ativar assinatura');
        } finally {
          setProcessando(false);
        }
      }
    };

    // Executar após 2 segundos para garantir que o Firebase está inicializado
    const timer = setTimeout(executarAtivacao, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAtivar = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setProcessando(true);
    try {
      await ativarAssinaturaPorEmail(email);
      Alert.alert('Sucesso', `Assinatura ativada com sucesso para ${email}`);
    } catch (error: any) {
      console.error('Erro ao ativar assinatura:', error);
      Alert.alert('Erro', error.message || 'Erro ao ativar assinatura');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Topo />
      <View style={styles.content}>
        <Text style={styles.titulo}>Ativar Assinatura Manualmente</Text>
        <Text style={styles.descricao}>
          Digite o email do usuário para ativar a assinatura manualmente
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email do usuário"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!processando}
        />
        
        <TouchableOpacity
          style={[styles.botao, processando && styles.botaoDisabled]}
          onPress={handleAtivar}
          disabled={processando}
        >
          <Text style={styles.textoBotao}>
            {processando ? 'Ativando...' : 'Ativar Assinatura'}
          </Text>
        </TouchableOpacity>
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
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 16,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botao: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  botaoDisabled: {
    backgroundColor: '#999',
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

