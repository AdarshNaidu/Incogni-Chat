// Make connection

var socket;

 

 //Query DOM
 var message = document.getElementById('message');
 var handle = document.getElementById('handle');
 var btn = document.getElementById('send');
 var grpbtn = document.getElementById('grpbtn');
 var pvtbtn = document.getElementById('pvtbtn');
 var output = document.getElementById('output');
 let element,elementBold, elementSpan, userName;
 //Event Listeners

function landingToChatbox(){
  userName = handle.value;
  document.getElementById('username').textContent = userName;
  document.getElementById('landing').style.display = "none";
  document.querySelector('main').style.display = "flex";
}

grpbtn.addEventListener('click', function(){
  if(handle.value){
    landingToChatbox();
    socket = io.connect("https://incognichat-group.glitch.me");
    groupEvents();
  }else{
    alert("Enter Valid Username");
  }
});

pvtbtn.addEventListener('click', function(){
  if(handle.value){
    landingToChatbox();
    socket = io.connect("https://incognichat-private.glitch.me");
    privateEvents();
  }else{
    alert("Enter Valid Username");
  }
})

function groupEvents(){

 btn.addEventListener('click', function(){
   if(message.value){
     socket.emit('chat', {
         message: message.value,
         handle: handle.value,
         id: socket.id,
     });
   }
   message.value = "";
 });



message.addEventListener('keydown', function(event){
  if(event.keyCode == 13){
    btn.click();
  }
})

 //Listen for incoming messages(events)
 socket.on('chat', function(data){
     if(data.id == socket.id){
       element = document.createElement('p');
       elementBold = document.createElement('b');
       element.appendChild(elementBold);
       element.classList.add("right");
       elementBold.textContent = data.message;
       output.appendChild(element);
       // output.innerHTML += '<p class = "right"><b>'+ data.message + '</p';
     }else{
       element = document.createElement('p');
       elementBold = document.createElement('b');
       elementSpan = document.createElement('span');
       element.appendChild(elementBold);
       element.appendChild(elementSpan);
       element.classList.add("left");
       elementBold.textContent = data.handle +": ";
       elementBold.style.color = "black";
       if(data.handle == "Bot")
         elementBold.style.color = "red";
       elementSpan.textContent = data.message;
       output.appendChild(element);
       // output.innerHTML += '<p class = "left"><b style = "color: black">'+ data.handle + ':</b> ' + data.message + '</p';
     }
 });

socket.on('onlineUsers', function(data){
  document.getElementById('onlineUsers').innerHTML = `Online: ${data.onlineUsers}`;
})
  
}


function privateEvents(){
//  btn.addEventListener('click', function(){
//    if(message.value){
//      socket.emit('chat', {
//          message: message.value,
//          handle: handle.value,
//          id: socket.id,
//      });
//      output.innerHTML += '<p class = "right"><b>'+ message.value + '</p';
//    }
//    message.value = "";
//  });



message.addEventListener('keydown', function(event){
  if(event.keyCode == 13){
    btn.click();
  }
})
  
  
  btn.addEventListener('click', function(){
   if(message.value){
     socket.emit('chat', {
         message: message.value,
         handle: handle.value,
         id: socket.id,
     });
     output.innerHTML += '<p class = "right"><b>'+ message.value + '</p';
     socket.emit('focus', {
    handle: handle.value,
    message: message.value,
    focus : "out",
  });
     
     socket.emit('focus', {
    handle: handle.value,
    message: message.value,
    focus : "in",
  });
   }
   
   message.value = "";
 });


 //Listen for incoming messages(events)
 socket.on('chat', function(data){
       output.innerHTML += '<p class = "left"><b style = "color: black">'+ data.handle + ':</b> ' + data.message + '</p';
 });

socket.on('onlineUsers', function(data){
  document.getElementById('onlineUsers').innerHTML = `Online: ${data.onlineUsers}`;
})
  
  
  
  $('#message').each(function() {
    var elem = $(this);
 
    // Save current value of element
    elem.data('oldVal', elem.val());
 
    // Look for changes in the value
    elem.bind("propertychange change click keyup input paste", function(event){
       // If value has changed...
       if (elem.data('oldVal') != elem.val()) {
            // Updated stored value
            elem.data('oldVal', elem.val());
 
            socket.emit('realtime', {
              handle: handle.value,
              message: message.value,
              id: socket.id,
            });
            
        }
    });
});


message.addEventListener('focus', function(){
  socket.emit('focus', {
    handle: handle.value,
    message: message.value,
    focus : "in",
  });
});

message.addEventListener('focusout', function(){
  socket.emit('focus', {
    handle: handle.value,
    message: message.value,
    focus : "out",
  });
})


socket.on('focus', function(data){
  if(data.focus == "in"){
    element = document.createElement('p');
    element.id = data.handle;
    output.appendChild(element);
    element.innerHTML = "<b>" + data.handle + "(typing):</b> "+ data.message;
  }else{
    element = document.getElementById(data.handle);
    element.parentNode.removeChild(element);
  }
})
  
socket.on('realtime', function(data){
  element = document.getElementById(data.handle);
  element.innerHTML = '<b>'+ data.handle + '(typing):</b> ' + data.message;
})

}