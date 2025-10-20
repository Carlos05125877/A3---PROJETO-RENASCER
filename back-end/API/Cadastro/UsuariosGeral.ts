import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebaseConfig';


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };


export default class UsuarioGeral {
    userId: string
    nome: string;
    cpf: string;
    telefone: string
    email: string
    dataNascimento: string
    foto: File | null

    constructor(userId: string, nome: string,
        cpf: string, email: string,
        telefone: string, dataNascimento:
            string, foto: File | null) {
        this.userId = userId;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.foto = foto

    }
}