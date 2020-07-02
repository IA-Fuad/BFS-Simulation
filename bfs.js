let values = [];

function BFS(start, end, totalNodes, edgeList) {
    this.queue = [start];
    this.vis = new Array(totalNodes).fill(false);
    this.vis[start.node] = true;
    this.start = start;
    this.end = end;
    this.totalNodes = totalNodes;
    this.edgeList = edgeList;
    while (this.queue.length > 0) {
        let u = this.queue.shift();
        let a = [];
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

let i = -1;
function simulateBFS() {
    i++;
    if (values.length === i) {
        flag = false;
        return;
    }
    if (values[i].adj.length > 0) {
        console.log(values[i], values[i].adj);
        check(values[i].active, values[i].adj);
    } else {
        simulateBFS();
    }
}

function animate(all, a) {
    let req = requestAnimationFrame(function () {
        animate(all, a);
    });

    let finish = 0;
    a.drawNode("yellow", "black");
    for (let i = 0; i < all.length; i++) {
        let x = all[i].x,
            y = all[i].y,
            dx = all[i].dx,
            dy = all[i].dy,
            fx = all[i].fx,
            fy = all[i].fy,
            b = all[i].b;
        if (getDistance(x, y, fx, fy) > b.radius) {
            new DrawShapes().drawLine(
                a.x + dx * a.radius,
                a.y + dy * a.radius,
                x,
                y,
                "red",
                3
            );
            all[i].x += dx;
            all[i].y += dy;
        } else {
            finish++;
            b.drawNode("red", "white");
        }
    }

    if (finish === all.length) {
        console.log("called");
        a.drawNode("green", "white");
        cancelAnimationFrame(req);
        simulateBFS();
    }
}

function check(a, b) {
    let all = [];

    for (let i = 0; i < b.length; i++) {
        let x1 = a.x,
            y1 = a.y,
            x2 = b[i][0].x,
            y2 = b[i][0].y;
        let angle1 = Math.atan2(y2 - y1, x2 - x1);
        let dx = Math.cos(angle1);
        let dy = Math.sin(angle1);
        x1 += dx * a.radius;
        y1 += dy * a.radius;
        let ob = {
            x: x1,
            y: y1,
            dx: dx,
            dy: dy,
            fx: x2,
            fy: y2,
            b: b[i][0],
        };
        all.push(ob);
    }
    animate(all, a);
}
