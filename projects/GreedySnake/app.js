const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // getContext() method 會回傳一個canvas的drawing context
//drawing context 可以在canvas上繪圖

// 蛇的大小
const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

let snake = [];
function createSanke() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

createSanke();
//設定果實
class Frult {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "orange";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    // 改變 Fruit 的 x,y
    this.x = new_x;
    this.y = new_y;
  }
}

let myFruit = new Frult();

// 設定蛇按下上下左右的事件監聽
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //每次按上下左右鍵之後，在下一幀被畫出來前，
  //不接受任何 keydown 事件
  //這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數： " + score;
document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;

function draw() {
  //要檢查有沒有吃到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game over");
      return;
    }
  }

  //將背景設定成黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 顯示出隨機的果實
  myFruit.drawFruit();

  // 畫出蛇
  for (let i = 0; i < snake.length; i++) {
    // 蛇的顏色
    if (i == 0) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white"; // 外框的樣式

    // 讓蛇超出邊界後重新顯示
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // (x,y,width.height)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // 會去畫一個實心的長方形
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // 外框
  }

  //以目前的 d變數方向,來決定蛇的下一幀要放在哪個坐標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  } else if (d == "Right") {
    snakeX += unit;
  }

  let newHand = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //重新選定一個新的隨機位置
    myFruit.pickALocation();
    // 吃到果實增加分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數： " + score;
    document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHand);

  window.addEventListener("keydown", changeDirection);
}

//每0.1秒更新一次canvas
let myGame = setInterval(draw, 100);

// 瀏覽器設定分數
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
