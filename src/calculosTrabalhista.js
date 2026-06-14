/*
    Preciso de uma função capaz de receber o salário de um funcionário e a 
    sua senioridade atual (junior, pleno ou senior). A função terá que aplicar um bônus confirme a senioridade:
    junior = R$ 50, pleno = R$ 100 e senior = R$ 1000. A função deve retornar o valor do salário
    já com o bônus embutido.

    1. Entradas
    - Salário
    - Senioridade 
    2. Regras (com relação as entradas)
    - Senioridade pode ser junior, pleno ou senior

    3. Processamento
    - Se a senioridade for junior, salário + 50
    - Se a senioridade for pleno, salário + 100
    - Se a senioridade for senior, salário + 1000

    4. Saídas
    - Salário com bônus aplicado
    */

 export function calcularSalarioComBonus(salario, senioridade){
    if(senioridade == 'junior'){
        return salario + 50;

    }
    if(senioridade == 'pleno'){
        return salario + 100;

    }
    if(senioridade == 'senior'){
        return salario + 1000;

    }
}

/*
    Preciso de uma função que seja capaz de permitir que o usuário venda dias de suas férias. 
    Basicamente, os dias de férias são calculados com base no valor bruto do salário mensal (sempre contado como 30, independente da quantidade
     de dias do mês). Logo, um funcionário que ganha 3000 por mês e quer vender 1 dia de férias, vai receber R$100 pela venda. 

    1. Entradas
    - Salário Mensal
    - Dias a Vender

    2. Regras (com relação as entradas)
    - Dias estão entre 1 e 30 (inclusive)
    - Salário é um número decimal positivo

    3. Processamento
    - Salário Bruto / 30 = Salário Diário
    - Salário Diário * Quantidade de dias vendidos

    4. Saídas
    - Valor a Receber pela Venda dos Dias de Férias
*/

 export function calcularVendaFerias(salario, diasAVender){
    if(diasAVender <1 || diasAVender > 30){
        throw new Error('A quantidade de dias a vender deve ser entre 1 e 30');
    }
    const salarioDia =salario/30;
    return salarioDia * diasAVender;

 

}