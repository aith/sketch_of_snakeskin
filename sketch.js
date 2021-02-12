let canvas;
let canW = 1560;  // For looping, make sure that the scaleTotalW % TotalW == 0
let canH = 1080;
let bg = 000

// The render distance- larger than the canvas. To be generated
let totalW;
let totalH;

let scaleW = 100;
let scaleH = 100;
let scaleOffX = 10;  // The space in between scales / 2
let scaleOffY = 10;
let scaleTotalW = scaleOffX / 2.5;
;  // scaleW + 2 * scaleOffX
let scaleTotalH = scaleOffY / 2.5;

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
    frameRate(10)
    calcMetrics();
    canvas = createCanvas(canW, canH);
    background(000);
    createButton("Reimagine").mousePressed(reimagine);
    generateScales();
    if (scaleXArr.length != scaleYArr.length) console.log("error")

    for(let s = 0; s < scaleXArr.length; s++) {
        [scaleXArr[s], scaleYArr[s]] = chaikin_cut(scaleXArr[s], scaleYArr[s], 1);
    }
}

function draw() {
    background(bg);
    drawScales();
    // noLoop();
    moveScales();
}

function calcMetrics() {
    scaleTotalW = scaleW + 2 * scaleOffX;
    scaleTotalH = scaleH + 2 * scaleOffY;

    totalW = canW + 2 * scaleTotalH;
    totalH = canH + 2 * scaleTotalH;

    scalesPerRow = totalW / (scaleTotalW);
    scalesPerCol = totalH / (scaleTotalH);

    scaleBoundX = scaleOffX / 2.3;
    scaleBoundY = scaleOffY / 2.3;

    print("scalesPerRow are " + scalesPerRow);
    print("scalesPerCol are " + scalesPerCol);
}

function generateScales() {
    for (let x = 0; x < scalesPerRow * 2 + 2; x++) {     // Doubled because diamonds "overlap" on X...
        let OffX = -scaleTotalW + (x * scaleTotalW) / 2;  // and +2 because of the two columns outside of canvas
        for (let y = 0; y < scalesPerCol; y++) {
            let OffY = -scaleTotalH + y * scaleTotalH;
            if (x & 1) OffY += scaleTotalH / 2;  // Cause a diagonalization effect

            scaleColorArr.push(pickColor());

            // Vertex Coordinates
            let x1 = OffX + scaleOffX, y1 = OffY + scaleH / 2 + scaleOffY,
                x2 = OffX + scaleW / 2 + scaleOffX, y2 = OffY + scaleOffY,
                x3 = OffX + scaleW + scaleOffX, y3 = OffY + scaleH / 2 + scaleOffY,
                x4 = OffX + scaleW / 2 + scaleOffX, y4 = OffY + scaleH + scaleOffY;

            // Random functions
            x1 += random(-scaleBoundX, scaleBoundX);
            y1 += random(-scaleBoundY, scaleBoundY);
            x2 += random(-scaleBoundX, scaleBoundX);
            y2 += random(-scaleBoundY, scaleBoundY);
            x3 += random(-scaleBoundX, scaleBoundX);
            y3 += random(-scaleBoundY, scaleBoundY);
            x4 += random(-scaleBoundX, scaleBoundX);
            y4 += random(-scaleBoundY, scaleBoundY);

            scaleXArr.push([x1, x2, x3, x4]);
            scaleYArr.push([y1, y2, y3, y4]);
        }
    }
}

function chaikin_cut(xarr, yarr, iterations) {
    let ratio = 1/3;
    let new_xarr = [];
    let new_yarr = [];
    let n = xarr.length;
    for(let v = 0; v < n; v++) {
        let prev = (v-1) < 0 ? v-1+n : v-1;
        let x0 = lerp(xarr[v], xarr[prev], ratio);
        let y0 = lerp(yarr[v], yarr[prev], ratio);

        let x1 = lerp(xarr[v], xarr[(v+1)%n], ratio);
        let y1 = lerp(yarr[v], yarr[(v+1)%n], ratio);

        new_xarr.push(x0, x1)
        new_yarr.push(y0, y1)
    }
    xarr = new_xarr;
    yarr = new_yarr;

    return [xarr, yarr]
}

function pickColor() {
    return color(
        random(rMin, rMax),
        random(gMin, gMax),
        random(bMin, bMax)
    );
}

function drawScales() {
    for (let i = 0, c = 0; i < scaleXArr.length; i++){
        beginShape();
        for (let v = 0; v < scaleXArr[i].length; v++) {
            let x = scaleXArr[i][v];
            let y = scaleYArr[i][v];
            if (x > canW+scaleTotalW) { // if it wraps around, cull it.
                break;
            }
            vertex(x, y);
        }
        fill(scaleColorArr[i])
        endShape(CLOSE);
    }
}

function moveScales() {
    let distance = (millis() - lastMove) * speed;
    for (let i = 0; i < scaleXArr.length; i++) {
        for (let v = 0; v < scaleXArr[i].length; v++) {
            if (scaleXArr[i][v] >= totalW) {
                scaleXArr[i][v] = (scaleXArr[i][v] + distance) % totalW;
                scaleXArr[i][v] -= scaleTotalW;
            } else scaleXArr[i][v] = scaleXArr[i][v] + distance;
        }
    }
    lastMove = millis(); // TODO remove
}

function reimagine() {
    seed++;
    print("Resetting sketch");
    resetSketch();
}


function resetSketch() {
    scaleXArr = [];
    scaleYArr = [];
    scaleColorArr = [];
    generateScales();
}
