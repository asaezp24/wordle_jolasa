"use strict";

document.getElementById("jolasa").style.display = "none";

let letraKopurua = parseInt(document.getElementById("letra").value);
let blokeLekua = 0;
let saiakeraLekua = 0;
let hitza = "";
let erabHitza = "";
let saiakerak = [];
let jokoaBukatu = false;

/* API deia */
async function erantzuna() {
    let apiUrl = "https://random-word-api.herokuapp.com/word?lang=es&length=" + letraKopurua;

    try {
        let respuesta = await fetch(apiUrl);
        let resultado = await respuesta.json();

        hitza = resultado[0].toUpperCase();

        console.log(hitza);
    } catch (error) {
        console.log(error);
        alert("Errorea hitza lortzerakoan.");
    }
}

/* Aukeratutako letra gehitu blokean */
function letraHartu(elemento) {
    if (jokoaBukatu) {
        return;
    }

    let letra = elemento.textContent;
    let blokeak = document.querySelectorAll(".blokeak");

    /* Letra kopurua ezin da bloke kantitatearen baino gehiago izan */
    if (blokeLekua >= letraKopurua) {
        return;
    }

    /* Kalkulua jakiteko zein blokean jarri letra */
    let posizioa = saiakeraLekua * letraKopurua + blokeLekua;

    blokeak[posizioa].textContent = letra;

    blokeLekua++;
}

/* Ezabatu funtzioa */
function ezabatu() {
    if (jokoaBukatu) {
        return;
    }

    let blokeak = document.querySelectorAll(".blokeak");

    if (blokeLekua <= 0) {
        return;
    }

    blokeLekua--;

    let posizioa = saiakeraLekua * letraKopurua + blokeLekua;

    blokeak[posizioa].textContent = "";
}

/* Lerroko letra guztiak bildu saiakera osatzeko */
function lortuSaiakera() {
    let saiakeraFila = document.querySelectorAll(".divBlokeak");
    let filaActual = saiakeraFila[saiakeraLekua];
    let letrak = filaActual.querySelectorAll(".blokeak");

    let hitzaSaiakera = "";

    letrak.forEach(letra => {
        hitzaSaiakera += letra.textContent;
    });

    return {
        hitza: hitzaSaiakera,
        letrak: letrak
    };
}

