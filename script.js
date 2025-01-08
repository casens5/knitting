"use strict";

// *********
// utils
// *********

const grid = [];
const dimensions = [];
const rule = [];
const ruleSize = [];

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

      flipPixelValue(cellDiv, initialValue);

      cellDiv.addEventListener("click", () => {
        const live = grid[index][jindex];
        flipPixelValue(cellDiv, live);
        grid[index][jindex] = live === 1 ? 0 : 1;

        applyRule([index, jindex]);
        generateGridHtml();
      });
    });
  });
}

function generateRuleDisplay(number, total) {
  const ruleContainer = document.createElement("div");
  ruleContainer.classList.add("ruleContainer");
  ruleContainer.style.gridTemplateColumns = `repeat(${total}, 1fr)`;
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
  inputDiv.classList.add("cell", "off");
  ruleContainer.append(inputDiv);

  ruleContainer.addEventListener("click", () => {
    rule[number] = rule[number] === 0 ? 1 : 0;
    setRuleValue(inputDiv, rule[number]);
  });

  return ruleContainer;
}

function setRuleValue(div, value) {
  if (value === 0) {
    div.classList.add("off");
    div.classList.remove("on");
  } else {
    div.classList.add("on");
    div.classList.remove("off");
  }
}

function flipPixelValue(div, value) {
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
  applyRule([1, 1]);
  generateGridHtml();
}

function randomRule() {
  const length = rule.length;
  rule.length = 0;
  rule.push(0);
  for (let i = 1; i < length; i++) {
    rule.push(Math.random() > 0.5 ? 1 : 0);
    setRuleValue($(`rule-${i}-input`), rule[i]);
  }
}

function symmetricRule() {
  const length = rule.length;
  rule.length = 0;
  rule.push(0);
  rule.push(0);
  for (let i = 2; i < length; i += 2) {
    const thisVal = Math.random() > 0.5 ? 1 : 0;
    rule.push(thisVal);
    rule.push(thisVal);
    setRuleValue($(`rule-${i}-input`), rule[i]);
    setRuleValue($(`rule-${i + 1}-input`), rule[i + 1]);
  }
}

function updateDimensions() {
  const rows = parseInt($("rowsInput").value, 10);
  const columns = parseInt($("columnsInput").value, 10);
  dimensions.length = 0;
  dimensions.push(rows, columns);
}

function updateRuleDisplay() {
  const ruleControl = $("ruleControl");
  ruleControl.replaceChildren();
  ruleSize.length = 0;
  ruleSize.push($("ruleSize").value);
  for (let i = 0; i < 2 ** ruleSize[0]; i++) {
    const ruleDiv = generateRuleDisplay(i, ruleSize[0]);
    ruleControl.append(ruleDiv);
    rule.push(0);
  }
}

function applyRule(start) {
  let startX = Math.max(start[0], 1);
  let startY =
    start[0] === 0 || (start[0] === 1 && start[1] < 2) ? 1 : start[1];
  if (startY === grid[0].length - 1) {
    startY = 0;
    startX++;
  } else {
    startY++;
  }
  const tempGrid = [...grid.slice(0, startX)];
  for (let i = startX; i < grid.length; i++) {
    let j = 0;
    if (i === startX) {
      tempGrid.push(grid[startX].slice(0, startY));
      j = startY;
    } else {
      tempGrid.push([]);
    }
    while (j < tempGrid[0].length) {
      const prev =
        j === 0 ? tempGrid[i - 1][tempGrid[0].length - 1] : tempGrid[i][j - 1];
      const next =
        j === tempGrid[0].length - 1 ? tempGrid[i][0] : tempGrid[i - 1][j + 1];
      const shape = prev + 2 * tempGrid[i - 1][j] + 4 * next;
      tempGrid[i][j] = rule[shape];
      j++;
    }
  }
  grid.length = 0;
  grid.push(...tempGrid);
}

function init() {
  updateRuleDisplay();
  updateDimensions();
  resetGrid();
  generateGridHtml();
}

function printRule() {
  console.log(`[ ${rule.join(", ")} ] --`);
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

$("setRuleSize").addEventListener("click", updateRuleDisplay);

init();
