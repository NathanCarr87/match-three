const level = {
  rows: 8,
  columns: 8,
  grid: [],
  colors: ['red', 'green', 'blue', 'yellow', 'orange', 'purple'],
};

let cells = [];

let spriteSize = 64;
let canvas;
let ctx;
const bunches = [];
window.addEventListener('DOMContentLoaded', (event) => {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  canvas.addEventListener('click', (e) => {
    console.log(e.offsetX);
    console.log(e.offsetY);
  });
  draw();
});

class Cell {
  constructor(x, y, color, row) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.row = row;
  }
  vy = 4;
  draw() {
    ctx.fillRect(this.x, this.y, spriteSize, spriteSize);
    ctx.strokeRect(this.x, this.y, spriteSize, spriteSize);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let j = 0; j < 8; j++) {
  for (let i = 0; i < 8; i++) {
    cells.push(
      new Cell(
        i * spriteSize,
        i,
        level.colors[Math.floor(Math.random() * level.colors.length)],
        j
      )
    );
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cells.forEach((cell) => {
    cell.draw();
    cell.y += cell.vy;

    if (cell.y + cell.vy > canvas.height - spriteSize * cell.row) {
      cell.y = spriteSize * level.columns - spriteSize * cell.row;
    }
  });
  raf = window.requestAnimationFrame(draw);
}

function update() {
  if (bunches.length > 0) {
    console.log('do something');
  }
}

function initializeGrid() {
  // for (let i = 0; i < level.rows; i++) {
  //   level.grid.push([]);
  //   for (let j = 0; j < level.columns; j++) {
  //     let idNumber = Math.floor(Math.random() * level.colors.length);
  //     level.grid[i][j] = idNumber;
  //     ctx.fillStyle = level.colors[idNumber];
  //     ctx.fillRect(i * spriteSize, j * spriteSize, spriteSize, spriteSize);
  //     ctx.strokeRect(i * spriteSize, j * spriteSize, spriteSize, spriteSize);
  //   }
  // }
  duplicateCheck();
}

function duplicateCheck() {
  // check rows
  for (let j = 0; j < level.rows; j++) {
    let tempRow = [];
    for (let i = 0; i < level.grid.length; i++) {
      tempRow.push(level.grid[i][j]);
    }
    for (let c = 0; c < level.colors.length; c++) {
      if (tempRow.filter((x) => x === c).length >= 3) {
        let matchCount = 0;
        for (let z = 0; z < tempRow.length; z++) {
          if (tempRow[z] === c) {
            matchCount++;
          } else {
            if (matchCount >= 3) {
              //Do something with bunch
              bunches.push({
                size: matchCount,
                direction: 'HORIZONTAL',
                lastHorizonatlIndex: z - 1,
                row: j,
                type: c,
              });
            }
            matchCount = 0;
          }
          if (z === level.rows - 1) {
            if (matchCount >= 3) {
              //Do something with the bunch

              bunches.push({
                size: matchCount,
                direction: 'HORIZONTAL',
                lastHorizonatlIndex: z,
                row: j,
                type: c,
              });
            }
          }
        }
      }
      // if we don't have more than 3 of a type we can continue
    }
  }
  // Checking for columns
  for (let i = 0; i < level.grid.length; i++) {
    for (let c = 0; c < level.colors.length; c++) {
      // first lets see if we have more than 3 of a type
      if (level.grid[i].filter((x) => x === c).length >= 3) {
        let matchCount = 0;
        for (let z = 0; z < level.grid.length; z++) {
          if (level.grid[i][z] === c) {
            matchCount++;
          } else {
            if (matchCount >= 3) {
              //Do something with the bunch
              bunches.push({
                size: matchCount,
                direction: 'VERTICAL',
                lastVerticalIndex: z - 1,
                row: i,
                type: c,
              });
            }
            matchCount = 0;
          }
          if (z === level.columns - 1) {
            if (matchCount >= 3) {
              //Do something with the bunch
              bunches.push({
                size: matchCount,
                direction: 'VERTICAL',
                lastVerticalIndex: z,
                row: i,
                type: c,
              });
            }
          }
        }
      }
      // if we don't have more than 3 of a type we can continue
    }
  }

  console.log(bunches);
}
