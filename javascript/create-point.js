document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities);

function ordemAlfabetica(valor) {
    valor.sort(function (a, b) {
        if (a.nome < b.nome) {
            return -1;
        }
        if (a.nome > b.nome) {
            return 1;
        }
        return 0;
    })
}

function populateUFs() {
    let ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(res => res.json())
        .then(states => {
            ordemAlfabetica(states);
            for (let state of states) {
                ufSelect.innerHTML += `<option value="${state.sigla}">${state.nome}</option>`;
            }
        })
}

populateUFs();

function getCities(event) {
    let citySelect = document.querySelector("select[name=city]");
    let ufValue = event.target.value
    let url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    citySelect.disabled = true;

    fetch(url)
        .then(res => res.json())
        .then(cities => {
            ordemAlfabetica(cities);
            for (let city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
            }
            citySelect.disabled = false;
        })
}



axios.get("http://ecoleta-database.herokuapp.com/categories")
    .then(function (response) {
        let itensGrid = document.querySelector(".itens-grid");
        let categories = response.data;

        for (category of categories) {
            let li = document.createElement("li");
            li.setAttribute("data-id", category.id);
            li.innerHTML = `
        <img src="../${category.icon}" alt="${category.name}">
        <span>${category.name}</span>`;

            itensGrid.append(li);
        }

        clickItensGrid();
    })
    .catch(function () {
        alert("Erro ao recuperar as categorias");
    })

let selectedItens = [];
let collectedItens;

function clickItensGrid() {
    let itensToCollect = document.querySelectorAll(".itens-grid li");

    for (let item of itensToCollect) {
        item.addEventListener("click", handleSelectedItem);
    }

    collectedItens = document.querySelector("input[name=itens]");    
}

function handleSelectedItem(event) {
    let itemLi = event.target;
    itemLi.classList.toggle("selected");
    let itemId = itemLi.dataset.id;

    let alreadySelected = selectedItens.findIndex(item => {
        let itemFound = item === itemId;
        return itemFound;
    });

    if (alreadySelected >= 0) {
        let filteredItens = selectedItens.filter(item => {
            let itemIsDifferent = item !== itemId;
            return itemIsDifferent
        })

        selectedItens = filteredItens;
    } else {
        selectedItens.push(itemId);
    }
    collectedItens.value = selectedItens;
}

let form = document.querySelector("form");
form.onsubmit = function(event){
    event.preventDefault();
    let name = document.querySelector("input[name=name]").value;
    let address = document.querySelector("input[name=address]").value;
    let address2 = document.querySelector("input[name=address2]").value;
    let uf = document.querySelector("select[name=uf]").value;
    let city = document.querySelector("select[name=city]").value;

    let send = {
        name:     name,
        address:  address,
        address2: address2,
        uf:       uf,
        city:     city,
        selected: selectedItens
    }

    axios.post("http://ecoleta-database.herokuapp.com/points", {
        data: send
    })
    .then(function(){
        document.querySelector("#modal").classList.toggle("hide");
        let inputs = document.querySelectorAll("input");
        for (input of inputs){
            input.value = "";
        }

        let uf = document.querySelector("select[name=uf]");
        uf.value = "";

        let city = document.querySelector("select[name=city]");
        let option = city.firstChild;
        city.innerHTML = "";
        city.append(option);
        city.disabled = true;

        selectedItens = [];

        let liSelected = document.querySelectorAll(".itens-grid li.selected");
        for (li of liSelected){
            li.classList.toggle("selected");
        }
    })
    .catch(function(error){
        console.log(error);
        alert("Erro ao salvar");
    })
}

let a = document.querySelector("#modal a");
a.onclick = function(){
    document.querySelector("#modal").classList.toggle("hide");
}