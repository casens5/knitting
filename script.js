"use strict";

// *********
// utils
// *********

function $(id) {
  return document.getElementById(id);
}

function capitalize(string) {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

function resetGrid(rows, columns) {
  return [...Array(rows)].map(() => Array(columns).fill(0));
}

function generateGrid(grid) {
  const outputGrid = $("outputGrid");
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
      cellDiv.dataset.row = index;
      cellDiv.dataset.column = jindex;
      cellDiv.dataset.live = cell;
      if (cellDiv.dataset.live === "1") {
        cellDiv.classList.add("live");
      } else {
        cellDiv.classList.add("dead");
      }
      cellDiv.addEventListener("click", () => {
        if (cellDiv.dataset.live === "1") {
          cellDiv.classList.remove("live");
          cellDiv.classList.add("dead");
        } else {
          cellDiv.classList.remove("dead");
          cellDiv.classList.add("live");
        }
        cellDiv.dataset.live = cellDiv.dataset.live === "0" ? "1" : "0";
      });
    });
  });
}

function applyRule(grid, start, rule) {
  for (let i = start[0]; i < grid.length; i++) {
    for (let j = start[0] === i ? start[1] : 0; j < grid[0].length; j++) {
      const prev = j === 0 ? grid[i - 1][grid[0].length - 1] : grid[i][j - 1];
      const next =
        j === grid[i].length ? grid[i][grid[0].length - 1] : grid[i - 1][j + 1];
      const shape = prev + 2 * grid[i - 1][j] + 4 * next;
      grid[i][j] = rule[shape];
    }
  }
}

// *********
// event listeners
// *********
$("getGridSize").addEventListener("click", () => {
  const rows = parseInt($("rowsInput").value, 10);
  const columns = parseInt($("columnsInput").value, 10);
  const grid = resetGrid(rows, columns);
  grid[1][0] = 1;
  const rule = [1, 0, 0, 0, 0, 0, 0, 0];
  applyRule(grid, [1, 1], rule);
  generateGrid(grid);
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
