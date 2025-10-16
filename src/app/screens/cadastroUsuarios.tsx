import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cadastroUsuario, signInComContaGoogle } from '../../../back-end/Api';
import Topo from '../../../components/topo';



export default function CadastroUsuarios() {
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaConfere, setSenhaConfere] = useState(false);


    useEffect(() => {
        if (confirmarSenha != senha) {
            setSenhaConfere(true);
        } else {
            setSenhaConfere(false);
        }
    }, [senha, confirmarSenha])



    const verificarCadastroUsuario = async () => {
        if (senha === confirmarSenha) {
            try {
                const user = await cadastroUsuario(email, senha);
                if (user) {
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
        try {
            const user = await signInComContaGoogle();
            if (user) {
                router.push('/');
            }
        } catch (error: any) {
            console.error(error.code);
            console.error(error.message);
        }
    }


    return (
        <View style={styles.backgroundPagina}>

            <View style={{ paddingTop: 10 }}>
                <Topo />
            </View>

            <View style={styles.areaCadastroBanner}>


                <View style={styles.areaCadastro}>
                    <View style={styles.caixaCadastro}>

                        <View>
                            <Text style={styles.TextoCadastro}>Cadastro de Usuario</Text>
                        </View>

                        <View style={{ gap: 10 }}>

                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={nome}
                                    onChangeText={setNome}
                                    placeholder='Nome'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'} secureTextEntry={false} />
                            </View>


                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={cpf}
                                    onChangeText={setCpf}
                                    placeholder='CPF'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
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
                                    placeholder='E-mail'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={dataNascimento}
                                    onChangeText={setDataNascimento}
                                    placeholder='Data de Nascimento'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={senha}
                                    onChangeText={setSenha}
                                    placeholder='Senha'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            <View style={styles.boxTextInput}>
                                <TextInput style={styles.TextInput}
                                    value={confirmarSenha}
                                    onChangeText={setConfirmarSenha}
                                    placeholder='Confirmar Senha'
                                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                                    secureTextEntry={false}
                                />

                            </View>
                            <Text>{!senhaConfere ? '' : 'Senhas não conferem'}</Text>


                            <View style={styles.botoes}>

                                <TouchableOpacity disabled={senhaConfere} style={styles.botaoCadastrar}
                                    onPress={verificarCadastroUsuario}>
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
                    <Image style={{ width: 600, height: 600, alignContent: 'center', justifyContent: 'center' }}
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
        overflow: 'hidden'
    },
    caixaCadastro: {
        width: '60%',
        height: '80%',
        gap: 30,
        alignItems: 'center',
        justifyContent: 'center',

    },
    areaBanner: {
        backgroundColor: '#336BF7',
        flex: 0.58,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
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
        color: '#000000'
    },
    botoes: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20 
    },
    botaoCadastrar: {
        borderRadius: 7,
        width: '65%',
        height: 50,
        backgroundColor: '#336BF7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoCadastrarCom: {
        fontFamily: 'Arial',
        opacity: 0.5,
        fontSize: 20
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
    textoBotaoCadastrar: {
        color: '#FFF',
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 700,
    },

})