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

function isKeyPressed(event, targetKey) {
    const key = event.key;
    
    if (targetKey === 'ArrowUp') return key === 'ArrowUp';
    if (targetKey === 'ArrowDown') return key === 'ArrowDown';
    if (targetKey === 'ArrowLeft') return key === 'ArrowLeft';
    if (targetKey === 'ArrowRight') return key === 'ArrowRight';
    if (targetKey === 'KeyP') return key === 'p' || key === 'P' || key === 'р' || key === 'Р';
    
    return false;
}
