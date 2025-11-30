import BloqueioAssinatura from "@/components/bloqueioAssinatura";
import Topo from "@/components/topo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function blogAnsiedade() {
    const router = useRouter();
    
    return (
      <BloqueioAssinatura>
        <View style={{flex: 1}}>
          <View style={{  zIndex: 1 }}>
            <Topo />
          </View>
          <ScrollView >
            <View style={styles.containerPrincipal}>
                <View>
                    <Text style={styles.titulo}>Ansiedade</Text>
                </View>
                    <View style={styles.linha}/>
                <View style={[styles.conteudoPrincipal, {width: '64%',}]}>
                    <Text style={styles.subtitulo}>Ansiedade: entendendo suas origens, sintomas e como encontrar equilíbrio</Text>
                    <Text style={styles.descricao}>
                       A ansiedade faz parte da experiência humana. Sentir-se ansioso antes de uma prova, de uma entrevista ou de uma decisão importante é absolutamente normal. Porém, quando essa sensação se torna constante, intensa ou começa a interferir no bem-estar e na rotina, é sinal de que algo merece mais atenção e cuidado. Neste texto, vamos explorar de forma clara e acolhedora o que está por trás da ansiedade, como ela se manifesta e quais caminhos podem ajudar no processo de equilíbrio emocional. 
                    </Text>
                    
                    
                    <View style={styles.conteudoSegundario}>
                        <View style={styles.duasColunasLayout}>
                            <View style={styles.coluna}>
                                <Text style={styles.subtitulo}>Como a ansiedade se manifesta?</Text>
                                <Text style={styles.descricao}>A ansiedade não aparece da mesma maneira em todas as pessoas. Às vezes ela se instala de forma silenciosa; outras vezes, surge de forma intensa. Entre os sintomas mais comuns estão:</Text> 
                                <Text style={styles.descricao}>• Sensação constante de preocupação ou medo</Text>
                                <Text style={styles.descricao}>• Dificuldade de relaxar</Text>
                                <Text style={styles.descricao}>• Pensamentos acelerados</Text>
                                <Text style={styles.descricao}>• Tensão muscular</Text>
                                <Text style={styles.descricao}>• Palpitações ou respiração curta</Text>
                                <Text style={styles.descricao}>• Dores no estômago ou mal-estar</Text>
                                <Text style={styles.descricao}>• Dificuldade de concentração</Text>
                                <Text style={styles.descricao}>• Sensação de que algo ruim está prestes a acontecer</Text>
                                <Text style={styles.descricao}>Em episódios mais intensos, pode ocorrer uma crise de ansiedade, acompanhada de sensação de descontrole, formigamentos e medo súbito.</Text>
                                <Text style={styles.pausaReflexao}>Pergunta para você: Quais desses sintomas você já sentiu no seu dia a dia? Reconhecer é o primeiro passo.</Text>
                            </View>

                            <View style={styles.coluna}>
                                <Text style={styles.subtitulo}>Por que a ansiedade aparece?</Text>
                                <Text style={styles.descricao}>A ansiedade pode surgir de diferentes fatores — e raramente tem uma causa única. Questões biológicas, como predisposição genética e alterações químicas no cérebro, podem aumentar a vulnerabilidade. Mas fatores emocionais e ambientais também têm grande peso: experiências estressantes, pressão constante, excesso de responsabilidade, relacionamentos desgastantes, mudanças bruscas e até o estilo de vida acelerado contribuem para o quadro.</Text>
                                <Text style={styles.descricao}>Vivemos em uma sociedade que valoriza produtividade extrema, imediatismo e autocobrança — terreno fértil para o desenvolvimento de sintomas ansiosos.</Text>
                                <Text style={styles.pausaReflexao}>Pense um pouco: Como está sua rotina hoje? Você se sente sempre correndo, tentando dar conta de tudo?</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{alignItems: 'center',width: '100%', marginBottom: 20,}}>
                    <Image source={require("../../../assets/images/cicloAnsiedadeMed.png")} style={{width: 600, height: 500,}} />
                    </View>
                    <View style={styles.conteudoPrincipal}>
                        <Text style={styles.subtitulo}>Caminhos para o tratamento e alívio da ansiedade</Text>
                        <Text style={styles.descricao}>A ansiedade tem tratamento — e ele é altamente eficaz quando realizado de forma adequada. A psicoterapia é um dos principais recursos, auxiliando a identificar padrões de pensamento, compreender gatilhos emocionais e desenvolver estratégias para lidar com momentos de tensão. A Terapia Cognitivo-Comportamental (TCC), por exemplo, é muito utilizada nesses casos.</Text>
                        <Text style={styles.descricao}>Em algumas situações, o acompanhamento psiquiátrico e o uso de medicações podem ser recomendados, especialmente quando os sintomas são intensos ou persistentes. Não se trata de "fraqueza", e sim de uma ferramenta de cuidado.</Text>
                    </View>

                    <View style={styles.conteudoSegundario}>
                        <View style={styles.linhaConteudo}>
                            <View style={styles.textoLado}>
                                <Text style={styles.subtituloSecundario}>Além disso, mudanças de hábitos fazem diferença real no dia a dia:</Text>
                                <Text style={styles.descricao}>• Prática regular de atividades físicas</Text>
                                <Text style={styles.descricao}>• Melhora da qualidade do sono</Text>
                                <Text style={styles.descricao}>• Técnicas de respiração e relaxamento</Text>
                                <Text style={styles.descricao}>• Organização da rotina</Text>
                                <Text style={styles.descricao}>• Redução de estímulos excessivos (como uso prolongado de telas)</Text>
                                <Text style={styles.descricao}>• Alimentação equilibrada</Text>
                                <Text style={styles.descricao}>• Fortalecimento das relações sociais</Text>
                                
                                <Text style={[styles.pausaReflexao, {marginTop: 16}]}>Experimente agora: Feche os olhos, inspire profundamente por 4 segundos, segure por 2 e solte lentamente por 6. Repita algumas vezes e observe como seu corpo responde.</Text>
                            </View>
                            <Image source={require("../../../assets/images/ansiedadeAlivio.png")} style={styles.imagemConteudo} />
                        </View>
                    </View>

                    <View style={styles.conteudoPrincipal}>
                        <Text style={styles.subtitulo}>O valor de reconhecer e buscar ajuda</Text>
                        <Text style={styles.descricao}>Falar sobre ansiedade é importante porque ela afeta milhões de pessoas — muitas delas em silêncio, achando que “é normal” viver sempre tenso. Não é. E ninguém precisa enfrentar isso sozinho. </Text>
                    </View>

                    <Text style={styles.tituloSecao}>Últimos artigos</Text>
                                    <View style={{ flexDirection: "column", gap: 12, alignItems: "flex-start" , width: '64%'}}>
                                        <View style={styles.cartaoArtigo}>
                                            <Image source={require("../../../assets/images/depression.png")} style={styles.imagemArtigo} />
                                            <TouchableOpacity onPress={() => (router.push('/screens/blogDepressao'))}>
                                            <Text style={styles.tituloArtigo}>
                                                Depressão: entendendo suas causas, sintomas e caminhos de tratamento
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                    
                                        <View style={styles.cartaoArtigo}>
                                            <Image source={require("../../../assets/images/stress.png")} style={styles.imagemArtigo} />
                                            <TouchableOpacity onPress={() => (router.push('/screens/blogEstresse'))}>
                                            <Text style={styles.tituloArtigo}>
                                                Estresse: Entenda as causas e como prevenir
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                    
                                    <View style={{ height: 40 }} />

                </View>
            </View>
          </ScrollView>
        </View>
      </BloqueioAssinatura>
    );
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    conteudoPrincipal: {
        paddingBottom: 30,
        alignItems: "flex-start",
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
    },
    descricao: {
        fontSize: 16,
        fontWeight: "400",
        color: "#555555",
        lineHeight: 20,
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    linha: {
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        marginBottom: 20,
        width: '100%',
    },
    conteudoSegundario: {
        paddingBottom: 30,
        alignItems: "flex-start",
    },
    linhaConteudo: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'flex-start',
    },
    textoLado: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    imagemConteudo: {
        width: 300,
        height: 400,
        borderRadius: 12,
        resizeMode: "cover",
    },
    pausaReflexao: {
        fontSize: 14,
        fontWeight: '700',
        color: '#336af7',
        marginTop: 12,
        alignItems: 'flex-start',
    },
    tituloSecao: {
        fontSize: 20,
        fontWeight: "600",
        color: "#0b2157",
        marginBottom: 16,
        marginTop: 10,
        alignItems: 'flex-start',
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
    cardImportante: {
        flexDirection: 'row',
        backgroundColor: '#f0f4ff',
        borderLeftWidth: 4,
        borderLeftColor: '#336af7',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
    },
    imagemCardImportante: {
        width: 120,
        height: 120,
        borderRadius: 8,
        resizeMode: "cover",
        marginLeft: 16,
    },
    textoCardImportante: {
        flex: 1,
        justifyContent: 'center',
    },
    labelCardImportante: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0b2157',
        marginBottom: 8,
    },
    descricaoCardImportante: {
        fontSize: 14,
        fontWeight: '500',
        color: '#336af7',
        lineHeight: 20,
    },
    duasColunasLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    coluna: {
        flex: 1,
        marginRight: 12,
    },
    subtituloSecundario: {
        fontSize: 18,
        fontWeight: "500",
        color: "#0b2157",
        marginBottom: 8,
        alignItems: 'flex-start',
    },
});
