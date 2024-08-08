var boundary = document.getElementById("boundary");
var scoreElement = document.getElementById("score");
var highScoreElement = document.getElementById("high-score");
var score = 0;
var board = [];
var boardSize = 12;
var idCounter = 0;
var X = 0;
var Y = 0;
var tailX = [];
var tailY = [];
var foodX = 0;
var foodY = 0;
var foodEaten = false;
var gameSpeed = 100;


var highScore;
if(localStorage.getItem("highScore")) {
    var highScore = localStorage.getItem("highScore");
    highScoreElement.innerText = highScore;
}

for(var i = 0; i < boardSize; i++) {
    board[i] = [];
    for(var j = 0; j < boardSize; j++) {
        var item = document.createElement("div");
        item.setAttribute("class", "board-item");
        idCounter++;
        var id = "b"+idCounter;
        board[i][j] = id;
        item.setAttribute("id", id);
        boundary.appendChild(item);
    }
}



var snakeHead = document.getElementById("b1");
snakeHead.style.backgroundColor = "red";


document.onkeydown = function(e) {
    if(e.key == "ArrowRight" || e.key == "ArrowLeft" ||
    e.key == "ArrowDown" || e.key == "ArrowUp") {
        gameLoop(e.key);
    }
    
};

var gameInterval = null;
var previousKey = "";
function gameLoop(theKey) {
    if((theKey == "ArrowRight" && previousKey == "ArrowLeft") ||
    (theKey == "ArrowLeft" && previousKey == "ArrowRight")) {
        theKey = previousKey;
    }
    if((theKey == "ArrowDown" && previousKey == "ArrowUp") ||
    (theKey == "ArrowUp" && previousKey == "ArrowDown")) {
        theKey = previousKey;
    }


    if(theKey != previousKey) {
        previousKey = theKey;
    }


    if(gameInterval) {
        clearInterval(gameInterval);
    }
    
    gameInterval = setInterval(()=>{
        snakeMovement(theKey);
        joinTale();
    },gameSpeed);
}

function snakeMovement(key = "ArrowRight")  {
    
    tailX.unshift(X);
    tailY.unshift(Y);
    
    if(key === "ArrowRight") {
        X++;
    }
    else if(key === "ArrowLeft") {
        X--;
    }
    else if(key === "ArrowDown") {
        Y++;
    }
    else if(key === "ArrowUp") {
        Y--;
    }
    
    
    
    if(X === boardSize) {
        X = 0;
    }
    if(Y === boardSize) {
        Y = 0;
    }
    if(X < 0) {
        X = boardSize-1;
    }
    if(Y < 0) {
        Y = boardSize-1;
    }
    
    
    var current = document.getElementById(board[Y][X]);
    current.style.backgroundColor = "red";
    
    if(Y == foodY && X == foodX) {
        foodEaten = true;
        score+=10;
        scoreElement.innerText = score;
        displayFood();
    }
    else {
        foodEaten = false;
    }
    if(gameOver()) {
        if(score > highScore) {
            localStorage.setItem("highScore", score);
        }
        clearInterval(gameInterval);
        location.reload();
        alert("Game Over");
    }
    
}

var firstTime = false;
function joinTale() {
    var node1;
    for(var i = 0; i < tailX.length; i++) {
        node1 = document.getElementById(board[tailY[i]][tailX[i]]);
        node1.style.backgroundColor = "yellow";
    }
    if(!firstTime || !foodEaten) {
        firstTime = true;
        var removedX = tailX.pop();
        var removedY = tailY.pop();
        var removedItem = document.getElementById(board[removedY][removedX]);
        if(!(foodY == removedY && foodX == removedX)) {
            removedItem.style.backgroundColor = "lightgrey";
        }

        
    }

}

var f = true;
function gameOver() {
    var gameover = false;
    for(var i = 0; i < tailX.length; i++) {
        if((X == tailX[i] && Y == tailY[i]) && !f) {
            gameover = true;
            break;
        }
    }
    f = false;
    return gameover;
}
function displayFood() {    
    var foodOnTail = true;
    while(foodOnTail) {
        foodOnTail = false;
        foodX = Math.floor(Math.random() * boardSize);
        foodY = Math.floor(Math.random() * boardSize);
        var i = 0;
        while(i < tailX.length - 1) {
            if(foodX == tailX[i] && foodY == tailY[i]) {
                foodOnTail = true;
                break;
            }
            i++;
        }
        if(foodOnTail) {
            continue;
        }
        var foodElement = document.getElementById(board[foodY][foodX]);
        foodElement.style.backgroundColor = "green";

    }
    
}

displayFood();