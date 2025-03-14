// Variável global para armazenar a instância do modal
let professorModalInstance;
// Recupera os professores do localStorage ou inicializa com um array vazio
let professores = JSON.parse(localStorage.getItem("professores")) || [];

// Verificar autenticação quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeProfessores();
    loadProfessores();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulário de filtros
    document.getElementById('filterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        filterProfessores();
    });

    // Botão de novo professor (no cabeçalho)
    document.getElementById('novoProfessor').addEventListener('click', function() {
        openProfessorModal();
    });

    // Botão flutuante de novo professor
    document.getElementById('btnNovoProfessor').addEventListener('click', function() {
        openProfessorModal();
    });

    // Botão de salvar no modal
    document.getElementById('salvarProfessor').addEventListener('click', function() {
        saveProfessor();
    });

    // Botão de limpar filtros
    document.querySelector('button[type="reset"]').addEventListener('click', function() {
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
            sessionStorage.setItem('redirectMessage', 'Você não tem permissão para acessar a página de gerenciamento de professores.');
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

// Inicializar a estrutura dos professores se necessário
function initializeProfessores() {
    // Converter professores antigos para o novo formato, se houver
    if (professores.length > 0 && professores[0].active !== undefined) {
        professores = professores.map(prof => {
            return {
                id: prof.id || generateId(),
                nome: prof.name || '',
                email: prof.email || '',
                matricula: prof.matricula || generateMatricula(),
                departamento: prof.departamento || 'computacao',
                status: prof.active ? 'ativo' : 'inativo',
                senha: prof.password || generatePassword()
            };
        });
        localStorage.setItem('professores', JSON.stringify(professores));
    }
    
    // Se não existirem professores, criar alguns exemplos
    if (professores.length === 0) {
        const profsExemplo = [
            {
                id: generateId(),
                nome: 'JOÃO SILVA',
                email: 'joao.silva@unilab.edu.br',
                matricula: generateMatricula(),
                departamento: 'computacao',
                status: 'ativo',
                senha: generatePassword()
            },
            {
                id: generateId(),
                nome: 'MARIA SANTOS',
                email: 'maria.santos@unilab.edu.br',
                matricula: generateMatricula(),
                departamento: 'fisica',
                status: 'ativo',
                senha: generatePassword()
            },
            {
                id: generateId(),
                nome: 'CARLOS FERREIRA',
                email: 'carlos.ferreira@unilab.edu.br',
                matricula: generateMatricula(),
                departamento: 'quimica',
                status: 'inativo',
                senha: generatePassword()
            }
        ];
        
        professores = profsExemplo;
        localStorage.setItem('professores', JSON.stringify(professores));
    }
}

// Carregar professores
function loadProfessores() {
    professores = JSON.parse(localStorage.getItem('professores')) || [];
    updateStatistics(professores);
    displayProfessores(professores);
}

// Atualizar estatísticas
function updateStatistics(profs) {
    const total = profs.length;
    const ativos = profs.filter(prof => prof.status === 'ativo').length;
    const inativos = profs.filter(prof => prof.status === 'inativo').length;
    
    // Contar departamentos únicos
    const departamentos = [...new Set(profs.map(prof => prof.departamento))];
    const totalDepartamentos = departamentos.length;

    document.getElementById('totalProfessores').textContent = total;
    document.getElementById('professoresAtivos').textContent = ativos;
    document.getElementById('professoresInativos').textContent = inativos;
    document.getElementById('totalDepartamentos').textContent = totalDepartamentos;
}

// Exibir professores na tabela
function displayProfessores(profs) {
    const tbody = document.getElementById('professoresTable');
    tbody.innerHTML = '';

    if (profs.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" class="text-center">Nenhum professor encontrado</td>`;
        tbody.appendChild(tr);
        return;
    }

    profs.forEach(prof => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prof.nome || ''}</td>
            <td>${prof.email || ''}</td>
            <td>${prof.matricula || ''}</td>
            <td>${formatDepartamento(prof.departamento || 'outro')}</td>
            <td><span class="status-badge status-${prof.status || 'inativo'}">${formatStatus(prof.status || 'inativo')}</span></td>
            <td>
                <button class="btn-action" onclick="editProfessor('${prof.id}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action" onclick="deleteProfessor('${prof.id}')" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn-action" onclick="showPassword('${prof.id}')" title="Mostrar Senha">
                    <i class="bi bi-key"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Filtrar professores
function filterProfessores() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const departamento = document.getElementById('departamentoFilter').value;

    let filteredProfs = professores.filter(prof => {
        const matchesSearch = (prof.nome || '').toLowerCase().includes(searchTerm) ||
                            (prof.email || '').toLowerCase().includes(searchTerm) ||
                            (prof.matricula || '').toLowerCase().includes(searchTerm);
        const matchesStatus = !status || prof.status === status;
        const matchesDepartamento = !departamento || prof.departamento === departamento;
        
        return matchesSearch && matchesStatus && matchesDepartamento;
    });

    displayProfessores(filteredProfs);
}

// Limpar filtros
function clearFilters() {
    document.getElementById('filterForm').reset();
    loadProfessores();
}

// Abrir modal de professor
function openProfessorModal(profId = null) {
    const modal = new bootstrap.Modal(document.getElementById('professorModal'));
    const form = document.getElementById('professorForm');
    const title = document.querySelector('#professorModal .modal-title');

    form.reset();
    if (profId) {
        title.innerHTML = '<i class="bi bi-person-gear"></i> Editar Professor';
        const prof = getProfessorById(profId);
        if (prof) {
            form.nome.value = prof.nome || '';
            form.email.value = prof.email || '';
            form.matricula.value = prof.matricula || '';
            form.departamento.value = prof.departamento || 'computacao';
            form.status.value = prof.status || 'ativo';
            form.dataset.profId = profId;
        }
    } else {
        title.innerHTML = '<i class="bi bi-person-plus"></i> Novo Professor';
        delete form.dataset.profId;
    }

    modal.show();
}

// Salvar professor
function saveProfessor() {
    const form = document.getElementById('professorForm');
    const profId = form.dataset.profId;
    const prof = {
        id: profId || generateId(),
        nome: form.nome.value.trim().toUpperCase(),
        email: form.email.value.trim().toLowerCase(),
        matricula: form.matricula.value.trim() || generateMatricula(),
        departamento: form.departamento.value,
        status: form.status.value,
        senha: profId ? getProfessorById(profId).senha : generatePassword()
    };

    if (!validateProfessor(prof)) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'danger');
        return;
    }
    
    if (profId) {
        // Atualizar professor existente
        professores = professores.map(p => p.id === profId ? prof : p);
    } else {
        // Adicionar novo professor
        professores.push(prof);
    }

    localStorage.setItem('professores', JSON.stringify(professores));
    
    try {
        const modalEl = document.getElementById('professorModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    } catch (e) {
        console.error('Erro ao fechar modal:', e);
    }
    
    loadProfessores();
    showNotification(`Professor ${profId ? 'atualizado' : 'adicionado'} com sucesso!`, 'success');
}

// Editar professor
function editProfessor(profId) {
    openProfessorModal(profId);
}

// Excluir professor
function deleteProfessor(profId) {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
        professores = professores.filter(prof => prof.id !== profId);
        localStorage.setItem('professores', JSON.stringify(professores));
        loadProfessores();
        showNotification('Professor excluído com sucesso!', 'success');
    }
}

