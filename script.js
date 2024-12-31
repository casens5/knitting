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

function resetGrid(rows, columns) {
  return [...Array(rows)].map(() => Array(columns).fill(0));
}

function generateGridHtml(grid) {
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

      if (cell === 1) {
        cellDiv.classList.add("live");
      } else {
        cellDiv.classList.add("dead");
      }

      cellDiv.addEventListener("click", () => {
        const live = grid[index][jindex];
        if (live === 1) {
          cellDiv.classList.remove("live");
          cellDiv.classList.add("dead");
        } else {
          cellDiv.classList.remove("dead");
          cellDiv.classList.add("live");
        }
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
  inputDiv.classList.add("cell", "dead");
  ruleContainer.append(inputDiv);

  ruleContainer.addEventListener("click", () => {
    if (rule[number] === 0) {
      inputDiv.classList.add("live");
      inputDiv.classList.remove("dead");
      ruleContainer.dataset.value = "1";
    } else {
      inputDiv.classList.add("dead");
      inputDiv.classList.remove("live");
      ruleContainer.dataset.value = "0";
    }
    rule[number] = rule[number] === 0 ? 1 : 0;
  });

  return ruleContainer;
}

function readRule() {
  const rule = [];
  for (let i = 0; i < 8; i++) {
    const ruleContainer = $(`rule-${i}`);
    rule.push(Number(ruleContainer.dataset.value));
  }
  return rule;
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
  const rows = parseInt($("rowsInput").value, 10);
  const columns = parseInt($("columnsInput").value, 10);
  dimensions.length = 0;
  dimensions.push(rows, columns);
  grid.length = 0;
  grid.push(...resetGrid(rows, columns));
  generateGridHtml(grid);
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
