import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

export default function RedeSocialHome() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    
    return (
        <View style={[styles.box, isMobile && styles.boxMobile]}>
            {!isMobile && (
                <Image source={require('../assets/images/redeSocial.png')}
                    style={styles.imagem} />
            )}
            <View style={[styles.caixaTexto, isMobile && styles.caixaTextoMobile]}>
                <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>
                    Transforme conversas em {'\n'} conexões e bem-estar.
                </Text>
                <Text style={[styles.subTitulo, isMobile && styles.subTituloMobile]}>
                    Participe de uma comuidade dedicada à saúde 
                    mental. Converse com profissionais, compartilhe
                    experiências e descubra, em tempo real, o que
                    está sendo discutido sobre bem-estar emocioanl
                </Text>

                <TouchableOpacity style={[styles.botao, isMobile && styles.botaoMobile]}>
                    <Text style={[styles.textoBotao, isMobile && styles.textoBotaoMobile]}>
                        Em Breve
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({

    box: {
        marginVertical: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: '15%',
        rowGap: 150
    },

    imagem: {
        width: 473,
        height: 816,
    },

    caixaTexto: {
        flex: 1.1,
        gap: 50,
        alignItems: 'center',
    },

    titulo: {

        color: '#0C2157',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 35,
        fontWeight: 'bold',
        width: '75%'
    },

    subTitulo: {
        color: '#828282',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: '400',
        width: '55%',
    },

    botao: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#336BF7',
        borderWidth: 2,
        borderRadius: 12

    },
    
    textoBotao: {
        color: '#336BF7',
        fontFamily: 'Arial',
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: '700',
    },

    // Estilos Mobile
    boxMobile: {
        flexDirection: 'column',
        marginVertical: '3%',
        marginHorizontal: '5%',
        rowGap: 30,
        paddingVertical: 20,
    },

    caixaTextoMobile: {
        flex: 0,
        gap: 25,
        width: '100%',
        alignItems: 'center',
    },

    tituloMobile: {
        fontSize: 24,
        width: '100%',
        paddingHorizontal: 10,
    },

    subTituloMobile: {
        fontSize: 16,
        width: '100%',
        paddingHorizontal: 15,
        lineHeight: 22,
    },

    botaoMobile: {
        width: 120,
        height: 45,
    },

    textoBotaoMobile: {
        fontSize: 18,
    },

}
)