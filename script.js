//DOM object capture
const toggleTreeBtn = document.getElementById('trees-toggle');
const runSimulationBtn = document.getElementById('run-simulation');

let options = {
    treeGeneration: true,
    gridSize: 20,
    //This will not guarantee this number of trees, but is a close approx.
    numberOfTrees: 50 
}

//Event listeners
toggleTreeBtn.addEventListener('click', toggleOption);
runSimulationBtn.addEventListener('click', runSimulation)


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

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function generateTerrain() {
    gridContainer = document.getElementById('grid-container');

    function generateTrees() {
        trees = []
        for (i = 0; i < options.numberOfTrees; i++) {
            let numX = Math.round(randomNumber(0, options.gridSize));
            let numY = Math.round(randomNumber(0, options.gridSize));
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

function runSimulation() {
    clearTerrain();
    generateTerrain();
}