const Gameboard = (function() {
    let gameboard = [];
    const getGameBoard = function() {
        return gameboard
    }

    const createPlayer = function(name, mark) {
        playerFactory(name, mark);
    }

    return {getGameBoard}
})();

const formController = (function() {
    const playerOneRadios = document.querySelectorAll('input[name="player-one-mark"]');
    const playerTwoRadios = document.querySelectorAll('input[name="player-two-mark"]');
    const getPlayerOneMark = function() {
        const checkedPlayerOneRadio = document.querySelector('input[name="player-one-mark"]:checked');
        return checkedPlayerOneRadio.value;
    }
    const setPlayerTwoMark = function(mark) {
        //Player Two Marker always is the inverse of Player One Marker
        switch (mark) {
            case 'O':
                mark = 'X';
                break;
            case 'X':
                mark = 'O';
                break;
        }
        for (playerRadio of playerTwoRadios) {
            if (playerRadio.value == mark) playerRadio.checked = true;
        }
    }
    const update = function() {
        setPlayerTwoMark(getPlayerOneMark());
    }
    setPlayerTwoMark(getPlayerOneMark());
    for (const radio of playerOneRadios) {
        radio.addEventListener('change', update);
    }
})();

const displayController = (function() {
    const gameboard = document.getElementById('gameboard');
    const form = document.getElementById('player-form');
    const render = function() {
        gameboard.textContent = Gameboard.getGameBoard();
    }
    return {render}
})();

function playerFactory(name, mark) {
    this.name = name;
    this.mark = mark;
}

// const gameController = (function() {
//     formController.playerOneRadio.addEventListener('change', displayController.changePlayerTwoMark(e));
// })();

// displayController.render();