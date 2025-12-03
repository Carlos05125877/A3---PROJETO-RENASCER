import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";


export default function Banner() {
    const route = useRouter()
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    
    return (
        <View style={[styles.box, isMobile && styles.boxMobile]}>
            <View style={[styles.conteudoTexto, isMobile && styles.conteudoTextoMobile]}>
                <Text style={[styles.titulo, isMobile && styles.tituloMobile]}> 
                    Cuide da sua saúde mental
                    de maneira prática com{'\n'}Renascer
                </Text>
                <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>
                    Agende sessões, descubra insights sobre psicologia
                    e faça parte de uma rede com profissionais de
                    saúde
                </Text>
            </View>
            <View style={[styles.containerImagem, isMobile && styles.containerImagemMobile]}>
                {!isMobile && (
                    <Image source={require('../assets/images/Baneer.png')}
                        style={styles.imagem} />
                )}
                <View style={[styles.miniBox, isMobile && styles.miniBoxMobile]}>
                    <Text style={[styles.tituloBox, isMobile && styles.tituloBoxMobile]}>
                        Agendamento de Sessões
                    </Text>
                    <Text style={[styles.subtituloBox, isMobile && styles.subtituloBoxMobile]}>
                        Encontre os melhores profissionais
                        com facilidade, veja valores, e datas
                        disponiveis e marque o melhor horário para
                        você.
                    </Text>
                    <TouchableOpacity style={[styles.botao, isMobile && styles.botaoMobile]}
                    onPress={() => route.push('/screens/lista_profissionais')}>
                        <AntDesign name="arrow-right" size={isMobile ? 20 : 24} color="white" />
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

    conteudoTexto: {
        flex: 0.65,
        gap: 40,
        paddingHorizontal: 25
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

    containerImagem: {
        // Container para imagem e miniBox
    },

    imagem: {
        width: 400,
        height: 600,
        borderRadius: 20,
        marginRight: 175,
        marginBottom: 75,
        overflow: 'hidden'
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
    },

    // Estilos Mobile
    boxMobile: {
        flexDirection: 'column',
        marginTop: '2%',
        paddingHorizontal: 15,
        alignItems: 'center',
        gap: 0,
    },

    conteudoTextoMobile: {
        flex: 0,
        gap: 15,
        paddingHorizontal: 0,
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
    },

    tituloMobile: {
        fontSize: 28,
        marginTop: 20,
        paddingHorizontal: 10,
        lineHeight: 34,
    },

    subtituloMobile: {
        fontSize: 16,
        marginHorizontal: 0,
        paddingHorizontal: 10,
        marginBottom: 0,
        lineHeight: 22,
    },

    containerImagemMobile: {
        width: '100%',
        alignItems: 'center',
        marginTop: 0,
        position: 'relative',
    },

    miniBoxMobile: {
        width: '90%',
        height: 'auto',
        minHeight: 150,
        position: 'relative',
        marginTop: 0,
        marginLeft: 0,
        paddingVertical: 15,
        paddingHorizontal: 15,
        gap: 15,
    },

    tituloBoxMobile: {
        fontSize: 18,
        paddingTop: 0,
    },

    subtituloBoxMobile: {
        fontSize: 12,
        paddingHorizontal: 15,
    },

    botaoMobile: {
        width: 50,
        height: 50,
    },

})
