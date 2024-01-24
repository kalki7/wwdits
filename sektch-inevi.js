var s1 = function( sketch ){

    let CIRCLE_D = 10;
    let FSIZE = 80;
    let BUF = 5;

    let retryCount = 0;
    let circleHistory = [];
    let history = [];
    let mapCheck = {};
    let map = [];
    let options = []
    let circles = [];
    let rfs;
    let rbuf;
    let circle;
    let numX, numY;
    let cX, cY;
    let op;
    let i, j;
    let item;
    let point;
    let id;
    let breifHistory;
    let start = {'x': 0, 'y': 0};

    sketch.setup = function() {
        let cnv1 = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        cnv1.parent('inevitable')
        cnv1.style('display', 'block');
        cnv1.style('inset', 0);
        sketch.noStroke();

        rfs = (FSIZE / sketch.windowWidth) * sketch.width;
        rbuf = (BUF / sketch.windowWidth) * sketch.width;

        font = sketch.loadFont('assets/helvetica-compressed-5871d14b6903a.otf');

        numX = sketch.width % CIRCLE_D;
        numY = sketch.height % CIRCLE_D;

        cX = sketch.width / 2;
        cY = sketch.height / 2;

        for (i = cX; i < sketch.width - numX; i += CIRCLE_D * 2){
            for (j = cY; j < sketch.height - numY; j += CIRCLE_D * 2){
                circle = {
                    x : i,
                    y : j,
                    d : CIRCLE_D
                }
                circles.push(circle);
            }
        }
        for (i = sketch.width / 2 - CIRCLE_D * 2; i > 0 + numX; i -= CIRCLE_D * 2){
            for (j = sketch.height / 2; j < sketch.height - numY; j += CIRCLE_D * 2){
                circle = {
                    x : i,
                    y : j,
                    d : CIRCLE_D
                }
                circles.push(circle);
            }
        }
        for (i = sketch.width / 2; i < sketch.width - numX; i += CIRCLE_D * 2){
            for (j = sketch.height / 2 - CIRCLE_D * 2; j > 0 + numY; j -= CIRCLE_D * 2){
                circle = {
                    x : i,
                    y : j,
                    d : CIRCLE_D
                }
                circles.push(circle);
            }
        }
        for (i = sketch.width / 2 - CIRCLE_D * 2; i > 0 + numX; i -= CIRCLE_D * 2){
            for (j = sketch.height / 2 - CIRCLE_D * 2; j > 0 + numY; j -= CIRCLE_D * 2){
                circle = {
                    x : i,
                    y : j,
                    d : CIRCLE_D
                }
                circles.push(circle);
            }
        }
        
        circles.sort(function(a, b) {
            return parseFloat(a.y) - parseFloat(b.y);
        });
        circles.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
        });

        j = -1;
        for(i = 0; i < circles.length; i++){
            if (!mapCheck[circles[i].x]) {
                mapCheck[circles[i].x] = [];
                map.push([]);
                j += 1;
            }
            map[j].push(circles[i]);
        }
        delete mapCheck;

        start.x = Math.floor(Number(sketch.random(0,map.length)));
        start.y = Math.floor(Number(sketch.random(0,map[0].length)));
        point = start;
        id = String(point.x) + "," + String(point.y);
        breifHistory = [id];
    }

    sketch.draw = function() {
        sketch.background(30);
        sketch.fill(200);
        sketch.frameRate(10);
        // since the starting point isn't considered
        sketch.circle(map[start.x][start.y].x, map[start.x][start.y].y, CIRCLE_D);

        // for(i = 0; i < circles.length; i++){
        //     circle = circles[i];
        //     sketch.circle(circle.x, circle.y, circle.d);
        // }
        // sketch.rect(circles[0].x-1,circles[0].y-1,20,2);

        if(point.x - 1 >= 0){
            options.push({'x': point.x - 1, 'y': point.y, 'op': 4});
        }
        if(point.y + 1 < map[0].length){
            options.push({'x': point.x, 'y': point.y + 1, 'op': 3});
        }
        if(point.x + 1 < map.length){
            options.push({'x': point.x + 1, 'y': point.y, 'op': 2});
        }
        if(point.y - 1 >= 0){
            options.push({'x': point.x, 'y': point.y - 1, 'op': 1});
        }

        op = sketch.random(options);

        if(op.op == 2){
            item = [map[point.x][point.y].x, map[point.x][point.y].y, CIRCLE_D * 2, 2];
        }
        else if(op.op == 3){
            item = [map[point.x][point.y].x, map[point.x][point.y].y, 2, CIRCLE_D * 2];
        }
        else if(op.op == 4){
            item = [map[op.x][op.y].x, map[op.x][op.y].y, CIRCLE_D * 2, 2];
        }
        else if(op.op == 1){
            item = [map[op.x][op.y].x, map[op.x][op.y].y, 2, CIRCLE_D *2];
        }
        id = String(op.x) + "," + String(op.y);
        if(breifHistory.indexOf(id) == -1){
            console.log(id," Not done");
            breifHistory.push(id);
            circleHistory.push([map[op.x][op.y].x, map[op.x][op.y].y])
            history.push(item);
            point = op;
            options = [];
            retryCount = 0;
        }
        else{
            console.log(id, "already done");
            options = [];
            retryCount += 1;
            if(retryCount > 80){
                reset();
            }
        }

        for(i = 0; i < history.length; i++){
            sketch.circle(circleHistory[i][0], circleHistory[i][1], CIRCLE_D);
            sketch.rect(history[i][0] - 1, history[i][1] - 1, history[i][2], history[i][3]);
        }
        
        sketch.fill(200);
        sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
        sketch.textFont(font, rfs);
        sketch.text('change is inevitable', (sketch.width / 2), (sketch.height / 2) - (rfs - rbuf));
        sketch.text('go with the flow', (sketch.width / 2), (sketch.height / 2));
        sketch.text('we will all be dead soon', (sketch.width / 2), (sketch.height / 2) + (rfs - rbuf));
        sketch.textFont(font, rfs / 4);
        sketch.text("just like this pattern, you'll never see the same one again", (sketch.width / 2), sketch.height - (sketch.height / 4)); 

        
        

    }
    
    function reset(){
        start.x = Math.floor(Number(sketch.random(0,map.length)));
        start.y = Math.floor(Number(sketch.random(0,map[0].length)));
        point = start;
        id = String(point.x) + "," + String(point.y);
        breifHistory = [id];
        circleHistory = [];
        history = [];
        retryCount = 0;
        options = [];
        sketch.redraw();

    }

    sketch.windowResized = function() {
    }
}

new p5(s1, window.document.getElementById('inevitable'));