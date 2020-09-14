let url = window.location.href;
let search = url.split("?search=")[1];

axios.get("http://ecoleta-database.herokuapp.com/points?q=" + search)
    .then(function (response) {
        console.log(response.data);

        if (response.data.length === 0) {
            document.querySelector("main").innerHTML = "<h3>Nenhum ponto encontrado </h3>";
        } else {
            document.querySelector("span#pontos").innerText = response.data.length;
            let cards = document.querySelector(".cards");

            for (item of response.data) {
                let card = document.createElement("div")
                card.classList.add("card")
                card.innerHTML = `
                    <div class="image"></div>
                    <h1>${item.data.name}</h1>
                    <h3></h3>
                    <p>
                        ${item.data.address} ${item.data.address2} <br/>
                        ${item.data.city}, ${item.data.uf}
                    </p>
            `
                cards.append(card);
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    })


{/* <div class="card">
                            
                        </div> */}