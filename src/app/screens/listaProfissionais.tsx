import Pesquisa from '@/components/pesquisa';
import Profissional from '@/components/profissional';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Topo from '../../../components/topo';

interface Profissional {
  nome: string;
  especialidade: string;
  crp: string;
  descricao: string;
  onAgendar?: () => void;
  onWhatsApp?: () => void;
  onInstagram?: () => void;
}


export default function ListaDeProfissionais() {
  const dadosProfissional = [{ nome: 'Joao da Silva', especialidade: "Psicólogo", crp: "123456", descricao: "João é um psicólogo que trabalha com terapia individual e familiar." },
  { nome: 'Alex', especialidade: "Psicólogo", crp: "123456", descricao: "João é um psicólogo que trabalha com terapia individual e familiar." },
  { nome: 'Matheus Pereira', especialidade: "Psicólogo", crp: "123456", descricao: "João é um psicólogo que trabalha com terapia individual e familiar." },
  { nome: 'Yuri', especialidade: "Psicólogo", crp: "123456", descricao: "João é um psicólogo que trabalha com terapia individual e familiar." },
  { nome: 'Carlos', especialidade: "Psicólogo", crp: "123456", descricao: "João é um psicólogo que trabalha com terapia individual e familiar." },
  { nome: 'Samira', especialidade: "Psicólogo", crp: "123456", descricao: "João é um psicólogo que trabalha com terapia individual e familiar." },
  ]
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false)
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null)


  return (
    <ScrollView>
      <View style={styles.backgroundPagina}>

        <View style={{ paddingTop: 10, zIndex: 1 }}>
          <Topo />
        </View>
        <View style={[styles.pesquisa, { paddingTop: 10 }]}>
          <Pesquisa onNomeChange={setNome} onLocalizacaoChange={setLocalizacao} />
        </View>
        <View style={{ paddingTop: 10, flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {dadosProfissional.map((pessoa, indice) => (
            <Profissional
              nome={pessoa.nome}
              especialidade={pessoa.especialidade}
              crp={pessoa.crp}
              descricao={pessoa.descricao}
              onAgendar={() => {
                setProfissionalSelecionado(pessoa)
                setModalVisivel(true)
              }}
              onWhatsApp={() => { }}
              onInstagram={() => { }} />
          ))}
        </View>
        <Modal
          isVisible={modalVisivel}
          onBackdropPress={() => setModalVisivel(false)}
          animationIn='zoomIn'
          animationOut='zoomOut'
          style={{justifyContent: 'center', alignItems: 'center'}}
          backdropColor="black"
          backdropOpacity={0.8}>
            {profissionalSelecionado && (
              <Profissional
                nome={profissionalSelecionado.nome}
                especialidade={profissionalSelecionado.especialidade}
                crp={profissionalSelecionado.crp}
                descricao={profissionalSelecionado.descricao}
                onAgendar={() => {
                  setProfissionalSelecionado(profissionalSelecionado)
                  setModalVisivel(true)
                }}
                onWhatsApp={() => { }}
                onInstagram={() => { }} />)}
        </Modal>
        </View>
    </ScrollView >

  )

}
const styles = StyleSheet.create({
  backgroundPagina: {
    flex: 1,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  pesquisa: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 200,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    backgroundColor: '#336BF7',
  },
})