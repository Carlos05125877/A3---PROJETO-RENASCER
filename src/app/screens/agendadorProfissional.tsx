import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import { TextInputMask } from 'react-native-masked-text'
import { TextInput } from 'react-native-gesture-handler'
import { adicionar_Dados_FireStore, enviar_Arquivos_Storage_E_Retornar_Url, Obter_Dados_Firestore } from '@/back-end/Api'
import { auth } from '@/back-end/Api'




export default function AgendadorProfissional() {
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

            const dadosUser = await Obter_Dados_Firestore(user.uid)
            if (dadosUser) {
                setDados(dadosUser)
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
            const novaUrl = await enviar_Arquivos_Storage_E_Retornar_Url({ 'urlImagem': imagem }, user.uid)
            dados.urlImagem = novaUrl['urlImagem']
        }
        if (dados) {
            dados.biografia = biografia
            dados.endereco = endereco
            dados.whatsapp = whatsapp
            dados.instagram = instagram
            dados.preco = preco
            dados.horariosAtendimento = [...horarioSelecionado]
            dados.horariosAtendimento.sort()
            await adicionar_Dados_FireStore(user.uid, "profissionais", dados);
            alert("Dados Salvos com Sucesso");
        }
    }




    const horarios = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']



    return (
        <View style={styles.componentePai}>
            <Text style={styles.meuPerfil}>Meu Perfil</Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1, overflowX: 'auto',
                    backgroundColor: '#E8E8E8ff',
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 1,
                        height: 1,
                    },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,

                }}
                contentContainerStyle={styles.box}
            >
                <View style={styles.dadosProfissional}>
                    <TouchableOpacity
                        onPress={() => selecionadorImagem.current?.click()}
                    >
                        <Image
                            style={styles.imagemProfissional}
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
                    <View style={styles.infoProfissional}>
                        <Text style={styles.nomeProfissional}>
                            {dados && dados.nome}
                        </Text>
                        <Text style={styles.profissãoProfissional}>
                            Profissão:{dados && dados.profissao}
                        </Text>
                        <Text style={styles.crp}>
                            CRP: {dados && dados.crp}
                        </Text>
                    </View>
                </View>
                <Text style={styles.subtitulo}>Biografia</Text>
                <View style={styles.boxDescricao}>
                    <TextInput
                        multiline
                        style={styles.inputDescricao}
                        maxLength={400}
                        placeholder='Esse campo será visivel para todos'
                        placeholderTextColor={'rgba(0,0,0,0.5'}
                        value={biografia}
                        onChangeText={setBiografia}
                    />
                </View>
                <Text style={styles.subtitulo}>Endereço</Text>
                <View style={styles.boxEndereco}>
                    <TextInput
                        style={styles.inputEndereco}
                        value={endereco}
                        onChangeText={setEndereco}
                    />
                </View>
                <View style={styles.whstsInsta}>
                    <View
                        style={{
                            width: '45%',
                            gap: 5
                        }}
                    >
                        <Text style={styles.subtitulo}>Whatsapp</Text>
                        <View style={styles.boxWhats}>
                            <TextInputMask
                                type='cel-phone'
                                value={whatsapp}
                                onChangeText={setWhatsapp}
                                style={styles.inputWhats}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            width: '45%',
                            gap: 5
                        }}
                    >
                        <Text style={styles.subtitulo}>Instagram</Text>
                        <View style={styles.boxInsta}>
                            <TextInputMask
                                type='custom'
                                style={styles.inputInsta}
                                options={{
                                    mask: '@******************************'
                                }}
                                value={instagram}
                                onChangeText={setInstagram} />
                        </View>
                    </View>
                </View>
                <Text style={styles.subtitulo}>Preço</Text>
                <View style={styles.boxPreco}>
                    <TextInputMask
                        value={preco}
                        onChangeText={setPreco}
                        type='money'
                        style={styles.inputPreco} />
                </View>
                <Text style={styles.subtitulo}>Disponibilidade de Horários</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}
                >
                    {
                        horarios.map((horario, index) => {

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.selecionarHorario,
                                    horarioSelecionado.includes(horario) && styles.horarioSelecionado]}
                                    onPress={() => {
                                        horariosClicados(horario)
                                        console.log(horarioSelecionado)
                                    }
                                    }
                                >
                                    <Text style={styles.textoHorario}>
                                        {horario}
                                    </Text>
                                </TouchableOpacity>
                            )

                        })
                    }
                </View>
                <View style={styles.botaoSalvar}>
                    <TouchableOpacity style={styles.botao}
                        onPress={enviarDados}
                    >

                        <Text style={styles.textoSalvar}>Salvar</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

        </View >
    )

}

const styles = StyleSheet.create({
    componentePai: {
        alignItems: 'center',
        marginVertical: 25,
        flex: 1,

    },
    meuPerfil: {
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: 700,
        marginHorizontal: 20,
        marginBottom: 15

    },
    box: {
        padding: 20,
        borderRadius: 20,
        flex: 1,
        gap: 7,
    },
    dadosProfissional: {
        flexDirection: 'row',
        gap: 35

    },
    imagemProfissional: {
        width: 150,
        height: 150,
        borderRadius: 7
    },
    infoProfissional: {

    },

    nomeProfissional: {
        fontFamily: "Arial",
        fontSize: 25,
        fontWeight: 700,

    },
    profissãoProfissional: {
        fontFamily: "Arial",
        fontSize: 22,
        fontWeight: 700,

    },
    crp: {
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: 700,

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
        height: '60%',
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
        margin: 35
    },
    botao: {
        marginBottom: 15,
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
    }



})