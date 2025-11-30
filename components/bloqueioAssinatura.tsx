import { auth } from '@/back-end/Api';
import { verificarAssinatura } from '@/back-end/api.assinatura';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BloqueioAssinaturaProps {
  children: React.ReactNode;
}

export default function BloqueioAssinatura({ children }: BloqueioAssinaturaProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAssinante, setIsAssinante] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const verificarAssinaturaUsuario = useCallback(async (usuario: any) => {
    if (usuario && usuario.emailVerified) {
      console.log('Verificando assinatura para usuário:', usuario.uid);
      const assinante = await verificarAssinatura(usuario.uid);
      console.log('Resultado da verificação:', assinante ? '✅ Assinante' : '❌ Não assinante');
      setIsAssinante(assinante);
      return assinante;
    } else {
      setIsAssinante(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (usuario && usuario.emailVerified) {
        setUser(usuario);
        // Verificar imediatamente ao detectar usuário
        console.log('🔍 [AUTO] Usuário autenticado detectado, verificando assinatura automaticamente...');
        await verificarAssinaturaUsuario(usuario);
      } else {
        setUser(null);
        setIsAssinante(false);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, [verificarAssinaturaUsuario]);

  // Verificar assinatura quando o app recebe foco (útil após retornar do pagamento)
  const appState = useRef(AppState.currentState);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        user &&
        user.emailVerified
      ) {
        console.log('App voltou ao foco, verificando assinatura novamente...');
        verificarAssinaturaUsuario(user).then((assinante) => {
          if (assinante && !isAssinante) {
            console.log('✅ Assinatura detectada após retorno!');
          }
        });
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [user, verificarAssinaturaUsuario, isAssinante]);

  // Verificar assinatura periodicamente quando não é assinante (para detectar pagamento aprovado)
  // Esta verificação é TOTALMENTE AUTOMÁTICA e contínua até detectar a assinatura
  useEffect(() => {
    if (!isAssinante && user && user.emailVerified && !carregando) {
      console.log('🔍 [AUTO] Iniciando verificação automática contínua de assinatura...');
      console.log('🔍 [AUTO] Esta verificação acontece automaticamente a cada 2 segundos até detectar a assinatura');
      
      // Verificação imediata ao montar
      const verificarImediatamente = async () => {
        console.log('🔍 [AUTO] Verificação imediata ao carregar página...');
        const assinante = await verificarAssinaturaUsuario(user);
        if (assinante) {
          console.log('✅ [AUTO] Assinatura detectada na verificação imediata! Acesso liberado automaticamente.');
          return; // Parar se já encontrou
        }
      };
      
      verificarImediatamente();
      
      // Verificação periódica muito frequente (a cada 2 segundos) até detectar
      // Esta verificação é TOTALMENTE AUTOMÁTICA e não requer ação do usuário
      const interval = setInterval(async () => {
        console.log('🔍 [AUTO] Verificação automática periódica (sem ação do usuário)...');
        const assinante = await verificarAssinaturaUsuario(user);
        if (assinante) {
          console.log('✅ [AUTO] Assinatura detectada automaticamente! Acesso liberado sem intervenção do usuário.');
          clearInterval(interval); // Parar quando detectar
        }
      }, 2000); // Verificar a cada 2 segundos (muito frequente para detecção rápida)

      return () => {
        console.log('🛑 Parando verificação automática');
        clearInterval(interval);
      };
    }
  }, [isAssinante, user, carregando, verificarAssinaturaUsuario]);
  
  // Verificar sempre que o componente é montado ou quando o usuário muda
  // Esta verificação acontece AUTOMATICAMENTE sem ação do usuário
  useEffect(() => {
    if (user && user.emailVerified && !carregando) {
      console.log('🔍 [AUTO] Verificação automática ao montar/atualizar componente...');
      verificarAssinaturaUsuario(user);
    }
  }, [user, carregando, verificarAssinaturaUsuario]);

  if (carregando) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#336BF7" />
          <Text style={styles.loadingText}>Verificando acesso...</Text>
        </View>
      </View>
    );
  }

  // Log para debug
  console.log('🔍 BloqueioAssinatura - Estado:', {
    temUsuario: !!user,
    emailVerified: user?.emailVerified,
    isAssinante,
    carregando
  });

  if (!isAssinante) {
    return (
      <View style={styles.container}>
        
        <View style={styles.bloqueioContainer}>
          <View style={styles.cardBloqueio}>
            <Text style={styles.iconeBloqueio}>🔒</Text>
            <Text style={styles.tituloBloqueio}>Conteúdo Exclusivo</Text>
            <Text style={styles.descricaoBloqueio}>
              Este conteúdo está disponível apenas para assinantes. Assine agora para ter acesso completo ao blog com artigos exclusivos sobre saúde mental.
            </Text>
            
            <View style={styles.beneficiosContainer}>
              <Text style={styles.beneficiosTitulo}>Com a assinatura você tem:</Text>
              <Text style={styles.beneficioItem}>✓ Acesso ilimitado a todos os artigos</Text>
              <Text style={styles.beneficioItem}>✓ Conteúdo exclusivo e atualizado</Text>
              <Text style={styles.beneficioItem}>✓ Suporte prioritário</Text>
            </View>

            <TouchableOpacity
              style={styles.botaoAssinar}
              onPress={() => router.push('/screens/assinatura')}
            >
              <Text style={styles.textoBotaoAssinar}>Assinar por R$ 9,99</Text>
            </TouchableOpacity>

            {!user && (
              <TouchableOpacity
                style={styles.botaoLogin}
                onPress={() => router.push('/screens/login')}
              >
                <Text style={styles.textoBotaoLogin}>Já tem conta? Faça login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
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
  bloqueioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardBloqueio: {
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
  iconeBloqueio: {
    fontSize: 64,
    marginBottom: 16,
  },
  tituloBloqueio: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0b2157',
    marginBottom: 16,
    textAlign: 'center',
  },
  descricaoBloqueio: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  beneficiosContainer: {
    width: '100%',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
  },
  beneficiosTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0b2157',
    marginBottom: 12,
  },
  beneficioItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 24,
  },
  botaoAssinar: {
    backgroundColor: '#336BF7',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBotaoAssinar: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  botaoLogin: {
    paddingVertical: 12,
  },
  textoBotaoLogin: {
    color: '#336BF7',
    fontSize: 16,
    fontWeight: '600',
  },
});

