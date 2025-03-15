const gridSize = 3;
let selectedPiece = null;

// Example pieces (top, right, bottom, left)
const pieces = [
    ['+', '-', '*', '/'],
    ['*', '+', '/', '-'],
    ['-', '*', '+', '/'],
    ['/', '+', '*', '-'],
    ['*', '/', '+', '-'],
    ['-', '/', '*', '+'],
    ['+', '*', '-', '/'],
    ['/', '-', '+', '*'],
    ['*', '-', '/', '+']
];

// Rotate a piece 90 degrees
function rotatePiece(piece) {
    return [piece[3], piece[0], piece[1], piece[2]];
}

// Check if a piece fits at position (row, col)
function isValidPlacement(grid, row, col, piece) {
    if (row > 0 && grid[row - 1][col]) {
        if (grid[row - 1][col][2] !== piece[0]) return false; // Top-Bottom match
    }
    if (col > 0 && grid[row][col - 1]) {
        if (grid[row][col - 1][1] !== piece[3]) return false; // Left-Right match
    }
    return true;
}

// Solve puzzle using backtracking
function solve(grid, used, row, col) {
    if (row === gridSize) return true; // Puzzle filled!

    let nextRow = col === gridSize - 1 ? row + 1 : row;
    let nextCol = (col + 1) % gridSize;

    for (let i = 0; i < pieces.length; i++) {
        if (used[i]) continue; // Skip already placed pieces

        for (let r = 0; r < 4; r++) { // Try 4 rotations
            let rotatedPiece = rotatePiece(pieces[i]);
            pieces[i] = rotatedPiece;

            if (isValidPlacement(grid, row, col, rotatedPiece)) {
                grid[row][col] = rotatedPiece;
                used[i] = true;

                if (solve(grid, used, nextRow, nextCol)) return true; // Recursive call

                used[i] = false;
                grid[row][col] = null; // Backtrack
            }
        }
    }
    return false;
}

// Function to automatically solve and display solution
function findSolution() {
    let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    let used = Array(pieces.length).fill(false);

    if (solve(grid, used, 0, 0)) {
        displaySolution(grid);
        console.log("Solution found!");
    } else {
        alert("No solution found!");
    }
}

// Display solved puzzle in grid
function displaySolution(grid) {
    const gridContainer = document.getElementById("grid");
    let index = 0;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = gridContainer.children[index++];
            cell.innerText = grid[row][col].join(" ");
        }
    }
}

// Create draggable puzzle pieces
function createPuzzlePieces() {
    const puzzleContainer = document.getElementById("pieces");
    puzzleContainer.innerHTML = "";

    pieces.forEach((piece, index) => {
        const div = document.createElement("div");
        div.classList.add("piece");
        div.setAttribute("draggable", true);
        div.dataset.index = index;
        div.innerText = piece.join(" ");

        // Drag events
        div.addEventListener("dragstart", (e) => {
            selectedPiece = index;
            e.dataTransfer.setData("text/plain", index);
        });

        // Rotate on click
        div.addEventListener("click", () => {
            pieces[index] = rotatePiece(pieces[index]);
            div.innerText = pieces[index].join(" ");
        });

        puzzleContainer.appendChild(div);
    });
}

// Allow dropping pieces into the grid
function setupGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");

        cell.addEventListener("dragover", (e) => e.preventDefault());
        cell.addEventListener("drop", (e) => {
            e.preventDefault();
            if (selectedPiece !== null) {
                cell.innerText = pieces[selectedPiece].join(" ");
            }
        });

        grid.appendChild(cell);
    }
}

// Initialize game
window.onload = () => {
    createPuzzlePieces();
    setupGrid();

    // Add solve button
    const solveButton = document.createElement("button");
    solveButton.innerText = "Solve Puzzle";
    solveButton.addEventListener("click", findSolution);
    document.body.appendChild(solveButton);
};
