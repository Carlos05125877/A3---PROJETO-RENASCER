import { auth, buscarSubColecao, criarAgendamento } from '@/back-end/Api'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { ScrollView } from 'react-native-gesture-handler'

interface props {
    id: string
    nome: string,
    profissao: string,
    crp: string,
    imagem: string
    horarios: string[]
    preco: string

}

export default function Agendador(props: props) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const horarios = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
    const route = useRouter();
    const [botaoSelecionado, setBoataoSelecionado] = useState<number | null>(null)
    const [exibirModal, setExibirModal] = useState(false);
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('')
    const [horarioSelecionado, setHorarioSelecionado] = useState<any>({})
    const [bloquearBotaoAgendar, setBloquearBotaoAgendar] = useState(true);

    useEffect(() => {
        const verificarAgendamentos = async () => {
            if (data !== '') {
                const dadosUsuario = await buscarSubColecao(props.id, 'agendamentos', data);
                if (dadosUsuario) {
                    setHorarioSelecionado(dadosUsuario.data());
                }
            }
        }

        verificarAgendamentos();
    }, [data])

    const agendamentos = {
        cliente: auth.currentUser?.uid,
        dia: '',
        hora: '',
        profissional: ''
    }
    useEffect(() => {
        if (data === '' || horario === '')
            setBloquearBotaoAgendar(true)
        else {
            setBloquearBotaoAgendar(false)
        }
    }, [data, horario])

    useEffect(() => {
        if (agendamentos.cliente === undefined) {
            alert('faça login antes de continuar');
            route.push('/screens/login')
        }
    },[])


    return (
        <View style={[styles.box, isMobile && styles.boxMobile]}>
            <ScrollView style={{ flex: 1, margin: 5 }}>
                <View style={[styles.superior, isMobile && styles.superiorMobile]}>
                    <Image source={{ uri: props.imagem }} style={[styles.imagem, isMobile && styles.imagemMobile]} />
                    <View style={styles.interiorSuperior}>
                        <Text style={[styles.nome, isMobile && styles.nomeMobile]}>{props.nome}</Text>
                        <Text style={[styles.profissao, isMobile && styles.profissaoMobile]}>{props.profissao}</Text>
                        <Text style={[styles.crp, isMobile && styles.crpMobile]}>CRP:{props.crp}</Text>
                    </View>
                </View>
                <Text style={[styles.subtitulos, isMobile && styles.subtitulosMobile]}>Data</Text>
                <View >
                    <TouchableOpacity
                        onPress={() => { setExibirModal(!exibirModal) }}>
                        <View style={[styles.selecionadorDeData, isMobile && styles.selecionadorDeDataMobile]}>
                            <Text style={[{
                                fontFamily: 'Arial',
                                fontSize: isMobile ? 14 : 17,
                                fontWeight: 'bold',
                                textAlign: 'center',

                            }]}>{data ?
                                `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`
                                : 'Selecione uma Data'}</Text>
                            <Image source={require('../assets/images/calendario.png')}
                                style={{ width: isMobile ? 30 : 40, height: isMobile ? 30 : 40 }} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.subtitulos, isMobile && styles.subtitulosMobile]}>Horários</Text>
                <View style={styles.horarios}>
                    {

                        props.horarios.map((horario, index) => {
                            const ocupado = horarioSelecionado?.[horario] || false;
                            return (
                                <TouchableOpacity key={index} style={[styles.selecionarHorario,
                                isMobile && styles.selecionarHorarioMobile,
                                ocupado && { backgroundColor: 'red', opacity: 1 },
                                botaoSelecionado === index && styles.horarioSelecionado]}
                                    onPress={() => {
                                        console.log(props.horarios)
                                        botaoSelecionado !== index ?
                                            setBoataoSelecionado(index) : setBoataoSelecionado(-1);
                                        botaoSelecionado !== index ?
                                            setHorario(horario) : setHorario('');
                                    }}
                                    disabled={ocupado}
                                >
                                    <Text style={[styles.textoHorario,
                                    isMobile && styles.textoHorarioMobile,
                                    botaoSelecionado === index && styles.horarioSelecionado
                                    ]}>{horario}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={styles.confirmarAgendamento}>
                    <TouchableOpacity style={[styles.botaoAgendar, isMobile && styles.botaoAgendarMobile]}
                        onPress={() => {
                            if (bloquearBotaoAgendar) {

                                return alert("Selecione uma data e horário válido")
                            }
                            agendamentos.dia = data
                            agendamentos.hora = horario
                            agendamentos.profissional = props.id
                            criarAgendamento(props.id, 'profissionais', agendamentos, 'agendamentos')
                            agendamentos.cliente &&
                                criarAgendamento(agendamentos.cliente, 'users', agendamentos, 'agendamentos')
                            alert('Agendamento realizado com sucesso')

                        }}
                    >
                        <Text style={[styles.textoConfirmarHorario, isMobile && styles.textoConfirmarHorarioMobile]}>Agendar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {exibirModal &&
                <View style={[{
                    position: 'absolute',
                    top: '0%',
                    left: isMobile ? '0%' : '100%',
                    width: isMobile ? '100%' : '60%',
                    zIndex: 1000,
                }, isMobile && styles.modalMobile]}>
                    <Calendar style={{
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: '#000',
                        padding: 5,

                    }}
                        onDayPress={(day) => {
                            setData(day.dateString);
                            setExibirModal(false);
                        }}
                        minDate={new Date().toISOString().split('T')[0]}
                        markedDates={{
                            [data]: { selected: true, selectedColor: '#336BF7' },
                        }}
                    />
                </View>}

        </View>
    )
}

const styles = StyleSheet.create(
    {
        box: {
            flex: 0.7,
            backgroundColor: '#e8e8e8ff',
            borderRadius: 20,
            paddingHorizontal: 30,
            paddingVertical: 20,
            gap: 7,
        },
        superior: {
            flexDirection: 'row',
            gap: 30,

        },
        interiorSuperior: {
            gap: 5

        },
        imagem: {
            width: 150,
            height: 150,
            borderRadius: 7

        },

        nome: {
            fontSize: 45,
            fontWeight: 'bold',
            fontFamily: 'Arial'

        },
        profissao: {
            fontFamily: 'Arial',
            fontSize: 25,
            fontWeight: '500'
        },
        crp: {
            fontFamily: 'Arial',
            fontSize: 15,


        },
        subtitulos: {
            textAlign: 'center',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: 25,
            marginVertical: 7

        },
        selecionadorDeData: {
            marginHorizontal: 15,
            width: '94%',
            height: 45,
            borderWidth: 2,
            borderColor: '#336BF7',
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10
        },
        iconeData: {

        },
        horarios: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center'
        },
        selecionarHorario: {
            width: '17%',
            height: 30,
            borderRadius: 7,
            borderColor: '#336BF7',
            borderWidth: 2,
            margin: 5,
            justifyContent: 'center',
            alignItems: 'center'
        },
        horarioSelecionado: {
            backgroundColor: '#336BF7',
            color: '#fff'
        },
        textoHorario: {
            fontFamily: 'Arial',
            fontWeight: '600'
        },

        confirmarAgendamento: {
            marginTop: 25,
            justifyContent: 'center',
            alignItems: 'center',
            height: '12%'
        },
        botaoAgendar: {
            backgroundColor: '#336BF7',
            justifyContent: 'center',
            alignItems: 'center',
            width: '35%',
            height: '100%',
            borderRadius: 7


        },
        textoConfirmarHorario: {
            textAlign: 'center',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: '700'
        },

        // Estilos Mobile
        boxMobile: {
            flex: 1,
            paddingHorizontal: 15,
            paddingVertical: 15,
        },

        superiorMobile: {
            flexDirection: 'column',
            gap: 15,
            alignItems: 'center',
        },

        imagemMobile: {
            width: 100,
            height: 100,
        },

        nomeMobile: {
            fontSize: 28,
            textAlign: 'center',
        },

        profissaoMobile: {
            fontSize: 18,
            textAlign: 'center',
        },

        crpMobile: {
            fontSize: 13,
            textAlign: 'center',
        },

        subtitulosMobile: {
            fontSize: 20,
            marginVertical: 5,
        },

        selecionadorDeDataMobile: {
            marginHorizontal: 0,
            width: '100%',
            height: 40,
            padding: 8,
        },

        selecionarHorarioMobile: {
            width: '30%',
            height: 35,
            margin: 3,
        },

        textoHorarioMobile: {
            fontSize: 12,
        },

        botaoAgendarMobile: {
            width: '60%',
            height: 45,
        },

        textoConfirmarHorarioMobile: {
            fontSize: 14,
        },

        modalMobile: {
            backgroundColor: '#fff',
            borderRadius: 15,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },

    }
)