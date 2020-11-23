const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/*
 * Set canvas size.
 */
{
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0,
    window.innerWidth || 0);
  const viewportHeight = Math.max(document.documentElement.clientHeight || 0,
    window.innerHeight || 0);
  const maxSize = Math.min(viewportWidth, viewportHeight);
  const minSize = 101;
  let size = minSize;
  while (size + minSize <= maxSize) size += minSize;
  canvas.width = canvas.height = size;
}

const directions = {'N': [0, 1], 'S': [0, -1], 'W': [-1, 0], 'E': [1, 0]};
const opposite = {'N': 'S', 'S': 'N', 'W': 'E', 'E': 'W'};
const side = {'empty': 0, 'wall': 1, 'exit': 2};

function Cell() {
  this.visited = false;
  this.sides = {};
  for (let d in directions) this.sides[d] = side['wall'];
}

function Maze(rows, cols) {
  this.board = [];
  for (let i = 0; i < rows; ++i) {
    this.board.push([]);
    for (let j = 0; j < cols; ++j) {
      this.board[i].push(new Cell());
    }
  }

  let self = this;

  (function generate(x = 0, y = 0) {
    self.board[x][y].visited = true;
    let directionKeys = [];
    for (let key in directions) directionKeys.push(key);
    shuffleArray(directionKeys);
    for (let key of directionKeys) {
      let dx = directions[key][0];
      let dy = directions[key][1];
      if (isValidPos(x + dx, y + dy, self.board) === false ||
        self.board[x + dx][y + dy].visited === true)
      {
        continue;
      }
      self.board[x][y].sides[key] = side['empty'];
      self.board[x + dx][y + dy].sides[opposite[key]] = side['empty'];
      generate(x + dx, y + dy);
    }
  })();

  function mapCoord(c) {
    return 2*c + 1;
  }

  this.toBitmap = function() {
    let bitmap = [];
    let bitmapRows = mapCoord(rows);
    let bitmapCols = mapCoord(cols);

    for (let i = 0; i < bitmapRows; ++i) {
      bitmap.push([]);
      for (let j = 0; j < bitmapCols; ++j) {
        bitmap[i].push(side['wall']);
      }
    }

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        bitmap[mapCoord(i)][mapCoord(j)] = side['empty'];
        for (let d in directions) {
          if (self.board[i][j].sides[d] === side['wall']) continue;
          let dx = mapCoord(i) + directions[d][0];
          let dy = mapCoord(j) + directions[d][1];
          bitmap[dx][dy] = side['empty'];
        }
      }
    }
    bitmap[bitmapRows - 2][bitmapCols - 1] = side['exit'];
    return bitmap;
  }
}

function drawMaze(bitmap) {
  let size = Math.floor(canvas.width / bitmap.length);
  for (let i = 0; i < bitmap.length; ++i) {
    for (let j = 0; j < bitmap[i].length; ++j) {
      switch (bitmap[i][j]) {
        case side['wall']:
          ctx.fillStyle = 'black';
          break;
        case side['empty']:
          ctx.fillStyle = 'white';
          break;
        case side['exit']:
          ctx.fillStyle = '#26dd22';
          break;
      }
      ctx.fillRect(i*size, j*size, size, size);
    }
  }
}

function Character(bitmap) {
  this.pos = {x: 1, y: 1};
  this.color = '#2226dd';

  let size = Math.floor(canvas.width / bitmap.length);

  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x*size, this.pos.y*size, size, size);
  }

  this.clear = function() {
    ctx.clearRect(this.pos.x*size, this.pos.y*size, size, size);
  }

  this.move = function(dir) {
    let dx = this.pos.x + directions[dir][0];
    let dy = this.pos.y + directions[dir][1];
    if (isValidPos(dx, dy, bitmap) && bitmap[dx][dy] !== side['wall']) {
      this.clear();
      this.pos.x = dx;
      this.pos.y = dy;
      this.draw();
    }
  }
}

const maze = new Maze(50, 50);
const bitmap = maze.toBitmap();
const character = new Character(bitmap);

const FRAMES_PER_SECOND = 10;
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;

drawMaze(bitmap);
character.draw();

function main(time) {
  if (time - lastFrameTime < FRAME_MIN_TIME) {
    requestAnimationFrame(main);
    return;
  }

  if (rightPressed) character.move('E');
  else if (leftPressed) character.move('W');
  else if (upPressed) character.move('S');
  else if (downPressed) character.move('N');

  if (bitmap[character.pos.x][character.pos.y] === side['exit']) {
    window.alert('You win!');
    return;
  }

  lastFrameTime = time;
  requestAnimationFrame(main);
}

requestAnimationFrame(main);
