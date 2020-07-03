const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
let midX = window.innerWidth / 2;
let midY = window.innerHeight / 2;
const nodeRadius = 20;
let nodeNumbers, edgeNumbers;
let nodes = [];
let edges = [];

document.querySelector("#NE").addEventListener("click", function () {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    nodeNumbers = document.querySelector("#nodes").value;
    edgeNumbers = document.querySelector("#edges").value;
    if (nodeNumbers == "" || edgeNumbers == "") {
        alert("input incomplete");
        return;
    }
    if (nodeNumbers < 0 || edgeNumbers < 0) {
        alert("input numbers should be positive");
        return;
    }

    let edgeInput = document.querySelector("#edgeInput");
    while (edgeInput.firstChild) {
        edgeInput.removeChild(edgeInput.firstChild);
    }
    let x, u, v;
    for (let i = 0; i < edgeNumbers; i++) {
        x = document.createElement("div");
        u = document.createElement("input");
        v = document.createElement("input");
        u.type = "number";
        v.type = "number";
        u.id = "u" + i;
        v.id = "v" + i;
        u.setAttribute("style", "margin: 10px");
        x.appendChild(u);
        x.appendChild(v);
        edgeInput.appendChild(x);
    }
    let btn = document.createElement("Button");
    btn.innerText = "Submit Edges";
    btn.id = "edgesButton";
    btn.setAttribute("style", "margin: 10px");
    btn.addEventListener("click", gen);
    edgeInput.appendChild(btn);

    canvas.setAttribute("style", "background: rgb(224, 224, 224)");
});

function gen() {

    for (let i = 0; i < edgeNumbers; i++) {
        let u = document.getElementById("u" + i).value;
        let v = document.getElementById("v" + i).value;

        if (u == "" || v == "") {
            alert("input incomplete");
            return;
        }
        if (u < 0 || v < 0 || u >= nodeNumbers || v >= nodeNumbers) {
            alert("inputs in edge lists should be between 0 and Nodes-1");
            return;
        }
    }

    document.getElementById("dragInstruction").innerHTML =
        "Drag around the nodes to change the position as you like";
    if (init()) {
        draw();
    }
}

document.querySelector("#simulate").addEventListener("click", function () {
    if (nodes.length === 0 || edges.length === 0) {
        alert("input incomplete");
        return;
    }
    clearCanvas();
    draw();
    let start = document.getElementById("start").value;
    // let goal = document.getElementById("goal").value;
    if (start >= nodeNumbers || start < 0) {
        alert("start node should be between 0 and Nodes-1");
        return;
    }
    console.log(start);
    new BFS(nodes[start], null, nodeNumbers, edges);
    simulateBFS();
});

let insideNode = null;
let mouseMove = false;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    midX = window.innerWidth / 2;
    midY = window.innerHeight / 2;

    if (init()) {
        draw();
    }
});

window.addEventListener("mousemove", function (event) {
    let mousePosition = getMousePos(canvas, event);
    let x = mousePosition.x;
    let y = mousePosition.y;

    if (mouseMove && insideNode != null) {
        nodes[insideNode].x = x;
        nodes[insideNode].y = y;
        nodes[insideNode].shapes = new DrawShapes(x, y);
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        return;
    }
    let flag = false;
    for (let i = 0; i < nodes.length; i++) {
        if (getDistance(x, y, nodes[i].x, nodes[i].y) <= nodes[i].radius) {
            flag = true;
            insideNode = i;
            break;
        }
    }
    if (!flag) {
        insideNode = null;
    }
});

window.addEventListener("mousedown", function () {
    mouseMove = true;
});

window.addEventListener("mouseup", function () {
    mouseMove = false;
    insideNode = null;
});

function Graph(x, y, radius, node) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.node = node;
    this.shapes = new DrawShapes(this.x, this.y);

    this.drawNode = function (circleColor, textColor) {
        this.shapes.drawCircle(this.radius, "black", circleColor);
        this.shapes.drawText(this.node, textColor, "center");
    };

    this.drawEdge = function (edges) {
        let len = edges.length;
        for (let i = 0; i < len; i++) {
            let angle1 = Math.atan2(edges[i].y - this.y, edges[i].x - this.x);
            let angle2 = Math.atan2(this.y - edges[i].y, this.x - edges[i].x);

            this.shapes.drawLine(
                this.x + Math.cos(angle1) * this.radius,
                this.y + Math.sin(angle1) * this.radius,
                edges[i].x +
                    Math.cos(angle2) * edges[i].radius -
                    Math.cos(angle2),
                edges[i].y +
                    Math.sin(angle2) * edges[i].radius -
                    Math.sin(angle2),
                "black"
            );
        }
    };
}

function init() {
    clearCanvas();
    nodes = [];
    edges = [];

    let R = Math.min(window.innerWidth / 2, window.innerHeight / 2) - (nodeRadius + 20);
    let circumLen = R * 2 * Math.PI;
    let avgDis = circumLen / nodeNumbers - 8;
    // console.log("avgdis", avgDis);

    for (let i = 0; i < nodeNumbers; i++) {
        let ran = randomNode(midX, midY, R);
        let x = ran[0];
        let y = ran[1];
        for (let j = 0; j < nodes.length; j++) {
            if (getDistance(x, y, nodes[j].x, nodes[j].y) <= 60) {
                ran = randomNode(midX, midY, R);
                x = ran[0];
                y = ran[1];
                j = -1;
                //console.log(x, y);
            }
        }

        nodes[i] = new Graph(x, y, nodeRadius, i);
    }
    return true;
}

function draw() {
    for (let i = 0; i < edgeNumbers; i++) {
        let u = document.getElementById("u" + i).value;
        let v = document.getElementById("v" + i).value;

        if (edges[u] == null) {
            edges[u] = [nodes[v]];
        } else {
            edges[u].push(nodes[v]);
        }
        if (edges[v] == null) {
            edges[v] = [nodes[u]];
        } else {
            edges[v].push(nodes[u]);
        }
    }

    for (let i = 0; i < nodeNumbers; i++) {
        nodes[i].drawNode("white", "black");
    }

    for (let i = 0; i < nodeNumbers; i++) {
        if (edges[i] == null) {
            continue;
        }
        nodes[i].drawEdge(edges[i]);
    }
}



// context.clearRect(0, 0, canvas.width, canvas.height);
// arrow({ x: 10, y: 10 }, { x: 100, y: 170 }, 10);
// arrow({ x: 40, y: 250 }, { x: 10, y: 70 }, 5);

// function arrow(p1, p2, size) {
//     var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
//     var hyp = Math.sqrt(
//         (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)
//     );

//     context.save();
//     context.translate(p1.x, p1.y);
//     context.rotate(angle);

//     // line
//     context.beginPath();
//     context.moveTo(0, 0);
//     context.lineTo(hyp - size, 0);
//     context.stroke();

//     // triangle
//     context.fillStyle = "blue";
//     context.beginPath();
//     context.lineTo(hyp - size, size);
//     context.lineTo(hyp, 0);
//     context.lineTo(hyp - size, -size);
//     context.fill();

//     context.restore();
// }
