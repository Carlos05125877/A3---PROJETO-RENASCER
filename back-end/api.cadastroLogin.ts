import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup,
  signOut, User
} from 'firebase/auth';
import { adicaoDadosFirestore, auth, criarArquivoStorage } from './Api';



const cadastroUsuario = async (usuario: Record<string, any>): Promise<User> => {
  try {
    const user = await createUserWithEmailAndPassword(auth, usuario.email, usuario.senha);
    const userVerificado = await enviarEmail(user.user);
    const { senha,confirmarSenha, ...dadosUsuario } = usuario;
    dadosUsuario.criadoEm = new Date().toLocaleString('pt-BR');
    await adicaoDadosFirestore(userVerificado.uid, usuario.colecao, dadosUsuario)
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
 const enviarEmail = async (user: User) => {
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
export async function configuracaoUsuario(dados: Record<string, string | string[]>, imagem: File | null, 
  localSalvamento : string) {

    if (dados.senha !== dados.confirmarSenha) {
        return false;
    }
    try {
        const user = await cadastroUsuario(
           dados);
        const urlImagem = await criarArquivoStorage(
            { 'urlImagem': imagem }, user.uid)

        adicaoDadosFirestore(user.uid, localSalvamento, urlImagem);
    } catch (error: any) {
        console.error(error.code);
        console.error(error.message);
    }
}

 const autenticacaoGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user
  } catch (error: any) {
    alert('Erro ao fazer login com o google');
    throw error;
  }
}
export const loginComGoogle = async (bloquearBotaoGoogle : React.RefObject<boolean>) => {
        if (bloquearBotaoGoogle.current === true) return;

        try {
            bloquearBotaoGoogle.current = true

            const user = await autenticacaoGoogle();
            return user
        } catch (error: any) {
            console.error(error.code);
            console.error(error.message);
        } finally {
            bloquearBotaoGoogle.current = false;
        }
    }
export const loginComEmailSenha = async (email: string, senha: string): Promise<User> => {
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