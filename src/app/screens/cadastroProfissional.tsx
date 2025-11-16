import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { User } from 'firebase/auth';
import { adicionar_Dados_FireStore, enviar_Arquivos_Storage_E_Retornar_Url } from '../../../back-end/Api';
import { verificarCpf, cpfExistente} from '../../../back-end/API/Validações/validarCPF';
import Topo from '../../../components/topo';
import { cadastroUsuario } from '@/back-end/api.cadastroLogin';

export default function CadastroProfissional() {

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [crp, setCrp] = useState('');
    const [Biografia, setBiografia] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setmostrarSenha] = useState(true);
    const [cpfCadastrado, setCpfCadastrado] = useState(false)
    const [url, setUrl] = useState('')



    const [cpfInvalido, setCpfInvalido] = useState(false);
    const [emailInvalido, setEmailInvalido] = useState(false);
    const urlImagem = useRef<Record<string, string>>({})
    const user = useRef<User | null>(null)


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
        const validadorCpf = async () => {
            const cpfNumeros = cpf.replace(/\D/g, '');
            setCpfInvalido(false);
            setCpfCadastrado(false);

            if (cpfNumeros.length === 11) {
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
    }, [cpf])

    const verificarDados = async () => {
        const dadosValidos =
            !cpfInvalido &&
            !emailInvalido &&
            crp != '' &&
            cpf.length >= 14 &&
            email !== '' &&
            senha !== '' &&
            confirmarSenha !== '' &&
            nome !== '' &&
            dataNascimento !== '' &&
            senha === confirmarSenha;

        if (dadosValidos) {
            console.log('Dados válidos! Prosseguir com cadastro.');
            await cadastrarUsuario();
        } else {
            alert('Preencha todos os campos obrigatórios corretamente');
        }
    };

    useEffect( () => {
        if (!imagem) return

        setUrl(URL.createObjectURL(imagem))

    }, [imagem])



    const cadastrarUsuario = async (): Promise<boolean> => {
        if (senha === confirmarSenha) {
            try {
                user.current = await cadastroUsuario({
                    'email': email, 'senha': senha,
                    'nome': nome, 'cpf': cpf, 'telefone': telefone, 'dataNascimento': dataNascimento,
                    'crp': crp, 'biografia': Biografia, 'colecao': 'profissionais'
                });
                urlImagem.current = await enviar_Arquivos_Storage_E_Retornar_Url(
                    { 'urlImagem': imagem }, user.current.uid);

                adicionar_Dados_FireStore(user.current.uid, 'profissionais', urlImagem.current);
                return true;
            } catch (error: any) {
                console.error(error.code);
                console.error(error.message);
                return false;
            }


        } else {
            console.warn('Falha ao cadastrar usuario. Senhas divergentes');
            return false;
        }
    }

    const iconeSenha = () => {
        if (mostrarSenha) {
            return (<AntDesign style={styles.iconeMostrarSenha}
                name="eye-invisible" size={24} color="black" />
            )
        }
        return (<AntDesign style={styles.iconeMostrarSenha}
            name="eye" size={24} color="black" />
        )
    }
    return (
        <View
            style={styles.backgroundPagina}>

            <View
                style={styles.topo}>
                <Topo />
            </View>

            <View
                style={styles.areaCadastroBanner}>
                <View
                    style={styles.areaCadastro}>
                    <Text
                        style={styles.TextoCadastro}>
                        Cadastro de Profissional
                    </Text>
                    <View
                        style={styles.inputsCadastro}>
                        <TextInput
                            style={styles.TextInput}
                            value={nome}
                            onChangeText={setNome}
                            placeholder='Nome *'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                        />
                        <TextInputMask
                            style={styles.TextInput}
                            type={'cpf'}
                            value={cpf}
                            onChangeText={setCpf}
                            placeholder='CPF *'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                        />
                     {cpfInvalido && <Text style={styles.mensagemErro}>CPF inválido</Text>}
                            {cpfCadastrado && <Text style={styles.mensagemErro}>CPF já cadastrado</Text>}
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
                        />
                        <TextInput
                            style={styles.TextInput}
                            value={email}
                            onChangeText={setEmail}
                            placeholder='E-mail *'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                        />
                        {
                            emailInvalido &&
                            <Text
                                style={styles.mensagemErro}>
                                E-mail Invalido
                            </Text>
                        }
                        <View
                            style={styles.nascimentoCrp}>

                            <TextInputMask
                                type={'datetime'}
                                options={{
                                    format: 'dd/MM/aaaa'
                                }}
                                style={[styles.TextInput, styles.TextInputDataCrp]}
                                value={dataNascimento}
                                onChangeText={setDataNascimento}
                                placeholder='Data de Nascimento *'
                                placeholderTextColor={'rgba(0,0,0,0.5)'}
                            />
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '99/99999'
                                }}
                                style={[styles.TextInput, styles.TextInputDataCrp]}
                                value={crp}
                                onChangeText={setCrp}
                                placeholder='CRP *'
                                placeholderTextColor={'rgba(0,0,0,0.5)'}
                            />
                        </View>
                        <TextInput
                            multiline
                            style={[
                                styles.TextInput,
                                styles.TextInputBiografia
                            ]} value={Biografia}
                            onChangeText={setBiografia}
                            placeholder='Biografia'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                        />
                        <View
                            style={styles.boxTextInput}>
                            <TextInput
                                style={[styles.TextInput, styles.TextInputSenha]}
                                value={senha}
                                onChangeText={setSenha}
                                placeholder='Senha *'
                                placeholderTextColor={'rgba(0,0,0,0.5)'}
                                secureTextEntry={mostrarSenha}
                            />
                            <TouchableOpacity
                                onPress={() => { setmostrarSenha(!mostrarSenha) }}>
                                {iconeSenha()}
                            </TouchableOpacity>
                        </View>
                        <View
                            style={styles.boxTextInput}>
                            <TextInput
                                style={[styles.TextInput, styles.TextInputSenha]}
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                                placeholder='Confirmar Senha *'
                                placeholderTextColor={'rgba(0,0,0,0.5)'}
                                secureTextEntry={mostrarSenha}
                            />
                            <TouchableOpacity
                                onPress={() => { setmostrarSenha(!mostrarSenha) }}>
                                {iconeSenha()}
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={styles.mensagemErro}>
                            {senha != confirmarSenha && 'Senhas não conferem'}
                        </Text>
                        <TouchableOpacity
                            style={styles.botaoInput}
                            onPress={async () => {
                                inputRef.current?.click()
                            }}>
                            {!imagem ?
                                <Image source={require('../../../assets/images/user.png')}
                                    style={styles.imagemInput}
                                />
                                : <Image source={{ uri: url }}
                                    style={styles.imagemInput}

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
                            verificarDados();
                        }}>
                        <Text
                            style={styles.textoBotaoCadastrar}>
                            Confirmar
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.areaBanner}>
                    <Image
                        style={styles.imagem}
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
    topo: {
        paddingTop: 10,
        zIndex: 1
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
        gap: 20,

    },
    caixaCadastro: {
        width: '60%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputsCadastro: {
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    areaBanner: {
        flex: 0.58,
        justifyContent: 'center',
        alignItems: 'center',
    },
    AreaTextoCadastro: {
        justifyContent: 'center',
        alignItems: 'center',

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
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5,
        borderStyle: 'solid',
        height: 35,
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        opacity: 1,
        color: '#000000',
    },
    TextInputDataCrp: {
        width: 185,
    },
    TextInputBiografia: {
        textAlign: 'justify',
        paddingTop: 10,
        paddingHorizontal: 10,
        height: 75,
    },
    TextInputSenha: {
        borderWidth: 0,
    },
    mensagemErro: {
        color: 'red',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'

    },
    botoes: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        overflow: 'hidden'
    },
    botaoCadastrar: {
        borderRadius: 7,
        width: '35%',
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
    imagem: {
        width: '100%',
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    imagemInput: {
        width: 75,
        height: 83,
        overflow: 'hidden',
        borderRadius: 8
    },
    botaoInput: {
        flex: 1,
        overflow: 'hidden',
        width: 75,
        height: 85,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.5)',
    },
    nascimentoCrp: {
        flexDirection: 'row',
        gap: 4
    },
    iconeMostrarSenha: {
        padding: 10,
        opacity: 0.5
    }
})