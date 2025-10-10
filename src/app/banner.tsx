import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function Banner() {
    return (
        <ImageBackground source={require('../../assets/images/Banner.png')}
            style={styles.banner}>
            <View style={{alignItems: 'flex-end'}}>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.tituloBanner}>Síndrome de Burnout</Text>
                <View style={{alignItems: 'center'}}>
                <Text style={styles.subtituloBanner}>Rapidez, facilidade e segurança.</Text>
                <Text style={styles.subtituloBanner}>Agende sua terapia online com um psicólogo</Text>
                <TouchableOpacity onPress={() => { }} style={[styles.botaoEncontrarProfissional, {
                          }]}>
                            <Text style={styles.textoEncontrarProfissional}>Encontrar Profissional</Text>
                          </TouchableOpacity>
                </View>
                </View>
            </View>
        </ImageBackground>
    )

}

const styles = StyleSheet.create({
    banner: {
        width: '100%',
        height: 500,
        alignItems: 'flex-end',
    },
    tituloBanner: {
        marginTop: 50,
        marginRight: 30,
        marginBottom: 20,
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 900,
    },
    subtituloBanner: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 400,
    },
     botaoEncontrarProfissional: {
        marginTop: 25,
    backgroundColor: '#336BF7',
    width: 200,
    height: 40,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textoEncontrarProfissional: {
    color: '#FFFFFF',
    fontFamily: "Inria Sans",
    fontSize: 16,
    fontWeight: 400,
  },

})
