const urlParams = new URLSearchParams(window.location.search);
let gameBinds = {};

try {
    const bindsParam = urlParams.get('binds');
    if (bindsParam) {
        gameBinds = JSON.parse(decodeURIComponent(bindsParam));
    }
} catch(e) {}

const defaultBinds = {
    'up': 'ARROWUP',
    'down': 'ARROWDOWN',
    'left': 'ARROWLEFT',
    'right': 'ARROWRIGHT',
    'pause': 'P'
};

const binds = { ...defaultBinds, ...gameBinds };

function convertRuToEn(key) {
    const ruToEn = {
        'й': 'Q', 'ц': 'W', 'у': 'E', 'к': 'R', 'е': 'T', 'н': 'Y', 'г': 'U', 'ш': 'I', 'щ': 'O', 'з': 'P',
        'ф': 'A', 'ы': 'S', 'в': 'D', 'а': 'F', 'п': 'G', 'р': 'H', 'о': 'J', 'л': 'K', 'д': 'L',
        'я': 'Z', 'ч': 'X', 'с': 'C', 'м': 'V', 'и': 'B', 'т': 'N', 'ь': 'B',
        'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P',
        'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L',
        'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'B'
    };
    return ruToEn[key] || key;
}

function isKeyPressed(event, targetKey) {
    let key = event.key;
    
    if (key === 'ArrowUp') key = 'ARROWUP';
    if (key === 'ArrowDown') key = 'ARROWDOWN';
    if (key === 'ArrowLeft') key = 'ARROWLEFT';
    if (key === 'ArrowRight') key = 'ARROWRIGHT';
    if (key === ' ') key = 'SPACE';
    if (key === 'p' || key === 'P') key = 'P';
    
    if (key.length === 1) {
        key = convertRuToEn(key).toUpperCase();
    }
    
    return key === targetKey;
}