/* Koloreak gehitu blokeetara */
function koloreakAplikatu(erabilitakoHitza, letrak) {
    let kont = {};
    let letrakTek = document.querySelectorAll(".letrak");

    /* Letra bakoitza hitz egokian zenbat aldiz agertzen den kontatu */
    for (let i = 0; i < hitza.length; i++) {
        let letra = hitza[i].toLowerCase();

        if (kont[letra]) {
            kont[letra]++;
        } else {
            kont[letra] = 1;
        }
    }

    /* Ondo badago berdea jarri */
    for (let i = 0; i < hitza.length; i++) {
        if (erabilitakoHitza[i].toLowerCase() === hitza[i].toLowerCase()) {
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

    /* Letra badago baina ez lekuan horia jarri */
    for (let i = 0; i < hitza.length; i++) {
        if (letrak[i].classList.contains("berdea")) {
            continue;
        }

        let letra = erabilitakoHitza[i].toLowerCase();

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
            /* Letra ez badago grisa jarri */
            letrak[i].classList.add("grisa");

            if (
                letraTek2 &&
                !letraTek2.classList.contains("berdea") &&
                !letraTek2.classList.contains("horia")
            ) {
                letraTek2.classList.add("grisa");
            }
        }
    }
}

/* Partida gorde localStoragen */
function partidaGorde(irabazi) {
    let partidak = JSON.parse(localStorage.getItem("partidak")) || [];

    let partida = {
        hitza: hitza,
        saiakerak: saiakerak,
        data: new Date().toLocaleString("es-ES"),
        irabazi: irabazi
    };

    partidak.push(partida);

    /* Bakarrik azken 10 partida gorde */
    if (partidak.length > 10) {
        partidak.shift();
    }

    localStorage.setItem("partidak", JSON.stringify(partidak));
}

/* Partida amaitu, gorde eta ikusi historiala */
function jokoaAmaitu(irabazi) {
    jokoaBukatu = true;

    partidaGorde(irabazi);

    document.getElementById("jolasa").style.display = "none";
    document.getElementById("blokeak").style.display = "none";

    ikusiHistoriala();

    /* Alerta ikusi */
    if (irabazi) {
        alert("Irabazi duzu! Hitza: " + hitza);
    } else {
        alert("Galdu duzu. Hitza: " + hitza);
    }
}

/* Konprobatu saiakera eta irabazi duen ala ez */
function enter() {
    if (jokoaBukatu) {
        return;
    }

    let saiakera = lortuSaiakera();

    erabHitza = saiakera.hitza;

    /* Hitza luzera desegokia bada */
    if (erabHitza.length !== letraKopurua) {
        alert("Sartu hitz oso bat!");
        return;
    }

    saiakerak.push(erabHitza);

    /* Koloreak */
    koloreakAplikatu(erabHitza, saiakera.letrak);

    let saiakeraKopurua = parseInt(document.getElementById("saiakera").value);

    /* Hitza konparatu eta berdina da */
    if (erabHitza.toLowerCase() === hitza.toLowerCase()) {
        jokoaAmaitu(true);
    } else if (saiakeraLekua < saiakeraKopurua - 1) {
        /* Hitza ezberdina baina saiakerak daude */
        saiakeraLekua++;
        blokeLekua = 0;
    } else {
        /* Hitza ezberdina eta ez daude saiakerarik */
        jokoaAmaitu(false);
    }
}

/* Sortu blokeak */
function blokeak() {
    let saiakera = document.getElementById("saiakera").value;
    let letraKopurua = document.getElementById("letra").value;

    let bloke = document.getElementById("blokeak");

    bloke.innerHTML = "";

    /* Fila kopurua */
    for (let i = 0; i < saiakera; i++) {
        let div = document.createElement("div");
        div.className = "divBlokeak";
        bloke.appendChild(div);

        /* Bloke kopurua (hitz luzera) */
        for (let j = 0; j < letraKopurua; j++) {
            let span = document.createElement("span");
            span.className = "blokeak";
            div.appendChild(span);
        }
    }
}

/* Garbitu dena */
function garbituTaula() {
    document.querySelectorAll(".letrak").forEach(tecla => {
        tecla.classList.remove("berdea", "horia", "grisa");
    });

    document.getElementById("blokeak").style.display = "flex";
}

/* Jokoa hasi */
function jokoaHasi() {
    let sarrera = document.getElementById("sarrera");
    let jolasa = document.getElementById("jolasa");

    sarrera.style.display = "none";
    jolasa.style.display = "block";

    letraKopurua = parseInt(document.getElementById("letra").value);
    blokeLekua = 0;
    saiakeraLekua = 0;
    erabHitza = "";
    saiakerak = [];
    jokoaBukatu = false;

    garbituTaula();
    blokeak();
    erantzuna();

    document.getElementById("historiala").innerHTML = "";
}

/* Ikusi historiala */
function ikusiHistoriala() {
    let historiala = document.getElementById("historiala");
    let partidak = JSON.parse(localStorage.getItem("partidak")) || [];

    historiala.innerHTML = "";

    if (partidak.length === 0) {
        return;
    }

    let titulua = document.createElement("h2");
    titulua.textContent = "Azken 10 jolasak";
    historiala.appendChild(titulua);

    /* Partidak azkenetik lehenengora */
    partidak.slice().reverse().forEach(partida => {
        let partidaDiv = document.createElement("div");
        partidaDiv.className = "partida";

        let hitzaP = document.createElement("p");
        hitzaP.textContent = "Hitza: " + partida.hitza;

        let saiakerakP = document.createElement("p");
        saiakerakP.textContent = "Saiakerak: " + partida.saiakerak.join(", ");

        let dataP = document.createElement("p");
        dataP.textContent = "Data: " + partida.data;

        let emaitzaP = document.createElement("p");

        if (partida.irabazi) {
            emaitzaP.textContent = "Irabazi";
            emaitzaP.className = "irabazi";
        } else {
            emaitzaP.textContent = "Galdu";
            emaitzaP.className = "galdu";
        }

        partidaDiv.appendChild(hitzaP);
        partidaDiv.appendChild(saiakerakP);
        partidaDiv.appendChild(dataP);
        partidaDiv.appendChild(emaitzaP);

        historiala.appendChild(partidaDiv);
    });


    /* Botoia berriro jolastu sortu */
    let berriroBotoia = document.createElement("button");
    berriroBotoia.textContent = "Berriro jolastu";
    berriroBotoia.className = "botoia";

    berriroBotoia.addEventListener("click", () => {
        document.getElementById("sarrera").style.display = "block";
        document.getElementById("historiala").innerHTML = "";
    });

    historiala.appendChild(berriroBotoia);
}

/* Hasi partida berria */
document.getElementById("jolastuBotoia").addEventListener("click", jokoaHasi);

/* Teklatu birtuala */
document.querySelectorAll(".letrak").forEach(tecla => {
    tecla.addEventListener("click", () => {
        if (tecla.id === "enterBotoia") {
            enter();
        } else if (tecla.id === "ezabatuBotoia") {
            ezabatu();
        } else {
            letraHartu(tecla);
        }
    });
});

/* Teklatu fisikoa */
document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        enter();
    } else if (event.key === "Backspace" || event.key === "Delete") {
        ezabatu();
    } else if (/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/.test(event.key)) {
        let letra = event.key.toUpperCase();

        let tekla = [...document.querySelectorAll(".letrak")].find(
            tecla => tecla.textContent.trim() === letra
        );

        if (tekla) {
            letraHartu(tekla);
        }
    }
});

/* Historiala ikusi */
ikusiHistoriala();
