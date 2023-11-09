//DOM object capture
const toggleTreeBtn = document.getElementById('trees-toggle');
const randomizeTreesBtn = document.getElementById('randomize-trees')
const randomizeAnimalsBtn = document.getElementById('randomize-animals')
const runSimulationBtn = document.getElementById('run-simulation');
const gridSizeSlider = document.getElementById('grid-size-slider');
const gridSizeText = document.getElementById('grid-size-counter')
const treeQuantitySlider = document.getElementById('tree-quantity-slider');
const treeQuantityText = document.getElementById('tree-quantity-counter')
const wolfQuantitySlider = document.getElementById('wolf-quantity-slider');
const wolfQuantityText = document.getElementById('wolf-quantity-counter')
const rabbitQuantitySlider = document.getElementById('rabbit-quantity-slider');
const rabbitQuantityText = document.getElementById('rabbit-quantity-counter')

const options = {
    treeGeneration: true,
    gridSize: gridSizeSlider.value,
    numberOfTrees: treeQuantitySlider.value,
    numberOfWolves: wolfQuantitySlider.value,
    numberOfRabbits: rabbitQuantitySlider.value,
    gameSpeed: 250,
}

treeQuantitySlider.setAttribute('max', `${Math.round(0.3 * (options.gridSize**2))}`)
wolfQuantitySlider.setAttribute('max', `${Math.round(0.01 * (options.gridSize**2))}`)
rabbitQuantitySlider.setAttribute('max', `${Math.round(0.05 * (options.gridSize**2))}`)
treeQuantitySlider.setAttribute('value', `${Math.round((0.3 * (options.gridSize**2))*0.5)}`)
wolfQuantitySlider.setAttribute('value', `${Math.round((0.01 * (options.gridSize**2))*0.5)}`)
rabbitQuantitySlider.setAttribute('value', `${Math.round((0.05 * (options.gridSize**2))*0.5)}`)

gridSizeText.innerText = gridSizeSlider.value;
treeQuantityText.innerText = treeQuantitySlider.value;
wolfQuantityText.innerText = wolfQuantitySlider.value;
rabbitQuantityText.innerText = rabbitQuantitySlider.value;

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

const boardOccupationData = {
    treeOccupation: [],
    unoccupiedTiles: [],
    wolfOccupation: [],
    rabbitOccupation: [],
}

//on load
constructBoardInDOM()

//Event listeners
toggleTreeBtn.addEventListener('click', toggleTreeGeneration);
randomizeTreesBtn.addEventListener('click', randomizeTrees);
randomizeAnimalsBtn.addEventListener('click', randomizeAnimals);
runSimulationBtn.addEventListener('click', runSimulation);
gridSizeSlider.addEventListener('input', changeGridSize);
treeQuantitySlider.addEventListener('input', changeTreeQuantity);
wolfQuantitySlider.addEventListener('input', changeWolfQuantity);
rabbitQuantitySlider.addEventListener('input', changeRabbitQuantity);

//constructors and classes
function Animal(id, size, hunger, color, posX, posY) {
    this.id = id;
    this.size = size;
    this.hunger = hunger;
    this.color = color;
    this.coordinates = [posX, posY];
    this.originalCoordinates = [posX, posY];
    this.previouslyTravelledCoordinates = [[posX, posY]];
    this.currentTarget = null;
    animalData.animalIdCounter++;
}

Animal.prototype.information = function() {
    console.log(`${this.id} is ${this.color}, ${this.size} units big and has ${this.hunger} hunger`);
}


Animal.prototype.eat = function(targetObject) {
    console.log(`${this.id} just ate ${targetObject.id}!`)
    this.endChase(targetObject);
    targetObject.die();
}

Animal.prototype.endChase = function(targetObject) {
    this.move(targetObject.coordinates);
    this.previouslyTravelledCoordinates = [this.coordinates];
    this.originalCoordinates = this.coordinates;
}

Animal.prototype.move = function(newCoordinate) {
    const currentCoordinates = this.coordinates;
    this.coordinates = newCoordinate;  
    boardOccupationData.wolfOccupation.forEach(function(part, index, arr) {
        if (part[0] === currentCoordinates[0] && part[1] === currentCoordinates[1]) {
            arr[index] = newCoordinate;
            
        }
    });

    boardOccupationData.rabbitOccupation.forEach(function(part, index, arr) {
        if (part[0] === currentCoordinates[0] && part[1] === currentCoordinates[1]) {
            arr[index] = newCoordinate;
        }
    });
}

