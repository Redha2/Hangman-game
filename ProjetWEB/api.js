const fs= require('fs');
const url = require('url');
const path= require('path');


let pickedWordApi="";
let pickedWordApiArray=[];
let errorcptApi=0;
let guessedWord="";
let guessedWordArray=[]; 
let wordTab=[]; // une liste des listes contenants les mots de differents chaine de caractere
let gameOverBoolean=false;  //Si le joueur perd la partie, gameOverBoolean=true
let victory=false; // Si le joueur trouve le mot , victory= true 
fs.readFile("words.txt",function(error,text){         // version bonus 
     let book=text.toString().split(/[(\r?\n),.]/);

for(let i of book){
    let wordLength=i.length;
    let valid=true;
        
    for(let j=0;j<wordLength;j++){
        if (97>i.charCodeAt(j) || i.charCodeAt(j)> 122 ){
            valid=false;
            break;
        }
    }
    if(valid){
        for(let i=wordTab.length;i<=wordLength;i++){
            wordTab.push([]);
        }
        wordTab[wordLength].push(i);
         }
        
}}
);

// fs.readFile("words.txt",function(error,text){        // version basique 
//     let book=text.toString().split(/[(\r?\n),.]/);

// for(let i of book){
//    let wordLength=i.length;
//    if(wordLength<=8 && 6<=wordLength ){
//        let valid=true;
//    for(let j=0;j<wordLength;j++){
//        if (97>i.charCodeAt(j) || i.charCodeAt(j)> 122 ){
//            valid=false;
//            break;
//        }
//    }
//    if(valid){wordTab.push(i);  }
       
// }}}
// );



function manageRequest(request, response) {
    let path= request.url.split("?")[0].split("/");
    let apiPath= path[2];
    let foo= new URL("http://localhost:8000"+request.url);
    let lengthArray=[]


    

    // met le mot la pour eviter repetition  pickedWordApi=wordTab[Math.floor(Math.random() * wordTab.length)]
    switch(apiPath){
        case "getWord":
            pickedWordApi=wordTab[Math.floor(Math.random() * wordTab.length)];
            response.end(pickedWordApi);
            break;
        case "newGame":
            let level= foo.searchParams.get("level");

            switch(level){
                case "easy":
                    lengthArray=wordTab[Math.floor(3+Math.random() * 2)];
                    pickedWordApi=lengthArray[Math.floor(Math.random() * lengthArray.length)];
                    errorcptApi=0;
                    break;

                
                case "medium":
                    lengthArray=wordTab[Math.floor(6+Math.random() * 4)];
                    pickedWordApi=lengthArray[Math.floor(Math.random() * lengthArray.length)];
                    errorcptApi=0;
                    break;

                case "hard":
                    lengthArray=wordTab[Math.floor(11+Math.random() *(wordTab.length-11)) ];
                    pickedWordApi=lengthArray[Math.floor(Math.random() * lengthArray.length)];
                    errorcptApi=0;
                    break;


            }

            // lengthArray=wordTab[Math.floor(Math.random(2,5) * wordTab.length)];
            // pickedWordApi=lengthArray[Math.floor(Math.random() * lengthArray.length)];
            pickedWordApiArray=Array.from(pickedWordApi);
            guessedWord="_".repeat(pickedWordApi.length);
            guessedWordArray=Array.from(guessedWord);


            gameOverBoolean=false;
            victory=false;
            
            
            response.end(pickedWordApi.length+"");
            break;
        case "testLetter":
            if(   gameOverBoolean==true){response.end("error");
        break;}
            else{
            let apiResponse={
                "partialWord": guessedWordArray,
                "gameLost": gameOverBoolean,
                "gameStatus":victory,
                "errors": errorcptApi,
                "errorBoolean":false,
                "word": ""

            };
            let letter= foo.searchParams.get("letter").toLowerCase();
            if(pickedWordApiArray.includes(letter)){






                for(let i=0; i<pickedWordApi.length;i++){
                    if(letter==pickedWordApi[i]){
                        guessedWordArray[i]=letter;
                    }

                
                }
                if(!guessedWordArray.includes("_")){
                    victory=true;
                    apiResponse={
                        "partialWord": guessedWordArray,
                        "gameLost": gameOverBoolean,
                        "gameStatus":victory,
                        "errors": errorcptApi,
                        "errorBoolean":false,
                        "word": pickedWordApi
        
                    }

                }

            }
            else{
            errorcptApi+=1
            if(errorcptApi>=6){
                gameOverBoolean=true;

                apiResponse={
                    "partialWord": guessedWordArray,
                    "gameLost": gameOverBoolean,
                    "gameStatus":victory,
                    "errors": errorcptApi,
                    "errorBoolean": true,
                    "word": pickedWordApi
                    
    
                }
            }
            else{
                apiResponse={
                    "partialWord": guessedWordArray,
                    "gameLost": gameOverBoolean,
                    "gameStatus":victory,
                    "errors": errorcptApi,
                    "errorBoolean": true,
                    "word":""
                }
                

            }}
            response.statusCode=200;
            response.end(JSON.stringify(apiResponse));
        }
            break;
        

        default:
            response.statusCode = 404;
            response.end(`An error occured`);
            break;
    }


    // }
    // if(apiPath=="getWord"){
    //     response.end(wordTab[Math.floor(Math.random() * wordTab.length)]);
    // }
    // else if(apiPath=="newGame"){
    //     pickedWordApi=wordTab[Math.floor(Math.random() * wordTab.length)];
    //     response.end(pickedWordApi.length+"");
    // }
    // else{
    //     response.statusCode = 404;
    //     response.end(`An error occured`);
    // }
    }




exports.manage = manageRequest;




