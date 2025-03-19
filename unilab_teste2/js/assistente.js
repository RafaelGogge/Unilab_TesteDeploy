// Função para inicializar o assistente
function inicializarAssistente() {
    // Configura o timer de inatividade
    let tempoInativo = 0;
    const tempoLimite = 20; // 20 segundos

    // Função para resetar o timer
    function resetarTimer() {
        tempoInativo = 0;
    }

    // Função para verificar inatividade
    function verificarInatividade() {
        tempoInativo++;
        if (tempoInativo >= tempoLimite) {
            mostrarMensagem('Notei que você está há algum tempo na página. Posso ajudar em algo?', 'assistente');
            resetarTimer();
        }
    }

    // Adiciona eventos para detectar atividade do usuário
    ['mousemove', 'keypress', 'click', 'scroll'].forEach(evento => {
        document.addEventListener(evento, resetarTimer);
    });

    // Inicia o timer de verificação
    setInterval(verificarInatividade, 1000);
} 