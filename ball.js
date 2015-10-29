window.onload = function()
{
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var shootbutton = document.getElementById('shoot');
  var resetbutton = document.getElementById('reset');
  // var bumpingWalls = parseInt(document.getElementById('bump').value);
  var raf;
  var distance;
  var startpoint;
  var endpoint;
  var historicPath;

  var rect = canvas.getBoundingClientRect();

  var horizontalVelocity;
  var verticalVelocity;
  adjustVelocities();

  var horSetter = document.getElementById("horvel");
  horSetter.addEventListener("input", adjustVelocities, false);
  var verSetter = document.getElementById("vervel");
  verSetter.addEventListener("input", adjustVelocities, false);
  // var bump = document.getElementById('bump');
  // bump.addEventListener("input", adjustBumping, false);

  function adjustVelocities(){
    horizontalVelocity = parseInt(document.getElementById("horvel").value);
    verticalVelocity = parseInt(document.getElementById("vervel").value);
  }

  // function adjustBumping(){
  //   if (parseInt(document.getElementById("bump").value) === 0) bumpingWalls = 0;
  //   else bumpingWalls = 1;
  // }

  var ballOrigins = {
    x: 100,
    y: 500
  };

  var targetDimensions = {
    x: 1050,
    y: 150,
    radius: 30,
    mooncolor: 'yellow',
    hidecolor: '#333'
  };

  var trajectory = {
    path: [[ballOrigins.x, ballOrigins.y]],
    draw: function(){

      for (var i = 1; i < this.path.length; i++) {
        ctx.beginPath();
        ctx.arc(this.path[i][0], this.path[i][1], 3, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = '#9f9';
        ctx.fill();
      }
    }
  };

  var ball = {
    x: ballOrigins.x,
    y: ballOrigins.y,
    vx: horizontalVelocity,
    vy: -verticalVelocity,
    radius: 15,
    color: 'cornflowerblue',
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };

  var planet1 = {
    x: 400,
    y: 400,
    radius: 20,
    color: '#777',
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };

  var target = {
    x: targetDimensions.x,
    y: targetDimensions.y,
    radius: targetDimensions.radius,
    mooncolor: targetDimensions.mooncolor,
    hidecolor: targetDimensions.hidecolor,
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = this.mooncolor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + 20, this.y, this.radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = this.hidecolor;
      ctx.fill();
    }
  };

  var game = {
    win: function(){
      window.cancelAnimationFrame(raf);
      ctx.font = "30px Arial";
      ctx.fillText("You won the game!",10,50);
    }
  };

  function gravity(){
    distance = Math.sqrt(
            Math.pow(ball.x - planet1.x, 2) +
            Math.pow(ball.y - planet1.y, 2)
        );
    horizontalVelocity -= 25 * planet1.radius * (ball.x - planet1.x) / (distance * distance);
    verticalVelocity += 500 * (ball.y - planet1.y) / (distance * distance);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var background = new Image();

    ball.draw();
    target.draw();
    planet1.draw();
    trajectory.draw();

    // if (bumpingWalls) {
    //   if (ball.y > canvas.height || ball.y < 0) {
    //     verticalVelocity = -verticalVelocity;
    //   }
    //   if (ball.x > canvas.width || ball.x < 0) {
    //     horizontalVelocity = -horizontalVelocity;
    //   }
    // }

    // ball.vy *= 1;
    ball.vy += 0.35;
    gravity();

    trajectory.path.push([ball.x, ball.y]);

    ball.x += horizontalVelocity;
    ball.y -= verticalVelocity;

    raf = window.requestAnimationFrame(draw);

    if (ball.x > targetDimensions.x - targetDimensions.radius &&
        ball.x < targetDimensions.x + targetDimensions.radius &&
        ball.y > targetDimensions.y - targetDimensions.radius &&
        ball.y < targetDimensions.y + targetDimensions.radius){
          game.win();
        }
  }

  shootbutton.addEventListener('click', function(e){
    raf = window.requestAnimationFrame(draw);
  });

  resetbutton.addEventListener('click', function(e){
    window.cancelAnimationFrame(raf);
    ball.x = ballOrigins.x;
    ball.y = ballOrigins.y;
    adjustVelocities();
    trajectory.path = [ballOrigins.x, ballOrigins.y];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    planet1.draw();
    ball.draw();
    target.draw();
  });

  canvas.onmousedown = function(e) {
    if (startpoint) {
      startpoint = undefined;
    }
    else {
      startpoint = [e.clientX - rect.left, e.clientY - rect.top];
    }
  };

  canvas.onmousemove = function(e) {
    if (startpoint) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      planet1.draw();
      ball.draw();
      target.draw();
      trajectory.draw();
      ctx.strokeStyle = 'purple';
      ctx.lineWidth = 5;
      ctx.moveTo(startpoint[0], startpoint[1]);
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  canvas.onmouseup = function(e) {
    if (startpoint) {
      endpoint = [e.clientX - rect.left, e.clientY - rect.top];
      trajectory.path = [ballOrigins.x, ballOrigins.y];
      shoot(startpoint, endpoint);
      endpoint = undefined;
    }
    else {
      historicPath = trajectory.path;
      // debugger
      window.cancelAnimationFrame(raf);
      ball.x = ballOrigins.x;
      ball.y = ballOrigins.y;
      adjustVelocities();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      planet1.draw();
      ball.draw();
      target.draw();
      trajectory.draw();
    }
  };

  function shoot(startpoint, endpoint) {
    horizontalVelocity = startpoint[0] - endpoint[0];
    verticalVelocity = endpoint[1] - startpoint[1];
    raf = window.requestAnimationFrame(draw);
  }

  // canvas.addEventListener('mouseover', function(e){
  //   raf = window.requestAnimationFrame(draw);
  // });

  // canvas.addEventListener('mouseout', function(e){
  //   window.cancelAnimationFrame(raf);
  // });

  planet1.draw();
  ball.draw();
  target.draw();
};
