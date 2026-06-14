import { calcularSalarioComBonus, calcularVendaFerias  } from "../src/calculosTrabalhista.js";
import assert from 'node:assert';

describe('Testes relacionados ao cálculo do salário com bônus',function()  {

    describe('Teste da adição do bonus',function ()  {

        it('Deve retornar o salário com bônus para um funcionário junior', function() {
        const salario = 2000;
        const senioridade = 'junior';
        const resultado = calcularSalarioComBonus(salario, senioridade);
        assert.equal(resultado, 2050);
        });

        it('Deve retornar o salário com bônus para um funcionário pleno', function() {
        const salario = 3000;
        const senioridade = 'pleno';
        const resultado = calcularSalarioComBonus(salario, senioridade);
        assert.equal(resultado, 3100);
        });

        it('Deve retornar o salário com bônus para um funcionário senior', function() {
        const salario = 5000;
        const senioridade = 'senior';
        const resultado = calcularSalarioComBonus(salario, senioridade);
        assert.equal(resultado, 6000);
        });

        
    });

    describe('Testes de calculo de venda de férias', function(){

        it('Validar que quando vendo 1 dia de férias tendo salário de R$3000, o valor a receber é R$100', function(){
            const salario = 3000;
            const diasAVender = 1;
            const resultado = calcularVendaFerias(salario, diasAVender);
            assert.equal(resultado, 100);

        })


         it('Validar que quando vendo 30 dias de férias tendo salário de R$3000, o valor a receber é R$3000', function(){
            const salario = 3000;
            const diasAVender = 30;
            const resultado = calcularVendaFerias(salario, diasAVender);
            assert.equal(resultado, 3000);

        })

        it('Validar que quando tento vender 0 dias de férias é exibida uma mensagem de erro', function(){

            const salario =3000;
            const diasAVender = 0;
            assert.throws(
                function () {calcularVendaFerias(salario, diasAVender);},
                {
                    message: 'A quantidade de dias a vender deve ser entre 1 e 30'
                }
            );


        })


        it('Validar que quando tento vender 31 dias de férias é exibida uma mensagem de erro', function(){

            const salario =3000;
            const diasAVender = 31;
            assert.throws(
                function () {calcularVendaFerias(salario, diasAVender);},
                {
                    message: 'A quantidade de dias a vender deve ser entre 1 e 30'
                }
            );


        })
    })
}); 
