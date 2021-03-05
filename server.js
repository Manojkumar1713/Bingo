const express = require('express')
const app = express()
const server = require('http').Server(app);
const socket = require('socket.io')(server);

const path = require('path');

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));

const rooms = {}

app.get('/',(req,res) => {
  res.render('index',{ rooms:rooms })
})

app.get('/:room',(req,res)=>{
  console.log(req.params.room)
  let str = (req.params.room).split(" ");
  if(rooms[str[0]] == null){
    return res.redirect('/');
  }
  if(rooms[str[0]].password == str[1]){
    res.render('room', {roomName : str[0] })
  }
})

app.post('/room',(req,res)=>{

  if(rooms[req.body.room] != null){
    return res.redirect('/');
  }
  rooms[req.body.room] = { users : {} ,'password':req.body.pass}
  console.log(rooms[req.body.room])
  res.redirect(req.body.room+' '+req.body.pass);
  socket.emit("room-created",req.body.room);
})

try{
  socket.on("connection",(client)=>{

    client.on('new-user',(room,user_name) =>{
      client.join(room);
      console.log(client.id);
      rooms[room].users[client.id] = user_name;
      console.log(rooms[room])
      client.to(room).broadcast.emit("user-connected",user_name);
    })
    
    client.on("send-number",(room,data)=>{
      client.to(room).broadcast.emit("receive-number",data);
    })
    
    client.on("stop",(room,data)=>{
      client.to(room).broadcast.emit("Lost","Losser");
    })
  
    client.on('disconnect',()=>{
      getUserRooms(client).forEach(room =>{
        client.broadcast.emit('user-disconnected', rooms[room].users[client.id]);
        delete rooms[room].users[client.id];
      })
    })
  })
  function getUserRooms(client){
    return Object.entries(rooms).reduce((names, [user_name,room])=>{
      if(room.users[client.id] != null){
        names.push(user_name);
      }
      return names;
    },[])   
  }
}
catch(e){
    console.log(e);
}
finally{
  server.listen(3656);
}
