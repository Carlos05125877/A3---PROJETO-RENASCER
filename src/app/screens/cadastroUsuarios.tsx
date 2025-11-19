import { cadastrarUsuario, loginComGoogle } from '@/back-end/api.cadastroLogin';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Topo from '../../../components/topo';
import { useCpfInvalido, useEmailInvalido } from '../hooks/validaçõesDeUsuario';


export default function CadastroUsuarios() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setmostrarSenha] = useState(true);
    const bloquarBotaoConfirmar = useRef(true);
    const bloquearBotaoGoogle = useRef(false);
    const [emailInvalido] = useEmailInvalido(email)
    const [cpfInvalido, cpfCadastrado] = useCpfInvalido(cpf)



    useEffect(() => {
        if (!cpfInvalido && senha === confirmarSenha && !emailInvalido
            && cpf.length >= 14 && email != '' && senha != ''
            && confirmarSenha != '' && nome != '' && dataNascimento != '') {
            bloquarBotaoConfirmar.current = false;
        } else {
            bloquarBotaoConfirmar.current = true;
        }
    }, [cpf, email, senha, dataNascimento, nome, confirmarSenha, senha, 
        confirmarSenha, cpfInvalido, emailInvalido]
    )




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
                            {senha !== confirmarSenha && <Text style={{ color: 'red' }}>Senhas não conferem</Text>}


                            <View style={styles.botoes}>

                                <TouchableOpacity style={styles.botaoCadastrar}
                                    onPress={async () => {
                                        if (bloquarBotaoConfirmar.current) {
                                            alert('Preencha todos os campos obrigatórios');
                                        } else {
                                            cadastrarUsuario({
                                                'email': email, 'senha': senha, 'nome': nome, 'cpf': cpf,
                                                'telefone': telefone, 'dataNascimento': dataNascimento,
                                                'colecao': 'users'
                                            }, null);
                                        }
                                    }}>
                                    <Text style={styles.textoBotaoCadastrar}>Confirmar</Text>
                                </TouchableOpacity>

                                <Text style={styles.textoCadastrarCom}>Cadastrar com</Text>

                                <TouchableOpacity style={styles.botaoGoogle}
                                    onPress={async () => {
                                        const user = await loginComGoogle(bloquearBotaoGoogle)
                                        user && router.push('/')
                                    }}>
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