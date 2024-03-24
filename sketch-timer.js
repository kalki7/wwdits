var s1 = function( sketch ){
    let FSIZE = 80;
    let CURSTAMP = Math.floor(Date.now() / 1000);
    let FINSTAMP = 1714501800;

    let rfs;
    let timer;
    sketch.setup = function() {
        let cnv1 = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        cnv1.parent('timer')
        cnv1.style('display', 'block');
        cnv1.style('inset', 0);
        sketch.noStroke();
        rfs = (FSIZE / sketch.windowWidth) * sketch.width;
        font = sketch.loadFont('assets/helvetica-compressed-5871d14b6903a.otf');
        timer = FINSTAMP - CURSTAMP;
        sketch.frameRate(60);
    }

    sketch.draw = function() {
        sketch.background(30);
        sketch.fill(200);
        // sketch.frameRate(10);
        sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
        sketch.textFont(font, rfs);
        sketch.textSize(100);
        sketch.text(timer, (sketch.width / 2), (sketch.height / 2));
        if (sketch.frameCount % 60 == 0 && timer > -1) {
            timer --;
        }
        if (timer == -1) {
            timer = "welcome to the shadows"
        }

    }
    
    sketch.windowResized = function() {
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
        rfs = (FSIZE / sketch.windowWidth) * sketch.width;
        rbuf = (BUF / sketch.windowWidth) * sketch.width;
    }
}

new p5(s1, window.document.getElementById('inevitable'));