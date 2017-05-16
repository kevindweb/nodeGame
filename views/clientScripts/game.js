$(document).ready(function(){
  var socket = io();
  var ourUsername;
  var ourUserId;
  var truthy = false; // this is a boolean that switches when we log in or die
  var x = document.body;
  var ourTimer,setTimer;
  // socket listeners
  // show current player count
  socket.on('playerCount',function(data){
    $("#playerCount").html(data.count);
  });
  // username was logged
  socket.on('usernameCreated',function(data){
    if(!data.error){
      document.getElementById("btn-input").disabled=false;
      document.getElementById("btn-input").placeholder="Enter msg";
      $("#smallTitle").html("GravField: "+data.name);
      ourUserId = data.id;
      window.ourUserId = ourUserId;
      document.getElementsByClassName("container")[0].style = 'opacity:0;';
      $(".glyphicon-remove").attr("style","");
      $("#playerInfo").attr("style","");
      setTimeout(function(){
        document.getElementsByClassName("container")[0].style = 'display:none;';
      },300);
      truthy = true;
      setTimeout(function(){
        window.createCanvasElement();
      },301);
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
  socket.on('emailSent',function(data){
    if(!data.error){
      $("#formName").val("");
      $("#formEmail").val("");
      $("#formMessage").val("");
      $("#formMessage").attr("placeholder",data.res);
      $("#human").val("");
    } else{
      $("#human").val(data.error);
    }
  });
  socket.on('blackout',function(data){
    if(truthy){ // if our game has started
      window.onPitchBlack(data.length);
    }
  });
  socket.on('countDownCount',function(data){
    $("#countdownSpan").html(data.time);
    clientCountDown(data.time);
  });
  // end of socket listeners
  function colorTest(){
  	var num1 = Math.floor(Math.random()*256);
  	var num2 = Math.floor(Math.random()*256);
  	var num3 = Math.floor(Math.random()*256);
  	x.style = "background-color: rgb("+num1+","+num2+","+num3+")";
    if(!truthy){
      setTimeout(colorTest,2000);
    } else{
      x.style = "background-color: rgb(255,255,255)";
    }
  }
  colorTest();
  // showing countdown clock
  function clientCountDown(timeLeft){
    ourTimer = timeLeft;
    setTimer = setInterval(clientCountDownStart,1000);
  }
  function clientCountDownStart(){
    if(ourTimer=='1:00'){
      ourTimer = 59;
    } else if(ourTimer<=0){
      clearInterval(setTimer);
      setTimeout(function(){
        ourTimer = '1:00';
        setTimer = setInterval(clientCountDownStart,1000);
      },3000);
    } else{
      ourTimer--;
    }
    $("#countdownSpan").html(ourTimer);
  }
  // adding points
  window.updatePoints = function(currPoints){
    $("#scoreSpan").html(currPoints);
  }
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
      return;
    }
    if(value.split("").length>12){
      $("#userName").attr("placeholder","usrname < 10 pls");
    } else{
      ourUsername = value;
      window.ourUsername = ourUsername;
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
  // modal for the rules button
  // dropdown animation onclick
  $('.dropdown').on('show.bs.dropdown', function (e) {
      $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });
  // dropdown slide up after click
  $('.dropdown').on('hide.bs.dropdown', function (e) {
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });
  // modal for the message button
  $("#human").keydown(function(){
       if(document.getElementById("human").value!=55){
         var button = document.getElementById("submitMessage");
         button.disabled = true;
       } else{
         var button = document.getElementById("submitMessage");
         button.disabled = false;
       }
     });
  $("#human").keyup(function(){
     if(document.getElementById("human").value!=55){
       var button = document.getElementById("submitMessage");
       button.disabled = true;
     } else{
       var button = document.getElementById("submitMessage");
       button.disabled = false;
     }
  });
  $("#submitMessage").attr("disabled","disabled");
  $("#submitMessage").click(function(e){
     e.preventDefault();
     message = {};
     message.from = '"'+$("#formName").val()+'" <gravfieldgame@gmail.com>';
     message.to = 'gravfieldgame@gmail.com';
     message.subject = 'Regarding gravField';
     message.html = '<h3>My name is:</h3><p>'+$("#formName").val()+'</p><br><h3>My message is:</h3><p>'+$("#formMessage").val()+'</p><br><h3>My email is:</h3><p>'+$("#formEmail").val()+'</p>';
  	 socket.emit('sendEmail',message);
  });
  // player dies, data is reset
  window.playerDeath = function(){
    $("#canvasElement").hide('slow', function(){ $("#canvasElement").remove();});
    var playAgain = document.createElement('button');
    playAgain.id = "playAgainButton";
    playAgain.style = "position: absolute; left: 100px; top:100px;";
    $(playAgain)
      .addClass("btn btn-primary btn-md")
      .html("Play Again?");
    $(document.body).append(playAgain);
    socket.emit('playerDeath');
    $("playAgainButton").click(function(){
      socket.emit('playAgain');
      window.createCanvasElement();
    });
  }
});
