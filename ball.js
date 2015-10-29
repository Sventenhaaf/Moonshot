window.onload = function()
{
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var raf;
  var distance;
  var startpoint;
  var endpoint;
  var midpoint;
  var historicPath;
  var moving;

  var firstStep;
  var secondStep;

  var horizontalVelocity;
  var verticalVelocity;

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

  var newpath = {
    draw: function() {
      for (var i = 0; i < newpathArray.length; i++) {
        ctx.beginPath();
        ctx.arc(newpathArray[i][0], newpathArray[i][1], Math.sqrt(6*(i+1)), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = 'red';
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
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.lineWidth="6";
      ctx.fillStyle = '#333';
      ctx.fillRect(5,5,580,70);
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.font = "30px Arial";
      ctx.fillText("You won! Click next to go to the next level",10,50);
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

  canvas.onmousedown = function(e) {
    if (!!startpoint) {
      startpoint = null;
    }
    else {
      startpoint = [e.clientX, e.clientY];
    }
  };

  canvas.onmousemove = function(e) {
    if (startpoint && !moving) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      planet1.draw();
      ball.draw();
      target.draw();
      trajectory.draw();

      midpoint = [e.clientX, e.clientY];
      horizontalVelocity = startpoint[0] - midpoint[0];
      verticalVelocity = startpoint[1] - midpoint[1];
      newpathArray = [
            [ballOrigins.x, ballOrigins.y],
            [ballOrigins.x + horizontalVelocity, ballOrigins.y + verticalVelocity],
            [ballOrigins.x + 2*horizontalVelocity, ballOrigins.y + 2*verticalVelocity],
            [ballOrigins.x + 3*horizontalVelocity, ballOrigins.y + 3*verticalVelocity]];
      newpath.draw();
    }
  };

  canvas.onmouseup = function(e) {
    if (startpoint) {
      endpoint = [e.clientX , e.clientY];
      trajectory.path = [ballOrigins.x, ballOrigins.y];
      shoot(startpoint, endpoint);
      moving = true;
      endpoint = null;
    }
    else {
      historicPath = trajectory.path;
      window.cancelAnimationFrame(raf);
      ball.x = ballOrigins.x;
      ball.y = ballOrigins.y;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      planet1.draw();
      ball.draw();
      target.draw();
      trajectory.draw();
      moving = false;
    }
  };

  function shoot(startpoint, endpoint) {
    horizontalVelocity = startpoint[0] - endpoint[0];
    verticalVelocity = endpoint[1] - startpoint[1];
    raf = window.requestAnimationFrame(draw);
  }

  planet1.draw();
  ball.draw();
  target.draw();
};
