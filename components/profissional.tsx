import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

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
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {/* Header do perfil */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View style={[styles.avatarContainer, isMobile && styles.avatarContainerMobile]}>
          <Image source={{uri: imagem}} style={[styles.avatarImage, isMobile && styles.avatarImageMobile]}/>
        </View>


        <View style={styles.infoWrapper}>
          <View style={styles.infoContainer}>
            <Text style={[styles.nome, isMobile && styles.nomeMobile]}>{nome}</Text>
            <View style={[styles.infoRow, isMobile && styles.infoRowMobile]}>
              <View style={styles.infoContainer}>
                <Text style={[styles.especialidade, isMobile && styles.especialidadeMobile]}>{especialidade}</Text>
                <Text style={[styles.crp, isMobile && styles.crpMobile]}>{crp}</Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={onWhatsApp} style={styles.iconButton}>
                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={isMobile ? 18 : 20}
                    color="#000"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onInstagram} style={styles.iconButton}>
                  <MaterialCommunityIcons
                    name="instagram"
                    size={isMobile ? 18 : 20}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>


      <View style={[styles.descricaoContainer, isMobile && styles.descricaoContainerMobile]}>
        <Text style={[styles.descricao, isMobile && styles.descricaoMobile]}>{descricao}</Text>
      </View>
      <View style={{
         width: '100%' }}>
        <Text style={[styles.preco, isMobile && styles.precoMobile]}>{preco}</Text>
      </View>
      <TouchableOpacity style={[styles.botaoAgendar, isMobile && styles.botaoAgendarMobile]} onPress={onAgendar}>
        <Text style={[styles.textoBotao, isMobile && styles.textoBotaoMobile]}>Agendar</Text>
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

  avatarImage: {
    width: 75,
    height: 75,
    borderRadius: 8
  },

  infoWrapper: {
    flex: 1,
  },

  infoContainer: {
    flex: 1,
    gap: 8,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8
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

  preco: {
    marginTop: 50,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#4285F4',
    fontSize: 25
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

  // Estilos Mobile
  containerMobile: {
    width: '100%',
    height: 'auto',
    padding: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  headerMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },

  avatarContainerMobile: {
    width: 100,
    height: 100,
  },

  avatarImageMobile: {
    width: 100,
    height: 100,
  },

  infoRowMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },

  nomeMobile: {
    fontSize: 22,
    textAlign: 'center',
  },

  especialidadeMobile: {
    fontSize: 14,
    textAlign: 'center',
  },

  crpMobile: {
    fontSize: 12,
    textAlign: 'center',
  },

  descricaoContainerMobile: {
    height: 'auto',
    minHeight: 100,
  },

  descricaoMobile: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  precoMobile: {
    marginTop: 20,
    fontSize: 20,
  },

  botaoAgendarMobile: {
    width: '100%',
    paddingHorizontal: 20,
  },

  textoBotaoMobile: {
    fontSize: 14,
  },
})