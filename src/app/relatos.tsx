import Entypo from '@expo/vector-icons/Entypo';
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

export default function Relatos() {
    const manualCarrosel = useRef<ICarouselInstance>(null);
    let anteriorProximo: boolean = true;

    const animacaoBotao = () => {
        if (anteriorProximo) {
            manualCarrosel.current?.next();
        } else {
            manualCarrosel.current?.prev();
        }
    }

    const relato = [{
        texto: "Tenho acompanhado muitos profissionais que chegam às sessões virtuais exaustos pela rotina de trabalho. O atendimento online facilita o acesso imediato ao cuidado, oferecendo acolhimento mesmo em meio a um dia cheio. Essa proximidade digital ajuda a prevenir o burnout e promover equilíbrio emocional.",
        autor: "Dra. Mariana Souza, Psicóloga CRP: 000000/MG"
    }]

    return (
        <View style={styles.fundo}>
            <View style={styles.centro}>
                <Text style={styles.titulo}>Relatos Profissionais</Text>

                <View style={styles.areaCarrosel}>
                    {/* Botão Esquerdo */}
                    <View style={styles.botao}>
                        <TouchableOpacity onPress={() => { anteriorProximo = false; animacaoBotao() }}>
                            <Entypo name="chevron-small-left" size={75} color="#336BF7" />
                        </TouchableOpacity>
                    </View>

                    {/* Carrossel */}
                    <Carousel
                    style={{alignContent: 'center', justifyContent:'center'}}
                        ref={manualCarrosel}
                        width={823} // Aumentado
                        height={500} // Aumentado
                        data={relato}
                        loop
                        autoPlay
                        autoPlayInterval={15000}
                        scrollAnimationDuration={800}
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 0.85,
                            parallaxScrollingOffset: 150, 
                            parallaxAdjacentItemScale: 0.75,
                        }}
                        renderItem={({ item }) => (
                            <View style={styles.caixaCarrossel}>
                                <Text style={styles.textoRelato}>{item.texto}</Text>
                                <Text style={styles.textoRelato}>{item.autor}</Text>
                            </View>
                        )}
                    />

                    {/* Botão Direito */}
                    <View style={styles.botao}>
                        <TouchableOpacity onPress={() => { anteriorProximo = true; animacaoBotao() }}>
                            <Entypo name="chevron-small-right" size={75} color="#336BF7" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
        backgroundColor: '#336BF7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centro: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        textAlign: 'center',
    },
    titulo: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 36,
        fontWeight: 'bold',
    },
    areaCarrosel: {
        flexDirection: 'row',
        marginTop: 20,
        width: 1200, // Aumentado para comportar o carrossel maior + botões
        height: 500,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    conteudoCarrossel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        overflow: 'hidden',
    },
    caixaCarrossel: {
        display: 'flex',
        backgroundColor: '#0C2157',
        width: 823, // Aumentado
        height: 500, // Aumentado
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    textoRelato: {
        marginTop: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: 30,
    },
    botao: {
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C2157',
        width: 50,
        height: 100,
        borderRadius: 15,
        opacity: 0.5,
    },
});
