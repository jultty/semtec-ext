const btn = document.querySelector("update-button");

function handleResponse(message) {
      console.log(`ui.js recebeu uma resposta: ${Object.values(message.response)}`);
}

function handleError(error) {
      console.log(`Erro: ${error}`);
}

function sendMessage(e) {
      const sending = browser.runtime.sendMessage(
          {content: "mensagem da ui"}
      );
      sending.then(handleResponse, handleError);
}

btn.addEventListener("click", sendMessage);
