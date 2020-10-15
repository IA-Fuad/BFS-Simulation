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
let edgeColor;

document.querySelector("#NE").addEventListener("click", function () {
    clearCanvas(context);
    nodeNumbers = document.querySelector("#nodes").value;
    edgeNumbers = document.querySelector("#edges").value;
    if (nodeNumbers == "" || edgeNumbers == "") {
        alert("input incomplete");
        return;
    }
    nodeNumbers = parseInt(nodeNumbers);
    edgeNumbers = parseInt(edgeNumbers);
    if (nodeNumbers < 0 || edgeNumbers < 0) {
        alert("input numbers should be positive");
        return;
    }

    let edgeInput = document.querySelector("#edgeInput");
    while (edgeInput.firstChild) {
        edgeInput.removeChild(edgeInput.firstChild);
    }
    let x, u, v;
    let instruction = document.createElement("h3");
    instruction.innerHTML = "Input Edges: "
    edgeInput.appendChild(instruction);
    for (let i = 0; i < edgeNumbers; i++) {
        x = document.createElement("div");
        u = document.createElement("input");
        v = document.createElement("input");
        u.type = "number";
        v.type = "number";
        u.id = "u" + i;
        v.id = "v" + i;
        u.setAttribute("style", "margin: 2px");
        x.appendChild(u);
        x.appendChild(v);
        edgeInput.appendChild(x);
    }
    let btn = document.createElement("Button");
    btn.innerText = "Generate Graph";
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
        u = parseInt(u);
        v = parseInt(v);
        if (u < 0 || v < 0 || u >= nodeNumbers || v >= nodeNumbers) {
            console.log(u<0, v<0, u>=nodeNumbers, v>=nodeNumbers);
            console.log(u, v, nodeNumbers);
            alert("inputs in edge lists should be between 0 and Nodes-1");
            return;
        }
    }

    document.getElementById("dragInstruction").innerHTML =
        "Drag around the nodes to change the position as you like";
    if (init()) {
        draw(true);
    }

    let simulation = document.querySelector("#simulation");

    while (simulation.firstChild) {
        simulation.removeChild(simulation.firstChild);
    }

    let label = document.createElement("label");
    let startNode = document.createElement("input");
    let startButton = document.createElement("button");
    
    label.for = "startNode";
    label.innerHTML = "Start Node"
    startNode.id = "startNode";
    startNode.type = "number";
    startNode.setAttribute("style", "margin: 10px");
    startButton.id = "startButton";
    startButton.innerHTML = "Start Simulation";
    startButton.addEventListener("click", startSimulation);

    simulation.appendChild(label);
    simulation.appendChild(startNode);
    simulation.appendChild(startButton);
}

function startSimulation() {
    if (nodes.length === 0 || edges.length === 0) {
        alert("input incomplete");
        return;
    }
    clearCanvas(context);
    draw(true);
    let start = parseInt(document.getElementById("startNode").value);
    if (start >= nodeNumbers || start < 0) {
        alert("start node should be between 0 and Nodes-1");
        return;
    }
    for (let i = 0; i < edges.length; i++) {
        if (edges[i] == null) {
            continue;
        }
        edges[i].sort(function (a, b) {
            if (getDistance(nodes[i].x, nodes[i].y, a.x, a.y) <
                getDistance(nodes[i].x, nodes[i].y, b.x, b.y)) {
                    return -1;
                }
            return 1;
        });
    }
    bfs(nodes[start], null, nodeNumbers, edges);
}

let insideNode = null;
let mouseMove = false;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    midX = window.innerWidth / 2;
    midY = window.innerHeight / 2;

    if (init()) {
        draw(false);
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
        draw(false);
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

function Graph(x, y, radius, node, circleColor, textColor, textSize) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.node = node;
    this.shapes = new DrawShapes(this.x, this.y);
    this.circleColor = circleColor;
    this.textColor = textColor;
    this.textSize = textSize;
    //this.edgeColor = edgeColor;

    this.drawNode = function () {
        //console.log(this.x, this.y);
        this.shapes = new DrawShapes(this.x, this.y);
        this.shapes.drawCircle(context, this.radius, "black", this.circleColor, this.node, this.textColor, textSize);
        //this.shapes.drawText(context, this.node, this.textColor, "center", textSize);
    };

    this.drawEdge = function (edges) {
        let len = edges.length;
        for (let i = 0; i < len; i++) {
            let angle1 = Math.atan2(edges[i].y - this.y, edges[i].x - this.x);
            let angle2 = Math.atan2(this.y - edges[i].y, this.x - edges[i].x);

            this.shapes.drawLine(
                context,
                this.x + Math.cos(angle1) * this.radius,
                this.y + Math.sin(angle1) * this.radius,
                edges[i].x +
                    Math.cos(angle2) * edges[i].radius -
                    Math.cos(angle2),
                edges[i].y +
                    Math.sin(angle2) * edges[i].radius -
                    Math.sin(angle2),
                edgeColor[this.node][edges[i].node]
            );
        }
    };
}

function init() {
    clearCanvas(context);
    nodes = [];
    edges = [];
    edgeColor = new Array(nodeNumbers);
    for (let i = 0; i < nodeNumbers; i++) {
        edgeColor[i] = new Array(nodeNumbers);
    }

    let R = Math.min(window.innerWidth / 2, window.innerHeight / 2) - (nodeRadius + 20);
    R -= queueBoundary;
    // let circumLen = R * 2 * Math.PI;
    // let avgDis = circumLen / nodeNumbers - 8;
    // console.log(circumLen, avgDis);

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
            }
        }

        nodes[i] = new Graph(x, y, nodeRadius, i, "white", "black", "black");
    }

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

        edgeColor[u][v] = "black";
        edgeColor[v][u] = "black";
    }

    return true;
}

function draw(reset) {
    for (let i = 0; i < nodeNumbers; i++) {
        if (reset) {
            for (let i = 0; i < edgeNumbers; i++) {
                let u = document.getElementById("u" + i).value;
                let v = document.getElementById("v" + i).value;
                edgeColor[u][v] = "black";
                edgeColor[v][u] = "black";
            }
            nodes[i].circleColor = "white";
            nodes[i].textColor = "black";
            nodes[i].edgeColor = "black";
        }
        nodes[i].drawNode();
    }

    for (let i = 0; i < nodeNumbers; i++) {
        if (edges[i] == null) {
            continue;
        }
        nodes[i].drawEdge(edges[i]);
    }
}