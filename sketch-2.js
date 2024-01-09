let NUM_CIRCLES = 16;
let FLOAT_SPEED = 1;
let TRANSITION_SPEED = 0.05;
let CIRCLESIZE_D = 25;
let FSIZE = 160;
let BUF = 40

let circles = [];
let float = true;
let circleSize;
let mouseNorm = 0;


function gxy(x, y) {
    return (x - y)
}

function setup(){
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    cnv.style('position', 'absolute');
    cnv.style('inset', 0);
    noStroke();

    font = loadFont('assets/helvetica-compressed-5871d14b6903a.otf');

    circleSize = width / CIRCLESIZE_D;

    for(let i = 0; i < NUM_CIRCLES; i++){
        let circle = {
            x : random(circleSize / 2, width - circleSize / 2),
            y : random(circleSize / 2, height - circleSize / 2),
            speedX: random(-FLOAT_SPEED, FLOAT_SPEED),
            speedY: random(-FLOAT_SPEED, FLOAT_SPEED),
            targetX: null,
            targetY: null
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
        text("order", (width / 2) - 20, height - (height / 6));  
    }
    else{
        background(200);
        fill(30);

        textAlign(LEFT, BOTTOM);
        textFont(font, FSIZE/3);
        text("chaos", (width / 2) + 20, height - (height / 6)); 
    }
    textAlign(CENTER, BOTTOM);
    textFont(font, FSIZE);
    text('what we', (width / 2) - mouseNorm * 0.3, (height / 2) - (FSIZE - BUF));
    text('do in the', (width / 2) - mouseNorm * 0.1, (height / 2));
    text('shadows', (width / 2), (height / 2) + (FSIZE - BUF));

    textFont(font, FSIZE/3);
    text("|", (width / 2), height - (height / 6));

    for(let i = 0; i < circles.length; i++){
        let circle = circles[i];

        if(float){
            circle.x += circle.speedX;
            circle.y += circle.speedY;

            if(circle.x < 0 + circleSize / 2 || circle.x > width - circleSize / 2){
                circle.speedX = -circle.speedX;
            }
            if(circle.y < 0 + circleSize / 2 || circle.y > height - circleSize / 2){
                circle.speedY = -circle.speedY;
            }
        }
        else{
            let spacing = width / NUM_CIRCLES;

            circle.targetX = i * spacing + circleSize * 0.75;
            // circle.targetY = height - (height / 3);
            circle.targetY = ((4 * height / 3) + (FSIZE / 2 - BUF))/2

            circle.x = lerp(circle.x, circle.targetX, TRANSITION_SPEED);
            circle.y = lerp(circle.y, circle.targetY, TRANSITION_SPEED);
        }

        ellipse(circle.x, circle.y, circleSize, circleSize);
    }
}

function mouseWheel(){
    float = false;
}

function mouseClicked(){
    float = !float;
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    circleSize = width / CIRCLESIZE_D;
}