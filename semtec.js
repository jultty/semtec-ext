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

// processamento

function tratarConteudo(conteudo) {
    conteudo = conteudo.replace(/[.,:;\\?!#!&\*\-\/()]/g,"");
    conteudo = conteudo.toLowerCase();
    return conteudo;
}

function buscarConteudo(conteudo, dict) {
    const it = dict[Symbol.iterator]();
    conteudo = tratarConteudo(conteudo);
    let termosEncontrados = [];
    
    for (const i of it) {
        if (!(termosEncontrados.includes(i[0])) &&
            conteudo.match(new RegExp(`\\b(${i[0]})\\b`, 'i'))) {
                termosEncontrados.push(i[0]);
            }
        }
    console.log(termosEncontrados);
    return termosEncontrados;
}

// comunicação com o front-end

function handleMessage(request, sender, sendResponse) {
    let response  = buscarConteudo(request.content, termos);
    sendResponse(response);
}

browser.runtime.onMessage.addListener(handleMessage);
