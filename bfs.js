let values;
let i;
let queue;
let vis;
let finish;
let dy = -7;
let nodeX = 50;
let qRadius = 30;
let queueBoundary = nodeX + qRadius * 2 + 5;
let qTextSize = 15;
let nodeColor = "#330033";;
let nodeTextColor = "white";


function bfs(start, end, totalNodes, edgeList) {
    values = [];
    i = -1;
    queue = [];
    vis = new Array(nodeNumbers).fill(false);

    let q = [start];
    let visited = new Array(totalNodes).fill(false);
    visited[start.node] = true;

    while (q.length > 0) {
        let u = q.shift();
        let a = [];
        if (edgeList[u.node] == null) {
            u.drawNode("green", "white");
            return;
        }
        let len = edgeList[u.node].length;
        for (let i = 0; i < len; i++) {
            let v = edgeList[u.node][i];
            if (!visited[v.node]) {
                visited[v.node] = true;
                q.push(v);
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

    simulateBFS();
}



function simulateBFS() {
    console.log(queue.length, i, dy);
    i++;
    finish = 0;
    if (values.length === i) {
        flag = false;
        return;
    }
    if (values[i].adj.length > 0) {
        if (!vis[values[i].active.node]) {
            queue.push(
                new Graph(
                    nodeX,
                    canvas.height - 20,
                    qRadius,
                    values[i].active.node,
                    nodeColor,
                    nodeTextColor,
                    qTextSize
                )
            );
            vis[values[i].active.node] = true;
        }
        process(values[i].active, values[i].adj);
    } else if (queue.length > 0) {
        queue[0].circleColor = "yellow";
        queue[0].textColor = "black";
        queue[0].drawNode();
        values[i].active.circleColor = "yellow";
        values[i].active.textColor = "black";
        values[i].active.drawNode();
        setTimeout(function () {
            queue[0].circleColor = "green";
            queue[0].textColor = "white";
            queue[0].drawNode();
        }, 700);
        setTimeout(function () {
            drawQueue(true, null, values[i].active);
        }, 1400);
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
    drawQueue(false, activeValues);
}



function animate(activeValues) {
    let req = requestAnimationFrame(function () {
        animate(activeValues);
    });
    
    context.clearRect(queueBoundary, 0, canvas.width, canvas.height);
    draw(false);

    let a = activeValues[0].a;
    a.circleColor = "yellow";
    a.textColor = "black";
    a.drawNode();

    if (finish === activeValues.length) {
        cancelAnimationFrame(req);
        queue[0].circleColor = "yellow";
        queue[0].textColor = "black";
        queue[0].drawNode();
        a.circleColor = "yellow";
        a.textColor = "black";
        a.drawNode();
        setTimeout(function () {
            queue[0].circleColor = "green";
            queue[0].textColor = "white";
            queue[0].drawNode();
        }, 700);
        setTimeout(function () {
            drawQueue(true, activeValues, a);
        }, 1400);
        
        return;
    }

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
                context,
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
            b.circleColor = "red";
            b.textColor = "white";
            edgeColor[a.node][b.node] = "red";
            edgeColor[b.node][a.node] = "red";
            b.drawNode();

            let n = b.node;
            if (!vis[n]) {
                finish++;
                queue.push(
                    new Graph(
                        nodeX,
                        canvas.height - 20,
                        qRadius,
                        n,
                        nodeColor,
                        nodeTextColor,
                        qTextSize
                    )
                );
                vis[n] = true;

                draw(false);
                cancelAnimationFrame(req);
                drawQueue(false, activeValues);
                return;
            }
        }
    }
}



function drawQueue(pop, activeValues, node) {
    let req = requestAnimationFrame(function () {
        drawQueue(pop, activeValues, node);
    });
    context.clearRect(0, 0, queueBoundary, canvas.height);

    if (queue.length == 0) {
        cancelAnimationFrame(req);
        draw(false);
        setTimeout(function () {
            simulateBFS();
        }, 1000);
        return;
    }

    for (let i = 0; i < queue.length; i++) {
        if (pop && i == 0) {
            // queue[i].circleColor = "green";
            // queue[i].textColor = "white";
            if (queue[i].y >= -qRadius) {
                queue[i].y += dy;
            }
        } 
        else if (queue[i].y + dy <= 100) {
            queue[i].y = 100;
        }
        else if ((i > 0 && queue[i].y + dy <= queue[i-1].y + qRadius * 2)) {
            queue[i].y = queue[i - 1].y + qRadius * 2;;
        } 
        else {
            queue[i].y += dy;
        }
        queue[i].drawNode();
    }

    if (pop && queue[0].y < -qRadius) {
        queue.shift();
        node.circleColor = "green";
        node.textColor = "white";
        node.drawNode();
        cancelAnimationFrame(req);
        setTimeout(function () {
            simulateBFS();
        }, 1000);
    }
    else if (!pop && ((queue.length == 0 || (queue.length == 1 &&  queue[0].y == 100)) || (queue.length > 1 && queue[queue.length-1].y == queue[queue.length-2].y + qRadius * 2))) {
        cancelAnimationFrame(req);
        queue[0].circleColor = "yellow";
        queue[0].textColor = "black";
        queue[0].drawNode();
        setTimeout(function () {
            animate(activeValues);
        }, 1000);
    }
}