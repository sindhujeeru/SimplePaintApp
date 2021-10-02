window.onload = function () {
  const canvas = document.getElementById("canvas");
  const clearCanvas = document.getElementById("clearButton");
  const context = canvas.getContext("2d");

  let xStart = 0;
  let yStart = 0;
  let xEnd = 0;
  let yEnd = 0;

  let triangles = [];
  var clickCount = 0;
  //canvas position
  let canvasLeft = canvas.getBoundingClientRect().left + window.scrollX;
  let canvasTop = canvas.getBoundingClientRect().top + window.scrollY;

  canvas.addEventListener("mousedown", (e) => {
    xStart = e.pageX - canvasLeft;
    yStart = e.pageY - canvasTop;
  });

  canvas.addEventListener("mouseup", (e) => {
    xEnd = e.pageX - canvasLeft;
    yEnd = e.pageY - canvasTop;

    if (xStart > xEnd) {
      let tempX = xStart;
      let tempY = yStart;
      xStart = xEnd;
      yStart = yEnd;
      xEnd = tempX;
      yEnd = tempY;
    }

    drawTriangle();
  });

  canvas.addEventListener("dblclick", (e) => {
    triangles.pop();
    triangles.pop();
    dx = e.pageX - canvasLeft;
    dy = e.pageY - canvasTop;

    console.log(triangles);
    for (var i = 0; i < triangles.length; i++) {
      l1 = Math.sqrt(
        Math.pow(dx - triangles[i].xs, 2) + Math.pow(dy - triangles[i].ys, 2)
      );
      l2 = Math.sqrt(
        Math.pow(dx - triangles[i].xe, 2) + Math.pow(dy - triangles[i].ye, 2)
      );

      l3 = Math.sqrt(
        Math.pow(dx - triangles[i].xt, 2) + Math.pow(dy - triangles[i].yt, 2)
      );

      var sumP = l1 + l2 + l3;
      console.log(sumP);

      if (sumP < triangles[i].perim) {
        console.log(triangles[i]);
        var width = triangles[i].xt - triangles[i].xs;
        var height = triangles[i].ye - triangles[i].ys;
        /*context.beginPath();
        context.rect(triangles[i].xs, triangles[i].ys, width, height);
        context.stroke();*/
        context.clearRect(triangles[i].xs, triangles[i].ys, width, height);
        triangles.splice(i, 1);
        break;
      }
    }
  });

  function drawTriangle() {
    var color = randomColor();
    context.beginPath();
    context.fillStyle = color;
    context.lineWidth = 1;
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.lineTo(xStart + 2 * Math.abs(xEnd - xStart), yStart);
    context.lineTo(xStart, yStart);
    context.stroke();
    context.fill();
    context.closePath();

    var xThird = xStart + 2 * Math.abs(xEnd - xStart);
    var yThird = yStart;
    var perimeter = perimeterOfTriangle(xStart, yStart, xEnd, yEnd, xThird);
    triangles.push({
      xs: xStart,
      ys: yStart,
      xe: xEnd,
      ye: yEnd,
      xt: xThird,
      yt: yThird,
      perim: perimeter,
      bgColor: color,
      isDragging: false,
    });
  }

  function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + r + "," + g + "," + b + ")";
    return bgColor;
  }

  function perimeterOfTriangle(xStart, yStart, xEnd, yEnd, xThird) {
    var lenSide1 = Math.sqrt(
      Math.pow(xStart - xEnd, 2) + Math.pow(yStart - yEnd, 2)
    );

    var lenSide2 = Math.abs(xStart - xThird);

    var lenSide3 = Math.sqrt(
      Math.pow(xThird - xEnd, 2) + Math.pow(yStart - yEnd, 2)
    );

    var perimeter = lenSide1 + lenSide2 + lenSide3;

    return perimeter;
  }

  clearCanvas.addEventListener("click", (e) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });
};
