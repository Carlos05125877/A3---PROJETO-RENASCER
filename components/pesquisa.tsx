import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Dimensions, StyleSheet, TextInput, View } from "react-native";

const { width, height } = Dimensions.get('window');

interface PesquisaProps {
  onNomeChange?: (nome: string) => void;
  onLocalizacaoChange?: (localizacao: string) => void;
}

export default function Pesquisa({ onNomeChange, onLocalizacaoChange }: PesquisaProps) {
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const handleNomeChange = (text: string) => {
    setNome(text);
    onNomeChange?.(text);
  };

  const handleLocalizacaoChange = (text: string) => {
    setLocalizacao(text);
    onLocalizacaoChange?.(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.campoBusca}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color="#336BF7" 
          style={styles.icone}
        />
        <TextInput
          style={styles.input}
          placeholder="Procure por nome do especialista"
          placeholderTextColor="#999999"
          value={nome}
          onChangeText={handleNomeChange}
        />
      </View>

      {/* Separador vertical */}
      <View style={styles.separador} />

      {/* Campo de busca por localização */}
      <View style={styles.campoBusca}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color="#336BF7" 
          style={styles.icone}
        />
        <TextInput
          style={styles.input}
          placeholder="Procure por localização"
          placeholderTextColor="#999999"
          value={localizacao}
          onChangeText={handleLocalizacaoChange}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: width * 0.45, // Aproximadamente 904px em telas maiores
    height: 60,
    paddingHorizontal: 34,
    paddingVertical: 4,
    alignItems: 'center',
    gap: 36,
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  campoBusca: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  icone: {
    marginRight: 8,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inria Sans',
    color: '#000',
    paddingVertical: 8,
    outlineWidth: 0,
    outlineColor: 'transparent',
    
  },
  
  separador: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
}
)