Animal.prototype.chase = function(targetObject) {
    //f(n) = g(n) + h(n)
    //f(n) is total estimated cost of path through node n
    //g(n) is cost so far to reach node n  
    //h(n) is estimated cost from n to goal. Use Manhattan Distance Heuristic 
    const calculateFScore = (coordinate) => {
        //g is the total cost of movements until that point calculated using pythagorean theorum
        const calculatePriorMovementCost = () => {
            return Math.sqrt(((Math.abs(coordinate[0] - this.originalCoordinates[0]))**2) +
            ((Math.abs(coordinate[1] - this.originalCoordinates[1]))**2));
        }
        //heuristic is the straight line distance to the target using pythagorean theorum
        const calculateHeuristic = () => {
            return Math.sqrt(((Math.abs(coordinate[0] - targetObject.coordinates[0]))**2) +
            ((Math.abs(coordinate[1] - targetObject.coordinates[1]))**2));
        }
        return calculatePriorMovementCost() + calculateHeuristic();
    }

    repeatCounter = 0
    const calculateValidAdjacentTiles = (coordinates) => {
        repeatCounter++
        if (repeatCounter > 2) {
            throw Error('This turned into spaghetti')
        }

        upLeft = [(coordinates[0] - 1), (coordinates[1] + 1)];
        upMiddle = [(coordinates[0]), (coordinates[1] + 1)];
        upRight = [(coordinates[0] + 1), (coordinates[1] + 1)];
        left = [(coordinates[0] - 1), (coordinates[1])];
        right = [(coordinates[0] + 1), (coordinates[1])];
        downLeft = [(coordinates[0] - 1), (coordinates[1] - 1)];
        downMiddle = [(coordinates[0]), (coordinates[1] - 1)];
        downRight = [(coordinates[0] + 1), (coordinates[1] - 1)];

        let adjacentTiles = [upLeft, upMiddle, upRight, left, right, downLeft, downMiddle, downRight];
        let availableSpaces = [];

        let noMovementOptions = true;
        while (noMovementOptions === true) {
            for (let i = 0; i < adjacentTiles.length; i++) {
                if (checkIfAdjacentTileIsTarget(adjacentTiles[i][0], adjacentTiles[i][1])) {
                    this.eat(targetObject);
                    availableSpaces = [adjacentTiles[i]];
                    noMovementOptions = false;
                    break
                } else if (checkIfSpaceIsOccupied(adjacentTiles[i][0], adjacentTiles[i][1])
                    && !this.previouslyTravelledCoordinates.some(([x, y]) => x === adjacentTiles[i][0] &&
                    y === adjacentTiles[i][1])) {
                    availableSpaces.push(adjacentTiles[i]);
                    this.previouslyTravelledCoordinates.push(this.coordinates);
                }
            }

            if (availableSpaces.length != 0) {
                availableSpaces.forEach(function(part, index, array) {
                    array[index] = [part, calculateFScore(part)];
                });
                noMovementOptions = false;
            } else {
                this.previouslyTravelledCoordinates = [this.coordinates]
                this.originalCoordinates = this.coordinates
            }
        }

        return availableSpaces;
    }

    const calculateNextBestTile = (currentCoordinate) => {
        let validTilesWithFValues = calculateValidAdjacentTiles(currentCoordinate);
        let closestTile = validTilesWithFValues[0];
        for (let i = 0; i < validTilesWithFValues.length; i++) {
            if (validTilesWithFValues[i][1] < closestTile[1]) {
                closestTile = validTilesWithFValues[i];
            }
        }
        return closestTile;
    }

    const updateLocation = (currentCoordinate) => {
        nextBestTile = calculateNextBestTile(currentCoordinate);
        this.move(nextBestTile[0])        
    }

    function checkIfAdjacentTileIsTarget(numX, numY) {
        if (numX === targetObject.coordinates[0] && numY === targetObject.coordinates[1]) {
            return true;
        }
    }

    updateLocation(this.coordinates)
}

function Wolf(posX, posY) {
    const color = animalData.wolfData.colors[(randomInt(0, (animalData.wolfData.colors.length - 1)))]
    Animal.call(this, `wolf_${animalData.animalIdCounter}`, randomInt(2, 7), 3, color, posX, posY);
}

Object.setPrototypeOf(Wolf.prototype, Animal.prototype);

