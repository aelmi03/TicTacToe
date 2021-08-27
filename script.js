const submitButton = document.querySelector(".submitButton");
const gameBoardSpots = document.querySelectorAll(".boardSpot");
const firstPlayerText = document.querySelector("#firstPlayer");
const secondPlayerText = document.querySelector("#secondPlayer");
const currentGameStatus = document.querySelector("h3");
const newGameButton = document.querySelector(".newGame");
const quitGameButton = document.querySelector(".quit");
const modalContainer = document.querySelector(".modalContainer");
const computerPlayer = document.querySelector("#AI");
const playerFactory = (playerName, playerMark) =>{
    const name = playerName;
    const mark = playerMark;
    return {name,mark};
}

const gameBoard = (() => {
    let myArray = [[" "," "," "],[" "," "," "],[" "," "," "]];
    const isAvailable = function(firstIndex,secondIndex){
        if(myArray[firstIndex][secondIndex] === " "){
            return true;
        }
        return false;
    }
    const playMove = function(mark, firstIndex,secondIndex){
        console.log(isAvailable(firstIndex,secondIndex));
        if(isAvailable(firstIndex,secondIndex)){
           myArray[firstIndex][secondIndex] = mark;
        }
    }
    const checkHorizontalForWinner = function(mark){ 
        for(let i =0; i < myArray[0].length; i++){
            let string = "";
            for(let j = 0; j < myArray[0].length; j++){
               string += myArray[i][j];        
            }
            if(string === (mark + mark + mark)){
                return true;
            }
        }
        return false;
    }
    const checkVerticalForWinner = function(mark){
        for(let i =0; i < myArray[0].length; i++){
            let string = "";
            for(let j = 0; j < myArray[0].length; j++){
               string += myArray[j][i];        
            }
            if(string === (mark + mark + mark)){
                return true;
            }
        }
        return false;
    
    }    

    const checkDiagonalForWinner = function(mark){
        let leftToRightDiagonal = "";
        for(let i = 0; i < myArray.length; i++){
            leftToRightDiagonal += myArray[i][i];
        }
        if(leftToRightDiagonal === (mark + mark + mark)){ 
            return true
        };
        let rightToLeftDiagonal = "";
        for(let i = 0; i < myArray.length; i++){
            rightToLeftDiagonal += myArray[i][(myArray.length-1) - i];
        }
        return rightToLeftDiagonal === (mark + mark + mark);
        
    }
    const newGame = function(){
        myArray = [[" "," "," "],[" "," "," "],[" "," "," "]];
    }
    const everySpotIsFilled = function(){
        let count = 0;
        for(let i =0; i < myArray[0].length; i++){       
            for(let j = 0; j < myArray[0].length; j++){
                if(myArray[i][j] === " "){
                    count++;
                }
            }
        }   
        return count === 0;
    }
    const checkIfGameIsOver = function(player){
        if(checkDiagonalForWinner(player.mark) || checkHorizontalForWinner(player.mark) || checkVerticalForWinner(player.mark)){
            return `${player.name} Is The Winner!`;
        }

        if(everySpotIsFilled()){
            return "It Is A Draw!";
        }

        return " ";

    }
    const getFreePosition = function(){
        for(let i =0; i < myArray[0].length; i++){       
            for(let j = 0; j < myArray[0].length; j++){
                if(myArray[i][j] === " "){
                    return `${i} ${j}`;
                }
            }
        }        
    }
    return {spots:myArray, newGame, checkIfGameIsOver, playMove, getFreePosition};
    
})();

