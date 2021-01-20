let canW = 1000;
let canH = 1000;

// The render distance- larger than the canvas. To be generated
let totalW;
let totalH;

let scaleW = 100;
let scaleH = 100;
let scaleOffX = 10;  // The space in between scales / 2
let scaleOffY = 10;
let scaleTotalW;  // scaleW + 2 * scaleOffX
let scaleTotalH;

// To be generated
let scalesPerCol; 
let scalesPerRow;

let scaleXArr = []
let scaleYArr = []

let seed = 0;

function setup() {
    createCanvas(canW, canH);
    background(000);
    createButton("Reimagine").mousePressed(reimagine);
    calcMetrics();
    generateScales();
}

function calcMetrics() {
    scaleTotalW = scaleW+2*scaleOffX;
    scaleTotalH = scaleH+2*scaleOffY;

    totalW = canW + 2*scaleTotalH;
    totalH = canH + 2*scaleTotalH;

    scalesPerRow = totalW / (scaleTotalW);
    scalesPerCol = totalH / (scaleTotalH);

    print("scalesPerRow are " + scalesPerRow);
    print("scalesPerCol are " + scalesPerCol);
}

function generateScales() {
    let OffX = 0;
    let OffY = 0;
    for (let x = 0; x < scalesPerRow; x++) {
        OffX =  x * scaleTotalW;
        for (let y = 0; y < scalesPerCol; y++) {
            OffY = y * scaleTotalH;
            // Vertex Coordinates
            let x1 = OffX + scaleOffX,            y1 = OffY + scaleH/2 + scaleOffY,
                x2 = OffX + scaleW/2 + scaleOffX, y2 = OffY + scaleOffY,
                x3 = OffX + scaleW + scaleOffX,   y3 = OffY + scaleH/2 + scaleOffY,
                x4 = OffX + scaleW/2 + scaleOffX, y4 = OffY + scaleH + scaleOffY;
            
            scaleXArr.push(x1, x2, x3, x4);
            scaleYArr.push(y1, y2, y3, y4);
        }
    }
}

function reimagine() {
    seed++
}

function draw() {
}
