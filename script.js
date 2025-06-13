const board = document.getElementById("chessboard");

// Vị trí ban đầu của bàn cờ
const initialPosition = [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
];

// Load bàn cờ 
function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.classList.add((row + col) % 2 === 0 ? "white" : "black");
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = initialPosition[row][col];
            if (piece) {
                const img = document.createElement("img");
                img.src = `assets/images/${piece}.png`;
                img.classList.add("piece");
                img.draggable = true;

                // Drag Events 
                img.addEventListener("dragstart", dragStart);
                square.addEventListener("dragover", dragOver);
                square.addEventListener("drop", dropPiece);

                square.appendChild(img);

            }
            board.appendChild(square);
        }
    }
}

let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
}

function dragOver(e) {
    e.preventDefault(); // cho phép drop
}

function dropPiece(e) {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains("piece")) {
        return; // Không cho đè quân cờ 
    }
    e.target.appendChild(draggedPiece);
}

createBoard();


let selectedPiece = null;

document.querySelectorAll(".square").forEach(square => {
  square.addEventListener("click", () => {
    const piece = square.querySelector("img");

    if (selectedPiece) {
      // Nếu đang chọn một quân cờ trước đó
      // Và click vào một ô (có thể trống hoặc có quân địch)
      square.innerHTML = ""; // xoá quân địch nếu có
      square.appendChild(selectedPiece); // chuyển quân
      selectedPiece = null; // reset trạng thái
    } else if (piece) {
      // Nếu click vào một quân cờ lần đầu
      selectedPiece = piece;
    }
  });
});
