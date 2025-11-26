
import { auth, buscarAgendamento } from '@/back-end/Api';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';



interface props extends ViewProps {
    tipo: string
}
export default function ConfirmarConsulta({ tipo, ...resto }: props) {
    const [agendamento, setAgendamento] = useState <Record<string,string>[]>([])
    useEffect(() => {
        const dados = async () => {
            if (!auth.currentUser) return;

            const agendamentos = await buscarAgendamento('profissionais', auth.currentUser.uid)
            agendamentos?.map((dia) => {
                 Object.entries(dia.data()).forEach((data) => {
                    Object.entries(data).forEach(([horarios, dados]) =>{

                         setAgendamento((prev ) => [...prev, dados])
                    })
                })
            }) 
        }
    dados();
}, [])
return (
    <View {...resto}>
        <Text style={styles.titulo}>Agenda</Text>
        <View style={styles.particoes}>
            <View>
                <Text style={styles.subtitulos}>Data</Text>
                {   agendamento&& 
                    agendamento.map((data) => {
                        return(
                           <Text>{data.dia}</Text> 
                        )
                    })
                }


            </View>
            <View>
                <Text style={styles.subtitulos}>Paciente</Text>

            </View>
            <View>
                <Text style={styles.subtitulos}>Horário</Text>

            </View>
            <View>
                <Text style={styles.subtitulos}>Status</Text>

            </View>
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
        gap: 150,
    },
    subtitulos: {
        color: '#000',
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 700,
    }
})