const GameStates = {
    INITIAL: "initial",
    RUNNING: "running",
    PAUSED: "paused",
    FINAL: "final"
};

class GameStateManager {
    constructor() {
        this.state = null;
        this.callbacks = [];

        this.player = {
            name: "Player",
            balloonColor: "blue",
            time: "N/A",
        }

        this.opponent = {
            name: "Opponent",
            balloonColor: "orange",
            time: "N/A",
            smoothFactor: 5,
        }

        this.laps = 1;
        this.startPoint = "A";

        this.winner = null;
    }

    getState() {
        return this.state;
    }

    startGame(playerBalloonColor, playerName, opponentBalloonColor, laps, startPoint) {
        this.player.balloonColor = playerBalloonColor;
        this.player.name = playerName;
        this.opponent.balloonColor = opponentBalloonColor;
        this.laps = laps;
        this.startPoint = startPoint;

        switch (opponentBalloonColor) {
            case 'pink':
                this.opponent.smoothFactor = 2;
                break;
            case 'blue':
               this.opponent.smoothFactor = 3;
                break;
            case 'orange':
                this.opponent.smoothFactor = 5;
                break;
            case 'green':
                this.opponent.smoothFactor = 4;
                break;
        }

        this.setState(GameStates.RUNNING);
    }

    restartGame() {
        this.setState(GameStates.RUNNING);
    }

    endGame(winner, winnerTime) {
        this.winner = winner;
        this.winner.time = winnerTime;

        this.setState(GameStates.FINAL);
    }

    startMainMenu() {
        this.setState(GameStates.INITIAL);
    }

    setState(newState) {

        // console.log(GameStates);

        if (!Object.values(GameStates).includes(newState)) {
            console.error('Invalid GameState: ' + newState);
            return;
        }

        if (this.state === newState) {
            return;
        }

        this.state = newState;

        this.callbacks.forEach(callback => callback(newState));
    }

    onStateChange(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        } else {
            console.error('Callback must be a function.');
        }
    }
}

export { GameStateManager, GameStates };