const displayController = (function(){
    let playerOne = "";
    let playerTwo = "";
    let currentTurn = "";
    let gameOver = false;
    let computerModeOn = false;
    let compFirstMove = " ";
    let gameMode = "";
    quitGameButton.addEventListener("click",quitGame);
    submitButton.addEventListener("click", hideForm);
    newGameButton.addEventListener("click", startNewGame);

    function hideForm(e){
       e.preventDefault();
       resetGame();
       initializePlayers();
       e.target.parentNode.parentNode.style.opacity = "0";
       e.target.parentNode.parentNode.style.pointerEvents = "none";
       gameBoardSpots.forEach(spot => {
           if(computerPlayer.checked){
            gameMode = "computer";
           spot.addEventListener("click", playMoveWithComputer);

           }
           else{
           spot.addEventListener("click", playMoveWithHuman)
           gameMode = "human";
           }
       });
       initializeCurrentStatus();
    }
    function initializeCurrentStatus(){
        currentGameStatus.textContent = `Current Turn: ${playerOne.name}`;
        currentTurn = "O";
    }
    function initializePlayers(){
        playerOne = playerFactory((firstPlayerText.value) ? firstPlayerText.value : "X", "X");
        playerTwo = playerFactory((secondPlayerText.value) ? secondPlayerText.value: "O", "O");

    }
    function playMoveWithComputer(e){
        const position = e.target.getAttribute("data-index").split(" ");
        let playerTurn = (currentTurn === "O" )? playerOne: playerTwo;
        if(compFirstMove === "1"){
            playerTurn = playerOne;
            compFirstMove = " ";
        }
        gameBoard.playMove(playerTurn.mark ,position[0],position[1]);
        e.target.textContent = playerTurn.mark;
        e.target.style.pointerEvents = "none";
        if(gameBoard.checkIfGameIsOver(playerTurn) !==  " "){
            freezeBoard();
            currentGameStatus.textContent = gameBoard.checkIfGameIsOver(playerTurn);
            gameOver = true;
        }
        if(gameOver === true){
            return;
        }
        changeCurrentStatus();
        if(computerModeOn === true){
            computerPlay();
        }
        (currentTurn === "X") ? currentTurn = "O" : currentTurn = "X";
        e.target.textContent = playerTurn.mark;
        e.target.style.pointerEvents = "none";
        

    }
    function playMoveWithHuman(e){
        const position = e.target.getAttribute("data-index").split(" ");
        let playerTurn = (currentTurn === "O" )? playerOne: playerTwo;
        gameBoard.playMove(playerTurn.mark ,position[0],position[1]);
        e.target.textContent = playerTurn.mark;
        e.target.style.pointerEvents = "none";
        changeCurrentStatus();
        if(gameBoard.checkIfGameIsOver(playerTurn) !==  " "){
            freezeBoard();
            currentGameStatus.textContent = gameBoard.checkIfGameIsOver(playerTurn);
            gameOver = true;
        }
        if(gameOver === true){
            return;
        }
       
        (currentTurn === "X") ? currentTurn = "O" : currentTurn = "X";
        e.target.textContent = playerTurn.mark;
        e.target.style.pointerEvents = "none";
        

    }
    function computerPlay(){
        
        let freeSpot = gameBoard.getFreePosition();
        if(freeSpot === undefined) return;
        freeSpot = freeSpot.split(" ");
        const spotOnDom = [...gameBoardSpots].filter(spot => {
            const indexArrays = spot.getAttribute("data-index").split(" ");
            return (indexArrays[0] === freeSpot[0] && indexArrays[1] === freeSpot[1]);
        });
        setTimeout(function(){
            gameBoard.playMove(playerTwo.mark, freeSpot[0], freeSpot[1] );
            spotOnDom[0].textContent = playerTwo.mark;
            spotOnDom[0].style.pointerEvents = "none";
            if(gameBoard.checkIfGameIsOver(playerTwo) !==  " "){
                freezeBoard();
                currentGameStatus.textContent = gameBoard.checkIfGameIsOver(playerTwo);
                gameOver = true;
                return;
            }
            currentGameStatus.textContent = "Current Turn: " + playerOne.name;
         }, 200);
         currentTurn = "X";
    
    }
    function changeCurrentStatus(){
        if(currentGameStatus.textContent.indexOf(playerOne.name) === 14){
            currentGameStatus.textContent = "Current Turn: " + playerTwo.name;

        }
        else{
            currentGameStatus.textContent = "Current Turn: " + playerOne.name;
        }
    }
    function freezeBoard(){
        gameBoardSpots.forEach(spot => spot.style.pointerEvents = "none");
    }
    function quitGame(){
        modalContainer.style.opacity = "1";
        modalContainer.style.pointerEvents = "auto";
        getRidOfEventListeners();
        resetGame();

    }
    function getRidOfEventListeners(){
        if(gameMode === "computer"){
            gameBoardSpots.forEach(spot => spot.removeEventListener("click", playMoveWithComputer));
        }
        else{
            gameBoardSpots.forEach(spot => spot.removeEventListener("click", playMoveWithHuman))
        }
    }
    function resetGame(){
        gameBoardSpots.forEach(spot => {
            spot.style.pointerEvents = "auto";
            spot.textContent = "";
        });
        gameBoard.newGame();
        computerModeOn = (computerPlayer.checked) ? true: false;
        gameOver = false;

    }
    function startNewGame(){
        gameBoardSpots.forEach(spot => {
            spot.style.pointerEvents = "auto";
            spot.textContent = "";
        });
        gameBoard.newGame();
        currentTurn = "O";
        currentGameStatus.textContent = `Current Turn: ${playerOne.name}`;
        if(gameMode === "computer"){
             const whoStartsFirst = [playerOne, playerTwo];
             const randomDraw = Math.floor(Math.random() * 2);
             (whoStartsFirst[randomDraw] == playerOne) ? currentTurn = "O": "X";
             if(whoStartsFirst[randomDraw] == playerTwo){
                 if(computerPlayer.checked){
                    computerPlay();
                    compFirstMove = "1";
                  }
              }
        }
        gameOver = false;
    }
})();
