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

            // ✅ Gắn dragover và drop cho tất cả ô
            square.addEventListener("dragover", dragOver);
            square.addEventListener("drop", dropPiece);

            const piece = initialPosition[row][col];
            if (piece) {
                const img = document.createElement("img");
                img.src = `assets/images/${piece}.png`;
                img.classList.add("piece");
                img.draggable = true;

                // ✅ Gắn dragstart cho tất cả quân cờ
                img.addEventListener("dragstart", dragStart);

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

    let targetSquare = target;

    // Nếu drop trúng vào ảnh quân cờ => chuyển sang cha là ô
    if (target.classList.contains("piece")) {
        targetSquare = target.parentElement;
        targetSquare.innerHTML = ""; // xoá quân địch nếu có
    }

    // Di chuyển quân cờ được kéo vào ô targetSquare
    if (draggedPiece) {
        targetSquare.appendChild(draggedPiece);
        draggedPiece = null; // reset
    }
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

let boardState = JSON.parse(JSON.stringify(initialPosition));

// Xác định nước đi của quân cờ 
function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
    const deltaRow = toRow - fromRow;
    const deltaCol = toCol - fromCol;

    const isWhite = piece[0] === "w";
    const type = piece[1].toUpperCase();

    const target = boardState[toRow][toCol];

    if (type === "P") {
        // Tốt trắng đi lên (row giảm), đen đi xuống (row tăng)
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;

        // Đi 1 bước
        if (deltaRow === direction && deltaCol === 0 && !target) return true;

        // Đi 2 bước ở vị trí ban đầu
        if (fromRow === startRow && deltaRow === 2 * direction && deltaCol === 0 &&
            !boardState[fromRow + direction][fromCol] && !target) {
            return true;
        }

        // Ăn chéo
        if (deltaRow === direction && Math.abs(deltaCol) === 1 && target && target[0] !== piece[0]) {
            return true;
        }

        return false;
    }

    // TODO: Thêm xử lý cho các quân khác
    return true; // mặc định tạm thời
}
