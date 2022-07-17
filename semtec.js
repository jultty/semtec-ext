const urlLocal = browser.runtime.getURL("termos.json");
const urlRemota = "https://semtec.herokuapp.com/api/v1/termo";

// comunicação com o back-end

function obterJSON() {
	fetch(urlLocal)
		.then(response => response.json())
		.then(json => {
            mapearTermos(termos, json._embedded.termoList);
	});
}

function mapearTermos(dict, json) {
    for (let k in json) {
        let termo = json[k];
        if (json.hasOwnProperty(k)) {
            dict.set(termo.termo, {
                significado: termo.significado,
                url: termo.pagina
            });
        }
    }
}

let termos = new Map();
obterJSON();

// comunicação com o front-end

function obterTermo(termo, dict) {
    return dict.get(termo);
}

function definirTermo(termo, dict) {
    return dict.get(termo).significado;
}

function linkarTermo(termo, dict) {
    return dict.get(termo).url;
}

function tratarConteudo(conteudo) {
    conteudo = conteudo.replace(/[.,:;\\?!#!&\*\-\/()]/g,"");
    conteudo = conteudo.toLowerCase();
    conteudo = conteudo.split(/\s+/);
    return conteudo;
}

function buscarConteudo(conteudo, dict) {
    const it = dict[Symbol.iterator]();
    conteudo = tratarConteudo(conteudo);
    let termosEncontrados = [];
    
    for (const i of it) {
        if (conteudo.includes(i[0]) && !(termosEncontrados.includes(i[0]))) {
            console.log(`termo encontrado: ${i[0]} - ${dict.get(i[0]).significado}`);
            termosEncontrados.push(i[0]);
        }
    }
    return termosEncontrados;
}

function handleMessage(request, sender, sendResponse) {
    // console.log(`semtec.js recebeu uma mensagem de ${
    //     Object.values(sender)}: ${Object.values(request)
    // }`);

    let response  = buscarConteudo(request.content, termos);
    // console.log(`semtec.js enviando resposta: ${response}`);
    sendResponse(response);
}

browser.runtime.onMessage.addListener(handleMessage);
