// Класс для управления настройками
class SettingsManager {
    constructor() {
        this.binds = this.loadBinds();
    }

    // Загрузка биндов из localStorage
    loadBinds() {
        const saved = localStorage.getItem('gameBinds');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Если нет сохраненных, создаем из дефолтных
        const defaultBinds = {};
        gamesDatabase.forEach(game => {
            defaultBinds[game.id] = game.defaultBinds;
        });
        return defaultBinds;
    }

    // Сохранение биндов
    saveBinds() {
        localStorage.setItem('gameBinds', JSON.stringify(this.binds));
    }

    // Получение биндов для конкретной игры
    getGameBinds(gameId) {
        return this.binds[gameId] || {};
    }

    // Обновление бинда для игры
    updateBind(gameId, action, key) {
        if (!this.binds[gameId]) {
            this.binds[gameId] = {};
        }
        this.binds[gameId][action] = key;
        this.saveBinds();
    }

    // Сброс биндов игры к дефолтным
    resetGameBinds(gameId) {
        const game = gamesDatabase.find(g => g.id === gameId);
        if (game) {
            this.binds[gameId] = { ...game.defaultBinds };
            this.saveBinds();
        }
    }

    // Сброс всех биндов
    resetAllBinds() {
        this.binds = {};
        gamesDatabase.forEach(game => {
            this.binds[game.id] = { ...game.defaultBinds };
        });
        this.saveBinds();
    }
}

const settingsManager = new SettingsManager();
