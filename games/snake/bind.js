// Получаем бинды из URL
const urlParams = new URLSearchParams(window.location.search);
let gameBinds = {};

try {
    const bindsParam = urlParams.get('binds');
    if (bindsParam) {
        gameBinds = JSON.parse(decodeURIComponent(bindsParam));
        // Конвертируем все значения в большие буквы
        for (let key in gameBinds) {
            if (gameBinds[key] && gameBinds[key].length === 1) {
                gameBinds[key] = gameBinds[key].toUpperCase();
            }
        }
    }
} catch (e) {
    console.error('Ошибка загрузки биндов:', e);
}

// ДЕФОЛТНЫЕ БИНДЫ - СТРЕЛОЧКИ!
const defaultBinds = {
    'up': 'ARROWUP',
    'down': 'ARROWDOWN',
    'left': 'ARROWLEFT',
    'right': 'ARROWRIGHT',
    'pause': 'P'  // ПАУЗА НА P
};

// Объединяем с дефолтными
const binds = { ...defaultBinds, ...gameBinds };

// Конвертация русских букв в английские
function isKeyPressed(event, targetKey) {
    const ruToEn = {
        'й': 'Q', 'ц': 'W', 'у': 'E', 'к': 'R', 'е': 'T', 'н': 'Y', 'г': 'U', 'ш': 'I', 'щ': 'O', 'з': 'P', 'х': '[', 'ъ': ']',
        'ф': 'A', 'ы': 'S', 'в': 'D', 'а': 'F', 'п': 'G', 'р': 'H', 'о': 'J', 'л': 'K', 'д': 'L', 'ж': ';', 'э': "'",
        'я': 'Z', 'ч': 'X', 'с': 'C', 'м': 'V', 'и': 'B', 'т': 'N', 'ь': 'B', 'б': ',', 'ю': '.',
        'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '{', 'Ъ': '}',
        'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':', 'Э': '"',
        'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'B', 'Б': '<', 'Ю': '>'
    };
    
    let pressedKey = event.key;
    
    // Конвертируем русские буквы в английские
    if (ruToEn[pressedKey]) {
        pressedKey = ruToEn[pressedKey];
    } else if (pressedKey.length === 1) {
        pressedKey = pressedKey.toUpperCase();
    }
    
    // Нормализуем стрелки
    if (pressedKey === 'ArrowUp') pressedKey = 'ARROWUP';
    if (pressedKey === 'ArrowDown') pressedKey = 'ARROWDOWN';
    if (pressedKey === 'ArrowLeft') pressedKey = 'ARROWLEFT';
    if (pressedKey === 'ArrowRight') pressedKey = 'ARROWRIGHT';
    if (pressedKey === ' ') pressedKey = 'SPACE';
    
    // Сравниваем
    const cleanTarget = targetKey.toUpperCase();
    return pressedKey === cleanTarget;
}
