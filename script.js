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
        alert("You did it!");
    } else {
        alert("Try again!");
    }
}

// Display solved puzzle in grid with improved readability
function displaySolution(grid) {
    const gridContainer = document.getElementById("grid");
    let index = 0;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = gridContainer.children[index++];
            cell.innerHTML = `
                <div class="piece-content">
                    <span class="top">${grid[row][col][0]}</span>
                    <span class="right">${grid[row][col][1]}</span>
                    <span class="bottom">${grid[row][col][2]}</span>
                    <span class="left">${grid[row][col][3]}</span>
                </div>`;
        }
    }
}


// Create draggable puzzle pieces with user-friendly layout
function createPuzzlePieces() {
    const puzzleContainer = document.getElementById("pieces");
    puzzleContainer.innerHTML = "";

    pieces.forEach((piece, index) => {
        const div = document.createElement("div");
        div.classList.add("piece");
        div.setAttribute("draggable", true);
        div.dataset.index = index;
        div.innerHTML = `
            <div class="piece-content">
                <span class="top">${piece[0]}</span>
                <span class="right">${piece[1]}</span>
                <span class="bottom">${piece[2]}</span>
                <span class="left">${piece[3]}</span>
            </div>`;

        // Drag events
        div.addEventListener("dragstart", (e) => {
            selectedPiece = index;
            e.dataTransfer.setData("text/plain", index);
        });

        // Rotate on click
        div.addEventListener("click", () => {
            pieces[index] = rotatePiece(pieces[index]);
            div.innerHTML = `
                <div class="piece-content">
                    <span class="top">${pieces[index][0]}</span>
                    <span class="right">${pieces[index][1]}</span>
                    <span class="bottom">${pieces[index][2]}</span>
                    <span class="left">${pieces[index][3]}</span>
                </div>`;
        });

        puzzleContainer.appendChild(div);
    });
}

// Apply CSS for better visual clarity
const style = document.createElement("style");
style.innerHTML = `
    .piece {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid black;
        background-color: white;
        position: relative;
        font-size: 18px;
        text-align: center;
    }
    .piece-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .top, .bottom {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
    }
    .top { top: 5px; }
    .bottom { bottom: 5px; }
    .left, .right {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-weight: bold;
    }
    .left { left: 5px; }
    .right { right: 5px; }
`;
document.head.appendChild(style);

// Initialize game
window.onload = () => 
    createPuzzlePieces();
    setupGrid();
    

function setupGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.dataset.index = i;

        cell.addEventListener("dragover", (e) => e.preventDefault());

        cell.addEventListener("drop", (e) => {
            e.preventDefault();
            let pieceIndex = e.dataTransfer.getData("text/plain");
            if (selectedPiece !== null) {
                e.target.innerHTML = document.querySelector(`[data-index='${pieceIndex}']`).innerHTML;
            }
        });

        grid.appendChild(cell);
    }
}
