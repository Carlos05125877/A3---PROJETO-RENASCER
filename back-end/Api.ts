import { initializeApp } from 'firebase/app';
import {
   getAuth
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };

export interface profissionais {
  id: string,
  nome: string
  profissao: string
  crp: string
  biografia: string
  imagem: string
  horarios: string[]
  instagram : string
  whatsapp : string
  preco : string
}

export const enviar_Arquivos_Storage_E_Retornar_Url = async (arquivos: Record<string, File | null>,
  userId: string | null): Promise<Record<string, string>> => {
  try {
    const Urls: Record<string, string> = {}
    if (userId && Object.values(arquivos).some((arquivo) => arquivo != null)) {
      for (const [chave, arquivo] of Object.entries(arquivos)) {
        if (arquivo != null) {
          console.log('enviando arquivos para pasta de Usuario');
          const localArquivoStorage = ref(storage, `DadosPessoaisUsuarios/${userId}/${arquivo.name}`);
          await uploadBytes(localArquivoStorage, arquivo);
          console.log('Arquivos enviados com Sucesso');
          console.log('Buscando Url do Arquivo');
          const urlArquivo = await getDownloadURL(localArquivoStorage);
          Urls[chave] = urlArquivo;
          console.log('Url retornada com sucesso');
        }
      }
      return Urls;
    }
    console.warn('Erro: Arquivo Invalido ou ID de usuario inexisteste. Buscando arquivo padrão');
    const localArquivoStorageErro = ref(storage, `DadosPublicosUsuarios/user.png`);
    console.log('Buscando Url do arquivo Padrao');
    const urlArquivoPadrao = await getDownloadURL(localArquivoStorageErro);
    console.log('Url padrão retornada com sucesso');
    Urls['urlImagem'] = urlArquivoPadrao
    return Urls
  } catch (error: any) {

    const urlErro: Record<string, string> = {}
    console.error("Erro ao enviar arquivo ou retornar url do mesmo:");
    console.error(error.code);
    console.error(error.message);
    console.warn('Tentando buscar arquivo padrao');
    const referenciaPadrao = ref(storage, `user/user.png`);
    const url = await getDownloadURL(referenciaPadrao);
    console.warn('arquivo padrao retornado com sucesso');
    urlErro['urlImagem'] = url
    return urlErro
  }
}



export const adicionar_Dados_FireStore = async (userId: string, colecao: string,
  dadosUsuario: Record<string, any>) => {
  try {
      await setDoc(doc(firestore, colecao, userId),
        {
          ...dadosUsuario

        }
        , { merge: true })
      console.log('dados de Usuario adiconados com sucesso');
  } catch (error: any) {
    console.error('erro ao adicionar arquivos ao FireStore');
    console.error(error.code);
    console.error(error.message)
    alert('Erro ao salvar os arquivos');
  }

}
export const agendamento = async (userId: string, colecao : string, 
  dadosUsuario : Record< string , any>, subColecao: string) => {
    try{
         await setDoc(doc(firestore, colecao, userId, subColecao, dadosUsuario.dia),
        {
          [dadosUsuario.hora]: {
            ...dadosUsuario,
            status: 'Aguardando Confirmação'
          }

        }, { merge: true })
      alert('Agendamento realizado com sucesso')
    }catch (error : any){
      alert (error.message)
    }
}

export const Obter_Dados_Firestore = async (userId: string): Promise<Record<string, any> | undefined> => {
  try {
    let documentoUsuarioFirestore = doc(firestore, 'users', userId);
    const snapshot = await getDoc(documentoUsuarioFirestore);
    if (!snapshot.exists()) {
      documentoUsuarioFirestore = doc(firestore, 'profissionais', userId)
    }
    const consulta = await getDoc(documentoUsuarioFirestore);
    if (!consulta.exists()) {
      console.warn('Documento não encontrado');
      return undefined;
    }

    const dadosUsuario = consulta.data();

    return dadosUsuario;

  } catch (error: any) {
    console.error('Falha ao selecionar os dados. Tente novamente');
    console.error(error.code);
    console.error(error.message);
    alert('Falha ao selecionar os dados. Tente novamente');
  }
}
export const buscarProfissional = async (): Promise<profissionais[]> => {
  const colecao = collection(firestore, 'profissionais');
  const listaUsuarios = await getDocs(colecao);
  const usuarioFiltrado = listaUsuarios.docs.map((usuario) => {
    const dados = usuario.data()
    const usuarioFinal: profissionais =
    {
      id: usuario.id,
      nome: dados.nome ?? '',
      profissao: dados.profissao ?? 'Sem Profissão Definida',
      crp: dados.crp ?? '',
      biografia: dados.biografia ?? '',
      imagem: dados.urlImagem ?? '',
      horarios : [...dados.horariosAtendimento],
      instagram : dados.instagram ?? '',
      whatsapp : dados.whatsapp ?? '',
      preco : dados.preco ?? '',
    }
    console.log(usuarioFinal.instagram)
    return usuarioFinal
  }
  )
  return usuarioFiltrado
}


export const obterSubColeção = (usuarioId: string, subColecao: string, data: string) => {
  const local = doc(firestore, 'profissionais', usuarioId, subColecao, data)

  const dados = getDoc(local)

  return dados

}
