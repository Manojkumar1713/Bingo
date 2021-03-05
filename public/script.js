let roomContainer = document.getElementById('room-container');
let val = 1;

let array = new Array(5);
for(let i =0;i< array.length; i++){
    array[i] = new Array(5);
}


function add(id){
    let item = document.getElementById(id);
    item.innerHTML = val;
    item.onclick = function(event){
        event.preventDefault();
    }
    let m = Number(id.charAt(0))-1;
    let j = Number(id.charAt(1));
    array[m][j] = val;
    val++;
}
function game(roomName){
    let counter = 0;
    for(let i=0;i<array.length;i++){
        for(let j=0;j<array.length;j++){
            if(typeof array[i][j] === "number"){
                counter++;
            }
        }
    }
    if(counter == 25){
        window.location.href = "game.html?array="+array+"&roomName="+roomName;
    }
    else{
        alert("please fill all the boxes");
    }
}

const socket = io();

socket.on("room-created",(data)=>{
    const roomElement = document.createElement('div');
    roomElement.innerHTML = data;
    const roomLink = document.createElement('a');
    roomLink.href = `/${data}`
    roomLink.innerText = 'Join';
    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
})

function Validate(name){
    let password = prompt('ENter password');
    window.location.assign('https://biingo-game.herokuapp.com/'+name+' '+password);
}