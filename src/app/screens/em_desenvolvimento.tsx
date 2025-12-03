import { StyleSheet, Text, View } from 'react-native';
import Topo from '../../../components/topo';


export default function emDesenvolvimento() {

  return (
      <View style={styles.backgroundPagina}>
        <View style={{ width: '100%' }}>
          <Topo />
        </View>
        <Text style={styles.texto}>Em Desenvolvimento</Text>
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
})