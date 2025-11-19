import { firestore } from "@/back-end/Api";
import { collection, getDocs, query, where } from "firebase/firestore";

function verificarPrimeiroDigito(cpf: string) {
    let soma: number = 0;
    let digitoVerificador = Number(cpf[9]); //0
    let valorDaMultiplicacao = 10;
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * valorDaMultiplicacao;
        valorDaMultiplicacao--;
    }
    let resultado = soma % 11;
    if ((resultado < 2 && digitoVerificador === 0) || (11 - resultado === digitoVerificador)) {
        return true;
    }
    return false;
}
function verificarSegundoDigito(cpf: string) {
    let soma: number = 0;
    let digitoVerificador = Number(cpf[10]); //5
    let valorDaMultiplicacao = 11;
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * valorDaMultiplicacao;
        valorDaMultiplicacao--;
    }
    let resultado = soma % 11;
    if ((resultado < 2 && digitoVerificador === 0) || (11 - resultado === digitoVerificador)) {
        return true;
    }
    return false;
}

export function verificarCpf(cpf: string) {
    for (let i = 1; i < 11; i++) {
        if (cpf[i] !== cpf[i - 1]) {
            break
        }
        if (i === 10) {
            return false
        }
    }

    if (verificarPrimeiroDigito(cpf) && verificarSegundoDigito(cpf)) {
        return true;
    }
    return false;
}

export const cpfExistente = async (cpf: string) => {
    const dadosUsuarios = collection(firestore, 'users')
    const dadosProfissionais = collection(firestore, 'profissionais')

    const minhaQuery = query(dadosUsuarios, where('cpf', '==', cpf))
    const minhaQuery2 = query(dadosProfissionais, where('cpf', '==', cpf))

    const documento = await getDocs(minhaQuery)
    const documento2 = await getDocs(minhaQuery2)

    return !documento.empty || !documento2.empty


}