Wolf.prototype.findClosestRabbit = function() {
    let currentClosestRabbit = animalData.rabbitData.rabbits[0];

    const calcDistance = (targetObject) => {
        return Math.sqrt(((Math.abs(this.coordinates[0] - targetObject.coordinates[0]))**2) +
        ((Math.abs(this.coordinates[1] - targetObject.coordinates[1]))**2))
    }

    for (let i = 0; i < animalData.rabbitData.rabbits.length -1; i++) {
        if (calcDistance(currentClosestRabbit) > calcDistance(animalData.rabbitData.rabbits[(i + 1)])) {
            currentClosestRabbit = animalData.rabbitData.rabbits[(i + 1)]
        }
    }

    return currentClosestRabbit
}

function Rabbit(posX, posY) {
    const color = animalData.rabbitData.colors[(randomInt(0, (animalData.rabbitData.colors.length - 1)))]
    Animal.call(this, `rabbit_${animalData.animalIdCounter}`, randomInt(1, 3), 3, color, posX, posY);
}

Object.setPrototypeOf(Rabbit.prototype, Animal.prototype);

Rabbit.prototype.die = function() {
    index = animalData.rabbitData.rabbits.findIndex(x => x.id === this.id);
    console.log(`${this.id} has perished`)
    for (let i = 0; i < boardOccupationData.rabbitOccupation.length; i++) {
        if (boardOccupationData.rabbitOccupation[i][0] === this.coordinates[0] &&
            boardOccupationData.rabbitOccupation[i][1] === this.coordinates[1]) {
                boardOccupationData.rabbitOccupation.splice(i, 1);
                break;
        }
    }
    animalData.rabbitData.rabbits.splice(index, 1);
}

//animal generation and handling functions
function generateRabbits() {
    for (let i = 0; i < options.numberOfRabbits; i++) {
        let spaceOccupied = true;
        let posX = null;
        let posY = null;
        while (spaceOccupied === true) {
            posX = Math.round(randomFloat(0, (options.gridSize - 1)));
            posY = Math.round(randomFloat(0, (options.gridSize - 1)));
            if (checkIfSpaceIsOccupied(posX, posY)) {
                boardOccupationData.rabbitOccupation.push([posX, posY]);
                spaceOccupied = false;
            }
        }
        animalData.rabbitData.rabbits.push(new Rabbit(posX, posY));
    }
}

function generateWolves() {
    for (let i = 0; i < options.numberOfWolves; i++) {
        let spaceOccupied = true;
        let posX = null;
        let posY = null;
        while (spaceOccupied === true) {
            posX = Math.round(randomFloat(0, (options.gridSize - 1)));
            posY = Math.round(randomFloat(0, (options.gridSize - 1)));
            if (checkIfSpaceIsOccupied(posX, posY)) {
                boardOccupationData.wolfOccupation.push([posX, posY]);
                spaceOccupied = false;
            }
        }
        animalData.wolfData.wolves.push(new Wolf(posX, posY));
    }
}

function clearAnimalMemory() {
    animalData.wolfData.wolves = [];
    animalData.rabbitData.rabbits = [];
    boardOccupationData.wolfOccupation = [];
    boardOccupationData.rabbitOccupation = [];
}

function randomizeAnimals() {
    clearAnimalMemory();
    generateRabbits();
    generateWolves();
    constructBoardInDOM();
}

function checkIfSpaceIsOccupied(numX, numY) {
    if (!boardOccupationData.treeOccupation.some(([x, y]) => x === numX && y === numY)
        && !boardOccupationData.wolfOccupation.some(([x, y]) => x === numX && y === numY)
        && !boardOccupationData.rabbitOccupation.some(([x, y]) => x === numX && y === numY)
        && numX > -1 && numY > -1 && numX < options.gridSize && numY < options.gridSize) {
            return true
        } else {
            return false
        }
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
    for (let i = 0; i < options.numberOfTrees; i++) {
        let spaceOccupied = true;
        while (spaceOccupied === true) {
            let numX = Math.round(randomFloat(0, (options.gridSize - 1)));
            let numY = Math.round(randomFloat(0, (options.gridSize - 1)));
            if (checkIfSpaceIsOccupied(numX, numY)) {
                boardOccupationData.treeOccupation.push([numX, numY]);
                spaceOccupied = false;
            }
        }
    }
}

function randomizeTrees() {
    clearTreeMemory();
    generateTrees();
    constructBoardInDOM();
}

function clearTreeMemory() {
    boardOccupationData.treeOccupation = [];
}

