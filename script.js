// Определяем телефон
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Основная логика сайта
document.addEventListener('DOMContentLoaded', () => {
    initGames();
    initSearch();
    
    if (!isMobile) {
        initSettings();
    }
    
    initModals();
    
    // Закрытие игры по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer.classList.contains('active')) {
                closeGame();
            }
        }
    });
    
    // Кнопка закрытия игры
    document.getElementById('closeGameBtn').addEventListener('click', closeGame);
    
    // Блокируем прокрутку при касании canvas
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.addEventListener('touchstart', (e) => {
        e.preventDefault();
    });
    
    // Предотвращаем прокрутку страницы при свайпах на телефоне
    document.body.addEventListener('touchmove', (e) => {
        if (document.getElementById('gameContainer').classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Закрытие игры
function closeGame() {
    const gameContainer = document.getElementById('gameContainer');
    const gameFrame = document.getElementById('gameFrame');
    gameContainer.classList.remove('active');
    gameFrame.src = '';
}

// Инициализация игр
function initGames() {
    const grid = document.getElementById('gamesGrid');
    
    gamesDatabase.forEach(game => {
        const card = createGameCard(game);
        grid.appendChild(card);
    });
}

// Создание карточки игры
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.gameId = game.id;
    
    const modeTags = game.modes.map(mode => {
        let displayMode = mode;
        if (mode === '1P') displayMode = '1 игрок';
        else if (mode === 'bot') displayMode = '🤖 Бот';
        else if (mode.includes('multi')) displayMode = '👥 ' + mode;
        return `<span class="mode-tag">${displayMode}</span>`;
    }).join('');
    
    card.innerHTML = `
        <div class="game-card-content">
            <img src="${game.icon}" alt="${game.name}" class="game-icon" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' fill=\'%231e2429\'/%3E%3Ctext x=\'32\' y=\'40\' font-size=\'24\' text-anchor=\'middle\' fill=\'%237b4ae2\'%3E${game.name[0]}%3C/text%3E%3C/svg%3E'">
            <div class="game-info">
                <h3>${game.name}</h3>
                <div class="game-modes">
                    ${modeTags}
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showGameModes(game));
    
    return card;
}

// Показ режимов игры
function showGameModes(game) {
    const modal = document.getElementById('modeModal');
    const title = document.getElementById('modalGameTitle');
    const modesGrid = document.getElementById('modesGrid');
    
    title.textContent = `${game.name} - выберите режим`;
    modesGrid.innerHTML = '';
    
    game.modes.forEach(mode => {
        const button = document.createElement('button');
        button.className = 'mode-btn';
        
        let text = '';
        if (mode === '1P') text = '👤 Одиночная игра';
        else if (mode === 'bot') text = '🤖 С ботом';
        else if (mode.includes('multi')) text = '👥 ' + mode;
        
        button.textContent = text;
        
        button.addEventListener('click', () => {
            modal.classList.remove('active');
            startGame(game, mode);
        });
        
        modesGrid.appendChild(button);
    });
    
    modal.classList.add('active');
}

// Запуск игры
function startGame(game, mode) {
    const container = document.getElementById('gameContainer');
    const frame = document.getElementById('gameFrame');
    const controlsInfo = document.getElementById('gameControlsInfo');
    
    // Если телефон - не показываем бинды
    if (!isMobile) {
        controlsInfo.innerHTML = `
            <div class="control-badge">↑: <span>↑</span></div>
            <div class="control-badge">↓: <span>↓</span></div>
            <div class="control-badge">←: <span>←</span></div>
            <div class="control-badge">→: <span>→</span></div>
            <div class="control-badge">Пауза: <span>P</span></div>
        `;
    } else {
        controlsInfo.innerHTML = `<div class="control-badge">👆 Свайпы для управления</div>`;
    }
    
    const url = `${game.path}?mode=${mode}&mobile=${isMobile}`;
    frame.src = url;
    
    container.classList.add('active');
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.game-card');
        
        cards.forEach(card => {
            const gameId = card.dataset.gameId;
            const game = gamesDatabase.find(g => g.id === gameId);
            
            const matches = game.name.toLowerCase().includes(query) ||
                           (game.ru && game.ru.toLowerCase().includes(query)) ||
                           (game.en && game.en.toLowerCase().includes(query));
            
            card.style.display = matches ? 'block' : 'none';
        });
    });
}

// Инициализация настроек (только для ПК)
function initSettings() {
    const settingsBtn = document.getElementById('openSettings');
    const settingsModal = document.getElementById('settingsModal');
    const closeBtn = document.getElementById('closeSettings');
    const settingsSearch = document.getElementById('settingsSearch');
    const gamesList = document.getElementById('gamesSettingsList');
    
    settingsBtn.addEventListener('click', () => {
        updateSettingsList('');
        settingsModal.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    settingsSearch.addEventListener('input', (e) => {
        updateSettingsList(e.target.value.toLowerCase());
    });
    
    function updateSettingsList(query) {
        gamesList.innerHTML = '';
        
        gamesDatabase
            .filter(game => game.name.toLowerCase().includes(query))
            .forEach(game => {
                const item = document.createElement('div');
                item.className = 'game-setting-item';
                
                item.innerHTML = `
                    <img src="${game.icon}" alt="${game.name}" class="game-icon">
                    <span>${game.name}</span>
                    <span class="bind-info">Стрелки, P</span>
                `;
                
                item.addEventListener('click', () => {
                    alert('Управление: стрелки - движение, P - пауза');
                });
                
                gamesList.appendChild(item);
            });
    }
}

// Инициализация модалок
function initModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    document.getElementById('closeModeModal').addEventListener('click', () => {
        document.getElementById('modeModal').classList.remove('active');
    });
    
    document.getElementById('closeBindModal')?.addEventListener('click', () => {
        document.getElementById('bindModal')?.classList.remove('active');
    });
}
