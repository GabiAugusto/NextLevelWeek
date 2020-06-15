function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {
        for( const state of states ) {
            ufSelect.innerHTML += `<option value ="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => {
      
        for( const city of cities ) {
            citySelect.innerHTML += `<option value ="${city.nome}">${city.nome}</option>`
        }
        citySelect.disabled = false
    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


//Itens de Coleta
//pegar todos os lis
const itemsToCollect = document.querySelectorAll(".items-grid li")

for(const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

const colletedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event){
    //adicionar ou remover uma classe com javascript
    //toggle adiciona ou remove de acordo com o que ja existe

    const itemLi = event.target
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

console.log('ITEM ID: ', itemId)
    

    //verificar se existem itens selecionados, se sim quais são os itens
    // pegar os itens

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId //comparando e ao encontrar retorna true or false
        return itemFound 
    })

    //se ja estiver selecionado, tirar da seleção

    if( alreadySelected >= 0 ){
        //tirar da seleção
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId 
            return itemIsDifferent 
        })

        selectedItems = filteredItems

    }
    else{
        //se não tiver selecionado, adicionar a seleção
        selectedItems.push(itemId)
    }
     
    console.log('selectedItems: ', selectedItems)
    //atualizar o campo escondido com os itens selecionados
    colletedItems.value = selectedItems
    
}
   