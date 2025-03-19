// Função para verificar se existem laboratórios cadastrados
function verificarLaboratoriosCadastrados() {
    const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
    
    if (laboratorios.length === 0) {
        alert("Não existem laboratórios cadastrados. Por favor, cadastre um laboratório primeiro.");
        window.location.href = "sejaBemVindo.html";
        return false;
    }
    return true;
}

// Função para criar o carrossel de laboratórios
function criarCarrosselLaboratorios() {
    const laboratorios = JSON.parse(localStorage.getItem("laboratorios")) || [];
    const container = document.querySelector(".login-container");
    const titulo = document.querySelector(".login-title");
    
    // Esconder todos os elementos do formulário inicialmente
    const elementsToHide = [
        ...container.querySelectorAll('div:not(.carousel-container)'),
        ...container.querySelectorAll('button:not(.carousel-control-prev):not(.carousel-control-next)')
    ];
    
    elementsToHide.forEach(el => {
        if (!el.classList.contains('login-title')) {
            el.style.display = 'none';
        }
    });
    
    // Criar o container do carrossel
    const carrosselContainer = document.createElement("div");
    carrosselContainer.className = "carousel-container mb-4";
    
    // Criar o carrossel
    const carrossel = document.createElement("div");
    carrossel.id = "labCarousel";
    carrossel.className = "carousel slide";
    carrossel.setAttribute("data-bs-ride", "carousel");
    
    // Criar os indicadores
    const indicadores = document.createElement("div");
    indicadores.className = "carousel-indicators";
    
    // Criar o container dos slides
    const slidesContainer = document.createElement("div");
    slidesContainer.className = "carousel-inner";
    
    // Criar os slides
    laboratorios.forEach((lab, index) => {
        // Criar indicador
        const indicador = document.createElement("button");
        indicador.type = "button";
        indicador.setAttribute("data-bs-target", "#labCarousel");
        indicador.setAttribute("data-bs-slide-to", index.toString());
        if (index === 0) indicador.className = "active";
        indicador.setAttribute("aria-current", "true");
        indicador.setAttribute("aria-label", `Slide ${index + 1}`);
        indicadores.appendChild(indicador);

        // Criar slide
        const slide = document.createElement("div");
        slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        slide.setAttribute("data-lab-index", index.toString());
        
        // Conteúdo do slide
        const slideContent = document.createElement('div');
        slideContent.className = 'carousel-content text-center p-4';
        
        // Formatar as ferramentas para exibição
        const ferramentasHtml = lab.recursos && lab.recursos.length > 0
            ? `<div class="recursos-grid">
                ${lab.recursos.map(recurso => `
                    <div class="recurso-item">
                        <div class="recurso-icon">
                            <i class="bi bi-${recurso.icon}"></i>
                        </div>
                        <div class="recurso-nome">${recurso.nome}</div>
                    </div>
                `).join('')}
               </div>`
            : '<p class="text-muted">Nenhuma ferramenta cadastrada</p>';

        // Verificar agendamentos existentes
        const agendamentosLab = JSON.parse(localStorage.getItem(`lab${index}_agendamentos`)) || [];
        const hoje = new Date();
        
        // Organizar agendamentos por data
        const agendamentosPorData = {};
        agendamentosLab.forEach(ag => {
            const dataAg = new Date(ag.data);
            const dataKey = dataAg.toLocaleDateString('pt-BR');
            if (!agendamentosPorData[dataKey]) {
                agendamentosPorData[dataKey] = [];
            }
            agendamentosPorData[dataKey].push(ag);
        });

        // Criar HTML para agendamentos
        const todosAgendamentos = Object.entries(agendamentosPorData)
            .sort(([data1], [data2]) => {
                const [dia1, mes1, ano1] = data1.split('/').map(Number);
                const [dia2, mes2, ano2] = data2.split('/').map(Number);
                return new Date(ano1, mes1 - 1, dia1) - new Date(ano2, mes2 - 1, dia2);
            });

        const agendamentosHtml = agendamentosLab.length > 0
            ? `<div class="agendamentos-container">
                <h4 class="agendamentos-title mb-3">
                    <i class="bi bi-calendar-check"></i>
                    Todos os Agendamentos
                </h4>
                <div class="agendamentos-grid">
                    ${todosAgendamentos.map(([data, agendamentos]) => `
                        <div class="agendamento-date-group">
                            <div class="data-header">${data}</div>
                            ${agendamentos.map(ag => `
                                <div class="agendamento-item ${new Date(ag.data).toLocaleDateString('pt-BR') === hoje.toLocaleDateString('pt-BR') ? 'hoje' : ''}">
                                    <div class="horario">
                                        <i class="bi bi-clock"></i>
                                        ${ag.horario}
                                    </div>
                                    <div class="professor">
                                        <i class="bi bi-person"></i>
                                        Prof. ${ag.professor}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
               </div>`
            : '<p class="text-muted">Nenhum agendamento registrado</p>';

        slideContent.innerHTML = `
            <div class="lab-header">
                <div class="lab-title-container">
                    <button class="carousel-control-prev" type="button" data-bs-target="#labCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <h3 class="lab-title">${lab.nome}</h3>
                    <button class="carousel-control-next" type="button" data-bs-target="#labCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Próximo</span>
                    </button>
                </div>
                <button class="btn btn-primary btn-lg selecionar-lab mb-4" data-lab-index="${index}">
                    <i class="bi bi-check-circle"></i>
                    Selecionar este laboratório
                </button>
            </div>
            <div class="lab-info">
                <div class="info-section">
                    <div class="info-item">
                        <i class="bi bi-people-fill"></i>
                        <span><strong>Capacidade:</strong> ${lab.capacidade} alunos</span>
                    </div>
                </div>
                <div class="recursos-container mb-4">
                    <h4 class="recursos-title mb-3">
                        <i class="bi bi-tools"></i>
                        Ferramentas Disponíveis
                    </h4>
                    ${ferramentasHtml}
                </div>
                ${agendamentosHtml}
            </div>
        `;
        
        slide.appendChild(slideContent);
        slidesContainer.appendChild(slide);
    });

    // Montar o carrossel
    carrossel.appendChild(indicadores);
    carrossel.appendChild(slidesContainer);
    
    // Remover os controles anteriores do carrossel principal
    // prevControl.remove();
    // nextControl.remove();
    
    carrosselContainer.appendChild(carrossel);

    // Criar botão de voltar
    const backButtonContainer = document.createElement("div");
    backButtonContainer.className = "text-center mt-4 back-button-container";
    backButtonContainer.innerHTML = `
        <button class="btn btn-secondary btn-lg" onclick="window.location.href='sejaBemVindo.html'">
            Voltar
        </button>
    `;
    
    // Adicionar CSS inline para o carrossel
    const style = document.createElement('style');
    style.textContent = `
        .login-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            color: #333;
        }

        .login-title {
            color: #333;
            margin-bottom: 2rem;
            text-align: center;
            font-size: 2.2rem;
            font-weight: 600;
        }

        .carousel-container {
            max-width: 700px;
            margin: 0 auto 3rem;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 1rem;
        }

        .carousel-content {
            background: #f8f9fa;
            border-radius: 10px;
            min-height: 400px;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            color: #333;
        }

        .lab-title {
            color: #0d6efd;
            font-size: 2rem;
            font-weight: 600;
        }

        .lab-info {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 1.5rem;
            width: 100%;
        }

        .info-section {
            margin-bottom: 1.5rem;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.8rem;
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            margin-bottom: 0.5rem;
        }

        .info-item i {
            color: #0d6efd;
            font-size: 1.2rem;
        }

        .recursos-container {
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1rem;
        }

        .recursos-title {
            color: #0d6efd;
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .recursos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .recurso-item {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            transition: all 0.3s ease;
        }

        .recurso-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-color: #0d6efd;
        }

        .recurso-icon {
            color: #0d6efd;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .recurso-nome {
            color: #333;
            font-size: 0.9rem;
        }

        .agendamentos-container {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
        }

        .agendamentos-title {
            color: #0d6efd;
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .agendamentos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }

        .agendamento-date-group {
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 1rem;
        }

        .data-header {
            color: #0d6efd;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .agendamento-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.8rem;
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 4px;
        }

        .horario {
            color: #333;
            font-size: 0.9rem;
        }

        .professor {
            color: #333;
            font-size: 0.9rem;
        }

        .hoje {
            background-color: #0d6efd;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
        }

        .carousel-control-prev-icon,
        .carousel-control-next-icon {
            background-color: #0d6efd;
            border-radius: 50%;
            padding: 1.5rem;
        }

        .carousel-indicators {
            bottom: -3rem;
        }

        .carousel-indicators button {
            background-color: #dee2e6;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 5px;
        }

        .carousel-indicators .active {
            background-color: #0d6efd;
        }

        .selecionar-lab {
            background-color: #0d6efd;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .selecionar-lab:hover {
            background-color: #0b5ed7;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
        }

        .back-button-container {
            margin-top: 2rem;
        }

        .back-button-container .btn-secondary {
            background-color: #6c757d;
            border: none;
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }

        .back-button-container .btn-secondary:hover {
            background-color: #5c636a;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        }

        /* Estilo para o formulário quando visível */
        .form-label {
            color: #333;
        }

        .form-control {
            background-color: #ffffff;
            border: 1px solid #dee2e6;
            color: #333;
        }

        .form-control:focus {
            background-color: #ffffff;
            border-color: #0d6efd;
            color: #333;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .btn-custom {
            background-color: #0d6efd;
            border: none;
            color: white;
            transition: all 0.3s ease;
            margin: 0.5rem;
        }

        .btn-custom:hover {
            background-color: #0b5ed7;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
        }

        .status-container {
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1.5rem;
        }

        .status-title {
            color: #0d6efd;
            margin-bottom: 1rem;
        }

        .status-list {
            color: #333;
            list-style: none;
            padding: 0;
        }

        .status-list li {
            padding: 0.8rem;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    // Inserir o carrossel e o botão de voltar após o título
    container.insertBefore(carrosselContainer, titulo.nextSibling);
    container.insertBefore(backButtonContainer, carrosselContainer.nextSibling);
    
    // Adicionar evento de clique nos botões de seleção
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('selecionar-lab')) {
            const index = e.target.getAttribute('data-lab-index');
            const labSelecionado = laboratorios[index];
            
            // Atualizar título e agendamentos
            document.title = `Agendamento - ${labSelecionado.nome}`;
            titulo.textContent = `Agendamento: ${labSelecionado.nome}`;
            
            // Carregar agendamentos do laboratório selecionado
            window.labAtual = index;
            window.labGlobal = labSelecionado; // Necessário para a função de reserva
            agendamentos = JSON.parse(localStorage.getItem(`lab${index}_agendamentos`)) || [];
            
            // Mostrar todos os elementos do formulário
            elementsToHide.forEach(el => {
                if (!el.classList.contains('login-title')) {
                    el.style.display = '';
                }
            });
            
            // Esconder o carrossel e o botão de voltar
            carrosselContainer.style.display = 'none';
            backButtonContainer.style.display = 'none';
            
            // Atualizar a lista de agendamentos
            atualizarStatus();
        }
    });
}

// Executar verificação quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
    if (verificarLaboratoriosCadastrados()) {
        criarCarrosselLaboratorios();
    }
});

// Dados dos laboratórios
const laboratorios = [];

// Dados dos professores
const professores = []; 