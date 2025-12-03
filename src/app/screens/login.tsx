import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Modal from 'react-native-modal';
import Topo from '../../..//components/topo';
import { esqueciMinhaSenha, loginComEmailSenha, loginComGoogle } from '../../../back-end/api.cadastroLogin';


{/*-----------------------------------------------------------------------------------*/ }

export default function Login() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const bloquearBotaoGoogle = useRef(false);
  const [mostrarSenha, setmostrarSenha] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaIncorreta, setsenhaIncorreta] = useState(false);
  const router = useRouter();
  const [botaoEsqueciMinhaSenha, setBotaoEsqueciMinhaSenha] = useState(false)
  const [redefinirEmail, setRedefinirEmail] = useState('')

  const verificarLogin = (usuario: User) => {
    if (usuario) {
      setsenhaIncorreta(false)
    }
    setsenhaIncorreta(true);
    return !senhaIncorreta;
  }




  const loginComEmaileSenha = async () => {
    try {
      const user = await loginComEmailSenha(email, senha);
      if (verificarLogin(user) && user.emailVerified) {
        router.push('/');
      }
    } catch (error: any) {
      setsenhaIncorreta(true);
      console.error(error);
    }
  }

  return (
    <View style={styles.backgroundPagina}>

      <View style={{ paddingTop: 10, zIndex: 1 }}>
        <Topo />
      </View>

      <View style={[styles.areaLoginBanner, isMobile && styles.areaLoginBannerMobile]}>


        <View style={[styles.areaLogin, isMobile && styles.areaLoginMobile]}>
          <View style={[styles.caixaLogin, isMobile && styles.caixaLoginMobile]}>

            <View style={{ gap: 10, alignItems: 'center' }}>
              <Text style={[styles.TextoLogin, isMobile && styles.TextoLoginMobile]}>Login</Text>
              <Text style={[styles.TextoLoginInformeEmail, isMobile && styles.TextoLoginInformeEmailMobile]}>Informe seu e-mail e senha abaixo:</Text>
            </View>

            <View style={{ gap: 20 }}>

              <View style={[styles.boxTextInput, isMobile && styles.boxTextInputMobile]}>
                <TextInput style={[styles.TextInput, isMobile && styles.TextInputMobile]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder='E-mail'
                  placeholderTextColor={'rgba(0,0,0,0.5)'} secureTextEntry={false} />
              </View>


              <View style={[styles.boxTextInput, isMobile && styles.boxTextInputMobile]}>
                <TextInput style={[styles.TextInput, isMobile && styles.TextInputMobile]}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder='Senha'
                  placeholderTextColor={'rgba(0,0,0,0.5)'}
                  secureTextEntry={mostrarSenha}
                  onKeyPress={(e) => {
                    if (e.nativeEvent.key === 'Enter') {
                      loginComEmaileSenha();
                    }
                  }}
                />
                <TouchableOpacity onPress={() => { setmostrarSenha(!mostrarSenha) }}>
                  <View style={{ padding: 10, opacity: 0.5 }}>
                    {mostrarSenha ? (
                      <AntDesign name="eye-invisible" size={isMobile ? 20 : 24} color="black" />
                    ) : (
                      <AntDesign name="eye" size={isMobile ? 20 : 24} color="black" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                {senhaIncorreta && (
                  <Text style={{ color: 'red', fontSize: isMobile ? 12 : 14 }}>Senha Incorreta</Text>
                )}
              </View>


              <View style={styles.botoes}>

                <TouchableOpacity style={[styles.botaoLogin, isMobile && styles.botaoLoginMobile]}
                  onPress={loginComEmaileSenha}>
                  <Text style={[styles.textoBotaoLogin, isMobile && styles.textoBotaoLoginMobile]}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.botaoGoogle, isMobile && styles.botaoGoogleMobile]}
                  onPress={async () => {
                    const user = await loginComGoogle(bloquearBotaoGoogle)
                    user && router.push('/')
                  }}>
                  <Image style={{ width: isMobile ? 20 : 25, height: isMobile ? 20 : 25 }} source={require('../../../assets/images/images.png')} />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={[styles.textoLink, isMobile && styles.textoLinkMobile]}
                    onPress={() => setBotaoEsqueciMinhaSenha(true)
                    }
                  >Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={[styles.textoLink, isMobile && styles.textoLinkMobile]}
                    onPress={() => router.push('/screens/cadastro_usuarios' as any)}
                  >Criar Conta</Text>
                </TouchableOpacity>

              </View>


            </View>
          </View>
        </View>

        {!isMobile && (
          <View style={styles.areaBanner}>
            <Image style={{ width: '100%', height: '100%', }} source={require('../../../assets/images/ImagemTelaLogin.png')} />
          </View>
        )}

      </View>
      <Modal
        isVisible={botaoEsqueciMinhaSenha}
        onBackdropPress={() => setBotaoEsqueciMinhaSenha(false)}
        animationIn='zoomIn'
        animationOut='zoomOut'
        style={{ justifyContent: 'center', alignItems: 'center' }}
        backdropColor="black"
        backdropOpacity={0.8}>
        <View
          style={[styles.modal, isMobile && styles.modalMobile]}>
          <Text
            style={[styles.recuperarSenha, isMobile && styles.recuperarSenhaMobile]}>
            Recuperar Senha
          </Text>
          <Text
            style={[styles.textoInformativoModal, isMobile && styles.textoInformativoModalMobile]}>
            Digite o email cadastrado e aguarde o envio do link para recuperar sua senha
          </Text>
          <View
            style={[styles.boxTextInput, { width: '92%' }, isMobile && styles.boxTextInputMobile]}>
            <TextInput
              style={[styles.TextInput, { width: '100%' }, isMobile && styles.TextInputMobile]}
              value={redefinirEmail}
              onChangeText={setRedefinirEmail}
              placeholder='E-mail'
              placeholderTextColor={'rgba(0,0,0,0.5)'} secureTextEntry={false} />
          </View>
          <TouchableOpacity
            style={[styles.botaoLogin, { width: '40%', height: '15%', borderRadius: 8 }, isMobile && styles.botaoLoginMobile]}
            onPress={() => esqueciMinhaSenha(redefinirEmail)}>
            <Text style={[styles.textoBotaoLogin, isMobile && styles.textoBotaoLoginMobile]}>
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>

  )

}
const styles = StyleSheet.create({
  backgroundPagina: {
    flex: 1,
    backgroundColor: '#ffffff',
    gap: 8,
  },

  areaLoginBanner: {
    flexDirection: 'row',
    flex: 1,
  },

  areaLogin: {
    flex: 0.42,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  caixaLogin: {
    width: '60%',
    height: '45%',
    gap: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  areaBanner: {
    backgroundColor: '#3c5cfc',
    flex: 0.58,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  AreaTexoLogin: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',

  },
  TextoLogin: {
    color: '#000',
    fontFamily: "Arial",
    fontSize: 64,
    fontWeight: 700,
  },
  TextoLoginInformeEmail: {
    color: '#000000',
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 400,
  },
  boxTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    borderStyle: 'solid',
    width: 375,
    height: 45,
    overflow: 'hidden'

  },

  TextInput: {
    width: 375,
    height: 45,
    padding: 10,
    outlineWidth: 0,
    outlineColor: 'transparent',
    opacity: 1,
    color: '#000000'
  },
  botoes: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22
  },
  botaoLogin: {
    borderRadius: 7,
    width: 150,
    height: 50,
    backgroundColor: '#336BF7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  botaoGoogle: {
    backgroundColor: 'white',
    borderRadius: 22,
    width: 75,
    height: 50,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center'
  },
  textoBotaoLogin: {
    color: '#FFF',
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 700,
  },
  modal: {
    margin: 20,
    backgroundColor: '#fff',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    width: '50%',
    height: '70%'
  },
  recuperarSenha: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 35,
    fontFamily: 'Arial'
  },
  textoInformativoModal: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Arial',
    marginHorizontal: 20
  },

  textoLink: {
    color: '#336BF7'
  },

  // Estilos Mobile
  areaLoginBannerMobile: {
    flexDirection: 'column',
  },

  areaLoginMobile: {
    flex: 1,
    paddingHorizontal: 20,
  },

  caixaLoginMobile: {
    width: '100%',
    height: 'auto',
    gap: 25,
    paddingVertical: 20,
  },

  TextoLoginMobile: {
    fontSize: 40,
  },

  TextoLoginInformeEmailMobile: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  boxTextInputMobile: {
    width: '100%',
    maxWidth: 375,
  },

  TextInputMobile: {
    width: '100%',
    fontSize: 16,
  },

  botaoLoginMobile: {
    width: 120,
    height: 45,
  },

  textoBotaoLoginMobile: {
    fontSize: 16,
  },

  botaoGoogleMobile: {
    width: 60,
    height: 45,
  },

  textoLinkMobile: {
    fontSize: 14,
  },

  modalMobile: {
    width: '90%',
    height: 'auto',
    minHeight: 300,
    paddingVertical: 20,
  },

  recuperarSenhaMobile: {
    fontSize: 24,
  },

  textoInformativoModalMobile: {
    fontSize: 16,
    marginHorizontal: 15,
  },

})