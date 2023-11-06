//DOM object capture
const toggleTreeBtn = document.getElementById('trees-toggle');
const randomizeTreesBtn = document.getElementById('randomize-trees')
const randomizeAnimalsBtn = document.getElementById('randomize-animals')
const runSimulationBtn = document.getElementById('run-simulation');

const options = {
    treeGeneration: true,
    gridSize: 5,
    numberOfTrees: 5,
    numberOfWolves: 1,
    numberOfRabbits: 1,
}

const animalData = {
    animalIdCounter: 1,
    wolfData: {
        wolves: [],
        colors: ['black', 'grey'],
    },
    rabbitData: {
        rabbits: [],
        colors: ['black', 'brown', 'grey', 'merle']
    }
}

const boardOccupation = {
    treeOccupation: [],
    wolfOccupation: [],
    rabbitOccupation: []
}

//Event listeners
toggleTreeBtn.addEventListener('click', toggleTreeGeneration);

randomizeTreesBtn.addEventListener('click', randomizeTrees);

//constructors and classes
function Animal(id, size, hunger, color) {
    this.id = id;
    this.size = size;
    this.hunger = hunger;
    this.color = color;

    animalData.animalIdCounter++;
}

Animal.prototype.information = function() {
    console.log(`${this.id} is ${this.color}, ${this.size} units big and has ${this.hunger} hunger`);
}

function Wolf() {
    color = animalData.wolfData.colors[(randomInt(0, (animalData.wolfData.colors.length - 1)))]
    Animal.call(this, id = `wolf_${animalData.animalIdCounter}`, size = randomInt(2, 7), hunger = 3, color);
}

Object.setPrototypeOf(Wolf.prototype, Animal.prototype);

function Rabbit() {
    color = animalData.rabbitData.colors[(randomInt(0, (animalData.rabbitData.colors.length - 1)))]
    Animal.call(this, id = `rabbit_${animalData.animalIdCounter}`, size = randomInt(1, 3), hunger = 3, color);
}

Object.setPrototypeOf(Rabbit.prototype, Animal.prototype);

//animal generation and handling functions
function generateRabbit() {
    animalData.rabbitData.rabbits.push(new Rabbit());
}

function generateWolf() {
    animalData.wolfData.wolves.push(new Wolf());
}

//general functions

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.round(randomFloat(min, max));
}

//tile generation and handling functions
function toggleTreeGeneration() {
    if (options.treeGeneration === true) {
        options.treeGeneration = false;
        toggleTreeBtn.setAttribute('style', 'background-color: lightgrey;');
        randomizeTreesBtn.setAttribute('style', 'background-color: lightgrey;');
        randomizeTreesBtn.disabled = true;
    } else {
        options.treeGeneration = true
        toggleTreeBtn.setAttribute('style', '');
        randomizeTreesBtn.setAttribute('style', '');
        randomizeTreesBtn.disabled = false;
    }
    constructBoardInDOM()
}

function generateTrees() {
    for (i = 0; i < options.numberOfTrees; i++) {
        let spaceOccupied = true;
        while (spaceOccupied === true) {
            let numX = Math.round(randomFloat(0, (options.gridSize - 1)));
            let numY = Math.round(randomFloat(0, (options.gridSize - 1)));
            if (!boardOccupation.treeOccupation.some(([x, y]) => x === numX && y === numY)) {
                boardOccupation.treeOccupation.push([numX, numY]);
                spaceOccupied = false;
            }
        }
    }
}

function constructBoardInDOM() {
    gridContainer = document.getElementById('grid-container');

    clearBoardInDOM();

    function assignCoordinates(tile, x, y) {
        tile.setAttribute('data-coordinate-x', `${x}`);
        tile.setAttribute('data-coordinate-y', `${y}`);
    }

    for (y = 0; y < options.gridSize; y++) {
        row = document.createElement('div');
        for (x = 0; x < options.gridSize; x++) {
            if (boardOccupation.treeOccupation.some(([treeX, treeY]) => treeX === x && treeY === y) && options.treeGeneration) {
                let treeTile = document.createElement('div');
                treeTile.setAttribute('class', 'tree-tile');
                assignCoordinates(treeTile, x, y);
                row.appendChild(treeTile);
            } else {
                let emptyTile = document.createElement('div');
                assignCoordinates(emptyTile, x, y);
                row.appendChild(emptyTile);
            }
        }
        gridContainer.appendChild(row);
    }
}

function clearTreeMemory() {
    boardOccupation.treeOccupation = []
}

function clearBoardInDOM() {
    document.getElementById('grid-container').innerHTML = '';
}

function randomizeTrees() {
    clearTreeMemory();
    generateTrees();
    constructBoardInDOM();
}