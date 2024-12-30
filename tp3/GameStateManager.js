const GameStates = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    FINAL_RESULTS: 3
};

class GameStateManager {
    constructor() {
        this.state = GameStates.INITIAL;
        this.callbacks = [];
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        if (this.state === newState) {
            return;
        }

        console.log(`State changed from ${this.state} to ${newState}`);
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