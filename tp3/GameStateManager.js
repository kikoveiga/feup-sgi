const GameStates = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    GAME_OVER: 3
};

class GameStateManager {
    constructor() {
        this.state = GameStates.INITIAL;
        this.handlers = {
            [GameStates.INITIAL]: this.handleInitialState.bind(this),
            [GameStates.RUNNING]: this.handleRunningState.bind(this),
            [GameStates.PAUSED]: this.handlePausedState.bind(this),
            [GameStates.GAME_OVER]: this.handleGameOverState.bind(this)
        };
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
        this.handlers[this.state]();
    }
    
}