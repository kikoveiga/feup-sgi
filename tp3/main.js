import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';

let app = new MyApp();
app.init();

let contents = new MyContents(app, 'running');
contents.init();
app.setContents(contents);

let gui = new MyGuiInterface(app);
gui.setContents(contents);
gui.init();

app.setGui(gui);
// main animation loop - calls every 50-60 ms.
app.render()
