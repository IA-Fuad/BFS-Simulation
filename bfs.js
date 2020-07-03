let values = [];
let i;

function BFS(start, end, totalNodes, edgeList) {
    this.queue = [start];
    this.vis = new Array(totalNodes).fill(false);
    this.vis[start.node] = true;
    this.start = start;
    this.end = end;
    this.totalNodes = totalNodes;
    this.edgeList = edgeList;
    values = [];
    i = -1;
    while (this.queue.length > 0) {
        let u = this.queue.shift();
        let a = [];
        if (this.edgeList[u.node] == null) {
            u.drawNode("green", "white");
            return;
        }
        let len = this.edgeList[u.node].length;
        for (let i = 0; i < len; i++) {
            let v = this.edgeList[u.node][i];
            if (!this.vis[v.node]) {
                this.vis[v.node] = true;
                this.queue.push(v);
                let x = [v, false];
                a.push(x);
            }
        }
        let ob = {
            active: u,
            adj: a,
        };
        values.push(ob);
    }
}

function simulateBFS() {
    i++;
    if (values.length === i) {
        flag = false;
        return;
    }
    if (values[i].adj.length > 0) {
        console.log(values[i], values[i].adj);
        process(values[i].active, values[i].adj);
    } else {
        values[i].active.drawNode("green", "white");
        simulateBFS();
    }
}

function animate(activeValues) {
    let req = requestAnimationFrame(function () {
        animate(activeValues);
    });

    let a = activeValues[0].a, finish = 0;
    a.drawNode("yellow", "black");
    for (let i = 0; i < activeValues.length; i++) {
        let x = activeValues[i].x,
            y = activeValues[i].y,
            dx = activeValues[i].dx,
            dy = activeValues[i].dy,
            fx = activeValues[i].fx,
            fy = activeValues[i].fy,
            b = activeValues[i].b;
        if (getDistance(x, y, fx, fy) > b.radius) {
            new DrawShapes().drawLine(
                a.x + dx * a.radius,
                a.y + dy * a.radius,
                x,
                y,
                "red",
                3
            );
            activeValues[i].x += dx;
            activeValues[i].y += dy;
        } else {
            finish++;
            b.drawNode("red", "white");
        }
    }

    if (finish === activeValues.length) {
        a.drawNode("green", "white");
        cancelAnimationFrame(req);
        setTimeout(function() {
            simulateBFS();
        }, 1500);
    }
}

function process(activeNode, adj) {
    let activeValues = [];

    for (let i = 0; i < adj.length; i++) {
        let x1 = activeNode.x,
            y1 = activeNode.y,
            x2 = adj[i][0].x,
            y2 = adj[i][0].y;
        let angle1 = Math.atan2(y2 - y1, x2 - x1);
        let dx = Math.cos(angle1);
        let dy = Math.sin(angle1);
        x1 += dx * activeNode.radius;
        y1 += dy * activeNode.radius;
        let ob = {
            x: x1,
            y: y1,
            dx: dx,
            dy: dy,
            fx: x2,
            fy: y2,
            a: activeNode,
            b: adj[i][0],
        };
        activeValues.push(ob);
    }
    animate(activeValues);
}
