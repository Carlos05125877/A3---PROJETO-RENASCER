import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Topo from '../../..//components/topo';
import { signInComContaGoogle, signInComEmail } from '../../../back-end/Api';

{/*-----------------------------------------------------------------------------------*/ }

export default function Login() {
  const bloquearBotaoGoogle = useRef(false);
  const [mostrarSenha, setmostrarSenha] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaIncorreta, setsenhaIncorreta] = useState(false);
  const router = useRouter();

  const verificarLogin = (usuario: User) => {
    if (usuario) {
      setsenhaIncorreta(false)
      return true;
    }
    setsenhaIncorreta(true);
    return false;
  }

  const loginComGoogle = async () => {
    if (bloquearBotaoGoogle.current === true) return;

    try {
      bloquearBotaoGoogle.current = true
      const user = await signInComContaGoogle();
      if (verificarLogin(user)) {
        router.push('/');
      }
    } catch (error: any) {
      console.log(error);
      throw (error);
    }
    finally {
      bloquearBotaoGoogle.current = false;
    }
  }


  const loginComEmaileSenha = async () => {
    try {
      const user = await signInComEmail(email, senha);
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

      <View style={{ paddingTop: 10 , zIndex: 1}}>
        <Topo />
      </View>

      <View style={styles.areaLoginBanner}>


        <View style={styles.areaLogin}>
          <View style={styles.caixaLogin}>

            <View style={{ gap: 10, alignItems: 'center' }}>
              <Text style={styles.TextoLogin}>Login</Text>
              <Text style={styles.TextoLoginInformeEmail}>Informe seu e-mail e senha abaixo:</Text>
            </View>

            <View style={{ gap: 20 }}>

              <View style={styles.boxTextInput}>
                <TextInput style={styles.TextInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder='E-mail'
                  placeholderTextColor={'rgba(0,0,0,0.5)'} secureTextEntry={false} />
              </View>


              <View style={styles.boxTextInput}>
                <TextInput style={styles.TextInput}
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
                      <AntDesign name="eye-invisible" size={24} color="black" />
                    ) : (
                      <AntDesign name="eye" size={24} color="black" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                {senhaIncorreta && (
                  <Text style={{ color: 'red', fontSize: 14 }}>Senha Incorreta</Text>
                )}              </View>


              <View style={styles.botoes}>

                <TouchableOpacity style={styles.botaoLogin}
                  onPress={loginComEmaileSenha}>
                  <Text style={styles.textoBotaoLogin}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoGoogle} onPress={loginComGoogle}>
                  <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/images.png')} />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={{ color: '#336BF7' }}>Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={{ color: '#336BF7' }}>Criar Conta</Text>
                </TouchableOpacity>

              </View>


            </View>
          </View>
        </View>


        <View style={styles.areaBanner}>
          <Image style={{ width: '100%', height: '100%', }} source={require('../../../assets/images/ImagemTelaLogin.png')} />

        </View>

      </View>
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

})