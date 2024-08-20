const log = console.log;

const gridSmall = 8;
const gridMedium = 16;
const gridLarge = 32;
const MAX_SQUARES = 50;
const HEX_LENGTH = 6;
let rows = 10;
let columns = 10;
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
function deleteGrid() {
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
        square.style.opacity = 0.8;
        container.appendChild(square);
    }
}

// List of hexadecimal characters
const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

// Generate random color
function generateRandomColor(colorMode) {
    if (colorMode === grayScale) {
        return getRandomGrayScale();
    }

    else if (colorMode === randomColor) {
        return getRandomColor();
    }
    return
}

// FIX RANDOM COLOR TO NOT BE THAT SOLID
function getRandomColor() {
    let hexColor = '#';
    for (let index = 0; index < HEX_LENGTH; index++) {
        let randomHexDigit = Math.floor(Math.random() * hexCharacters.length)

        hexColor += hexCharacters[randomHexDigit];
    }
    return hexColor;
}

// Min a max tones of grey scale. So they're not black not white
const minGray = 3;
const maxGray = 14;
function getRandomGrayScale() {
    let hexColor = '#';
    let randomHexDigit = getRandomIntInclusive(minGray, maxGray)
    console.log(randomHexDigit);
    for (let index = 0; index < HEX_LENGTH; index++) {
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
        currentColor = generateRandomColor(colorMode);
        sqrOpacity = parseFloat(event.target.style.opacity) + 0.1;
    }
    else if (colorMode === grayScale) {
        currentColor = generateRandomColor(colorMode);
        sqrOpacity = 1;
    }

    else if (colorMode === lightning) {
        currentColor = getLighterColor(event);
        sqrOpacity = parseFloat(event.target.style.opacity);
    }

    else if (colorMode === shading) {
        currentColor = getDarkerColor(event);
        // sqrOpacity = parseFloat(event.target.style.opacity);
    }
    event.target.style.backgroundColor = currentColor;
    // event.target.style.opacity = sqrOpacity;
})

// Darker function
function getDarkerColor(event) {
    // Read sqr styles properties
    // reference sqr
    const sqrStyles = getComputedStyle(event.target);
    // get sqr color prop
    const sqrColor = sqrStyles.getPropertyValue('background-color');
    // get rgb individual values: r, g, b
    const sqrRGBMatch = sqrColor.match(/^rgba?\((\d+), (\d+), (\d+)(?:, (\d+))?\)$/);

    // make r g b values integers
    let rgbIntValues = sqrRGBMatch.slice(1).map(x => parseInt(x));
    log("rgb int values: ", rgbIntValues);

    // if achromatic
    if (isAchromatic(rgbIntValues)) {
        return `rgb(calc(${rgbIntValues[0]} - 25), calc(${rgbIntValues[1]} - 25), calc(${rgbIntValues[2]} - 25))`;
    }
    // covert rgb to hsl
    // if (sqrColor == 'rgb(255, 255, 255)') {
    //     return sqrColor;
    // }

    // convert rgb values to hsl
    const sqrHSLColor = rgbToHsl(+sqrRGBMatch[1], +sqrRGBMatch[2], +sqrRGBMatch[3]);
    console.log(sqrHSLColor);
    if (sqrHSLColor[2] < 35) return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, 20%)`; 
    return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, calc(${sqrHSLColor[2]}% - 10%))`;


}

// Lightning fuction
function getLighterColor(event) {
    // Read sqr styles properties
    // reference sqr
    const sqrStyles = getComputedStyle(event.target);
    // get sqr color prop
    const sqrColor = sqrStyles.getPropertyValue('background-color');
    log("bg-color porperty: ", sqrColor);

    // get rgb individual values: r, g, b
    const sqrRGBMatch = sqrColor.match(/^rgba?\((\d+), (\d+), (\d+)(?:, \d+)?\)$/);
    log("rgb regex match: ", sqrRGBMatch);

    // get int rgb values
    let rgbIntValues = sqrRGBMatch.slice(1).map(x => parseInt(x));
    log("rgb int values: ", rgbIntValues);

    // if achromatic
    if (isAchromatic(rgbIntValues)) {
        return `rgb(calc(${rgbIntValues[0]} + 25), calc(${rgbIntValues[1]} + 25), calc(${rgbIntValues[2]} + 25))`;
    }
    // covert rgb to hsl
    // if (sqrColor == 'rgb(255, 255, 255)') {
    //     return sqrColor;
    // }
    // const sqrHSLColor = rgbToHsl(+sqrRGBMatch[1], +sqrRGBMatch[2], +sqrRGBMatch[3]);
    // // Highlight hsl color luminance by 10%
    // let sqrNewLuminance = sqrHSLColor[2] + 10;
    // if (sqrNewLuminance > 100) sqrNewLuminance = 100;
    // let sqrNewSat = sqrHSLColor[1] + 10;
    // if (sqrNewSat > 100) sqrNewSat = 100;
    // // hsl color string casted
    // const sqrHSL = `hsl(${sqrHSLColor[0]}, ${sqrNewSat}%, ${sqrNewLuminance}%)`;
    // // const sqrLighter = sqrHSLColor.match(/^hsl\((\d+), (\d+), (\d+)\)$/);
    // console.log(sqrHSL);
    // return sqrHSL;

    // covert rgb values to hsl
    const sqrHSLColor = rgbToHsl(+sqrRGBMatch[1], +sqrRGBMatch[2], +sqrRGBMatch[3]);
    console.log(sqrHSLColor);
    // maybe just return the same rgb value
    if (sqrHSLColor[2] > 80) return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, 95%)`; 
    return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, calc(${sqrHSLColor[2]}% + 10%))`;

}

