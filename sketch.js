let fsize = 160
let buf = 40
let rectWidth = 80;

function setup() {
    createCanvas(windowWidth, windowHeight);
    font = loadFont('assets/helvetica-compressed-5871d14b6903a.otf');
    noCursor()
  }
  
  function draw() {
    background('black');
    fill(200);
    textFont(font, fsize);
    textAlign(CENTER, BOTTOM);
    text('what we', (width / 2) - gxy(mouseX, mouseY) * 0.3, (height / 2) - (fsize - buf));
    text('do in the', (width / 2) - gxy(mouseX, mouseY) * 0.1, (height / 2));
    text('shadows', (width / 2), (height / 2) + (fsize - buf));
    
    textFont(font, fsize/3);
    text("|", (width / 2), height - (height / 6));
    
  }

  function gxy(x, y) {
    return (x - y)
  }