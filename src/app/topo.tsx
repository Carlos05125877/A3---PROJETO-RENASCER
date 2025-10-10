import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Topo() {
  return (
    <View style={styles.backgroundPagina}>
      <View style={styles.topoPagina}>
        <View style={styles.topoPaginaEsquerda}>


          <View style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }}>
            <Image style={styles.logo} source={require('../../assets/images/Logo.png')}/>
            <View>
              <Text style={styles.textoLogo}>Renascer</Text>
              <Text style={styles.subtituloLogo}>Especialista em Burnout</Text>
            </View>
          </View>


          <TouchableOpacity onPress={() =>{ }}>
            <View>
              <Text style={styles.textoComoFuncionaBlog} >Como Funciona</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity>
            <View>
              <Text style={styles.textoComoFuncionaBlog} >Blog</Text>
            </View>
          </TouchableOpacity>


          <View >
            <TouchableOpacity style={styles.botaoExclusivo}>
              <MaterialCommunityIcons name='crown' size={24} color='#E6B103' />
              <Text style={{
                paddingLeft: 5,
                color: '#E6B103',
                fontFamily: "Inria Sans",
                fontSize: 16,
                fontWeight: 700
              }}>Exclusivo</Text>
            </TouchableOpacity>
          </View>


        </View>
        <View style={styles.topoPaginaDireita}>
          <TouchableOpacity onPress={() => { }} style={styles.botaoAgendamentoEntrar}>
            <MaterialCommunityIcons name='calendar' size={24} color='#FFFFFF' />
            <Text style={styles.textoBotaoAgendamentoEntrar}>Agendar Consulta</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.botaoCriarConta} onPress={() => { }}>
            <Text style={styles.textoBotaoCriarConta}>Criar Conta</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => { }} style={[styles.botaoAgendamentoEntrar, {
            width: 100,
          }]}>
            <Text style={styles.textoBotaoAgendamentoEntrar}>Entrar</Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundPagina: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topoPagina: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topoPaginaEsquerda: {
    flexDirection: 'row',
    display: 'flex',
    gap: 83,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  textoLogo: {
    color: '#000',
    fontFamily: "Times New Roman",
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 700,
  },
  subtituloLogo: {
    color: '#000',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 400, marginRight: 35,
    marginTop: -5
  },
  textoComoFuncionaBlog: {
    color: '#000',
    fontFamily: "Inria Sans",
    fontSize: 16,
    fontWeight: 400,
  },

  botaoExclusivo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topoPaginaDireita: {
    flexDirection: 'row',
    gap: 40,
    marginRight: 80,
    alignItems: 'flex-end',
  },
  botaoAgendamentoEntrar: {
    flexDirection: 'row',
    backgroundColor: '#336BF7',
    width: 170,
    height: 33,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textoBotaoAgendamentoEntrar: {
    padding: 5,
    color: '#FFFFFF',
    fontFamily: "Inria Sans",
    fontSize: 16,
  },
  botaoCriarConta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  textoBotaoCriarConta: {
    color: '#336BF7',
    fontFamily: "Inria Sans",
    fontSize: 16,
  },
}
)


