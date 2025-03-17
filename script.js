/**
 * This factory function is resposible for creation of the tic tac toe board
 * keeping track of what markers are placed and where as well as printing the board
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
 * TBD
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
 * 
 * @returns 
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

    const switchTurns = () => activePlayer = activePlayer === players[0]? players[1]:players[0];
    const getActivePlayer = () => activePlayer;
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

        board.placeMarker(position, getActivePlayer().marker);
        getActivePlayer().pieceCount += 1;
        
        //determine winner after each players third piece
        if(getActivePlayer().pieceCount >=3){
            if(board.checkWin(getActivePlayer().marker)){
                board.printBoard();
                console.log(`${getActivePlayer().marker} has won the game`);
                return;
            }
        }
        if (getActivePlayer().pieceCount === 5){
            board.printBoard();
            console.log('X and O Draws');
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
    }
}

const game = GameController();

