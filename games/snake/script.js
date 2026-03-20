const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Размеры
canvas.width = 400;
canvas.height = 400;
const gridSize = 20;
const cellSize = canvas.width / gridSize;

// Переменные игры
let snake = [{x: 10, y: 10}];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameRunning = true;  // ИСПРАВЛЕНО: сразу true
let gameLoop = null;
let paused = false;

// Инициализация
function init() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameRunning = true;  // ИСПРАВЛЕНО
    paused = false;
    gameOverElement.style.display = 'none';
    // Убираем фокус с canvas чтобы стрелки работали
    canvas.blur();
}

// Генерация еды
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Обновление игры
function update() {
    if (!gameRunning || paused) return;
    
    direction = nextDirection;
    const head = {...snake[0]};
    
    switch(direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
    }
    
    // Проверка стен
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }
    
    // Проверка себя
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // Еда
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

// Отрисовка с ГЛАЗАМИ для змейки
function draw() {
    if (!gameRunning) return;
    
    ctx.fillStyle = '#14181c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Сетка
    ctx.strokeStyle = '#2a323c';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
    
    // Рисуем змейку
    snake.forEach((segment, index) => {
        const isHead = index === 0;
        
        // Тело змейки
        ctx.fillStyle = isHead ? '#7b4ae2' : '#9d7aef';
        ctx.shadowColor = isHead ? '#7b4ae2' : '#9d7aef';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.roundRect(
            segment.x * cellSize + 2,
            segment.y * cellSize + 2,
            cellSize - 4,
            cellSize - 4,
            5
        );
        ctx.fill();
        
        // РИСУЕМ ГЛАЗА ТОЛЬКО ДЛЯ ГОЛОВЫ
        if (isHead) {
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 0;
            
            const eyeSize = cellSize / 6;
            const eyeOffset = cellSize / 3;
            
            // В зависимости от направления рисуем глаза
            if (direction === 'right') {
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset + 2, segment.y * cellSize + eyeOffset, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset + 2, segment.y * cellSize + cellSize - eyeOffset, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
            } 
            else if (direction === 'left') {
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset, segment.y * cellSize + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset - 2, segment.y * cellSize + eyeOffset, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset - 2, segment.y * cellSize + cellSize - eyeOffset, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (direction === 'up') {
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset, segment.y * cellSize + eyeOffset - 2, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + eyeOffset - 2, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (direction === 'down') {
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset, segment.y * cellSize + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + eyeOffset, segment.y * cellSize + cellSize - eyeOffset + 2, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + cellSize - eyeOffset + 2, eyeSize/1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
    
    // Еда
    ctx.shadowColor = '#ff4d4d';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Пауза
    if (paused) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ПАУЗА', canvas.width/2, canvas.height/2);
    }
    
    ctx.shadowBlur = 0;
}

// Скругленные прямоугольники
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
};

// Game Over
function gameOver() {
    gameRunning = false;
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// Рестарт
function restartGame() {
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
    }
    init();
    gameLoop = requestAnimationFrame(gameTick);
}

// Закрыть игру - ОТПРАВЛЯЕТ СООБЩЕНИЕ РОДИТЕЛЮ
function closeGame() {
    window.parent.postMessage('closeGame', '*');
}

// Игровой цикл
let lastUpdate = 0;
const UPDATE_INTERVAL = 150;

function gameTick(timestamp) {
    if (!gameRunning) return;
    
    if (timestamp - lastUpdate > UPDATE_INTERVAL) {
        update();
        lastUpdate = timestamp;
    }
    
    draw();
    gameLoop = requestAnimationFrame(gameTick);
}

// УПРАВЛЕНИЕ - ИСПРАВЛЕНО!
document.addEventListener('keydown', (e) => {
    // ESC ВСЕГДА ЗАКРЫВАЕТ ИГРУ
    if (e.key === 'Escape') {
        e.preventDefault();
        closeGame();
        return;
    }
    
    if (!gameRunning) return;
    
    // Проверяем бинды
    if (isKeyPressed(e, binds.up) && direction !== 'down') {
        nextDirection = 'up';
        e.preventDefault();
    } else if (isKeyPressed(e, binds.down) && direction !== 'up') {
        nextDirection = 'down';
        e.preventDefault();
    } else if (isKeyPressed(e, binds.left) && direction !== 'right') {
        nextDirection = 'left';
        e.preventDefault();
    } else if (isKeyPressed(e, binds.right) && direction !== 'left') {
        nextDirection = 'right';
        e.preventDefault();
    } else if (isKeyPressed(e, binds.pause)) {
        paused = !paused;
        e.preventDefault();
    }
});

// Слушаем сообщения от родителя
window.addEventListener('message', (e) => {
    if (e.data === 'closeGame') {
        closeGame();
    }
});

// Запуск
init();
gameLoop = requestAnimationFrame(gameTick);
