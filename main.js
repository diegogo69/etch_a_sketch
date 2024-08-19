const MAX_SQUARES = 50;
const HEX_LENGTH = 6;
let rows = 16;
let columns = 16
const container = document.querySelector('.container');

// COLOR MODES
let singleColor = 'singleColor';
let randomColor = 'randomColor';
let grayScale = 'grayScale';
let lightning = 'lightning';
let shading = 'shading';

// COLOR MODE
let colorMode = randomColor;
// Color selected for painting
let currentColor;

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
    // Paint based on color mode
    let sqrOpacity = 0;
    if (colorMode === singleColor) {
        // maybe unncessary but just to be verbose
        currentColor = currentColor;
        sqrOpacity = 1;
    }
    else if (colorMode === randomColor) {
        currentColor = generateRandomColor();
        sqrOpacity = parseFloat(event.target.style.opacity) + 0.1;
    }
    event.target.style.backgroundColor = currentColor;
    event.target.style.opacity = sqrOpacity;
})

// Prompt for new grid
const btnChangeGrid = document.querySelector('.btnChangeGrid');
btnChangeGrid.addEventListener('click', () => {
    do {
        rows = parseInt(prompt('Enter grid size: '));
    } while (rows < 0 || rows > MAX_SQUARES)
    clearGrid();
    generateGrid(rows);

})

// TOOL BAR
const toolsContainer = document.querySelector('#toolsContainer');
toolsContainer.addEventListener('click', event => {
    // Compare event ID
    switch (event.target.id) {
        // Selected BLACK / WHITE   
        case 'btnBlackWhite':
            // Work with classes toBlack and toWhite
            // If current class toWhite
            if (event.target.classList.contains('toWhite')) {
                event.target.classList.remove('toWhite');
                // Change color to white
                colorMode = singleColor;
                currentColor = '#FFFFFF';
                event.target.classList.add('toBlack');
            }

            else if (event.target.classList.contains('toBlack')) {
                event.target.classList.remove('toBlack');
                // Change color to white
                colorMode = singleColor;
                currentColor = '#000000';
                event.target.classList.add('toWhite');
            }
            break;
        
        // Selected randomColor
        case 'btnColorful':
            colorMode = randomColor;
            break;

            // If current class toBlack
              // Set color to black
              // remove toBlack. set toWhite

    }
})

generateGrid(rows);