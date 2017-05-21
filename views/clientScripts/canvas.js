window.createCanvasElement = function(){
  // there will be a max size of player, but not max score
  var c,ctx,truthy=true,truthyColor=false,fList=[],myReq,myReqCount=0,points=0,spaceTruth=false,keyMap={},allPlayers;
  window.Game = {};

  c = document.getElementById('gameCanvas');
  $(c).show(300);
  c.width = $(window).width();
  c.height = $(window).height();
  ctx = c.getContext('2d');
  ctx.font = '40px Arial';


  function Rectangle(left,top,width,height){
    // calling game field
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  Rectangle.prototype.set = function(left,top,width,height){
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  Rectangle.prototype.insideGame = function(view){
    return (view.left<=this.left&&view.right<=this.right
            &&view.top<=this.top&&view.bottom<=this.bottom);
  }

  Rectangle.prototype.outsideGame = function(view){
    return (this.left<view.right&&view.left<this.right
            &&this.top<view.bottom&&view.top<this.bottom);
  }

  Game.Rectangle = Rectangle;

  var movementAxis = {
    none : "none",
    horizontal : "horizontal",
    vertical : "vertical",
    both : "both"
  };

  function Camera(xView,yView,cWidth,cHeight,wWidth,wHeight){
    this.xView = xView || 0;
    this.yView = yView || 0;

    var minWidth = 100;
    var minHeight = 100;

    // deadzone in each direction means the closest world wall where
    // player cannot move anymore to that side
    // right now it is to the top and to the left
    this.xDeadZone = 0;
    this.yDeadZone = 0;

    this.cWidth = cWidth || minWidth;
    this.cHeight = cHeight || minHeight;

    this.axis = movementAxis.both;

    this.followed = null;
    this.viewPort = new Game.Rectangle(this.xView,this.yView,this.cWidth,this.cHeight);

    this.worldField = new Game.Rectangle(0,0,wWidth,wHeight);
  }

  Camera.prototype.follow = function(playerObject,xDeadZone,yDeadZone){
    this.followed = playerObject;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  }

  Camera.prototype.updateWindow = function(){
    if(this.followed){
      if(this.axis == movementAxis.horizontal || this.axis == movementAxis.both){
        if(this.followed.x - this.xView + this.xDeadZone > this.cWidth){
          this.xView = this.followed.x - (this.cWidth - this.xDeadZone);
        } else if(this.followed.x - this.xDeadZone < this.xView){
          this.xView = this.followed.x - this.xDeadZone;
        }
      }
      if(this.axis == movementAxis.vertical || this.axis == movementAxis.both){
        if(this.followed.y - this.yView + this.yDeadZone > this.cHeight){
          this.yView = this.followed.y - (this.cHeight - this.yDeadZone);
        } else if(this.followed.y - this.yDeadZone < this.yView){
          this.yView = this.followed.y - this.yDeadZone;
        }
      }

    }

    this.viewPort.set(this.xView,this.yView);

    if(!this.viewPort.insideGame(this.worldField)){
      if(this.viewPort.left < this.worldField.left){
        this.xView = this.worldField.left;
      }
      if(this.viewPort.top < this.worldField.top){
        this.yView = this.worldField.top;
      }
      if(this.viewPort.right > this.worldField.right){
        this.xView = this.worldField.right - this.cWidth;
      }
      if(this.viewPort.bottom > this.worldField.bottom){
        this.yView = this.worldField.bottom - this.cHeight;
      }
    }
  }

  Game.Camera = Camera;

  function starDust(worldWidth,worldHeight){
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  starDust.prototype.floating = function(xView,yView){
    myReqCount++;
    if(myReqCount%10===0){
      this.dustCall();
    }
    var i=0;
    while(i<fList.length){
      if(fList[i].y<30||testCollision(fList[i],myPlayer)){
        fList.splice(i,1);
      } else{
        fList[i].y+=fList[i].spdY;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(fList[i].x-(fList[i].height/2)-xView,fList[i].y-(fList[i].width/2)-yView,fList[i].height,fList[i].width);
        ctx.restore();
        i++;
      }
    }
  }

  starDust.prototype.dustCall = function(){
    var random = Math.floor((Math.random()*this.worldWidth)+1);
    var thisF = {
      x:random,
      y:this.worldHeight-1,
      spdX:0,
      spdY:-5,
      width:10,
      height:10,
      increment:1
    }
    fList.push(thisF);
  }

  Game.StarDust = starDust;

  function Player(x,y,worldWidth,worldHeight){
    // world position is x and y
    this.x = x || Math.floor((Math.random()*room.width)+1);
    this.y = y || Math.floor((Math.random()*room.height)+1);
    this.speed = 4;
    this.score = 0;
    this.width = 30;
    this.height = 30;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  Player.prototype.diagonal = function(sign,speed){
    if(sign==='++'){
      myPlayer.x+=speed;
      myPlayer.y-=speed;
    } else if(sign==='--'){
      myPlayer.x-=speed;
      myPlayer.y+=speed;
    } else if(sign==='-+'){
      myPlayer.x-=speed;
      myPlayer.y-=speed;
    } else{
      myPlayer.x+=speed;
      myPlayer.y+=speed;
    }
  }

  Player.prototype.update = function(){
    if(myPlayer.y-myPlayer.width/2>=this.worldHeight){
        truthy = false;
        cancelAnimationFrame(myReq);
        playerLost();
        return;
    }
    if(!keyMap[32]){
      myPlayer.y+=this.speed;
    }
    if(keyMap[65]){
      if(keyMap[83]){
        this.diagonal('--',this.speed/2);
      } else if(keyMap[87]){
        this.diagonal('-+',this.speed/2);
      } else{
        this.x-=this.speed;
      }
    }
    if(keyMap[68]){
      if(keyMap[83]){
        this.diagonal('+-',this.speed/2);
      } else if(keyMap[87]){
        this.diagonal('++',this.speed/2);
      } else{
        this.x+=this.speed;
      }
    }
    if(keyMap[83]){
      if(keyMap[65]){
        this.diagonal('--',this.speed/2);
      } else if(keyMap[68]){
        this.diagonal('+-',this.speed/2);
      } else{
        this.y+=this.speed;
      }
    }
    if(keyMap[87]){
      if(keyMap[65]){
        this.diagonal('-+',this.speed/2);
      } else if(keyMap[68]){
        this.diagonal('++',this.speed/2);
      } else{
        this.y-=this.speed;
      }
    }
    if(this.x - this.width/2 < 0){
      this.x = this.width/2;
    }
    if(this.y - this.height/2 < 0){
      this.y = this.height/2;
    }
    if(this.x + this.width/2 > this.worldWidth){
      this.x = this.worldWidth - this.width/2;
    }
    if(this.y + this.height/2 > this.worldHeight){
      this.y = this.worldHeight - this.height/2;
    }
    window.emitData(myPlayer);
  }

  Player.prototype.draw = function(xView,yView){
    if(!truthyColor){
      for(var q in allPlayers){
        ctx.drawImage(document.getElementById("clientImage"),allPlayers[q].x-(allPlayers[q].width/2)-xView,allPlayers[q].y-(allPlayers[q].width/2)-yView,allPlayers[q].width,allPlayers[q].width);
      }
    }
  }

  Game.Player = Player;

  function Mapping(width,height){
    this.width = width || 300;
    this.height = height || 300;

    this.image = null;
  }

  Mapping.prototype.generate = function(){
    // store the generate map as this image texture
    this.image = new Image();
    var x = document.getElementById("myImage");
    this.image.width = x.width;
    this.image.height = x.height;
    this.image.src = x.src;
  }

  Mapping.prototype.draw = function(xView,yView){
    var sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight;

    sx = xView;
    sy = yView;

    sWidth = c.width;
    sHeight = c.height;

    if(this.image.width-sx < sWidth){
      sWidth = this.image.width-sx;
    }
    if(this.image.height-sy < sHeight){
      sHeight = this.image.height-sy;
    }
    dx = 0;
    dy = 0;
    dWidth = sWidth;
    dHeight = sHeight;
    ctx.drawImage(this.image,sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight);
  }

  Game.Mapping = Mapping;

  var x = document.getElementById("myImage");

  var room = {
    width:x.width,
    height:x.height,
    mapping: new Game.Mapping(x.width,x.height)
  }

  room.mapping.generate();

  var myPlayer = new Game.Player(30,30,room.width,room.height);
  var myCamera = new Game.Camera(0,0,c.width,c.height,room.width,room.height);
  var gameDust = new Game.StarDust(room.width,room.height);

  myCamera.follow(myPlayer,c.width/2,c.height/2);

  var update = function(){
    myPlayer.update();
    myCamera.updateWindow();
  }

  var draw = function(){
      ctx.clearRect(0,0,c.width,c.height);
      room.mapping.draw(myCamera.xView,myCamera.yView);
      myPlayer.draw(myCamera.xView,myCamera.yView);
      gameDust.floating(myCamera.xView,myCamera.yView);
  }

  var gameLoop = function(){
    update();
    draw();
    if(truthy){
      myReq = requestAnimationFrame(gameLoop);
    }
  }
  myReq = requestAnimationFrame(gameLoop);

  window.updateAllPlayers = function(data){
    allPlayers = data;
  }
  $(document).keydown(function(e){
    var keyCode = e.keyCode;
    keyMap[keyCode] = true;
  });
  $(document).keyup(function(e){
    var keyCode = e.keyCode;
    switch (keyCode){
      case 32:
        spaceTruth = false;
        break;
    }
    keyMap[keyCode] = false;
  });
  // test for collision between players/enemies
  function testCollision(p1,p2){
    var rect1 = {
      x:p1.x-(p1.width/2),
      y:p1.y-(p1.height/2),
      height:p1.height,
      width:p1.width
    }, rect2 = {
      x:p2.x-(p2.width/2),
      y:p2.y-(p2.height/2),
      height:p2.height,
      width:p2.width
    };
    if(rect1.x<=rect2.x+rect2.width
      &&rect2.x<=rect1.x+rect1.width
      &&rect1.y<=rect2.y+rect2.height
      &&rect2.y<=rect1.y+rect1.height){
      points+=p1.increment;
      animate(p1.increment);
      window.updatePoints(points);
      myPlayer.score+=p1.increment;
      return true;
    } else{
      return false;
    }
  }

  // when player dies
  function playerLost(){
    cancelAnimationFrame(myReq);
    window.playerDeath(window.ourUserId);
  }
  function animate(size){
    if(size==1){
      myPlayer.height+=1;
      myPlayer.width+=1;
      return;
    }
    var animation = setInterval(function(){
      if(size<=0){
        clearInterval(animation);
        return;
      }
      myPlayer.width+=1;
      myPlayer.height+=1;
      size-=1;
    },200/size);
  }
  // every 1 minute, the screen goes black for
  // a small time, to add challenge to the game
  window.onPitchBlack = function(length){
    truthyColor = true;
    setTimeout(function(){
      truthyColor = false;
    },length);
  }
  window.onresize = function(){
    $("#gameCanvas").attr("height",$(window).height()-20);
    $("#gameCanvas").attr("width",$(window).width());
  }
}
