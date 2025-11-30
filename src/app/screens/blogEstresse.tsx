import BloqueioAssinatura from "@/components/bloqueioAssinatura";
import Topo from "@/components/topo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function blogEstresse() {
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
                    <Text style={styles.titulo}>Estresse</Text>
                </View>
                    
                <View style={styles.linha}/>
                
                <View style={[styles.conteudoPrincipal, {width: '64%',}]}>
                    <Text style={styles.subtitulo}>Estresse: Entenda as Causas, Sintomas e Como Prevenir – Interaja e Descubra Seu Nível de Bem-Estar</Text>
                    <Text style={styles.descricao}>
                        O estresse faz parte da vida moderna, mas isso não significa que devemos aceitá-lo como algo normal. De alerta, o estresse é uma resposta natural do corpo e da mente a situações desafiadoras. Neste conteúdo, você vai descobrir o que está por trás do estresse, identificar sinais no seu dia a dia e aprender estratégias práticas para preveni-lo.
                    </Text>
                    
                    <View style={styles.conteudoSegundario}>
                        <View style={styles.linhaConteudo}>
                            <View style={styles.textoLado}>
                                <View style={styles.iconeComTitulo}>
                                    
                                    <Text style={styles.subtitulo}>O que é Estresse?</Text>
                                </View>
                                <Text style={styles.descricao}>O estresse é uma reação natural do corpo diante de situações que exigem adaptação. Ele ativa o chamado "modo alerta", preparando você para lidar com desafios. O problema aparece quando essa ativação é constante — o que chamamos de estresse crônico.</Text>
                                <Text style={styles.labelInteraja}>Interaja:</Text>
                                <Text style={styles.pausaReflexao}>Quando você pensa na sua rotina, qual palavra vem primeiro à sua mente: "pressão", "correria" ou "tranquilidade"?</Text>
                            </View>
                            
                        </View>
                    </View>

                    <View style={styles.conteudoSegundario}>
                        <View style={styles.linhaConteudo}>
                            <Image source={require("../../../assets/images/estresse2.png")} style={styles.imagemConteudo2} />
                            <View style={styles.textoLado}>
                                <Text style={styles.subtitulo}>Principais Causas do Estresse</Text>
                                <Text style={styles.descricao}>O estresse pode ter diversas origens. Aqui estão algumas das mais comuns:</Text>
                                <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>1. Excesso de responsabilidades</Text> - Trabalho, família, prazos - tudo acumulando ao mesmo tempo.</Text>
                                <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>2. Problemas financeiros</Text> - Desemprego, dívidas e gastos podem desestabilizar.</Text>
                                <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>3. Conflitos pessoais</Text> - Desentendimentos em relacionamentos e amizades.</Text>
                                <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>4. Saúde física debilitada</Text> - Cansaço extremo ou falta de sono afetam drasticamente.</Text>
                                <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>5. Mudanças significativas</Text> - Mudanças de emprego, término de relacionamento, etc.</Text>
                                <Text style={styles.pausaReflexao}>Pergunta para você: Alguma dessas causas está presente na sua vida agora?</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.conteudoPrincipal}>
                        <View style={styles.iconeComTitulo}>
                            
                            <Text style={styles.subtitulo}>Sintomas do Estresse: Fique Atento ao Seu Corpo e à Sua Mente</Text>
                        </View>
                        <Text style={styles.descricao}>O estresse se manifesta de maneiras diferentes. Veja os sintomas mais frequentes:</Text>
                        
                        <View style={styles.linhaConteudo}>
                            <View style={styles.textoLado}>
                                <Text style={styles.labelSintomas}>Sintomas físicos</Text>
                                <Text style={styles.itemSintoma}>• Dor de cabeça</Text>
                                <Text style={styles.itemSintoma}>• Tensão muscular</Text>
                                <Text style={styles.itemSintoma}>• Insônia</Text>
                                <Text style={styles.itemSintoma}>• Cansaço constante</Text>
                                <Text style={styles.itemSintoma}>• Problemas digestivos</Text>
                                <Text style={styles.itemSintoma}>• Alterações no apetite</Text>
                                
                                <Text style={[styles.labelSintomas, {marginTop: 16}]}>Sintomas emocionais</Text>
                                <Text style={styles.itemSintoma}>• Irritabilidade</Text>
                                <Text style={styles.itemSintoma}>• Ansiedade</Text>
                                <Text style={styles.itemSintoma}>• Sensação de sobrecarga</Text>
                                <Text style={styles.itemSintoma}>• Falta de motivação</Text>
                                <Text style={styles.itemSintoma}>• Tristeza sem motivo claro</Text>
                                
                                <Text style={[styles.labelSintomas, {marginTop: 16}]}>Sintomas comportamentais</Text>
                                <Text style={styles.itemSintoma}>• Procrastinação</Text>
                                <Text style={styles.itemSintoma}>• Agressividade</Text>
                                <Text style={styles.itemSintoma}>• Isolamento</Text>
                                <Text style={styles.itemSintoma}>• Uso exagerado de comida, álcool ou telas como "escape"</Text>
                            </View>
                            
                            <Image source={require("../../../assets/images/estresse3.png")} style={styles.imagemConteudo} />
                        </View>
                    </View>

                    <View style={styles.conteudoPrincipal}>
                        <Text style={styles.subtitulo}>Principais Causas do Estresse</Text>
                        <Text style={styles.descricao}>O estresse pode ter diversas origens. Aqui estão algumas das mais comuns:</Text>
                        <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>1. Excesso de responsabilidades</Text> - Trabalho, família, prazos - tudo acumulando ao mesmo tempo.</Text>
                        <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>2. Problemas financeiros</Text> - Desemprego, dívidas e gastos podem desestabilizar.</Text>
                        <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>3. Conflitos pessoais</Text> - Desentendimentos em relacionamentos e amizades.</Text>
                        <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>4. Saúde física debilitada</Text> - Cansaço extremo ou falta de sono afetam drasticamente.</Text>
                        <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>5. Mudanças significativas</Text> - Mudanças de emprego, término de relacionamento, etc.</Text>
                        <Text style={styles.pausaReflexao}>Pergunta para você: Alguma dessas causas está presente na sua vida agora?</Text>
                    </View>

                    <View style={styles.conteudoPrincipal}>
                        <Text style={styles.subtitulo}>Como Prevenir o Estresse: Estratégias Práticas</Text>
                        <Text style={styles.descricao}>A prevenção começa com pequenas ações diárias. Aqui estão estratégias eficazes:</Text>
                        
                        <View style={{marginVertical: 12}}>
                            <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>A. Hábitos básicos</Text> - Aprenda a dizer "não" quando necessário. Isso agora não quer dizer sempre "não" - significa priorizar sua saúde mental.</Text>
                            <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>B. Rotina de sono</Text> - Use toalhas, calendários e blocos de tarefas, isso otimiza seu plano mental.</Text>
                            <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>C. Invista em pausa consciente</Text> - Tire um tempo diariamente, ainda que cinco minutos. Pequenos momentos podem fazer grandes diferenças.</Text>
                            <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>D. Durma melhor</Text> - Durma à noite como prioridade - não coma tarde.</Text>
                            <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>E. Conecte-se com pessoas</Text> - Converse com amigos e familiares e fortalecam vínculos pessoais.</Text>
                            <Text style={styles.descricao}><Text style={{fontWeight: '700'}}>F. Use Técnicas de relaxamento</Text></Text>
                            <Text style={styles.descricao}>   • Meditação</Text>
                            <Text style={styles.descricao}>   • Respiração 4-7-8</Text>
                            <Text style={styles.descricao}>   • Alongamento</Text>
                            <Text style={styles.descricao}>   • Música relaxante</Text>
                        </View>
                    </View>

                    <View style={styles.cardImportante}>
                        <View style={styles.textoCardImportante}>
                            <Text style={styles.labelCardImportante}>Lembrete importante:</Text>
                            <Text style={styles.descricaoCardImportante}>Se você está constantemente estressado, não hesite em buscar apoio profissional. Um psicólogo pode ajudá-lo a desenvolver estratégias personalizadas.</Text>
                        </View>
                        
                    </View>

                    <View style={styles.conteudoPrincipal}>
                        <Text style={styles.subtitulo}>Cuidar do Estresse é Cuidar de Você</Text>
                        <Text style={styles.descricao}>Identificar e prevenir o estresse é um ato de autocuidado. Pequenas mudanças na rotina podem transformar a qualidade de vida. Lembre-se: buscar ajuda profissional também faz parte do autocuidado, e não um sinal de fraqueza.</Text>
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
    imagemConteudo1: {
        width: 220,
        height: 280,
        borderRadius: 16,
        resizeMode: "cover",
        borderWidth: 3,
        borderColor: '#336af7',
    },
    imagemConteudo2: {
        width: 280,
        height: 350,
        borderRadius: 8,
        resizeMode: "cover",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    imagemConteudo: {
        width: 320,
        height: 480,
        borderRadius: 12,
        resizeMode: "cover",
        borderWidth: 2,
        borderColor: '#f0f4ff',
        backgroundColor: '#ffffff',
        padding: 4,
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
    iconeComTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icone: {
        fontSize: 24,
        marginRight: 8,
    },
    labelInteraja: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555555',
        marginTop: 12,
        marginBottom: 4,
    },
    labelSintomas: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0b2157',
        marginBottom: 8,
    },
    itemSintoma: {
        fontSize: 14,
        fontWeight: '500',
        color: '#336af7',
        lineHeight: 20,
        marginBottom: 4,
    },
});
