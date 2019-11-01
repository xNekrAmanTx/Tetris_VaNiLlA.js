let width = 10,
    height = 20,
    figWidth = 4,
    figHeight = 4;

width += figWidth;
height += figHeight / 2;

let isFlying = false,
    inProgress = false,
    currentFig,
    ms,
    x,
    y

for (let i = 0; i < height; i++) {
    let tr = document.createElement('tr');
    if (i < figHeight / 2) tr.hidden = true;
    for (let j = 0; j < width; j++) {
        let td = document.createElement('td');
        if (j < figWidth / 2 || j > width - 1 - figWidth / 2) td.hidden = true;
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

// const chooseRandomRotation = () => {
//     for (let k = 0; k < randomInt0To(4); k++) rotateFigure();
// }

function rotateFigure() {
    let rotatedFig = [];
    for (let i = 0; i < figWidth; i++) {
        rotatedFig.push([])
        for (let j = 0; j < figHeight; j++) {
            rotatedFig[i][j] = currentFig[figWidth - 1 - j][i]
        }
    }
    popFigure(x, y);
    if (!isPossible(rotatedFig, x, y)) pushFigure(x, y);
    else {
        currentFig = rotatedFig;
        pushFigure(x, y)
    }
}

function isPossible(fig, x, y) {
    return !fig.some((row, i) => row.some((val, j) => val && (dataMtx[Math.min(height-1, y + i)][x + j] || x + j < 2 || x + j > width - 3 || y + i >= height)))
}

function popFigure(x, y) {
    currentFig.forEach((row, i) => { row.forEach((val, j) => { if (val) dataMtx[y + i][x + j] = 0 }) });
}

function pushFigure(x, y) {
    currentFig.forEach((row, i) => { row.forEach((val, j) => { if (val) dataMtx[y + i][x + j] = val }) });
    render();
}


function fall() {
    popFigure(x, y)
    if (!isPossible(currentFig, x, y + 1)) pushFigure(x, y);
    else pushFigure(x, ++y);
}

function pushLeft() {
    popFigure(x, y);
    if (!isPossible(currentFig, x - 1, y)) pushFigure(x, y);
    else pushFigure(--x, y);
}

function pushRight() {
    popFigure(x, y);
    if (!isPossible(currentFig, x + 1, y)) pushFigure(x, y);
    else pushFigure(++x, y);
}

const rowIsFilled = ind => dataMtx[ind].slice(2, -2).every(el => el)


function cleanRow(i) {
    table.rows[i].remove();
    dataMtx.splice(i, 1);
    dataMtx.unshift(new Array(width).fill(0));
    const tr = document.createElement('tr');
    for (let j = 0; j < width; j++) {
        let td = document.createElement('td');
        if (j < figWidth / 2 || j > width - 1 - figWidth / 2) td.hidden = true;
        tr.append(td);
    }
    table.rows[2].before(tr);
}

document.body.addEventListener('keydown', function handler(e) {
    if (!currentFig) return;

    if (e.keyCode > 36 && e.keyCode < 41) e.preventDefault(); // if(event.key.slice(,5) === 'Arrow')

    if (e.key === 'ArrowLeft') pushLeft();
    if (e.key === 'ArrowRight') pushRight();
    if (e.key === 'ArrowUp') rotateFigure();
    if (e.key === 'ArrowDown') {
        fall()
    };
})

while (true) {
    x = width / 2 - 2;
    y = 0;
    chooseRandomFig(figures);
    pushFigure(x, y);
    break;
    // let timer = setInterval(()=>{
    //     for (let i = 2; i < height; i++) if (rowIsFilled(i)) cleanRow(i)
    // }
}

