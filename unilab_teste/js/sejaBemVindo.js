function openConfigModal() {
    const configModal = new bootstrap.Modal(document.getElementById('configModal'));
    configModal.show();
}

// Adiciona suporte para teclado: ativa o clique quando Enter ou Espaço for pressionado.
document.querySelectorAll('.card[role="button"]').forEach(function(card) {
    card.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            card.click();
        }
    });
});

// Elementos do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Seleção de elementos do DOM
    const actionCards = document.querySelectorAll('.action-card');
    const notificationBell = document.querySelector('.notification-bell');
    const notificationModal = document.getElementById('notificationModal');
    const userDropdown = document.getElementById('userDropdown');
    const userNameElement = document.querySelector('.user-name');
    const logoutButton = document.querySelector('.logout-button');
    const notificationList = document.querySelector('.notification-list');

    // Verificar e exibir mensagens de redirecionamento
    const redirectMessage = sessionStorage.getItem('redirectMessage');
    const redirectMessageType = sessionStorage.getItem('redirectMessageType') || 'info';
    
    if (redirectMessage) {
        showFeedback(redirectMessage, redirectMessageType);
        // Limpar após exibir
        sessionStorage.removeItem('redirectMessage');
        sessionStorage.removeItem('redirectMessageType');
    }

    // Função para mostrar feedback
    function showFeedback(message, type = 'success') {
        const feedback = document.createElement('div');
        feedback.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        feedback.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(feedback);

        // Remover feedback após 5 segundos
        setTimeout(() => {
            feedback.remove();
        }, 5000);
    }

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
        if (userName) {
            userNameElement.textContent = userName;
        }

        // Controlar visibilidade dos cards baseado no papel do usuário
        const managementCards = document.querySelectorAll('[data-action="manage-professors"], [data-action="manage-labs"]');
        managementCards.forEach(card => {
            if (userRole !== 'administrador') {
                card.style.display = 'none';
            }
        });
    }

    // Adicionar event listeners para os cards de ação
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const userRole = localStorage.getItem('userRole');

            // Verificar permissões para ações administrativas
            if ((action === 'manage-professors' || action === 'manage-labs') && userRole !== 'administrador') {
                showFeedback('Você não tem permissão para acessar esta funcionalidade.', 'danger');
                return;
            }

            // Redirecionar baseado na ação
            switch(action) {
                case 'schedule':
                    window.location.href = 'agendamento_lab.html';
                    break;
                case 'history':
                    window.location.href = 'historicoAgendamentos.html';
                    break;
                case 'manage-professors':
                    window.location.href = 'administradorGerenciarProfessores.html';
                    break;
                case 'manage-labs':
                    window.location.href = 'administradorGerenciarLaboratorios.html';
                    break;
            }
        });

        // Suporte a teclado
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Event Listener para o sino de notificações
    notificationBell.addEventListener('click', function() {
        // Marcar notificações como lidas
        this.querySelector('.notification-badge').style.display = 'none';
        // Simular carregamento de notificações
        simulateNotifications();
    });

    // Event Listener para logout
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        // Limpar dados do usuário
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
        // Redirecionar para página inicial
        window.location.href = 'index.html';
    });

    // Função para simular notificações
    function simulateNotifications() {
        const notifications = [
            {
                icon: 'bi-calendar-check',
                title: 'Novo Agendamento',
                description: 'Um novo agendamento foi realizado para o Laboratório de Informática.',
                time: '5 minutos atrás'
            },
            {
                icon: 'bi-exclamation-triangle',
                title: 'Manutenção Programada',
                description: 'O Laboratório de Química passará por manutenção amanhã.',
                time: '1 hora atrás'
            },
            {
                icon: 'bi-person-plus',
                title: 'Novo Professor',
                description: 'Um novo professor foi cadastrado no sistema.',
                time: '2 horas atrás'
            }
        ];

        notificationList.innerHTML = notifications.map(notification => `
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="bi ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <h6>${notification.title}</h6>
                    <p>${notification.description}</p>
                    <small>${notification.time}</small>
                </div>
            </div>
        `).join('');
    }

    // Adicionar animações suaves aos cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    actionCards.forEach(card => observer.observe(card));

    // Verificar autenticação ao carregar a página
    checkAuth();
});