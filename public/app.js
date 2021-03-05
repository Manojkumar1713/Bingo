let score = 0;

const scoreContainer = document.getElementById("score-container");


// document.getElementById("table").style.pointerEvents='none';
let game_array = new Array(5);

for(let i =0;i<game_array.length;i++){
    game_array[i] = new Array(5);
}

//getting data from the url
const params = new URLSearchParams(window.location.search);
let user_entered_values = params.get('array');
const roomName = params.get('roomName');
console.log(roomName);
user_entered_values = user_entered_values.split(",");

//filling the user entered box
let increment = 0;
for(let i=1;i<=5;i++){
    for(let j=0;j<5;j++){
        let val = user_entered_values[increment++];
        game_array[i-1][j] = Number(val);
        let id = i.toString() + j.toString();
        document.getElementById(id).innerHTML=val;
    }
}

const socket = io();

const user_name = prompt("enter your name");

socket.emit("new-user",roomName, user_name);
socket.on("user-connected",data =>{
    document.getElementById("name-container").innerText = data +" joined";
})
// socket.on("user-disconnected",data=>{
//     alert(`${data}` + " disconnected");
// })


function game(id){
    if(document.getElementById(id).style.backgroundColor == "red"){
        alert("already clicked");
    }
    else{
        let num = document.getElementById(id).innerHTML;
        console.log(num);
        document.getElementById(id).style.backgroundColor = "red";
        let x = Number(id.charAt(0))-1;
        let y = Number(id.charAt(1));
        game_array[x][y] = 0;
        console.log(game_array);
        socket.emit("send-number" ,roomName ,Number(num));
        document.getElementById("table").style.pointerEvents='none';
        if(score <= 4){
            if(isRow(x,game_array)){
                score = score+1;
                scoreContainer.innerText = "Score: "+ score;
            }
            if(isCol(y,game_array)){
                score = score+1;
                scoreContainer.innerText = "Score: "+ score;
            }
            if(isDiag(x,y,game_array)){
                score = score + 1;
                scoreContainer.innerText = "Score: "+ score;
            }
        }
        if(score >= 5){
            socket.emit("stop",roomName,'empty-message');
            alert("you won");
            document.getElementById("table").style.pointerEvents='none';
        } 
        
    }
}

socket.on("receive-number",(data)=>{
    document.getElementById("table").style.pointerEvents='auto';
    for(let i=0;i<game_array.length;i++){
        for(let j=0;j<game_array.length;j++){
            if(data == game_array[i][j]){
                let id = (i+1).toString() + j.toString()
                document.getElementById(id).style.backgroundColor = "red";
                game_array[i][j] = 0;
                console.log(game_array);
                if(score <= 4){
                    if(isRow(i,game_array)){
                        score = score+1;
                        scoreContainer.innerText = "Score: "+ score;
                    }
                    if(isCol(j,game_array)){
                        score = score+1;
                        scoreContainer.innerText = "Score: "+ score;
                    }
                    if(isDiag(i,j,game_array)){
                        score = score + 1;
                        scoreContainer.innerText = "Score: "+ score;
                    }
                }
                if(score >= 5){
                    socket.emit("stop",roomName,'empty-message');
                    alert("you won");
                    document.getElementById("table").style.pointerEvents='none';
                }    
            }
        }
    }
})

// socket.on('connect',()=>{
//     console.log(socket.id);
//     socket.on("start",(data)=>{
//         console.log(data);
//         if(data[0] == socket.id){
//             console.log("success");
//             alert("You start the game");
//             document.getElementById("table").style.pointerEvents='auto';
//         }
//     })
// })

socket.on("Lost",(data)=>{
    alert("You lose")
    document.getElementById("table").style.pointerEvents='none';
})

function isRow(m,array){
    const allEqual = arr => arr.every( v => v === arr[0] )
       var ar = [];
        for(var j=0;j<5;j++){
            ar.push(array[m][j]);
        }
    return allEqual(ar);
}
function isCol(n,array){
    const allEqual = arr => arr.every( v => v === arr[0] )
    var ar = [];
     for(var j=0;j<5;j++){
         ar.push(array[j][n]);
     }
 return allEqual(ar); 
}
function isDiag(i,j,array){
    var ar = [];
    if(i == j){
        for(var p=0;p<5;p++){
            ar.push(array[p][p]);
        }
    }
    else if(i+j == 4){
        for(var m = 0, n = 4; m < 5 & n >=0; m++, n--){
            ar.push(array[m][n]);
        }
    }
    const allEqual = arr => arr.every( v => v === arr[0]);
    if(ar.length == 0)
        return false
    return allEqual(ar);
}