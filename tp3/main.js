import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';
import { GameStateManager, GameStates } from './GameStateManager.js';

async function main() {

    const app = new MyApp();
    app.init();

    const gameStateManager = new GameStateManager();
    const contents = new MyContents(app, gameStateManager);
    app.setContents(contents);


    const gui = new MyGuiInterface(app);
    gui.setContents(contents);
    gui.init();

    app.setGui(gui);

    gameStateManager.setState(GameStates.RUNNING);

    // main animation loop - calls every 50-60 ms.
    app.render();
}

main();

