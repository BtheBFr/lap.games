const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

canvas.width = 400;
canvas.height = 400;
const gridSize = 20;
const cellSize = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];
let food = {x: 15, y: 10};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameRunning = true;
let gameLoop = null;
let paused = false;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function init() {
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
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
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function update() {
    if (!gameRunning || paused) return;
    
    direction = nextDirection;
    const head = {x: snake[0].x, y: snake[0].y};
    
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
    
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const isHead = i === 0;
        
        ctx.fillStyle = isHead ? '#7b4ae2' : '#9d7aef';
        ctx.shadowColor = isHead ? '#7b4ae2' : '#9d7aef';
        ctx.shadowBlur = 10;
        
        ctx.fillRect(
            segment.x * cellSize + 2,
            segment.y * cellSize + 2,
            cellSize - 4,
            cellSize - 4
        );
        
        if (isHead) {
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 0;
            const eyeSize = 4;
            const eyeOffset = 8;
            
            if (direction === 'right') {
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset, segment.y * cellSize + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset + 2, segment.y * cellSize + eyeOffset + 1, 2, 2);
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset + 2, segment.y * cellSize + cellSize - eyeOffset - eyeSize + 1, 2, 2);
            } else if (direction === 'left') {
                ctx.fillRect(segment.x * cellSize + eyeOffset - eyeSize, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * cellSize + eyeOffset - eyeSize, segment.y * cellSize + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(segment.x * cellSize + eyeOffset - eyeSize + 1, segment.y * cellSize + eyeOffset + 1, 2, 2);
                ctx.fillRect(segment.x * cellSize + eyeOffset - eyeSize + 1, segment.y * cellSize + cellSize - eyeOffset - eyeSize + 1, 2, 2);
            } else if (direction === 'up') {
                ctx.fillRect(segment.x * cellSize + eyeOffset, segment.y * cellSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize, segment.y * cellSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(segment.x * cellSize + eyeOffset + 1, segment.y * cellSize + eyeOffset - eyeSize + 1, 2, 2);
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize + 1, segment.y * cellSize + eyeOffset - eyeSize + 1, 2, 2);
            } else if (direction === 'down') {
                ctx.fillRect(segment.x * cellSize + eyeOffset, segment.y * cellSize + cellSize - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize, segment.y * cellSize + cellSize - eyeOffset, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(segment.x * cellSize + eyeOffset + 1, segment.y * cellSize + cellSize - eyeOffset + 1, 2, 2);
                ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize + 1, segment.y * cellSize + cellSize - eyeOffset + 1, 2, 2);
            }
        }
    }
    
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        closeGame();
        return;
    }
    if (!gameRunning) return;
    
    if (e.key === 'ArrowUp' && direction !== 'down') {
        nextDirection = 'up';
        e.preventDefault();
    } else if (e.key === 'ArrowDown' && direction !== 'up') {
        nextDirection = 'down';
        e.preventDefault();
    } else if (e.key === 'ArrowLeft' && direction !== 'right') {
        nextDirection = 'left';
        e.preventDefault();
    } else if (e.key === 'ArrowRight' && direction !== 'left') {
        nextDirection = 'right';
        e.preventDefault();
    } else if (e.key === 'p' || e.key === 'P' || e.key === 'р' || e.key === 'Р') {
        paused = !paused;
        e.preventDefault();
    }
});

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
