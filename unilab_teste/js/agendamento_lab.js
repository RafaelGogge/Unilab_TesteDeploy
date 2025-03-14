const senhaAdministrador = "1234";
let agendamentos = [];
let labGlobal; // Variável global para armazenar os dados do laboratório atual

function obterIndiceLaboratorio() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lab');
}

// Função para formatar a data (de yyyy-mm-dd para dd/mm/yyyy)
function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Carrega os dados do laboratório a partir do localStorage
function carregarDados() {
  const index = obterIndiceLaboratorio();
  if (index === null) {
    alert("Laboratório não especificado.");
    return;
  }
  const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
  labGlobal = laboratorios[index];
  if (!labGlobal) {
    alert("Laboratório não encontrado.");
    return;
  }
  document.title = `Agendamento - ${labGlobal.nome}`;
  document.querySelector(".login-title").textContent = `Agendamento: ${labGlobal.nome}`;
  agendamentos = JSON.parse(localStorage.getItem(`lab${index}_agendamentos`)) || [];
  atualizarStatus();
}

// Salva os agendamentos do laboratório atual no localStorage
function salvarAgendamentos() {
  const index = obterIndiceLaboratorio();
  localStorage.setItem(`lab${index}_agendamentos`, JSON.stringify(agendamentos));
}

// Atualiza o status exibido (lista de agendamentos) na tela
function atualizarStatus() {
  const statusList = document.getElementById("statusList");
  statusList.innerHTML = "";
  if (agendamentos.length === 0) {
    statusList.innerHTML = "<li>Nenhuma data indisponível</li>";
    document.getElementById("cancelButton").classList.add("d-none");
    return;
  }
  agendamentos.forEach((agendamento) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Professor: ${agendamento.professor} - Data: ${formatarData(agendamento.data)} - Horário: ${agendamento.horario}`;
    statusList.appendChild(listItem);
  });
  document.getElementById("cancelButton").classList.remove("d-none");
}

// --- INTEGRAÇÃO: Histórico e Notificações ---

// Adiciona o registro do agendamento ao histórico global
function adicionarAoHistorico(agendamento) {
  const historico = JSON.parse(localStorage.getItem("historicoAgendamentos")) || [];
  historico.push(agendamento);
  localStorage.setItem("historicoAgendamentos", JSON.stringify(historico));
}

// Adiciona uma notificação de alteração
function adicionarNotificacao(titulo, mensagem) {
  const notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];
  const novaNotificacao = {
    titulo,
    mensagem,
    data: new Date().toLocaleString()
  };
  notificacoes.push(novaNotificacao);
  localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
}

// --- FUNÇÃO DE AGENDAMENTO ---
function reservar(horario) {
  const nomeProfessor = document.getElementById("nomeProfessor").value.trim();
  const dataAgendamento = document.getElementById("dataAgendamento").value;
  
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nomeProfessor)) {
    alert("O nome do professor deve conter apenas letras e espaços.");
    return;
  }
  if (!dataAgendamento) {
    alert("A data é obrigatória para efetuar a reserva.");
    return;
  }
  
  const dataAtual = new Date();
  const dataSelecionada = new Date(dataAgendamento + 'T00:00:00');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (dataSelecionada < hoje) {
    alert("Não é possível agendar para uma data que já passou.");
    return;
  }
  
  const agora = new Date();
  if (dataSelecionada.toDateString() === agora.toDateString()) {
    if (agora.getHours() >= 18) {
      alert("Não é permitido realizar agendamentos após as 18h deste dia.");
      return;
    }
  }
  
  const bookingsForDate = agendamentos.filter(agendamento => agendamento.data === dataAgendamento);
  if (bookingsForDate.length > 0) {
    if (horario === "19:00 às 20:20 e 20:50 às 22:00") {
      alert("Não é possível marcar ambos os horários, pois já há agendamentos para essa data.");
      return;
    } else if (horario === "19:00 às 20:20" && bookingsForDate.some(b => b.horario === "19:00 às 20:20" || b.horario === "19:00 às 20:20 e 20:50 às 22:00")) {
      alert("O horário 19:00 às 20:20 já está reservado para essa data.");
      return;
    } else if (horario === "20:50 às 22:00" && bookingsForDate.some(b => b.horario === "20:50 às 22:00" || b.horario === "19:00 às 20:20 e 20:50 às 22:00")) {
      alert("O horário 20:50 às 22:00 já está reservado para essa data.");
      return;
    }
  }
  const agendamentosPorProfessor = agendamentos.filter(
    agendamento => agendamento.professor === nomeProfessor.toUpperCase() && agendamento.data === dataAgendamento
  );
  if (agendamentosPorProfessor.length >= 3) {
    alert("Você atingiu o limite de 3 agendamentos para esse dia.");
    return;
  }
  
  const senhaInput = prompt("Digite a senha do administrador:");
  if (senhaInput === senhaAdministrador) {
    const nomeMaiusculo = nomeProfessor.toUpperCase();
    const novoAgendamento = { 
      laboratorio: labGlobal.nome,
      professor: nomeMaiusculo, 
      data: dataAgendamento, 
      horario 
    };
    agendamentos.push(novoAgendamento);
    salvarAgendamentos();
    
    // Integração: Adiciona ao histórico e gera notificação
    adicionarAoHistorico(novoAgendamento);
    adicionarNotificacao(
      "Novo Agendamento",
      `Professor ${nomeMaiusculo} agendou o laboratório ${labGlobal.nome} para ${formatarData(dataAgendamento)} no horário ${horario}.`
    );
    
    alert(`Reserva confirmada!\nProfessor: ${nomeMaiusculo}\nData: ${formatarData(dataAgendamento)}\nHorário: ${horario}`);
    atualizarStatus();
    showConfirmAgendamento();
  } else {
    alert("Senha incorreta. A reserva não foi realizada.");
  }
}

function abrirModalCancelamento() {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = "";
  if (agendamentos.length === 0) {
    modalBody.innerHTML = "<p>Nenhum agendamento para cancelar.</p>";
    return;
  }
  agendamentos.forEach((agendamento, index) => {
    const div = document.createElement("div");
    div.className = "form-check";
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${index}" id="agendamento${index}">
      <label class="form-check-label" for="agendamento${index}">
        Professor: ${agendamento.professor} - Data: ${formatarData(agendamento.data)} - Horário: ${agendamento.horario}
      </label>
    `;
    modalBody.appendChild(div);
  });
  const modal = new bootstrap.Modal(document.getElementById("cancelModal"));
  modal.show();
}

