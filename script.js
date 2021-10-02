window.onload = function () {
  const canvas = document.getElementById("canvas");
  const clearCanvas = document.getElementById("clearButton");
  const context = canvas.getContext("2d");

  let xStart = 0;
  let yStart = 0;
  let xEnd = 0;
  let yEnd = 0;
  let xThird = 0;
  let yThird = 0;

  let triangles = [];
  //canvas position
  let canvasLeft = canvas.getBoundingClientRect().left + window.scrollX;
  let canvasTop = canvas.getBoundingClientRect().top + window.scrollY;

  canvas.addEventListener("mousedown", (e) => {
    xStart = e.pageX - canvasLeft;
    yStart = e.pageY - canvasTop;
    console.log("inside mouse down");

    if (checkPointsInTriangle(xStart, yStart)) {
      console.log("inside triangle");
      canvas.addEventListener("mousemove", mousemove);
    } else {
      console.log("outside");
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    canvas.removeEventListener("mousemove", mousemove);
    xEnd = e.pageX - canvasLeft;
    yEnd = e.pageY - canvasTop;

    xThird = xStart + 2 * (xEnd - xStart);
    yThird = yStart;

    if (
      checkPointsInTriangle(xStart, yStart) ||
      checkPointsInTriangle(xEnd, yEnd) ||
      checkPointsInTriangle(xThird, yThird)
    ) {
      console.log("inside triangle");
      return;
    }

    if (yEnd > yStart) {
      let tempX = xStart;
      let tempY = yStart;
      xStart = xEnd;
      yStart = yEnd;
      xEnd = tempX;
      yEnd = tempY;
    }

    if (!(xStart === xEnd && yStart === yEnd)) {
      console.log(" not equals");
      drawTriangle();
    } else {
      console.log("equals");
    }
  });

  canvas.addEventListener("dblclick", (e) => {
    dx = e.pageX - canvasLeft;
    dy = e.pageY - canvasTop;

    for (var i = 0; i < triangles.length; i++) {
      if (!checkPointInTriangle(triangles[i], dx, dy)) {
        continue;
      }

      var width = triangles[i].xt - triangles[i].xs;
      var height = triangles[i].ye - triangles[i].ys;

      /* context.beginPath();
      context.rect(triangles[i].xs, triangles[i].ys, width, height);
      context.stroke(); */

      context.clearRect(
        triangles[i].xs - 1,
        triangles[i].ys + 1,
        width + 1,
        height - 2
      );
      triangles.splice(i, 1);
    }
  });

  function drawTriangle() {
    var color = randomColor();
    context.beginPath();
    context.fillStyle = color;
    context.lineWidth = 1;
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.lineTo(xStart + 2 * (xEnd - xStart), yStart);
    context.lineTo(xStart, yStart);
    context.stroke();
    context.fill();
    context.closePath();

    xThird = xStart + 2 * (xEnd - xStart);
    yThird = yStart;

    triangles.push({
      xs: xStart,
      ys: yStart,
      xe: xEnd,
      ye: yEnd,
      xt: xThird,
      yt: yThird,
      bgColor: color,
      index: 0,
    });
  }

  function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + r + "," + g + "," + b + ")";
    return bgColor;
  }

  function checkPointsInTriangle(dx, dy) {
    var existFlag = false;
    for (var i = 0; i < triangles.length; i++) {
      if (checkPointInTriangle(triangles[i], dx, dy)) {
        return true;
      }
    }
    return false;
  }

  function getTriangle(dx, dy) {
    var existFlag = false;
    for (var i = 0; i < triangles.length; i++) {
      if (checkPointInTriangle(triangles[i], dx, dy)) {
        triangles[i].index = i;
        return triangles[i];
      }
    }
  }

  function checkPointInTriangle(triangle, dx, dy) {
    var firstCheck = LineEquation(
      triangle.xs,
      triangle.ys,
      triangle.xe,
      triangle.ye,
      dx,
      dy
    );

    if (firstCheck > 0) {
      console.log("outside the line");
      return false;
    }

    firstCheck = LineEquation(
      triangle.xe,
      triangle.ye,
      triangle.xt,
      triangle.yt,
      dx,
      dy
    );

    if (firstCheck > 0) {
      console.log("outside the second line");
      return false;
    }

    if (dy > triangle.ys) {
      console.log("outside third");
      return false;
    }
    return true;
  }

  function LineEquation(x1, y1, x2, y2, dx, dy) {
    var slope = (y2 - y1) / (x2 - x1);
    var val = slope * (dx - x1) - dy + y1;
    return val;
  }

  clearCanvas.addEventListener("click", (e) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  function drawTriangleTest(index) {
    var color = randomColor();
    context.beginPath();
    context.fillStyle = color;
    context.lineWidth = 1;
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.lineTo(xStart + 2 * (xEnd - xStart), yStart);
    context.lineTo(xStart, yStart);
    context.stroke();
    context.fill();
    context.closePath();

    xThird = xStart + 2 * (xEnd - xStart);
    yThird = yStart;

    triangles.splice(index, 0, {
      xs: xStart,
      ys: yStart,
      xe: xEnd,
      ye: yEnd,
      xt: xThird,
      yt: yThird,
      bgColor: color,
      index: index,
    });
  }

  function mousemove(e) {
    var mouseX = e.pageX - canvasLeft;
    var mouseY = e.pageY - canvasTop;

    if (checkPointsInTriangle(xStart, yStart)) {
      let tri = getTriangle(xStart, yStart);

      var width = tri.xt - tri.xs;
      var height = tri.ye - tri.ys;

      context.clearRect(tri.xs - 1, tri.ys + 1, width + 1, height - 2);
      triangles.splice(tri.index, 1);

      let xChange = mouseX - xStart;
      let yChange = mouseY - yStart;
      xStart = tri.xs + xChange;
      yStart = tri.ys + yChange;

      xEnd = tri.xe + xChange;
      yEnd = tri.ye + yChange;

      drawTriangleTest(tri.index);

      tri.color = "black";
      console.log(tri);
    }
  }
};
