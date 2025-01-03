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
        this.selectedColor = null;
    }

    getState() {
        return this.state;
    }

    setState(newState, selectedColor = null) {
        if (this.state === newState) {
            return;
        }

        console.log(`State changed from ${this.state} to ${newState}`);
        this.state = newState;

        if (newState === GameStates.RUNNING && selectedColor) {
            this.selectedColor = selectedColor;
            console.log("Game started with color: ", selectedColor);
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

    startGame() {
        this.setState(GameStates.RUNNING);
    }

}

export { GameStateManager, GameStates };