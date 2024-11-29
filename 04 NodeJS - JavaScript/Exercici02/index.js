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


let missatge = ""

async function main() {
    
    let matriu = [[" ","0","1","2","3","4","5","6","7"],
            ["A","·","·","·","·","·","·","·","·"],
            ["B","·","·","·","·","·","·","·","·"],
            ["C","·","·","·","·","·","·","·","·"],
            ["D","·","·","·","·","·","·","·","·"],
            ["E","·","·","·","·","·","·","·","·"],
            ["F","·","·","·","·","·","·","·","·"]]


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    console.clear()

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


main()
