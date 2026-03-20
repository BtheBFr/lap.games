// Получаем бинды из URL
const urlParams = new URLSearchParams(window.location.search);
let gameBinds = {};

try {
    const bindsParam = urlParams.get('binds');
    if (bindsParam) {
        gameBinds = JSON.parse(decodeURIComponent(bindsParam));
    }
} catch (e) {
    console.error('Ошибка загрузки биндов:', e);
}

// Дефолтные бинды если ничего не пришло
const defaultBinds = {
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'pause': 'Escape'
};

// Объединяем с дефолтными
const binds = { ...defaultBinds, ...gameBinds };
