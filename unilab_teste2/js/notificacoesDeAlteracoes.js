function carregarNotificacoes() {
    const notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];
    const container = document.getElementById("notificacaoContainer");
    container.innerHTML = "";
    if (notificacoes.length === 0) {
        container.innerHTML = `<p class="text-center">Nenhuma notificação registrada.</p>`;
    } else {
        notificacoes.forEach(item => {
            const div = document.createElement("div");
            div.className = "notification";
            div.innerHTML = `<strong>${item.titulo}</strong><br>${item.mensagem}<br><small>${item.data}</small>`;
            container.appendChild(div);
        });
    }
}

function limparNotificacoes() {
    if (confirm("Tem certeza que deseja limpar todas as notificações?")) {
        localStorage.removeItem("notificacoes");
        carregarNotificacoes();
    }
}
function filtrarNotificacoes() {
    const filterText = document.getElementById("filterNotInput").value.toLowerCase();
    const notifications = document.querySelectorAll(".notification");
    notifications.forEach(notif => {
        notif.style.display = notif.textContent.toLowerCase().includes(filterText) ? "" : "none";
    });
}
document.getElementById("filterNotInput").addEventListener("keyup", filtrarNotificacoes);
document.addEventListener("DOMContentLoaded", carregarNotificacoes);