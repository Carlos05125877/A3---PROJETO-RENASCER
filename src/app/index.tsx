import { ScrollView, StyleSheet, View } from "react-native";
import Banner from '../../components/banner';
import Explicacao from '../../components/explicacao';
import Relatos from '../../components/relatos';
import Topo from '../../components/topo';

export default function Index() {
  return (
    <ScrollView>
    <View>
    <View style={{flex: 1, marginTop: 10, marginBottom: 10}} >
      <Topo/>
    </View>
    <View>
    <Banner/>
    </View>
    <View>
    <Explicacao/>
    </View>
    <View>
      <Relatos/>
    </View>
    </View>
    </ScrollView>
    /*
    <View style={{flex: 1}}>
      <Login/>
    </View>
  
    */
  )
}
const styles = StyleSheet.create(
  {
    scrollView:{

      flex:1,
      overflowY: 'scroll',
      overflowX: 'hidden',
    }
  }
)
