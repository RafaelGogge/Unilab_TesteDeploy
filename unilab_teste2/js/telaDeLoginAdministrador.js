document.addEventListener('DOMContentLoaded', function() {
    // Seleção de elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const passwordToggle = document.querySelector('.password-toggle');
    const feedback = document.getElementById('feedback');
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryEmail = document.getElementById('recoveryEmail');
    const sendRecoveryBtn = document.getElementById('sendRecovery');

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

        // Remover alerta após 5 segundos
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }

    // Função para validar formulário
    function validateForm() {
        let isValid = true;
        
        // Validar usuário
        if (!usernameInput.value.trim()) {
            usernameInput.classList.add('is-invalid');
            isValid = false;
        } else {
            usernameInput.classList.remove('is-invalid');
        }

        // Validar senha
        if (!passwordInput.value) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        } else {
            passwordInput.classList.remove('is-invalid');
        }

        return isValid;
    }

    // Função para simular autenticação
    async function authenticate(username, password) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Credenciais de teste
        if (username === 'rafael' && password === '123456') {
            // Salvar informações do usuário
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', 'administrador');
            localStorage.setItem('userName', username);
            return { success: true, message: 'Login realizado com sucesso!' };
        }

        return { 
            success: false, 
            message: 'Usuário ou senha incorretos. Tente novamente.' 
        };
    }

    // Event Listeners

    // Toggle visibilidade da senha
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        passwordToggle.querySelector('i').classList.toggle('bi-eye');
        passwordToggle.querySelector('i').classList.toggle('bi-eye-slash');
    });

    // Envio do formulário de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showFeedback('Por favor, preencha todos os campos obrigatórios.', 'danger');
            return;
        }

        if (isSubmitting) return;
        isSubmitting = true;

        // Desabilitar botão e mostrar loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Entrando...
        `;

        try {
            const result = await authenticate(usernameInput.value, passwordInput.value);

            if (result.success) {
                // Salvar usuário se "Lembrar-me" estiver marcado
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedUsername', usernameInput.value);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }

                showFeedback(result.message, 'success');
                
                // Redirecionar após 1.5 segundos
                setTimeout(() => {
                    window.location.href = 'sejaBemVindo.html';
                }, 1500);
            } else {
                showFeedback(result.message, 'danger');
            }
        } catch (error) {
            showFeedback('Ocorreu um erro ao tentar fazer login. Tente novamente.', 'danger');
        } finally {
            // Restaurar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            isSubmitting = false;
        }
    });

    // Recuperação de senha
    sendRecoveryBtn.addEventListener('click', async () => {
        if (!recoveryEmail.value.trim()) {
            recoveryEmail.classList.add('is-invalid');
            return;
        }

        recoveryEmail.classList.remove('is-invalid');
        sendRecoveryBtn.disabled = true;
        sendRecoveryBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Enviando...
        `;

        // Simular envio de e-mail
        setTimeout(() => {
            showFeedback('E-mail de recuperação enviado com sucesso!', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('recoveryModal'));
            modal.hide();
            recoveryForm.reset();
            
            // Restaurar botão
            sendRecoveryBtn.disabled = false;
            sendRecoveryBtn.innerHTML = '<i class="bi bi-send"></i>Enviar';
        }, 1500);
    });

    // Carregar usuário salvo
    document.addEventListener('DOMContentLoaded', () => {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            usernameInput.value = rememberedUsername;
            rememberMeCheckbox.checked = true;
        }

        // Focar no primeiro campo vazio
        if (!usernameInput.value) {
            usernameInput.focus();
        } else if (!passwordInput.value) {
            passwordInput.focus();
        }
    });

    // Prevenir envio do formulário ao pressionar Enter
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (e.target === usernameInput) {
                    passwordInput.focus();
                } else {
                    loginForm.requestSubmit();
                }
            }
        });
    });
}); 