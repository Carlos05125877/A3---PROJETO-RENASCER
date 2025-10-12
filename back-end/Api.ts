import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { app, auth, provider };

export async function signInComContaGoogle() : Promise <User>{
  try{
  const result = await signInWithPopup(auth, provider);
    return result.user
  }catch(error:any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    throw error;
  }
}

export async function signInComEmail(email: string, senha: string): Promise<User> {
  try {

   const userCredential= await signInWithEmailAndPassword(auth, email, senha);
    console.log('Usuário autenticado com sucesso:', userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    const errorCode = error.code ?? 'unknown';
    const errorMessage = error.message ?? String(error);
    console.error('Erro ao autenticar usuário:', errorCode, errorMessage);
    throw error;
  }
}