// Основная логика сайта
document.addEventListener('DOMContentLoaded', () => {
    initGames();
    initSearch();
    initSettings();
    initModals();
});

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
        let className = 'mode-tag';
        if (mode.includes('multi')) className += ' multi';
        let displayMode = mode;
        if (mode === '1P') displayMode = '1 игрок';
        else if (mode === 'bot') displayMode = '🤖 Бот';
        else if (mode.includes('multi')) displayMode = '👥 ' + mode;
        return `<span class="${className}">${displayMode}</span>`;
    }).join('');
    
    card.innerHTML = `
        <div class="game-card-content">
            <img src="${game.icon}" alt="${game.name.ru}" class="game-icon" 
                 onerror="this.src='https://via.placeholder.com/64/1e2429/7b4ae2?text=${game.name.ru[0]}'">
            <div class="game-info">
                <h3>${game.name.ru}</h3>
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
    const buttonsDiv = document.getElementById('modeButtons');
    
    title.textContent = `${game.name.ru} - выберите режим`;
    buttonsDiv.innerHTML = '';
    
    game.modes.forEach(mode => {
        const button = document.createElement('button');
        button.className = 'btn-primary';
        
        let text = '';
        if (mode === '1P') text = '👤 Одиночная игра';
        else if (mode === 'bot') text = '🤖 Игра с ботом';
        else if (mode.includes('multi')) text = '👥 ' + mode;
        
        button.textContent = text;
        
        button.addEventListener('click', () => {
            modal.classList.remove('active');
            if (mode.includes('multi')) {
                showMultiplayerModal(game, mode);
            } else {
                startGame(game, mode);
            }
        });
        
        buttonsDiv.appendChild(button);
    });
    
    modal.classList.add('active');
}

// Показ мультиплеер модалки
function showMultiplayerModal(game, mode) {
    const modal = document.getElementById('multiplayerModal');
    modal.classList.add('active');
    
    // Получаем максимальное количество игроков из режима
    const maxPlayers = parseInt(mode.match(/\d+/g).pop());
    
    document.getElementById('createRoomBtn').onclick = async () => {
        const room = await multiplayerManager.createRoom(game.id, maxPlayers);
        if (room) {
            modal.classList.remove('active');
            startGame(game, 'multiplayer', room);
        }
    };
    
    document.getElementById('joinRoomBtn').onclick = async () => {
        const code = document.getElementById('roomCode').value;
        if (code) {
            const room = await multiplayerManager.joinRoom(code);
            if (room) {
                modal.classList.remove('active');
                startGame(game, 'multiplayer', room);
            }
        }
    };
    
    // Обновляем список комнат
    updateRoomsList();
}

// Обновление списка комнат
async function updateRoomsList() {
    const rooms = await multiplayerManager.getRooms();
    const list = document.getElementById('roomsList');
    
    list.innerHTML = rooms.map(room => `
        <div class="room-item">
            <span>Комната ${room.code}</span>
            <span>${room.players.length}/${room.maxPlayers}</span>
            <button class="btn-primary" onclick="joinRoom('${room.code}')">Присоединиться</button>
        </div>
    `).join('');
}

// Запуск игры
function startGame(game, mode, room = null) {
    const container = document.getElementById('gameContainer');
    const frame = document.getElementById('gameFrame');
    
    // Передаем параметры в игру через URL
    let url = `${game.path}?mode=${mode}`;
    if (room) {
        url += `&room=${room.code}&playerId=${multiplayerManager.playerId}`;
    }
    
    // Добавляем бинды в URL
    const binds = settingsManager.getGameBinds(game.id);
    url += `&binds=${encodeURIComponent(JSON.stringify(binds))}`;
    
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
            
            const matches = game.name.ru.toLowerCase().includes(query) ||
                           game.name.en.toLowerCase().includes(query) ||
                           game.description.ru.toLowerCase().includes(query) ||
                           game.description.en.toLowerCase().includes(query);
            
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
            .filter(game => game.name.ru.toLowerCase().includes(query))
            .forEach(game => {
                const item = document.createElement('div');
                item.className = 'game-setting-item';
                
                const binds = settingsManager.getGameBinds(game.id);
                const bindCount = Object.keys(binds).length;
                
                item.innerHTML = `
                    <img src="${game.icon}" alt="${game.name.ru}" class="game-icon">
                    <span>${game.name.ru}</span>
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
    
    title.textContent = `Настройка управления - ${game.name.ru}`;
    list.innerHTML = '';
    
    const binds = settingsManager.getGameBinds(game.id);
    
    Object.entries(binds).forEach(([action, key]) => {
        const item = document.createElement('div');
        item.className = 'bind-item';
        
        // Красивое название действия
        let actionName = action;
        const actionNames = {
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
        };
        
        actionName = actionNames[action] || action;
        
        item.innerHTML = `
            <span>${actionName}</span>
            <span class="bind-key" data-action="${action}">${key}</span>
        `;
        
        const keySpan = item.querySelector('.bind-key');
        
        keySpan.addEventListener('click', async () => {
            keySpan.classList.add('recording');
            keySpan.textContent = 'Нажмите клавишу...';
            
            const key = await waitForKeyPress();
            
            keySpan.classList.remove('recording');
            keySpan.textContent = key;
            
            settingsManager.updateBind(game.id, action, key);
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

// Ожидание нажатия клавиши
function waitForKeyPress() {
    return new Promise(resolve => {
        const handler = (e) => {
            e.preventDefault();
            document.removeEventListener('keydown', handler);
            
            let key = e.key;
            if (key === ' ') key = 'Space';
            
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
    
    document.getElementById('closeMultiplayerModal').addEventListener('click', () => {
        document.getElementById('multiplayerModal').classList.remove('active');
    });
    
    document.getElementById('closeBindModal').addEventListener('click', () => {
        document.getElementById('bindModal').classList.remove('active');
    });
    
    // Закрытие игры по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer.classList.contains('active')) {
                gameContainer.classList.remove('active');
                document.getElementById('gameFrame').src = '';
            }
        }
    });
}

// Вспомогательная функция для присоединения к комнате
window.joinRoom = async (code) => {
    const room = await multiplayerManager.joinRoom(code);
    if (room) {
        document.getElementById('multiplayerModal').classList.remove('active');
        const game = gamesDatabase.find(g => g.id === room.gameId);
        startGame(game, 'multiplayer', room);
    }
};
