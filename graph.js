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
    let edgeInput = document.querySelector("#edgeInput");
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
    btn.innerText = "Submit";
    btn.id = "edgesButton";
    btn.setAttribute("style", "margin: 10px");
    btn.addEventListener("click", gen);
    edgeInput.appendChild(btn);
});

document.querySelector("#simulate").addEventListener("click", function () {
    let start = document.getElementById("start").value;
    let goal = document.getElementById("goal").value;
    console.log(start);
    new BFS(nodes[start], nodes[goal], nodeNumbers, edges);
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
    let x = event.x;
    let y = event.y;
    // console.log(getDistance(x, y, nodes[0].x, nodes[0].y), nodes[0].radius);
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
        //console.log(getDistance(x, y, nodes[i].x, nodes[i].y));
        if (getDistance(x, y, nodes[i].x, nodes[i].y) <= nodes[i].radius) {
            flag = true;
            // console.log(x, y, nodes[i].x, nodes[i].y);
            // console.log(getDistance(x, y, nodes[i].x, nodes[i].y));
            insideNode = i;
            break;
        }
    }
    //console.log(insideNode);
    if (!flag) {
        insideNode = null;
    }
});

window.addEventListener("mousedown", function () {
    // console.log('clicked')
    mouseMove = true;
});

window.addEventListener("mouseup", function () {
    // console.log('dropped')
    mouseMove = false;
    insideNode = null;
    //  new BFS(nodes[0], nodes[3], n, edges);
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
                edges[i].x + Math.cos(angle2) * edges[i].radius,
                edges[i].y + Math.sin(angle2) * edges[i].radius,
                "black"
            );
        }
    };
}

function init() {
    nodes = [];
    edges = [];
    let R =
        Math.min(window.innerWidth / 2, window.innerHeight / 2) -
        (nodeRadius + 20);
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
            //console.log('hhhh')
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

    //console.log(edges);

    for (let i = 0; i < nodeNumbers; i++) {
        nodes[i].drawNode();
    }

    for (let i = 0; i < nodeNumbers; i++) {
        //console.log(edges[i])
        if (edges[i] == null) {
            continue;
        }
        nodes[i].drawEdge(edges[i]);
    }
}

function gen() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (init()) {
        draw();
    }
}

function randomNode(x, y, r) {
    let angle = generateRandom(0, Math.PI);
    angle = Math.random() > 0.5 ? -angle : angle;
    return [x + r * Math.cos(angle), y + r * Math.sin(angle)];
}
