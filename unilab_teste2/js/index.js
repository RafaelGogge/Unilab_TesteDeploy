document.addEventListener("DOMContentLoaded", function () {
    // Base de conhecimento expandida para o assistente virtual
    const chatResponses = {
        "Como posso redefinir minha senha?":
            "Para redefinir sua senha, clique em 'Esqueceu sua senha?' na tela de login e siga as instruções. Você receberá um email com os passos para criar uma nova senha.",
        "Como faço para acessar como Administrador?":
            "Clique no botão 'Administrador' para ser redirecionado à página de login. Digite seu nome de usuário e senha para acessar todas as funcionalidades administrativas do sistema.",
        "Como posso acessar como Professor?":
            "Clique no botão 'Professor' para ser redirecionado à página de login. Digite suas credenciais fornecidas pela instituição para acessar as funcionalidades específicas para professores.",
        "Quais são os canais de suporte disponíveis?":
            "Oferecemos múltiplos canais de suporte: email (suporte@unilab.com), telefone (XX) XXXXX-XXXX, e chat online durante o horário comercial. Para problemas urgentes, o telefone é o meio mais rápido.",
        "Qual é o horário de atendimento?":
            "Nosso atendimento funciona de segunda a sexta, das 8h às 18h. Para emergências durante o fim de semana, temos um número de plantão disponível na seção de Suporte.",
        "Como atualizar meus dados cadastrais?":
            "Acesse sua conta, clique no ícone de perfil no canto superior direito e selecione 'Configurações'. Na seção 'Dados Pessoais', você pode atualizar todas as suas informações.",
        "Como acesso meu histórico de agendamento?":
            "No painel principal, clique em 'Histórico de Agendamentos'. Você pode filtrar por período, laboratório ou tipo de atividade para encontrar registros específicos.",
        "Quais horários estão indisponíveis?": obterHorariosIndisponiveis,
        "Como reservar um laboratório?":
            "Faça login como professor, selecione 'Agendar Laboratório', escolha a data, horário e laboratório desejados e confirme a reserva. Você receberá uma confirmação por email.",
        "Como cancelar uma reserva?":
            "Acesse 'Meus Agendamentos', localize a reserva que deseja cancelar e clique no botão 'Cancelar'. O cancelamento deve ser feito com pelo menos 24 horas de antecedência.",
        "Esqueci minha senha, o que fazer?":
            "Na tela de login, clique em 'Esqueceu sua senha?'. Siga as instruções para receber um link de redefinição no seu email cadastrado.",
        "Quais laboratórios estão disponíveis?":
            "Temos laboratórios de Informática, Química, Física e Biologia. Para ver detalhes de cada um, acesse a seção 'Laboratórios' no menu principal.",
        "Qual o limite de tempo para reservas?":
            "As reservas podem ser feitas por períodos de 1 hora até 4 horas consecutivas, dependendo da disponibilidade e política de cada laboratório."
    };

    // Estrutura de menus e tópicos do assistente
    const chatMenus = {
        // Menu principal
        main: {
            title: 'Como posso ajudar?',
            options: [
                {
                    id: 'agendamentos',
                    icon: 'bi-calendar-check',
                    text: 'Agendamentos',
                    menu: 'agendamentos'
                },
                {
                    id: 'laboratorios',
                    icon: 'bi-building-gear',
                    text: 'Laboratórios',
                    menu: 'laboratorios'
                },
                {
                    id: 'conta',
                    icon: 'bi-person-circle',
                    text: 'Minha Conta',
                    menu: 'conta'
                },
                {
                    id: 'tutoriais',
                    icon: 'bi-play-circle',
                    text: 'Tutoriais',
                    action: 'redirect',
                    url: 'tutoriais.html',
                    class: 'btn-tutorial'
                },
                {
                    id: 'suporte',
                    icon: 'bi-headset',
                    text: 'Falar com Suporte',
                    action: 'showInfo',
                    info: 'Nossa equipe de suporte está disponível nos seguintes canais:<br><br>• <b>E-mail</b>: suporte@unilab.com<br>• <b>Telefone</b>: (XX) XXXXX-XXXX<br>• <b>Chat online</b>: Segunda a sexta, das 8h às 18h<br><br>Em que mais posso ajudar?'
                },
                {
                    id: 'finalizar',
                    icon: 'bi-x-circle',
                    text: 'Finalizar Atendimento',
                    action: 'finalizar',
                    class: 'btn-danger'
                }
            ]
        },
        // Submenus
        agendamentos: {
            title: 'Agendamentos',
            options: [
                {
                    id: 'criar_agendamento',
                    icon: 'bi-plus-circle',
                    text: 'Criar Agendamento',
                    action: 'showInfo',
                    info: 'Para criar um agendamento, siga estes passos:<br>1. Faça login como professor<br>2. Acesse a opção "Agendar Laboratório"<br>3. Selecione a data, horário e laboratório desejados<br>4. Preencha o motivo do agendamento<br>5. Confirme a reserva'
                },
                {
                    id: 'verificar_horarios',
                    icon: 'bi-clock',
                    text: 'Verificar Horários',
                    action: 'showInfo',
                    info: 'Para verificar os horários disponíveis:<br>1. Acesse o menu "Laboratórios"<br>2. Selecione o laboratório desejado<br>3. Clique em "Ver Disponibilidade"<br>4. Use os filtros de data para navegar pelo calendário'
                },
                {
                    id: 'cancelar_agendamento',
                    icon: 'bi-x-circle',
                    text: 'Cancelar Agendamento',
                    action: 'showInfo',
                    info: 'Para cancelar um agendamento:<br>1. Acesse "Meus Agendamentos"<br>2. Localize o agendamento que deseja cancelar<br>3. Clique no botão "Cancelar"<br>4. Confirme a ação<br><br>Lembre-se: O cancelamento deve ser feito com pelo menos 24 horas de antecedência.'
                },
                {
                    id: 'historico_agendamentos',
                    icon: 'bi-clock-history',
                    text: 'Histórico',
                    action: 'showInfo',
                    info: 'Para acessar seu histórico de agendamentos:<br>1. Faça login em sua conta<br>2. No painel principal, clique em "Histórico de Agendamentos"<br>3. Use os filtros disponíveis para localizar agendamentos específicos por data, laboratório ou status'
                }
            ]
        },
        laboratorios: {
            title: 'Laboratórios',
            options: [
                {
                    id: 'lista_laboratorios',
                    icon: 'bi-list-check',
                    text: 'Lista de Laboratórios',
                    action: 'showInfo',
                    info: 'Nossos laboratórios disponíveis:<br><br>• <b>Lab de Informática</b>: 30 computadores, software de desenvolvimento e multimídia<br>• <b>Lab de Química</b>: Equipado para análises químicas, 25 estações<br>• <b>Lab de Física</b>: Experimentos de física, 20 estações<br>• <b>Lab de Biologia</b>: Microscópios e equipamentos para estudos biológicos'
                },
                {
                    id: 'equipamentos',
                    icon: 'bi-pc-display',
                    text: 'Equipamentos',
                    action: 'showInfo',
                    info: 'Para verificar os equipamentos disponíveis em cada laboratório:<br>1. Acesse o menu "Laboratórios"<br>2. Selecione o laboratório desejado<br>3. Clique na aba "Equipamentos"<br>4. Você verá uma lista detalhada com todos os recursos disponíveis'
                },
                {
                    id: 'regras_laboratorios',
                    icon: 'bi-shield-check',
                    text: 'Regras de Uso',
                    action: 'showInfo',
                    info: 'Regras principais para uso dos laboratórios:<br><br>• É proibido consumir alimentos ou bebidas<br>• Equipamentos devem ser utilizados conforme as instruções<br>• Problemas devem ser reportados imediatamente<br>• Materiais utilizados devem ser organizados ao final<br>• Respeite o horário agendado<br>• Alunos só podem utilizar sob supervisão de um professor'
                },
                {
                    id: 'manutenção',
                    icon: 'bi-tools',
                    text: 'Manutenção',
                    action: 'showInfo',
                    info: 'Para reportar problemas ou solicitar manutenção:<br>1. Acesse o menu "Suporte"<br>2. Selecione "Reportar Problema"<br>3. Escolha o laboratório e equipamento<br>4. Descreva detalhadamente o problema<br>5. Envie a solicitação<br><br>Nossa equipe técnica atenderá conforme a prioridade.'
                }
            ]
        },
        conta: {
            title: 'Minha Conta',
            options: [
                {
                    id: 'perfil',
                    icon: 'bi-person-vcard',
                    text: 'Perfil e Dados',
                    action: 'showInfo',
                    info: 'Para atualizar seus dados cadastrais:<br>1. Acesse sua conta<br>2. Clique no ícone de perfil no canto superior direito<br>3. Selecione "Configurações"<br>4. Na seção "Dados Pessoais", atualize suas informações<br>5. Clique em "Salvar Alterações"'
                },
                {
                    id: 'recuperar_senha',
                    icon: 'bi-key',
                    text: 'Recuperar Senha',
                    action: 'showInfo',
                    info: 'Para recuperar sua senha:<br>1. Na tela de login, clique em "Esqueceu sua senha?"<br>2. Informe seu e-mail cadastrado<br>3. Você receberá um link de redefinição por e-mail<br>4. Clique no link e defina uma nova senha<br>5. Use a nova senha para fazer login'
                },
                {
                    id: 'permissoes',
                    icon: 'bi-shield-lock',
                    text: 'Permissões',
                    action: 'showInfo',
                    info: 'Tipos de permissões no sistema:<br><br>• <b>Administrador</b>: Acesso completo a todas as funcionalidades<br>• <b>Professor</b>: Pode agendar laboratórios, gerenciar seus agendamentos e gerar relatórios<br>• <b>Monitor</b>: Pode visualizar agendamentos e auxiliar nas atividades<br><br>Para solicitar alteração de permissões, entre em contato com a administração.'
                },
                {
                    id: 'notificacoes',
                    icon: 'bi-bell',
                    text: 'Notificações',
                    action: 'showInfo',
                    info: 'Para configurar suas notificações:<br>1. Acesse sua conta<br>2. Clique no ícone de perfil no canto superior direito<br>3. Selecione "Configurações"<br>4. Vá para a aba "Notificações"<br>5. Escolha quais tipos de alertas deseja receber (e-mail, sistema, etc.)<br>6. Defina a frequência das notificações<br>7. Salve suas preferências'
                }
            ]
        },
        ajuda: {
            title: 'Ajuda e Suporte',
            options: [
                {
                    id: 'contato',
                    icon: 'bi-headset',
                    text: 'Contato',
                    action: 'showInfo',
                    info: 'Canais de suporte disponíveis:<br><br>• <b>E-mail</b>: suporte@unilab.com<br>• <b>Telefone</b>: (XX) XXXXX-XXXX<br>• <b>Chat online</b>: Disponível de segunda a sexta, das 8h às 18h<br>• <b>Presencial</b>: Bloco administrativo, sala 101<br><br>Horário de atendimento: Segunda a sexta, das 8h às 18h'
                },
                {
                    id: 'faq',
                    icon: 'bi-question-circle',
                    text: 'Perguntas Frequentes',
                    menu: 'faq'
                },
                {
                    id: 'problemas',
                    icon: 'bi-exclamation-triangle',
                    text: 'Reportar Problema',
                    action: 'showInfo',
                    info: 'Para reportar um problema técnico:<br>1. Descreva detalhadamente o que está acontecendo<br>2. Informe qual laboratório e equipamento estão envolvidos<br>3. Se possível, inclua capturas de tela<br>4. Envie para suporte@unilab.com ou use o formulário na seção "Suporte"<br><br>Nossa equipe responderá em até 24 horas úteis.'
                },
                {
                    id: 'tutoriais',
                    icon: 'bi-play-circle',
                    text: 'Ver Tutoriais',
                    action: 'redirect',
                    url: 'tutoriais.html',
                    class: 'btn-tutorial'
                }
            ]
        },
        faq: {
            title: 'Perguntas Frequentes',
            options: [
                {
                    id: 'faq_agendamento',
                    icon: 'bi-calendar-check',
                    text: 'Sobre Agendamentos',
                    action: 'showInfo',
                    info: '<b>Quanto tempo antes devo agendar um laboratório?</b><br>Recomendamos pelo menos 48 horas de antecedência para garantir disponibilidade.<br><br><b>Posso agendar vários horários consecutivos?</b><br>Sim, até o limite de 4 horas consecutivas por vez.<br><br><b>Como cancelar um agendamento?</b><br>Acesse "Meus Agendamentos" e clique em "Cancelar" no agendamento desejado. Cancele com pelo menos 24h de antecedência.'
                },
                {
                    id: 'faq_acesso',
                    icon: 'bi-door-open',
                    text: 'Sobre Acesso',
                    action: 'showInfo',
                    info: '<b>Posso delegar meu agendamento para outro professor?</b><br>Sim, através da opção "Transferir" em seus agendamentos.<br><br><b>Alunos podem acessar os laboratórios sozinhos?</b><br>Não, é necessária a presença do professor responsável.<br><br><b>O que acontece se eu não comparecer no horário agendado?</b><br>Após 20 minutos, o agendamento é automaticamente cancelado e registrado como ausência.'
                },
                {
                    id: 'faq_recursos',
                    icon: 'bi-pc-display',
                    text: 'Sobre Recursos',
                    action: 'showInfo',
                    info: '<b>Posso instalar softwares nos computadores?</b><br>Não, instalações devem ser solicitadas à equipe de TI.<br><br><b>É possível reservar equipamentos específicos?</b><br>Sim, na página de agendamento há um campo para solicitar recursos específicos.<br><br><b>Como solicitar um novo recurso/software?</b><br>Acesse "Suporte" e selecione "Solicitação de Recurso".'
                },
                {
                    id: 'faq_conta',
                    icon: 'bi-person-circle',
                    text: 'Sobre Contas',
                    action: 'showInfo',
                    info: '<b>Como recuperar minha senha?</b><br>Na tela de login, clique em "Esqueceu sua senha?" e siga as instruções.<br><br><b>Como atualizar meus dados de contato?</b><br>Acesse seu perfil e selecione a opção "Editar Informações".<br><br><b>O que fazer se minha conta estiver bloqueada?</b><br>Entre em contato com o suporte através do e-mail suporte@unilab.com.'
                }
            ]
        }
    };

    // Função para obter horários indisponíveis integrando com o sistema de agendamento
    function obterHorariosIndisponiveis() {
        function formatarDataLocal(data) {
            const [ano, mes, dia] = data.split("-");
            return `${dia}/${mes}/${ano}`;
        }
        let labs = JSON.parse(localStorage.getItem("laboratorios")) || [];
        let message = "";
        labs.forEach((lab, index) => {
            let agendamentos =
                JSON.parse(localStorage.getItem(`lab${index}_agendamentos`)) ||
                [];
            if (agendamentos.length > 0) {
                message += `No laboratório ${lab.nome}: `;
                agendamentos.forEach((ag) => {
                    message += `dia ${formatarDataLocal(ag.data)} (${ag.horario
                        }); `;
                });
                message += "\n";
            }
        });
        return message || "Nenhum horário indisponível registrado.";
    }

    // Classe para gerenciar o assistente virtual com simplicidade e robustez
    class AssistenteVirtual {
        constructor() {
            // Referencias aos elementos DOM
            this.chatIcon = document.querySelector('.chat-icon');
            this.chatPanel = document.querySelector('.chat-panel');
            this.chatClose = document.querySelector('.chat-close');
            this.chatBody = document.querySelector('.chat-body');
            this.menuOptions = document.querySelector('.menu-options');
            this.topicOptions = document.querySelector('.topic-options');
            this.backButton = document.getElementById('back-button');
            this.homeButton = document.getElementById('home-button');
            
            // Estado interno
            this.isOpen = false;
            this.currentMenu = 'main';
            this.lastInteractionTime = Date.now();
            this.inactivityTimer = null;
            
            // Inicializar event listeners
            this.setupEventListeners();
        }
        
        // Configurar todos os event listeners
        setupEventListeners() {
            if (!this.chatIcon || !this.chatPanel || !this.chatClose) {
                console.error('Elementos do chat não encontrados');
                return;
            }
            
            // Abrir chat ao clicar no ícone
            this.chatIcon.addEventListener('click', () => {
                this.openChat();
            });
            
            // Fechar chat ao clicar no X
            this.chatClose.addEventListener('click', () => {
                this.closeChat();
            });
            
            // Botão de voltar para o menu principal
            if (this.backButton) {
                this.backButton.addEventListener('click', () => {
                    this.addSystemMessage('Voltando ao menu anterior...');
                    this.showMenu('main');
                });
            }
            
            // Botão de home
            if (this.homeButton) {
                this.homeButton.addEventListener('click', () => {
                    this.addSystemMessage('Voltando ao menu principal...');
                    this.showMenu('main');
                });
            }
            
            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (this.isOpen && 
                    !this.chatPanel.contains(e.target) && 
                    !this.chatIcon.contains(e.target)) {
                    this.closeChat();
                }
            });
            
            // Monitorar atividade do usuário
            document.addEventListener('mousemove', () => this.resetInactivityTimer());
            document.addEventListener('click', () => this.resetInactivityTimer());
            document.addEventListener('keypress', () => this.resetInactivityTimer());
            document.addEventListener('scroll', () => this.resetInactivityTimer());
            
            // Adicionar a pulsação do botão após um tempo
            setTimeout(() => {
                if (!this.isOpen && this.chatIcon) {
                    this.chatIcon.classList.add('pulsate');
                }
            }, 5000);
        }
        
        // Resetar timer de inatividade
        resetInactivityTimer() {
            this.lastInteractionTime = Date.now();
        }
        
        // Iniciar verificação de inatividade
        startInactivityCheck() {
            // Limpar qualquer timer existente
            if (this.inactivityTimer) {
                clearInterval(this.inactivityTimer);
            }
            
            // Iniciar um novo timer de verificação de inatividade
            this.inactivityTimer = setInterval(() => {
                const now = Date.now();
                const timeSinceLastInteraction = now - this.lastInteractionTime;
                
                // Se passaram mais de 20 segundos sem interação e o chat estiver aberto
                if (timeSinceLastInteraction > 20000 && this.isOpen) {
                    this.addMessage('Notei que você está há algum tempo na página. Posso ajudar em algo?', 'bot');
                    this.resetInactivityTimer();
                }
            }, 1000); // Verificar a cada segundo
        }
        
        // Abrir o chat
        openChat() {
            if (!this.chatPanel || !this.chatIcon) return;
            
            this.isOpen = true;
            this.chatIcon.classList.remove('pulsate');
            this.chatPanel.classList.add('show');
            this.chatIcon.style.display = 'none';
            
            // Limpar e inicializar
            this.initChat();
            
            // Iniciar verificação de inatividade quando o chat for aberto
            this.startInactivityCheck();
        }
        
        // Fechar o chat
        closeChat() {
            if (!this.chatPanel || !this.chatIcon) return;
            
            this.isOpen = false;
            this.chatPanel.classList.remove('show');
            this.chatIcon.style.display = 'flex';
        }
        
        // Inicializar o chat
        initChat() {
            console.log("Inicializando chat...");
            
            // Garantir que os elementos existam
            if (!this.chatBody || !this.menuOptions || !this.topicOptions) {
                console.error("Elementos essenciais do chat não encontrados");
                return;
            }
            
            // Limpar conteúdo existente
            this.chatBody.innerHTML = '';
            this.menuOptions.innerHTML = '';
            this.topicOptions.innerHTML = '';
            
            // Adicionar mensagem de boas-vindas
            this.addMessage('Olá! Sou o assistente virtual da UniLab. Como posso ajudar você hoje?', 'bot');
            
            // Mostrar menu principal
            this.showMenu('main');
        }
        
        // Obter data e hora atual formatadas
        getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        
        // Adicionar mensagem ao chat
        addMessage(message, sender = "user") {
            if (!this.chatBody) return;
            
            const messageDiv = document.createElement("div");
            messageDiv.className = `chat-message ${
                sender === "user" ? "message-sent" : "message-received"
            }`;
            
            const time = this.getCurrentTime();
            messageDiv.innerHTML = `
                ${message}
                <div class="timestamp">${time}</div>
            `;
            
            this.chatBody.appendChild(messageDiv);
            
            // Garantir que a rolagem sempre vá para o final após adicionar uma mensagem
            setTimeout(() => {
                this.chatBody.scrollTop = this.chatBody.scrollHeight;
            }, 50);
        }
        
        // Adicionar mensagem de sistema (centralizada)
        addSystemMessage(message) {
            if (!this.chatBody) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-system';
            messageDiv.textContent = message;
            
            this.chatBody.appendChild(messageDiv);
            this.chatBody.scrollTop = this.chatBody.scrollHeight;
        }
        
        // Mostrar indicador de digitação
        showTypingIndicator() {
            if (!this.chatBody) return null;
            
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator message-received';
            typingDiv.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            this.chatBody.appendChild(typingDiv);
            this.chatBody.scrollTop = this.chatBody.scrollHeight;
            return typingDiv;
        }
        
        // Adicionar divisor de seção
        addSectionDivider(text) {
            if (!this.chatBody) return;
            
            const divider = document.createElement('div');
            divider.className = 'section-divider';
            divider.textContent = text;
            
            this.chatBody.appendChild(divider);
            this.chatBody.scrollTop = this.chatBody.scrollHeight;
        }
        
        // Mostrar menu específico
        showMenu(menuId, addTitle = true) {
            console.log("Mostrando menu:", menuId);
            
            // Verificar se o menu existe
            const menu = chatMenus[menuId];
            if (!menu) {
                console.error("Menu não encontrado:", menuId);
                return;
            }
            
            // Atualizar estado atual
            this.currentMenu = menuId;
            
            // Limpar opções anteriores
            if (this.menuOptions) this.menuOptions.innerHTML = '';
            if (this.topicOptions) this.topicOptions.innerHTML = '';
            
            // Adicionar título do menu
            if (addTitle) {
                this.addSystemMessage(menu.title);
            }
            
            // Verificar se temos onde mostrar os botões
            if (!this.menuOptions) {
                console.error("Container de menu não encontrado");
                return;
            }
            
            // Adicionar opções do menu com layout adaptativo
            const optionsCount = menu.options.length;
            
            // Determinar classe baseada na quantidade de opções
            let buttonClass = 'menu-btn';
            let buttonStyle = '';
            
            if (optionsCount <= 2) {
                // Poucos botões - mais largos
                buttonClass += ' full-width-btn';
                buttonStyle = 'display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 0.5rem; padding: 0.4rem 0.75rem;';
            } else if (optionsCount <= 4) {
                // Poucos botões - layout 2x2
                buttonStyle = 'flex: 1 0 calc(50% - 0.4rem);';
            } else if (optionsCount <= 6) {
                // Médio número de botões - layout 2x3 ou 3x2
                buttonStyle = 'flex: 1 0 calc(33% - 0.4rem);';
            } else {
                // Muitos botões - layout compacto 3x3+
                buttonStyle = 'flex: 1 0 calc(33% - 0.4rem); min-height: 35px; font-size: 0.7rem;';
            }
            
            menu.options.forEach(option => {
                const button = document.createElement('button');
                button.className = `${buttonClass} ${option.class || ''}`;
                button.style.cssText = buttonStyle;
                
                // Conteúdo do botão adaptado
                if (optionsCount <= 2) {
                    button.innerHTML = `<i class="bi ${option.icon}"></i> ${option.text}`;
                } else {
                    button.innerHTML = `<i class="bi ${option.icon}"></i>${option.text}`;
                }
                
                button.addEventListener('click', () => {
                    this.handleMenuOption(option);
                });
                
                this.menuOptions.appendChild(button);
            });
            
            // Mostrar/esconder botões de navegação
            if (this.backButton && this.homeButton) {
                this.backButton.style.display = menuId === 'main' ? 'none' : 'inline-block';
                this.homeButton.style.display = menuId === 'main' ? 'none' : 'inline-block';
            }
            
            // Rolar para o final do chat depois de adicionar os botões
            setTimeout(() => {
                if (this.chatBody) {
                    this.chatBody.scrollTop = this.chatBody.scrollHeight;
                }
            }, 100);
        }
        
        // Manipular clique em opção de menu
        handleMenuOption(option) {
            // Resetar o timer de inatividade quando o usuário interage
            this.resetInactivityTimer();
            
            // Adicionar mensagem do usuário indicando a seleção
            this.addMessage(option.text, 'user');
            
            // Simular digitação
            const typingIndicator = this.showTypingIndicator();
            
            // Processar com um pequeno delay para simular resposta
            setTimeout(() => {
                // Remover indicador de digitação
                if (typingIndicator) {
                    typingIndicator.remove();
                }
                
                // Verificar tipo de ação
                if (option.action === 'finalizar') {
                    // Finalizar o atendimento
                    this.addMessage('Atendimento finalizado. Obrigado por utilizar o Assistente UniLab!', 'bot');
                    setTimeout(() => {
                        this.closeChat();
                    }, 2000);
                } else if (option.menu) {
                    // Navegar para outro menu
                    this.showMenu(option.menu);
                } else if (option.action === 'showInfo') {
                    // Mostrar informação
                    this.addMessage(option.info, 'bot');
                } else if (option.action === 'redirect') {
                    // Redirecionar para outra página
                    this.addMessage(`Redirecionando para ${option.text}...`, 'bot');
                    setTimeout(() => {
                        window.location.href = option.url;
                    }, 1000);
                }
            }, 800); // Delay para simular digitação
        }
    }

    // Criar e inicializar o assistente virtual quando o DOM estiver pronto
    const assistente = new AssistenteVirtual();
    
    // Abrir o assistente automaticamente após 10 segundos
    setTimeout(() => {
        if (!assistente.isOpen) {
            assistente.openChat();
        }
    }, 10000);
    
    // Animações suaves ao scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Detectar modo escuro do sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkScheme.addListener((e) => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });

    // Inicializar modo escuro baseado na preferência do sistema
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    }

    // Adicionar classe active ao link atual na navegação
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Animação de fade-in para elementos ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .user-card').forEach(el => {
        observer.observe(el);
    });
});