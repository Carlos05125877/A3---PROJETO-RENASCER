import Entypo from '@expo/vector-icons/Entypo';
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

export default function Relatos() {
    //hook que permite avançar ou retroceder o carrossel pelo botao
    const manualCarrosel = useRef<ICarouselInstance>(null);
    let anteriorProximo: boolean = true;

    const animacaoBotao = () => {
        if (anteriorProximo) { //controle de qual botao foi precisonado
            manualCarrosel.current?.next();
        } else {
            manualCarrosel.current?.prev();
        }
    }

    //Caso surja mais relatos adicionar aqui
    const relato = [{
        texto: "Tenho acompanhado muitos profissionais que chegam às sessões virtuais exaustos pela rotina de trabalho. O atendimento online facilita o acesso imediato ao cuidado, oferecendo acolhimento mesmo em meio a um dia cheio. Essa proximidade digital ajuda a prevenir o burnout e promover equilíbrio emocional.",
        autor: "Dra. Mariana Souza, Psicóloga CRP: 000000/MG"
    }]

    return (
        //parte azul da view
        <View style={styles.fundo}>

            <View style={styles.boxTitulo} >
                <Text style={styles.titulo}>Relatos Profissionais</Text>
                <View style={{ width: 400, height: 1, 
                    backgroundColor: 'white', opacity: 0.5}}>
                    
                </View>
            </View>

            {/* area do carrossel que abrange desde os botoes até o carrossel em si*/ }
    <View style={styles.areaCarrosel}>

        {/*botao esquerdo*/}
        <View style={styles.botao}>
            <TouchableOpacity onPress={() => { anteriorProximo = false; animacaoBotao() }}>
                <Entypo name="chevron-small-left" size={75} color="#336BF7" />
            </TouchableOpacity>
        </View>

        <Carousel
            ref={manualCarrosel}
            width={823} //é necessario ser do tamanho do elemento atual do carrossel. Caso seja menor buga 
            //a exibição. Valor quebrado porque depois diminui 15% do width para ser possivel exibir
            //uma parte do proximo elemento
            height={500}
            data={relato}
            //mapa declarado la em cima com os dados
            loop
            autoPlay //serve para de tempo em tempos se mover sozinho
            autoPlayInterval={15000}
            scrollAnimationDuration={800}

            mode="parallax"
            modeConfig={{
                parallaxScrollingScale: 0.85, //elemento principal
                parallaxScrollingOffset: 150, //parte do elemento secundario visivel
                parallaxAdjacentItemScale: 0.75, // tamanho do elemento secundario
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
        justifyContent: 'center', gap: 30, marginTop: 60

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
        width: 1000,
        height: 500,
        alignItems: 'center',
        justifyContent: 'center',
    },

    caixaCarrossel: {
        display: 'flex',
        backgroundColor: '#0C2157',
        width: 823,
        height: 500,
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
});
