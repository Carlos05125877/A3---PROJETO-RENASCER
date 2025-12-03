import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

export default function Explicacao() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    
    return (
        <View
            style={[styles.content, isMobile && styles.contentMobile]}>
            <Text
                style={[styles.explicacao, isMobile && styles.explicacaoMobile]}>
                <Text
                    style={[styles.explicacao, { color: '#2DBE51' }, isMobile && styles.explicacaoMobile]}>
                    Síndrome de Burnout
                </Text>
                {' ou '}
                <Text
                    style={[styles.explicacao, { color: '#2DBE51' }, isMobile && styles.explicacaoMobile]}>
                    Síndrome do Esgotamento Profissional
                </Text>
                {' é um distúrbio emocional com síndromes de exaustão extrema, estresse e esgotamento físico resultante de situações de trabalho desgastantes, que demandam muita competitividade ou \.'}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    
    content: {
        flex: 2,
        marginRight: 250,
        marginLeft: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },

    explicacao: {
        flex: 1,
        color: '#000000',
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 400,
        textAlign: 'center',
    },

    // Estilos Mobile
    contentMobile: {
        flex: 1,
        marginRight: 15,
        marginLeft: 15,
        paddingVertical: 20,
    },

    explicacaoMobile: {
        fontSize: 16,
        lineHeight: 24,
    },
})

