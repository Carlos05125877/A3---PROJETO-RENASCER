import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth,
  GoogleAuthProvider,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword, signInWithPopup,
  signOut, User
} from 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };



export const deslogar = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao deslogar:", error.message);
  }
}

export async function signInComContaGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    return result.user
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    throw error;
  }
}

export async function signInComEmail(email: string, senha: string): Promise<User> {
  try {

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

export async function cadastroUsuario(email: string, senha: string): Promise<User> {
  try {
    auth.languageCode = 'pt'
    const user = await createUserWithEmailAndPassword(auth, email, senha);
    const verificarEmail = user.user;
    await sendEmailVerification(verificarEmail, { url: 'http://localhost:8081/' });
    console.log('email enviado para o usuario');
    alert("Codigo de verificação enviado para o seu e-mail");
    await reload(verificarEmail);
    return verificarEmail;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Este e-mail já está cadastrado.');
    } else if (error.code === 'auth/invalid-email') {
      alert('E-mail inválido.');
    } else {
      alert('Erro ao criar usuário: ' + error.message);
    }
    console.error(error.code);
    console.error(error.message);
    throw (error);
  }
}