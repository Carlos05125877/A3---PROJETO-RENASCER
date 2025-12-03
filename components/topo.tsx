import { auth, buscarDadosFirestore } from '@/back-end/Api';
import { deslogar } from '@/back-end/api.cadastroLogin';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";




export default function Topo() {
  const [logado, setLogado] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [urlImagem, setUrlImagem] = useState<string | undefined>(undefined);
  const [criarConta, setCriarConta] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const dadosUser = useRef <Record<string, string> | undefined>({})
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(
    () => {
      const ouvindo = onAuthStateChanged(auth, async (usuario) => {

        if (usuario && usuario.emailVerified) {
          setLogado(true);
          setUser(usuario);
          console.log("Usuario autenticado");
          dadosUser.current =  await buscarDadosFirestore(usuario.uid)
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
    <View style={[styles.topoPagina, isMobile && styles.topoPaginaMobile]}>
      {/* Lado esquerdo */}
      <View style={[styles.topoPaginaEsquerda, isMobile && styles.topoPaginaEsquerdaMobile]}>
        <View>
          <TouchableOpacity style={ {flexDirection: 'row', alignItems: 'center', gap: isMobile ? 5 : 10} }
            onPress={ () => router.push('/')}>
            <Image style={[styles.logo, isMobile && styles.logoMobile]}
              source={require('../assets/images/Logo.png')} />
            {!isMobile && (
              <View>
                <Text style={styles.textoLogo}>
                  Renascer
                </Text>
                <Text style={styles.subtituloLogo}>
                  Apoio Psicológico Digital
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {!isMobile ? (
          <>
            <TouchableOpacity onPress={() => (router.push('/screens/quem_somos' as any))}>
              <Text style={styles.textoComoFuncionaBlog}>
                Quem somos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (router.push('/screens/blog_dicas' as any))}>
              <Text style={styles.textoComoFuncionaBlog}>
                Blog
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (router.push('/screens/em_desenvolvimento' as any))}>
              <Text style={styles.textoComoFuncionaBlog}>
                Comunidade
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.menuHamburguerContainer}>
            <TouchableOpacity 
              onPress={() => setMenuAberto(!menuAberto)}
              style={styles.menuHamburguer}
            >
              <Ionicons name={menuAberto ? "close" : "menu"} size={28} color="#000" />
            </TouchableOpacity>
            {!logado && (
              <TouchableOpacity
                onPress={() => router.push('/screens/login')}
                style={styles.botaoEntrarMobileInline}
              >
                <Text style={styles.textoBotaoAgendamentoEntrar}>
                  Entrar
                </Text>
              </TouchableOpacity>
            )}
            {logado && (
              <TouchableOpacity onPress={() => {
                const rota = dadosUser.current?.colecao === 'profissionais' 
                  ? '/screens/agendador_profissional' 
                  : '/screens/agendador_usuario';
                router.push(rota as any);
              }}>
                {urlImagem ? (
                  <Image
                    source={{ uri: urlImagem }}
                    style={styles.avatarMobile}
                  />
                ) : (
                  <View style={[styles.avatarMobile, { backgroundColor: '#336BF7', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

      </View>

      {/* Lado direito */}
      <View style={[styles.topoPaginaDireita, isMobile && styles.topoPaginaDireitaMobile]}>
        {!isMobile && (
          <TouchableOpacity style={styles.botaoAgendamentoEntrar} 
          onPress={() => (router.push('/screens/lista_profissionais' as any))}>
            <MaterialCommunityIcons name='calendar' size={24} color='#FFFFFF' />
            <Text style={styles.textoBotaoAgendamentoEntrar}>
              Agendar Consulta
            </Text>
          </TouchableOpacity>
        )}
        {!isMobile && (
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
                  onPress={() => router.push('/screens/cadastro_usuarios' as any)} 
                  style={styles.boxBotoesCriarConta}>
                  <Text style={{color:'#ffff'}}>
                   Usuario
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/screens/cadastro_profissional' as any)}
                  style={styles.boxBotoesCriarConta}>
                  <Text style={{color: '#fff'}}>
                    Profissional
                  </Text>
                </TouchableOpacity>
              </View>)}
          </View>
        )}

        {!isMobile && (
          <>
            {!logado ? (
              <TouchableOpacity
                onPress={() => router.push('/screens/login')}
                style={styles.botaoAgendamentoEntrar}
              >
                <Text style={styles.textoBotaoAgendamentoEntrar}>
                  Entrar
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => {
                const rota = dadosUser.current?.colecao === 'profissionais' 
                  ? '/screens/agendador_profissional' 
                  : '/screens/agendador_usuario';
                router.push(rota as any);
              }}>
                {urlImagem ? (
                  <Image
                    source={{ uri: urlImagem }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: '#336BF7', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Menu Mobile */}
      {isMobile && menuAberto && (
        <View style={styles.menuMobile}>
          <TouchableOpacity 
            onPress={() => {
              router.push('/screens/quem_somos' as any);
              setMenuAberto(false);
            }}
            style={styles.itemMenuMobile}
          >
            <Text style={styles.textoMenuMobile}>Quem somos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              router.push('/screens/blog_dicas' as any);
              setMenuAberto(false);
            }}
            style={styles.itemMenuMobile}
          >
            <Text style={styles.textoMenuMobile}>Blog</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              router.push('/screens/em_desenvolvimento' as any);
              setMenuAberto(false);
            }}
            style={styles.itemMenuMobile}
          >
            <Text style={styles.textoMenuMobile}>Comunidade</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              router.push('/screens/lista_profissionais' as any);
              setMenuAberto(false);
            }}
            style={styles.itemMenuMobile}
          >
            <MaterialCommunityIcons name='calendar' size={20} color='#336BF7' />
            <Text style={styles.textoMenuMobile}>Agendar Consulta</Text>
          </TouchableOpacity>
          {!logado && (
            <>
              <TouchableOpacity 
                onPress={() => {
                  setCriarConta(!criarConta);
                }}
                style={styles.itemMenuMobile}
              >
                <Text style={styles.textoMenuMobile}>
                  {criarConta ? 'Criar Conta ▲' : 'Criar Conta ▼'}
                </Text>
              </TouchableOpacity>
              {criarConta && (
                <View style={styles.subMenuMobile}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push('/screens/cadastro_usuarios' as any);
                      setMenuAberto(false);
                    }}
                    style={styles.itemSubMenuMobile}
                  >
                    <Text style={styles.textoSubMenuMobile}>Usuario</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      router.push('/screens/cadastro_profissional' as any);
                      setMenuAberto(false);
                    }}
                    style={styles.itemSubMenuMobile}
                  >
                    <Text style={styles.textoSubMenuMobile}>Profissional</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          {logado && (
            <TouchableOpacity 
              onPress={() => {
                deslogar();
                setMenuAberto(false);
              }}
              style={styles.itemMenuMobile}
            >
              <Text style={styles.textoMenuMobile}>Sair</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// Mantenha seu StyleSheet


const styles = StyleSheet.create({


  topoPagina: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    boxShadow: '0px 3px 8px rgba(100, 100, 100, 0.1)',
    backgroundColor: '#FFF',
    minHeight: 70,
    width: '100%',
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
  },

  // Estilos Mobile
  topoPaginaMobile: {
    flexDirection: 'column',
    padding: 8,
    minHeight: 60,
  },

  topoPaginaEsquerdaMobile: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    gap: 0,
  },

  logoMobile: {
    width: 30,
    height: 30,
  },

  menuHamburguerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  menuHamburguer: {
    padding: 5,
  },

  botaoEntrarMobileInline: {
    backgroundColor: '#336BF7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topoPaginaDireitaMobile: {
    flex: 1,
    width: '100%',
    marginRight: 0,
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 10,
  },

  botaoEntrarMobile: {
    width: 'auto',
    minWidth: 80,
    paddingHorizontal: 15,
    height: 35,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  avatarMobile: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },

  menuMobile: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    zIndex: 1000,
    boxShadow: '0px 4px 8px rgba(100, 100, 100, 0.2)',
  },

  itemMenuMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  textoMenuMobile: {
    color: '#000',
    fontFamily: "Inria Sans",
    fontSize: 16,
    fontWeight: 400,
  },

  subMenuMobile: {
    backgroundColor: '#f8f8f8',
    paddingLeft: 20,
  },

  itemSubMenuMobile: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },

  textoSubMenuMobile: {
    color: '#336BF7',
    fontFamily: "Inria Sans",
    fontSize: 14,
    fontWeight: 400,
  },

}
)