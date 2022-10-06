const Gameboard = (function() {
    let gameboard = ['x', 'o', 'x'];
    const getGameBoard = function() {
        return gameboard
    }
    return {getGameBoard}
})();

const displayController = (function() {
    const gameboard = document.getElementById('gameboard');
    const render = function() {
        gameboard.textContent = Gameboard.getGameBoard();
    }

    return {render}
})();

function playerFactory(name) {
    this.name = name;
}

// displayController.render();