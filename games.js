// База данных игр
const gamesDatabase = [
    {
        id: 'snake',
        name: {
            en: 'Snake',
            ru: 'Змейка'
        },
        description: {
            en: 'Classic snake game',
            ru: 'Классическая змейка'
        },
        icon: 'icons/snake.png',
        path: 'games/snake/',
        modes: ['1P', 'bot', 'multi(2-6)', 'multi(2-3)'],
        defaultBinds: {
            'up': 'ArrowUp',
            'down': 'ArrowDown',
            'left': 'ArrowLeft',
            'right': 'ArrowRight',
            'pause': 'Escape'
        }
    },
    {
        id: 'tetris',
        name: {
            en: 'Tetris',
            ru: 'Тетрис'
        },
        description: {
            en: 'Classic tetris game',
            ru: 'Классический тетрис'
        },
        icon: 'icons/tetris.png',
        path: 'games/tetris/',
        modes: ['1P', 'bot'],
        defaultBinds: {
            'left': 'ArrowLeft',
            'right': 'ArrowRight',
            'rotate': 'ArrowUp',
            'hardDrop': 'Space',
            'pause': 'Escape'
        }
    },
    {
        id: 'pong',
        name: {
            en: 'Pong',
            ru: 'Понг'
        },
        description: {
            en: 'Classic pong game',
            ru: 'Классический понг'
        },
        icon: 'icons/pong.png',
        path: 'games/pong/',
        modes: ['multi(2)', 'bot'],
        defaultBinds: {
            'player1_up': 'KeyW',
            'player1_down': 'KeyS',
            'player2_up': 'ArrowUp',
            'player2_down': 'ArrowDown',
            'pause': 'Escape'
        }
    }
];
