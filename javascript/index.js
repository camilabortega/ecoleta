let buttonSearch = document.querySelector("#page-home main a");
let modal = document.querySelector("#modal");
let close = document.querySelector("#modal .header a");

buttonSearch.addEventListener("click", () => {
    modal.classList.remove("hide");
})

close.addEventListener("click", () => {
    modal.classList.add("hide");
})