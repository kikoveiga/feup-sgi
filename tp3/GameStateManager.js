const GameStates = {
    INITIAL: "initial",
    RUNNING: "running",
    PAUSED: "paused",
    FINAL: "final"
};

class GameStateManager {
    constructor() {
        this.state = GameStates.INITIAL;
        this.callbacks = [];
        this.playerBalloonColor = null;
        this.oponentBalloonColor = null;
    }

    getState() {
        return this.state;
    }

    setState(newState, playerBalloonColor = null, opponentBalloonColor = null) {
        if (this.state === newState) {
            return;
        }

        console.log(`State changed from ${this.state} to ${newState}`);
        this.state = newState;

        if (newState === GameStates.RUNNING && playerBalloonColor) {
            this.playerBalloonColor = playerBalloonColor;
        }

        if (newState === GameStates.RUNNING && opponentBalloonColor) {
            this.opponentBalloonColor = opponentBalloonColor;
        }

        this.callbacks.forEach(callback => callback(newState));
    }

    onStateChange(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        } else {
            console.error('Callback must be a function.');
        }
    }

    handleInitialState() {
        console.log('Game is in initial state');
    }

    handleRunningState() {
        console.log('Game is running');
        
    }

    handlePausedState() {
        console.log('Game is paused');
    }

    handleGameOverState() {
        console.log('Game is over');
    }

    startGame(selectedColor) {
        this.setState(GameStates.RUNNING, selectedColor);
    }
}

export { GameStateManager, GameStates };