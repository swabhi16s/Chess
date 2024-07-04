**Multiplayer Chess Game**

Welcome to the Multiplayer Chess Game project! This application enables users to play chess online with real-time updates using Socket.IO for communication and Chess.js for game logic.

### Table of Contents
1. **Features**
2. **Technologies Used**
3. **Setup Instructions**
4. **Usage**
   - **Player Setup**
   - **Gameplay**
   - **Controls**
   - **Notifications**
5. **Client-Side Functionality**
   - **Initialization and Board Rendering**
   - **Drag-and-Drop Functionality**
   - **Socket.IO Client-Side Functions**
6. **Server-Side Functionality**
   - **Socket.IO Server-Side Functions**
7. **Game Actions**
8. **Contributing**
9. **License**
10. **Acknowledgements**
11. **Contact**

### Features
- **Real-time Multiplayer:** Play chess with friends or other players in real-time.
- **Player Roles:** Join as either white or black pieces, with support for spectators.
- **Game Actions:** Reset the game, start a new game, resign, save, and load game states.

### Technologies Used
- **Frontend:** HTML, CSS (with Tailwind CSS), JavaScript (ES6),EJS (Embedded JavaScript templates)
- **Backend:** Node.js, Express.js, Socket.IO
- **Chess Logic:** Chess.js library for managing game state and rules.

### Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/swabhi16s/Chess.git
   cd Chess
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npx nodemon
   ```

4. **Open the application in your browser:**
   [http://localhost:3000](http://localhost:3000)

### Usage
- **Player Setup:** Upon opening the app, player 1 plays as white, player 2 as black, and others as spectators.
- **Gameplay:** Make moves by dragging and dropping pieces on the chessboard; only legal moves are permitted.
- **Controls:** Use buttons to reset the game, start a new game, resign, or save/load game states.
- **Notifications:** Messages appear at the top to display game status, errors, or events.

### Client-Side Functionality
- **Initialization and Board Rendering:** The game board is dynamically rendered based on the fetched game state using HTML, CSS, and JavaScript.
- **Drag-and-Drop Functionality:** Allows intuitive interaction by enabling players to drag and drop pieces for moves.

### Socket.IO Client-Side Functions
- Handles real-time events such as player role assignment, game state updates, move validation, and game actions.

### Server-Side Functionality
- **Socket.IO Server-Side Functions:** Manage incoming client events, update game state, and broadcast events for real-time updates and notifications.

### Game Actions
Players can perform the following actions:
- **Reset:** Restore the game board to its initial state.
- **New Game:** Commence a fresh game with a reset board.
- **Resign:** Voluntarily withdraw from the current game.
- **Load Game:** Restore a saved game state using FEN notation.
- **Save Game:** Preserve the current game state using FEN notation.