function cancelarAgendamentosSelecionados() {
  const senhaInput = prompt("Digite a senha do administrador para cancelar os agendamentos:");
  if (senhaInput !== senhaAdministrador) {
    alert("Senha incorreta. Não foi possível cancelar os agendamentos.");
    return;
  }
  const checkboxes = document.querySelectorAll("#modalBody .form-check-input:checked");
  if (checkboxes.length === 0) {
    alert("Nenhum agendamento selecionado.");
    return;
  }
  const indices = Array.from(checkboxes)
    .map(cb => parseInt(cb.value))
    .sort((a, b) => b - a);
  indices.forEach(index => {
    agendamentos.splice(index, 1);
  });
  salvarAgendamentos();
  // Geração de notificação para cancelamento
  adicionarNotificacao("Cancelamento de Agendamento", "Um ou mais agendamentos foram cancelados.");
  alert("Agendamentos selecionados foram cancelados.");
  const modal = bootstrap.Modal.getInstance(document.getElementById("cancelModal"));
  modal.hide();
  atualizarStatus();
}

function showConfirmAgendamento() {
  const confirmModal = new bootstrap.Modal(document.getElementById("confirmAgendamentoModal"));
  confirmModal.show();
  document.getElementById("btnSim").addEventListener("click", function () {
    document.getElementById("dataAgendamento").value = "";
    confirmModal.hide();
  }, { once: true });
}

document.addEventListener("DOMContentLoaded", carregarDados);