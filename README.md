# etch_a_sketch
Etch-a-Sketch. Show your inner Picasso (we know there's one). The Odin Project 2024.

## Goal
For this project I tried to put in practice all the knowledge we have touch so far in the curriculum, an a little beyond that. Following good conventions for code style and the process of developing the logic.

## How it works
The html structure of the page is pretty basic. I used a container with a fixed size of 650px for both width and height, were the grid squares are drawed.

### Drawing the grid
I used a `generateGrid(rows)` function, that takes the number of grid squares for both width and height, calculate the squares size dividing the container width/size by the number of square rows/columns, using *Math.floor* and via a loop draws each square, wich are divs of class **square**. They are style with the opacity of **0.85** to make the colors look soft, and `flex: auto`. To make the squares occupy the space left from the division wich is not exact.

There's also a `deleteGrid()` function and a that deletes all of the grid squares in the container. And a `clearGrid()` function that makes all the grid squares white.

### Color modes
There are six different color modes

#### Single olor
Paints with the selected color. This apply for user selected colors via the color picker, or the black / white toggle.

#### Random color
Is the default, and generates color randomly, using the `getRandomColor()` function than, picks random hexadecimal digits and creates a hex color string value.

#### Gray scale
Work similiar to the random color mode, picking a random single hexadecimal digit and creating a hex color string value with it, repeated 6 times, as it is achromatic. I picks between a defined range, so it doesn't generates black nor white

#### Lightning
Makes the color go lighter. It works via the `getLighterColor(sqr)` function. That receives the target sqr as argument, and computes its styles properties to get its background color, wich is rgb. Using regulra expression it matches the rgb values and parse them to integers. It checks wether the background color is achromatic, that is white, black, or grey scale, if it is then return a css declaration with the same rgb values plus twenty-five using the css calc() function. If not achromatic the rgb color value is converted to hsl, using the `rgbToHsl` function. Then returns the hsl color with a greater luminance, with a max value of 95%, so the color doesn't get off white.

#### Shading
Works similar to the lightning color mode, getting and square background color rgb values, checking if the color is achromatic, returning a css declaration with the same rgb values minus twenty-five. And if not achromatic it converts the rgb to hsl and returns the hsl color value with a lower luminance, with a min value of 20%, so the color doesn't get totally black.

### Painting
The sketch container uses a **mouseover** event handler, using event bubbling to capture the target squares. Depending on the color mode it selects the color to be applied to the square, and if the `paintActive` boolean is toggle (true) it paints the square, changing its background color. The color to be apply is the one store in the`currentColor` variable. Wich value is assigned by the respective color mode function. 

### Tool bar
To the left side, there's a side bar with the sketch funtionalities. That has a **click** event handler, that captures, via event bubbling, the elements of type *button* of the toolbar. Inputs of type *color* and type *range* has its own event listener, they're not handle by bubbling.

#### Pick a color
Activates a color selector so the user can select what color to paint with

#### Black / white
It either white or black. The button handles classes of `toWhite`, if present when clicked change to white. And `toBlack`, if present when clicked change the color to Black. When one is cliked, it is removed and the other one is added.

#### Colorful, gray scale, lightning and shading
Activates the respective color mode

#### Toggle grid
Add an `outlined` class to the squares, so the show the grid squares lines

#### Clear Grid
Clears the grid, making it off white

#### Grid size
Allows the user to change the grid size, with values of 8, 16 and 32 for small, medium, and large respectively.

#### Custom grid size
The user can select a custom grid size, between a minimun of 2 squares per side and a maximun of 100. Using an range bar.