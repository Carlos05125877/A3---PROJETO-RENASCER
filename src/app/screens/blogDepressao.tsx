import Topo from "@/components/topo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function blogDepressao() {
    const router = useRouter(); // mover para aqui, dentro do componente
    
    return (
      <View style={{flex: 1}}>
        <View style={{  zIndex: 1 }}>
          <Topo />
        </View>
        <ScrollView >
            <View style={styles.containerPrincipal}>
                <View>
                    <Text style={styles.titulo}>Depressão</Text>
                </View>
                    <View style={styles.linha}/>
                <View style={[styles.conteudoPrincipal, {width: '64%',}]}>
                    <Text style={styles.subtitulo}>Depressão: entendendo suas causas, sintomas e caminhos de tratamento:</Text>
                    <Text style={styles.descricao}>
                        A depressão é um transtorno emocional sério, caracterizado por uma combinação de sintomas que afetam profundamente a forma como a pessoa sente, pensa e age. Diferente da tristeza comum, que geralmente tem uma causa identificável e dura pouco tempo, a depressão pode surgir de forma silenciosa e permanecer por semanas ou meses, influenciando toda a rotina. Embora muitas pessoas ainda associem o tema à fraqueza ou falta de força de vontade, a depressão é uma condição complexa e merece atenção e cuidado.
                    </Text>
                    <View style={styles.conteudoSegundario}>
                        <View style={styles.linhaConteudo}>
                            <View style={styles.textoLado}>
                                <Text style={styles.subtitulo}>O que pode causar a depressão?</Text>
                                <Text style={styles.descricao}>A depressão geralmente é resultado de múltiplos fatores, que se conectam de maneiras diferentes em cada pessoa. Fatores biológicos, como alterações químicas no cérebro e histórico familiar, podem aumentar a vulnerabilidade emocional. Ao mesmo tempo, experiências pessoais — como traumas, perdas afetivas, pressão constante, autocrítica excessiva e situações de estresse prolongado — podem desencadear ou intensificar o quadro. Ambientes hostis, conflitos, solidão e mudanças bruscas na rotina também exercem grande influência.</Text>
                                <Text style={styles.descricao}>Pausa para reflexão</Text>
                                <Text style={styles.pausaReflexao}> Algum desses aspectos faz parte da sua vida ou da vida de alguém próximo? Reconhecer os fatores é o primeiro passo para compreender o que está acontecendo. </Text>
                            </View>
                            <Image source={require("../../../assets/images/imagemCausa.png")} style={styles.imagemConteudo} />
                        </View>
                    </View>
                    <View style={styles.conteudoSegundario}>
                        <View style={styles.linhaConteudo}>
                            <Image source={require("../../../assets/images/manifesta.png")} style={styles.imagemConteudo} />
                            <View style={styles.textoLado}>
                                <Text style={styles.subtitulo}>Como a depressão se manifesta?</Text>
                                <Text style={styles.descricao}>Os sintomas podem variar bastante, tanto na intensidade quanto na forma como aparecem. Geralmente incluem tristeza profunda, perda de interesse em atividades antes prazerosas e a sensação de que a energia simplesmente desapareceu. É comum também notar mudanças no sono — dificuldade para dormir ou vontade de dormir o tempo todo — além de alterações no apetite, dificuldade de concentração, irritabilidade, sensação de culpa constante e a impressão de que tudo ao redor perdeu brilho.</Text>
                                <Text style={[styles.descricao, {color: '#0C2157'}]}>Esses sinais não surgem de uma vez, mas se acumulam de maneira gradual, afetando trabalho, estudos, relações e autoestima.</Text>
                                <Text style={styles.descricao}>Pergunta para você:</Text>
                                <Text style={styles.pausaReflexao}>Você já percebeu momentos em que se sentiu “diferente de si mesmo(a)”, como se estivesse menos motivado(a) ou mais cansado(a) do que o normal?</Text>
                            </View>
                            
                        </View>
                    </View>
                    <View style={styles.conteudoPrincipal}>
                        <Text style={styles.subtitulo}>Como a depressão pode ser tratada?</Text>     
                        <Text style={styles.descricao}>A boa notícia é que a depressão tem tratamento — e quanto mais cedo ele começa, maiores são as chances de recuperação. A psicoterapia é uma ferramenta essencial, pois ajuda a identificar pensamentos e comportamentos que influenciam o estado emocional. Em muitos casos, o acompanhamento médico com uso de antidepressivos é recomendado, auxiliando no equilíbrio químico do cérebro. Além disso, hábitos saudáveis podem fazer parte do tratamento: prática regular de exercícios, sono adequado, alimentação equilibrada, redução do estresse, terapia de relaxamento e fortalecimento das relações sociais. Nenhuma dessas práticas substitui o acompanhamento profissional, mas todas podem intensificar os resultados.</Text>   
                    </View>

                    <View style={styles.cardImportante}>
                        <View style={styles.textoCardImportante}>
                            <Text style={styles.labelCardImportante}>Lembrete importante:</Text>
                            <Text style={styles.descricaoCardImportante}>Se você ou alguém que você conhece apresenta sintomas persistentes, buscar ajuda não é fraqueza — é coragem.</Text>
                        </View>
                        <Image source={require("../../../assets/images/lembrete.png")} style={styles.imagemCardImportante} />
                    </View>

                    <View style={styles.conteudoPrincipal}>
                        <Text style={styles.subtitulo}>Por que falar sobre depressão é tão importante?</Text>     
                        <Text style={styles.descricao}>A depressão ainda é cercada por tabus, o que impede muitas pessoas de pedir ajuda. Quando abrimos espaço para dialogar, informar e acolher, quebramos barreiras e facilitamos o acesso ao tratamento. Falar sobre saúde mental é uma forma valiosa de cuidar de si mesmo e também de quem está ao nosso redor. Normalize a conversa, busque ajuda profissional e lembre-se: você não está sozinho(a) nessa jornada.</Text>
                    </View>

                    <Text style={styles.tituloSecao}>Últimos artigos</Text>
                                    <View style={{ flexDirection: "column", gap: 12, alignItems: "flex-start" , width: '64%'}}>
                                    
                    
                                        <View style={styles.cartaoArtigo}>
                                            <Image source={require("../../../assets/images/stress.png")} style={styles.imagemArtigo} />
                                            <TouchableOpacity onPress={() => (router.push('/screens/blogEstresse'))}>
                                            <Text style={styles.tituloArtigo}>
                                                Estresse: Entenda as causas e como prevenir - Interaja e descubra seu nível de bem-estar
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                    
                                        <View style={styles.cartaoArtigo}>
                                            <Image source={require("../../../assets/images/anxiety.png")} style={styles.imagemArtigo} />
                                            <TouchableOpacity onPress={() => (router.push('/screens/blogAnsiedade'))}>
                                            <Text style={styles.tituloArtigo}>
                                                Ansiedade: entendendo suas origens, sintomas e como encontrar o equilíbrio
                                            </Text>
                                            </TouchableOpacity>
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
        marginBottom: 24,
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
        width: 400,
        height: 380,
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
});
