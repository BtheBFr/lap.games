const urlParams = new URLSearchParams(window.location.search);
let gameBinds = {};

try {
    const bindsParam = urlParams.get('binds');
    if (bindsParam) {
        gameBinds = JSON.parse(decodeURIComponent(bindsParam));
    }
} catch(e) {}

const defaultBinds = {
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'pause': 'KeyP'
};

const binds = { ...defaultBinds, ...gameBinds };

// Конвертация русских букв в английские
function convertRuToEn(key) {
    const ruToEn = {
        'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']',
        'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'э': "'",
        'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'b', 'б': ',', 'ю': '.',
        'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '{', 'Ъ': '}',
        'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':', 'Э': '"',
        'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'B', 'Б': '<', 'Ю': '>'
    };
    return ruToEn[key] || key;
}

function isKeyPressed(event, targetKey) {
    let key = event.key;
    
    // Конвертируем русскую букву в английскую
    if (key.length === 1) {
        key = convertRuToEn(key);
    }
    
    // Стрелки
    if (targetKey === 'ArrowUp') return key === 'ArrowUp';
    if (targetKey === 'ArrowDown') return key === 'ArrowDown';
    if (targetKey === 'ArrowLeft') return key === 'ArrowLeft';
    if (targetKey === 'ArrowRight') return key === 'ArrowRight';
    
    // Буквы (убираем Key из KeyP, KeyW и т.д.)
    if (targetKey.startsWith('Key')) {
        const targetLetter = targetKey.replace('Key', '').toLowerCase();
        return key.toLowerCase() === targetLetter;
    }
    
    return key === targetKey;
}
