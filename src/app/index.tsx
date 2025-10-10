import { ScrollView, View } from "react-native";
import Banner from "./banner";
import Explicacao from "./explicacao";
import Topo from "./topo";

export default function Index() {
    return (
    
    <View>
        <ScrollView>
        <Topo/>
        <View style={{borderColor: '#336BF7', borderWidth: 3
        }}>
        <Banner/>
        </View>
        <Explicacao/>
        </ScrollView>
    </View>
    )
}
