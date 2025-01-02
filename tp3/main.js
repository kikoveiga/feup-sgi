import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';

async function main() {

    let app = new MyApp();
    app.init();

    let gui = new MyGuiInterface(app);
    app.setGui(gui);

    let contents = new MyContents(app, 'initial');
    gui.setContents(contents);
    gui.init();

    await contents.init();
    app.setContents(contents);

    // main animation loop - calls every 50-60 ms.
    app.render();
}

main();

