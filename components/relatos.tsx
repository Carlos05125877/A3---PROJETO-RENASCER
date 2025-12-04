import Entypo from '@expo/vector-icons/Entypo';
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

export default function Relatos() {
    //hook que permite avançar ou retroceder o carrossel pelo botao
    const manualCarrosel = useRef<ICarouselInstance> (null);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    let anteriorProximo: boolean = true;

    const animacaoBotao = () => {
        if (anteriorProximo) { //controle de qual botao foi precisonado
            manualCarrosel.current?.next();
        } else {
            manualCarrosel.current?.prev();
        }
    }

    //Caso surja mais relatos adicionar aqui
    const relato = [ {
        texto: "Tenho acompanhado muitos profissionais que chegam às sessões virtuais exaustos pela rotina de trabalho. O atendimento online facilita o acesso imediato ao cuidado, oferecendo acolhimento mesmo em meio a um dia cheio. Essa proximidade digital ajuda a prevenir o burnout e promover equilíbrio emocional.",
        autor: "Dra. Mariana Souza, Psicóloga CRP: 000000/MG"
    } ]

    const carouselWidth = isMobile ? width * 0.9 : 823;
    const carouselHeight = isMobile ? 300 : 500;

    return (
        //parte azul da view
        <View style={[styles.fundo, isMobile && styles.fundoMobile]}>
            <View style={[styles.boxTitulo, isMobile && styles.boxTituloMobile]} >
                <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>
                    Relatos Profissionais
                </Text>
                <View
                    style={[
                        styles.linhaTitulo,
                        isMobile && styles.linhaTituloMobile
                    ]}>
                </View>
            </View>

            {/* area do carrossel que abrange desde os botoes até o carrossel em si*/}
            <View style={[styles.areaCarrosel, isMobile && styles.areaCarroselMobile]}>
                {/*botao esquerdo*/}
                {!isMobile && (
                    <View style={styles.botao}>
                        <TouchableOpacity
                            onPress={() => { anteriorProximo = false; animacaoBotao() }}>
                            <Entypo name="chevron-small-left" size={75} color="#336BF7" />
                        </TouchableOpacity>
                    </View>
                )}

                <Carousel
                    ref={manualCarrosel}
                    width={carouselWidth}
                    height={carouselHeight}
                    data={relato}
                    loop
                    autoPlay
                    autoPlayInterval={15000}
                    scrollAnimationDuration={800}
                    mode={isMobile ? "horizontal-stack" : "parallax"}
                    modeConfig={isMobile ? {
                        snapDirection: 'left',
                    } : {
                        parallaxScrollingScale: 0.85,
                        parallaxScrollingOffset: 150,
                        parallaxAdjacentItemScale: 0.75,
                    }}
                    renderItem={({ item }) => (
                        <View style={[styles.caixaCarrossel, isMobile && styles.caixaCarrosselMobile]}>
                            <Text style={[styles.textoRelato, isMobile && styles.textoRelatoMobile]}>
                                {item.texto}
                            </Text>
                            <Text style={[styles.textoRelato, isMobile && styles.textoRelatoMobile]}>
                                {item.autor}
                            </Text>
                        </View>
                    )}
                />

                {/* Botão Direito */}
                {!isMobile && (
                    <View style={styles.botao}>
                        <TouchableOpacity
                            onPress={() => { anteriorProximo = true; animacaoBotao() }}>
                            <Entypo name="chevron-small-right" size={75} color="#336BF7" />
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </View >
    )
}

//CSS

const styles = StyleSheet.create({

    fundo: {
        flex: 1,
        backgroundColor: '#336BF7',
        alignItems: 'center',
        justifyContent: 'center',
    },

    boxTitulo: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 30, marginTop: 100

    },

    titulo: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 36,
        fontWeight: 'bold',
    },

    linhaTitulo: {
        width: 400,
        height: 1,
        backgroundColor: 'white',
        opacity: 0.5
    },

    areaCarrosel: {
        flexDirection: 'row',
        marginTop: 20,
        width: 1000,
        height: 500,
        alignItems: 'center',
        justifyContent: 'center',
    },

    caixaCarrossel: {
        flex: 1,
        backgroundColor: '#0C2157',
        width: 823,
        height: '5%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textoRelato: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: 30,
    },
    
    botao: {
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C2157',
        width: 50,
        height: 100,
        borderRadius: 15,
        opacity: 0.5,
    },

    // Estilos Mobile
    fundoMobile: {
        paddingVertical: 30,
    },

    boxTituloMobile: {
        marginTop: 30,
        gap: 15,
    },

    tituloMobile: {
        fontSize: 24,
    },

    linhaTituloMobile: {
        width: '80%',
        maxWidth: 300,
    },

    areaCarroselMobile: {
        width: '100%',
        height: 300,
        marginTop: 20,
        paddingHorizontal: 10,
    },

    caixaCarrosselMobile: {
        width: '100%',
        height: 'auto',
        minHeight: 250,
        borderRadius: 20,
        paddingVertical: 20,
    },

    textoRelatoMobile: {
        fontSize: 14,
        padding: 15,
        lineHeight: 20,
    },
});
