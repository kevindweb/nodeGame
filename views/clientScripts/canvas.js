window.createCanvasElement = function(){
  // there will be a max size of player, but not max score
  var c = document.createElement('canvas'),
  ctx,
  truthy = false;
  // remember to set truthy equal to true when player loses
  c.id = 'canvasElement';
  c.width = $(window).width();
  c.height = $(window).height();
  function colorTest(){
  	var num1 = Math.floor(Math.random()*256);
  	c.style = "background-color: rgb("+num1+","+num1+","+num1+")";
    if(!truthy){
      setTimeout(colorTest,2000);
    }
  }
  colorTest();
  ctx = c.getContext('2d');
  // ctx.textAlign = "center";
  // ctx.font = "30px arcFont";
  // ctx.fillStyle = "red";
  // ctx.fillText("GravField",c.width/2,30);
  function createStar(score){
    console.log('Player created');
  }
  // createStar will be used to initialize player, and to make them bigger as
  // they progress during the game
  createStar(0);
    // initializing player shape after login
  $(document.body).append(c).hide().show(800);
  // when player dies
  function playerLost(){
    window.playerDeath(window.ourUserId);
  }
  // every 1 minute, the screen goes black for
  // a small time, to add challenge to the game
  window.onPitchBlack = function(){
    truthy = true;
    c.style = "background-color: rgb(0,0,0)";
    ctx.textAlign = "center";
    ctx.font = "30px arcFont";
    ctx.fillText("Pitch Black",c.width/2,30);
    setTimeout(function(){
      truthy = false;
      colorTest();
    },4000);
  }
  window.onresize = function(){
    $("#canvasElement").attr("height",$(window).height());
    $("#canvasElement").attr("width",$(window).width());
  }
}
