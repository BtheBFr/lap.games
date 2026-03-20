// База данных игр
const gamesDatabase = [
    {
        id: 'snake',
        name: 'Snake', // Отображаемое название
        ru: 'Змейка, змея', // Для поиска по-русски
        en: 'Snake', // Для поиска по-английски
        icon: 'icons/snake.png',
        path: 'games/snake/',
        modes: ['1P'] // Только одиночная
    },
    {
        id: 'tetris',
        name: 'Tetris',
        ru: 'Тетрис, тетрис',
        en: 'Tetris',
        icon: 'icons/tetris.png',
        path: 'games/tetris/',
        modes: ['1P', 'bot']
    },
    {
        id: 'pong',
        name: 'Pong',
        ru: 'Понг, теннис',
        en: 'Pong',
        icon: 'icons/pong.png',
        path: 'games/pong/',
        modes: ['multi(2)', 'bot']
    },
    {
        id: 'chess',
        name: 'Chess',
        ru: 'Шахматы, шахматы',
        en: 'Chess',
        icon: 'icons/chess.png',
        path: 'games/chess/',
        modes: ['multi(2)', 'bot']
    }
];
