function handleResponse(response) {
	// console.log(`messenger.js recebeu uma resposta: ${ response }`);
}

function handleError(error) {
    erro = `messenger.js teve um erro:
        ${error.name} - ${error.message}. Causa: ${error.cause} (linha
        ${error.lineNumber}, coluna ${error.columnNumber})`
    erro = erro.replace(/\s\s+/g, ' ');
    console.log(erro);
}

function sendMessage(message) {
    // console.log(`messenger.js enviando mensagem: ${message}`);
	const sending = browser.runtime.sendMessage(
        {content: message}
    );
	sending.then(handleResponse, handleError);
}

let body = document.getElementsByTagName("body");
let conteudoBody = body[0].innerText;

sendMessage(conteudoBody);
