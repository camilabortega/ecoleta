document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities);

function ordemAlfabetica(valor){
    valor.sort(function(a, b){
        if(a.nome < b.nome){
            return -1;
        }
        if(a.nome > b.nome){
            return 1;
        }
        return 0;
    })
}

function populateUFs() {
    var ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json())
    .then(states => {
        ordemAlfabetica(states);
        for(var state of states){
            ufSelect.innerHTML += `<option value="${state.sigla}">${state.nome}</option>`;
        }
    })
}

populateUFs();

function getCities(event) {
    var citySelect = document.querySelector("select[name=city]");
    var ufValue = event.target.value
    var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    citySelect.disabled = true;

    fetch(url)
    .then(res => res.json())
    .then(cities => {
        ordemAlfabetica(cities);
        for(var city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
        }
        citySelect.disabled = false;
    })
}

var itensToCollect = document.querySelectorAll(".itens-grid li");

for(var item of itensToCollect) {
    item.addEventListener("click", handleSelectedItem);
}

function handleSelectedItem(event) {
    var itemLi = event.target;
    itemLi.classList.toggle("selected");
    var itemId = itemLi.dataset.id;
}