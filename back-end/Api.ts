import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth,
  GoogleAuthProvider,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword, signInWithPopup,
  signOut, User
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth };



export const deslogar = async (): Promise<void> => {
  try {
    console.log('Tentando deslogar usuario');
    await signOut(auth);
    console.log("Usuário deslogado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao deslogar:", error.message);
    alert('Erro ao realizar logout')
  }
}

export const signInComContaGoogle = async (): Promise<User> => {
  try {
    console.log('Tentando realizar login com conta google');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log('Login realizado com sucesso');
    return result.user
  } catch (error: any) {
    console.error('erro ao realizar login com o google');
    alert('Erro ao fazer login com o google');
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    throw error;
  }
}

export const signInComEmail = async (email: string, senha: string) : Promise<User> => {
  try {
    console.log('Tentando realizar login com email e senha');
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log('Usuário autenticado com sucesso:', userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/wrong-password") {
      alert("Senha incorreta");
    }
    else if (error.code === "auth/invalid-email") {
      alert("E-mail inválido");
    }
    else if (error.code === "auth/user-not-found") {
      alert("E-mail não cadastrado");
    }
    else {
      alert("Erro ao fazer login: " + error.message);
    }
    console.error(error.code);
    console.error(error.message)
    throw error;
  }
}


export const cadastroUsuario = async (usuario: Record<string, any>) : Promise<User> => {
  try {
    auth.languageCode = 'pt'
    console.log('Tentando criar Usuario');
    const user = await createUserWithEmailAndPassword(auth, usuario.email, usuario.senha);
    console.log('usuario criado com sucesso');

    console.log('enviando email para confirmação');
    const verificarEmail = user.user;
    await sendEmailVerification(verificarEmail, { url: 'http://localhost:8081/' });
    console.log('email enviado para o usuario');
    alert("Codigo de verificação enviado para o seu e-mail");
    await reload(verificarEmail);

    console.log('adicionando dados de usuario ao firestore');
    const { senha, ...dadosUsuario } = usuario;
    dadosUsuario.criadoEm = new Date().toISOString();
    await setDoc(doc(firestore, usuario.colecao, verificarEmail.uid), {
      dadosUsuario,
    }, { merge: true });
    console.log('Dados adicionados com sucesso ao FireStore');
    return verificarEmail;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Este e-mail já está cadastrado.');
    } else if (error.code === 'auth/invalid-email') {
      alert('E-mail inválido.');
    } else if (error.code == 'auth/missing-password') {
      alert('Digite uma senha');
    } else {
      alert('Erro ao criar usuário: ' + error.message);
    }
    console.error(error.code);
    console.error(error.message);
    throw (error);
  }
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



export const adicionar_Dados_FireStore = async (userId: string, colecao : string, dadosUsuario: Record<string, any>) => {
  try {
    console.log('adiconando dados de usuario ao FireStore');

    await setDoc(doc(firestore, colecao, userId),
      dadosUsuario
      , { merge: true })
    console.log('dados de Usuario adiconados com sucesso');

  } catch (error: any) {
    console.error('erro ao adicionar arquivos ao FireStore');
    console.error(error.code);
    console.error(error.message)
    alert('Erro ao salvar os arquivos');
  }

}

export const Obter_Dados_Firestore = async (userId: string): Promise<Record<string, any> | undefined> => {
  try {
    let documentoUsuarioFirestore = doc(firestore, 'users', userId);
    const snapshot =  await getDoc(documentoUsuarioFirestore);
    if(!snapshot.exists()){
      documentoUsuarioFirestore = doc(firestore, 'profissionais', userId)
    }
    console.log('Acessando dados do usuário...');
    const consulta = await getDoc(documentoUsuarioFirestore);


    if (!consulta.exists()) {
      console.warn('Documento não encontrado');
      return undefined;
    }

    const dadosUsuario = consulta.data();

    console.log('Dados selecionados com sucesso:', dadosUsuario);
    return dadosUsuario;

  } catch (error: any) {
    console.error('Falha ao selecionar os dados. Tente novamente');
    console.error(error.code);
    console.error(error.message);
    alert('Falha ao selecionar os dados. Tente novamente');
  }
}

