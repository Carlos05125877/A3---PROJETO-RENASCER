

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

export function verificarCpf(cpf: string){
    if (verificarPrimeiroDigito(cpf) && verificarSegundoDigito(cpf)){
        return true;
    }
    return false;
}


