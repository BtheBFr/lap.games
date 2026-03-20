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

// Дефолтные бинды (пауза на P, ESC закрывает игру)
const defaultBinds = {
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'pause': 'KeyP'
};

// Объединяем с дефолтными
const binds = { ...defaultBinds, ...gameBinds };

// Конвертация русских букв в английские
function isKeyPressed(event, targetKey) {
    const ruToEn = {
        'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']',
        'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'э': "'",
        'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'b', 'б': ',', 'ю': '.',
        'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '{', 'Ъ': '}',
        'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':', 'Э': '"',
        'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'B', 'Б': '<', 'Ю': '>'
    };
    
    const pressedKey = event.key;
    const normalizedPressed = ruToEn[pressedKey] || pressedKey;
    
    if (targetKey === 'Space') return pressedKey === ' ';
    if (targetKey.startsWith('Arrow')) return pressedKey === targetKey;
    if (targetKey === 'Enter') return pressedKey === 'Enter';
    
    const cleanTarget = targetKey.replace('Key', '');
    return normalizedPressed.toLowerCase() === cleanTarget.toLowerCase();
}
