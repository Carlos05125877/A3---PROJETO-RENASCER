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

export async function signInComContaGoogle(): Promise<User> {
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

export async function signInComEmail(email: string, senha: string): Promise<User> {
  try {
    console.log('Tentando realizar login com email e senha');
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log('Usuário autenticado com sucesso:', userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      alert("E-mail não cadastrado");
    }
    else if (error.code === "auth/invalid-email") {
      alert("E-mail inválido");
    } else {
      alert("Erro ao fazer login: " + error.message);
    }
    console.error(error.code);
    console.error(error.message)
    throw error;
  }
}

export async function cadastroUsuario(
  email: string,
  senha: string,
  nome: string,
  cpf: string,
  telefone: string,
  dataNascimento: string,

): Promise<User> {
  try {
    auth.languageCode = 'pt'
    console.log('Tentando criar Usuario');
    const user = await createUserWithEmailAndPassword(auth, email, senha);
    console.log('usuario criado com sucesso');

    console.log('enviando email para confirmação');
    const verificarEmail = user.user;
    await sendEmailVerification(verificarEmail, { url: 'http://localhost:8081/' });
    console.log('email enviado para o usuario');
    alert("Codigo de verificação enviado para o seu e-mail");
    await reload(verificarEmail);

    console.log('adicionando dados de usuario ao firestore');
    await setDoc(doc(firestore, 'users', verificarEmail.uid), {
      nome,
      cpf,
      telefone,
      email,
      dataNascimento,
      criadoEm: new Date().toISOString(),
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


export async function enviar_Arquivos_Storage_E_Retornar_Url
  (arquivo: File | null, userId: string | null): Promise<string> {
  try {
    if (arquivo && userId) {
      console.log('enviando arquivos para pasta de Usuario')
      const localArquivoStorage = ref(storage, `DadosPessoaisUsuarios/${userId}/${arquivo.name}`);
      await uploadBytes(localArquivoStorage, arquivo);
      console.log('Arquivos enviados com Sucesso');
      console.log('Buscando Url do Arquivo');
      const urlArquivo = await getDownloadURL(localArquivoStorage);
      console.log('Url retornada com sucesso');
      return urlArquivo;
    }
    console.warn('Erro: Arquivo Invalido ou ID de usuario inexisteste. Buscando arquivo padrão');
    const localArquivoStorageErro = ref(storage, `DadosPublicosUsuarios/user.png`);
    console.log('Buscando Url do arquivo Padrao');
    const urlArquivoPadrao = await getDownloadURL(localArquivoStorageErro);
    console.log('Url padrão retornada com sucesso');
    return urlArquivoPadrao
  } catch (error: any) {
    console.error("Erro ao enviar arquivo ou retornar url do mesmo:");
    console.error(error.code);
    console.error(error.message);
    console.warn('Tentando buscar arquivo padrao');
    const referenciaPadrao = ref(storage, `user/user.png`);
    const urlErro = await getDownloadURL(referenciaPadrao);
    console.warn('arquivo padrao retornado com sucesso');
    return urlErro
  }
}



export async function adicionar_Dados_FireStore(userId: string, dadosUsuario : Record<string, any>) {
  try {
    console.log('adiconando dados de usuario ao FireStore');

    await setDoc(doc(firestore, 'users', userId),
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

export async function Obter_Dados_Firestore(userId: string): Promise<Record<string, any> | undefined> {
  try {
    const documentoUsuarioFirestore = doc(firestore, 'users', userId);

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

