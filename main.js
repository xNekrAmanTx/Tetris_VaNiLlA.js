let width = 10,
    height = 20;

width += 4;
height += 2;

let derIjnumEm = false,
    inProgress = false,
    currentFig,
    ms,
    x,
    y

for (let i = 0; i < height; i++) {
    let tr = document.createElement('tr');
    if (i < 2) tr.hidden = true;
    for (let j = 0; j < width; j++) {
        let td = document.createElement('td');
        if (j < 2 || j > width - 3) td.hidden = true;
        td.innerHTML = `${i} ${j}`;
        tr.append(td)
    }
    table.append(tr)
}

const dataMtx = new Array(height).fill('').map(_ => new Array(width).fill(0));


function render() {
    dataMtx.forEach((row, i) => row.forEach((el, j) => {
        let block = table.rows[i].cells[j];
        if (el - block.classList.contains('filled')) block.classList.toggle('filled');
    }))
}

const randomInt0To = len => ~~(Math.random() * len)

const chooseRandomFig = arr => { currentFig = arr[randomInt0To(arr.length)] }

function rotateFigure() {
    let rotatedFig = [];
    for (let i = 0; i < 4; i++) {
        rotatedFig.push([])
        for (let j = 0; j < 4; j++) {
            rotatedFig[i][j] = currentFig[3 - j][i]
        }
    }
    // if (isPossible(rotatedFig, x, y)) {
        popFigure(x, y);
        currentFig = rotatedFig;
        pushFigure(x, y)
    // }
}

function isPossible(fig, x, y) {
    return !fig.some((row, i) => row.some((val, j) => val && (dataMtx[y + i][x + j] || j < 2 || j > width - 3 || y >= height)))
}

function popFigure(x, y) {
    currentFig.forEach((row, i) => { row.forEach((val, j) => { if (val) dataMtx[y + i][x + j] = 0 }) });
}

function pushFigure(x, y) {
    currentFig.forEach((row, i) => { row.forEach((val, j) => { if (val) dataMtx[y + i][x + j] = val }) });
    render();
}

// insertFigure(figures[0])

function fall() {
    // if (!isPossible(currentFig, x, y + 1)) return;
    popFigure(x, y);
    pushFigure(x, ++y);
}

function pushLeft() {
    // if (!isPossible(currentFig, x - 1, y)) return;
    popFigure(x, y);
    pushFigure(--x, y);
}

function pushRight() {
    // if (!isPossible(currentFig, x + 1, y)) return;
    popFigure(x, y);
    pushFigure(++x, y);
}

const rowIsFilled = ind => dataMtx[ind].slice(2, -2).every(el => el)


function cleanRow(i) {
    table.rows[i].remove();
    dataMtx.splice(i, 1);
    dataMtx.unshift(new Array(width).fill(0));
    const tr = document.createElement('tr');
    for (let j = 0; j < width; j++) {
        let td = document.createElement('td');
        if (j < 2 || j > width - 3) td.hidden = true;
        tr.append(td);
    }
    table.rows[2].before(tr);
}

document.body.addEventListener('keydown', function handler(e) {
    if (!currentFig) return;
    e.preventDefault();
    if (e.key === 'ArrowLeft') pushLeft();
    if (e.key === 'ArrowRight') pushRight();
    if (e.key === 'ArrowUp') rotateFigure();
    if (e.key === 'ArrowDown') fall();
})

while (true) {
    x = width / 2 - 2;
    y = 0;
    chooseRandomFig(figures);
    pushFigure(x, y);
    break;
    // fall();
    while (derIjnumEm) {
        for (let i = 2; i < height; i++) if (rowIsFilled(i)) cleanRow(i)
    }
}

// function isPossible(fig, x, y) {
//     return !fig.some((row, i) => row.some((val, j) => val && (dataMtx[Math.min(height-1, y + i)][x + j < 0 ? 0 : x + j > width - 1 ? width-1 : x + j ] || x + j < 2 || x + j > width - 3 || y + i >= height)))
// }