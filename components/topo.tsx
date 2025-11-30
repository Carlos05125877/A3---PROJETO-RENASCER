import { auth, buscarDadosFirestore } from '@/back-end/Api';
import { deslogar } from '@/back-end/api.cadastroLogin';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";




export default function Topo() {
  const [logado, setLogado] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [urlImagem, setUrlImagem] = useState<string | undefined>(undefined);
  const [criarConta, setCriarConta] = useState(false);

  useEffect(
    () => {
      const ouvindo = onAuthStateChanged(auth, (usuario) => {

        if (usuario && usuario.emailVerified) {
          setLogado(true);
          setUser(usuario);
          console.log("Usuario autenticado");
        } else {
          setLogado(false);
          setUser(null)
          console.log("Usuario não autenticado");
        }
      } );


      return () => ouvindo();

    }, []);

  useEffect(
    () => {
      const buscarImagem = async () => {
        if (user?.uid) {

          const dados = await buscarDadosFirestore(user.uid)
          if (dados) {
            setUrlImagem(dados.urlImagem);
          }
        }
      }
      buscarImagem();
    }, [user] )

  const router = useRouter();

  return (
    <View style={styles.topoPagina}>
      {/* Lado esquerdo */}
      <View style={styles.topoPaginaEsquerda}>
        <View>
          <TouchableOpacity style={ {flexDirection: 'row', alignItems: 'center', gap: 10} }
            onPress={ () => router.push('/')}>
            <Image style={styles.logo}
              source={require('../assets/images/Logo.png')} />
            <View>
              <Text style={styles.textoLogo}>
                Renascer
              </Text>
              <Text style={styles.subtituloLogo}>
                Apoio Psicológico Digital
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => (router.push('/screens/quemSomos'))}>
          <Text style={styles.textoComoFuncionaBlog}>
            Quem somos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (router.push('/screens/blogDicas'))}>
          <Text style={styles.textoComoFuncionaBlog}>
            Blog
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => (router.push('/screens/emDesenvolvimento'))}>
          <Text style={styles.textoComoFuncionaBlog}>
            Comunidade
          </Text>
        </TouchableOpacity>

      </View>

      {/* Lado direito */}
      <View
        style={styles.topoPaginaDireita}>
        <TouchableOpacity style={styles.botaoAgendamentoEntrar} 
        onPress={() => (router.push('/screens/listaProfissionais'))}>
          <MaterialCommunityIcons name='calendar' size={24} color='#FFFFFF' />
          <Text style={styles.textoBotaoAgendamentoEntrar}>
            Agendar Consulta
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={() => {
              !logado ? setCriarConta(!criarConta)
                : deslogar()
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.textoBotaoCriarConta}>
                {!logado ? 'Criar Conta' : 'Sair'}
              </Text>
              {!logado && (
                criarConta ?
                  <Entypo name="chevron-small-up" size={24} color="#336BF7" />
                  :
                  <Entypo name="chevron-small-down" size={24} color="#336BF7" />
              )}
            </View>
          </TouchableOpacity>
          {criarConta && (
            <View style={{width: 95, height: 50, gap: 5, position: 'absolute', marginTop: '25%', marginLeft:'0%' }}>
              <TouchableOpacity
                onPress={() => router.push('/screens/cadastroUsuarios')} 
                style={styles.boxBotoesCriarConta}>
                <Text style={{color:'#ffff'}}>
                 Usuario
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/screens/cadastroProfissional')}
                style={styles.boxBotoesCriarConta}>
                <Text style={{color: '#fff'}}>
                  Profissional
                </Text>
              </TouchableOpacity>
            </View>)}
        </View>

        {!logado ? (
          <TouchableOpacity
            onPress={() => router.push('/screens/login')}
            style={[styles.botaoAgendamentoEntrar, { width: '15%' }]}
          >
            <Text
              style={styles.textoBotaoAgendamentoEntrar}>
              Entrar
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push('/screens/agendadorProfissional')}>
          <Image
            source={{ uri: urlImagem }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Mantenha seu StyleSheet


const styles = StyleSheet.create({


  topoPagina: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    boxShadow: '0px 3px 8px rgba(100, 100, 100, 0.1)',
    

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

  topoPaginaDireita: {
    flexDirection: 'row',
    display: 'flex',
    flex: 0.35,
    gap: '10%',
    marginRight: 100,
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

  boxBotoesCriarConta:{
    backgroundColor:'#336BF7', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 5,
    width: '100%',
    height: '50%',
    zIndex: 10
  }

}
)


