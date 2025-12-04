import { criarPreferenciaPagamento } from '@/back-end/api.assinatura';
import { configuracaoUsuario } from '@/back-end/api.cadastroLogin';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Topo from '../../../components/topo';
import { useCpfInvalido, useEmailInvalido, useImagemLocal, verificarDados } from '../hooks/validaçõesDeUsuario';


export default function CadastroProfissional() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [crp, setCrp] = useState('');
    const [Biografia, setBiografia] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);
    const [mostrarSenha, setmostrarSenha] = useState(true);
    const [emailInvalido] = useEmailInvalido(email)
    const [cpfInvalido, cpfCadastrado] = useCpfInvalido(cpf);
    const [url] = useImagemLocal(imagem)
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dadosValidos = verificarDados(cpfInvalido, emailInvalido, cpfCadastrado,
        crp, cpf, email, senha, confirmarSenha, nome, dataNascimento)
        

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
                style={[styles.areaCadastroBanner, isMobile && styles.areaCadastroBannerMobile]}>
                <View
                    style={[styles.areaCadastro, isMobile && styles.areaCadastroMobile]}>
                    <Text
                        style={[styles.TextoCadastro, isMobile && styles.TextoCadastroMobile]}>
                        Cadastro de Profissional
                    </Text>
                    <View
                        style={[styles.inputsCadastro, isMobile && styles.inputsCadastroMobile]}>
                        <TextInput
                            style={[styles.TextInput, isMobile && styles.TextInputMobile]}
                            value={nome}
                            onChangeText={setNome}
                            placeholder='Nome *'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                        />
                        <TextInputMask
                            style={[styles.TextInput, isMobile && styles.TextInputMobile]}
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
                            style={[styles.TextInput, isMobile && styles.TextInputMobile]}
                            value={telefone}
                            onChangeText={setTelefone}
                            placeholder='Telefone'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                        />
                        <TextInput
                            style={[styles.TextInput, isMobile && styles.TextInputMobile]}
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
                            style={[styles.nascimentoCrp, isMobile && styles.nascimentoCrpMobile]}>

                            <TextInputMask
                                type={'datetime'}
                                options={{
                                    format: 'dd/MM/aaaa'
                                }}
                                style={[styles.TextInput, styles.TextInputDataCrp, isMobile && styles.TextInputDataCrpMobile]}
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
                                style={[styles.TextInput, styles.TextInputDataCrp, isMobile && styles.TextInputDataCrpMobile]}
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
                                styles.TextInputBiografia,
                                isMobile && styles.TextInputBiografiaMobile
                            ]} value={Biografia}
                            onChangeText={setBiografia}
                            placeholder='Biografia'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                        />
                        <View
                            style={[styles.boxTextInput, isMobile && styles.boxTextInputMobile]}>
                            <TextInput
                                style={[styles.TextInput, styles.TextInputSenha, isMobile && styles.TextInputMobile]}
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
                            style={[styles.boxTextInput, isMobile && styles.boxTextInputMobile]}>
                            <TextInput
                                style={[styles.TextInput, styles.TextInputSenha, isMobile && styles.TextInputMobile]}
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
                            if (!dadosValidos) {
                                alert('Preencha todos os campos obrigatórios corretamente');
                                return;
                            }

                            try {
                                // Primeiro, criar o usuário
                                const user = await configuracaoUsuario({
                                    'email': email, 'senha': senha, 'confirmarSenha': confirmarSenha,
                                    'nome': nome, 'cpf': cpf, 'telefone': telefone, 'dataNascimento': dataNascimento,
                                    'crp': crp, 'biografia': Biografia, 'colecao': 'profissionais', 
                                    'horariosAtendimento': []
                                }, imagem, 'profissionais');

                                if (!user) {
                                    Alert.alert('Erro', 'Não foi possível criar o usuário. Verifique os dados e tente novamente.');
                                    return;
                                }

                                // Após criar o usuário, redirecionar para pagamento
                                try {
                                    console.log('=== INICIANDO PAGAMENTO PROFISSIONAL ===');
                                    console.log('UserId:', user.uid);
                                    
                                    const resultado = await criarPreferenciaPagamento(
                                        39.00,
                                        'Assinatura Profissional - Renascer',
                                        user.uid,
                                        'profissional'
                                    );
                                    
                                    const checkoutUrl = resultado.checkoutUrl;
                                    const preferenceId = resultado.preferenceId;
                                    const externalReference = resultado.externalReference;
                                    
                                    console.log('✅ Preferência criada:', { preferenceId, externalReference });
                                    
                                    // Salvar preferenceId e externalReference no localStorage para diagnóstico
                                    if (typeof window !== 'undefined' && window.localStorage) {
                                        if (preferenceId) {
                                            localStorage.setItem('last_preference_id', preferenceId);
                                            console.log('💾 Preference ID salvo no localStorage:', preferenceId);
                                        }
                                        if (externalReference) {
                                            localStorage.setItem('last_external_reference', externalReference);
                                            console.log('💾 External Reference salvo no localStorage:', externalReference);
                                        }
                                    }
                                    
                                    // Para web, abrir checkout em nova aba e redirecionar para pagamentoSucesso
                                    if (typeof window !== 'undefined') {
                                        console.log('🌐 Ambiente web detectado - abrindo checkout em nova aba');
                                        
                                        // Abrir checkout em nova aba
                                        const newWindow = window.open(
                                            checkoutUrl, 
                                            '_blank',
                                            'noopener,noreferrer'
                                        );
                                        
                                        if (newWindow) {
                                            console.log('✅ Nova aba aberta com sucesso!');
                                            
                                            // Redirecionar para tela de pagamentoSucesso na aba atual
                                            // A tela verificará automaticamente quando o pagamento for confirmado
                                            router.push({
                                                pathname: '/screens/pagamento_sucesso',
                                                params: {
                                                    user_id: user.uid,
                                                    tipo: 'profissional',
                                                    status: 'waiting',
                                                    preference_id: preferenceId,
                                                    external_reference: externalReference
                                                }
                                            } as any);
                                        } else {
                                            // Se não conseguiu abrir nova aba, abrir na mesma aba
                                            console.warn('⚠️ Não foi possível abrir nova aba, redirecionando na mesma aba');
                                            window.location.href = checkoutUrl;
                                        }
                                    } else {
                                        // Para React Native, usar Linking
                                        try {
                                            const canOpen = await Linking.canOpenURL(checkoutUrl);
                                            if (canOpen) {
                                                await Linking.openURL(checkoutUrl);
                                                // Redirecionar para pagamentoSucesso
                                                router.push({
                                                    pathname: '/screens/pagamento_sucesso',
                                                    params: {
                                                        user_id: user.uid,
                                                        tipo: 'profissional',
                                                        status: 'waiting',
                                                        preference_id: preferenceId,
                                                        external_reference: externalReference
                                                    }
                                                } as any);
                                            } else {
                                                Alert.alert('Erro', 'Não foi possível abrir o link de pagamento');
                                            }
                                        } catch (error: any) {
                                            console.error('Erro ao abrir link:', error);
                                            Alert.alert('Erro', 'Não foi possível abrir o link de pagamento');
                                        }
                                    }
                                } catch (error: any) {
                                    console.error('❌ Erro ao processar pagamento:', error);
                                    Alert.alert(
                                        'Erro', 
                                        `Não foi possível processar o pagamento: ${error.message || 'Erro desconhecido'}. Você pode fazer o pagamento depois na tela de assinatura.`,
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    // Redirecionar para home mesmo com erro
                                                    router.push('/');
                                                }
                                            }
                                        ]
                                    );
                                }
                            } catch (error: any) {
                                console.error('Erro ao cadastrar:', error);
                                Alert.alert('Erro', 'Não foi possível completar o cadastro. Tente novamente.');
                            }
                        }}>
                        <Text
                            style={styles.textoBotaoCadastrar}>
                            Confirmar
                        </Text>
                    </TouchableOpacity>
                </View>
                {!isMobile && (
                    <View style={styles.areaBanner}>
                        <Image
                            style={styles.imagem}
                            source={require('../../../assets/images/imagemCadastroProfissional.png')} />
                    </View>
                )}
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
    },
    // Estilos Mobile
    inputsCadastroMobile: {
        width: '100%',
        paddingHorizontal: 15,
    },
    TextInputMobile: {
        width: '100%',
    },
    boxTextInputMobile: {
        width: '100%',
    },
    nascimentoCrpMobile: {
        flexDirection: 'column',
        width: '100%',
        gap: 10,
    },
    TextInputDataCrpMobile: {
        width: '100%',
    },
    TextInputBiografiaMobile: {
        width: '100%',
    },
    areaCadastroBannerMobile: {
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    areaCadastroMobile: {
        flex: 1,
        width: '100%',
        paddingVertical: 10,
    },
    TextoCadastroMobile: {
        fontSize: 24,
        marginBottom: 10,
    },
})