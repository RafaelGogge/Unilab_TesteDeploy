// Variável global para armazenar a instância do modal
let labModalInstance;
// Recupera os laboratórios do localStorage ou inicializa com um array vazio
let laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];

// Verificar autenticação
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeLaboratorios();
    loadLaboratories();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Formulário de filtros
    document.getElementById('filterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        filterLaboratories();
    });

    // Botão de novo laboratório
    document.getElementById('btnNovoLaboratorio').addEventListener('click', function() {
        openLaboratoryModal();
    });

    // Botão de salvar no modal
    document.getElementById('btnSalvarLaboratorio').addEventListener('click', function() {
        saveLaboratory();
    });

    // Botão de limpar filtros
    document.getElementById('btnLimparFiltros').addEventListener('click', function() {
        clearFilters();
    });
    
    // Botão de logout
    document.querySelector('.logout-button').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

// Verificar autenticação
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    // Verificar se o usuário está autenticado e se é um administrador
    if (!isAuthenticated || userRole !== 'administrador') {
        // Mostrar uma mensagem antes de redirecionar se o usuário estiver autenticado, mas não for administrador
        if (isAuthenticated && userRole !== 'administrador') {
            // Salvar mensagem para ser exibida na página de destino
            sessionStorage.setItem('redirectMessage', 'Você não tem permissão para acessar a página de gerenciamento de laboratórios.');
            sessionStorage.setItem('redirectMessageType', 'danger');
        }
        window.location.href = 'sejaBemVindo.html';
        return;
    }
    
    // Atualizar nome do usuário, se disponível
    const userName = localStorage.getItem('userName');
    const userNameElement = document.querySelector('.user-name');
    if (userName && userNameElement) {
        userNameElement.textContent = userName;
    }
}

// Inicializar a estrutura dos laboratórios se necessário
function initializeLaboratorios() {
    // Converter laboratórios antigos para o novo formato, se houver
    if (laboratorios.length > 0 && laboratorios[0].ativo !== undefined) {
        laboratorios = laboratorios.map(lab => {
            return {
                id: lab.id || generateId(),
                nome: lab.nome || '',
                localizacao: lab.localizacao || '',
                tipo: lab.tipo || 'outro',
                capacidade: lab.computadores || 0,
                status: lab.ativo ? 'ativo' : 'inativo'
            };
        });
        localStorage.setItem('laboratorios', JSON.stringify(laboratorios));
    }
    
    // Se não existirem laboratórios, criar alguns exemplos
    if (laboratorios.length === 0) {
        const labsExemplo = [
            {
                id: generateId(),
                nome: 'Laboratório de Informática',
                localizacao: 'Bloco A, Sala 101',
                tipo: 'computacao',
                capacidade: 30,
                status: 'ativo'
            },
            {
                id: generateId(),
                nome: 'Laboratório de Química',
                localizacao: 'Bloco B, Sala 202',
                tipo: 'quimica',
                capacidade: 25,
                status: 'ativo'
            },
            {
                id: generateId(),
                nome: 'Laboratório de Física',
                localizacao: 'Bloco C, Sala 303',
                tipo: 'fisica',
                capacidade: 20,
                status: 'inativo'
            }
        ];
        
        laboratorios = labsExemplo;
        localStorage.setItem('laboratorios', JSON.stringify(laboratorios));
    }
}

// Carregar laboratórios
function loadLaboratories() {
    laboratorios = JSON.parse(localStorage.getItem('laboratorios')) || [];
    updateStatistics(laboratorios);
    displayLaboratories(laboratorios);
}

// Atualizar estatísticas
function updateStatistics(laboratories) {
    const total = laboratories.length;
    const ativos = laboratories.filter(lab => lab.status === 'ativo').length;
    const inativos = laboratories.filter(lab => lab.status === 'inativo').length;
    const capacidadeTotal = laboratories.reduce((acc, lab) => acc + parseInt(lab.capacidade || 0), 0);

    document.getElementById('totalLaboratorios').textContent = total;
    document.getElementById('laboratoriosAtivos').textContent = ativos;
    document.getElementById('laboratoriosInativos').textContent = inativos;
    document.getElementById('capacidadeTotal').textContent = capacidadeTotal;
}

