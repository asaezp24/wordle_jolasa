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

    erabHitza = "";
    let saiakeraFila = document.querySelectorAll(".divBlokeak");
    let filaActual = saiakeraFila[saiakeraLekua];
    let letrak = filaActual.querySelectorAll(".blokeak");

    let letrakTek = document.querySelectorAll(".letrak");

    for (let i = 0; i < letrak.length; i++) {
        erabHitza += letrak[i].textContent;
    }

    if (erabHitza.length == letraKopurua) {

        let kont = {};

        for (let i = 0; i < hitza.length; i++) {
            let letra = hitza[i].toLowerCase();

            if (kont[letra]) {
                kont[letra]++;
            } else {
                kont[letra] = 1;
            }
        }

        for (let i = 0; i < hitza.length; i++) {

            if (erabHitza[i].toLowerCase() === hitza[i].toLowerCase()) {

                letrak[i].classList.add("berdea");

                let letraTek2 = [...letrakTek].find(
                    tek => tek.textContent.trim().toLowerCase() === hitza[i].toLowerCase()
                );

                if (letraTek2) {
                    letraTek2.classList.remove("horia", "grisa");
                    letraTek2.classList.add("berdea");
                }

                kont[hitza[i].toLowerCase()]--;
            }
        }

        for (let i = 0; i < hitza.length; i++) {

            if (letrak[i].classList.contains("berdea")) {
                continue;
            }

            let letra = erabHitza[i].toLowerCase();

            let letraTek2 = [...letrakTek].find(
                tek => tek.textContent.trim().toLowerCase() === letra
            );

            if (kont[letra] > 0) {

                letrak[i].classList.add("horia");

                if (letraTek2 && !letraTek2.classList.contains("berdea")) {
                    letraTek2.classList.remove("grisa");
                    letraTek2.classList.add("horia");
                }

                kont[letra]--;

            } else {

                letrak[i].classList.add("grisa");

                if (letraTek2 &&
                    !letraTek2.classList.contains("berdea") &&
                    !letraTek2.classList.contains("horia")) {
                    letraTek2.classList.add("grisa");
                }
            }
        }

        let saiakera = document.getElementById("saiakera").value;

        if (erabHitza.toLowerCase() === hitza.toLowerCase()) {
            alert("Irabazi duzu! Hitza: " + hitza);

        } else if (saiakeraLekua < saiakera - 1) {
            saiakeraLekua += 1;
            blokeLekua = 0;

        } else {
            alert("Galdu duzu. Hitza: " + hitza);
        }

    } else {
        alert("Sartu hitz oso bat!");
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
