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

        this.winner = null;
    }

    getState() {
        return this.state;
    }

    startGame(playerBalloonColor, opponentBalloonColor) {
        this.player.balloonColor = playerBalloonColor;
        this.opponent.balloonColor = opponentBalloonColor;

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

    endGame(winner, playerTime, opponentTime) {
        this.winner = winner;
        this.player.time = playerTime;
        this.opponent.time = opponentTime;
        this.setState(GameStates.FINAL);
    }

    startMainMenu() {
        this.setState(GameStates.INITIAL);
    }

    setState(newState) {

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