urlLocal = browser.runtime.getURL("termos.json");
urlRemota = "https://semtec.herokuapp.com/api/v1/termo"

let integraJSON;

fetch(urlLocal)
    .then(
        function(response) {
            return response.json();
    }).then(
        function(json) {
            integraJSON = json;
        });

termosJSON = integraJSON._embedded.termoList;

function mapearTermos(dict, json) {
    for (let k in Object.entries(json)) {
        let termo = json[k];
        if (json.hasOwnProperty(k)) {
            dict.set(termo.termo, {
                significado: termo.significado,
                url: termo.pagina
            });
        }
    }
    return dict;
}

function exibirTermos(dict) {
    dict.forEach((significado, termo, dict) => {
        console.log(`${termo}: ${significado}\n`);
    });
}

let termos = new Map();
termos = mapearTermos(termos, termosJSON);

function obterTermo(termo, dict) {
    return dict.get(termo);
}

function definirTermo(termo, dict) {
    return dict.get(termo).significado;
}

function linkarTermo(termo, dict) {
    return dict.get(termo).url;
}

function handleMessage(request, sender, sendResponse) {
    console.log(`semtec.js recebeu uma mensagem de ${
        Object.values(sender)}: ${Object.values(request)
    }`);
    let response  = obterTermo(request.content, termos);
    console.log(`semtec.js enviando resposta: ${response}`);
    sendResponse(response);
}

browser.runtime.onMessage.addListener(handleMessage);

