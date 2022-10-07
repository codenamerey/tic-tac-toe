const Gameboard = (function() {
    let gameboard = [];
    const getGameBoard = function() {
        return gameboard
    }

    return {getGameBoard}
})();

const formController = (function() {
    const form = document.getElementById('player-form');
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

    form.onsubmit = function(e) {
        e.preventDefault();
        for (const radio of playerOneRadios) {
            radio.removeEventListener('change', update);
        }
        const playerOnePick = (document.querySelector('input[name="player-one-mark"]:checked')).value;
        const playerTwoPick = (document.querySelector('input[name="player-two-mark"]:checked')).value;
        const playerOneName = (document.querySelector('#player-one-name')).value;
        const playerTwoName = (document.querySelector('#player-two-name')).value;
        gameController.createPlayer(playerOneName, playerOnePick);
        gameController.createPlayer(playerTwoName, playerTwoPick);
        
        displayController.proceedToGame(gameController.getPlayers());
    }
})();

const displayController = (function() {
    const form = document.getElementById('player-form');
    const content = document.getElementById('content');
    const gameboard = document.getElementById('gameboard');
    const playersDisplay = document.getElementById('players');
    const render = function() {
        gameboard.textContent = Gameboard.getGameBoard();
    }
    const proceedToGame = function(players) {
        if(!players.length == 2) return;
        form.style.display = 'none';
        content.style.display = 'flex';
        gameboard.style.display = 'grid';
        //display player names and markers
        (gameController.getPlayers()).forEach((player, index) => {
            playersDisplay.innerHTML += `<div id="player">Player ${index + 1} Name: ${player.name}, Marker: ${player.mark}`;
        });
    }
    return {render, proceedToGame}
})();

function playerFactory(name, mark) {
    this.name = name;
    this.mark = mark;

    return {name, mark}
}

const gameController = (function() {
    const players = [];
    const createPlayer = function(name, mark) {
        const playerObj = playerFactory(name, mark);
        players.push(playerObj);
    }
    const getPlayers = function() {
        return players;
    }
    return {createPlayer, getPlayers}
})();

// displayController.render();