//DOM object capture
const toggleTreeBtn = document.getElementById('trees-toggle');
const randomizeTreesBtn = document.getElementById('randomize-trees')
const randomizeAnimalsBtn = document.getElementById('randomize-animals')
const runSimulationBtn = document.getElementById('run-simulation');

const options = {
    treeGeneration: true,
    gridSize: 10,
    numberOfTrees: 4,
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

const boardOccupationData = {
    treeOccupation: [],
    unoccupiedTiles: [],
    wolfOccupation: [],
    rabbitOccupation: [],
}

//Event listeners
toggleTreeBtn.addEventListener('click', toggleTreeGeneration);

randomizeTreesBtn.addEventListener('click', randomizeTrees);

randomizeAnimalsBtn.addEventListener('click', randomizeAnimals);

//constructors and classes
function Animal(id, size, hunger, color, posX, posY) {
    this.id = id;
    this.size = size;
    this.hunger = hunger;
    this.color = color;
    this.coordinates = [posX, posY];
    this.originalCoordinates = [posX, posY];
    this.previousCalculatedCoordinates = [[posX, posY]];

    animalData.animalIdCounter++;
}

Animal.prototype.information = function() {
    console.log(`${this.id} is ${this.color}, ${this.size} units big and has ${this.hunger} hunger`);
}

Animal.prototype.chase = function(targetObject) {
    //f(n) = g(n) + h(n)
    //f(n) is total estimated cost of path through node n
    //g(n) is cost so far to reach node n  
    //h(n) is estimated cost from n to goal. Use Manhattan Distance Heuristic

    //calculates adjacent tiles that can be moved to
    let targetCoordinates = targetObject.coordinates;
    const startingCoordinates = this.originalCoordinates;
    const previousCoordinates = this.coordinates;
    // const openArray = [[this.coordinates, 0]];
    // const closedArray = [];
    
    const updateLocation = (currentCoordinate) => {
        bestTile = calculateNextBestTile(currentCoordinate);
        this.coordinates = bestTile;

        boardOccupationData.wolfOccupation.forEach(function(part, index, arr) {
            if (part[0] === previousCoordinates[0] && part[1] === previousCoordinates[1]) {
                arr[index] = bestTile;
            }
        })

        boardOccupationData.rabbitOccupation.forEach(function(part, index, arr) {
            if (part[0] === previousCoordinates[0] && part[1] === previousCoordinates[1]) {
                arr[index] = bestTile;
            }
        })
    }

    const calculateNextBestTile = (currentCoordinate) => {
        const validTilesWithFValues = calculateValidAdjacentTiles(currentCoordinate);
        let closestTile = validTilesWithFValues[0];
        for (let i = 0; i < validTilesWithFValues.length; i++) {
            if (validTilesWithFValues[i][1] < closestTile[1]) {
                closestTile = validTilesWithFValues[i];
            }
        }
        return closestTile[0];
    }

    const calculateValidAdjacentTiles = (coordinate) => {
        upLeft = [(coordinate[0] - 1), (coordinate[1] + 1)];
        upMiddle = [(coordinate[0]), (coordinate[1] + 1)];
        upRight = [(coordinate[0] + 1), (coordinate[1] + 1)];
        left = [(coordinate[0] - 1), (coordinate[1])];
        right = [(coordinate[0] + 1), (coordinate[1])];
        downLeft = [(coordinate[0] - 1), (coordinate[1] - 1)];
        downMiddle = [(coordinate[0]), (coordinate[1] - 1)];
        downRight = [(coordinate[0] + 1), (coordinate[1] - 1)];
        let adjacentTiles = [upLeft, upMiddle, upRight, left, right, downLeft, downMiddle, downRight];
        let availableSpaces = [];

        for (let i = 0; i < adjacentTiles.length; i++) {
            if (checkIfAdjacentTileIsTarget(adjacentTiles[i][0], adjacentTiles[i][1])) {
                availableSpaces = [[adjacentTiles[i][0], adjacentTiles[i][1]]];
                this.previousCalculatedCoordinates = [[adjacentTiles[i][0], adjacentTiles[i][1]]];
                console.log(availableSpaces)
                break
            } else if (checkIfSpaceIsOccupied(adjacentTiles[i][0], adjacentTiles[i][1])
                && !this.previousCalculatedCoordinates.some(([x, y]) => x === adjacentTiles[i][0] && y === adjacentTiles[i][1])) {
                availableSpaces.push(adjacentTiles[i]);
                this.previousCalculatedCoordinates.push(adjacentTiles[i]);
            }
        }
        availableSpaces.forEach(function(part, index, array) {
            array[index] = [part, calculateFScore(part)];
        });
        return availableSpaces;
    }

    function checkIfAdjacentTileIsTarget(numX, numY) {
        if (numX === targetCoordinates[0] && numY == targetCoordinates[1]) {
            return true
        }
    }

    function calculateFScore(coordinate) {
        //g is the total cost of movements until that point calculated using pythagorean theorum
        function calculatePriorMovementCost() {
            return Math.sqrt(((Math.abs(coordinate[0] - startingCoordinates[0]))**2) + ((Math.abs(coordinate[1] - startingCoordinates[1]))**2));
        }

        //heuristic is the straight line distance to the target using pythagorean theorum
        function calculateHeuristic() {
            return Math.sqrt(((Math.abs(coordinate[0] - targetCoordinates[0]))**2) + ((Math.abs(coordinate[1] - targetCoordinates[1]))**2));
        }
        return calculatePriorMovementCost() + calculateHeuristic();
    }

    updateLocation(this.coordinates)
}

function Wolf(posX, posY) {
    const color = animalData.wolfData.colors[(randomInt(0, (animalData.wolfData.colors.length - 1)))]
    Animal.call(this, `wolf_${animalData.animalIdCounter}`, randomInt(2, 7), 3, color, posX, posY);
}

Object.setPrototypeOf(Wolf.prototype, Animal.prototype);

function Rabbit(posX, posY) {
    const color = animalData.rabbitData.colors[(randomInt(0, (animalData.rabbitData.colors.length - 1)))]
    Animal.call(this, `rabbit_${animalData.animalIdCounter}`, randomInt(1, 3), 3, color, posX, posY);
}

// Object.setPrototypeOf(Rabbit.prototype, Animal.prototype);

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

function clearTreeMemory() {
    boardOccupationData.treeOccupation = [];
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

function constructBoardInDOM() {
    gridContainer = document.getElementById('grid-container');

    clearBoardInDOM();

    function assignCoordinates(tile, x, y) {
        tile.setAttribute('data-coordinate-x', `${x}`);
        tile.setAttribute('data-coordinate-y', `${y}`);
    }

    for (let y = 0; y < options.gridSize; y++) {
        row = document.createElement('div');
        for (let x = 0; x < options.gridSize; x++) {
            if (boardOccupationData.treeOccupation.some(([treeX, treeY]) => treeX === x && treeY === y) && options.treeGeneration) {
                let treeTile = document.createElement('div');
                treeTile.setAttribute('class', 'tree-tile');
                assignCoordinates(treeTile, x, y);
                row.appendChild(treeTile);
            } else if (boardOccupationData.wolfOccupation.some(([wolfX, wolfY]) => wolfX === x && wolfY === y)) {    
                let wolfTile = document.createElement('div');
                wolfTile.setAttribute('class', 'wolf-tile');
                assignCoordinates(wolfTile, x, y);
                row.appendChild(wolfTile);
            } else if (boardOccupationData.rabbitOccupation.some(([rabbitX, rabbitY]) => rabbitX === x && rabbitY === y)) {    
                let rabbitTile = document.createElement('div');
                rabbitTile.setAttribute('class', 'rabbit-tile');
                assignCoordinates(rabbitTile, x, y);
                row.appendChild(rabbitTile);
            } else {
                let emptyTile = document.createElement('div');
                assignCoordinates(emptyTile, x, y);
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