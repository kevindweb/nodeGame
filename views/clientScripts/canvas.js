window.createCanvasElement = function(){
  // there will be a max size of player, but not max score
  var c = document.createElement('canvas'),ctx,truthyColor = false,truthy=true,fList=[],myReq,myReqCount=0,points=0,spaceTruth=false,keyMap={},colorInterval,sizeN;
  // remember to set truthy equal to true when player loses
  c.id = 'canvasElement';
  c.width = $(window).width();
  c.height = $(window).height()-20;
  colorInterval = setInterval(colorTest,2000);
  function colorTest(){
    if(truthyColor){
      clearInterval(colorInterval);
      c.style = "background-color: rgb(0,0,0)";
      setTimeout(function(){
        colorInterval = setInterval(colorTest,2000);
      },3000);
      return;
    }
  	var num1 = Math.floor(Math.random()*256);
  	c.style = "background-color: rgb("+num1+","+num1+","+num1+")";
  }
  colorTest();
  ctx = c.getContext('2d');
  // canvas movement
  var player = {
    x:40,
    y:40,
    spdX:20,
    spdY:20,
    width:30,
    height:30,
    name:'P',
  }
  ctx.font = '40px Arial';
  $(document).click(function(){
    if(truthy){
      truthy = false;
      cancelAnimationFrame(myReq);
    } else{
      truthy = true;
      myReq = requestAnimationFrame(updateNow);
    }
  });
  function floatingCall(){
    var random = Math.floor(Math.random()*c.width);
    var thisF = {
      x:random,
      y:c.height,
      spdX:0,
      spdY:-5,
      width:10,
      height:10,
      name:'e',
      increment:1
    };
    fList.push(thisF);
  }
  function floating(){
    myReqCount++;
    if(myReqCount%20===0){
      floatingCall();
    }
    var l = fList.length;
    // first for loop deletes dot if not on screen
    // second moves the remaining dots in their prospective position
    var i=0;
    while(i<fList.length){
      if(fList[i].y<30||testCollision(fList[i],player)){
        fList.splice(i,1);
      } else{
        fList[i].y+=fList[i].spdY;
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.fillRect(fList[i].x-(fList[i].height/2),fList[i].y-(fList[i].width/2),fList[i].height,fList[i].width);
        ctx.restore();
        i++;
      }
    }
  }
  function update(q){
    if(q.y>=c.height-q.height/3){
        truthy = false;
        cancelAnimationFrame(myReq);
        playerDeath();
        return;
    }
    if(!spaceTruth){
        q.y+=q.spdY/5;
    }
    if(!truthyColor){
      ctx.drawImage(document.getElementById("clientImage"),q.x-(q.height/2),q.y-(q.width/2),q.height,q.width);
    }
  }
  $(document).keydown(function(e){
    var keyCode = e.keyCode;
    keyMap[keyCode] = true;
    switch (keyCode){
      case 32:
        spaceTruth = true;
        break;
      case 68: //d
        if(keyMap[87]){
          diagonal('++');
          break;
        } else if(keyMap[83]){
          diagonal('+-');
          break;
        }
        player.x+=player.spdX;
        break;
      case 83: //s
        if(keyMap[65]){
          diagonal('--');
          break;
        } else if(keyMap[68]){
          diagonal('+-');
          break;
        }
        player.y+=player.spdY;
        break;
      case 65: //a
        if(keyMap[83]){
          diagonal('--');
          break;
        } else if(keyMap[87]){
          diagonal('-+');
          break;
        }
        player.x-=player.spdX;
        break;
      case 87: //w
        if(keyMap[68]){
          diagonal('++');
          break;
        } else if(keyMap[65]){
          diagonal('-+');
          break;
        }
        player.y-=player.spdY;
        break;
    }
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
  function diagonal(sign){
    if(sign==='++'){
      player.x+=player.spdX;
      player.y-=player.spdY;
    } else if(sign==='--'){
      player.x-=player.spdX;
      player.y+=player.spdY;
    } else if(sign==='-+'){
      player.x-=player.spdX;
      player.y-=player.spdY;
    } else{
      player.x+=player.spdX;
      player.y+=player.spdY;
    }
  }
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
    if(rect1.x<=rect2.x+rect2.width&&rect2.x<=rect1.x+rect1.width&&rect1.y<=rect2.y+rect2.height&&rect2.y<=rect1.y+rect1.height){
      points+=p1.increment;
      if(points<=300){
        animate(p1.increment/2);
      }
      window.updatePoints(points);
      return true;
    } else{
      return false;
    }
  }
  myReq = requestAnimationFrame(updateNow);
  function updateNow(){
    ctx.clearRect(0,0,c.width,c.height);
    if(truthyColor){
      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "30px arcFont";
      ctx.textAlign = "center";
      ctx.fillText("Black Hole",c.width/2,c.height/2);
      ctx.restore();
    }
    update(player);
    floating();
    if(truthy){
        myReq = requestAnimationFrame(updateNow);
    }
  }
  $(document.body).append(c).hide().show(800);
  // when player dies
  function playerLost(){
    window.playerDeath(window.ourUserId);
    cancelAnimationFrame(myReq);
  }
  function animate(size){
    if(size==1){
      player.height+=1;
      player.width+=1;
      return;
    }
    var animation = setInterval(function(){
      if(size<=0){
        clearInterval(animation);
        return;
      }
      player.width+=1;
      player.height+=1;
      size-=1;
    },250/size);
  }
  // every 1 minute, the screen goes black for
  // a small time, to add challenge to the game
  window.onPitchBlack = function(length){
    truthyColor = true;
    setTimeout(function(){
      truthyColor = false;
      colorTest();
    },length);
  }
  window.onresize = function(){
    $("#canvasElement").attr("height",$(window).height()-20);
    $("#canvasElement").attr("width",$(window).width());
  }
}
