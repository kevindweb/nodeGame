$(document).ready(function(){
  var socket = io();
  var ourUsername;
  // show current player count
  socket.on('playerCount',function(data){
    $("#playerCount").html(data.count);
  });
  // socket listeners
  socket.on('usernameCreated',function(data){
    if(!data.error){
      document.getElementById("btn-input").disabled=false;
      $("#smallTitle").html("GravField: "+data.name);
      document.getElementsByClassName("container")[0].style = 'opacity:0;';
      setTimeout(function(){
        document.getElementsByClassName("container")[0].style = 'display:none;';
      },1000);
      return;
    } else{
      $("#userName").attr("placeholder",data.error);
    }
  });
  socket.on('playerData',function(data){
    window.xPos = data.x;
    window.yPos = data.y;
    // leaderboards
    window.rankList = data.rankList;
  });
  socket.on('newMessage',function(data){
    if(data.userName==ourUsername){
      receiveMyMessage(data.message,data.userName);
    } else{
      receiveOtherMessage(data.message,data.userName);
    }
  });
  // end of socket listeners
  // assiging username
  $("#userName").keyup(function(e){
    if(e.keyCode == 13){
      $("#loginButton").click();
    }
  });
  $("#loginButton").click(function(){
    var value = $("#userName").val();
    $("#userName").val("");
    if(!value.replace(/\s/g, '').length){
      $("#userName").attr("placeholder","real usrname pls");
    } else{
      ourUsername = value;
      usernameCreate(value);
    }
  });
  function usernameCreate(name){
    socket.emit('usernameCreate',{username:name});
  }
  // getting data about the player
  window.playerData = function(){
    socket.emit('playerData');
  }
  // sending message to server
  window.sendMessage = function(usrname,msg){
    socket.emit('sendMessage',{userName:usrname,message:msg});
  }
  /* there are two receive functions
  one for other users messages and
  the other for your message to be logged */
  function receiveMyMessage(msg,user){
    var box1 = document.getElementById("messageBase");
    var box2 = document.createElement('div');
    box2.className = "row msg_container base_sent";
    var box3 = document.createElement('div');
    box3.className = "col-md-10 col-xs-10";
    var box4 = document.createElement('div');
    box4.className = "messages msg_sent";
    var newmsg = document.createElement('p');
    newmsg.innerHTML = msg;
    var usrBox = document.createElement('time');
    usrBox.innerHTML = user;
    box4.appendChild(newmsg);
    box4.appendChild(usrBox);
    box3.appendChild(box4);
    box2.appendChild(box3);
    box1.appendChild(box2);
  }
  function receiveOtherMessage(msg,user){
    var box1 = document.getElementById("messageBase");
    var box2 = document.createElement('div');
    box2.className = "row msg_container base_receive";
    var box3 = document.createElement('div');
    box3.className = "col-md-10 col-xs-10";
    var box4 = document.createElement('div');
    box4.className = "messages msg_receive";
    var newmsg = document.createElement('p');
    newmsg.innerHTML = msg;
    var usrBox = document.createElement('time');
    usrBox.innerHTML = user;
    box4.appendChild(newmsg);
    box4.appendChild(usrBox);
    box3.appendChild(box4);
    box2.appendChild(box3);
    box1.appendChild(box2);
  }
  // player dies, data is reset
  window.playerDeath = function(){
    socket.emit('playerDeath');
  }
});
