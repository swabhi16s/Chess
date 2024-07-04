const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" });
});

io.on("connection", function (uniquesocket) {
    console.log("connected");
    if (!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("disconnect", function () {
        if (uniquesocket.id == players.white) {
            delete players.white;
        } else if (uniquesocket.id == players.black) {
            delete players.black;
        }
    });

    uniquesocket.on("move", (move) => {
        try {
            if (chess.turn() == "w" && uniquesocket.id != players.white) return;
            if (chess.turn() == "b" && uniquesocket.id != players.black) return;

            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());

                if (chess.in_checkmate()) {
                    io.emit("gameEnd", { result: "checkmate", winner: chess.turn() === 'w' ? 'b' : 'w' });
                } else if (chess.in_draw()) {
                    io.emit("gameEnd", { result: "draw" });
                } else if (chess.in_stalemate()) {
                    io.emit("gameEnd", { result: "stalemate" });
                }
            } else {
                console.log("Invalid move:", move);
                uniquesocket.emit("invalidMove", move);
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("invalidMove", move);
        }
    });

    uniquesocket.on('reset', () => {
        chess.reset();
        io.emit("boardState", chess.fen());
    });

    uniquesocket.on('newGame', () => {
        chess.reset();
        io.emit("boardState", chess.fen());
    });

    uniquesocket.on('resign', () => {
        chess.reset();
        io.emit("boardState", chess.fen());
    });

    

    uniquesocket.on('loadGame', (fen) => {
        try {
            chess.load(fen);
            io.emit("boardState", chess.fen());
        } catch (error) {
            console.log("Invalid FEN string:", error);
            uniquesocket.emit("invalidFEN", fen);
        }
    });

    uniquesocket.on('saveGame', () => {
        uniquesocket.emit("boardState", chess.fen());
    });
});

server.listen(3000, function () {
    console.log("listening on port 3000");
});
