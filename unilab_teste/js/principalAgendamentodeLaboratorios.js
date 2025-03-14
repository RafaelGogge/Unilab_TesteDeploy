function carregarLaboratorios() {
    const container = document.getElementById("labContainer");
    const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
    container.innerHTML = "";
    laboratorios.forEach((lab, index) => {
        const col = document.createElement("div");
        col.className = "col-md-6 mb-4";
        col.innerHTML = `
            <div class="card text-center" tabindex="0" role="button">
                <div class="card-body">
                    <h1 aria-hidden="true">🔬</h1>
                    <h2 class="card-title">${lab.nome}</h2>
                    <div class="details">
                        <p>${lab.computadores} computadores</p>
                        <p>Ferramentas: ${lab.ferramentas.join(", ")}</p>
                        <p>Status: ${lab.ativo ? "Disponível" : "Inativo"}</p>
                    </div>
                    <div class="mb-3">
                        <button class="btn btn-success" ${!lab.ativo ? 'disabled' : ''} onclick="realizarAgendamento(${index})">Realizar Agendamento</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function realizarAgendamento(index) {
    const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
    if (!laboratorios[index].ativo) {
        alert("Este laboratório está inativo. Não é possível realizar agendamento.");
        return;
    }
    window.location.href = `agendamento_lab.html?lab=${index}`;
}

document.addEventListener("DOMContentLoaded", carregarLaboratorios);