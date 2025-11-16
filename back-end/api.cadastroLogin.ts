import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup,
  signOut, User
} from 'firebase/auth';
import { auth, adicionar_Dados_FireStore } from './Api';



export const cadastroUsuario = async (usuario: Record<string, any>): Promise<User> => {
  try {
    const user = await createUserWithEmailAndPassword(auth, usuario.email, usuario.senha);
    const userVerificado = await enviarEmail(user.user);
    const { senha, ...dadosUsuario } = usuario;
    dadosUsuario.criadoEm = new Date().toLocaleString('pt-BR');
    await adicionar_Dados_FireStore(userVerificado.uid, usuario.colecao, usuario)
    return userVerificado;

  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Este e-mail já está cadastrado.');
    } else if (error.code === 'auth/invalid-email') {
      alert('E-mail inválido.');
    } else if (error.code == 'auth/missing-password') {
      alert('Digite uma senha');
    } else {
      alert('Erro ao criar Usuário: ' + error.message);
    }
    console.error(error.code);
    console.error(error.message);
    throw (error);
  }
}
export const enviarEmail = async (user: User) => {
  try{
  await sendEmailVerification(user, { url: 'http://localhost:8081/' })
  console.log('email enviado para o usuario');
  alert("Codigo de verificação enviado para o seu e-mail");
  reload(user);
  return user;
  }catch(error : any){
    console.log(error.message)
    throw(error)
  }
}
export const signInComContaGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user
  } catch (error: any) {
    alert('Erro ao fazer login com o google');
    throw error;
  }
}
export const signInComEmail = async (email: string, senha: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
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

export const deslogar = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Erro ao deslogar:", error.message);
    alert('Erro ao realizar logout')
  }
}

export const esqueciMinhaSenha = async (email: string) => {
  try {
    sendPasswordResetEmail(auth, email);
    alert('Email de redefinição enviado com sucesso')
  } catch (error: any) {
    alert(error.code + error.message)
  }

}