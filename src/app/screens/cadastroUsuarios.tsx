import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { adicionar_Dados_FireStore,enviar_Arquivos_Storage_E_Retornar_Url } from '../../../back-end/Api';
import { cadastroUsuario, signInComContaGoogle } from '@/back-end/api.cadastroLogin';
import { verificarCpf, cpfExistente } from '../../../back-end/API/Validações/validarCPF';
import Topo from '../../../components/topo';


export default function CadastroUsuarios() {
    const router = useRouter();

    const bloquearBotaoGoogle = useRef(false);
    const [mostrarSenha, setmostrarSenha] = useState(true);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaNaoConfere, setSenhaNaoConfere] = useState(false);
    const [cpfInvalido, setCpfInvalido] = useState(false);
    const [cpfCadastrado, setCpfCadastrado] = useState(false)
    const [emailInvalido, setEmailInvalido] = useState(false);
    const bloquarBotaoConfirmar = useRef(true);

    useEffect(() => {
        if (email === '') {
            setEmailInvalido(false);
        } else {
            const verificador = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (verificador.test(email)) {
                setEmailInvalido(false);
            } else {
                setEmailInvalido(true);
            }
        }

    }, [email])

    useEffect(() => {
        if (confirmarSenha != senha) {
            setSenhaNaoConfere(true);
        } else {
            setSenhaNaoConfere(false);
        }
    }, [senha, confirmarSenha])


    useEffect(() => {
        const validadorCpf = async () => {
            const cpfNumeros = cpf.replace(/\D/g, '');
                setCpfInvalido(false);
                setCpfCadastrado(false);
            
            if(cpfNumeros.length ===11){
            const invalido = !verificarCpf(cpfNumeros);
            if (invalido) {
                setCpfInvalido(true);
                return
            }
            const existe = await cpfExistente(cpf);
            if (existe) {
                setCpfCadastrado(true)
                return
            }
        }
        }
        validadorCpf()
    },[cpf])

    useEffect(() => {
        if (!cpfInvalido && !senhaNaoConfere && !emailInvalido
            && cpf.length >= 14 && email != '' && senha != ''
            && confirmarSenha != '' && nome != '' && dataNascimento != '') {
            bloquarBotaoConfirmar.current = false;
        } else {
            bloquarBotaoConfirmar.current = true;
        }
    }, [cpf, email, senha, dataNascimento, nome, confirmarSenha, senhaNaoConfere, cpfInvalido, emailInvalido]
    )



    const verificarCadastroUsuario = async () => {
        if (senha === confirmarSenha) {
            try {
                const imagem = null
                const user = await cadastroUsuario({
                    'email': email, 'senha': senha,
                    'nome': nome, 'cpf': cpf, 'telefone': telefone, 'dataNascimento': dataNascimento, 'colecao': 'users'
                });
                const urlImagem = await enviar_Arquivos_Storage_E_Retornar_Url({ 'urlImagem': imagem }, user.uid);

                adicionar_Dados_FireStore(user.uid, 'users', urlImagem);
                if (user.emailVerified) {
                    console.log('cadastro criado com sucesso');
                    router.push('/');
                }
            } catch (error: any) {
                console.error(error.code);
                console.error(error.message);
            }
        } else {
            console.warn('Falha ao cadastrar usuario. Senhas divergentes');
        }
    }




    const loginComGoogle = async () => {
        if (bloquearBotaoGoogle.current === true) return;

        try {
            bloquearBotaoGoogle.current = true

            const user = await signInComContaGoogle();
            if (user) {
                router.push('/');
            }
        } catch (error: any) {
            console.error(error.code);
            console.error(error.message);
        } finally {
            bloquearBotaoGoogle.current = false;
        }
    }


    return (
        <View style={styles.backgroundPagina}>

            <View style={{ paddingTop: 10, zIndex: 1 }}>
                <Topo />
            </View>

            <View style={styles.areaCadastroBanner}>


                <View style={styles.areaCadastro}>
                    <View style={styles.caixaCadastro}>

                        <View>
                            <Text style={styles.TextoCadastro}>Cadastro de Usuário</Text>
                        </View>

                        <View style={{ gap: 10 }}>

                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={nome}
                                    onChangeText={setNome}
                                    placeholder='Nome *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'} secureTextEntry={false} />
                            </View>


                            <View style={styles.boxTextInput}>
                                <TextInputMask
                                    style={styles.TextInput}
                                    type={'cpf'}
                                    value={cpf}
                                    onChangeText={setCpf}
                                    placeholder='CPF *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}

                                />
                            </View>
                            {cpfInvalido && <Text style={{ color: 'red' }}>CPF inválido</Text>}
                            {cpfCadastrado && <Text style={{ color: 'red' }}>CPF já cadastrado</Text>}

                            <View style={styles.boxTextInput}>
                                <TextInputMask
                                    type={'cel-phone'}
                                    options={{
                                        maskType: 'BRL',
                                        withDDD: true,
                                    }
                                    }
                                    style={styles.TextInput}
                                    value={telefone}
                                    onChangeText={setTelefone}
                                    placeholder='Telefone'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder='E-mail *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            {!emailInvalido ? '' : <Text style={{ color: 'red' }}>E-mail Invalido</Text>}
                            <View style={styles.boxTextInput}>
                                <TextInputMask
                                    type={'datetime'}
                                    options={{
                                        format: 'dd/MM/aaaa'
                                    }}
                                    style={styles.TextInput}
                                    value={dataNascimento}
                                    onChangeText={setDataNascimento}
                                    placeholder='Data de Nascimento *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={senha}
                                    onChangeText={setSenha}
                                    placeholder='Senha *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={mostrarSenha}
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
                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={confirmarSenha}
                                    onChangeText={setConfirmarSenha}
                                    placeholder='Confirmar Senha *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={mostrarSenha}
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
                            <Text>{!senhaNaoConfere ? '' : <Text style={{ color: 'red' }}>Senhas não conferem</Text>}</Text>


                            <View style={styles.botoes}>

                                <TouchableOpacity style={styles.botaoCadastrar}
                                    onPress={async () => {
                                        if (bloquarBotaoConfirmar.current) {
                                            alert('Preencha todos os campos obrigatórios');
                                        } else {
                                            await verificarCadastroUsuario()
                                        }
                                    }}>
                                    <Text style={styles.textoBotaoCadastrar}>Confirmar</Text>
                                </TouchableOpacity>

                                <Text style={styles.textoCadastrarCom}>Cadastrar com</Text>

                                <TouchableOpacity style={styles.botaoGoogle} onPress={loginComGoogle}>
                                    <Image style={{ width: 25, height: 25 }} source={require
                                        ('../../../assets/images/images.png')} />
                                </TouchableOpacity>
                            </View>


                        </View>


                    </View>
                </View>


                <View style={styles.areaBanner}>
                    <Image style={{ width: '100%', height: '100%', alignContent: 'center', justifyContent: 'center' }}
                        source={require('../../../assets/images/imagemCadastro.png')} />

                </View>

            </View>

        </View>

    )

}
const styles = StyleSheet.create({
    backgroundPagina: {
        flex: 1,
        backgroundColor: '#ffffff',
        gap: 10,
    },

    areaCadastroBanner: {
        flexDirection: 'row',
        flex: 1,
    },

    areaCadastro: {
        flex: 0.42,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    caixaCadastro: {
        width: '60%',
        height: '80%',
        gap: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    areaBanner: {
        flex: 0.58,
        justifyContent: 'center',
        alignItems: 'center',
    },
    AreaTextoCadastro: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    TextoCadastro: {
        color: '#000',
        fontFamily: "Arial",
        fontSize: 35,
        fontWeight: 700,
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
        height: 40,
        overflow: 'hidden'

    },

    TextInput: {
        width: 375,
        height: 45,
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        opacity: 1,
        color: '#000000',
    },
    botoes: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    botaoCadastrar: {
        borderRadius: 7,
        width: '65%',
        height: 50,
        backgroundColor: '#336BF7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoCadastrarCom: {
        fontFamily: 'Arial',
        opacity: 0.5,
        fontSize: 20,
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
        justifyContent: 'center',
    },
    textoBotaoCadastrar: {
        color: '#FFF',
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 700,
    },

})