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
let snake = [
    {x: 10, y: 10}
];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameRunning = false;
let gameLoop = null;

// Инициализация
function init() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameRunning = true;
    gameOverElement.style.display = 'none';
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
    if (!gameRunning) return;
    
    // Обновляем направление
    direction = nextDirection;
    
    // Получаем новую голову
    const head = {...snake[0]};
    
    switch(direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
    }
    
    // Проверка на столкновение со стенами
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }
    
    // Проверка на столкновение с собой
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Добавляем новую голову
    snake.unshift(head);
    
    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
    
    draw();
}

// Отрисовка
function draw() {
    // Очистка
    ctx.fillStyle = '#14181c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем сетку
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
    });
    
    // Рисуем еду
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
    
    // Сбрасываем тень
    ctx.shadowBlur = 0;
}

// Вспомогательная функция для скругленных прямоугольников
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
        clearInterval(gameLoop);
        gameLoop = null;
    }
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// Рестарт
function restartGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    init();
    gameLoop = setInterval(update, 150);
}

// Закрыть игру
function closeGame() {
    window.parent.postMessage('closeGame', '*');
}

// Управление
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    // Проверяем бинды
    switch(e.key) {
        case binds.up:
            if (direction !== 'down') nextDirection = 'up';
            break;
        case binds.down:
            if (direction !== 'up') nextDirection = 'down';
            break;
        case binds.left:
            if (direction !== 'right') nextDirection = 'left';
            break;
        case binds.right:
            if (direction !== 'left') nextDirection = 'right';
            break;
        case binds.pause:
            // Пауза
            break;
    }
});

// Слушаем сообщения от родителя
window.addEventListener('message', (e) => {
    if (e.data === 'closeGame') {
        closeGame();
    }
});

// Запуск игры
init();
gameLoop = setInterval(update, 150);
