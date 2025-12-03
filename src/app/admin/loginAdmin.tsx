import Topo from '@/components/topo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginAdmin() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [processando, setProcessando] = useState(false);

  const handleLogin = () => {
    if (!usuario || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Credenciais fixas
    if (usuario === 'admin' && senha === '123456') {
      // Salvar sessão admin no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('admin_logged_in', 'true');
        window.localStorage.setItem('admin_timestamp', Date.now().toString());
      }
      router.push('/admin/dashboard');
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos');
    }
  };

  return (
    <View style={styles.container}>
      <Topo />
      <View style={styles.content}>
        <Text style={styles.titulo}>Painel Administrativo</Text>
        <Text style={styles.subtitulo}>Faça login para acessar o dashboard</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o usuário"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            editable={!processando}
          />
          
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!processando}
          />
          
          <TouchableOpacity
            style={[styles.botao, processando && styles.botaoDisabled]}
            onPress={handleLogin}
            disabled={processando}
          >
            <Text style={styles.textoBotao}>
              {processando ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>
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
  titulo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botao: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 24,
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

