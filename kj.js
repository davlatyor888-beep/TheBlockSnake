const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const gridSize = 20;
const canvasSize = 360;
const playableHeight = 320;
const speed = 20;

let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let gameRunning = false;
let gameInterval;

const walls = [
    { x: 0, y: 0, width: canvasSize, height: gridSize },
    { x: 0, y: gridSize, width: gridSize, height: playableHeight - gridSize },
    { x: canvasSize - gridSize, y: gridSize, width: gridSize, height: playableHeight - gridSize },
    { x: 0, y: playableHeight - gridSize, width: canvasSize, height: gridSize }
];

function drawGrid() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvasSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, playableHeight);
        ctx.stroke();
    }

    for (let y = 0; y <= playableHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize, y);
        ctx.stroke();
    }
}

function drawWalls() {
    ctx.fillStyle = "white";
    for (let wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
}

function setDirection(x, y) {
    if ((x !== -direction.x || y !== -direction.y) && gameRunning) {
        nextDirection = { x, y };
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") setDirection(0, -speed);
    if (event.key === "ArrowDown") setDirection(0, speed);
    if (event.key === "ArrowLeft") setDirection(-speed, 0);
    if (event.key === "ArrowRight") setDirection(speed, 0);
});

function drawSnake() {
    ctx.fillStyle = "grey";
    for (let part of snake) {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    direction = nextDirection;

    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = {
            x: Math.floor(Math.random() * ((canvasSize - 2 * gridSize) / gridSize)) * gridSize + gridSize,
            y: Math.floor(Math.random() * ((playableHeight - 2 * gridSize) / gridSize)) * gridSize + gridSize
        };
    } else {
        snake.pop();
    }

    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= playableHeight ||
        checkCollision() ||
        checkWallCollision(head)
    ) {
        endGame();
    }
}

function checkWallCollision(head) {
    return walls.some(wall =>
        head.x < wall.x + wall.width &&
        head.x + gridSize > wall.x &&
        head.y < wall.y + wall.height &&
        head.y + gridSize > wall.y
    );
}

function checkCollision() {
    return snake.slice(1).some(part =>
        part.x === snake[0].x && part.y === snake[0].y
    );
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        snake = [{ x: 200, y: 200 }];
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        food = { x: 100, y: 100 };
        score = 0;
        scoreElement.textContent = score;

        startBtn.style.display = "none";
        restartBtn.style.display = "none";

        gameInterval = setInterval(gameLoop, 150);
    }
}

function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawGrid();
    drawWalls();
    drawSnake();
    drawFood();
    moveSnake();
}

function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    restartBtn.style.display = "block";
}

function restartGame() {
    startGame();
}
