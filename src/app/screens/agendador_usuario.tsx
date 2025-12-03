import ConfirmarConsulta from "@/components/confirmarConsulta";
import Topo from "@/components/topo";
import { View } from "react-native";

export default function agendadorUsuario() {
    return (
        <View>
            <View>
                <Topo />
            </View>
            <View style ={{alignItems: 'center'}}>
                <ConfirmarConsulta style={{ width: 1250, marginVertical: 100, }} tipo='users' />
            </View>
        </View>
    )

}