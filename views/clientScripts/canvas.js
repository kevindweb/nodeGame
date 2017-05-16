window.createCanvasElement = function(){
  // there will be a max size of player, but not max score
  var c = document.createElement('canvas'),
  ctx,
  truthy = false;
  // remember to set truthy equal to true when player loses
  c.id = 'canvasElement';
  c.width = $(window).width();
  c.height = $(window).height()-20;
  function colorTest(){
  	var num1 = Math.floor(Math.random()*256);
  	c.style = "background-color: rgb("+num1+","+num1+","+num1+")";
    if(!truthy){
      setTimeout(colorTest,2000);
    }
  }
  colorTest();
  ctx = c.getContext('2d');

  // function createStar(cx, cy, spikes, outerRadius, innerRadius, score) {
  //     var rot = Math.PI / 2 * 3;
  //     var x = cx;
  //     var y = cy;
  //     var step = Math.PI / spikes;
  //
  //     ctx.strokeSyle = "#000";
  //     ctx.beginPath();
  //     ctx.moveTo(cx, cy - outerRadius)
  //     for (i = 0; i < spikes; i++) {
  //         x = cx + Math.cos(rot) * outerRadius;
  //         y = cy + Math.sin(rot) * outerRadius;
  //         ctx.lineTo(x, y)
  //         rot += step
  //
  //         x = cx + Math.cos(rot) * innerRadius;
  //         y = cy + Math.sin(rot) * innerRadius;
  //         ctx.lineTo(x, y)
  //         rot += step
  //     }
  //     ctx.lineTo(cx, cy - outerRadius)
  //     ctx.closePath();
  //     ctx.lineWidth=5;
  //     ctx.strokeStyle='blue';
  //     ctx.stroke();
  //     ctx.fillStyle='skyblue';
  //     ctx.fill();
  //
  // }
  // // createStar will be used to initialize player, and to make them bigger as
  // // they progress during the game
  // createStar(75, 100, 5, 30, 15);
  var rect1;
  rect1 = {
    x: 30,
    y: 30,
    width: 40,
    height: 40
  }
  // requestAnimationFrame(movePlayer);
  // function movePlayer(){
  //
  //
  //   rect1.x+=1;
  //   draw();
  //   requestAnimationFrame(movePlayer);
  // }
  // function draw(){
  //   ctx.clearRect(0,0,c.width,c.height);
  //   ctx.strokeRect(rect1.x,rect1.y,rect1.width,rect1.height);
  // }
  $(document.body).append(c).hide().show(800);
  // when player dies
  function playerLost(){
    window.playerDeath(window.ourUserId);
  }
  // every 1 minute, the screen goes black for
  // a small time, to add challenge to the game
  window.onPitchBlack = function(length){
    truthy = true;
    c.style = "background-color: rgb(0,0,0)";
    ctx.textAlign = "center";
    ctx.font = "30px arcFont";
    ctx.fillText("Pitch Black",c.width/2,30);
    setTimeout(function(){
      truthy = false;
      colorTest();
    },length);
  }
  window.onresize = function(){
    $("#canvasElement").attr("height",$(window).height()-20);
    $("#canvasElement").attr("width",$(window).width());
  }
}
