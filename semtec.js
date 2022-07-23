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
        if (!(termosEncontrados.includes(i[0]))) {
            if (!(i[0].includes(" "))) { // i[0] tem uma única palavra
                if (conteudo.includes(i[0])) {
                    termosEncontrados.push(i[0]);
                }
            } else { // i[0] tem mais de uma palavra
                let termoTemp = i[0].split(/\s+/);

                    let inicioBusca = 0;
                    while (!(termosEncontrados.includes(i[0]))) {
                    if (conteudo.includes(termoTemp[0], inicioBusca)) {
                        let posicaoEncontrada = conteudo.indexOf(termoTemp[0], inicioBusca);

                        let iguais = 0;
                        for (const j of termoTemp) {
                            if (conteudo[posicaoEncontrada] === j) {
                                iguais++;
                            } else {
                            }
                            posicaoEncontrada++;
                        }

                        if (iguais === termoTemp.length) {
                            termosEncontrados.push(i[0]);
                        } else {
                            inicioBusca = posicaoEncontrada++;
                        }
                    }
                }
            }
        }
    }
    console.log(termosEncontrados);
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
