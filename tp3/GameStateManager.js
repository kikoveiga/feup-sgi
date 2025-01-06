const GameStates = Object.freeze({
    INITIAL: "initial",
    RUNNING: "running",
    PAUSED: "paused",
    FINAL: "final"
});

const balloonSmoothFactors = {
    pink: 2,
    blue: 3,
    green: 4,
    orange: 5,
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

        this.opponent.smoothFactor = balloonSmoothFactors[opponentBalloonColor];

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