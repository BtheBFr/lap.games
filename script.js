const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', () => {
    initGames();
    initSearch();
    if (!isMobile) initSettings();
    initModals();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const container = document.getElementById('gameContainer');
            if (container.classList.contains('active')) closeGame();
        }
    });
    
    document.getElementById('closeGameBtn').addEventListener('click', closeGame);
    
    document.body.addEventListener('touchmove', (e) => {
        if (document.getElementById('gameContainer').classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
});

function closeGame() {
    const container = document.getElementById('gameContainer');
    const frame = document.getElementById('gameFrame');
    container.classList.remove('active');
    frame.src = '';
    document.body.classList.remove('game-open');
}

function initGames() {
    const grid = document.getElementById('gamesGrid');
    gamesDatabase.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.gameId = game.id;
        
        const modeTags = game.modes.map(mode => {
            let display = mode === '1P' ? '1 игрок' : mode === 'bot' ? '🤖 Бот' : '👥 ' + mode;
            return `<span class="mode-tag">${display}</span>`;
        }).join('');
        
        card.innerHTML = `
            <div class="game-card-content">
                <img src="${game.icon}" class="game-icon" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\'%3E%3Crect width=\'64\' height=\'64\' fill=\'%231e2429\'/%3E%3Ctext x=\'32\' y=\'44\' fill=\'%237b4ae2\' text-anchor=\'middle\' font-size=\'30\'%3E${game.name[0]}%3C/text%3E%3C/svg%3E'">
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <div class="game-modes">${modeTags}</div>
                </div>
            </div>
        `;
        card.addEventListener('click', () => showGameModes(game));
        grid.appendChild(card);
    });
}

function showGameModes(game) {
    const modal = document.getElementById('modeModal');
    const title = document.getElementById('modalGameTitle');
    const modesGrid = document.getElementById('modesGrid');
    
    title.textContent = `${game.name} - выберите режим`;
    modesGrid.innerHTML = '';
    
    game.modes.forEach(mode => {
        const btn = document.createElement('button');
        btn.className = 'mode-btn';
        btn.textContent = mode === '1P' ? '👤 Одиночная игра' : mode === 'bot' ? '🤖 С ботом' : '👥 ' + mode;
        btn.onclick = () => {
            modal.classList.remove('active');
            startGame(game, mode);
        };
        modesGrid.appendChild(btn);
    });
    modal.classList.add('active');
}

function startGame(game, mode) {
    const container = document.getElementById('gameContainer');
    const frame = document.getElementById('gameFrame');
    const controlsInfo = document.getElementById('gameControlsInfo');
    
    if (isMobile) {
        controlsInfo.innerHTML = '<div class="control-badge">👆 Свайпы для управления</div>';
    } else {
        controlsInfo.innerHTML = `
            <div class="control-badge">↑: <span>↑</span></div>
            <div class="control-badge">↓: <span>↓</span></div>
            <div class="control-badge">←: <span>←</span></div>
            <div class="control-badge">→: <span>→</span></div>
            <div class="control-badge">Пауза: <span>P</span></div>
        `;
    }
    
    frame.src = `${game.path}?mode=${mode}&mobile=${isMobile}`;
    container.classList.add('active');
    document.body.classList.add('game-open');
}

function initSearch() {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.game-card').forEach(card => {
            const game = gamesDatabase.find(g => g.id === card.dataset.gameId);
            const match = game.name.toLowerCase().includes(q) || (game.ru && game.ru.toLowerCase().includes(q));
            card.style.display = match ? 'block' : 'none';
        });
    });
}

function initSettings() {
    const btn = document.getElementById('openSettings');
    const modal = document.getElementById('settingsModal');
    const close = document.getElementById('closeSettings');
    const search = document.getElementById('settingsSearch');
    const list = document.getElementById('gamesSettingsList');
    
    btn.onclick = () => {
        updateList('');
        modal.classList.add('active');
    };
    close.onclick = () => modal.classList.remove('active');
    search.oninput = (e) => updateList(e.target.value.toLowerCase());
    
    function updateList(query) {
        list.innerHTML = '';
        gamesDatabase.filter(g => g.name.toLowerCase().includes(query)).forEach(game => {
            const item = document.createElement('div');
            item.className = 'game-setting-item';
            item.innerHTML = `
                <img src="${game.icon}" class="game-icon" style="width:32px;height:32px">
                <span>${game.name}</span>
                <span class="bind-info">Стрелки, P</span>
            `;
            item.onclick = () => alert('Управление: стрелки - движение, P - пауза');
            list.appendChild(item);
        });
    }
}

function initModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    });
    document.getElementById('closeModeModal').onclick = () => document.getElementById('modeModal').classList.remove('active');
}
