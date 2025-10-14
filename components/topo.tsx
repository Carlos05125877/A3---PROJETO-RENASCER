import { auth } from '@/back-end/Api';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { width, height } = Dimensions.get('window');


export default function Topo() {
  const [logado, setLogado] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
      const ouvindo = onAuthStateChanged(auth, (usuario) => {
        if (usuario) {
          setLogado(true);
          setUser(usuario);
        } else {
          setLogado(false);
          setUser(null)
        }
    });
  
  
  return () => ouvindo();

}, []);

  const deslogar = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao deslogar:", error.message);
    }
  }


  const router = useRouter();

  return (
    <View style={styles.backgroundPagina}>
      <View style={styles.topoPagina}>
        {/* Lado esquerdo */}
        <View style={styles.topoPaginaEsquerda}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image style={styles.logo} source={require('../assets/images/Logo.png')} />
            <View>
              <Text style={styles.textoLogo}>Renascer</Text>
              <Text style={styles.subtituloLogo}>Especialista em Burnout</Text>
            </View>
          </View>

          <TouchableOpacity><Text style={styles.textoComoFuncionaBlog}>Como Funciona</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.textoComoFuncionaBlog}>Blog</Text></TouchableOpacity>

          <TouchableOpacity style={styles.botaoExclusivo}>
            <MaterialCommunityIcons name='crown' size={24} color='#E6B103' />
            <Text style={{
              paddingLeft: 5,
              color: '#E6B103',
              fontFamily: "Inria Sans",
              fontSize: 16,
              fontWeight: 700
            }}>Exclusivo</Text>
          </TouchableOpacity>
        </View>

        {/* Lado direito */}
        <View style={styles.topoPaginaDireita}>
          <TouchableOpacity style={styles.botaoAgendamentoEntrar}>
            <MaterialCommunityIcons name='calendar' size={24} color='#FFFFFF' />
            <Text style={styles.textoBotaoAgendamentoEntrar}>Agendar Consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={deslogar} style={styles.botaoCriarConta}>
            <Text style={styles.textoBotaoCriarConta}>Criar Conta</Text>
          </TouchableOpacity>

          {!logado ? (
            <TouchableOpacity
              onPress={() => router.push('/screens/login')}
              style={[styles.botaoAgendamentoEntrar, { width: width * 0.075 }]}
            >
              <Text style={styles.textoBotaoAgendamentoEntrar}>Entrar</Text>
            </TouchableOpacity>
          ) : (
            <Image
              source={{ uri: user?.photoURL || undefined }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

// Mantenha seu StyleSheet


const styles = StyleSheet.create({
  backgroundPagina: {
    display: 'flex',
    flex: 1,
    paddingLeft: width * 0.005,
    paddingRight: width * 0.005,
    overflow: 'hidden',
  },

  topoPagina: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  topoPaginaEsquerda: {
    flex: 0.5,
    flexDirection: 'row',
    display: 'flex',
    gap: width * 0.05,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',

  },
  logo: {
    width: 40,
    height: 40,
  },
  textoLogo: {
    color: '#000',
    fontFamily: "Times New Roman",
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 700,
  },
  subtituloLogo: {
    color: '#000',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 400,
    marginRight: 35,
    marginTop: -5
  },
  textoComoFuncionaBlog: {
    color: '#000',
    fontFamily: "Inria Sans",
    fontSize: 16,
    fontWeight: 400,
    alignItems: 'center',
    justifyContent: 'center'
  },

  botaoExclusivo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.065,
    height: height * 0.06,
  },
  topoPaginaDireita: {
    flexDirection: 'row',
    flex: 0.35,
    gap: 40,
    marginRight: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  botaoAgendamentoEntrar: {
    flexDirection: 'row',
    backgroundColor: '#336BF7',
    width: width * 0.11,
    height: height * 0.06,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textoBotaoAgendamentoEntrar: {
    color: '#FFFFFF',
    fontFamily: "Inria Sans",
    fontSize: 16,
  },
  botaoCriarConta: {
    width: width * 0.06,
    height: height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoCriarConta: {
    color: '#336BF7',
    fontFamily: "Inria Sans",
    fontSize: 16,
  },
}
)


