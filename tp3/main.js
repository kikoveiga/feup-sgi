import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';
import { GameStateManager, GameStates } from './GameStateManager.js';

async function main() {

    const app = new MyApp();
    app.init();

    const gameStateManager = new GameStateManager();

    const gui = new MyGuiInterface(app);
    app.setGui(gui);

    const contents = new MyContents(app, GameStates.INITIAL, gameStateManager);
    gui.setContents(contents);
    gui.init();

    await contents.init();
    app.setContents(contents);
    
    gameStateManager.onStateChange(async (newState) => {
        console.log("Switching state to: ", newState);

        const newContents = new MyContents(app, newState, gameStateManager);
        await newContents.init();
        app.setContents(newContents);
        gui.setContents(newContents);
    });

    // main animation loop - calls every 50-60 ms.
    app.render();
}

main();

