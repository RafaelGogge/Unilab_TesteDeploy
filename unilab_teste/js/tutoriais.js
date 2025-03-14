// Dados dos tutoriais (exemplo)
const tutorials = [
    {
        id: 1,
        title: "Como fazer login no sistema",
        description: "Aprenda a acessar o sistema UniLab com sua conta de administrador ou professor.",
        thumbnail: "imagens/tutorial-login.jpg",
        duration: "2:30",
        category: "administracao",
        videoUrl: "https://www.youtube.com/embed/VIDEO_ID_1"
    },
    {
        id: 2,
        title: "Agendando um laboratório",
        description: "Tutorial completo sobre como agendar um laboratório no sistema UniLab.",
        thumbnail: "imagens/tutorial-agendamento.jpg",
        duration: "5:15",
        category: "agendamento",
        videoUrl: "https://www.youtube.com/embed/VIDEO_ID_2"
    },
    {
        id: 3,
        title: "Gerenciando notificações",
        description: "Saiba como configurar e gerenciar suas notificações no sistema.",
        thumbnail: "imagens/tutorial-notificacoes.jpg",
        duration: "3:45",
        category: "notificacoes",
        videoUrl: "https://www.youtube.com/embed/VIDEO_ID_3"
    }
    // Adicione mais tutoriais conforme necessário
];

// Elementos do DOM
const tutorialGrid = document.getElementById('tutorialGrid');
const searchInput = document.getElementById('searchTutorial');
const categoryButtons = document.querySelectorAll('.list-group-item');
const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
const tutorialVideo = document.getElementById('tutorialVideo');

// Função para criar um card de tutorial
function createTutorialCard(tutorial) {
    return `
        <div class="tutorial-card" data-id="${tutorial.id}">
            <div class="tutorial-thumbnail">
                <img src="${tutorial.thumbnail}" alt="${tutorial.title}">
                <span class="tutorial-duration">${tutorial.duration}</span>
            </div>
            <div class="tutorial-info">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description}</p>
                <div class="tutorial-meta">
                    <i class="bi bi-clock"></i>
                    <span>${tutorial.duration}</span>
                </div>
            </div>
        </div>
    `;
}

// Função para filtrar tutoriais
function filterTutorials(searchTerm = '', category = 'todos') {
    return tutorials.filter(tutorial => {
        const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'todos' || tutorial.category === category;
        return matchesSearch && matchesCategory;
    });
}

// Função para renderizar tutoriais
function renderTutorials(tutorialsToShow) {
    tutorialGrid.innerHTML = tutorialsToShow.map(createTutorialCard).join('');
}

// Event Listeners

// Pesquisa
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    const activeCategory = document.querySelector('.list-group-item.active').dataset.category;
    const filteredTutorials = filterTutorials(searchTerm, activeCategory);
    renderTutorials(filteredTutorials);
});

// Categorias
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.dataset.category;
        const searchTerm = searchInput.value;
        const filteredTutorials = filterTutorials(searchTerm, category);
        renderTutorials(filteredTutorials);
    });
});

// Clique no card de tutorial
tutorialGrid.addEventListener('click', (e) => {
    const tutorialCard = e.target.closest('.tutorial-card');
    if (tutorialCard) {
        const tutorialId = tutorialCard.dataset.id;
        const tutorial = tutorials.find(t => t.id === parseInt(tutorialId));
        
        if (tutorial) {
            tutorialVideo.src = tutorial.videoUrl;
            document.getElementById('videoModalLabel').textContent = tutorial.title;
            videoModal.show();
        }
    }
});

// Limpar iframe ao fechar o modal
document.getElementById('videoModal').addEventListener('hidden.bs.modal', () => {
    tutorialVideo.src = '';
});

// Renderizar tutoriais iniciais
renderTutorials(tutorials);

// Adicionar suporte a teclas de atalho
document.addEventListener('keydown', (e) => {
    // ESC para fechar o modal
    if (e.key === 'Escape' && videoModal._isShown) {
        videoModal.hide();
    }
    
    // / para focar na barra de pesquisa
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchInput.focus();
    }
}); 