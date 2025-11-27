import Topo from "@/components/topo";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function BlogDicas() {
    return (
      <View style={{flex: 1}}>
        <View style={{  zIndex: 1 }}>
          <Topo />
        </View>
        <ScrollView >
          <View style={styles.containerPrincipal}>
            <View>
                <Text style={styles.titulo}>Ações Imediatas</Text>
              </View>
                <View style={styles.linha}/>
            <View style={styles.conteudoPrincipal}>
                <Text style={styles.subtitulo}>Dicas de autocuidado no momento de crise</Text>
                <Text style={styles.descricao}>
                    Em situações de ansiedade intensa, esgotamento ou sensação de vazio, nosso corpo e mente pedem respostas imediatas. Este guia reúne técnicas breves, práticas e cientificamente validadas para ajudar você a recuperar o equilíbrio emocional em momentos de crise.
                </Text>
                

                <View style={styles.linhaCabecalho}>
                    <View style={[styles.cartaoCabecalho]}>
                        <Text style={styles.labelCabecalho}>Momento</Text>
                    </View>
                    <View style={[styles.cartaoCabecalho, ]}>
                        <Text style={styles.labelCabecalho}>O que fazer?</Text>
                    </View>
                    <View style={[styles.cartaoCabecalho]}>
                        <Text style={styles.labelCabecalho}>Como ajuda</Text>
                    </View>
                </View>

                <View style={styles.linhaCrise}>
                    <View style={styles.celulaCrise}>
                        <Text style={[styles.textoCelula, {textAlign: 'center', alignContent: 'center', flex: 1}]}>Pico de ansiedade / Ataque de Pânico</Text>
                    </View>
                    <View style={styles.celulaCrise}>
                        <Text style={styles.textoCelula}>
                            Identifique e nomeie no ambiente:{'\n'}
                            5 coisas que você vê{'\n'}
                            4 coisas que você toca{'\n'}
                            3 coisas que você ouve{'\n'}
                            2 coisas que você cheira{'\n'}
                            1 coisa que você prova
                        </Text>
                    </View>
                    <View style={styles.celulaCrise}>
                        <Text style={styles.textoCelula}>Desvia o foco do pensamento acelerado e traz a percepção para o presente.</Text>
                    </View>
                </View>

                <View style={styles.linhaCrise}>
                    <View style={styles.celulaCrise}>
                        <Text style={[styles.textoCelula, {textAlign: 'center', alignContent: 'center', flex: 1}]}>Sensação de Sobrecarga / Esgotamento (Burnout)</Text>
                    </View>
                    <View style={styles.celulaCrise}>
                        <Text style={styles.textoCelula}>
                            Pausa de 5 Minutos (Regra 20/20/20 adaptada):{'\n'}
                            Levante-se da cadeira. Beba um copo de água devagar. Olhe para um ponto distante por 20 segundos. Faça 3 respirações lentas e profundas.
                        </Text>
                    </View>
                    <View style={styles.celulaCrise}>
                        <Text style={styles.textoCelula}>Reduz tensão muscular, cansaço visual e interrompe o ciclo de sobrecarga emocional.</Text>
                    </View>
                </View>

                <View style={styles.linhaCrise}>
                    <View style={styles.celulaCrise}>
                        <Text style={[styles.textoCelula, {textAlign: 'center', alignContent: 'center', flex: 1}]}>Desmotivação / Sentimento de Vazio (Depressão)</Text>
                    </View>
                    <View style={styles.celulaCrise}>
                        <Text style={styles.textoCelula}>
                            Micro-Ativação Comportamental:{'\n'}
                            Escolha uma tarefa muito pequena e específica (ex: lavar uma xícara, enviar um único e-mail). Complete a tarefa e reconheça a conquista.
                        </Text>
                    </View>
                    <View style={styles.celulaCrise}>
                        <Text style={styles.textoCelula}>Gera sensação de conquista e quebra a inércia da falta de motivação.</Text>
                    </View>
                </View>

                <Text style={styles.aviso}>
                    Essas ações não substituem acompanhamento profissional, mas servem como ferramentas rápidas de autorregulação.
                </Text>

                <Text style={styles.tituloSecao}>Últimos artigos</Text>
              <View style={{ flexDirection: "column", gap: 12, alignItems: "flex-start" , width: '64%'}}>
                <View style={styles.cartaoArtigo}>
                    <Image source={require("../../../assets/images/depression.png")} style={styles.imagemArtigo} />
                    <Text style={styles.tituloArtigo}>
                        Depressão: entendendo suas causas, sintomas e caminhos de tratamento
                    </Text>
                </View>

                <View style={styles.cartaoArtigo}>
                    <Image source={require("../../../assets/images/stress.png")} style={styles.imagemArtigo} />
                    <Text style={styles.tituloArtigo}>
                        Estresse: Entenda as causas e como prevenir - Interaja e descubra seu nível de bem-estar
                    </Text>
                </View>

                <View style={styles.cartaoArtigo}>
                    <Image source={require("../../../assets/images/anxiety.png")} style={styles.imagemArtigo} />
                    <Text style={styles.tituloArtigo}>
                        Ansiedade: entendendo suas origens, sintomas e como encontrar o equilíbrio
                    </Text>
                </View>
                </View>

                <View style={{ height: 40 }} />
              </View>
            </View>
        </ScrollView>
      </View>
      
    );
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        width: '100%',

    },
    conteudoPrincipal: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        alignItems: "center",
    },
    titulo: {
        textAlign: "center",
        fontSize: 32,
        fontWeight: "700",
        color: "#0b2157",
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 24,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 12,
        alignItems: 'flex-start',
        width: '64%',
    },
    descricao: {
        fontSize: 16,
        fontWeight: "400",
        color: "#555555",
        lineHeight: 20,
        marginBottom: 24,
        alignItems: 'flex-start',
        width: '64%',
    },
    linha: {
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        marginBottom: 20,
    },
    linhaCabecalho: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    cartaoCabecalho: {
        backgroundColor: "#336af7",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 8,
        justifyContent: "center",
        alignItems: "center",
        width: 320,
        height: 50,
    },
    labelCabecalho: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
        textAlign: "center",
    },
    linhaCrise: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    celulaCrise: {
        backgroundColor: "#e8e8e8",
        borderRadius: 8,
        padding: 12,
        justifyContent: "flex-start",
        width: 320,
        height: 'auto',
    },
    textoCelula: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000000",
        lineHeight: 18,
    },
    aviso: {
        fontSize: 16,
        fontWeight: "400",
        color: "#666666",
        marginTop: 20,
        marginBottom: 30,
        lineHeight: 18,
        alignItems: 'flex-start',
        width: '64%',
    },
    tituloSecao: {
        fontSize: 20,
        fontWeight: "600",
        color: "#0b2157",
        marginBottom: 16,
        marginTop: 10,
        alignItems: 'flex-start',
        width: '64%',
    },
    cartaoArtigo: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'flex-start',
        width: 400,
    },
    imagemArtigo: {
        width: 150,
        height: 100,
        borderRadius: 12,
        resizeMode: "cover",
    },
    tituloArtigo: {
        fontSize: 13,
        fontWeight: "600",
        color: "#000000",
        flex: 1,
        padding: 12,
        lineHeight: 18,
        alignItems: 'flex-start',
        width: 200,
    },
});
