// "use strict"
// {


let width = 10,
    height = 20,
    ms = 1000;

height += 2;

let dataMtx,
    currentFig,
    figWidth,
    figHeight,
    nextFigure,
    x,
    y,
    timerId


function startNewGame() {
    clearInterval(timerId);
    refreshMtxAndTable();
    startNewRound();
}

function startNewRound() {
    x = width / 2 - 2;
    y = 0;
    chooseRandomFig(figures);
    pushFigure(x, y);
    showNextFig();
    timerId = setInterval(fall, ms)
}

function createTable() {
    for (let i = 0; i < height; i++) {
        let tr = document.createElement('tr');
        if (i < 2) tr.hidden = true;
        for (let j = 0; j < width; j++) {
            let td = document.createElement('td');
            tr.append(td)
        }
        table.append(tr)
    }
}

function refreshMtxAndTable() {
    dataMtx.forEach((row, i) => {
        row.forEach((_, j) => {
            table.rows[i].cells[j].classList.remove('filled');
            dataMtx[i][j] = 0;
        })
    })
}


// function createNewMtxAndTable() {
//     dataMtx = new Array(height).fill('').map(_ => new Array(width).fill(0));
//     table.innerHTML = '';
//     createTable();
// }

dataMtx = new Array(height).fill('').map(_ => new Array(width).fill(0));

function initFigure(fig) {
    currentFig = fig;
    figWidth = fig[0].length;
    figHeight = fig.length;
}

// function render() {
//     dataMtx.forEach((row, i) => row.forEach((el, j) => {
//         let block = table.rows[i].cells[j];
//         if (el - block.classList.contains('filled')) block.classList.toggle('filled');
//     }))
// }

const randomInt0To = len => ~~(Math.random() * len)

function chooseRandomFig(arr) {
    currentFig = nextFigure || arr[randomInt0To(arr.length)];
    nextFigure = arr[randomInt0To(arr.length)];
    initFigure(currentFig);
}

function showNextFig() {
    nextFigure.forEach((row, i) => row.forEach((el, j) => {
        let block = table2.rows[i].cells[j];
        if (el - block.classList.contains('filled')) block.classList.toggle('filled');
    }))
}
// const chooseRandomRotation = () => {
//     for (let k = 0; k < randomInt0To(4); k++) rotateFigure();
// }

const rowIsFilled = ind => dataMtx[ind].every(el => el)


function cleanRow(i) {
    table.rows[i].remove();
    dataMtx.splice(i, 1);
    dataMtx.unshift(new Array(width).fill(0));
    const tr = document.createElement('tr');
    for (let j = 0; j < width; j++) {
        let td = document.createElement('td');
        tr.append(td);
    }
    table.rows[2].before(tr);
}

function rotateFigure() {
    let rotatedFig = [];/* new Array(figWidth).fill('').map(_ => new Array(figHeight).fill(0)); */
    for (let j = figWidth - 1; j >= 0; j--) {
        rotatedFig.push([]);
        for (let i = 0; i < figHeight; i++) {
            /* if (currentFig[i][j]) */ rotatedFig[figWidth - 1 - j][i] = currentFig[i][j];
        }
    }
    popFigure(x, y);
    if (!isPossible(rotatedFig, x, y)) pushFigure(x, y);
    else {
        initFigure(rotatedFig);
        pushFigure(x, y)
    }
}

function isPossible(fig, x, y) {
    return !fig.some((row, i) => row.some((val, j) => val &&
        (
            y + i >= height ||
            x + j < 0 ||
            x + j > width - 1 ||
            dataMtx[Math.min(height - 1, y + i)][x + j < 0 ? 0 : x + j > width - 1 ? width - 1 : x + j]
        )
    ))
}

function popFigure(/* fig, from, tab, */x, y) {
    currentFig.forEach((row, i) => {
        row.forEach((val, j) => {
            if (val) {
                dataMtx[y + i][x + j] = 0;
                table.rows[y + i].cells[x + j].classList.remove('filled')
            }
        })
    });
}

function pushFigure(/* fig, in, tab, */x, y) {
    currentFig.forEach((row, i) => {
        row.forEach((val, j) => {
            if (val) {
                dataMtx[y + i][x + j] = val;
                table.rows[y + i].cells[x + j].classList.add('filled')
            }
        })
    });
}

function finishRound() {
    for (let i = 3; i < height; i++) if (rowIsFilled(i)) cleanRow(i);
    clearInterval(timerId);
    dataMtx[2].every(el => !el) ? startNewRound() : (alert('Game Over. You lose... Try again'), refreshMtxAndTable());
}

function fall() {
    popFigure(x, y)
    if (!isPossible(currentFig, x, y + 1)) {
        pushFigure(x, y);
        finishRound();
    }
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

startBtn.onclick = () => startNewGame();

pauseBtn.onclick = () => timerId ? (clearInterval(timerId), timerId = null, pauseBtn.innerHTML = 'Continue') : (timerId = setInterval(fall, ms), pauseBtn.innerHTML = 'Pause')


// document.body.addEventListener('myEv', startNewRound)

document.body.addEventListener('keydown', function handler(e) {
    // if (!timerId) return;

    if (e.keyCode > 36 && e.keyCode < 41) e.preventDefault(); // if(event.key.slice(,5) === 'Arrow')

    if (e.key === 'ArrowLeft') pushLeft();
    if (e.key === 'ArrowRight') pushRight();
    if (e.key === 'ArrowDown') fall();
})

document.body.addEventListener('keyup', function handler(e) {
    // if (!timerId) return;
    if (e.key === 'ArrowUp') e.preventDefault(), rotateFigure();
})

createTable()
    // startNewGame()

    // }