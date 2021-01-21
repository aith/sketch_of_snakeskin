let canvas;
let canW = 1560;
let canH = 1080;
let bg = 000

// The render distance- larger than the canvas. To be generated
let totalW;
let totalH;

let scaleW = 100;
let scaleH = 100;
let scaleOffX = 10;  // The space in between scales / 2
let scaleOffY = 10;
let scaleTotalW = scaleOffX/2.5;;  // scaleW + 2 * scaleOffX
let scaleTotalH = scaleOffY/2.5;

// The size limits to the scale random gen
let scaleBoundX;
let scaleBoundY;

// To be generated
let scalesPerCol; 
let scalesPerRow;

let scaleXArr = []
let scaleYArr = []
let scaleColorArr = []

let seed = 0;

let lastMove = 0;
let speed = 0.05;

let rMin = 80;
let rMax = 230;
let gMin = 10;
let gMax = 200;
let bMin = 10;
let bMax = 200;

function setup() {
    canvas = createCanvas(canW, canH);
    background(000);
    createButton("Reimagine").mousePressed(reimagine);
    calcMetrics();
    assert();
    generateScales();
}

function assert() {
    if (scaleTotalW % totalW != 0) {
        print("For looping, make sure that the scaleTotalW % TotalW == 0")
    }
}

function calcMetrics() {
    scaleTotalW = scaleW+2*scaleOffX;
    scaleTotalH = scaleH+2*scaleOffY;

    totalW = canW + 2*scaleTotalH;
    totalH = canH + 2*scaleTotalH;

    scalesPerRow = totalW / (scaleTotalW);
    scalesPerCol = totalH / (scaleTotalH);

    scaleBoundX = scaleOffX/2.3;
    scaleBoundY = scaleOffY/2.3;

    print("scalesPerRow are " + scalesPerRow);
    print("scalesPerCol are " + scalesPerCol);
}

function generateScales() {
    for (let x = 0; x < scalesPerRow * 2 + 2; x++) {     // Doubled because diamonds "overlap" on X...
        let OffX =  -scaleTotalW + (x * scaleTotalW)/2;  // and +2 because of the two columns outside of canvas
        for (let y = 0; y < scalesPerCol; y++) {
            let OffY = -scaleTotalH + y * scaleTotalH;
            if (x & 1) OffY += scaleTotalH/2;  // Cause a diagonalization effect

            scaleColorArr.push(pickColor());

            // Vertex Coordinates
            let x1 = OffX + scaleOffX,            y1 = OffY + scaleH/2 + scaleOffY,
                x2 = OffX + scaleW/2 + scaleOffX, y2 = OffY + scaleOffY,
                x3 = OffX + scaleW + scaleOffX,   y3 = OffY + scaleH/2 + scaleOffY,
                x4 = OffX + scaleW/2 + scaleOffX, y4 = OffY + scaleH + scaleOffY;

            // Random functions
            x1 += random(-scaleBoundX, scaleBoundX); y1 += random(-scaleBoundY, scaleBoundY);
            x2 += random(-scaleBoundX, scaleBoundX); y2 += random(-scaleBoundY, scaleBoundY);
            x3 += random(-scaleBoundX, scaleBoundX); y3 += random(-scaleBoundY, scaleBoundY);
            x4 += random(-scaleBoundX, scaleBoundX); y4 += random(-scaleBoundY, scaleBoundY);
            
            scaleXArr.push(x1, x2, x3, x4);
            scaleYArr.push(y1, y2, y3, y4);
        }
    }
}

function pickColor() {
    return color(
        random(rMin, rMax),
        random(gMin, gMax),
        random(bMin, bMax)
    );
}

function drawScales() {
    for (let v = 0, c = 0; v < scaleXArr.length; c++) {
        // check if scales will cause clipping 
        if (scaleXArr[v] > canW) {  
            v += 4; // skip to next square
        }
        else {
            beginShape();
            fill(scaleColorArr[c])
            vertex(scaleXArr[v], scaleYArr[v++]);
            vertex(scaleXArr[v], scaleYArr[v++]);
            vertex(scaleXArr[v], scaleYArr[v++]);
            vertex(scaleXArr[v], scaleYArr[v++]);
            endShape();
        }
    }
}

function moveScales() {
    let distance = (millis() - lastMove) * speed; 
    for (let i = 0; i < scaleXArr.length; i++) {
        if (scaleXArr[i] >= totalW) {
            scaleXArr[i] = (scaleXArr[i] + distance) % totalW;
            scaleXArr[i] -= scaleTotalW;
        }
        else scaleXArr[i] = scaleXArr[i] + distance;
    }
    lastMove = millis();
}

function reimagine() {
    seed++;
    print("Resetting sketch");
    resetSketch();
}

function draw() {
    background(bg);
    drawScales();
    moveScales();
}

function resetSketch() {
    scaleXArr = [];
    scaleYArr = [];
    scaleColorArr = [];
    generateScales();
}
