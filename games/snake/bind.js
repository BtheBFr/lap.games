// Этот файл нужен для совместимости
const binds = {
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'left': 'ArrowLeft',
    'right': 'ArrowRight',
    'pause': 'KeyP'
};

function isKeyPressed(event, targetKey) {
    const key = event.key;
    if (targetKey === 'ArrowUp') return key === 'ArrowUp';
    if (targetKey === 'ArrowDown') return key === 'ArrowDown';
    if (targetKey === 'ArrowLeft') return key === 'ArrowLeft';
    if (targetKey === 'ArrowRight') return key === 'ArrowRight';
    if (targetKey === 'KeyP') return key === 'p' || key === 'P' || key === 'р' || key === 'Р';
    return false;
}
