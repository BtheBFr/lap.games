// Класс для управления мультиплеером через Google Sheets
class MultiplayerManager {
    constructor() {
        // Замените на ваш URL из Apps Script
        this.scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
        this.rooms = [];
        this.currentRoom = null;
        this.playerId = this.generatePlayerId();
    }

    // Генерация уникального ID игрока
    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    // Создание комнаты
    async createRoom(gameId, maxPlayers) {
        const roomCode = this.generateRoomCode();
        const room = {
            code: roomCode,
            gameId: gameId,
            maxPlayers: maxPlayers,
            players: [{
                id: this.playerId,
                name: 'Игрок 1'
            }],
            status: 'waiting',
            createdAt: new Date().toISOString()
        };

        try {
            await this.sendToSheet('createRoom', room);
            this.currentRoom = room;
            return room;
        } catch (error) {
            console.error('Ошибка создания комнаты:', error);
            return null;
        }
    }

    // Генерация кода комнаты
    generateRoomCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    // Получение списка комнат
    async getRooms() {
        try {
            const response = await fetch(`${this.scriptUrl}?action=getRooms`);
            const data = await response.json();
            this.rooms = data.filter(room => room.status === 'waiting');
            return this.rooms;
        } catch (error) {
            console.error('Ошибка получения комнат:', error);
            return [];
        }
    }

    // Присоединение к комнате
    async joinRoom(roomCode) {
        try {
            const response = await fetch(`${this.scriptUrl}?action=joinRoom&code=${roomCode}&playerId=${this.playerId}`);
            const room = await response.json();
            if (room) {
                this.currentRoom = room;
                return room;
            }
        } catch (error) {
            console.error('Ошибка присоединения:', error);
        }
        return null;
    }

    // Отправка данных в Google Sheets
    async sendToSheet(action, data) {
        const formData = new FormData();
        formData.append('action', action);
        formData.append('data', JSON.stringify(data));
        
        const response = await fetch(this.scriptUrl, {
            method: 'POST',
            body: formData
        });
        
        return await response.json();
    }

    // Обновление состояния игры
    async updateGameState(gameState) {
        if (!this.currentRoom) return;
        
        await this.sendToSheet('updateGame', {
            roomCode: this.currentRoom.code,
            gameState: gameState
        });
    }
}

const multiplayerManager = new MultiplayerManager();
