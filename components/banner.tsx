import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function Banner() {
    const route = useRouter()
    return (
        <View style={styles.box}>
            <View style={{ flex: 0.65, gap: 40, paddingHorizontal: 25 }}>
                <Text style={styles.titulo}> Cuide da sua saúde mental
                    de maneira prática com{'\n'}Renascer
                </Text>
                <Text style={styles.subtitulo}>
                    Agende sessões, descubra insights sobre psicologia
                    e faça parte de uma rede com profissionais de
                    saúde
                </Text>
            </View>
            <View>
                <Image source={require('../assets/images/Baneer.png')}
                    style={{
                        width: 400,
                        height: 600,
                        borderRadius: 20,
                        marginRight: 175,
                        marginBottom: 75,
                        overflow: 'hidden'
                    }} />
                <View style={styles.miniBox}>
                    <Text style={styles.tituloBox}>Agendamento de Sessões</Text>
                    <Text style={styles.subtituloBox}>
                        Encontre os melhores profissionais
                        com facilidade, veja valores, e datas
                        disponiveis e marque o melhor horário para
                        você.
                    </Text>
                    <TouchableOpacity style={styles.botao}
                    onPress={() => route.push('/screens/listaProfissionais')}>
                        <AntDesign name="arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    box: {
        flexDirection: 'row',
        flex: 1,
        marginTop: '4%',
        justifyContent: 'space-around'
    },

    titulo: {
        color: '#0C2157',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 55,
        fontWeight: 'bold',
        marginTop: 100,
    },

    subtitulo: {
        color: '#828282',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 28,
        fontWeight: 'medium',
        marginHorizontal: 90
    },

    miniBox: {
        width: '75%',
        height: '30%',
        backgroundColor: '#336BF7',
        position: 'absolute',
        marginTop: '50%',
        marginLeft: '35%',
        gap: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },

    tituloBox: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 700,
        paddingTop: 10
    },

    subtituloBox: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 13,
        fontWeight: 400,
        paddingHorizontal: 30
    },

    botao: {
        backgroundColor: '#0C2157',
        borderRadius: 10000,
        width: '15%',
        height: '22%',
        alignItems: 'center',
        justifyContent: 'center',
    }

})