// Mostrar senha do professor
function showPassword(profId) {
    const prof = getProfessorById(profId);
    if (prof) {
        alert(`Senha do professor ${prof.nome}: ${prof.senha}`);
    }
}

// Funções auxiliares
function getProfessorById(profId) {
    return professores.find(prof => prof.id === profId);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Gera uma senha aleatória com 10 caracteres
function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
    let password = "";
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Gera uma matrícula aleatória
function generateMatricula() {
    const ano = new Date().getFullYear();
    const num = Math.floor(Math.random() * 900000) + 100000; // 6 dígitos
    return `${ano}${num}`;
}

function validateProfessor(prof) {
    return prof.nome && prof.email && prof.matricula && prof.departamento && prof.status;
}

function formatStatus(status) {
    const statusMap = {
        'ativo': 'Ativo',
        'inativo': 'Inativo'
    };
    return statusMap[status] || status;
}

function formatDepartamento(departamento) {
    const deptoMap = {
        'computacao': 'Computação',
        'fisica': 'Física',
        'quimica': 'Química',
        'matematica': 'Matemática',
        'outro': 'Outro'
    };
    return deptoMap[departamento] || departamento;
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Verificar se existe um elemento de notificação no DOM
    let notification = document.getElementById('notification');
    
    // Se não existir, criar um
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `toast align-items-center text-white bg-${type} border-0`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.setAttribute('aria-atomic', 'true');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '5000';
        
        notification.innerHTML = `
            <div class="d-flex">
                <div class="toast-body" id="notificationBody">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
    } else {
        const notificationBody = document.getElementById('notificationBody');
        if (notificationBody) {
            notificationBody.textContent = message;
        }
        notification.className = `toast align-items-center text-white bg-${type} border-0`;
    }
    
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