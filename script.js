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
  grid.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    rowDiv.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
    outputGrid.append(rowDiv);
    row.forEach((cell) => {
      const cellDiv = document.createElement("div");
      rowDiv.append(cellDiv);
      cellDiv.classList.add("cell");
      if (cell === 1) {
        cellDiv.classList.add("live");
      } else {
        cellDiv.classList.add("dead");
      }
    });
  });
}

// *********
// event listeners
// *********
$("getGridSize").addEventListener("click", () => {
  console.log("hi!");
  const rows = parseInt($("rowsInput").value, 10);
  const columns = parseInt($("columnsInput").value, 10);
  const grid = resetGrid(rows, columns);
  console.log("hi!", rows, columns, grid);
  generateGrid(grid);
});
