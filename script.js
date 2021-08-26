const submitButton = document.querySelector(".submitButton");
submitButton.addEventListener("click", (e) => {
    e.preventDefault(); 
    e.target.parentNode.parentNode.style.opacity = "0";
});
 
const playerFactory = (playerName, playerMark) =>{
    const name = playerName;
    const mark = playerMark;
    return {name,mark};
}

const gameBoard = ((array) => {
    const myArray = array;
    const isAvailable = function(firstIndex,secondIndex){
        if(array[firstIndex][secondIndex] === ""){
            return true;
        }
    }
    const playMove = function(mark, firstIndex,secondIndex){
        if(isAvailable(firstIndex,secondIndex)){
            myArray[firstIndex][secondIndex] = mark;
        }
    }
    
})();