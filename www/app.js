var express = require('express'),
    app = express(),
    path = require('path'),
    http = require('http'),
    nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({service: 'gmail',auth: {user: 'gravfieldgame@gmail.com',pass: '!easy2Remember'}}),
    server = http.Server(app),
    viewPath = path.join(__dirname+'/../views'),
    jsPath = path.join(__dirname+'/../views/clientScripts'),
    cssPath = path.join(__dirname+'/../views/styles'),
    fontPath = path.join(__dirname+'/../views/fontsAndImages'),
    server = app.listen(8080),
    io = require('socket.io')(server,{}),
    randomList=[],
    playerList = {},
    truthy = false,
    connections=[],
    countDown,
    intervals,
    pitchBlackLength = 3000;

// initialize paths to scripts, fonts, and css
app.set('views',viewPath);
app.set('view engine','pug');
app.use('/scripts',express.static(jsPath));
app.use('/styles',express.static(cssPath));
app.use('/fonts',express.static(fontPath));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/render/index.html'));
});

//countDown until blackout
function setTimerInterval(){
  intervals = setInterval(countDownTimer,1000);
}
function countDownTimer(){
  if(!countDown){
    countDown = '1:00';
  } else{
    if(countDown=='1:00'){
      countDown = 59;
    } else if(countDown==1){
      clearInterval(intervals);
      countDown = null;
      setTimeout(function(){
        setTimerInterval();
      },pitchBlackLength);
      io.sockets.emit('blackout',{length:pitchBlackLength});
    } else{
      countDown--;
    }
  }
}
setTimerInterval();
// socket commands
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    var player = function(id,username){
      var self = {
        x:250,
        y:250,
        id:id,
        username:socket.username
      };
      return self;
    }
    // default username is John Doe
    socket.username = 'John Doe';
    socket.emit('playerCount',{count:connections.length});
    function findRank(){
      // sort playerList array by total score
      // return array of top ten players
    }
    // all socket listeners
    socket.on('sendMessage',function(data){
      io.sockets.emit('newMessage',{message:data.message,userName:socket.username})
    });
    socket.on('usernameCreate',function(data){
      socket.username = data.username;
      var id;
      function getRandom(){
      	var myRandom = Math.random();
        // if we already have this random id - choose another
      	if(randomList.indexOf(myRandom==-1)){
      		randomList.push(myRandom);
      		id = myRandom;
      	} else{
      	   getRandom();
      	}
      };
      getRandom();
      socket.id = id;
      playerList[socket.id] = player(socket.id,socket.username);
      socket.emit('usernameCreated',{error:null,name:data.username,id:socket.id});
      socket.emit('countDownCount',{time:countDown});
    });
    // when a user wants to send email
    socket.on('sendEmail',function(data){
      // send mail with defined transport object
      var mailOptions = data;
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error.message);
              socket.emit('emailSent',{error:JSON.stringify(error)});
          } else{
            socket.emit('emailSent',{res:'Message was sent!'});
          }
      });
    });
    // request for player position and size, and game ranks
    socket.on('playerData',function(data){
      playerList[socket.id].x = data.you.x;
      playerList[socket.id].y = data.you.y;
      playerList[socket.id].width=data.you.width;
      playerList[socket.id].score = data.you.score;
      socket.emit('playerData',playerList);
    });
    // when a player dies
    socket.on('playerDeath',function(){
      delete playerList[socket.id];
    });
    socket.on('disconnect', function (){
        connections.splice(connections.indexOf(socket),1);
        if(playerList[socket.id]){
          delete playerList[socket.id];
        }
    });
});
