import RedeSocialHome from "@/components/redeSocialHome";
import { ScrollView, View } from "react-native";
import Banner from '../../components/banner';
import Relatos from '../../components/relatos';
import Topo from '../../components/topo';




export default function Index() {
  return (
    <View style={{flex: 1}}>
      <View style={{ flex: 0.12, zIndex: 1}} >
        <Topo />
      </View>
      <ScrollView showsVerticalScrollIndicator ={false} style={{ flex: 1, overflowX: 'auto'}}>
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
    /*
    <View style={{flex: 1}}>
      <Login/>
    </View>
  
    */
  )
}
