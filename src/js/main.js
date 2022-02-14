'use strict';

const $container = document.querySelector('.container');
const $search = document.querySelector('#search');
const $content = document.querySelector('.content');
const $contentError = document.querySelector('.content__error');
const $textValor = document.querySelector('.text__valor');
const $textId = document.querySelector('.text__id');
const $textResult = document.querySelector('.text__result');
const $textData = document.querySelector('.text__data');
const $textErrorDetail = document.querySelector('.text__error__detail');
const $textErrorSearch = document.querySelector('.text__error__search');


const getData = () => {
    fetch('app/dados.json')
        .then(res => res.json())
        .then(data => (openData(data)))
        .catch(error => console.log('Erro: ', error));
};


const openData = (data) => {
   
    $container.addEventListener('click', (e) => {
        e.preventDefault();
        if($search.value !== ''){
            if(e.target.className === 'submit'){
                const input =  $search.value.trim();

                const numero = data.encomendas.map((el) => el);
                
                const numeroFilter = numero.filter((item) => item.numero === input);
               
                if(numeroFilter.length === 0){                     
                    errorDisplay();
                }
                else{
                    const { id,numero,valor,entregue,data,cliente } = numeroFilter[0];
                    display( {id,valor,entregue,data,cliente} );
                }
            } 
        }
    });
}


const display = ( { valor,entregue,data,cliente } ) => {
    const newData = new Date(data);
    const dataFormat = newData.toLocaleDateString('pt-BR');
    
    $content.setAttribute('style','display: block;');
    $contentError.setAttribute('style','display: none;');

    $textId.textContent = `${cliente.id} - ${cliente.nome}`;
    $textValor.textContent = `R$ ${valor.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;
    $textResult.textContent = entregue === true ? 'Entregue' : 'Entregar';
    $textData.textContent = `${dataFormat}`;
}


const errorDisplay = () => {

    $content.setAttribute('style','display: none;');
    $contentError.removeAttribute('style','display: none;');

    $textErrorDetail.textContent = 'Encomenda não encontrada!';
    $textErrorSearch.textContent = 'Procure novamente';
}


getData();