"use strict";

// *********
// utils
// *********

const grid = [];
const dimensions = [];
const rule = [];

function $(id) {
  return document.getElementById(id);
}

function resetGrid() {
  grid.length = 0;
  grid.push(
    ...[...Array(dimensions[0])].map(() => Array(dimensions[1]).fill(0)),
  );
}

function generateGridHtml() {
  const outputGrid = $("outputGrid");
  outputGrid.replaceChildren();
  outputGrid.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`;
  grid.forEach((row, index) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    rowDiv.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
    outputGrid.append(rowDiv);

    row.forEach((cell, jindex) => {
      const cellDiv = document.createElement("div");
      rowDiv.append(cellDiv);
      cellDiv.classList.add("cell");
      const initialValue = cell === 1 ? 0 : 1;

      setPixelValue(cellDiv, initialValue);

      cellDiv.addEventListener("click", () => {
        const live = grid[index][jindex];
        setPixelValue(cellDiv, live);
        grid[index][jindex] = live === 1 ? 0 : 1;
        applyRule(start);
      });
    });
  });
}

function generateRuleDisplay(number, total) {
  const ruleContainer = document.createElement("div");
  ruleContainer.classList.add("ruleContainer");
  ruleContainer.id = `rule-${number}`;
  const spaceDiv = document.createElement("div");
  spaceDiv.classList.add("no-border");
  ruleContainer.append(spaceDiv);

  for (let i = 0; i < total; i++) {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    ruleContainer.append(cellDiv);
    if (i === total - 1) {
      if (number % 2 === 1) {
        cellDiv.classList.add("live");
      } else {
        cellDiv.classList.add("dead");
      }
    } else {
      if (Math.floor(number / 2 ** (i + 1)) % 2 === 1) {
        cellDiv.classList.add("live");
      } else {
        cellDiv.classList.add("dead");
      }
    }
  }

  const inputDiv = document.createElement("div");
  inputDiv.id = `rule-${number}-input`;
  inputDiv.classList.add("cell", "dead");
  ruleContainer.append(inputDiv);

  ruleContainer.addEventListener("click", () => {
    setPixelValue(inputDiv, rule[number]);
    rule[number] = rule[number] === 0 ? 1 : 0;
  });

  return ruleContainer;
}

function setPixelValue(div, value) {
  if (value === 0) {
    div.classList.add("live");
    div.classList.remove("dead");
  } else {
    div.classList.add("dead");
    div.classList.remove("live");
  }
}

function randomSeed(randLevel) {
  resetGrid();
  for (let i = 0; i < grid[0].length; i++) {
    grid[0][i] = Number(Math.random() < randLevel);
  }
  grid[1][0] = Number(Math.random() < randLevel);
  generateGridHtml();
}

function randomRule() {
  const length = rule.length;
  rule.length = 0;
  for (let i = 0; i < length; i++) {
    rule.push(Math.random() > 0.5 ? 1 : 0);
    setPixelValue($(`rule-${i}-input`), rule[i]);
  }
}

function updateDimensions() {
  const rows = parseInt($("rowsInput").value, 10);
  const columns = parseInt($("columnsInput").value, 10);
  dimensions.length = 0;
  dimensions.push(rows, columns);
}

function applyRule(start) {
  const tempGrid = grid.slice(0, start[0]);
  tempGrid.push(grid[start[0]].slice(0, start[1]));
  for (let i = start[0]; i < grid.length; i++) {
    for (let j = start[0] === i ? start[1] : 0; j < grid[0].length; j++) {
      const prev =
        j === 0 ? tempGrid[i - 1][tempGrid[0].length - 1] : tempGrid[i][j - 1];
      const next =
        j === tempGrid[i].length
          ? tempGrid[i][grid[0].length - 1]
          : tempGrid[i - 1][j + 1];
      const shape = prev + 2 * tempGrid[i - 1][j] + 4 * next;
      tempGrid[i][j] = rule[shape];
    }
  }
  grid.length = 0;
  grid.push(...tempGrid);
}

const ruleControl = $("ruleControl");
for (let i = 0; i < 8; i++) {
  const ruleDiv = generateRuleDisplay(i, 3);
  ruleControl.append(ruleDiv);
  rule.push(0);
}

// *********
// event listeners
// *********
$("getGridSize").addEventListener("click", () => {
  updateDimensions();
  resetGrid();
  generateGridHtml();
});

$("controlsDrawer").addEventListener("click", () => {
  const controls = $("controls");
  const upArrow = $("UpArrow");
  const downArrow = $("DownArrow");
  controls.dataset.hidden = controls.dataset.hidden === "0" ? "1" : "0";
  if (controls.dataset.hidden === "0") {
    controls.classList.remove("hidden");
    downArrow.classList.add("hidden");
    upArrow.classList.remove("hidden");
  } else {
    controls.classList.add("hidden");
    downArrow.classList.remove("hidden");
    upArrow.classList.add("hidden");
  }
});

$("randomRule").addEventListener("click", randomRule);
$("randomSeed").addEventListener("click", () => {
  randomSeed($("randomSeedDensity").value);
});
