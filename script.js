// Основная логика сайта
document.addEventListener('DOMContentLoaded', () => {
    initGames();
    initSearch();
    initSettings();
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
    
    // Создаем теги режимов
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
                 onerror="this.src='https://via.placeholder.com/64/1e2429/7b4ae2?text=${game.name[0]}'">
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
    
    // Получаем бинды для игры
    const binds = settingsManager.getGameBinds(game.id);
    
    // Показываем подсказку с клавишами
    let controlsHtml = '';
    for (let [action, key] of Object.entries(binds)) {
        let actionName = {
            'up': 'Вверх',
            'down': 'Вниз', 
            'left': 'Влево',
            'right': 'Вправо',
            'pause': 'Пауза',
            'rotate': 'Поворот',
            'hardDrop': 'Сброс',
            'player1_up': 'P1 ↑',
            'player1_down': 'P1 ↓',
            'player2_up': 'P2 ↑',
            'player2_down': 'P2 ↓'
        }[action] || action;
        
        controlsHtml += `<div class="control-badge">${actionName}: <span>${settingsManager.getReadableKey(key)}</span></div>`;
    }
    controlsInfo.innerHTML = controlsHtml;
    
    // Передаем параметры в игру через URL
    const url = `${game.path}?mode=${mode}&binds=${encodeURIComponent(JSON.stringify(binds))}`;
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
            
            // Поиск по названию, русским и английским ключевым словам
            const matches = game.name.toLowerCase().includes(query) ||
                           (game.ru && game.ru.toLowerCase().includes(query)) ||
                           (game.en && game.en.toLowerCase().includes(query));
            
            card.style.display = matches ? 'block' : 'none';
        });
    });
}

// Инициализация настроек
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
                
                const binds = settingsManager.getGameBinds(game.id);
                const bindCount = Object.keys(binds).length;
                
                item.innerHTML = `
                    <img src="${game.icon}" alt="${game.name}" class="game-icon">
                    <span>${game.name}</span>
                    <span class="bind-info">${bindCount} клавиш</span>
                `;
                
                item.addEventListener('click', () => showBindModal(game));
                
                gamesList.appendChild(item);
            });
    }
}

// Показ модалки настройки биндов
function showBindModal(game) {
    const modal = document.getElementById('bindModal');
    const title = document.getElementById('bindGameTitle');
    const list = document.getElementById('bindingsList');
    
    title.textContent = `Настройка управления - ${game.name}`;
    list.innerHTML = '';
    
    const binds = settingsManager.getGameBinds(game.id);
    
    Object.entries(binds).forEach(([action, key]) => {
        const item = document.createElement('div');
        item.className = 'bind-item';
        
        // Красивое название действия
        let actionName = {
            'up': 'Вверх',
            'down': 'Вниз',
            'left': 'Влево',
            'right': 'Вправо',
            'pause': 'Пауза',
            'rotate': 'Поворот',
            'hardDrop': 'Сброс',
            'player1_up': 'Игрок 1 - Вверх',
            'player1_down': 'Игрок 1 - Вниз',
            'player2_up': 'Игрок 2 - Вверх',
            'player2_down': 'Игрок 2 - Вниз'
        }[action] || action;
        
        item.innerHTML = `
            <span>${actionName}</span>
            <span class="bind-key" data-action="${action}">${settingsManager.getReadableKey(key)}</span>
        `;
        
        const keySpan = item.querySelector('.bind-key');
        
        keySpan.addEventListener('click', async () => {
            keySpan.classList.add('recording');
            keySpan.textContent = 'Нажмите клавишу...';
            
            const key = await waitForKeyPress();
            
            keySpan.classList.remove('recording');
            
            // Нормализуем клавишу (конвертируем русскую в английскую)
            const normalizedKey = settingsManager.normalizeKey(key);
            keySpan.textContent = settingsManager.getReadableKey(normalizedKey);
            
            settingsManager.updateBind(game.id, action, normalizedKey);
        });
        
        list.appendChild(item);
    });
    
    document.getElementById('saveBinds').onclick = () => {
        modal.classList.remove('active');
    };
    
    document.getElementById('resetBinds').onclick = () => {
        settingsManager.resetGameBinds(game.id);
        showBindModal(game);
    };
    
    modal.classList.add('active');
}

// Ожидание нажатия клавиши (ESC нельзя записать)
function waitForKeyPress() {
    return new Promise((resolve, reject) => {
        const handler = (e) => {
            e.preventDefault();
            document.removeEventListener('keydown', handler);
            
            // Запрещаем устанавливать ESC
            if (e.key === 'Escape') {
                alert('Клавиша ESC зарезервирована для закрытия игры!');
                resolve('Escape'); // Но не сохраним
                return;
            }
            
            let key = e.key;
            if (key === ' ') key = 'Space';
            if (key.startsWith('Arrow')) key = key;
            
            resolve(key);
        };
        
        document.addEventListener('keydown', handler);
    });
}

// Инициализация модалок
function initModals() {
    // Закрытие по клику на фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Закрытие по кнопкам
    document.getElementById('closeModeModal').addEventListener('click', () => {
        document.getElementById('modeModal').classList.remove('active');
    });
    
    document.getElementById('closeBindModal').addEventListener('click', () => {
        document.getElementById('bindModal').classList.remove('active');
    });
}
