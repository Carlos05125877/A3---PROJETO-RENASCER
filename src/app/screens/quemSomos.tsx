import Topo from "@/components/topo";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuemSomos() {
  return (
    <View style={styles.containerPrincipal}>
      <View style={{ zIndex: 1 }}>
        <Topo />
      </View>

      <ScrollView
        style={styles.containerPrincipal}
        contentContainerStyle={styles.containerConteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapperConteudo}>
          <Text style={styles.titulo}>Quem Somos</Text>
          <View style={styles.linha} />

          <Text style={styles.subtitulo}>Nossa missão</Text>
          <Text style={styles.texto}>
            Promover acolhimento, informação e ferramentas práticas para saúde mental, oferecendo conteúdos e recursos acessíveis que apoiem a autorregulação e o acesso a cuidados quando necessário. Faz parte da nossa missão disponibilizar um sistema confiável de agendamento e uma lista de profissionais cadastrados para facilitar o acesso a atendimento qualificado.
          </Text>

          <Text style={styles.subtitulo}>Nossa visão</Text>
          <Text style={styles.texto}>
            Ser uma plataforma de referência em suporte emocional e prevenção, conectando pessoas a informações confiáveis e atitudes que favoreçam o bem-estar. Visamos consolidar um ecossistema que reúne conteúdo, profissionais e, em breve, uma comunidade estruturada para suporte mútuo.
          </Text>

          <Text style={styles.subtitulo}>O que fazemos</Text>
          <Text style={styles.texto}>
            Produzimos artigos educativos, guias de autocuidado e materiais práticos para situações de crise. Além disso, já oferecemos um sistema de agendamento e uma lista de profissionais cadastrados com perfis e disponibilidade para facilitar o acesso a cuidados (online e presencial). Trabalhamos para reduzir o estigma ligado à busca por ajuda profissional e para aumentar a literacia em saúde mental.
          </Text>

          <Text style={styles.subtitulo}>Agendamento e lista de profissionais</Text>
          <Text style={styles.texto}>
            Nosso sistema de agendamento e a lista de profissionais já estão disponíveis na plataforma. Cada profissional possui perfil com especialidade, breve biografia, idiomas atendidos e disponibilidade. Usuários podem filtrar por especialidade, região e modalidade (online/presencial) e salvar profissionais favoritos para contato rápido.
          </Text>

          <Text style={styles.subtitulo}>Comunidade (em desenvolvimento)</Text>
          <Text style={styles.texto}>
            Estamos desenvolvendo uma comunidade segura e moderada onde usuários poderão participar de grupos de apoio, discutir conteúdos, compartilhar estratégias de autocuidado e participar de eventos e rodas temáticas online. A comunidade será construída com foco em privacidade, respeito e suporte mútuo.
          </Text>

          <Text style={styles.subtitulo}>Equipe</Text>
          <View style={styles.blocoEquipe}>
            <View style={styles.membro}>
              <View style={styles.infoMembro}>
                <Text style={styles.nomeMembro}>Alex Fernandes</Text>
                <Text style={styles.cargoMembro}>Estudante Ciência da Computação</Text>
              </View>
            </View>
            <View style={styles.membro}>
              <View style={styles.infoMembro}>
                <Text style={styles.nomeMembro}>Carlos Souza</Text>
                <Text style={styles.cargoMembro}>Estudante Ciência da Computação</Text>
              </View>
            </View>

            <View style={styles.membro}>
              <View style={styles.infoMembro}>
                <Text style={styles.nomeMembro}>Samira Reis</Text>
                <Text style={styles.cargoMembro}>Estudante Análise e Desenvolvimento de Sistemas</Text>
              </View>
            </View>
            <View style={styles.membro}>
              <View style={styles.infoMembro}>
                <Text style={styles.nomeMembro}>Yuri Carvalho</Text>
                <Text style={styles.cargoMembro}>Estudante Ciência da Computação</Text>
              </View>
            </View>
            <View style={styles.membro}>
              <View style={styles.infoMembro}>
                <Text style={styles.nomeMembro}>Ana Julia Garcia</Text>
                <Text style={styles.cargoMembro}>Estudante Administração</Text>
              </View>
            </View>
            <View style={styles.membro}>
              <View style={styles.infoMembro}>
                <Text style={styles.nomeMembro}>Vânia Marques da Cruz</Text>
                <Text style={styles.cargoMembro}>Estudante Ciências Contábeis</Text>
              </View>
            </View>
            <View style={styles.membro}>
              <View style={styles.infoMembro}>
                <Text style={styles.nomeMembro}>Késia Figueiredo</Text>
                <Text style={styles.cargoMembro}>Estudante Ciências Contábeis</Text>
              </View>
            </View>
          </View>
          

          <TouchableOpacity
            style={styles.botaoContato}
            onPress={() => Linking.openURL("mailto:contato@renascer.org?subject=Interesse%20Beta")}
          >
            <Text style={styles.textoBotao}>Contato</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    width: "100%",
  },
  containerConteudo: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 30,
  },
  wrapperConteudo: {
    width: "100%",
    maxWidth: 900,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0b2157",
    textAlign: "center",
    marginBottom: 8,
  },
  linha: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginVertical: 16,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0b2157",
    marginTop: 12,
    marginBottom: 8,
  },
  texto: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333333",
    lineHeight: 22,
    marginBottom: 12,
    width: "100%",
    maxWidth: 800,
  },
  blocoEquipe: {
    width: "100%",
    marginTop: 8,
    marginBottom: 16,
  },
  membro: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  fotoPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginRight: 12,
    borderWidth: 3,
    borderColor: "#336af7",
  },
  infoMembro: {
    flex: 1,
  },
  nomeMembro: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  cargoMembro: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  botaoContato: {
    backgroundColor: "#336af7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
