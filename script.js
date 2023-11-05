//DOM object capture
const toggleTreeBtn = document.getElementById('trees-toggle');
const randomizeTerrainBtn = document.getElementById('randomize-terrain')
const randomizeAnimalsBtn = document.getElementById('randomize-animals')
const runSimulationBtn = document.getElementById('run-simulation');

let options = {
    treeGeneration: true,
    gridSize: 20,
    //This will not guarantee this number of trees, but is a close approx.
    numberOfTrees: 50,
    numberOfWolves: 1,
    numberOfRabbits: 1,
}

let animalData = {
    animalIdCounter: 1,
    wolves: [],
    rabbits: [],
    wolfColors: ['black', 'grey'],
    rabbitColors: ['black', 'brown', 'grey', 'merle']
}

//Event listeners
toggleTreeBtn.addEventListener('click', toggleOption);
toggleTreeBtn.addEventListener('click', function() {
    if (toggleTreeBtn.getAttribute('style') != 'background-color: grey;') {
        toggleTreeBtn.setAttribute('style', 'background-color: grey;')
    } else {
        toggleTreeBtn.setAttribute('style', '')
    }
});
randomizeTerrainBtn.addEventListener('click', runSimulation);

//constructors and classes
function Animal(id, size, hunger, color) {
    this.id = id;
    this.size = size;
    this.hunger = hunger;
    this.color = color;

    animalData.animalIdCounter++
}

Animal.prototype.information = function() {
    console.log(`${this.id} is ${this.color}, ${this.size} units big and has ${this.hunger} hunger`);
}

function Wolf() {
    color = animalData.wolfColors[(randomInt(0, animalData.wolfColors.length))]
    Animal.call(this, id = `wolf_${animalData.animalIdCounter}`, size = randomInt(2, 7), hunger = randomInt(0, 3), color);
}

Object.setPrototypeOf(Wolf.prototype, Animal.prototype)

function Rabbit() {
    color = animalData.rabbitColors[(randomInt(0, animalData.rabbitColors.length))]
    Animal.call(this, id = `rabbit_${animalData.animalIdCounter}`, size = randomInt(1, 3), hunger = randomInt(0, 3), color);
}

Object.setPrototypeOf(Rabbit.prototype, Animal.prototype)

//functions

//toggles an option in the options object from true to false or vice versa
//reads the option to change from the DOM object 'data-jsFunction' attribute
function toggleOption() {
    if (options[`${this.getAttribute('data-jsFunction')}`] === true) {
        options[`${this.getAttribute('data-jsFunction')}`] = false;
        console.log(options[`${this.getAttribute('data-jsFunction')}`]);
    } else if (options[`${this.getAttribute('data-jsFunction')}`] === false) {
        options[`${this.getAttribute('data-jsFunction')}`]= true;
        console.log(options[`${this.getAttribute('data-jsFunction')}`]);
    } else {
        console.log(`ToggleError: ${options[`${this.getAttribute('data-jsFunction')}`]}`);
    }
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.round(randomFloat(min, max));
}

function generateTerrain() {
    gridContainer = document.getElementById('grid-container');

    function generateTrees() {
        trees = []
        for (i = 0; i < options.numberOfTrees; i++) {
            let numX = Math.round(randomFloat(0, options.gridSize));
            let numY = Math.round(randomFloat(0, options.gridSize));
            trees.push([numX, numY]);
        }
        return trees;
    }

    trees = [];
    if (options.treeGeneration === true) {
        trees = generateTrees();
    }

    function assignCoordinates(tile, x, y) {
        tile.setAttribute('data-coordinate-x', `${x}`);
        tile.setAttribute('data-coordinate-y', `${y}`);
    }

    for (y = 0; y < options.gridSize; y++) {
        row = document.createElement('div');
        row.setAttribute('id', `rowNo${y}`);
        for (x = 0; x < options.gridSize; x++) {
            let isTreeTile = false;
            for (i = 0; i < trees.length; i++) {
                if(x == trees[i][0] && y == trees[i][1]) {
                    isTreeTile = true;
                }
            }
            if (isTreeTile == true) {
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

function clearTerrain() {
    document.getElementById('grid-container').innerHTML = '';
}

function generateRabbit() {
    animalData.rabbits.push(new Rabbit());
}

function generateWolf() {
    animalData.wolves.push(new Wolf());
}

function runSimulation() {
    clearTerrain();
    generateTerrain();
}