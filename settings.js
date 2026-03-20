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
        
        // Дефолтные бинды для каждой игры
        return {
            snake: {
                'up': 'ArrowUp',
                'down': 'ArrowDown',
                'left': 'ArrowLeft',
                'right': 'ArrowRight',
                'pause': 'KeyP'
            },
            tetris: {
                'left': 'ArrowLeft',
                'right': 'ArrowRight',
                'rotate': 'ArrowUp',
                'hardDrop': 'Space',
                'pause': 'KeyP'
            },
            pong: {
                'player1_up': 'KeyW',
                'player1_down': 'KeyS',
                'player2_up': 'ArrowUp',
                'player2_down': 'ArrowDown',
                'pause': 'KeyP'
            },
            chess: {
                'confirm': 'Enter',
                'cancel': 'Escape',
                'pause': 'KeyP'
            }
        };
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
        const defaultBinds = {
            snake: {
                'up': 'ArrowUp',
                'down': 'ArrowDown',
                'left': 'ArrowLeft',
                'right': 'ArrowRight',
                'pause': 'KeyP'
            },
            tetris: {
                'left': 'ArrowLeft',
                'right': 'ArrowRight',
                'rotate': 'ArrowUp',
                'hardDrop': 'Space',
                'pause': 'KeyP'
            },
            pong: {
                'player1_up': 'KeyW',
                'player1_down': 'KeyS',
                'player2_up': 'ArrowUp',
                'player2_down': 'ArrowDown',
                'pause': 'KeyP'
            },
            chess: {
                'confirm': 'Enter',
                'cancel': 'Escape',
                'pause': 'KeyP'
            }
        };
        
        if (defaultBinds[gameId]) {
            this.binds[gameId] = { ...defaultBinds[gameId] };
            this.saveBinds();
        }
    }

    // Конвертация клавиши для игры (поддержка русской раскладки)
    normalizeKey(key) {
        // Конвертация русских букв в английские
        const ruToEn = {
            'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']',
            'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'э': "'",
            'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'b', 'б': ',', 'ю': '.',
            'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '{', 'Ъ': '}',
            'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':', 'Э': '"',
            'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'B', 'Б': '<', 'Ю': '>'
        };
        
        // Если это русская буква, конвертируем
        if (ruToEn[key]) {
            return ruToEn[key];
        }
        
        // Если это специальная клавиша (ArrowUp, Space и т.д.)
        if (key.startsWith('Arrow') || key === 'Space' || key === 'Enter' || key === 'Escape') {
            return key;
        }
        
        // Если это английская буква, возвращаем как есть
        return key;
    }

    // Получение читаемого названия клавиши для отображения
    getReadableKey(key) {
        const keyNames = {
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'Space': 'Пробел',
            'Enter': 'Enter',
            'Escape': 'ESC',
            'KeyP': 'P'
        };
        
        return keyNames[key] || key;
    }
}

const settingsManager = new SettingsManager();
