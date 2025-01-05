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
            balloonColor: "pink",
            time: "N/A",
        }

        this.winner = null;
    }

    getState() {
        return this.state;
    }

    startGame(playerBalloonColor, opponentBalloonColor) {
        this.player.balloonColor = playerBalloonColor;
        this.opponent.balloonColor = opponentBalloonColor;
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