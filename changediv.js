window.onload = function()
{
  // Set Listeners for all sliders
var forceSlider = document.getElementById("force");
forceSlider.addEventListener("input", displayCombination, false);
var lengthSlider = document.getElementById("length");
lengthSlider.addEventListener("input", displayCombination, false);
var posSlider = document.getElementById("pos");
posSlider.addEventListener("input", displayCombination, false);
var stiffSlider = document.getElementById("stiffness");
stiffSlider.addEventListener("input", displayCombination, false);

// (Re-) Plot the graphs using user Input
displayCombination();
function displayCombination(){
 var force  = parseFloat(document.getElementById("force").value);
 var length = parseInt(document.getElementById("length").value);
 var pos = parseInt(document.getElementById("pos").value);
 var stiffness = parseInt(document.getElementById("stiffness").value);

 var my_canvas = document.getElementById('canvas');
 var context = my_canvas.getContext("2d");
 context.clearRect(0, 0, canvas.width, canvas.height);

 var maxDef = drawDeflection(force, length, stiffness, pos, '#888');
 var maxNorm = drawNorm(force, length, 100000000, '#888');

 drawCircle((length * 30) +50, 100, 5);
 drawCircle(50, 100, 5);
 drawTriangle(50, 100, 20, 20);
 drawTriangle((length * 30) +50, 100, 20, 20);
 drawArrow(50+(length*pos/3.33333), 100, force*6);
 setWarning(maxDef-maxNorm, maxDef);
 // console.log(maxDef-maxNorm);
}
function setWarning(value, max){
 if (value > 0){
 document.getElementById('feedback').innerHTML = "Deflection is exceeding norm - max actual deflection is " + parseInt(max*10000000) + "mm.";
 }
 else {
 document.getElementById('feedback').innerHTML = "You're fine - max actual deflection is " + parseInt(max*10000000) + "mm.";
 }
}

// Deflection line graph
function drawDeflection(force, length, stiffness, pos, color){
 var max = 0;
 var my_canvas = document.getElementById('canvas');
 var context = my_canvas.getContext("2d");
 var numSteps = length * 10;
 var arr = [];
 var a = length * pos / 100;
 var b = length - a;

 for (var i = 0; i < (numSteps*a/length); i++) {
     var x = i / 10;
    var last = (force*b*x) * (length*length - (x*x) - b*b) / (6*length*stiffness);
    arr.push(last);
    if (last > max){ max = last; }
}

for (var i = (numSteps*a/length); i < numSteps; i++){
    var x = i / 10;
    var last = (force*b) * ((length/b)*((x-a)*(x-a)*(x-a))+(((length*length)-(b*b))*x) - (x*x*x)) / (6*length*stiffness)
    arr.push(last);
    if (last > max){ max = last; }
}

 context.setLineDash([1, 0]);
 context.lineWidth = 3;
 context.strokeStyle = color;
 context.beginPath();
 context.moveTo(50, 100);

 for(var j=0;j<numSteps;j++) {
    context.lineTo((j*3)+50, (arr[j]*30000000)+100);
}
context.stroke();
return max;
}


// NORM line graph
function drawNorm(force, length, stiffness, color){
 var max = 0;
 var my_canvas = document.getElementById('canvas');
 var context = my_canvas.getContext("2d");
 var numSteps = length * 10;
 var arr = [];
    force = Math.pow(length, -2);
    stiffness = 100000;

 var a = length / 2;
 var b = length / 2;

 for (var i = 0; i < (numSteps*a/length); i++) {
     var x = i / 10
    var last = (force*b*x) * (length*length - (x*x) - b*b) / (6*length*stiffness)
    arr.push(last);
    if (last > max){ max = last; }
}

for (var i = (numSteps*a/length); i <= numSteps; i++){
    var x = i / 10;
    var last = (force*b) * ((length/b)*((x-a)*(x-a)*(x-a))+(((length*length)-(b*b))*x) - (x*x*x)) / (6*length*stiffness)
    arr.push(last);
    if (last > max){ max = last; }
}

 context.setLineDash([6, 6]);
 context.lineWidth = 1;
 context.strokeStyle = 'orange';
 context.beginPath();
 context.moveTo(50, 100);

 for(var j=0;j<numSteps;j++) {
    context.lineTo((j*3)+50, (arr[j]*30000000)+100);
}
context.stroke();
return max;
}




// Cirlce an triange drawers
function drawCircle(x, y, radius){
 var my_canvas = document.getElementById('canvas');
 var context = my_canvas.getContext("2d");
 context.beginPath();
 context.arc(x, y, radius, 0, Math.PI*2);
 context.fillStyle = 'cornflowerblue';
 context.fill();
}



function drawTriangle(x, y, width, height){
 var my_canvas = document.getElementById('canvas');
 var context = my_canvas.getContext('2d');
 var path=new Path2D();
 path.moveTo(x,y);
 path.lineTo((x-(width/2)),y+height);
 path.lineTo((x+(width/2)),y+height);
 context.fill(path);
}

function drawArrow(x, y, size){

 var my_canvas = document.getElementById('canvas');
 var context = my_canvas.getContext('2d');
  context.setLineDash([1, 0]);
 context.lineWidth = 1;
 context.strokeStyle = 'red';
 context.beginPath();
 context.moveTo(x, y - (size/3));
 context.lineTo(x, y - size);
 context.stroke();
 context.fillStyle = 'red';
 drawTriangle(x, y, size/3, size/-3);
}
};
