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

// *********
// event listeners
// *********
$("getGridSize").addEventListener("click", () => {
  const rows = parseInt($("rowsInput").value, 10);
  const columns = parseInt($("columnsInput").value, 10);
  const grid = resetGrid(rows, columns);
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
