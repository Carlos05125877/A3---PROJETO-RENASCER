import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get('window');

interface ProfissionalProps {
  nome: string;
  especialidade: string;
  crp: string;
  descricao: string;
  preco: string;
  imagem : string;
  onAgendar?: () => void;
  onWhatsApp?: () => void;
  onInstagram?: () => void;
}

export default function Profissional({
  nome,
  especialidade,
  crp,
  descricao,
  preco,
  imagem,
  onAgendar,
  onWhatsApp,
  onInstagram
}: ProfissionalProps) {
  return (
    <View style={styles.container}>
      {/* Header do perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{uri: imagem}} style={{width: 75, height: 75, borderRadius: 8}}/>
        </View>


        <View>
          <View style={styles.infoContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.nome}>{nome}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 8 }}>
              <View style={styles.infoContainer}>
                <Text style={styles.especialidade}>{especialidade}</Text>
                <Text style={styles.crp}>{crp}</Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={onWhatsApp} style={styles.iconButton}>
                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={20}
                    color="#000"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onInstagram} style={styles.iconButton}>
                  <MaterialCommunityIcons
                    name="instagram"
                    size={20}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>


      <View style={styles.descricaoContainer}>
        <Text style={styles.descricao}>{descricao}</Text>
      </View>
      <View style={{
         width: '100%' }}>
        <Text style={{
          marginTop: 50,
          textAlign: 'center',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          color: '#4285F4',
          fontSize: 25
        }}>{preco}</Text>
      </View>
      <TouchableOpacity style={styles.botaoAgendar} onPress={onAgendar}>
        <Text style={styles.textoBotao}>Agendar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '30%',
    height: '100%',
    padding: 18,
    paddingHorizontal: 31,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 15,
    borderRadius: 20,
    backgroundColor: '#F2EFEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    overflow: 'hidden'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    width: '100%',
    overflow: 'hidden'
  },

  avatarContainer: {
    width: 75,
    height: 75,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoContainer: {
    flex: 1,
    gap: 8,
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Inria Sans',
  },

  especialidade: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inria Sans',
  },

  crp: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inria Sans',
  },

  iconsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-end',
  },

  iconButton: {
    padding: 4,
  },

  descricaoContainer: {
    width: '100%',
    height: 120
  },

  descricao: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inria Sans',
    lineHeight: 22,
    textAlign: 'left',
  },

  botaoAgendar: {
    alignSelf: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },

  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inria Sans',
  },
})