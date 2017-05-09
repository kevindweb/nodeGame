var express = require('express'),
    app = express(),
    path = require('path'),
    pug = require('pug'),
    http = require('http'),
    server = http.Server(app),
    viewPath = path.join(__dirname+'/../views'),
    jsPath = path.join(__dirname+'/../views/clientScripts'),
    cssPath = path.join(__dirname+'/../views/styles'),
    fontPath = path.join(__dirname+'/../views/fonts'),
    server = app.listen(8080),
    io = require('socket.io')(server,{}),
    randomList=[],
    playerList = [],
    connections=[];

app.set('views',viewPath);
app.set('view engine','pug');
app.use('/scripts',express.static(jsPath));
app.use('/styles',express.static(cssPath));
app.use('/fonts',express.static(fontPath));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/render/index.html'));
});

// socket commands
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    var player = function(id){
      var self = {
        x:250,
        y:250,
        id:id,
      };
      return self;
    }
    socket.username = 'John Doe';
    socket.emit('playerCount',{count:connections.length});
    socket.on('sendMessage',function(data){
      io.sockets.emit('newMessage',{message:data.message,userName:socket.username})
    });
    socket.on('usernameCreate',function(data){
      socket.username = data.username;
      var id;
      function getRandom(){
      	var myRandom = Math.random().toFixed(1);
      	if(randomList.indexOf(myRandom==-1)){
      		randomList.push(myRandom);
      		id = myRandom;
      	}else{
      	getRandom();
      	count++
      	}
      };
      getRandom();
      socket.id = id;
      playerList[socket.id] = player(socket.id);
      socket.emit('usernameCreated',{error:null,name:data.username});
    });
    function findRank(){
      // sort playerList array by total score
      // return array of top ten players
    }
    socket.on('playerData',function(data){
      if(rankList==null){
        rankList = findRank();
      } else if(data.score>rankList[9]){
        rankList = findRank();
      }
      socket.emit('playerData',{x:socket.xPos,y:socket.yPos,rankList:rankList})
    });
    socket.on('disconnect', function () {
        connections.splice(connections.indexOf(socket),1);
    });
});
