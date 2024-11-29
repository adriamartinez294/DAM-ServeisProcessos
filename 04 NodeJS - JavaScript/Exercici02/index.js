const fs = require('fs').promises
const readline = require('readline').promises

async function main() {
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

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    console.clear()

    while(true){

        dibuixa_matriu(matriu)
        const comanda = await rl.question("Escriu una comanda: ")

        if (typeof comanda === "string" && comanda.length > 0) {
            if (comanda === "ajuda") {
                dibuixa_ajuda()
            } else if (comanda === "sortir"){
                break
            }
        }

        console.clear()
    }

    rl.close() // Tancar la lectura 'readline'
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
    
}


main()
