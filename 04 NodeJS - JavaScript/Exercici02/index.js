const fs = require('fs').promises
const readline = require('readline').promises

let partida = {
    arxiu: "",
    caselles_hit: [],
    caselles_amb_tresor: [],
    trampa: false,
    tirades: 32,
    tresors: 0,
}

let matriu = [[" ","0","1","2","3","4","5","6","7"],
            ["A","·","·","·","·","·","·","·","·"],
            ["B","·","·","·","·","·","·","·","·"],
            ["C","·","·","·","·","·","·","·","·"],
            ["D","·","·","·","·","·","·","·","·"],
            ["E","·","·","·","·","·","·","·","·"],
            ["F","·","·","·","·","·","·","·","·"]]

let missatge = ""

async function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    console.clear()

    generaTresors()

    while(true){
        
        dibuixa_matriu(matriu)

        if (missatge != "") {
            console.log(missatge)
        }
        const comanda = await rl.question("Escriu una comanda: ")

        if (typeof comanda === "string" && comanda.length > 0) {
            let x = comanda.split(" ")
            missatge = ""
            if (x[0] === "ajuda") {
                console.clear()
                error = ""
                while (true){
                    dibuixa_ajuda()
                    if (error != "") {
                        console.log(error)
                    }
                    const surt = await rl.question("Escriu sortir per tornar enrere: ")
                    if (surt === "sortir") {
                        break
                    } else {
                        error = "Torna a provar."
                    }
                }
            } else if (x[0] === "sortir"){
                break
            } else if (x[0] === "puntuacio"){
                missatge = "Tresors trobats: " + partida.tresors + "/16 | Tirades restants: " + partida.tirades
            } else if (x[0] === "activar" && x[1] === "trampa"){
                activartrampa()
            } else if (x[0] === "desactivar" && x[1] === "trampa"){
                desactivartrampa()
            } else if (x[0] === "casella"){
                missatge = JSON.stringify(partida.caselles_hit);
            } else if (x[0] === "destapar"){
                afegirCasellaHit(x[1])
            }
        }

        console.clear()
    }

    rl.close() // Tancar la lectura
}

function activartrampa(){
    if (partida.trampa != true){
        partida.trampa = true
    } else {
        missatge = "Ya esta activada la trampa"
    }
}

function desactivartrampa(){
    if (partida.trampa != false){
        partida.trampa = false
    } else {
        missatge = "Ya esta desactivada la trampa"
    }
}



function dibuixa_matriu(matriu){
    for (let array of matriu){
        row = ""
        for (let x of array) {
            row = row + x
        }
        console.log(row)
    }
}


function dibuixa_ajuda(){
    console.log("COMANDES\n")
    console.log("ajuda/help: mostren la llista de comandes")
    console.log("carregar partida <nom_arxiu.json>: guarda la partida actual")
    console.log("guardar partida <nom_arxiu.json>: carrega una partida guardada")
    console.log("activar/desactivar trampa: a la dreta del tauler, mostra o amaga un segon tauler amb les caselles destapades")
    console.log("destapar x,y: destapa la casella en aquella posició")
    console.log("puntuacio: mostra la puntuacio actual i les tirades restants")
    console.log("sortir: surt del programa\n")
}

function afegirCasellaHit(casella) {        partida.tirades -= 1;
    const valid = validaCasella(casella);
    if (valid) {
        if (partida.caselles_hit.includes(casella)) {
            missatge = "Aquesta casella ja està destapada!";
            return;
        }
        partida.caselles_hit.push(casella);
        if (partida.caselles_amb_tresor.includes(casella)) {
            missatge = `Enhorabona! Has trobat un tresor a ${casella}`;
            partida.tresors += 1;
        } else {
            const distancia = calculaDistanciaAlTresor(casella);
            missatge = `S'ha destapat ${casella}. La distància al tresor més proper és ${distancia}`;
            partida.tirades -= 1;
        }
        actualitzaMatriu();
    } else {
        missatge = "La casella introduïda no és vàlida";
    }
}

function calculaDistanciaAlTresor(casella) {
    const lletres = ["A", "B", "C", "D", "E", "F"];
    const [lletra, num] = casella.split("");
    const x1 = lletres.indexOf(lletra);
    const y1 = parseInt(num);

    let distanciaMinima = Infinity;

    for (const tresor of partida.caselles_amb_tresor) {
        const [lletraT, numT] = tresor.split("");
        const x2 = lletres.indexOf(lletraT);
        const y2 = parseInt(numT);

        const distancia = Math.abs(x1 - x2) + Math.abs(y1 - y2);
        distanciaMinima = Math.min(distanciaMinima, distancia);
    }

    return distanciaMinima;
}


function generaTresors() {
    const lletres = ["A", "B", "C", "D", "E", "F"];
    const nums = ["0", "1", "2", "3", "4", "5", "6", "7"];
    const tresors = new Set();

    while (tresors.size < 16) {
        const lletra = lletres[Math.floor(Math.random() * lletres.length)];
        const num = nums[Math.floor(Math.random() * nums.length)];
        const casella = lletra + num;

        tresors.add(casella);
    }

    partida.caselles_amb_tresor = Array.from(tresors);
}

function validaCasella(casella) {
    const lletres = ["A", "B", "C", "D", "E", "F"];
    const nums = ["0", "1", "2", "3", "4", "5", "6", "7"];

    if (casella.length !== 2) {
        return false;
    }

    const [lletra, num] = casella.split("");

    return lletres.includes(lletra) && nums.includes(num);
}

function actualitzaMatriu() {
    for (casella of partida.caselles_hit) {
        const [lletra, num] = casella.split("");
        for (llista of matriu) {
            if (llista[0] === lletra){
                if (partida.caselles_amb_tresor.includes(casella)){
                    llista[parseInt(num) + 1] = "T"
                } else {
                    llista[parseInt(num) + 1] = "X"
                }
            }
        }
    }
}

function winMenu(){
    tirades =  partida.tirades - 32
    console.clear()
    console.log("FELICITACIONS!!!")
    console.log(`        __________
       /\\____;;___\\
      | /         /
      \`. ())oo() .
       |\\(%()*^^()^\\
      %| |-%-------|
     % \\ | %  ))   |
     %  \\|%________|
    `)
    console.log("Has guanyat amb només " + tirades + " tirades") 
}


winMenu()