// Exibir laboratórios na tabela
function displayLaboratories(laboratories) {
    const tbody = document.querySelector('#laboratoriosTable tbody');
    tbody.innerHTML = '';

    if (laboratories.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" class="text-center">Nenhum laboratório encontrado</td>`;
        tbody.appendChild(tr);
        return;
    }

    laboratories.forEach(lab => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${lab.nome || ''}</td>
            <td>${lab.localizacao || ''}</td>
            <td>${formatTipo(lab.tipo || 'outro')}</td>
            <td>${lab.capacidade || 0} pessoas</td>
            <td><span class="status-badge status-${lab.status || 'inativo'}">${formatStatus(lab.status || 'inativo')}</span></td>
            <td>
                <button class="btn-action" onclick="editLaboratory('${lab.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action" onclick="deleteLaboratory('${lab.id}')" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Filtrar laboratórios
function filterLaboratories() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const tipo = document.getElementById('tipoFilter').value;

    let filteredLabs = laboratorios.filter(lab => {
        const matchesSearch = (lab.nome || '').toLowerCase().includes(searchTerm) ||
                            (lab.localizacao || '').toLowerCase().includes(searchTerm);
        const matchesStatus = !status || lab.status === status;
        const matchesTipo = !tipo || lab.tipo === tipo;
        
        return matchesSearch && matchesStatus && matchesTipo;
    });

    displayLaboratories(filteredLabs);
}

// Limpar filtros
function clearFilters() {
    document.getElementById('filterForm').reset();
    loadLaboratories();
}

// Abrir modal de laboratório
function openLaboratoryModal(labId = null) {
    const modal = new bootstrap.Modal(document.getElementById('laboratorioModal'));
    const form = document.getElementById('laboratorioForm');
    const title = document.getElementById('modalTitle');

    form.reset();
    if (labId) {
        title.textContent = 'Editar Laboratório';
        const lab = getLaboratoryById(labId);
        if (lab) {
            form.nome.value = lab.nome || '';
            form.localizacao.value = lab.localizacao || '';
            form.tipo.value = lab.tipo || 'outro';
            form.capacidade.value = lab.capacidade || 0;
            form.status.value = lab.status || 'inativo';
            form.dataset.labId = labId;
        }
    } else {
        title.textContent = 'Novo Laboratório';
        delete form.dataset.labId;
    }

    modal.show();
}

// Salvar laboratório
function saveLaboratory() {
    const form = document.getElementById('laboratorioForm');
    const labId = form.dataset.labId;
    const lab = {
        id: labId || generateId(),
        nome: form.nome.value,
        localizacao: form.localizacao.value,
        tipo: form.tipo.value,
        capacidade: parseInt(form.capacidade.value),
        status: form.status.value
    };

    if (!validateLaboratory(lab)) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'danger');
        return;
    }
    
    if (labId) {
        // Atualizar laboratório existente
        laboratorios = laboratorios.map(l => l.id === labId ? lab : l);
    } else {
        // Adicionar novo laboratório
        laboratorios.push(lab);
    }

    localStorage.setItem('laboratorios', JSON.stringify(laboratorios));
    
    try {
        const modalEl = document.getElementById('laboratorioModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    } catch (e) {
        console.error('Erro ao fechar modal:', e);
    }
    
    loadLaboratories();
    showNotification(`Laboratório ${labId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
}

// Editar laboratório
function editLaboratory(labId) {
    openLaboratoryModal(labId);
}

// Excluir laboratório
function deleteLaboratory(labId) {
    if (confirm('Tem certeza que deseja excluir este laboratório?')) {
        laboratorios = laboratorios.filter(lab => lab.id !== labId);
        localStorage.setItem('laboratorios', JSON.stringify(laboratorios));
        loadLaboratories();
        showNotification('Laboratório excluído com sucesso!', 'success');
    }
}

// Funções auxiliares
function getLaboratoryById(labId) {
    return laboratorios.find(lab => lab.id === labId);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function validateLaboratory(lab) {
    return lab.nome && lab.localizacao && lab.tipo && lab.capacidade > 0 && lab.status;
}

function formatStatus(status) {
    const statusMap = {
        'ativo': 'Ativo',
        'inativo': 'Inativo'
    };
    return statusMap[status] || status;
}

function formatTipo(tipo) {
    const tipoMap = {
        'computacao': 'Computação',
        'fisica': 'Física',
        'quimica': 'Química',
        'biologia': 'Biologia',
        'outro': 'Outro'
    };
    return tipoMap[tipo] || tipo;
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationBody = document.getElementById('notificationBody');
    
    if (!notification || !notificationBody) {
        alert(message);
        return;
    }
    
    notificationBody.textContent = message;
    notification.className = `toast align-items-center text-white bg-${type} border-0`;
    
    try {
        const toast = new bootstrap.Toast(notification);
        toast.show();
    } catch (e) {
        console.error('Erro ao mostrar notificação:', e);
        alert(message);
    }
}

// Logout
function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}
