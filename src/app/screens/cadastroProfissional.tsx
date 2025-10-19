import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { adicionar_Dados_FireStore, cadastroUsuario, enviar_Arquivos_Storage_E_Retornar_Url } from '../../../back-end/Api';
import { verificarCpf } from '../../../back-end/API/Validações/validarCPF';
import Topo from '../../../components/topo';


export default function CadastroUsuarios() {
    const router = useRouter();

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
    const [emailInvalido, setEmailInvalido] = useState(false);
    const bloquarBotaoConfirmar = useRef(true);
    const [Biografia, setBiografia] = useState('');
    const urlImagem = useRef<string>('')
    const [crp, setCrp] = useState('');


    const inputRef = useRef<HTMLInputElement | null>(null);
    const [imagem, setImagem] = useState<File | null>(null);


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


    useEffect(
        () => {
            const cpfNumeros = cpf.replace(/\D/g, '');
            if (cpfNumeros.length === 11) {
                setCpfInvalido(!verificarCpf(cpfNumeros));
            } else {
                setCpfInvalido(false);
            }
        }, [cpf]);

    useEffect(
        () => {
            if (!cpfInvalido && !senhaNaoConfere && !emailInvalido
                && cpf.length >= 14 && email != '' && senha != ''
                && confirmarSenha != '' && nome != '' && dataNascimento != '') {
                bloquarBotaoConfirmar.current = false;
            } else {
                bloquarBotaoConfirmar.current = true;
            }
        }, [cpf, email, senha,
        dataNascimento, nome,
        confirmarSenha, senhaNaoConfere,
        cpfInvalido, emailInvalido]
    )




    const verificarCadastroUsuario = async () => {
        if (senha === confirmarSenha) {
            try {
                const user = await cadastroUsuario(email, senha,
                    nome, cpf, telefone,
                    dataNascimento);
                urlImagem.current = await enviar_Arquivos_Storage_E_Retornar_Url(imagem, user.uid);

                adicionar_Dados_FireStore(user.uid, {urlImagem: urlImagem.current});
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
    return (
        <View
            style={styles.backgroundPagina}>

            <View
                style={{ paddingTop: 10 }}>
                <Topo />
            </View>

            <View
                style={styles.areaCadastroBanner}>


                <View
                    style={styles.areaCadastro}>
                    <View
                        style={styles.caixaCadastro}>

                        <View>
                            <Text
                                style={styles.TextoCadastro}>
                                Cadastro de Profissional
                            </Text>
                        </View>

                        <View
                            style={{ gap: 10 }}>

                            <View
                                style={styles.boxTextInput}>
                                <TextInput
                                    style={styles.TextInput}
                                    value={nome}
                                    onChangeText={setNome}
                                    placeholder='Nome *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'} secureTextEntry={false}
                                />
                            </View>


                            <View
                                style={styles.boxTextInput}>
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
                            {
                                !cpfInvalido ?
                                    '' :
                                    <Text
                                        style={{ color: 'red' }}>
                                        CPF inválido
                                    </Text>
                            }

                            <View
                                style={styles.boxTextInput}>
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
                            <View
                                style={styles.boxTextInput}>
                                <TextInput
                                    style={styles.TextInput}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder='E-mail *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            {
                                !emailInvalido
                                    ? ''
                                    : <Text
                                        style={{ color: 'red' }}>
                                        E-mail Invalido
                                    </Text>
                            }
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 4
                                }}>
                                <View
                                    style={[
                                        styles.boxTextInput,
                                        { width: 185 }
                                    ]}>
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
                                <View
                                    style={[
                                        styles.boxTextInput, { width: 185 }
                                    ]}>
                                    <TextInputMask
                                        type={'custom'}
                                        options={{
                                            mask: '99/99999'
                                        }}
                                        style={styles.TextInput}
                                        value={crp}
                                        onChangeText={setCrp}
                                        placeholder='CRP *'
                                        placeholderTextColor={'rgba(0,0,0,0.5)'}
                                        secureTextEntry={false}
                                    />
                                </View>

                            </View>
                            <View
                                style={[
                                    styles.boxTextInput,
                                    { height: 75 }
                                ]}>
                                <TextInput
                                    multiline
                                    style={[
                                        styles.TextInput,
                                        {
                                            textAlign: 'justify',
                                            paddingTop: 10,
                                            paddingHorizontal: 10,
                                            height: 75,
                                        },
                                    ]} value={Biografia}
                                    onChangeText={setBiografia}
                                    placeholder='Biografia'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false} />
                            </View>
                            <View
                                style={styles.boxTextInput}>
                                <TextInput
                                    style={styles.TextInput}
                                    value={senha}
                                    onChangeText={setSenha}
                                    placeholder='Senha *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={mostrarSenha}
                                />
                                <TouchableOpacity
                                    onPress={() => { setmostrarSenha(!mostrarSenha) }}>
                                    <View
                                        style={{
                                            padding: 10,
                                            opacity: 0.5
                                        }}>
                                        {
                                            mostrarSenha
                                                ? (
                                                    <AntDesign name="eye-invisible" size={24} color="black" />
                                                )
                                                : (
                                                    <AntDesign name="eye" size={24} color="black" />
                                                )
                                        }
                                    </View>
                                </TouchableOpacity>


                            </View>
                            <View
                                style={styles.boxTextInput}>
                                <TextInput
                                    style={styles.TextInput}
                                    value={confirmarSenha}
                                    onChangeText={setConfirmarSenha}
                                    placeholder='Confirmar Senha *'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={mostrarSenha}
                                />
                                <TouchableOpacity
                                    onPress={() => { setmostrarSenha(!mostrarSenha) }}>
                                    <View
                                        style={{ padding: 10, opacity: 0.5 }}>
                                        {
                                            mostrarSenha
                                                ? (
                                                    <AntDesign name="eye-invisible" size={24} color="black" />
                                                )
                                                : (
                                                    <AntDesign name="eye" size={24} color="black" />
                                                )}
                                    </View>
                                </TouchableOpacity>

                            </View>
                            <Text
                                style={{ color: 'red' }}>
                                {
                                    !senhaNaoConfere
                                        ? ''
                                        : 'Senhas não conferem'}
                            </Text>


                            <View
                                style={styles.botoes}>
                                <View
                                    style={{
                                        width: 75,
                                        height: 85,
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        borderColor: 'rgba(0,0,0,0.5)',
                                    }} >

                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            overflow: 'hidden'
                                        }}
                                        onPress={async () => {
                                            inputRef.current?.click()
                                        }}>
                                        {!imagem ?
                                            <Image source={require('../../../assets/images/user.png')}
                                                style={{ width: 75, height: 85 }}
                                            />
                                            : <Image source={{ uri: URL.createObjectURL(imagem) }}
                                                style={{ width: 75, height: 83, overflow: 'hidden', borderRadius: 8 }}

                                            />}

                                        <input
                                            ref={inputRef}
                                            type='file'
                                            accept='image/*'
                                            style={{ display: 'none' }}
                                            onChange={(e) =>
                                                e.target.files?.[0] && setImagem(e.target.files?.[0])
                                            }
                                        />
                                    </TouchableOpacity>

                                </View>

                                <TouchableOpacity
                                    style={styles.botaoCadastrar}
                                    onPress={async () => {
                                        if (bloquarBotaoConfirmar.current) {
                                            alert('Preencha todos os campos obrigatórios');
                                        } else {
                                            await verificarCadastroUsuario()
                                        }
                                    }}>
                                    <Text
                                        style={styles.textoBotaoCadastrar}>
                                        Confirmar
                                    </Text>
                                </TouchableOpacity>

                            </View>


                        </View>


                    </View>
                </View>


                <View
                    style={styles.areaBanner}>
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                            alignContent: 'center',
                            justifyContent: 'center'
                        }}
                        source={require('../../../assets/images/imagemCadastroProfissional.png')} />

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
        gap: 20,
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
        fontSize: 32,
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
        height: 35,
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
        gap: 15,
        overflow: 'hidden'
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