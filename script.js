/**
 * This factory function is resposible for creation of the tic tac toe board
 * keeping track of what marks are placed and where as well as printing the board
 * @returns getBoard, printBoard, placeMarker
 */
function GameBoard(){
    const row = 3;
    const col = 3;
    const board = [];
    // board positions allow us to use positions instead of rows and cols when placing Xs or Os -- helps playing game in console 
    const boardPositions = new Object(); // allows us to map positions 1-9 to each cell, starting from top left corener (0,0)
    let position = 1; // 
    // create a 3 by 3 board where each cell is a Cell obj.
    for(let i=0; i<row;i++){
        board[i] = [];
        for(let j=0; j<col; j++){
            board[i].push(Cell());
            boardPositions[position] = [i,j];
            position++;
        }
    }
    console.log(boardPositions);

    const getBoard = () => board;
    //checks if the cell is valid for placing a marker
    const isCellEmpty = (position) => {
        const row = boardPositions[position][0];
        const col = boardPositions[position][1];
        if(board[row][col].getMarker() === ""){
            return true;
        } else{
            const marker = board[row][col].getMarker();
            console.log(`Cell ${position} is occupied by ${marker}. Try again!`);
            return false;
        }
    }

    const printBoard = () => {
        //below is equivalent to having two nested for loops on rows and cols and assigning marker to each cell
        let boardwithValues = board.map(row => row.map(col => col.getMarker()));
        console.log(boardwithValues);
    };

    const placeMarker = (position, player) => {
        const row = boardPositions[position][0];
        const col = boardPositions[position][1];
        if(isCellEmpty(position)){
            board[row][col].addMarker(player);
        }
    };
    
    const verticalWin = (player) =>{     
        /**
         * iterate through each column and check to see if all three rows of that column 
         * have the same player marker
        */
       for(let i=0; i<3; i++){
            if(board[0][i].getMarker()===player
            && board[1][i].getMarker()===player
            && board[2][i].getMarker()===player){
                return true;
            }
        }
        return false
    };
    const horizontalWin = (player) =>{
        /**
         * iterate through each row and check if all three columns of that row
         * have the same player marker
         */
        for(let i=0; i<3; i++){
            if(board[i][0].getMarker()===player
            && board[i][1].getMarker()===player
            && board[i][2].getMarker()===player){
                return true;
            }
        }
        return false;
    };
    const diagonalWin = (player) =>{
        /**
         * check if all either diagonals contain that same player marker 
         */
        if(board[0][0].getMarker() === player
        && board[1][1].getMarker() === player
        && board[2][2].getMarker() === player){
            return true;
        }
        if(board[0][2].getMarker() ===player
        && board[1][1].getMarker()===player 
        && board[2][0].getMarker()===player){
            return true;
        }
        return false;
    };

    const checkWin = (player) => {
        if(verticalWin(player)){ console.log("Vertical win");return true; }
        if(horizontalWin(player)){console.log("Horizontal win");return true; }
        if(diagonalWin(player)){console.log("Diagonal win");return true; }
        
        return false;
    };

    return{
        getBoard,
        printBoard,
        placeMarker,
        isCellEmpty,
        checkWin,
    };
}
/**
 * This is responsible for placing and getting X or O marks for a single cell in the board.
 * @returns addMarker, getMarker
 */
function Cell(){
    //this represents the a specific cell in the board
    // initially, the cell will have empty marker
    let marker = "";

    const addMarker = (playerMarker) =>{
        marker = playerMarker;
    }
    const getMarker = () => marker;

    return{
        addMarker,
        getMarker,
    }
}
/**
 * This factory function handles creation of player object and the creation of game logic, including swithing turns, checking for wins and keeping track of the active player. 
 * @returns playRound, getActivePlayer, getBoard, getWinner, getDraw,
 */
function GameController(){
    let firstPlayer = "PlayerOne";
    let SecondPlayer = "PlayerTwo";
    const board = GameBoard();
    const players = [
        {
            name: firstPlayer,
            marker: "X",
            pieceCount: 0
        },
        {
            name: SecondPlayer,
            marker: "O",
            pieceCount: 0
        },

    ];
    let activePlayer = players[0];
    let winner = ""; // stops the game if there's a winner
    let draw = false;

    const switchTurns = () => activePlayer = activePlayer === players[0]? players[1]:players[0];
    const getActivePlayer = () => activePlayer;
    const getWinner = () => winner;
    const getDraw = () => draw;
    const playNewRound = () => {
        board.printBoard()
        console.log(`it's ${getActivePlayer().name}'s turn`);
    }
    const playRound = (position) => {
        console.log(`Dropping ${getActivePlayer().marker} at position ${position}`)
        // prevents switching turns if cell is occupied
        if(!board.isCellEmpty(position)){
            playNewRound();
            return
        }
        if (!winner){
            board.placeMarker(position, getActivePlayer().marker);
            getActivePlayer().pieceCount += 1;
        }
        
        //determine winner after each players third piece
        if(getActivePlayer().pieceCount >=3){
            if(board.checkWin(getActivePlayer().marker)){
                board.printBoard();
                console.log(`${getActivePlayer().marker} has won the game`);
                winner = getActivePlayer();
                return;
            }
        }
        if (getActivePlayer().pieceCount === 5){
            board.printBoard();
            console.log('X and O Draws');
            draw = true;
            return;
        }

        switchTurns()
        playNewRound();
    }
    // initial start of the game
    playNewRound();
    return{
        playRound,
        getActivePlayer,
        getBoard : board.getBoard,
        getWinner,
        getDraw,
    }
}
/**
 * This is responsible for the hanling User interface and updating the DOM.
 */
function DisplayController(){
    let game = GameController();
    const boardDiv = document.querySelector('.board');
    const resetBtn = document.getElementById('reset');

    const renderBoard = () => {
        const board = game.getBoard();
        let pos = 1;
        board.forEach(row =>{
            row.forEach(cell =>{
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.position = pos;
                // cellButton.textContent = cell.getMarker();
                //renders svg marks on the board
                if (cell.getMarker() === 'X'){
                    cellButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#273e47" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;
                } else if (cell.getMarker() === 'O'){
                    cellButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#273e47" d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z"/></svg>`;
                }
                pos++;   
                boardDiv.appendChild(cellButton);
            })
        })
    }

    const updateScreen = () => {
        //clear board content
        boardDiv.textContent = '';
        //displays current player the winner/if draw and the board.
        let currentPlayerDiv = document.getElementById("curr-player");
         // this is hidden till game ends
        let resultDisplay = document.getElementById('result');

        currentPlayerDiv.textContent = `Current Player: ${game.getActivePlayer().marker}`;
        resultDisplay.style.display = 'none';

        if(game.getWinner()){
            resultDisplay.style.display = 'block';
            resultDisplay.textContent = `Game winner: ${game.getWinner().marker}`;
        } else if (game.getDraw()){
            resultDisplay.style.display = 'block';
            resultDisplay.textContent = `Game ends in Draw`;
        }

        renderBoard();

    }
    //allows players to place their marker on a specific spot
    function addMarker(e){
        const markerPos = e.target.dataset.position;
        console.log(markerPos);
        //prevents playing a round when a player clicks empty spaces in the board instead of the cells
        if(!markerPos){return;}
        game.playRound(markerPos);
        updateScreen();    
    }
    function reset(e){
        game = GameController();
        updateScreen();
    }
    boardDiv.addEventListener('click', addMarker);
    resetBtn.addEventListener('click', reset)
    updateScreen();
}

DisplayController();
