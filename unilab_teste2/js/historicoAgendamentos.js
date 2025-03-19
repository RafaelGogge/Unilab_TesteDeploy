function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}
function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem("historicoAgendamentos")) || [];
    const historyTable = document.getElementById("historyTable");
    const noRecords = document.getElementById("noRecords");
    historyTable.innerHTML = "";
    if (historico.length === 0) {
        noRecords.style.display = "block";
    } else {
        noRecords.style.display = "none";
        historico.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${item.laboratorio || "Não informado"}</td>
          <td>${item.professor}</td>
          <td>${formatarData(item.data)}</td>
          <td>${item.horario}</td>
        `;
            historyTable.appendChild(tr);
        });
    }
}
function filtrarHistorico() {
    const filterText = document.getElementById("filterInput").value.toLowerCase();
    const rows = document.querySelectorAll("#historyTable tr");
    rows.forEach(row => {
        const professor = row.children[1].textContent.toLowerCase();
        row.style.display = professor.includes(filterText) ? "" : "none";
    });
}
document.getElementById("filterInput").addEventListener("keyup", filtrarHistorico);
document.addEventListener("DOMContentLoaded", carregarHistorico);

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const filterForm = document.getElementById('filterForm');
    const agendamentosTable = document.getElementById('agendamentosTable');
    const notificationBell = document.querySelector('.notification-bell');
    const notificationModal = document.getElementById('notificationModal');
    const userDropdown = document.getElementById('userDropdown');
    const logoutButton = document.querySelector('.logout-button');
    const detalhesModal = document.getElementById('detalhesModal');

    // Verificar autenticação
    checkAuth();

    // Carregar dados iniciais
    loadLaboratorios();
    loadAgendamentos();
    simulateNotifications();

    // Event Listeners
    filterForm.addEventListener('submit', handleFilter);
    logoutButton.addEventListener('click', handleLogout);

    // Função para verificar autenticação
    function checkAuth() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');

        if (!isAuthenticated) {
            window.location.href = 'index.html';
            return;
        }

        // Atualizar nome do usuário
        document.querySelector('.user-name').textContent = userName || 'Usuário';

        // Ajustar título da página baseado no tipo de usuário
        const pageTitle = document.querySelector('.page-header h1');
        if (userRole === 'professor') {
            pageTitle.textContent = 'Meus Agendamentos';
        } else {
            pageTitle.textContent = 'Histórico de Agendamentos';
        }
    }

    // Função para carregar laboratórios no select
    function loadLaboratorios() {
        const laboratorioSelect = document.getElementById('laboratorio');
        
        // Simular dados de laboratórios (substituir por chamada à API)
        const laboratorios = [
            { id: 1, nome: 'Laboratório de Informática 1' },
            { id: 2, nome: 'Laboratório de Informática 2' },
            { id: 3, nome: 'Laboratório de Química' },
            { id: 4, nome: 'Laboratório de Física' }
        ];

        laboratorios.forEach(lab => {
            const option = document.createElement('option');
            option.value = lab.id;
            option.textContent = lab.nome;
            laboratorioSelect.appendChild(option);
        });
    }

    // Função para carregar agendamentos
    function loadAgendamentos(filters = {}) {
        // Simular dados de agendamentos (substituir por chamada à API)
        const agendamentos = [
            {
                id: 1,
                data: '2024-03-20',
                horario: '08:00 - 10:00',
                laboratorio: 'Laboratório de Informática 1',
                professor: 'Prof. João Silva',
                status: 'confirmado'
            },
            {
                id: 2,
                data: '2024-03-21',
                horario: '14:00 - 16:00',
                laboratorio: 'Laboratório de Química',
                professor: 'Prof. Maria Santos',
                status: 'pendente'
            },
            {
                id: 3,
                data: '2024-03-22',
                horario: '10:00 - 12:00',
                laboratorio: 'Laboratório de Física',
                professor: 'Prof. Pedro Oliveira',
                status: 'cancelado'
            }
        ];

        // Limpar tabela
        agendamentosTable.innerHTML = '';

        // Filtrar agendamentos
        const filteredAgendamentos = filterAgendamentos(agendamentos, filters);

        // Renderizar agendamentos
        filteredAgendamentos.forEach(agendamento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(agendamento.data)}</td>
                <td>${agendamento.horario}</td>
                <td>${agendamento.laboratorio}</td>
                <td>${agendamento.professor}</td>
                <td><span class="status-badge status-${agendamento.status}">${formatStatus(agendamento.status)}</span></td>
                <td>
                    <button class="btn-action" onclick="showDetalhes(${agendamento.id})" title="Ver detalhes">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${agendamento.status === 'pendente' ? `
                        <button class="btn-action" onclick="cancelarAgendamento(${agendamento.id})" title="Cancelar">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    ` : ''}
                </td>
            `;
            agendamentosTable.appendChild(row);
        });

        // Mostrar mensagem se não houver agendamentos
        if (filteredAgendamentos.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `
                <td colspan="6" class="text-center py-4">
                    Nenhum agendamento encontrado para os filtros selecionados.
                </td>
            `;
            agendamentosTable.appendChild(noDataRow);
        }
    }

    // Função para filtrar agendamentos
    function filterAgendamentos(agendamentos, filters) {
        return agendamentos.filter(agendamento => {
            if (filters.dataInicio && agendamento.data < filters.dataInicio) return false;
            if (filters.dataFim && agendamento.data > filters.dataFim) return false;
            if (filters.laboratorio && agendamento.laboratorio !== filters.laboratorio) return false;
            if (filters.status && agendamento.status !== filters.status) return false;
            return true;
        });
    }

    // Função para formatar data
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }

    // Função para formatar status
    function formatStatus(status) {
        const statusMap = {
            confirmado: 'Confirmado',
            pendente: 'Pendente',
            cancelado: 'Cancelado'
        };
        return statusMap[status] || status;
    }

    // Handler para o formulário de filtros
    function handleFilter(e) {
        e.preventDefault();
        
        const filters = {
            dataInicio: document.getElementById('dataInicio').value,
            dataFim: document.getElementById('dataFim').value,
            laboratorio: document.getElementById('laboratorio').value,
            status: document.getElementById('status').value
        };

        loadAgendamentos(filters);
    }

    // Handler para logout
    function handleLogout() {
        localStorage.clear();
        window.location.href = 'index.html';
    }

    // Função para mostrar detalhes do agendamento
    window.showDetalhes = function(id) {
        // Simular dados do agendamento (substituir por chamada à API)
        const agendamento = {
            id: id,
            data: '2024-03-20',
            horario: '08:00 - 10:00',
            laboratorio: 'Laboratório de Informática 1',
            professor: 'Prof. João Silva',
            status: 'confirmado',
            descricao: 'Aula de Programação Web',
            observacoes: 'Necessário acesso à internet'
        };

        const detalhesContent = document.querySelector('.detalhes-content');
        detalhesContent.innerHTML = `
            <div class="detalhes-grid">
                <div class="detalhe-item">
                    <label>Data:</label>
                    <span>${formatDate(agendamento.data)}</span>
                </div>
                <div class="detalhe-item">
                    <label>Horário:</label>
                    <span>${agendamento.horario}</span>
                </div>
                <div class="detalhe-item">
                    <label>Laboratório:</label>
                    <span>${agendamento.laboratorio}</span>
                </div>
                <div class="detalhe-item">
                    <label>Professor:</label>
                    <span>${agendamento.professor}</span>
                </div>
                <div class="detalhe-item">
                    <label>Status:</label>
                    <span class="status-badge status-${agendamento.status}">${formatStatus(agendamento.status)}</span>
                </div>
                <div class="detalhe-item">
                    <label>Descrição:</label>
                    <span>${agendamento.descricao}</span>
                </div>
                <div class="detalhe-item">
                    <label>Observações:</label>
                    <span>${agendamento.observacoes}</span>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(detalhesModal);
        modal.show();
    };

    // Função para cancelar agendamento
    window.cancelarAgendamento = function(id) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            // Simular cancelamento (substituir por chamada à API)
            showFeedback('Agendamento cancelado com sucesso!', 'success');
            loadAgendamentos();
        }
    };

    // Função para mostrar feedback
    function showFeedback(message, type = 'success') {
        const feedback = document.createElement('div');
        feedback.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        feedback.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 5000);
    }

    // Função para simular notificações
    function simulateNotifications() {
        const notificationList = document.querySelector('.notification-list');
        const notifications = [
            {
                type: 'info',
                title: 'Novo Agendamento',
                message: 'Um novo agendamento foi realizado para o Laboratório de Informática 1',
                time: '5 minutos atrás'
            },
            {
                type: 'warning',
                title: 'Agendamento Pendente',
                message: 'Você tem um agendamento pendente de confirmação',
                time: '1 hora atrás'
            },
            {
                type: 'success',
                title: 'Agendamento Confirmado',
                message: 'Seu agendamento foi confirmado com sucesso',
                time: '2 horas atrás'
            }
        ];

        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <div class="notification-icon">
                    <i class="bi bi-${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h6>${notification.title}</h6>
                    <p>${notification.message}</p>
                    <small>${notification.time}</small>
                </div>
            `;
            notificationList.appendChild(notificationItem);
        });
    }

    // Função para obter ícone da notificação
    function getNotificationIcon(type) {
        const iconMap = {
            info: 'info-circle',
            warning: 'exclamation-triangle',
            success: 'check-circle'
        };
        return iconMap[type] || 'bell';
    }
});