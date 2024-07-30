//Canvas drawing
const canvas= document.querySelector("#canvas");
const context= canvas.getContext("2d");

canvas.width= 500;
canvas.height=500;
context.strokeStyle="black";
context.lineWidth= 6;

context.beginPath();


function hangingStructure(){
    
    //vertical line
    context.moveTo(100, 100);
    context.lineTo(100, 450);
    //base
    context.moveTo(80,450);
    context.lineTo(120, 450);
    //Horizontal line
    context.moveTo(97, 100);
    context.lineTo(300, 100);
    //rope
    context.lineTo(300,120);
    //diagonal line
    context.moveTo(100, 120);
    context.lineTo(130, 100);
    context.closePath();
    context.stroke();
}
function head(){
    context.beginPath();
    context.arc(300, 140, 20, 0, 2 * Math.PI);
    context.stroke();

}
function body(){
    context.moveTo(300,160);
    context.lineTo(300, 280);
    context.stroke();
}
function leftHand(){
    context.moveTo(300,190);
    context.lineTo(350, 250);
    context.stroke();
}
function rightHand(){
    context.moveTo(300,190);
    context.lineTo(250, 250);
    context.stroke();
}
function leftleg(){
    context.moveTo(300, 280);
    context.lineTo(250, 350);
    context.stroke();
}

function rightleg(){
    context.moveTo(300, 280);
    context.lineTo(350, 350);
    context.stroke();
    context.closePath();
}


//Random

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//Game
const WordArray = ["selection","charity","suggestion","historian","device","proposal","freedom","homework","version","software","assignment"]; // old array not used
const alphabet=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
let  alphabetTest=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
let pickedWord;
let testedLetters=[];
let partialWordArray=[];
let cptErreur;
let idListe;
const container = document.getElementById("arrayTest");
const correctContainer = document.getElementById("mot");
const erreurContainer= document.getElementById("cptErreur");
const gameOverContainer= document.getElementById("gameOver")
const wordZone = document.getElementById("mot");
const input= document.getElementById("input");
const difficultyMenu=document.getElementById("difficulty-select");
const drawing=[function(){head();},function(){body();},function(){leftHand();},function(){rightHand();},function(){leftleg();},function(){rightleg();}];
let difficultyArrayQuery=["difficulty-select","labelForSelect"];
let  difficultyValue=0;




function classRemove(idListe){
    
    for (let id of idListe) {
        
        let element = document.getElementById(id);
        element.classList.remove("notDisplayed");

    }
}
function classAdd(idListe){
    
    for (let id of idListe) {
        let element = document.getElementById(id);
        element.classList.add("notDisplayed");


    }
}
function endGame(word){
    
    classRemove(idListe);
    
    idListe = ["Pendu", "main", "lettreTest"];
    classAdd(idListe);
    if(cptErreur<6){gameOverContainer.innerHTML=" Congrats you've won.  Would you like to play another round? "}
    else{gameOverContainer.innerHTML="You've lost the correct word was "+word+". Would you like to play another round?"}
    
    

    
    
    
}
function removetxt(){
    document.getElementById("gameOver").classList.add("notDisplayed");
}
function enterAnswer(event){
    if(event.keyCode==13){ checkWord();}
}

function getWord(){ //request a word from webserver

    return fetch("/api/newGame?level="+difficultyValue).then(async function(response){
        if(response.ok){
            return await response.text();}
        else{return getWord();}        
        }) ; 


}



document.getElementById("buttonPlay").addEventListener("click",newGame );

document.addEventListener("keyup",enterAnswer); 


async function newGame() {
    

    //Game code
   

    document.getElementById("buttonPlay").classList.add("notDisplayed");
    let difficultyArrayQuery=["difficulty-select"];
    classAdd(difficultyArrayQuery);
    gameOverContainer.innerHTML="Loading...";
    alphabetTest=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    erreurContainer.innerHTML="";
    difficultyValue=difficultyMenu.value;

    pickedWordLength = parseInt(await getWord());//WordArray[getRandomInt(0, WordArray.length)];
    removetxt();

    
    idListe = ["Pendu", "main", "lettreTest"];
    classRemove(idListe);
    
    

    idListe=["gameOver","buttonPlay","difficulty-select"];
    

    wordZone.innerHTML = ' _'.repeat(pickedWordLength);
    partialWordArray=Array(pickedWordLength+1).join('_').split('');
    testedLetters=[];
    cptErreur=0;
    container.innerHTML = alphabet.join(' ');

    //canva code
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    
    hangingStructure();
    input.focus();
}



async function checkWord() {
    

    
    let letter = input.value;
    input.value = "";
    input.focus();
    let lowerLetter= letter.toLowerCase();
    let charCode=lowerLetter.charCodeAt();

    if(97>charCode|| charCode>122||(letter.length!=1)){
        alert("Please type only letters and avoid symbols ")
        return;

    }
    else{ 
        return fetch('api/testLetter?letter='+lowerLetter).then(async function(response){
            if(response.ok){
                apiResponse=  JSON.parse(await response.text());
                correctContainer.innerHTML=apiResponse.partialWord.join(' ');
                cptErreur=apiResponse.errors;
                if(apiResponse.gameLost||apiResponse.gameStatus){
                    drawing[cptErreur-1]();
                    correctWord=apiResponse.word;
                    setTimeout(function(){endGame(correctWord)},500);}
                else if(apiResponse.errorBoolean){
                    for(let i=0;i<alphabet.length;i++){
            
                        if(alphabet[i]==letter.toUpperCase()){alphabetTest[i]="   _  ";}
                    }
                    container.innerHTML = alphabetTest.join(' ');
                    drawing[cptErreur-1]();
                    erreurContainer.innerHTML="Nombre d'erreur:"+ cptErreur;
                    
                }

            }   
    });
}
}
