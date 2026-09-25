"use strict";

let jolasa = document.getElementById("jolasa").style.display = "none";
let letraKopurua = document.getElementById("letra").value;
let blokeLekua = 0;
let saiakeraLekua = 0;
let hitza = '';
let erabHitza = '';

function erantzuna() {

    let apiUrl = "https://random-word-api.herokuapp.com/word?lang=es&length=" + letraKopurua;

    fetch(apiUrl)
        .then((respuesta) => {
            console.log(respuesta);
            return respuesta.json();
        })
        .then((resultado) => {
            console.log(resultado);
            console.log(resultado[0]);
            hitza = resultado[0];
        })
        .catch((error) => {
            console.log(error);
        });

}

function letraHartu(elemento) {

    let letra = elemento.textContent;
    let blokeak = document.querySelectorAll(".blokeak");

    let letraKopurua = parseInt(document.getElementById("letra").value);

    if (blokeLekua >= letraKopurua) {
        return;
    }

    let posizioa = saiakeraLekua * letraKopurua + blokeLekua;

    blokeak[posizioa].textContent = letra;

    blokeLekua++;
}


function ezabatu() {

    let blokeak = document.querySelectorAll(".blokeak");

    if (blokeLekua <= 0) {
        return;
    }

    blokeLekua--;

    let letraKopurua = parseInt(document.getElementById("letra").value);
    let posizioa = saiakeraLekua * letraKopurua + blokeLekua;

    blokeak[posizioa].textContent = "";
}

function enter() {

    let saiakeraFila = document.querySelectorAll(".divBlokeak");

    let filaActual = saiakeraFila[saiakeraLekua];

    let letrak = filaActual.querySelectorAll(".blokeak");

    for (let i = 0; i < letrak.length; i++) {
        erabHitza += letrak[i].textContent;
    }

    //console.log(erabHitza);
    //console.log(hitza);

    for (let i = 0; i < hitza.length; i++) {
        if (erabHitza[i].toLowerCase() === hitza[i].toLowerCase()) {
            console.log("verde");
        } else if (hitza.toLowerCase().includes(erabHitza[i].toLowerCase())) {
            console.log("amarillo");
        } else {
            console.log("gris");
        }
    }

}


function blokeak() {

    let saiakera = document.getElementById("saiakera").value;
    let letraKopurua = document.getElementById("letra").value;

    let bloke = document.getElementById("blokeak");

    bloke.innerHTML = "";

    for (let i = 0; i < saiakera; i++) {

        let div = document.createElement("div");
        div.className = "divBlokeak";
        bloke.appendChild(div);

        for (let j = 0; j < letraKopurua; j++) {

            let span = document.createElement("span");
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

    letraKopurua = document.getElementById("letra").value;
    blokeLekua = 0;
    saiakeraLekua = 0;

    erantzuna();
    blokeak();

}
