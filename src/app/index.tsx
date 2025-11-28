import RedeSocialHome from "@/components/redeSocialHome";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Banner from '../../components/banner';
import Relatos from '../../components/relatos';
import Topo from '../../components/topo';

export default function Index() {
  const { width } = useWindowDimensions();
  // considerar dispositivo móvel apenas em native (não em web)
  const isMobile = Platform.OS !== 'web' && width < 500;

  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        <Text style={styles.mobileTitulo}>Acesso apenas via computador</Text>
        <Text style={styles.mobileTexto}>
          O sistema está disponível somente em computadores ou notebooks. Por favor, abra este site em um dispositivo com tela maior para acessar todas as funcionalidades.
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={{zIndex: 1}} >
        <Topo />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View>
          <Banner />
        </View>
        <View>
          <Relatos />
        </View>
        <View>
          <RedeSocialHome/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  mobileTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0b2157",
    textAlign: "center",
    marginBottom: 12,
  },
  mobileTexto: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
});
