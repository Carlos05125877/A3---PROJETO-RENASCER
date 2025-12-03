import ConfirmarConsulta from "@/components/confirmarConsulta";
import Topo from "@/components/topo";
import { View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";

export default function agendadorUsuario() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    
    return (
        <View style={styles.container}>
            <View style={styles.topoContainer}>
                <Topo />
            </View>
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={[styles.containerConsulta, isMobile && styles.containerConsultaMobile]}
                showsVerticalScrollIndicator={false}
            >
                <ConfirmarConsulta 
                    style={[
                        styles.consulta, 
                        isMobile && styles.consultaMobile
                    ]} 
                    tipo='users' 
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topoContainer: {
        zIndex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    containerConsulta: {
        alignItems: 'center',
        paddingVertical: 100,
        paddingHorizontal: 20,
    },
    consulta: {
        width: 1250,
        maxWidth: '100%',
    },
    containerConsultaMobile: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    consultaMobile: {
        width: '100%',
    },
})