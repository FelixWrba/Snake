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
let highscore = +localStorage.getItem('highscore') || 0;
let state;

// apple
let apple = {};
let appleEaten = false;

// anticheat
function setState() {
    state = snake.length * highscore;
}

function checkState() {
    if(state != snake.length * highscore) {
        stopGame('death');
    }
}

// game loop
function loop() {
    checkState();
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
    setState();
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
    // check if snake collides with tail
    let snakeBody = snake.slice(0, lastPart);
    let eatenItself = snakeBody.find(part => part.x == snake[lastPart].x && part.y == snake[lastPart].y);
    // check border collision
    if (snake[lastPart].x < 0 || snake[lastPart].x >= squares || snake[lastPart].y < 0 || snake[lastPart].y >= squares || eatenItself) {
        stopGame('death');
    }
}

// render game on canvas
function draw() {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * squareSize, apple.y * squareSize, squareSize - 1, squareSize - 1);
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x * squareSize, part.y * squareSize, squareSize - 1, squareSize - 1));

    animationId = requestAnimationFrame(draw);
}

// handles key presses from event listener
function keyDown(e) {
    if (e.keyCode == 38 && direction != 3) { // up
        direction = 1;
    }
    else if (e.keyCode == 39 && direction != 4) { // right
        direction = 2;
    }
    else if (e.keyCode == 40 && direction != 1) { // left
        direction = 3;
    }
    else if (e.keyCode == 37 && direction != 2) { // down
        direction = 4;
    }
    if (e.keyCode == 82) {
        stopGame('death');
        startGame();
    }
    else if (e.keyCode == 80) {
        stopGame('cancel');
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
    setState();
    direction = 2;
    placeApple();
    loopId = setInterval(loop, speed);
    draw();
}

function mainMenu() {
    // display main menu
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = "60px sans-serif";
    ctx.fillText('Snake', canvas.width / 2, canvas.height / 3, canvas.width);
    ctx.font = "20px monospace";
    ctx.fillText('Press [P] to play', canvas.width / 2, canvas.height / 3 + 90, canvas.width);
    ctx.font = "20px sans-serif";
    ctx.textAlign = 'right';
    ctx.fillText(`Highscore: ${highscore}`, canvas.width - 30, canvas.height - 30, canvas.width);
}

// display death screen
function stopGame(page) {
    cancelAnimationFrame(animationId);
    clearInterval(loopId);
    if (page == 'death') {
        deathScreen();
    }
    else if (page == 'main') {
        mainMenu();
    }
}

function deathScreen() {
    // check if new highscore
    let highscoreText = 'Highscore';
    if (snake.length > highscore) {
        highscore = snake.length;
        localStorage.setItem('highscore', '' + highscore);
        highscoreText = 'New Highscore!';
    }
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = "48px sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('You died.', canvas.width / 2, canvas.height / 3, canvas.width);
    ctx.font = "24px sans-serif";
    ctx.fillText(`Score: ${snake.length}`, canvas.width / 2, canvas.height / 3 + 60, canvas.width);
    ctx.fillText(`${highscoreText}: ${highscore}`, canvas.width / 2, canvas.height / 3 + 90, canvas.width);
    ctx.font = "20px monospace";
    ctx.fillText('Press [R] to restart', canvas.width / 2, canvas.height / 3 + 150, canvas.width);
}

stopGame('main');
document.addEventListener('keydown', keyDown);