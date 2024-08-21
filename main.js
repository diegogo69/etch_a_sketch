const log = console.log;

// Painting and grid lines boolean values (toggle)
let paintActive = true;
let gridActive = false;

// Default grid sizes
const gridSmall = 8;
const gridMedium = 16;
const gridLarge = 32;
// Variable (changing) grid size variable (binding)
let rows = 10;

// MAX number of squares
const MAX_SQUARES = 100;

// Length of a hexadecimal string value
const HEX_LENGTH = 6;
// List of hexadecimal characters
const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

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

// Reference to the Sketch container. Where the grid is draw
const sketchContainer = document.querySelector('.container');

// Size of Sketch container in px
const sketchSize = sketchContainer.offsetWidth;

// Generate grid of squares of height and width rows
function generateGrid(rows) {
    let squareSize = Math.floor(sketchSize / rows);
    for (let i = 0; i < (rows * rows ); i++) {
        let square = document.createElement('div');
        square.classList.toggle('square');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        // square.textContent = i;
        if (gridActive) square.classList.toggle('outlined');
        sketchContainer.appendChild(square);
    }
}

// Delete all existing squares
function deleteGrid() {
    let squares = document.querySelectorAll('.square');
    squares.forEach(sqr => {sqr.remove()});
}

// Clear grid. Make it full white
function clearGrid() {
    let squares = document.querySelectorAll('.square');
    squares.forEach(sqr => {sqr.style.backgroundColor = 'white'});
}

// Generate random color
function generateRandomColor(colorMode) {
    if (colorMode === grayScale) return getRandomGrayScale();
    else if (colorMode === randomColor) return getRandomColor();
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

// Min and max tones for grey scale. So not black nor white
const minGray = 3;
const maxGray = 14;
function getRandomGrayScale() {
    let hexColor = '#';
    let randomHexDigit = getRandomIntInclusive(minGray, maxGray)
    for (let index = 0; index < HEX_LENGTH; index++) {
        hexColor += hexCharacters[randomHexDigit];
    }
    return hexColor;
}

// Painting active
sketchContainer.addEventListener('click', () => {
    if (paintActive === true) paintActive = false;
    else if (paintActive === false) paintActive = true;
})
// Mouse over event listener
sketchContainer.addEventListener('mouseover', (event) => {
    // Paint based on color mode
    if (colorMode === randomColor) {
        currentColor = generateRandomColor(colorMode);
    }
    else if (colorMode === grayScale) {
        currentColor = generateRandomColor(colorMode);
    }

    else if (colorMode === lightning) {
        currentColor = getLighterColor(event.target);
    }

    else if (colorMode === shading) {
        currentColor = getDarkerColor(event.target);
    }
    // Else singleColor. Use the current color
    
    if (paintActive) event.target.style.backgroundColor = currentColor;
})


// Darker function
function getDarkerColor(sqr) {
    // Reference sqr styles properties
    const sqrStyles = getComputedStyle(sqr);
    // Get sqr color prop
    const sqrColor = sqrStyles.getPropertyValue('background-color');
    // Get rgb individual values: r, g, b
    const sqrRGBMatch = sqrColor.match(/^rgba?\((\d+), (\d+), (\d+)(?:, (\d+))?\)$/);
    // Parse r g b values to integers
    let rgbIntValues = sqrRGBMatch.slice(1).map(x => parseInt(x));

    // If achromatic return same rgb values minus 25
    if (isAchromatic(rgbIntValues)) {
        return `rgb(calc(${rgbIntValues[0]} - 25), calc(${rgbIntValues[1]} - 25), calc(${rgbIntValues[2]} - 25))`;
    }

    // If not achromatic convert rgb values to hsl
    const sqrHSLColor = rgbToHsl(+sqrRGBMatch[1], +sqrRGBMatch[2], +sqrRGBMatch[3]);
    // Avoid returning a color with luminance less than 20%
    if (sqrHSLColor[2] < 35) return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, 20%)`; 
    // Return same color with lower luminance
    return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, calc(${sqrHSLColor[2]}% - 10%))`;
}

