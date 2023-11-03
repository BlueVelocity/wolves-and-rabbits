function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function generateTerrain() {
    let gridSize = 50
    let numberOfTrees = 200

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
    console.log(trees)

    for (y = 0; y < gridSize; y++) {
        row = document.createElement('div')
        row.setAttribute('id', `rowNo${i}`)
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
                row.appendChild(treeTile)
            } else {
                let emptyTile = document.createElement('div')
                row.appendChild(emptyTile)
            }
        }
        gridContainer.appendChild(row)
    }
}

generateTerrain()