import UsuarioGeral from './UsuariosGeral';

export default class UsuariosCliente extends UsuarioGeral {

    constructor(userId: string, nome: string,
        cpf: string, email: string,
        telefone: string, dataNascimento: string,
        foto: File) {

        super(userId, nome, cpf, email, telefone, dataNascimento, foto)

    }
}