// Lightning fuction
function getLighterColor(sqr) {
    // Reference sqr styles properties
    const sqrStyles = getComputedStyle(sqr);
    // Get sqr color prop
    const sqrColor = sqrStyles.getPropertyValue('background-color');
    // Get rgb individual values: r, g, b
    const sqrRGBMatch = sqrColor.match(/^rgba?\((\d+), (\d+), (\d+)(?:, \d+)?\)$/);
    // Parse r g b values to integers
    let rgbIntValues = sqrRGBMatch.slice(1).map(x => parseInt(x));

    // If achromatic return same rgb values plus 25
    if (isAchromatic(rgbIntValues)) {
        return `rgb(calc(${rgbIntValues[0]} + 25), calc(${rgbIntValues[1]} + 25), calc(${rgbIntValues[2]} + 25))`;
    }
    // If not achromatic convert rgb values to hsl
    const sqrHSLColor = rgbToHsl(+sqrRGBMatch[1], +sqrRGBMatch[2], +sqrRGBMatch[3]);
    // Avoid returning a color with luminance greater than 95%
    if (sqrHSLColor[2] > 80) return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, 95%)`; 
    // Return same color with higher luminance
    return `hsl(${sqrHSLColor[0]}, ${sqrHSLColor[1]}%, calc(${sqrHSLColor[2]}% + 10%))`;
}

// Check if color is black, white or gray
function isAchromatic([r, g, b]) {
    if (r === g && g === b) return true;   
    else return false;
}

// TOOL BAR
const toolsContainer = document.querySelector('#toolsContainer');
toolsContainer.addEventListener('click', event => {
    // Compare event element ID
    switch (event.target.id) {
        // Selected BLACK / WHITE   
        case 'btnBlackWhite':
            // Work with classes toBlack and toWhite. Invert
            // If current class toWhite.
            if (event.target.classList.contains('toWhite')) {
                event.target.classList.remove('toWhite');
                // Change color to white
                colorMode = singleColor;
                currentColor = '#FFFFFF';
                event.target.classList.add('toBlack');
            }
            // If current class toBlack
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
        
        // Selected lighning
        case 'btnLightning':
            colorMode = lightning;
            break;

        // Selected shading
        case 'btnShading':
            colorMode = shading;
            break;

        // Selected display or hide grid lines
        case 'btnToggleGrid':
            let squares = document.querySelectorAll('.square');
            if (gridActive === true) gridActive = false;
            else if (gridActive === false) gridActive = true;
            squares.forEach(sqr => {sqr.classList.toggle('outlined')});
            break;

        // Clear sketch. Make all white
        case 'btnClear':
            clearGrid();
            break;

        // Grid size small
        case 'btnGridSmall':
            deleteGrid();
            generateGrid(gridSmall);
            updateRangeInput(gridSmall);
            break;
        // Grid size medium
        case 'btnGridMedium':
            deleteGrid();
            generateGrid(gridMedium);
            updateRangeInput(gridMedium);
            break;
        // Grid size large
        case 'btnGridLarge':
            deleteGrid();
            generateGrid(gridLarge);
            updateRangeInput(gridLarge);
            break;
    }
})

// PICK A COLOR
const pickColor = document.querySelector('#pickColor');
pickColor.addEventListener("input", event => {
    currentColor = event.target.value;
})

pickColor.addEventListener("click", event => {
    colorMode = singleColor;
})
// MAKE CUSTOM GRID RANGE AND FOOTER VALUES CHANGE WHEN GRID SIZE IS UPDATED
// CUSTOM GRID SIZE
const customGrid = document.querySelector("#customGrid");
const customGridFooter = document.querySelector("#customGridValue");
function updateRangeInput(rows) {
    customGrid.value = rows;
    customGridFooter.textContent = `Value: ${customGrid.value}`;
}

// Change label
customGrid.addEventListener("input", (event) => {
    customGridFooter.textContent = `Value: ${event.target.value}`;
});

// Change grid size
customGrid.addEventListener("change", event => {
    rows = customGrid.value
    deleteGrid();
    generateGrid(rows);
})


//Generate random number between a range 
function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

// Generate starting grid
generateGrid(rows);
updateRangeInput(rows);

// RGB TO HSL FUNCTION
const { abs, min, max, round } = Math;
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