function constructBoardInDOM() {
    gridContainer = document.getElementById('grid-container');

    clearBoardInDOM();

    for (let y = 0; y < options.gridSize; y++) {
        row = document.createElement('div');
        for (let x = 0; x < options.gridSize; x++) {
            if (boardOccupationData.treeOccupation.some(([treeX, treeY]) => treeX === x && treeY === y) && options.treeGeneration) {
                let treeTile = document.createElement('div');
                treeTile.setAttribute('class', 'tree-tile');
                row.appendChild(treeTile);
            } else if (boardOccupationData.wolfOccupation.some(([wolfX, wolfY]) => wolfX === x && wolfY === y)) {    
                let wolfTile = document.createElement('div');
                wolfTile.setAttribute('class', 'wolf-tile');
                row.appendChild(wolfTile);
            } else if (boardOccupationData.rabbitOccupation.some(([rabbitX, rabbitY]) => rabbitX === x && rabbitY === y)) {    
                let rabbitTile = document.createElement('div');
                rabbitTile.setAttribute('class', 'rabbit-tile');
                row.appendChild(rabbitTile);
            } else {
                let emptyTile = document.createElement('div');
                row.appendChild(emptyTile);
            }
        }

        gridContainer.appendChild(row);
    }
}

function clearBoardInDOM() {
    document.getElementById('grid-container').innerHTML = '';
}

function generateUnoccupiedTiles() {
    for (let x = 0; i < options.gridSize; i++) {
        for (let y = 0; i < options.gridSize; i++) {
            if (!checkIfSpaceIsOccupied(x, y)) {
                boardOccupationData.unoccupiedTiles.push([x, y])
            }
        }
    }
}

function changeGridSize() {
    clearAnimalMemory();
    clearTreeMemory();

    options.gridSize = gridSizeSlider.value;
    gridSizeText.innerText = gridSizeSlider.value

    changeTreeQuantity();
    changeWolfQuantity();
    changeRabbitQuantity();
    constructBoardInDOM();
}

function changeTreeQuantity() {
    let value = Math.round(0.3 * (options.gridSize**2));
    if (value > 1) {
        treeQuantitySlider.setAttribute('max', `${value}`)
    } else {
        treeQuantitySlider.setAttribute('max', `1`)
    }
    options.numberOfTrees = treeQuantitySlider.value;
    treeQuantityText.textContent = `${options.numberOfTrees}`
}

function changeWolfQuantity() {
    let value = Math.round(0.01 * (options.gridSize**2));
    if (value > 1) {
        wolfQuantitySlider.setAttribute('max', `${value}`)
    } else {
        wolfQuantitySlider.setAttribute('max', `1`)
    }
    options.numberOfWolves = wolfQuantitySlider.value;
    wolfQuantityText.textContent = `${options.numberOfWolves}`
}

function changeRabbitQuantity() {
    let value = Math.round(0.05 * (options.gridSize**2));
    if (value > 1) {
        rabbitQuantitySlider.setAttribute('max', `${value}`)
    } else {
        rabbitQuantitySlider.setAttribute('max', `1`)
    }
    options.numberOfRabbits = rabbitQuantitySlider.value;
    rabbitQuantityText.textContent = `${options.numberOfRabbits}`
}

function disableInputs() {
    toggleTreeBtn.disabled = true;
    randomizeTreesBtn.disabled = true;
    randomizeAnimalsBtn.disabled = true;
    runSimulationBtn.disabled = true;
    gridSizeSlider.disabled = true;
    treeQuantitySlider.disabled = true;
    wolfQuantitySlider.disabled = true;
    rabbitQuantitySlider.disabled = true;
}

function enableInputs() {
    toggleTreeBtn.disabled = false;
    randomizeTreesBtn.disabled = false;
    randomizeAnimalsBtn.disabled = false;
    runSimulationBtn.disabled = false;
    gridSizeSlider.disabled = false;
    treeQuantitySlider.disabled = false;
    wolfQuantitySlider.disabled = false;
    rabbitQuantitySlider.disabled = false;
}

async function runSimulation() {
    disableInputs();
    while (animalData.rabbitData.rabbits.length !== 0 && animalData.wolfData.wolves.length !== 0) {
        await new Promise(resolve => setTimeout(resolve, options.gameSpeed));
        animalData.wolfData.wolves.forEach( function(part) {
            if (animalData.rabbitData.rabbits.length !== 0){
                part.chase(part.findClosestRabbit());
            }
        })
        constructBoardInDOM();
    }
    enableInputs();
}