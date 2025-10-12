import { StyleSheet, Text, View } from "react-native";

export default function Explicacao() {
    return (
        <View style={styles.content}>
                <Text style={styles.explicacao}>
                    <Text style={[styles.explicacao, {color: '#2DBE51'}]}>Síndrome de Burnout </Text> 
                    ou <Text style={[styles.explicacao, {color: '#2DBE51'}]}>Síndrome do Esgotamento Profissional </Text>
                    é um distúrbio emocional com síndromes de exaustão extrema,
                    estresse e esgotamento físico resultante de situações de trabalho
                    desgastantes, que demandam muita competitividade ou responsabilidade.
                </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        marginTop: 30,
        marginBottom: 30,
        marginRight: 250,
        marginLeft: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },

    explicacao: {
        color: '#000000',
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 400,
        textAlign: 'center',
    }
})

