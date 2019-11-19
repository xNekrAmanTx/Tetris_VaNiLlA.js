// "use strict"
// {


let width = 10,
    height = 20,
    figWidth = figHeight = 4,
    lastStep = false,
    speedFlag = true;

height += 2;

let dataMtx,
    currentFig,
    nextFigure,
    projection,
    x,
    y,
    timerId,
    ms;

function setInit() {
    clearInterval(timerId);
    timerId = currentFig = nextFigure = null;
    pauseBtn.innerHTML = 'Pause';
    refreshMtxAndTable();
    ms = 1000;
    lvl.innerHTML = 1;
    score.innerHTML = 0;
}

function startNewRound() {
    setTimeout(() => { lastStep = false }, 2 * 36);
    x = width / 2 - 2;
    y = 0;
    chooseRandomFig(figures);
    pushFigure(x, y);
    showNextFig(nextFigure);

    timerId = setInterval(fall, ms)
}

function startNewGame() {
    setInit();
    startNewRound();
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

// function initFigure(fig) {
//     currentFig = fig;
//     figWidth = fig[0].length;
//     figHeight = fig.length;
// }

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
    if (!figures.indexOf(currentFig)) return;

    let rotatedFig = new Array(figWidth).fill('').map(_ => new Array(figHeight).fill(0));

    if (currentFig.reduce((sum, row, i) => 3 - i ? sum + row[3] : sum + row.reduce((s, el) => s + el), 0)) {
        for (let j = 0; j < figWidth; j++) {
            for (let i = 0; i < figHeight; i++) {
                rotatedFig[j][i] = currentFig[i][j];
            }
        }
    } else {
        for (let j = 0; j < figWidth - 1; j++) {
            for (let i = 0; i < figHeight - 1; i++) {
                rotatedFig[figWidth - 2 - j][i] = currentFig[i][j];
            }
        }
    }
    popFigure(x, y);
    if (isPossible(rotatedFig, x, y)) currentFig = rotatedFig;
    pushFigure(x, y);

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

function finishGame() {
    alert('Game Over. You lose... Try again');
    // if(confirm('Would you like to submit your score?'))
    // name = prompt('Enter your Name', 'unNamed');
    saveScore();
    nextFigure = new Array(4).fill(new Array(4).fill(0));
    showNextFig();
    setTimeout(setInit, 2 * 36);
}

function finishRound() {
    lastStep = true;
    for (let i = 3, k = 0; i < height; i++) {
        if (rowIsFilled(i)) {
            cleanRow(i);
            score.innerHTML = +score.innerHTML + 200 * (1 + k++ / 2);
        }
    }
    levelUp();
    clearInterval(timerId);
    timerId = null;
    dataMtx[2].every(el => !el) ? startNewRound() : finishGame();
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

const levelUp = () => {
    if (score.innerHTML >= lvl.innerHTML * 2000) { //if(('000' + score.innerHTML).slice(-4)[0] >= lvl.innerHTML)
        lvl.innerHTML++;
        ms *= 0.8;
    }
}

const pause = () => timerId ? (clearInterval(timerId), timerId = null, pauseBtn.innerHTML = 'Continue') : (timerId = setInterval(fall, ms), pauseBtn.innerHTML = 'Pause')

startBtn.onclick = startNewGame;

pauseBtn.onclick = () => { if (currentFig) pause() };


// document.body.addEventListener('myEv', startNewRound)

document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Enter') startNewGame();
    if (e.key === 'Pause') pauseBtn.click();
    if (e.key.slice(0, 5) === 'Arrow' || e.key === ' ' || e.key === 'Enter') e.preventDefault(); // if (e.keyCode > 36 && e.keyCode < 41) 

    if (timerId) {
        if (e.key === 'ArrowUp' && !e.repeat) rotateFigure()
        else if (e.key === 'ArrowLeft') pushLeft()
        else if (e.key === 'ArrowRight') pushRight()
        else if (e.key === 'ArrowDown' && speedFlag) lastStep && e.repeat ? speedFlag = false : (fall(), score.innerHTML++ , levelUp())
    }
})


document.addEventListener('keyup', function handler(e) {
    if (!currentFig) return;
    if (e.key === 'ArrowDown') speedFlag = true;

    // console.log(e.target)
})

const getTop = () => JSON.parse(localStorage.getItem('highscores'))

const renderTop = () => getTop().forEach((score, i) => top5.children[i].innerHTML = score)

function saveScore() {
    if (score.innerHTML > getTop().pop()) {
        localStorage.setItem('highscores', JSON.stringify([...getTop(), score.innerHTML].sort((a, b) => +b - +a).slice(0, -1)));
        renderTop();
    }
}

// let buttons = document.getElementsByClassName('button-container')[0];
// document.onfocus = () => false

localStorage.setItem('highscores', localStorage.getItem('highscores') || "[0, 0, 0, 0, 0]");
renderTop();
dataMtx = new Array(height).fill('').map(_ => new Array(width).fill(0));
createTable();

    // }