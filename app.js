const N = 30;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const bullets = [];

var mouse = null;

// 重たい処理
function heavyTask(n){
  if(n < 2){
    return 1;
  }
  return heavyTask(n - 1) + heavyTask(n - 2);
}

// ランダムな2次元ベクトルを作成する関数
function generateVec2d(maxAngle, minLength, maxLength){
  var angle = (maxAngle * Math.random() - maxAngle / 2) / 180 * Math.PI;
  var length = (maxLength - minLength) * Math.random() + minLength;

  var x = Math.cos(angle) * length;
  var y = Math.sin(angle) * length;

  return [x, y];
};

/*
 * 弾オブジェクトの定義
 */
function Bullet(x, y){
  this.x = x; // X 座標
  this.y = y; // Y 座標
  [this.dx, this.dy] = generateVec2d(30, 2, 5); // スピード
  this.w = 10; // 幅
  this.h = 10; // 高さ
  this.r = Math.floor(256 * Math.random()); // 描画色の赤成分
  this.g = Math.floor(256 * Math.random()); // 描画色の緑成分
  this.b = Math.floor(256 * Math.random()); // 描画色の青成分
  this.a = 208 + Math.floor(48 * Math.random()); // 描画色の不透明度
}

// 弾の位置更新
Bullet.prototype.update = function(){
  this.x += this.dx;
  this.y += this.dy;
  heavyTask(15);
};

// 弾の描画色を RGBA 表記で返す
Bullet.prototype.color = function(){
  return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
};

// 弾の追加
function addBullet(){
  if(mouse == null){
    return;
  }
  for(let i = 0; i < N; i++){
    let x, y, b;
    x = mouse.clientX - canvas.offsetLeft;
    y = mouse.clientY - canvas.offsetTop;
    x = Math.floor(x / canvas.scrollWidth * canvas.width);
    y = Math.floor(y / canvas.scrollHeight * canvas.height);

    b = new Bullet(x, y);
    bullets.push(b);
  }
}

// 全ての弾の位置の更新
function updateBullets(){
  for(let i of bullets){
    i.update();
  }
}

// 以前描画されていたものの消去
function clearCanvas(){
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 全ての弾の描画
function renderBullets(){
  clearCanvas();
  for(let i of bullets){
    ctx.fillStyle = i.color();
    ctx.fillRect(i.x, i.y, i.w, i.h);
  }
}

// フレームごとに走る更新処理
function update(){
  addBullet();
  updateBullets();
  heavyTask(30);
  renderBullets();
  window.requestAnimationFrame(update);
}


// アプリ起動
function start(){
  canvas.addEventListener("mousedown", function(event){
    mouse = event;
  });
  canvas.addEventListener("mouseup", function(){
    mouse = null;
  });
  canvas.addEventListener("mousemove", function(event){
    if(mouse){
      mouse = event;
    }
  });

  window.requestAnimationFrame(update);
}

start();
