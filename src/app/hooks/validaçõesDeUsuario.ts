import { cpfExistente, verificarCpf } from '@/back-end/API/Validações/validarCPF';
import { useEffect, useState } from 'react';

export function useEmailInvalido(email: string) {
    const [emailInvalido, setEmailInvalido] = useState(false)
    useEffect(() => {
        if (email === '') {
            setEmailInvalido(false);
            return;
        }
        const verificador = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        setEmailInvalido(!verificador.test(email));
        return;
    }, [email])
    return [emailInvalido] as const
};

export  function useCpfInvalido(cpf: string) {
    const [cpfInvalido, setCpfInvalido] = useState(false);
    const [cpfCadastrado, setCpfCadastrado] = useState(false);

    useEffect(() => {
        const validadorCpf = async () => {
            const cpfNumeros = cpf.replace(/\D/g, '');
            setCpfInvalido(false);
            setCpfCadastrado(false);
            if (cpfNumeros.length < 11) {
                return
            }
            const invalido = !verificarCpf(cpfNumeros);
            if (invalido) {
                setCpfInvalido(true);
                return
            }
            const existe = await cpfExistente(cpf);
            if (existe) {
                setCpfCadastrado(true)
                return
            }
            return true
        }
        validadorCpf();
    }, [cpf])
    return [cpfInvalido, cpfCadastrado]
};
export function verificarDados(cpfInvalido: boolean, emailInvalido: boolean, cpfCadastrado: boolean,
    crp: string, cpf: string, email: string, senha: string, confirmarSenha: string,
    nome: string, dataNascimento: string) {

    const validandoDados =
        !cpfCadastrado &&
        !cpfInvalido &&
        !cpfInvalido &&
        !emailInvalido &&
        crp != '' &&
        cpf.length >= 14 &&
        email !== '' &&
        senha !== '' &&
        confirmarSenha !== '' &&
        nome !== '' &&
        dataNascimento !== '' &&
        senha === confirmarSenha;

    return validandoDados

}

export function useImagemLocal(imagem: File | null) {
const [url, setUrl] = useState('')
    useEffect(() => {
        if (!imagem) return

        setUrl(URL.createObjectURL(imagem))

    }, [imagem])
    return [url] as const
}

