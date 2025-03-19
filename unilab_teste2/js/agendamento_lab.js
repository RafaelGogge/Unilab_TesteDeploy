const senhaAdministrador = "1234";
let agendamentos = [];
let labGlobal = null;

// Função para carregar a lista de professores
function carregarProfessores() {
    console.log('Carregando lista de professores...');
    const professores = JSON.parse(localStorage.getItem("professores")) || [];
    
    if (professores.length === 0) {
        console.log('Nenhum professor encontrado');
        mostrarMensagem('Nenhum professor cadastrado no sistema.', 'warning');
        return;
    }
    
    const selectProfessor = document.getElementById("nomeProfessor");
    // Mantém apenas a primeira opção (placeholder)
    selectProfessor.innerHTML = '<option value="">Selecione um professor</option>';
    
    // Ordena os professores por nome
    professores.sort((a, b) => a.nome.localeCompare(b.nome));
    
    professores.forEach(professor => {
        const option = document.createElement("option");
        option.value = professor.nome;
        option.textContent = professor.nome;
        selectProfessor.appendChild(option);
    });
    
    console.log(`${professores.length} professores carregados`);
}

// Função para formatar a data (de yyyy-mm-dd para dd/mm/yyyy)
function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Carrega os dados do laboratório a partir do localStorage
function carregarDados() {
    console.log('Iniciando carregamento de dados...');
    const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
    
    if (laboratorios.length === 0) {
        console.log('Nenhum laboratório encontrado');
        mostrarMensagem('Nenhum laboratório cadastrado no sistema.', 'warning');
        return;
    }
    
    // Carregar o primeiro laboratório por padrão
    window.labAtual = 0;
    labGlobal = laboratorios[0];
    agendamentos = JSON.parse(localStorage.getItem(`lab0_agendamentos`)) || [];
    
    console.log('Laboratório carregado:', labGlobal);
    
    // Carregar professores
    carregarProfessores();
    
    // Primeiro atualizar o status
    atualizarStatus();
    // Depois carregar as ferramentas
    carregarFerramentasLaboratorio(0);
}

// Salva os agendamentos do laboratório atual no localStorage
function salvarAgendamentos() {
    localStorage.setItem(`lab${window.labAtual}_agendamentos`, JSON.stringify(agendamentos));
    console.log('Agendamentos salvos com sucesso');
}

