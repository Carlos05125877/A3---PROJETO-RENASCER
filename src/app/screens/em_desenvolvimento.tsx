import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Topo from '../../../components/topo';


export default function emDesenvolvimento() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
      <View style={styles.backgroundPagina}>
        <View style={{ width: '100%' }}>
          <Topo />
        </View>
        <Text style={[styles.texto, isMobile && styles.textoMobile]}>Em Desenvolvimento</Text>
      </View>
  )

}
const styles = StyleSheet.create({
  backgroundPagina: {
    flex: 1,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  texto: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },

  textoMobile: {
    fontSize: 18,
    marginTop: 15,
    paddingHorizontal: 20,
  },
})