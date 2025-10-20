import UsuarioGeral from './UsuariosGeral';


export default class UsuariosProfissional extends UsuarioGeral {
    crm: string;
    biografia: string;

    constructor(userId: string, nome: string,
        cpf: string, email: string,
        telefone: string, dataNascimento: string, 
        foto: File | null, crm: string, biografia: string) 
    {
        super(userId, nome, cpf, email, telefone, dataNascimento, foto);
        this.crm = crm;
        this.biografia = biografia
    }
}
       