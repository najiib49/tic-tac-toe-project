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

    const printBoard = () => {
        //below is equivalent to having two nested for loops on rows and cols and assigning marker to each cell
        let boardwithValues = board.map(row => row.map(col => col.getMarker()));
        console.log(boardwithValues);
    };

    const placeMarker = (pos, player) => {
        //check if cell is empty before placing the marker
        // const cell = boardPositions[pos];
        // console.log(cell);
        const row = boardPositions[pos][0];
        const col = boardPositions[pos][1];
        if (board[row][col].getMarker() === ""){
            board[row][col].addMarker(player);
        }
        else{

            console.log(`Cell ${pos} is occupied`);
        }
    };

    return{
        getBoard,
        printBoard,
        placeMarker,
    };
}

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

const game = GameBoard();
// game.printBoard();
// game.placeMarker(3, "X");
// game.printBoard();
// game.placeMarker(3, "X");
