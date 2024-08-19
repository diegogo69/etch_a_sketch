const rows = 16;
const container = document.querySelector('.container');
// const square = document.createElement('div');

// size variable
let size = container.offsetWidth;
// let width = box.offsetWidth;
// let height = box.offsetHeight;
for (let i = 0; i < (rows * rows ); i++) {
    let square = document.createElement('div');
    square.style.width = `${Math.floor(size / 16)}px`;
    square.style.height = `${Math.floor(size / 16)}px`;
    square.textContent = i;
    container.appendChild(square);
}

// Mouse over event listener
container.addEventListener('mouseover', (event) => {
    event.target.style.backgroundColor = 'blue';
})