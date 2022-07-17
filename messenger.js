function handleResponse(response) {
	console.log(`messenger.js recebeu uma resposta: ${
        Object.values(response)
    }`);
	return response;
}

function handleError(error) {
	console.log(`Erro na mensagem: ${error}`);
}

function sendMessage(message) {
    console.log("messenger.js enviando mensagem...");
	const sending = browser.runtime.sendMessage(
        {content: message}
    );
	sending.then(handleResponse, handleError);
}

// sendMessage("interface");

let conteudoBody = document.getElementsByTagName("body");
