// 設定畫布
const canvas = document.getElementById("myCanvas");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const ctx = canvas.getContext("2d");
// 設定 "球" 的位置和中心點
let circle_x = 160;
let circle_y = 60;
let radius = 20;
// 設定 "球" x , y 移動速度
let xSpeed = 20;
let ySpeed = 20;
// 設定 "地板" 的 x,y座標和高度
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
// 設定方塊的 Array
let brickArray = [];
// 設定隨機亂數
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

// 設定 "方塊" class
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
  }
  // 方塊的外觀
  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  //確認有無撞到方塊
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// 製作所有的方塊
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

// 地板移動監聽 (使用鼠標追蹤)
canvas.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  // 確認球是否有打到方塊
  brickArray.forEach((brick, index) => {
    if (brick.touchingBall(circle_x, circle_y)) {
      // 要改變 x,y方向和速度 並且將brick 從 brickArray中移除
      //從下方撞擊
      if (circle_y >= brick.y + brick.height) {
        ySpeed *= -1;
        // 從上方撞擊
      } else if (circle_y <= brick.y) {
        ySpeed *= -1;
        // 從左方撞擊
      } else if (circle_x <= brick.x) {
        ySpeed *= -1;
        // 從右方撞擊
      } else if (circle_x >= brick.x + brick.width) {
        ySpeed *= -1;
      }
      // 如果打到方塊就會消掉
      //這邊的index 表示 被touchingBall的brick本身 , 並刪除一個brick也就是自己
      brickArray.splice(index, 1);
      if (brickArray.length == 0) {
        alert("遊戲結束");
        clearInterval(Startgame);
      }
    }
  });

  //確認有無打到地板
  function touchFloor() {
    if (
      circle_x >= ground_x - radius &&
      circle_x <= ground_x + 200 + radius &&
      circle_y >= ground_y - radius &&
      circle_y <= ground_y + radius
    ) {
      // 如果在上面的區間內 球
      if (ySpeed > 0) {
        circle_y -= 40;
      } else {
        circle_y += 40;
      }
      ySpeed *= -1;
    }
  }
  touchFloor();

  //確認球有沒有打到邊界
  function touchWall() {
    //   右邊牆壁
    if (circle_x >= canvasWidth - radius) {
      xSpeed *= -1;
    }
    //左邊牆壁
    if (circle_x <= radius) {
      xSpeed *= -1; // 負負得正
    }
    //上方牆壁
    if (circle_y <= radius) {
      ySpeed *= -1;
    }
    //下方牆壁
    if (circle_y >= canvasHeight - radius) {
      ySpeed *= -1;
    }
  }
  touchWall();

  //更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的方塊
  brickArray.forEach((brick) => {
    brick.drawBrick();
  });

  // 畫出圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();

  // 畫出地板
  ctx.fillStyle = "red";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);
}

//開始遊戲
let Startgame = setInterval(drawCircle, 25);
