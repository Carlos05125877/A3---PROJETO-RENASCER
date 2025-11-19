import { buscarProfissional, profissionais } from '@/back-end/Api';
import Pesquisa from '@/components/pesquisa';
import Profissional from '@/components/profissional';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Topo from '../../../components/topo';
import Agendador from '@/components/agendador';

interface Profissional extends profissionais {
  onAgendar?: () => void;
  onWhatsApp?: () => void;
  onInstagram?: () => void;
}


export default function ListaDeProfissionais() {
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false)
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null)
  const [listaProfissionais, setListaProfissionais] = useState<profissionais[]>([])

  useEffect(() => {
    const Profissionais = async () => {
      setListaProfissionais(await buscarProfissional());
    }
    Profissionais()
  }, [])


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
          {listaProfissionais.map((pessoa, indice) => (
            pessoa.horarios.length > 0 &&
            <Profissional
              nome={pessoa.nome}
              especialidade={pessoa.profissao}
              crp={pessoa.crp}
              descricao={pessoa.biografia}
              preco={pessoa.preco}
              onAgendar={() => {
                setProfissionalSelecionado(pessoa)
                setModalVisivel(true)
              }}
              onWhatsApp={() => {
                if (!pessoa.whatsapp) {
                  alert('O profissional não cadastrou whatsapp')
                  return
                }
                const acessoWhatsapp = pessoa.whatsapp.replace(/[^0-9]/g, '');


                window.open(`https://web.whatsapp.com/send?phone=${acessoWhatsapp}`)

              }}
              onInstagram={() => {
                if (!pessoa.instagram) {
                  alert('O profissional não cadastrou instagram')
                  return
                }
                const acessoInstagram = pessoa.instagram.replace(/[^a-zA-Z0-9._-]/g, '');


                window.open(`https://www.instagram.com/${acessoInstagram}/`)
              }} />
          ))}
        </View>
        <Modal
          isVisible={modalVisivel}
          onBackdropPress={() => setModalVisivel(false)}
          animationIn='zoomIn'
          animationOut='zoomOut'
          style={{ justifyContent: 'center', alignItems: 'center' }}
          backdropColor="black"
          backdropOpacity={0.8}>
          {profissionalSelecionado && (
            <Agendador
              id={profissionalSelecionado.id}
              nome={profissionalSelecionado.nome}
              profissao={profissionalSelecionado.profissao}
              crp={profissionalSelecionado.crp}
              imagem={profissionalSelecionado.imagem}
              preco={profissionalSelecionado.preco}
              horarios={profissionalSelecionado.horarios}
            />
          )}
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