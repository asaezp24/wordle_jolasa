"use strict";

/*function froga() {
    console.log("kaixo");
}*/

let jolasa = document.getElementById("jolasa").style.display = 'none';

function erantzuna() {

    let letraKopurua = document.getElementById("letra").value;

    //console.log(letraKopurua);

    let apiUrl = "https://random-word-api.herokuapp.com/word?length=" + letraKopurua + "&lang=es";

    fetch(apiUrl)
        .then((respuesta) => {
            console.log(respuesta);
            return respuesta.json();
        })
        .then((resultado) => {
            console.log(resultado);
        })
        .catch((error) => {
            console.log(error);
        });
}

function blokeak() {
    let saiakera = document.getElementById("saiakera").value;
    let letraKopurua = document.getElementById("letra").value;
    console.log(saiakera);
    console.log(letraKopurua);

    let bloke = document.getElementById("blokeak");

    for (let i = 0; i < saiakera; i++) {
        let div = document.createElement("div");
        div.className = "divBlokeak";
        bloke.appendChild(div);
        for (let i = 0; i < letraKopurua; i++) {
            let span = document.createElement("span");
            span.textContent = "-A-";
            span.className = "blokeak";
            div.appendChild(span);
        }
    }
}

function jokoaHasi() {
    let sarrera = document.getElementById("sarrera");
    let jolasa = document.getElementById("jolasa");

    if (sarrera.style.display === "none") {
        sarrera.style.display = "block";
        jolasa.style.display = "none";
    } else {
        sarrera.style.display = "none";
        jolasa.style.display = "block";
    }

    erantzuna();

    blokeak();

}
