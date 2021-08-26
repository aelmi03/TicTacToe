const submitButton = document.querySelector(".submitButton");
const gameBoardSpots = document.querySelectorAll(".boardSpot");
const firstPlayerText = document.querySelector("#firstPlayer");
const secondPlayerText = document.querySelector("#secondPlayer");
const currentGameStatus = document.querySelector("h3");


const playerFactory = (playerName, playerMark) =>{
    const name = playerName;
    const mark = playerMark;
    return {name,mark};
}

const gameBoard = (() => {
    const myArray = [[" "," "," "],[" "," "," "],[" "," "," "]];
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
            return "It Is A Draw";
        }

        return " ";

    }
    return {spots:myArray, newGame, checkIfGameIsOver, playMove};
    
})();

const displayController = (function(){
    let playerOne = "";
    let playerTwo = "";
    let currentTurn = "";
    submitButton.addEventListener("click", hideForm);
    gameBoardSpots.forEach(spot => spot.addEventListener("click", playMove ));
    function hideForm(e){
       e.preventDefault();
       playerOne = playerFactory((firstPlayerText.value) ? firstPlayerText.value : "X", "X");
       playerTwo = playerFactory((secondPlayerText.value) ? secondPlayerText.value: "O", "O");
       e.target.parentNode.parentNode.style.opacity = "0";
       e.target.parentNode.parentNode.style.pointerEvents = "none";
       currentGameStatus.textContent = `Current Turn: ${playerOne.name}`;
       currentTurn = "O";
    }
    function playMove(e){
        const position = e.target.getAttribute("data-index").split(" ");
        let playerTurn = (currentTurn === "O" )? playerOne: playerTwo;
        changeCurrentStatus();
        gameBoard.playMove(playerTurn.mark ,position[0],position[1]);
        (currentTurn === "X") ? currentTurn = "O" : currentTurn = "X";
        e.target.textContent = playerTurn.mark;
        e.target.style.pointerEvents = "none";
        if(gameBoard.checkIfGameIsOver(playerTurn) !==  " "){
            freezeBoard();
            currentGameStatus.textContent = gameBoard.checkIfGameIsOver(playerTurn);
        }

    }
    function changeCurrentStatus(player){
        if(currentGameStatus.textContent.includes(playerOne.name)){
            currentGameStatus.textContent = "Current Turn: " + playerTwo.name;
        }
        else{
            currentGameStatus.textContent = "Current Turn: " + playerOne.name;
        }
    }
    function freezeBoard(){
        gameBoardSpots.forEach(spot => spot.style.pointerEvents = "none");
    }
    function startNewGame(){
        gameBoardSpots.forEach(spot => {
            spot.style.pointerEvents = "auto";
            spot.textContent = "";
        })
    }

})();
