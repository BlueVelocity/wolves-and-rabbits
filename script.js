function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function generateTerrain() {
    let gridSize = 20
    //This will not guarantee this number of trees, but is a close approx.
    let numberOfTrees = 50

    gridContainer = document.getElementById('grid-container')

    function generateTrees() {
        trees = []
        for (i = 0; i < numberOfTrees; i++) {
            let numX = Math.round(randomNumber(0, gridSize))
            let numY = Math.round(randomNumber(0, gridSize))
            trees.push([numX, numY])
        }
        return trees
    }

    trees = generateTrees()

    function assignCoordinates(tile, x, y) {
        tile.setAttribute('data-coordinate-x', `${x}`)
        tile.setAttribute('data-coordinate-y', `${y}`)
    }

    for (y = 0; y < gridSize; y++) {
        row = document.createElement('div')
        row.setAttribute('id', `rowNo${y}`)
        for (x = 0; x < gridSize; x++) {
            let isTreeTile = false
            for (i = 0; i < trees.length; i++) {
                if(x == trees[i][0] && y == trees[i][1]) {
                    isTreeTile = true
                }
            }
            if (isTreeTile == true) {
                let treeTile = document.createElement('div')
                treeTile.setAttribute('class', 'tree-tile')
                assignCoordinates(treeTile, x, y)
                row.appendChild(treeTile)
            } else {
                let emptyTile = document.createElement('div')
                assignCoordinates(emptyTile, x, y)
                row.appendChild(emptyTile)
            }
        }
        gridContainer.appendChild(row)
    }
}

generateTerrain()