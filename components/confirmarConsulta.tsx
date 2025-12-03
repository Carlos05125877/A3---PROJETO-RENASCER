
import { auth, buscarAgendamento, buscarDadosFirestore, mudarStatusAgendamento } from '@/back-end/Api';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps, useWindowDimensions } from 'react-native';



interface props extends ViewProps {
    tipo: string
}
export default function ConfirmarConsulta({ tipo, ...resto }: props) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [agendamento, setAgendamento] = useState<Record<string, string>[]>([])
    const [dadosUser, setDadosUser] = useState<Record<string, string> | undefined>()
    const route = useRouter()

    useEffect(() => {
        const autenticado = async () => {
            auth.onAuthStateChanged(async (user) => {
                if (!user) return
                setDadosUser(await buscarDadosFirestore(user.uid))
            })
        }
        autenticado()
    }, [])

    useEffect(() => {
        const dados = async () => {
            if (!auth.currentUser) return

            const agendamentos = await buscarAgendamento(tipo, auth.currentUser.uid)
            agendamentos?.forEach((doc) => {
                Object.values(doc.data()).forEach(async (dados) => {
                    if (!dadosUser) return
                    const infoCliente = await buscarDadosFirestore(dadosUser.colecao === 'profissionais' ?
                        dados.cliente : dados.profissional)
                    if (!infoCliente) {
                        return
                    }
                    const uniaoDados = {
                        ...dados,
                        nome: infoCliente.nome
                    }
                    console.log(dadosUser?.colecao)


                    setAgendamento((prev) => [...prev, uniaoDados])
                })
            }) 

        }
        dados();
    }, [dadosUser])


    return (
        <View {...resto} style={[resto.style, isMobile && { marginTop: 0 }]}>
            <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>Agenda</Text>
            <View style={[{
                backgroundColor: '#E8E8E8ff',
                borderRadius: 15,
                flex: 1,
                gap: 8,

            }, isMobile && styles.containerMobile]}>
                {!isMobile ? (
                    <>
                        <View style={styles.particoes}>
                            <Text style={styles.subtitulos}>Data</Text>
                            {dadosUser?.colecao === 'profissionais' ?
                                <Text style={styles.subtitulos}>Paciente</Text>
                                : <Text style={styles.subtitulos}>Psicologo</Text>
                            }
                            <Text style={styles.subtitulos}>Horário</Text>
                            <Text style={styles.subtitulos}>Status</Text>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)', }}></View>

                        {agendamento &&
                            agendamento.map((dados, index) => {
                                return (
                                    <View key={index} style={styles.particoes}>
                                        <Text style={styles.dados}>
                                            {dados.dia.slice(8, 10)}/{dados.dia.slice(5, 7)}/{dados.dia.slice(0, 4)}
                                        </Text>
                                        <Text style={styles.dados}>{dados.nome}</Text>
                                        <Text style={styles.dados}>{dados.hora}</Text>
                                        {dados.status === 'Aguardando Confirmação' &&
                                            dadosUser?.colecao === 'profissionais' ?
                                            <View style={{ flexDirection: 'row', gap: 15, flex: 1 }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        mudarStatusAgendamento(dados.profissional, dados.cliente,
                                                            dados.dia, dados.hora, 'Confirmado')
                                                        route.push('/screens/agendador_profissional')
                                                    }}
                                                    style={[styles.estiloBotao, { backgroundColor: '#336BF7' }]}>
                                                    <Text style={[styles.textoBotao, { color: '#fff' }]}>Confirmar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        mudarStatusAgendamento(dados.profissional, dados.cliente,
                                                            dados.dia, dados.hora, 'Cancelado')
                                                        route.push('/screens/agendador_profissional')
                                                    }} style={styles.estiloBotao}>
                                                    <Text style={[styles.textoBotao, { color: '#336BF7' }]}>Cancelar</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'row', gap: 15, flex: 1 }}>
                                                <Text style={styles.dados}>{dados.status}</Text>
                                            </View>
                                        }
                                    </View>
                                )
                            }
                            )
                        }
                    </>
                ) : (
                    <>
                        {agendamento &&
                            agendamento.map((dados, index) => {
                                return (
                                    <View key={index} style={[styles.cardMobile, index === 0 && { marginTop: 0 }]}>
                                        <View style={styles.cardHeaderMobile}>
                                            <Text style={styles.labelMobile}>Data:</Text>
                                            <Text style={styles.dadosMobile}>
                                                {dados.dia.slice(8, 10)}/{dados.dia.slice(5, 7)}/{dados.dia.slice(0, 4)}
                                            </Text>
                                        </View>
                                        <View style={styles.cardRowMobile}>
                                            <Text style={styles.labelMobile}>
                                                {dadosUser?.colecao === 'profissionais' ? 'Paciente:' : 'Psicologo:'}
                                            </Text>
                                            <Text style={styles.dadosMobile}>{dados.nome}</Text>
                                        </View>
                                        <View style={styles.cardRowMobile}>
                                            <Text style={styles.labelMobile}>Horário:</Text>
                                            <Text style={styles.dadosMobile}>{dados.hora}</Text>
                                        </View>
                                        <View style={styles.cardRowMobile}>
                                            <Text style={styles.labelMobile}>Status:</Text>
                                            {dados.status === 'Aguardando Confirmação' &&
                                                dadosUser?.colecao === 'profissionais' ?
                                                <View style={styles.botoesMobile}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            mudarStatusAgendamento(dados.profissional, dados.cliente,
                                                                dados.dia, dados.hora, 'Confirmado')
                                                            route.push('/screens/agendador_profissional')
                                                        }}
                                                        style={[styles.estiloBotaoMobile, { backgroundColor: '#336BF7' }]}>
                                                        <Text style={[styles.textoBotaoMobile, { color: '#fff' }]}>Confirmar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            mudarStatusAgendamento(dados.profissional, dados.cliente,
                                                                dados.dia, dados.hora, 'Cancelado')
                                                            route.push('/screens/agendador_profissional')
                                                        }} style={styles.estiloBotaoMobile}>
                                                        <Text style={[styles.textoBotaoMobile, { color: '#336BF7' }]}>Cancelar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <Text style={styles.dadosMobile}>{dados.status}</Text>
                                            }
                                        </View>
                                    </View>
                                )
                            }
                            )
                        }
                    </>
                )}

            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    titulo: {
        color: '#000',
        fontFamily: 'Arial',
        fontSize: 25,
        fontWeight: 700,
    },
    particoes: {
        flexDirection: 'row',
        padding: 15,
        flex: 1,
        alignItems: 'center',
        gap: 50
    },
    subtitulos: {
        color: '#000',
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 12,
        textAlign: 'center',
        flex: 1,


    },
    dados: {
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,

    },
    estiloBotao: {
        borderWidth: 1,
        borderColor: '#336BF7',
        borderRadius: 5,
        width: 125


    },
    textoBotao: {
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 16,
    },

    // Estilos Mobile
    tituloMobile: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
    },

    containerMobile: {
        padding: 10,
    },

    cardMobile: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
        gap: 10,
    },

    cardHeaderMobile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 10,
        marginBottom: 5,
    },

    cardRowMobile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },

    labelMobile: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        fontFamily: 'Arial',
    },

    dadosMobile: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'Arial',
        flex: 1,
        textAlign: 'right',
    },

    botoesMobile: {
        flexDirection: 'row',
        gap: 10,
        flex: 1,
        justifyContent: 'flex-end',
    },

    estiloBotaoMobile: {
        borderWidth: 1,
        borderColor: '#336BF7',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
        minWidth: 100,
    },

    textoBotaoMobile: {
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 14,
    },
})