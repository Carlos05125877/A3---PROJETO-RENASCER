import BloqueioAssinatura from "@/components/bloqueioAssinatura";
import Topo from "@/components/topo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

const router = useRouter();


export default function BlogDicas() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    
    return (
        <View style={{flex: 1}}>
        <View style={{  zIndex: 1 }}>
          <Topo />
        </View>
        <BloqueioAssinatura>
          <ScrollView >
            <View style={styles.containerPrincipal}>
            <View>
                <Text style={[styles.titulo, isMobile && styles.tituloMobile]}>Ações Imediatas</Text>
              </View>
                <View style={styles.linha}/>
            <View style={[styles.conteudoPrincipal, isMobile && styles.conteudoPrincipalMobile]}>
                <Text style={[styles.subtitulo, isMobile && styles.subtituloMobile]}>Dicas de autocuidado no momento de crise</Text>
                <Text style={[styles.descricao, isMobile && styles.descricaoMobile]}>
                    Em situações de ansiedade intensa, esgotamento ou sensação de vazio, nosso corpo e mente pedem respostas imediatas. Este guia reúne técnicas breves, práticas e cientificamente validadas para ajudar você a recuperar o equilíbrio emocional em momentos de crise.
                </Text>
                

                {!isMobile ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <View style={styles.cartaoCriseMobile}>
                            <Text style={styles.labelCriseMobile}>Pico de ansiedade / Ataque de Pânico</Text>
                            <Text style={styles.labelAcaoMobile}>O que fazer?</Text>
                            <Text style={styles.textoCelulaMobile}>
                                Identifique e nomeie no ambiente:{'\n'}
                                5 coisas que você vê{'\n'}
                                4 coisas que você toca{'\n'}
                                3 coisas que você ouve{'\n'}
                                2 coisas que você cheira{'\n'}
                                1 coisa que você prova
                            </Text>
                            <Text style={styles.labelAjudaMobile}>Como ajuda</Text>
                            <Text style={styles.textoCelulaMobile}>Desvia o foco do pensamento acelerado e traz a percepção para o presente.</Text>
                        </View>

                        <View style={styles.cartaoCriseMobile}>
                            <Text style={styles.labelCriseMobile}>Sensação de Sobrecarga / Esgotamento (Burnout)</Text>
                            <Text style={styles.labelAcaoMobile}>O que fazer?</Text>
                            <Text style={styles.textoCelulaMobile}>
                                Pausa de 5 Minutos (Regra 20/20/20 adaptada):{'\n'}
                                Levante-se da cadeira. Beba um copo de água devagar. Olhe para um ponto distante por 20 segundos. Faça 3 respirações lentas e profundas.
                            </Text>
                            <Text style={styles.labelAjudaMobile}>Como ajuda</Text>
                            <Text style={styles.textoCelulaMobile}>Reduz tensão muscular, cansaço visual e interrompe o ciclo de sobrecarga emocional.</Text>
                        </View>

                        <View style={styles.cartaoCriseMobile}>
                            <Text style={styles.labelCriseMobile}>Desmotivação / Sentimento de Vazio (Depressão)</Text>
                            <Text style={styles.labelAcaoMobile}>O que fazer?</Text>
                            <Text style={styles.textoCelulaMobile}>
                                Micro-Ativação Comportamental:{'\n'}
                                Escolha uma tarefa muito pequena e específica (ex: lavar uma xícara, enviar um único e-mail). Complete a tarefa e reconheça a conquista.
                            </Text>
                            <Text style={styles.labelAjudaMobile}>Como ajuda</Text>
                            <Text style={styles.textoCelulaMobile}>Gera sensação de conquista e quebra a inércia da falta de motivação.</Text>
                        </View>
                    </>
                )}

                <Text style={[styles.aviso, isMobile && styles.avisoMobile]}>
                    Essas ações não substituem acompanhamento profissional, mas servem como ferramentas rápidas de autorregulação.
                </Text>

                <Text style={[styles.tituloSecao, isMobile && styles.tituloSecaoMobile]}>Últimos artigos</Text>
                <View style={[styles.containerArtigos, isMobile && styles.containerArtigosMobile]}>
                    <View style={[styles.cartaoArtigo, isMobile && styles.cartaoArtigoMobile]}>
                        <Image source={require("../../../assets/images/depression.png")} style={[styles.imagemArtigo, isMobile && styles.imagemArtigoMobile]} />
                        <TouchableOpacity onPress={() => (router.push('/screens/blog_depressao' as any))}>
                        <Text style={[styles.tituloArtigo, isMobile && styles.tituloArtigoMobile]}>
                            Depressão: entendendo suas causas, sintomas e caminhos de tratamento
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.cartaoArtigo, isMobile && styles.cartaoArtigoMobile]}>
                        <Image source={require("../../../assets/images/stress.png")} style={[styles.imagemArtigo, isMobile && styles.imagemArtigoMobile]} />
                        <TouchableOpacity onPress={() => (router.push('/screens/blog_estresse' as any))}>
                        <Text style={[styles.tituloArtigo, isMobile && styles.tituloArtigoMobile]}>
                            Estresse: Entenda as causas e como prevenir - Interaja e descubra seu nível de bem-estar
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.cartaoArtigo, isMobile && styles.cartaoArtigoMobile]}>
                        <Image source={require("../../../assets/images/anxiety.png")} style={[styles.imagemArtigo, isMobile && styles.imagemArtigoMobile]} />
                        <TouchableOpacity onPress={() => (router.push('/screens/blog_ansiedade' as any))}>
                        <Text style={[styles.tituloArtigo, isMobile && styles.tituloArtigoMobile]}>
                            Ansiedade: entendendo suas origens, sintomas e como encontrar o equilíbrio
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 40 }} />
              </View>
            </View>
          </ScrollView>
        </BloqueioAssinatura>
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

    // Estilos Mobile
    tituloMobile: {
        fontSize: 24,
    },

    conteudoPrincipalMobile: {
        paddingHorizontal: 12,
    },

    subtituloMobile: {
        fontSize: 18,
        width: '100%',
        marginBottom: 10,
    },

    descricaoMobile: {
        fontSize: 14,
        width: '100%',
        lineHeight: 20,
        marginBottom: 20,
    },

    cartaoCriseMobile: {
        backgroundColor: "#e8e8e8",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        width: '100%',
    },

    labelCriseMobile: {
        fontSize: 16,
        fontWeight: "700",
        color: "#336af7",
        marginBottom: 10,
        textAlign: 'center',
    },

    labelAcaoMobile: {
        fontSize: 14,
        fontWeight: "700",
        color: "#000000",
        marginTop: 10,
        marginBottom: 5,
    },

    labelAjudaMobile: {
        fontSize: 14,
        fontWeight: "700",
        color: "#000000",
        marginTop: 15,
        marginBottom: 5,
    },

    textoCelulaMobile: {
        fontSize: 13,
        fontWeight: "500",
        color: "#000000",
        lineHeight: 18,
    },

    avisoMobile: {
        fontSize: 14,
        width: '100%',
        marginTop: 15,
        marginBottom: 20,
    },

    tituloSecaoMobile: {
        fontSize: 18,
        width: '100%',
        marginBottom: 12,
    },

    containerArtigos: {
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
        width: '64%'
    },

    containerArtigosMobile: {
        width: '100%',
    },

    cartaoArtigoMobile: {
        width: '100%',
        flexDirection: "column",
    },

    imagemArtigoMobile: {
        width: '100%',
        height: 150,
    },

    tituloArtigoMobile: {
        fontSize: 12,
        width: '100%',
        padding: 10,
    },
});
