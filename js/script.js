const Gameboard = (function() {
    let gameboard = new Array(9);
    let currentPlayer;
    gameboard.fill(null);
    const players = [];
    const createPlayer = function(name, mark) {
        const playerObj = playerFactory(name, mark);
        if(playerObj.mark == 'X') currentPlayer = playerObj; 
        players.push(playerObj);
    }
    const getPlayers = function() {
        return players;
    }

    const getGameBoard = function() {
        return gameboard;
    }

    const getCurrentPlayer = function() {
        return currentPlayer;
    }

    const toggleCurrentPlayer = function() {
        if((getCurrentPlayer()).mark == 'X') {
            players.forEach((player) => {
                if (player.mark == 'O') {
                    currentPlayer = player;
                }
            });
        }

        else {
            players.forEach((player) => {
                if(player.mark == 'X') {
                    currentPlayer = player;
                }
            });
        }
    }

    const placeMarker = function() {
        const index = this.getAttribute('data-board-code');
        if (gameboard[index]) return;
        this.textContent = (getCurrentPlayer()).mark;
        gameboard[index] = this.textContent;
        if(gameController.checkForWinner()) displayController.displayWinnerScreen();
        toggleCurrentPlayer();
    }
    return {createPlayer, getPlayers, placeMarker, getGameBoard, getCurrentPlayer}
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
        Gameboard.createPlayer(playerOneName, playerOnePick);
        Gameboard.createPlayer(playerTwoName, playerTwoPick);
        
        displayController.proceedToGame(Gameboard.getPlayers());
    }
})();

const displayController = (function() {
    const form = document.getElementById('player-form');
    const content = document.getElementById('content');
    const gameboard = document.getElementById('gameboard');
    const playersDisplay = document.getElementById('players');

    const _refreshWindow = function() {
        document.location.reload();
    }

    const displayGameboard = function() {
        const gameboardArray = Gameboard.getGameBoard();
        gameboardArray.forEach((mark, index) => {
            const grid = document.createElement('div');
            grid.id = 'grid';
            grid.setAttribute('data-board-code', index);
            gameboard.appendChild(grid);
            grid.addEventListener('click', Gameboard.placeMarker);
        });
    }

    const proceedToGame = function(players) {
        if(!players.length == 2 || players.length > 2) return;
        form.style.display = 'none';
        content.style.display = 'flex';
        gameboard.style.display = 'grid';
        displayGameboard();
        //display player names and markers
        (Gameboard.getPlayers()).forEach((player, index) => {
            playersDisplay.innerHTML += `<div id="player">Player ${index + 1} Name: ${player.name}, Marker: ${player.mark}`;
        });
    }

    const displayWinnerScreen = function() {
        //if there is no winner, ignore
        if(!gameController.checkForWinner()) return;
        const winner = Gameboard.getCurrentPlayer();
        const winnerDisplay = document.createElement('aside');
        const restartButton = document.createElement('button');
        const message = `<p><span id="winner">${winner.name}</span> won!</p>`;
        winnerDisplay.id = 'winner-display';
        winnerDisplay.innerHTML = message;
        restartButton.textContent = 'Restart Game';
        restartButton.onclick = _refreshWindow;
        winnerDisplay.appendChild(restartButton);
        document.body.appendChild(winnerDisplay);
    }
    return {proceedToGame, displayWinnerScreen}
})();

function playerFactory(name, mark) {
    this.name = name;
    this.mark = mark;

    return {name, mark}
}

const gameController = (function() {
    const gameboard = Gameboard.getGameBoard();

    const checkForWinner = function() {
        return checkForDiagonals() ||
        checkForRows() ||
        checkForColumns();
    }

    const checkForDiagonals = function() {
        const diagonal1 = [gameboard[0], gameboard[4], gameboard[8]];
        const diagonal2 = [gameboard[2], gameboard[4], gameboard[6]];
        //check if either diagonals all have the same value
        return diagonal1.every((grid) => {
            return (grid === diagonal1[0] && grid != null);
        }) || diagonal2.every((grid) => {
            return (grid === diagonal2[0] && grid != null);
        });
    }

    const checkForRows = function() {
        const row1 = [gameboard[0], gameboard[1], gameboard[2]];
        const row2 = [gameboard[3], gameboard[4], gameboard[5]];
        const row3 = [gameboard[6], gameboard[7], gameboard[8]];
        return row1.every((grid) => {
            return (grid === row1[0] && grid != null);
        }) || row2.every((grid) => {
            return (grid === row2[0] && grid != null);
        }) || row3.every((grid) => {
            return (grid === row3[0] && grid != null);
        });
    }

    const checkForColumns = function() {
        const column1 = [gameboard[0], gameboard[3], gameboard[6]];
        const column2 = [gameboard[1], gameboard[4], gameboard[7]];
        const column3 = [gameboard[2], gameboard[5], gameboard[8]];

        return column1.every((grid) => {
            return (grid === column1[0] && grid != null);
        }) || column2.every((grid) => {
            return (grid === column2[0] && grid != null);
        }) || column3.every((grid) => {
            return (grid === column3[0] && grid != null);
        });
    }

    return {checkForWinner}
})();