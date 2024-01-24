var s1 = function( sketch ){
    let NUM_CIRCLES = 40;
    let FLOAT_SPEED = 1;
    let TRANSITION_SPEED = 0.05;
    let CIRCLESIZE_D = 100;
    let FSIZE = 160;
    let BUF = 40;

    let circles = []; 
    let float = false;
    let rfs;
    let rbuf;
    let circleSize;
    let tDiv;
    let a;
    let mouseNorm = 0;

    sketch.setup = function() {
        let cnv1 = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        cnv1.parent('head')
        cnv1.style('display', 'block');
        cnv1.style('position', 'absolute');
        cnv1.style('inset', 0);
        sketch.noStroke();

        font = sketch.loadFont('assets/helvetica-compressed-5871d14b6903a.otf');

        rfs = (FSIZE / sketch.windowWidth) * sketch.width;
        rbuf = (BUF / sketch.windowWidth) * sketch.width;
        circleSize = sketch.width / CIRCLESIZE_D;
        tDiv = 2 * 3.14 / NUM_CIRCLES;
        if (sketch.windowWidth > sketch.windowHeight){
            a = sketch.width / 10;
        }
        else{
            a = sketch.height / 10;
        }

        for(let i = 0; i < NUM_CIRCLES; i++){
            let tI = tDiv * i;
            let circle = {
                x : sketch.random(circleSize / 2, sketch.width - circleSize / 2),
                y : sketch.random(circleSize / 2, sketch.height - circleSize / 2),
                speedX: sketch.random(-FLOAT_SPEED, FLOAT_SPEED),
                speedY: sketch.random(-FLOAT_SPEED, FLOAT_SPEED),
                targetX:  ((a * sketch.sqrt(2) * sketch.cos(tI)) / (sketch.sq(sketch.sin(tI)) + 1)) + (sketch.width / 2),
                targetY: (a * sketch.sqrt(2) * sketch.cos(tI) * sketch.sin(tI)) / (sketch.sq(sketch.sin(tI)) + 1) + sketch.height - (sketch.height / 6) - rfs / 6,
                tI : tI
            };
            circles.push(circle);
        }
    }

    sketch.draw = function() {
        if (float){
            sketch.background(30);
            sketch.fill(200);
            mouseNorm = 0;

            
        }
        else{
            sketch.background(200);
            sketch.fill(30);
        }
        sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
        sketch.textFont(font, rfs);
        sketch.text('what we', (sketch.width / 2) - mouseNorm * 0.3, (sketch.height / 2) - (rfs - rbuf));
        sketch.text('do in the', (sketch.width / 2) - mouseNorm * 0.1, (sketch.height / 2));
        sketch.text('shadows', (sketch.width / 2), (sketch.height / 2) + (rfs - rbuf));

        sketch.textAlign(sketch.RIGHT, sketch.BOTTOM);
        sketch.textFont(font, rfs/3);
        sketch.text("order", (sketch.width / 2) - a / 2.5, sketch.height - (sketch.height / 6));

        sketch.textAlign(sketch.LEFT, sketch.BOTTOM);
        sketch.textFont(font, rfs/3);
        sketch.text("chaos", (sketch.width / 2) + a / 2.5, sketch.height - (sketch.height / 6)); 

        // textFont(font, rfs / 3);
        // text("|", (width / 2), height - (height / 6));

        for(let i = 0; i < circles.length; i++){
            let circle = circles[i];

            if(float){
                
                circle.x = sketch.lerp(circle.x, circle.targetX, TRANSITION_SPEED);
                circle.y = sketch.lerp(circle.y, circle.targetY, TRANSITION_SPEED);

            }
            else{

                circle.tI += 1/100;
                circle.x = ((a * sketch.sqrt(2) * sketch.cos(circle.tI)) / (sketch.sq(sketch.sin(circle.tI)) + 1)) + (sketch.width / 2);
                circle.y = (a * sketch.sqrt(2) * sketch.cos(circle.tI) * sketch.sin(circle.tI)) / (sketch.sq(sketch.sin(circle.tI)) + 1) + sketch.height - (sketch.height / 6) - rfs / 6;

                if(circle.tI >= 2 * 3.14){
                    circle.tI = 0;
                }

            }

            sketch.ellipse(circle.x, circle.y, circleSize, circleSize);
            
        }
    }

    sketch.mouseWheel = function() {
        float = true;
    }

    sketch.windowResized = function() {
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
        rfs = (FSIZE / sketch.windowWidth) * sketch.width;
        rbuf = (BUF / sketch.windowWidth) * sketch.width;
        circleSize = sketch.width / CIRCLESIZE_D;
        if (sketch.windowWidth > sketch.windowHeight){
            a = sketch.width / 10;
        }
        else{
            a = sketch.height / 10;
        }
    }
}

new p5(s1, window.document.getElementById('head'));