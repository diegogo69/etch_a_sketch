const MAX_SQUARES = 100;
let rows = 16;
let columns = 16
const container = document.querySelector('.container');
// const square = document.createElement('div');

// size variable
const size = container.offsetWidth;
// let width = box.offsetWidth;
// let height = box.offsetHeight;
generateGrid(rows);

// Mouse over event listener
container.addEventListener('mouseover', (event) => {
    event.target.style.backgroundColor = 'blue';
})

// Prompt for new grid
const btnGrid = document.querySelector('.btnGrid');
btnGrid.addEventListener('click', () => {
    rows = parseInt(prompt('Enter grid size: '));
    if (rows <= MAX_SQUARES) {
        clearGrid();
        generateGrid(rows);
    }
})

function clearGrid() {
    let squares = document.querySelectorAll('.square');
    squares.forEach(sqr => {sqr.remove()});
}

function generateGrid(rows) {
    if (rows <= MAX_SQUARES) {
        for (let i = 0; i < (rows * rows ); i++) {
            let square = document.createElement('div');
            square.classList.toggle('square');
            square.style.width = `${Math.floor(size / rows)}px`;
            square.style.height = `${Math.floor(size / rows)}px`;
            square.textContent = i;
            container.appendChild(square);
        }
    }
}
