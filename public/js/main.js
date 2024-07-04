document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const chess = new Chess();
    const boardElement = document.querySelector(".chessboard");

    let draggedPiece = null;
    let sourceSquare = null;
    let playerRole = null;
    const player = document.querySelector("#player");
    const moveid = document.querySelector("#moveid");
    const messageElement = document.createElement("div");

    messageElement.id = "message";
    document.body.appendChild(messageElement); 

    const renderBoard = () => {
        const board = chess.board();
        boardElement.innerHTML = "";
        board.forEach((row, rowIndex) => {
            row.forEach((square, squareIndex) => {
                const squareElement = document.createElement("div");
                squareElement.classList.add(
                    "square",
                    (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
                );
                squareElement.dataset.row = rowIndex;
                squareElement.dataset.col = squareIndex;

                if (square) {
                    const pieceElement = document.createElement("div");
                    pieceElement.classList.add(
                        "piece",
                        square.color === "w" ? "white" : "black"
                    );
                    pieceElement.innerText = getPieceUnicode(square);
                    pieceElement.draggable = playerRole === square.color;

                    pieceElement.addEventListener("dragstart", (e) => {
                        if (pieceElement.draggable) {
                            draggedPiece = pieceElement;
                            sourceSquare = { row: rowIndex, col: squareIndex };
                            e.dataTransfer.setData("text/plain", "");
                        }
                    });

                    pieceElement.addEventListener("dragend", (e) => {
                        draggedPiece = null;
                        sourceSquare = null;
                    });

                    squareElement.appendChild(pieceElement);
                }

                squareElement.addEventListener("dragover", function (e) {
                    e.preventDefault();
                });

                squareElement.addEventListener("drop", function (e) {
                    e.preventDefault();
                    if (draggedPiece) {
                        const targetSquare = {
                            row: parseInt(squareElement.dataset.row),
                            col: parseInt(squareElement.dataset.col),
                        };
                        handleMove(sourceSquare, targetSquare);
                    }
                });

                boardElement.appendChild(squareElement);
            });
        });

        if (playerRole === "b") {
            boardElement.classList.add("flipped");
        } else {
            boardElement.classList.remove("flipped");
        }
    };

    const handleMove = (source, target) => {
        const move = {
            from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
            to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
            promotion: 'q'
        };
        socket.emit("move", move);
    };

    const getPieceUnicode = (piece) => {
        const unicodePieces = {
            'k': '\u2654', // White King
            'q': '\u2655', // White Queen
            'r': '\u2656', // White Rook
            'b': '\u2657', // White Bishop
            'n': '\u2658', // White Knight
            'p': '\u2659', // White Pawn
            'K': '\u265A', // Black King
            'Q': '\u265B', // Black Queen
            'R': '\u265C', // Black Rook
            'B': '\u265D', // Black Bishop
            'N': '\u265E', // Black Knight
            'P': '\u265F', // Black Pawn
        };
        return unicodePieces[piece.type] || "";
    };

    const displayMessage = (message) => {
        messageElement.textContent = message;
        messageElement.style.display = "block";
        setTimeout(() => {
            messageElement.style.display = "none";
        }, 5000);
    };

    socket.on("playerRole", function (role) {
        playerRole = role;
        displayMessage(`You are playing as ${role === 'w' ? 'White' : 'Black'}`);
        renderBoard();
    });

    socket.on("spectatorRole", function () {
        playerRole = null;
        displayMessage("You are watching the game as a spectator");
        renderBoard();
    });

    socket.on("boardState", function (fen) {
        chess.load(fen);
        renderBoard();
    });

    socket.on("move", (data) => {
        const moveText = chess.move(data);
        if (moveText) {
            const newFen = chess.fen();
            console.log('New FEN:', newFen);
            if (moveid) moveid.textContent = `Move: ${data.from}-${data.to}`;
        } else {
            if (player) player.textContent = 'Invalid move';
        }
        renderBoard();
    });

 

    socket.on("disconnect", () => {
        if (player) player.textContent = `Player left the game`;
        playerRole = null;
        renderBoard();
        displayMessage("Player disconnected");
    });

    socket.on("connect", () => {
        if (player) player.textContent = `Player joined the game`;
        console.log("Connected");
        socket.emit("join");
        displayMessage("Connected to the game");
    });

    socket.on("error", (error) => {
        if (player) player.textContent = `Player left the game: ${error}`;
        console.log(error);
        displayMessage(`Error: ${error}`);
    });

    socket.on("gameEnd", (data) => {
        let message = "";
        if (data.result === "checkmate") {
            message = `Checkmate! ${data.winner === 'w' ? 'White' : 'Black'} wins!`;
        } else if (data.result === "draw") {
            message = "Draw! The game is a draw.";
        } else if (data.result === "stalemate") {
            message = "Stalemate! The game is a stalemate.";
        }
        displayMessage(message);
    });

    const resetButton = document.getElementById('reset');
    if (resetButton) resetButton.addEventListener('click', () => socket.emit('reset'));

    const newGameButton = document.getElementById('newGame');
    if (newGameButton) newGameButton.addEventListener('click', () => socket.emit('newGame'));

    const resignButton = document.getElementById('resign');
    if (resignButton) resignButton.addEventListener('click', () => {
        socket.emit('resign');
        displayMessage("You have resigned. Game over.");
    });

    const drawGameButton = document.getElementById('draw');
    if (drawGameButton) drawGameButton.addEventListener('click', () => {
        socket.emit('draw');
        displayMessage("The game is a draw.");
    });

    const loadGameButton = document.getElementById('loadGame');
    if (loadGameButton) {
        loadGameButton.addEventListener('click', () => {
            const fen = prompt("Enter FEN:");
            if (fen) socket.emit('loadGame', fen);
        });
    }

    const saveGameButton = document.getElementById('saveGame');
    if (saveGameButton) saveGameButton.addEventListener('click', () => socket.emit('saveGame'));

    renderBoard();
});



