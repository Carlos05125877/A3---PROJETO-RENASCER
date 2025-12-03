import { adicaoDadosFirestore, auth, buscarDadosFirestore, criarArquivoStorage } from '@/back-end/Api'
import ConfirmarConsulta from '@/components/confirmarConsulta'
import Topo from '@/components/topo'
import { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { TextInputMask } from 'react-native-masked-text'




export default function EditorPerfil() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [nome, setNome] = useState('')
    const [profissao, setProfissao] = useState('')
    const [crp, setCrp] = useState('')
    const [biografia, setBiografia] = useState('');
    const [endereco, setEndereco] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [instagram, setInstagram] = useState('');
    const [preco, setPreco] = useState('0,00');
    const [horarioSelecionado, setHorarioSelecionado] = useState<string[]>([])
    const [dados, setDados] = useState<Record<string, any> | undefined>({})
    const selecionadorImagem = useRef<HTMLInputElement | null>(null)
    const [imagem, setImagem] = useState<File | null>(null)
    const [urlImagem, setUrlImagem] = useState<string>('')

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {

            if (!user) return

            const dadosUser = await buscarDadosFirestore(user.uid)
            if (dadosUser) {
                setDados(dadosUser)
                setNome(dadosUser.nome ?? '')
                setProfissao(dadosUser.profissao ?? '')
                setCrp(dadosUser.crp ?? '')
                setBiografia(dadosUser.biografia ?? '')
                setEndereco(dadosUser.endereco ?? '')
                setWhatsapp(dadosUser.whatsapp ?? '');
                setInstagram(dadosUser.instagram ?? '')
                setPreco(dadosUser.preco ?? '0,00')
                setHorarioSelecionado(dadosUser.horariosAtendimento ?? []);
                setUrlImagem(dadosUser.urlImagem)
            }
        })
    }, [])

    const horariosClicados = (horario: string) => {
        if (horarioSelecionado.includes(horario)) {
            setHorarioSelecionado(horarioSelecionado.filter(h => h !== horario));
        } else {
            setHorarioSelecionado([...horarioSelecionado, horario]);
        }
    };

    useEffect(() => {
        if (imagem && dados) {
            setUrlImagem(URL.createObjectURL(imagem))
            return
        }

    }, [imagem])

    const enviarDados = async () => {
        const user = auth.currentUser;

        if (!user) {
            alert("Não foi possível atualizar os dados. Verifique o login");
            return;
        }
        if (imagem && dados) {
            const novaUrl = await criarArquivoStorage({ 'urlImagem': imagem }, user.uid)
            dados.urlImagem = novaUrl['urlImagem']
        }
        if (dados) {
            dados.nome = nome
            dados.profissao = profissao
            dados.crp = crp
            dados.biografia = biografia
            dados.endereco = endereco
            if (whatsapp.length > 13) dados.whatsapp = whatsapp
            dados.instagram = instagram.substring(1)
            dados.preco = preco
            dados.horariosAtendimento = [...horarioSelecionado]
            dados.horariosAtendimento.sort()
            await adicaoDadosFirestore(user.uid, "profissionais", dados);
            alert("Dados Salvos com Sucesso");
        }
    }




    const horarios = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']



    return (
        <View style={styles.containerPrincipal}>
            <View style={styles.topoContainer}>
                <Topo />
            </View>
            <ScrollView 
                contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}
                showsVerticalScrollIndicator={false}
            >

            <Text style={[styles.meuPerfil, isMobile && styles.meuPerfilMobile]}>Meu Perfil</Text>
            <View style={[styles.box, isMobile && styles.boxMobile]}>
                <View style={[styles.dadosProfissional, isMobile && styles.dadosProfissionalMobile]}>
                    <TouchableOpacity
                        onPress={() => selecionadorImagem.current?.click()}
                    >
                        <Image
                            style={[styles.imagemProfissional, isMobile && styles.imagemProfissionalMobile]}
                            source={{ uri: urlImagem }}
                        />
                        <>
                            <input
                                ref={selecionadorImagem}
                                type="file"
                                accept='image/*'
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    e.target.files?.[0] && setImagem(e.target.files?.[0])
                                }}
                            />
                        </>
                    </TouchableOpacity>
                    <View style={[styles.infoProfissional, isMobile && styles.infoProfissionalMobile]}>
                        <View style={[styles.boxNomeProfissaoCrp, isMobile && styles.boxNomeProfissaoCrpMobile]}>
                            <TextInput
                                style={[styles.nomeProfissional, isMobile && styles.nomeProfissionalMobile]}
                                value={nome}
                                onChangeText={setNome}
                                placeholder='Nome*'
                                placeholderTextColor={'rgba(0,0,0,0.5)'}

                            />
                        </View>
                        <View style={[styles.boxNomeProfissaoCrp, isMobile && styles.boxNomeProfissaoCrpMobile]}>
                            <TextInput
                                style={[styles.profissãoProfissional, isMobile && styles.profissãoProfissionalMobile]}
                                value={profissao}
                                onChangeText={setProfissao}
                                placeholder='Profissão'
                                placeholderTextColor={'rgba(0,0,0,0.5)'}

                            />
                        </View>
                        <View style={[styles.boxNomeProfissaoCrp, isMobile && styles.boxNomeProfissaoCrpMobile]}>
                            <TextInputMask
                                style={[styles.crp, isMobile && styles.crpMobile]}
                                type={'custom'}
                                options={{
                                    mask: '99/99999'
                                }}
                                value={crp}
                                onChangeText={setCrp}
                                placeholder='CRP*'
                                placeholderTextColor={'rgba(0,0,0,0.5)'}
                            />
                        </View>
                    </View>
                </View>
                <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>Biografia</Text>
                <View style={[styles.boxDescricao, isMobile && styles.boxDescricaoMobile]}>
                    <TextInput
                        multiline
                        style={[styles.inputDescricao, isMobile && styles.inputDescricaoMobile]}
                        maxLength={400}
                        placeholder='Esse campo será visivel para todos'
                        placeholderTextColor={'rgba(0,0,0,0.5'}
                        value={biografia}
                        onChangeText={setBiografia}
                    />
                </View>
                <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>Endereço</Text>
                <View style={[styles.boxEndereco, isMobile && styles.boxEnderecoMobile]}>
                    <TextInput
                        style={[styles.inputEndereco, isMobile && styles.inputEnderecoMobile]}
                        value={endereco}
                        onChangeText={setEndereco}
                    />
                </View>
                <View style={[styles.whstsInsta, isMobile && styles.whstsInstaMobile]}>
                    <View
                        style={[
                            { width: '45%', gap: 5 },
                            isMobile && { width: '100%' }
                        ]}
                    >
                        <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>Whatsapp</Text>
                        <View style={[styles.boxWhats, isMobile && styles.boxWhatsMobile]}>
                            <TextInputMask
                                type='cel-phone'
                                value={whatsapp}
                                onChangeText={setWhatsapp}
                                style={[styles.inputWhats, isMobile && styles.inputWhatsMobile]}
                            />
                        </View>
                    </View>
                    <View
                        style={[
                            { width: '45%', gap: 5 },
                            isMobile && { width: '100%' }
                        ]}
                    >
                        <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>Instagram</Text>
                        <View style={[styles.boxInsta, isMobile && styles.boxInstaMobile]}>
                            <TextInputMask
                                type='custom'
                                style={[styles.inputInsta, isMobile && styles.inputInstaMobile]}
                                options={{
                                    mask: '@******************************'
                                }}
                                value={instagram}
                                onChangeText={setInstagram} />
                        </View>
                    </View>
                </View>
                <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>Preço</Text>
                <View style={[styles.boxPreco, isMobile && styles.boxPrecoMobile]}>
                    <TextInputMask
                        value={preco}
                        onChangeText={setPreco}
                        type='money'
                        style={[styles.inputPreco, isMobile && styles.inputPrecoMobile]} />
                </View>
                <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>Disponibilidade de Horários</Text>
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            height: isMobile ? 'auto' : '10%',
                        },
                        isMobile && styles.horariosContainerMobile
                    ]}
                >
                    {
                        horarios.map((horario, index) => {

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.selecionarHorario,
                                        isMobile && styles.selecionarHorarioMobile,
                                        horarioSelecionado.includes(horario) && styles.horarioSelecionado
                                    ]}
                                    onPress={() => {
                                        horariosClicados(horario)
                                    }
                                    }
                                >
                                    <Text style={[styles.textoHorario, isMobile && styles.textoHorarioMobile]}>
                                        {horario}
                                    </Text>
                                </TouchableOpacity>
                            )

                        })
                    }
                </View>
                <View style={[styles.botaoSalvar, isMobile && styles.botaoSalvarMobile]}>
                    <TouchableOpacity style={[styles.botao, isMobile && styles.botaoMobile]}
                        onPress={enviarDados}
                    >
                        <Text style={[styles.textoSalvar, isMobile && styles.textoSalvarMobile]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
                <View style={[styles.containerConsulta, isMobile && styles.containerConsultaMobile]}>
                    <ConfirmarConsulta 
                        style={[
                            styles.consulta, 
                            isMobile && styles.consultaMobile
                        ]} 
                        tipo='profissionais'  
                    />
                </View>
            </ScrollView>
        </View>


    )

}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
    },
    topoContainer: {
        zIndex: 1,
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: 20,
    },
    scrollContentMobile: {
        paddingTop: 10,
    },
    componentePai: {
        alignItems: 'center',
        flex: 1,

    },
    meuPerfil: {
        marginTop: 5,
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: 700,
        marginHorizontal: 20,
        marginBottom: 15,
        textAlign: 'center'

    },
    box: {
        padding: 20,
        borderRadius: 35,
        gap: 7,
        backgroundColor: '#E8E8E8ff',
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        width: '45%',
    },
    dadosProfissional: {
        flexDirection: 'row',
        gap: 35

    },
    imagemProfissional: {
        width: 200,
        height: 200,
        borderRadius: 8
    },
    infoProfissional: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10

    },


    nomeProfissional: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '100%',
        fontSize: 25,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,

    },
    profissãoProfissional: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '100%',
        fontSize: 18,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,

    },
    crp: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '100%',
        fontSize: 14,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,
    },
    subtitulo: {
        fontFamily: "Arial",
        fontSize: 15,
        fontWeight: 700,

    },

    boxDescricao: {
        backgroundColor: '#FFF',
        width: '100%',
        height: 100,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,
    },
    inputDescricao: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '100%',
        fontSize: 16,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,
    },
    boxNomeProfissaoCrp: {
        backgroundColor: '#FFF',
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,

    },

    boxEndereco: {
        backgroundColor: '#FFF',
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,

    },
    inputEndereco: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '100%',
        fontSize: 16,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,

    },
    whstsInsta: {
        flexDirection: 'row',
        overflow: 'hidden',
        height: 75,
        justifyContent: 'space-between',

    },

    boxWhats: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,
        width: '100%',
        height: 50,

    },
    inputWhats: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '95%',
        fontSize: 16,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,

    },

    boxInsta: {
        backgroundColor: '#FFF',
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,

    },
    inputInsta: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '95%',
        fontSize: 16,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,

    },

    boxPreco: {
        backgroundColor: '#FFF',
        width: '20%',
        height: 50,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,

    },
    inputPreco: {
        padding: 10,
        outlineWidth: 0,
        outlineColor: 'transparent',
        textAlign: 'justify',
        width: '100%',
        height: '95%',
        fontSize: 16,
        color: '#000',
        fontFamily: 'Inria Sans',
        lineHeight: 22,

    },

    selecionarHorario: {
        width: '12%',
        height: '40%',
        borderRadius: 7,
        borderColor: '#336BF7',
        borderWidth: 2,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    horarioSelecionado: {
        backgroundColor: '#336BF7',
    },
    textoHorario: {
        fontFamily: 'Arial',
        fontWeight: '600'
    },
    botaoSalvar: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '9%',
    },
    botao: {
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '35%',
        height: 50,
        backgroundColor: '#336BF7',
        borderRadius: 8
    },
    textoSalvar: {
        color: '#FFF',
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 700
    },

    // Estilos Mobile
    meuPerfilMobile: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
    },

    boxMobile: {
        width: '100%',
        padding: 15,
        borderRadius: 20,
    },

    dadosProfissionalMobile: {
        flexDirection: 'column',
        gap: 15,
        alignItems: 'center',
    },

    imagemProfissionalMobile: {
        width: 120,
        height: 120,
    },

    infoProfissionalMobile: {
        width: '100%',
    },

    boxNomeProfissaoCrpMobile: {
        height: 45,
        marginBottom: 10,
    },

    nomeProfissionalMobile: {
        fontSize: 18,
    },

    profissãoProfissionalMobile: {
        fontSize: 16,
    },

    crpMobile: {
        fontSize: 12,
    },

    subtituloMobile: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 5,
    },

    boxDescricaoMobile: {
        height: 80,
    },

    inputDescricaoMobile: {
        fontSize: 14,
    },

    boxEnderecoMobile: {
        height: 45,
    },

    inputEnderecoMobile: {
        fontSize: 14,
    },

    whstsInstaMobile: {
        flexDirection: 'column',
        height: 'auto',
        gap: 15,
    },

    boxWhatsMobile: {
        height: 45,
    },

    inputWhatsMobile: {
        fontSize: 14,
    },

    boxInstaMobile: {
        height: 45,
    },

    inputInstaMobile: {
        fontSize: 14,
    },

    boxPrecoMobile: {
        width: '100%',
        height: 45,
    },

    inputPrecoMobile: {
        fontSize: 14,
    },

    horariosContainerMobile: {
        paddingVertical: 10,
    },

    selecionarHorarioMobile: {
        width: '30%',
        height: 35,
        margin: 3,
    },

    textoHorarioMobile: {
        fontSize: 12,
    },

    botaoSalvarMobile: {
        height: 'auto',
        marginTop: 15,
    },

    botaoMobile: {
        width: '100%',
        height: 45,
    },

    textoSalvarMobile: {
        fontSize: 14,
    },

    containerConsulta: {
        alignItems: 'center',
        paddingVertical: 100,
        paddingHorizontal: 20,
    },

    consulta: {
        width: 1250,
        maxWidth: '100%',
    },

    containerConsultaMobile: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
    },

    consultaMobile: {
        width: '100%',
    },
})