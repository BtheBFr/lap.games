const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const finalScoreSpan = document.getElementById('finalScore');
const gameOverDiv = document.getElementById('gameOver');

const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;

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
let paused = false;
let animationId = null;
let lastUpdate = 0;
const UPDATE_INTERVAL = 150;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
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
    
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }
    
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreSpan.textContent = score;
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
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    
    for (let i = 0; i < snake.length; i++) {
        const s = snake[i];
        const isHead = i === 0;
        ctx.fillStyle = isHead ? '#7b4ae2' : '#9d7aef';
        ctx.fillRect(s.x * CELL_SIZE + 2, s.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        if (isHead) {
            ctx.fillStyle = 'white';
            const eyeSize = 4;
            const offset = 8;
            if (direction === 'right') {
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset, s.y * CELL_SIZE + offset, eyeSize, eyeSize);
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset, s.y * CELL_SIZE + CELL_SIZE - offset - eyeSize, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset + 2, s.y * CELL_SIZE + offset + 1, 2, 2);
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset + 2, s.y * CELL_SIZE + CELL_SIZE - offset - eyeSize + 1, 2, 2);
            } else if (direction === 'left') {
                ctx.fillRect(s.x * CELL_SIZE + offset - eyeSize, s.y * CELL_SIZE + offset, eyeSize, eyeSize);
                ctx.fillRect(s.x * CELL_SIZE + offset - eyeSize, s.y * CELL_SIZE + CELL_SIZE - offset - eyeSize, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(s.x * CELL_SIZE + offset - eyeSize + 1, s.y * CELL_SIZE + offset + 1, 2, 2);
                ctx.fillRect(s.x * CELL_SIZE + offset - eyeSize + 1, s.y * CELL_SIZE + CELL_SIZE - offset - eyeSize + 1, 2, 2);
            } else if (direction === 'up') {
                ctx.fillRect(s.x * CELL_SIZE + offset, s.y * CELL_SIZE + offset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset - eyeSize, s.y * CELL_SIZE + offset - eyeSize, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(s.x * CELL_SIZE + offset + 1, s.y * CELL_SIZE + offset - eyeSize + 1, 2, 2);
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset - eyeSize + 1, s.y * CELL_SIZE + offset - eyeSize + 1, 2, 2);
            } else if (direction === 'down') {
                ctx.fillRect(s.x * CELL_SIZE + offset, s.y * CELL_SIZE + CELL_SIZE - offset, eyeSize, eyeSize);
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset - eyeSize, s.y * CELL_SIZE + CELL_SIZE - offset, eyeSize, eyeSize);
                ctx.fillStyle = '#000';
                ctx.fillRect(s.x * CELL_SIZE + offset + 1, s.y * CELL_SIZE + CELL_SIZE - offset + 1, 2, 2);
                ctx.fillRect(s.x * CELL_SIZE + CELL_SIZE - offset - eyeSize + 1, s.y * CELL_SIZE + CELL_SIZE - offset + 1, 2, 2);
            }
        }
    }
    
    ctx.fillStyle = '#ff4d4d';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE/2, food.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    if (paused) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ПАУЗА', canvas.width/2, canvas.height/2);
    }
}

function gameOver() {
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    finalScoreSpan.textContent = score;
    gameOverDiv.style.display = 'block';
}

function restartGame() {
    if (animationId) cancelAnimationFrame(animationId);
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameRunning = true;
    paused = false;
    scoreSpan.textContent = score;
    generateFood();
    gameOverDiv.style.display = 'none';
    lastUpdate = performance.now();
    animationId = requestAnimationFrame(gameTick);
}

function closeGame() {
    window.parent.postMessage('closeGame', '*');
}

function gameTick(timestamp) {
    if (!gameRunning) return;
    if (timestamp - lastUpdate > UPDATE_INTERVAL) {
        update();
        lastUpdate = timestamp;
    }
    draw();
    animationId = requestAnimationFrame(gameTick);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        closeGame();
        return;
    }
    if (!gameRunning) return;
    
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

restartGame();
