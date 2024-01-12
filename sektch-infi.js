let NUM_CIRCLES = 40;
let FLOAT_SPEED = 1;
let TRANSITION_SPEED = 0.05;
let CIRCLESIZE_D = 100;
let FSIZE = 160;
let BUF = 40

let circles = []; 
let float = true;
let circleSize;
let tDiv;
let a;
let mouseNorm = 0;


function gxy(x, y) {
    return (x - y);
}

function setup(){
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("head")
    cnv.style('display', 'block');
    cnv.style('position', 'absolute');
    cnv.style('inset', 0);
    noStroke();

    font = loadFont('assets/helvetica-compressed-5871d14b6903a.otf');

    circleSize = width / CIRCLESIZE_D;
    tDiv = 2 * 3.14 / NUM_CIRCLES;
    a = width / 10;

    for(let i = 0; i < NUM_CIRCLES; i++){
        let tI = tDiv * i;
        let circle = {
            x : random(circleSize / 2, width - circleSize / 2),
            y : random(circleSize / 2, height - circleSize / 2),
            speedX: random(-FLOAT_SPEED, FLOAT_SPEED),
            speedY: random(-FLOAT_SPEED, FLOAT_SPEED),
            targetX:  ((a * sqrt(2) * cos(tI)) / (sq(sin(tI)) + 1)) + (width / 2),
            targetY: (a * sqrt(2) * cos(tI) * sin(tI)) / (sq(sin(tI)) + 1) + height - (height / 6) - FSIZE / 6,
            tI : tI
        };
        circles.push(circle);
    }
}

function draw(){
    if (float){
        background(30);
        fill(200);
        mouseNorm = gxy(mouseX, mouseY);

        textAlign(RIGHT, BOTTOM);
        textFont(font, FSIZE/3);
        text("order", (width / 2) - a / 2.5, height - (height / 6));  
    }
    else{
        background(200);
        fill(30);

        textAlign(LEFT, BOTTOM);
        textFont(font, FSIZE/3);
        text("chaos", (width / 2) + a / 2.5, height - (height / 6)); 
    }
    textAlign(CENTER, BOTTOM);
    textFont(font, FSIZE);
    text('what we', (width / 2) - mouseNorm * 0.3, (height / 2) - (FSIZE - BUF));
    text('do in the', (width / 2) - mouseNorm * 0.1, (height / 2));
    text('shadows', (width / 2), (height / 2) + (FSIZE - BUF));

    // textFont(font, FSIZE / 3);
    // text("|", (width / 2), height - (height / 6));

    for(let i = 0; i < circles.length; i++){
        let circle = circles[i];

        if(float){
            
            circle.x = lerp(circle.x, circle.targetX, TRANSITION_SPEED);
            circle.y = lerp(circle.y, circle.targetY, TRANSITION_SPEED);

        }
        else{

            circle.tI += 1/100;
            circle.x = ((a * sqrt(2) * cos(circle.tI)) / (sq(sin(circle.tI)) + 1)) + (width / 2);
            circle.y = (a * sqrt(2) * cos(circle.tI) * sin(circle.tI)) / (sq(sin(circle.tI)) + 1) + height - (height / 6) - FSIZE / 6;

            if(circle.tI >= 2 * 3.14){
                circle.tI = 0;
            }

        }

        ellipse(circle.x, circle.y, circleSize, circleSize);
        
    }
}

// function mouseWheel(){
//     float = false;
// }

function mouseClicked(){
    float = !float;
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    circleSize = width / CIRCLESIZE_D;
}