// Função para mostrar mensagens ao usuário
function mostrarMensagem(mensagem, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    const container = document.querySelector('.login-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Função para animar elementos quando aparecem na tela
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.status-container, .lab-info, .ferramenta-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Função para adicionar efeito de ripple nos botões
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Atualiza o status exibido (lista de agendamentos) na tela
function atualizarStatus() {
    console.log('Atualizando status do laboratório...');
    
    // Remover container de status existente, se houver
    const existingStatus = document.querySelector('.status-container');
    if (existingStatus) {
        existingStatus.remove();
    }

    // Criar novo container de status
    const statusContainer = document.createElement('div');
    statusContainer.className = 'status-container fade-in';
    
    const statusTitle = document.createElement('h3');
    statusTitle.className = 'status-title';
    statusTitle.innerHTML = '<i class="bi bi-calendar-check"></i> Status do Laboratório';
    statusContainer.appendChild(statusTitle);
    
    const statusList = document.createElement('ul');
    statusList.id = 'statusList';
    statusList.className = 'status-list';
    
    if (agendamentos.length === 0) {
        const li = document.createElement('li');
        li.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Nenhuma data indisponível';
        li.classList.add('fade-in');
        statusList.appendChild(li);
        document.getElementById("cancelButton")?.classList.add("d-none");
    } else {
        agendamentos.sort((a, b) => new Date(a.data) - new Date(b.data)).forEach((agendamento, index) => {
            const listItem = document.createElement("li");
            const hoje = new Date().toISOString().split('T')[0];
            const classe = agendamento.data === hoje ? 'hoje' : '';
            
            listItem.innerHTML = `
                <div class="agendamento-info ${classe}">
                    <i class="bi bi-person-circle"></i>
                    <span>Professor: ${agendamento.professor}</span>
                </div>
                <div class="agendamento-info ${classe}">
                    <i class="bi bi-calendar-event"></i>
                    <span>Data: ${formatarData(agendamento.data)}</span>
                </div>
                <div class="agendamento-info ${classe}">
                    <i class="bi bi-clock"></i>
                    <span>Horário: ${agendamento.horario}</span>
                </div>
            `;
            listItem.classList.add('fade-in');
            listItem.style.animationDelay = `${index * 0.1}s`;
            statusList.appendChild(listItem);
        });
        document.getElementById("cancelButton")?.classList.remove("d-none");
    }
    
    statusContainer.appendChild(statusList);

    // Inserir o container de status após os botões de horário
    const loginContainer = document.querySelector('.login-container');
    const horariosContainer = document.querySelector('.horarios-container');
    if (horariosContainer) {
        horariosContainer.insertAdjacentElement('afterend', statusContainer);
    } else {
        loginContainer.appendChild(statusContainer);
    }
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

// Função para obter o ícone correto para cada ferramenta
function getFerramentaIcon(ferramenta) {
    const ferramentasIcons = {
        'Computador': 'bi bi-pc-display',
        'Monitor': 'bi bi-display',
        'Mouse': 'bi bi-mouse',
        'Teclado': 'bi bi-keyboard',
        'Projetor': 'bi bi-projector',
        'Microscópio': 'bi bi-microscope',
        'Impressora': 'bi bi-printer',
        'Scanner': 'bi bi-scanner',
        'Câmera': 'bi bi-camera',
        'Microfone': 'bi bi-mic',
        'Fone de Ouvido': 'bi bi-headphones',
        'Webcam': 'bi bi-webcam',
        'Roteador': 'bi bi-router',
        'Switch': 'bi bi-hdd-network',
        'Cabo de Rede': 'bi bi-ethernet',
        'Fonte de Alimentação': 'bi bi-plug',
        'Multímetro': 'bi bi-lightning-charge',
        'Osciloscópio': 'bi bi-graph-up',
        'Gerador de Sinais': 'bi bi-soundwave',
        'Fonte DC': 'bi bi-battery',
        'Protoboard': 'bi bi-grid-3x3',
        'Kit de Ferramentas': 'bi bi-tools',
        'Componentes Eletrônicos': 'bi bi-cpu',
        'Balança': 'bi bi-arrow-down-up',
        'Vidraria': 'bi bi-flask',
        'Reagentes': 'bi bi-droplet',
        'Pipeta': 'bi bi-thermometer',
        'Estufa': 'bi bi-box',
        'Centrífuga': 'bi bi-arrow-repeat',
        'pHmetro': 'bi bi-water'
    };
    
    return ferramentasIcons[ferramenta] || 'bi bi-tools';
}

// Função para carregar e exibir as ferramentas do laboratório
function carregarFerramentasLaboratorio(labId) {
    console.log('Carregando ferramentas do laboratório...');
    const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
    const lab = laboratorios[labId];
    
    if (!lab) {
        console.log('Laboratório não encontrado');
        return;
    }

    // Remover container de ferramentas existente, se houver
    const existingContainer = document.querySelector('.lab-info');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Criar novo container de ferramentas
    const ferramentasContainer = document.createElement('div');
    ferramentasContainer.className = 'lab-info fade-in';

    // Adicionar título
    const titulo = document.createElement('h3');
    titulo.innerHTML = '<i class="bi bi-tools"></i> Ferramentas Disponíveis';
    titulo.className = 'ferramentas-titulo';
    ferramentasContainer.appendChild(titulo);

    // Container para as ferramentas
    const ferramentasGrid = document.createElement('div');
    ferramentasGrid.className = 'ferramentas-grid';

    if (!lab.ferramentas || lab.ferramentas.length === 0) {
        console.log('Nenhuma ferramenta encontrada');
        const mensagem = document.createElement('p');
        mensagem.innerHTML = '<i class="bi bi-info-circle"></i> Nenhuma ferramenta cadastrada para este laboratório.';
        mensagem.className = 'text-muted';
        ferramentasContainer.appendChild(mensagem);
    } else {
        console.log('Ferramentas encontradas:', lab.ferramentas);
        lab.ferramentas.forEach((ferramenta, index) => {
            const ferramentaItem = document.createElement('div');
            ferramentaItem.className = 'ferramenta-item fade-in';
            ferramentaItem.style.animationDelay = `${index * 0.1}s`;
            
            const icon = document.createElement('i');
            icon.className = getFerramentaIcon(ferramenta);
            
            const span = document.createElement('span');
            span.textContent = ferramenta;
            
            ferramentaItem.appendChild(icon);
            ferramentaItem.appendChild(span);
            ferramentasGrid.appendChild(ferramentaItem);
        });
        ferramentasContainer.appendChild(ferramentasGrid);
    }

    // Inserir o container de ferramentas após o container de status
    const statusContainer = document.querySelector('.status-container');
    if (statusContainer) {
        statusContainer.insertAdjacentElement('afterend', ferramentasContainer);
    } else {
        document.querySelector('.login-container').appendChild(ferramentasContainer);
    }

    // Atualizar animações
    animateOnScroll();
}

// Função para reservar horário
async function reservar(horario) {
    const selectProfessor = document.getElementById("nomeProfessor");
    const nomeProfessor = selectProfessor.value;
    const dataAgendamento = document.getElementById("dataAgendamento").value;
    
    if (!nomeProfessor) {
        mostrarMensagem("Por favor, selecione um professor.", "danger");
        return;
    }
    
    if (!dataAgendamento) {
        mostrarMensagem("A data é obrigatória para efetuar a reserva.", "danger");
        return;
    }
    
    const dataAtual = new Date();
    const dataSelecionada = new Date(dataAgendamento + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataSelecionada < hoje) {
        mostrarMensagem("Não é possível agendar para uma data que já passou.", "danger");
        return;
    }
    
    if (dataSelecionada.toDateString() === dataAtual.toDateString() && dataAtual.getHours() >= 18) {
        mostrarMensagem("Não é permitido realizar agendamentos após as 18h deste dia.", "danger");
        return;
    }
    
    const bookingsForDate = agendamentos.filter(agendamento => agendamento.data === dataAgendamento);
    if (bookingsForDate.length > 0) {
        if (horario === "19:00 às 20:20 e 20:50 às 22:00") {
            mostrarMensagem("Não é possível marcar ambos os horários, pois já há agendamentos para essa data.", "danger");
            return;
        } else if (horario === "19:00 às 20:20" && bookingsForDate.some(b => b.horario === "19:00 às 20:20" || b.horario === "19:00 às 20:20 e 20:50 às 22:00")) {
            mostrarMensagem("O horário 19:00 às 20:20 já está reservado para essa data.", "danger");
            return;
        } else if (horario === "20:50 às 22:00" && bookingsForDate.some(b => b.horario === "20:50 às 22:00" || b.horario === "19:00 às 20:20 e 20:50 às 22:00")) {
            mostrarMensagem("O horário 20:50 às 22:00 já está reservado para essa data.", "danger");
            return;
        }
    }
    
    const agendamentosPorProfessor = agendamentos.filter(
        agendamento => agendamento.professor === nomeProfessor && agendamento.data === dataAgendamento
    );
    
    if (agendamentosPorProfessor.length >= 3) {
        mostrarMensagem("Você atingiu o limite de 3 agendamentos para esse dia.", "danger");
        return;
    }
    
    const senhaInput = prompt("Digite a senha do administrador:");
    if (senhaInput === senhaAdministrador) {
        const novoAgendamento = { 
            laboratorio: labGlobal.nome,
            professor: nomeProfessor,
            data: dataAgendamento, 
            horario 
        };
        
        agendamentos.push(novoAgendamento);
        salvarAgendamentos();
        
        // Integração: Adiciona ao histórico e gera notificação
        adicionarAoHistorico(novoAgendamento);
        adicionarNotificacao(
            "Novo Agendamento",
            `Professor ${nomeProfessor} agendou o laboratório ${labGlobal.nome} para ${formatarData(dataAgendamento)} no horário ${horario}.`
        );
        
        mostrarMensagem(`Reserva confirmada!\nProfessor: ${nomeProfessor}\nData: ${formatarData(dataAgendamento)}\nHorário: ${horario}`, "success");
        atualizarStatus();
        showConfirmAgendamento();
    } else {
        mostrarMensagem("Senha incorreta. A reserva não foi realizada.", "danger");
    }
}

// Função para abrir modal de cancelamento
function abrirModalCancelamento() {
    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = "";
    
    if (agendamentos.length === 0) {
        modalBody.innerHTML = '<p class="text-muted"><i class="bi bi-info-circle"></i> Nenhum agendamento para cancelar.</p>';
        return;
    }
    
    agendamentos.forEach((agendamento, index) => {
        const div = document.createElement("div");
        div.className = "form-check";
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${index}" id="agendamento${index}">
            <label class="form-check-label" for="agendamento${index}">
                <i class="bi bi-calendar-event"></i> ${formatarData(agendamento.data)} - 
                <i class="bi bi-clock"></i> ${agendamento.horario} - 
                <i class="bi bi-person"></i> ${agendamento.professor}
            </label>
        `;
        modalBody.appendChild(div);
    });
    
    const modal = new bootstrap.Modal(document.getElementById("cancelModal"));
    modal.show();
}

// Função para cancelar agendamentos selecionados
async function cancelarAgendamentosSelecionados() {
    const senhaInput = prompt("Digite a senha do administrador para cancelar os agendamentos:");
    if (senhaInput !== senhaAdministrador) {
        mostrarMensagem("Senha incorreta. Não foi possível cancelar os agendamentos.", "danger");
        return;
    }
    
    const checkboxes = document.querySelectorAll("#modalBody .form-check-input:checked");
    if (checkboxes.length === 0) {
        mostrarMensagem("Nenhum agendamento selecionado.", "warning");
        return;
    }
    
    const indices = Array.from(checkboxes)
        .map(cb => parseInt(cb.value))
        .sort((a, b) => b - a);
    
    indices.forEach(index => {
        const agendamentoCancelado = agendamentos[index];
        adicionarNotificacao(
            "Cancelamento de Agendamento",
            `Agendamento cancelado: ${formatarData(agendamentoCancelado.data)} - ${agendamentoCancelado.horario} - Professor ${agendamentoCancelado.professor}`
        );
        agendamentos.splice(index, 1);
    });
    
    salvarAgendamentos();
    mostrarMensagem("Agendamentos selecionados foram cancelados com sucesso.", "success");
    
    const modal = bootstrap.Modal.getInstance(document.getElementById("cancelModal"));
    modal.hide();
    atualizarStatus();
}

// Função para mostrar confirmação de novo agendamento
function showConfirmAgendamento() {
    const confirmModal = new bootstrap.Modal(document.getElementById("confirmAgendamentoModal"));
    confirmModal.show();
    
    document.getElementById("btnSim").addEventListener("click", function () {
        document.getElementById("dataAgendamento").value = "";
        confirmModal.hide();
    }, { once: true });
}

// Função para selecionar um laboratório
function selecionarLaboratorio(labId) {
    window.labAtual = labId;
    agendamentos = JSON.parse(localStorage.getItem(`lab${labId}_agendamentos`)) || [];
    
    // Primeiro atualizar o status
    atualizarStatus();
    // Depois carregar as ferramentas
    carregarFerramentasLaboratorio(labId);
    
    // Atualizar o título da página
    const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
    const laboratorio = laboratorios[labId];
    if (laboratorio) {
        document.querySelector('.login-title span').textContent = `Agendamento: ${laboratorio.nome}`;
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM carregado, iniciando aplicação...');
    carregarDados();
    animateOnScroll();
    
    // Adicionar animação suave ao formulário
    const form = document.querySelector('.login-container');
    if (form) {
        form.classList.add('fade-in');
    }
});