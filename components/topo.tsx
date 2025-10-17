import { auth, deslogar } from '@/back-end/Api';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMediaQuery } from 'react-responsive';

export default function Topo() {
  const [logado, setLogado] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useMediaQuery({ maxWidth: 830 });

  useEffect(() => {
    const ouvindo = onAuthStateChanged(auth, (usuario) => {
      if (usuario?.emailVerified) {
        setLogado(true);
        setUser(usuario);
        console.log("Usuario autenticado");
      } else {
        setLogado(false);
        setUser(null)
        console.log("Usuario não autenticado");
      }
    });


    return () => ouvindo();

  }, []);




  const router = useRouter();

  return (
    <View style={styles.backgroundPagina}>
      <View style={styles.topoPagina}>
        {/* Lado esquerdo */}
        <View style={styles.topoPaginaEsquerda}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image style={isMobile ?styles.logoMobile : styles.logo} source={require('../assets/images/Logo.png')} />
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

          <TouchableOpacity onPress={()=>{!logado? router.push('/screens/cadastroUsuarios'):deslogar()}} style={styles.botaoCriarConta}>
            <Text style={styles.textoBotaoCriarConta}>{!logado ? 'Criar Conta' : 'Sair'}</Text>
          </TouchableOpacity>

          {!logado ? (
            <TouchableOpacity
              onPress={() => router.push('/screens/login')}
              style={[styles.botaoAgendamentoEntrar, { width: '15%' }]}
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
    paddingLeft: 5,
    paddingRight: 5,
  },

  topoPagina: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },

  topoPaginaEsquerda: {
    flex: 0.5,
    flexDirection: 'row',
    display: 'flex',
    gap: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden'

  },
  logo: {
    width: 40,
    height: 40,
  },
  logoMobile: {
    width: 50,
    height: 50,
  },
  textoLogo: {
    color: '#000',
    fontFamily: "Times New Roman",
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 700,
  },
  textoLogoMoble: {
    color: '#000',
    fontFamily: "Times New Roman",
    fontSize: 15,
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
  subtituloLogoMobile: {
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
    justifyContent: 'center',
    width: '100%',
    height: '6%'
  },
  textoComoFuncionaBlogMobile: {
    color: '#000',
    fontFamily: "Inria Sans",
    fontSize: 16,
    fontWeight: 400,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '6%'
  },

  botaoExclusivo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    height: '6%',
  },
  botaoExclusivoMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    height: '6%',
  },
  topoPaginaDireita: {
    flexDirection: 'row',
    display: 'flex',
    flex: 0.35,
    gap: '10%',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',

  },
  botaoAgendamentoEntrar: {
    flexDirection: 'row',
    backgroundColor: '#336BF7',
    width: '35%',
    height: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textoBotaoAgendamentoEntrar: {
    color: '#FFFFFF',
    fontFamily: "Inria Sans",
    fontSize: 16,
    padding: 5
  },
  botaoCriarConta: {
    width: '15%',
    height: '6%',
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


