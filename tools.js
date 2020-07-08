const circleLength = Math.PI * 2;

function DrawShapes(x, y) {
    this.x = x;
    this.y = y;

    this.drawCircle = function (context, radius, strokeColor, fillColor, text, textColor, textSize) {
        //console.log(this.x, this.y);
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, circleLength, true);
        context.strokeStyle = strokeColor;
        context.textAlign = "center";
        context.lineWidth = 1;
        if (fillColor != null) {
            context.fillStyle = fillColor;
            context.fill();
        }
        context.save();
        context.fillStyle = textColor;
        if (textSize == null) {
            textSize = 1;
        }
        context.font = textSize + "px Arial";
        context.textBaseline = "middle";
        context.fillText(text == null ? "" : text, this.x, this.y);
        context.restore();
        context.stroke();
    }

    this.drawLine = function (context, x1, y1, x2, y2, lineColor, lineWidth) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        context.stroke();
    }

    this.drawRectangle = function(context, width, height, strokeColor, fillColor) {
        context.beginPath();
        context.stokeStyle = strokeColor;
        context.strokeRect(this.x, this.y, width, height);
        if (fillColor != null) {
            context.fillStyle = fillColor;
            context.fillRect(this.x, this.y, width, height);
        }
    }

    this.drawText = function(context, text, textColor, alignment, fontSize) {
        context.beginPath();
        if (fontSize != null) {
            context.font = fontSize + "px Arial";
        }
        context.fillStyle = textColor;
        context.textAlign = alignment;
        context.fillText(text, this.x, this.y);
    }
}

function generateRandom(a, b) {
    return Math.random() * b + a;
}

function randomNode(x, y, r) {
    let angle = generateRandom(0, Math.PI);
    angle = Math.random() > 0.5 ? -angle : angle;
    return [x + r * Math.cos(angle), y + r * Math.sin(angle)];
}

function getDistance(x1, y1, x2, y2) {
    let disX = x1 - x2;
    let disY = y1 - y2;
    let dis = (disX * disX) + (disY * disY);
    dis = Math.sqrt(dis);
    //return Math.hypot(disX, disY);
    return dis;
}

function drawEllipse(context) {
    let cx = 300,
        cy = 300,
        rx = 100,
        ry = 40;

    context.save(); // save state
    context.beginPath();

    context.translate(cx - rx, cy - ry);
    context.scale(rx, ry);
    context.arc(1, 1, 1, 0, 2 * Math.PI, false);

    context.restore(); // restore to original state
    context.stroke();

    let ctx = context;
    ctx.beginPath();
    ctx.ellipse(300, 300, 90, 75, Math.PI / 4, 0, 2 * Math.PI);
    ctx.stroke();
}


function clearCanvas(context) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x:
            ((evt.clientX - rect.left) / (rect.right - rect.left)) *
            canvas.width,
        y:
            ((evt.clientY - rect.top) / (rect.bottom - rect.top)) *
            canvas.height,
    };
}