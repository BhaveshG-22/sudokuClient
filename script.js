generateNew();
let grid = [];

let script = [];

if (grid.length != 0) {
  fillInitialBoxes(grid);
}

function fillInitialBoxes(grid) {
  // Loop through the rows
  for (let i = 0; i < 9; i++) {
    // Loop through the columns
    for (let j = 0; j < 9; j++) {
      // Get the box element using its row and column indices
      const box = document.getElementById(`box${i}${j}`);

      box.style.color = "black";

      if (grid[i][j]) {
        // Set its innerHTML to a number
        box.innerHTML = grid[i][j];
      } else {
        box.innerHTML = "";
      }
    }
  }
}

function solveSudoku(grid, startRow, startCol) {
  let plus = "added";
  let minus = "removed";

  const [row, col] = findEmptySpot(startRow, startCol);

  if (row === -1 && col === -1) {
    return true;
  }

  for (let i = 1; i < 10; i++) {
    if (isValidPos(row, col, i)) {
      grid[row][col] = i;

      script.push([row, col, plus, i]);

      if (solveSudoku(grid, row, col)) {
        return true;
      }

      grid[row][col] = 0;

      script.push([row, col, minus, i]);
    }
  }

  return false;
}

function findEmptySpot(row, col) {
  // console.log(row + "-" + col);
  value = `${"checking"}+${row}+${col}`;
  components = value.split(/\+/);
  script.push(components);
  for (let i = row; i < 9; i++) {
    for (let j = col; j < 9; j++) {
      if (grid[i][j] === 0) {
        return [i, j];
      }
    }
    col = 0;
  }
  return [-1, -1];
}

function isValidPos(row, col, num) {
  for (let i = 0; i < 9; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const n = 3 * Math.floor(col / 3) + (i % 3);

    if (grid[row][i] === num || grid[i][col] === num || grid[m][n] === num) {
      return false;
    }
  }
  return true;
}

// solve()

function solve() {
  if (solveSudoku(grid, 0, 0)) {
    const startBtn = document.getElementsByClassName("solve-btn")[0];
    startBtn.classList.add("disabled");

    const stopBtn = document.getElementsByClassName("stop-btn")[0];
    stopBtn.classList.remove("disabled");

    console.log(script);
    // call the function to start logging the array elements
    displayArrayElement();
  } else {
    console.log("Invalid Suduko Input");
  }
  // console.log("HELLO");
}

let timeInterval = 50; // initial time interval

// update timeInterval function called when range slider value changes
function updateTimeInterval() {
  timeInterval = document.getElementById("myRange").value;
}

let continueExecution = true;

function stop() {
  const loader = document.getElementById("loader");
  loader.classList.add("fa-spinner");
  continueExecution = false;
}

let i = 0;

async function displayArrayElement() {
  if (!continueExecution) {
    console.log("PROCESS STOPPED");

    displayArrayElementWithNoInterval();
    console.log("After displayArrayElementWithNoInterval ");

    const loader = document.getElementById("loader");
    loader.classList.remove("fa-spinner");

    const stopBtn = document.getElementsByClassName("stop-btn")[0];
    stopBtn.classList.add("disabled");

    return;
  }

  const generateBtn = document.getElementsByClassName("btn-generate")[0];
  generateBtn.classList.add("disabled");

  console.log(continueExecution);
  // console.log(script[i]);

  let box = document.getElementById(`box${script[i][1]}${script[i][2]}`);

  if (script[i].length == 3) {
    // checking
    // box.style.background = "yellow";
  } else {
    box = document.getElementById(`box${script[i][0]}${script[i][1]}`);

    // added or removed
    if (script[i][2] == "added") {
      box.style.color = "red";
      box.innerHTML = script[i][3];
    } else if (script[i][2] == "removed") {
      // box.style.background = "red";
      // box.innerHTML = script[i][3];
      box.innerHTML = "";
    } else {
      console.log("Error: " + script[i][2]);
    }
  }

  i++;

  if (i === script.length) {
    generateBtn.classList.remove("disabled");
    stopBtn.classList.add("disabled");
    clearTimeout(timeoutId);
    return;
  }

  // call this function again after the specified time interval
  const timeoutId = setTimeout(displayArrayElement, timeInterval);
}

function displayArrayElementWithNoInterval() {
  const generateBtn = document.getElementsByClassName("btn-generate")[0];
  generateBtn.classList.add("disabled");

  while (i < script.length) {
    let box = document.getElementById(`box${script[i][1]}${script[i][2]}`);

    if (script[i].length == 3) {
      // checking
      // box.style.background = "yellow";
    } else {
      box = document.getElementById(`box${script[i][0]}${script[i][1]}`);

      // added or removed
      if (script[i][2] == "added") {
        box.style.color = "red";
        box.innerHTML = script[i][3];
      } else if (script[i][2] == "removed") {
        // box.style.background = "red";
        // box.innerHTML = script[i][3];
        box.innerHTML = "";
      } else {
        console.log("Error: " + script[i][2]);
      }
    }

    i++;
  }

  generateBtn.classList.remove("disabled");
  continueExecution = true;

  console.log("in displayArrayElementWithNoInterval");
}

function generateNew() {
  const request = new XMLHttpRequest();
  request.open("GET", "https://sudoku-api-olive.vercel.app/");
  request.onload = function () {
    if (request.status === 200) {
      const sudokuBox = JSON.parse(request.responseText);
      console.log("Received Sudoku box:");
      console.log(sudokuBox);
      grid = sudokuBox;
      fillInitialBoxes(grid);
    } else {
      console.error("Failed to generate Sudoku box.");
    }
  };
  request.send();

  const startBtn = document.getElementsByClassName("solve-btn")[0];
  startBtn.classList.remove("disabled");

  const stopBtn = document.getElementsByClassName("stop-btn")[0];
  stopBtn.classList.add("disabled");
}
