const level = {
  rows: 8,
  columns: 8,
  grid: [],
  colors: ['red', 'green', 'blue', 'yellow', 'orange', 'purple'],
};

let spriteSize = 64;
let canvas;
let ctx;
const bunches = [];
const STATES = ['INIT', 'UPDATING', 'NEEDS_UPDATE', 'READY'];
const CURRENT_STATE = 'INIT';
window.addEventListener('DOMContentLoaded', (event) => {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  canvas.addEventListener('click', (e) => {
    console.log(e.offsetX);
    console.log(e.offsetY);
  });
  STATE = 'INIT';
  draw();
});

class Cell {
  constructor(x, y, color, row) {
    this.x = x * spriteSize;
    this.y = y;
    this.color = color;
    this.row = row + 1;
  }
  vy = 4;
  remove = false;
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, spriteSize, spriteSize);

    if (this.remove) {
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 20;
      ctx.lineJoin = 'bevel';
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(this.x, this.y, spriteSize, spriteSize);
      ctx.shadowColor = 'rgba(0, 0, 0, 0)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.lineJoin = 'miter';
      ctx.strokeStyle = '#000';
    } else {
      ctx.strokeRect(this.x, this.y, spriteSize, spriteSize);
    }
    ctx.fill();
  }
}

for (let j = 0; j <= 7; j++) {
  level.grid[j] = [];
  for (let i = 0; i <= 7; i++) {
    let colorId = Math.floor(Math.random() * level.colors.length);
    let newCell = new Cell(i, j, level.colors[colorId], j);
    level.grid[j].push(newCell);
  }
}
level.grid.reverse();
// console.log(level.grid)

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  level.grid.map((row) => {
    row.map((cell) => {
      cell.draw();
      cell.y += cell.vy;

      if (cell.y + cell.vy > canvas.height - spriteSize * cell.row) {
        cell.y = spriteSize * level.columns - spriteSize * cell.row;
      }
    });
  });

  if (STATE === 'INIT') {
    bunchCheck();
  }
  if (STATE === 'NEEDS_UPDATE') {
    update();
  }
  STATE = 'READY';

  raf = window.requestAnimationFrame(draw);
}

function update() {
  console.log('Updating');
  if (bunches.length > 0) {
    bunches.forEach((bunch) => {
      if (bunch.direction === 'COLUMN') {
        console.log(
          'column',
          bunch,
          level.grid[bunch.lastColumnIndex][bunch.column]
        );
        level.grid[bunch.lastColumnIndex][bunch.column].remove = true;
        for (let i = 1; i < bunch.size; i++) {
          level.grid[bunch.lastColumnIndex - i][bunch.column].remove = true;
        }
        // level.grid[bunch.lastColumnIndex].splice(bunch.column, 1)
      } else {
        console.log('row', bunch);
      }
    });
  }
}

function bunchCheck() {
  console.log('Checking for Bunches');
  // check Columns
  for (let j = 0; j < level.rows; j++) {
    let tempCol = [];
    for (let i = 0; i < level.grid.length; i++) {
      tempCol.push(level.grid[i][j]);
    }
    for (let c = 0; c < level.colors.length; c++) {
      if (tempCol.filter((x) => x.color === level.colors[c]).length >= 3) {
        let matchCount = 0;
        for (let z = 0; z < tempCol.length; z++) {
          if (tempCol[z].color === level.colors[c]) {
            matchCount++;
          } else {
            if (matchCount >= 3) {
              //Do something with bunch
              bunches.push({
                size: matchCount,
                direction: 'COLUMN',
                lastColumnIndex: z - 1,
                column: j,
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
                direction: 'COLUMN',
                lastColumnIndex: z,
                column: j,
                type: c,
              });
            }
          }
        }
      }
      // if we don't have more than 3 of a type we can continue
    }
  }
  // Checking rows
  // for (let i = 0; i < level.grid.length; i++) {
  //     for (let c = 0; c < level.colors.length; c++) {
  //         // first lets see if we have more than 3 of a type
  //         if (level.grid[i].filter((x) => x.color === level.colors[c]).length >= 3) {
  //             let matchCount = 0;
  //             for (let z = 0; z < level.grid.length; z++) {
  //                 if (level.grid[i][z].color === level.colors[c]) {
  //                     matchCount++;
  //                 } else {
  //                     if (matchCount >= 3) {
  //                         //Do something with the bunch
  //                         bunches.push({
  //                             size: matchCount,
  //                             direction: 'ROW',
  //                             lastRowIndex: z - 1,
  //                             row: i,
  //                             type: c,
  //                         });
  //                     }
  //                     matchCount = 0;
  //                 }
  //                 if (z === level.columns - 1) {
  //                     if (matchCount >= 3) {
  //                         //Do something with the bunch
  //                         bunches.push({
  //                             size: matchCount,
  //                             direction: 'ROW',
  //                             lastRowIndex: z,
  //                             row: i,
  //                             type: c,
  //                         });
  //                     }
  //                 }
  //             }
  //         }
  // if we don't have more than 3 of a type we can continue
  // }
  // }
  console.log('bunches', bunches);
  if (bunches.length > 0) {
    STATE = 'NEEDS_UPDATE';
  } else {
    STATE = 'READY';
  }
}
