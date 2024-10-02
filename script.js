// canvas
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// map
let squares = 20;
let squareSize = canvas.width / squares;

// handle animations
let animationId;
let loopId;

// snake
let speed = 200;
let direction; // 1 = up, 2 = right, 3 = down, 4 = left
let snake; // [ { x: int, y: int }, .. ]

// apple
let apple = {};
let appleEaten = false;

// game loop
function loop() {
    if (appleEaten) {
        placeApple();
        appleEaten = false;
    }
    else {
        snake.splice(0, 1);
    }
    let lastPart = snake.length - 1;
    snake.push({
        x: snake[lastPart].x,
        y: snake[lastPart].y
    });
    lastPart = snake.length - 1;
    if (direction == 1) {
        snake[lastPart].y--;
    }
    if (direction == 2) {
        snake[lastPart].x++;
    }
    if (direction == 3) {
        snake[lastPart].y++;
    }
    if (direction == 4) {
        snake[lastPart].x--;
    }
    // check apple collision
    if (snake[lastPart].x == apple.x && snake[lastPart].y == apple.y) {
        appleEaten = true;
    }
    // check border collision
    if(snake[lastPart].x < 0 || snake[lastPart].x >= squares || snake[lastPart].y < 0 || snake[lastPart].y >= squares) {
        die();
    }
}

// render game on canvas
function draw() {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * squareSize, apple.y * squareSize, squareSize, squareSize);
    ctx.fillStyle = 'darkgreen';
    snake.forEach(part => ctx.fillRect(part.x * squareSize, part.y * squareSize, squareSize, squareSize));

    animationId = requestAnimationFrame(draw);
}

// handles key presses from event listener
function keyDown(e) {
    if (e.keyCode == 38) {
        direction = 1;
    }
    if (e.keyCode == 39) {
        direction = 2;
    }
    if (e.keyCode == 40) {
        direction = 3;
    }
    if (e.keyCode == 37) {
        direction = 4;
    }
    if(e.keyCode == 82) {
        die();
        startGame();
    }
}

// places the apple on random coords
function placeApple() {
    apple.x = Math.floor(Math.random() * squares);
    apple.y = Math.floor(Math.random() * squares);
}

// starts the game
function startGame() {
    snake = [{ x: 4, y: 4 }, { x: 5, y: 4 }];
    direction = 2;
    placeApple();
    loopId = setInterval(loop, speed);
    draw();
}

function die() {
    cancelAnimationFrame(animationId);
    clearInterval(loopId);
    // display death message
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = "48px sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('You died.', canvas.width / 2, canvas.height / 3, canvas.width);
    ctx.font = "24px sans-serif";
    ctx.fillText(`Score: ${snake.length}`, canvas.width / 2, canvas.height / 3 + 60, canvas.width);
    ctx.fillText('Press [R] to restart', canvas.width / 2, canvas.height / 3 + 90, canvas.width);
}

startGame();
document.addEventListener('keydown', keyDown);