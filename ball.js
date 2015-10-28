window.onload = function()
{
  var canvas = document.getElementById('canvas');
  var shootbutton = document.getElementById('shoot');
  var resetbutton = document.getElementById('reset');
  var bumpingWalls = parseInt(document.getElementById('bump').value);
  var ctx = canvas.getContext('2d');
  var raf;
  var distance;

  var horizontalVelocity;
  var verticalVelocity;
  adjustVelocities();

  var horSetter = document.getElementById("horvel");
  horSetter.addEventListener("input", adjustVelocities, false);
  var verSetter = document.getElementById("vervel");
  verSetter.addEventListener("input", adjustVelocities, false);
  var bump = document.getElementById('bump');
  bump.addEventListener("input", adjustBumping, false);

  function adjustVelocities(){
    horizontalVelocity = parseInt(document.getElementById("horvel").value);
    verticalVelocity = parseInt(document.getElementById("vervel").value);
  }

  function adjustBumping(){
    if (parseInt(document.getElementById("bump").value) === 0) bumpingWalls = 0;
    else bumpingWalls = 1;
  }

  var ballOrigins = {
    x: 50,
    y: 550
  };

  var targetDimensions = {
    x: 1050,
    y: 150,
    radius: 30,
    color: 'blue',
  };

  var trajectory = {
    path: [[ballOrigins.x, ballOrigins.y]],
    draw: function(){

      for (var i = 1; i < this.path.length; i++) {
        ctx.beginPath();
        ctx.arc(this.path[i][0], this.path[i][1], 3, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = 'green';
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
    color: 'orange',
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
    color: targetDimensions.color,
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
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
    horizontalVelocity -= 500 * (ball.x - planet1.x) / (distance * distance);
    verticalVelocity += 500 * (ball.y - planet1.y) / (distance * distance);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    target.draw();
    planet1.draw();
    trajectory.draw();

    if (bumpingWalls) {
      if (ball.y > canvas.height || ball.y < 0) {
        verticalVelocity = -verticalVelocity;
      }
      if (ball.x > canvas.width || ball.x < 0) {
        horizontalVelocity = -horizontalVelocity;
      }
    }

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
