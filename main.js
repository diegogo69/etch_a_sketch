const MAX_SQUARES = 50;
const HEX_LENGTH = 6;
let rows = 16;
let columns = 16
const container = document.querySelector('.container');

// Size of container in px
const size = container.offsetWidth;

// delete all existing squares
function clearGrid() {
    let squares = document.querySelectorAll('.square');
    squares.forEach(sqr => {sqr.remove()});
}

// Generate grid of squares of height and width rows
function generateGrid(rows) {
    for (let i = 0; i < (rows * rows ); i++) {
        let square = document.createElement('div');
        square.classList.toggle('square');
        square.style.width = `${Math.floor(size / rows)}px`;
        square.style.height = `${Math.floor(size / rows)}px`;
        square.textContent = i;
        square.style.opacity = 0;
        container.appendChild(square);
    }
}

// List of hexadecimal characters
const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

// Generate random color
function generateRandomColor() {
    let hexColor = "#";

    for (let index = 0; index < HEX_LENGTH; index++) {
        let randomHexDigit = Math.floor(Math.random() * hexCharacters.length)
        hexColor += hexCharacters[randomHexDigit];
    }

    return hexColor;
}


// Mouse over event listener
container.addEventListener('mouseover', (event) => {
    // event.target.style.backgroundColor = 'blue';
    let randomColor = generateRandomColor();
    event.target.style.backgroundColor = randomColor;
    let sqrNewOpacity = parseFloat(event.target.style.opacity) + 0.1;
    event.target.style.opacity = sqrNewOpacity;
})

// Prompt for new grid
const btnGrid = document.querySelector('.btnGrid');
btnGrid.addEventListener('click', () => {
    do {
        rows = parseInt(prompt('Enter grid size: '));
    } while (rows < 0 || rows > MAX_SQUARES)
    clearGrid();
    generateGrid(rows);

})

generateGrid(rows);