// Check if color is black, white or gray
function isAchromatic([r, g, b]) {
    if (r === g && g === b) return true;   
    else return false;
}

// Prompt for new grid
const btnChangeGrid = document.querySelector('.btnChangeGrid');
btnChangeGrid.addEventListener('click', () => {
    let newRows;
    do {
        newRows = parseInt(prompt('Enter grid size: '));
    } while (newRows < 0 || newRows > MAX_SQUARES)
        if (newRows) {
            deleteGrid();
            generateGrid(newRows);
        }
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
            
        // Selected GRAYSCALE
        case 'btnGrayScale':
            colorMode = grayScale;
            break;
            
        case 'btnLightning':
            colorMode = lightning;
            break;

        case 'btnShading':
            colorMode = shading;
            break;

        case 'btnToggleGrid':
            let squares = document.querySelectorAll('.square');
            squares.forEach(sqr => {sqr.classList.toggle('outlined')});
            break;

        case 'btnClear':
            clearGrid();
            break;

        case 'btnGridSmall':
            deleteGrid();
            generateGrid(gridSmall);
            break;

        case 'btnGridMedium':
            deleteGrid();
            generateGrid(gridMedium);
            break;

        case 'btnGridLarge':
            deleteGrid();
            generateGrid(gridLarge);
            break;
    }
})

const customGridVal = document.querySelector("#customGridValue");
const customGrid = document.querySelector("#customGrid");
customGrid.value = rows;
customGridVal.value = rows;
customGridVal.textContent = `Value: ${customGridVal.value}`;

// Change label
customGrid.addEventListener("input", (event) => {
    customGridVal.textContent = `Value: ${event.target.value}`;
});

// Change grid size
customGrid.addEventListener("change", event => {
    rows = customGrid.value
    deleteGrid();
    generateGrid(rows);
})

// Clear grid. Make it full white
function clearGrid() {
    let squares = document.querySelectorAll('.square');
    squares.forEach(sqr => {sqr.style.backgroundColor = 'white'});
}

// DONT FORGOT AOUT THIS THIS
generateGrid(rows);

//Generate random number between a range 
function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}


// let test = document.querySelector('.test');
// // using computed style
// let testColor = getComputedStyle(test).backgroundColor;
// console.log(testColor); // rgb(240, 15, 15)
// // using style.backgroundColor
// let testColor2 = test.style.backgroundColor
// console.log(testColor2); // ""

// const { abs, min, max, round } = Math;
// // background-color: hsl(0, 88%, 50%);
// const test = document.querySelector('.test');
// const testCS = window.getComputedStyle(test);
// const testbackgroundColor = testCS.getPropertyValue('background-color');
// console.log("bg rbg: " + testbackgroundColor); // rgb(240, 15, 15)
// let rgbConverted = rgbToHsl(255, 255, 255);
// console.log("bg: hsl(316, 20%, 41%)");
// console.log(`bg: ${rgbConverted}`);

function rgbToHsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
    const vmax = max(r, g, b), vmin = min(r, g, b);
    let h, s, l = (vmax + vmin) / 2;
  
    if (vmax === vmin) {
      return [0, 0, l]; // achromatic
    }
  
    const d = vmax - vmin;
    s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
    if (vmax === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (vmax === g) h = (b - r) / d + 2;
    if (vmax === b) h = (r - g) / d + 4;
    h /= 6;
  
    return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
  }