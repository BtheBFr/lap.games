const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

canvas.width = 400;
canvas.height = 400;
const gridSize = 20;
const cellSize = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameRunning = true;
let gameLoop = null;
let paused = false;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Загрузка биндов из URL
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

function getKeyCode(key) {
    if (key === 'ArrowUp') return 'ArrowUp';
    if (key === 'ArrowDown') return 'ArrowDown';
    if (key === 'ArrowLeft') return 'ArrowLeft';
    if (key === 'ArrowRight') return 'ArrowRight';
    if (key === 'KeyP') return 'p';
    return key;
}

function init() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameRunning = true;
    paused = false;
    gameOverElement.style.display = 'none';
}

function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

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
    
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }
    
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function draw() {
    if (!gameRunning) return;
    
    ctx.fillStyle = '#14181c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
    
    snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#7b4ae2' : '#9d7aef';
        ctx.shadowColor = isHead ? '#7b4ae2' : '#9d7aef';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.roundRect(segment.x * cellSize + 2, segment.y * cellSize + 2, cellSize - 4, cellSize - 4, 5);
        ctx.fill();
        
        if (isHead) {
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 0;
            const eyeSize = cellSize / 6;
            const eyeOffset = cellSize / 3;
            
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
            } else if (direction === 'left') {
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
            } else if (direction === 'up') {
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
            } else if (direction === 'down') {
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
    
    ctx.shadowColor = '#ff4d4d';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
    
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

function gameOver() {
    gameRunning = false;
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        gameLoop = null;
    }
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

function restartGame() {
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
    }
    init();
    gameLoop = requestAnimationFrame(gameTick);
}

function closeGame() {
    window.parent.postMessage('closeGame', '*');
}

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

// УПРАВЛЕНИЕ - РАБОТАЕТ
document.addEventListener('keydown', (e) => {
    // ESC закрывает игру
    if (e.key === 'Escape') {
        e.preventDefault();
        closeGame();
        return;
    }
    
    if (!gameRunning) return;
    
    const key = e.key;
    
    // Стрелки
    if (key === 'ArrowUp' && direction !== 'down') {
        nextDirection = 'up';
        e.preventDefault();
    } else if (key === 'ArrowDown' && direction !== 'up') {
        nextDirection = 'down';
        e.preventDefault();
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        nextDirection = 'left';
        e.preventDefault();
    } else if (key === 'ArrowRight' && direction !== 'left') {
        nextDirection = 'right';
        e.preventDefault();
    }
    // Пауза на P (латинская и русская)
    else if (key === 'p' || key === 'P' || key === 'р' || key === 'Р') {
        paused = !paused;
        e.preventDefault();
    }
});

// Свайпы для телефона
if (isMobile) {
    let touchStartX = 0, touchStartY = 0;
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    canvas.addEventListener('touchmove', (e) => e.preventDefault());
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!gameRunning) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && direction !== 'left') nextDirection = 'right';
            else if (dx < 0 && direction !== 'right') nextDirection = 'left';
        } else {
            if (dy > 0 && direction !== 'up') nextDirection = 'down';
            else if (dy < 0 && direction !== 'down') nextDirection = 'up';
        }
    });
}

window.addEventListener('message', (e) => {
    if (e.data === 'closeGame') closeGame();
});

init();
gameLoop = requestAnimationFrame(gameTick);
