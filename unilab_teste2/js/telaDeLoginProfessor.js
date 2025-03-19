// Seleção de elementos do DOM
const loginForm = document.getElementById('loginForm');
const feedback = document.getElementById('feedback');
const passwordToggle = document.querySelector('.password-toggle');
const passwordInput = document.getElementById('password');
const recoveryForm = document.getElementById('recoveryForm');
const sendRecovery = document.getElementById('sendRecovery');

// Estado do formulário
let isSubmitting = false;

// Função para mostrar feedback
function showFeedback(message, type = 'success') {
    feedback.className = `alert alert-${type} alert-dismissible fade show`;
    feedback.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    feedback.style.display = 'block';
}

// Função para validar o formulário
function validateForm() {
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        showFeedback('Por favor, preencha todos os campos.', 'danger');
        return false;
    }

    return true;
}

// Função para simular autenticação
async function authenticate(username, password) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Aqui você implementaria a lógica real de autenticação
    if (username === 'professor' && password === 'senha123') {
        // Salvar informações do usuário
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'professor');
        localStorage.setItem('userName', username);
        return true;
    }
    return false;
}

// Event Listeners

// Toggle de visibilidade da senha
passwordToggle.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    passwordToggle.querySelector('i').className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
});

// Envio do formulário de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    if (!validateForm()) {
        isSubmitting = false;
        return;
    }

    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const success = await authenticate(username, password);

        if (success) {
            showFeedback('Login realizado com sucesso! Redirecionando...', 'success');
            
            // Salvar preferência de "Lembrar-me"
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('username', username);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('username');
            }

            // Redirecionar após delay
            setTimeout(() => {
                window.location.href = 'sejaBemVindo.html';
            }, 1500);
        } else {
            showFeedback('Usuário ou senha incorretos.', 'danger');
        }
    } catch (error) {
        showFeedback('Erro ao realizar login. Tente novamente.', 'danger');
    } finally {
        isSubmitting = false;
    }
});

// Envio do formulário de recuperação de senha
sendRecovery.addEventListener('click', async () => {
    const email = document.getElementById('recoveryEmail').value.trim();
    
    if (!email) {
        showFeedback('Por favor, insira seu e-mail.', 'danger');
        return;
    }

    // Aqui você implementaria a lógica real de recuperação de senha
    showFeedback('Instruções de recuperação de senha enviadas para seu e-mail.', 'success');
    
    // Fechar modal após delay
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('recoveryModal'));
        modal.hide();
        recoveryForm.reset();
    }, 2000);
});

// Verificar preferência de "Lembrar-me" ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedUsername = localStorage.getItem('username');

    if (rememberMe && savedUsername) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('rememberMe').checked = true;
    }
});

// Inicializar tooltips do Bootstrap
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});