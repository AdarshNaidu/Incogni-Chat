// server.js
// where your node app starts

// init project
const express = require('express');
var socket = require('socket.io');
const app = express();
let users = 0;

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

//Socket setup
var socket = require('socket.io');
var io = socket(listener);
var people = {}

io.on('connection',function(socket){
    console.log("made socket connection");
    users++;
  
//   io.sockets.emit('onlineUsers', {
//     onlineUsers : users,
//   })

//     socket.on('chat', function(data){
//         io.sockets.emit('chat', data);
//     });
  
  
  
  socket.on('disconnect', function(){
    users--;
    
//     io.sockets.emit('onlineUsers', {
//     onlineUsers : users,
//   })
  })
});