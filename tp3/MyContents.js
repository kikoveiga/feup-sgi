import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';
import { GameStates } from './GameStateManager.js';
import { MyInitialScene } from './scenes/initial/MyInitialScene.js';
import { MyRunningScene } from './scenes/running/MyRunningScene.js';
import { MyFinalScene } from './scenes/final/MyFinalScene.js';

class MyContents {
    constructor(app, gameStateManager) {
        this.app = app;
        this.gameStateManager = gameStateManager;

        this.myScene = null;
        this.gameStateManager.onStateChange(this.switchMyScene.bind(this));

        this.parser = null;
        this.reader = null;

        this.axis = null;
    
        this.objects = [];
        this.lights = [];
        this.meshes = [];
    }

    async switchMyScene(newState) {

        if (this.myScene) this.cleanUp();

        if (this.axis === null) {
            // this.axis = new MyAxis(this.app);
            // this.app.scene.add(this.axis);
        }

        this.parser = new MyYASFParser();
        
        await new Promise((resolve, reject) => {
            this.reader = new MyFileReader(async (data) => {
                await this.onSceneLoaded(data);
                console.log("Scene loaded successfully.");
                resolve();
            });

            this.reader.open(`scenes/${newState}/${newState}.json`);
        });

        switch (newState) {
            case GameStates.INITIAL:
                this.myScene = new MyInitialScene(this.app, this.gameStateManager, this.meshes);
                this.myScene.init();
                break;

            case GameStates.RUNNING:
                this.myScene = new MyRunningScene(this.app, this.gameStateManager);
                this.myScene.setFinishLine(this.objects[0].children[0]);
                this.myScene.init();
                break;

            case GameStates.FINAL:
                this.myScene = new MyFinalScene(this.app, this.gameStateManager, this.meshes);
                this.myScene.init();
                break;
            
            default:
                console.error("Invalid game state: ", newState);
        }

        this.myScene.objects.forEach(object => { this.objects.push(object); });
        this.app.gui.updateObjects();
    }

    cleanUp() {

        this.objects = [];
        this.lights = [];

        this.meshes = [];

        this.parser = null;
        this.reader = null;

        this.app.restartScene();
    }

    update(delta) {
        if (this.myScene) {
            this.myScene.update(delta);
        }
    }

    async onSceneLoaded(data) {

        await this.parser.parse(data);

        this.addGlobals();
        this.addCameras();
        this.addLights();
        this.addObjects();

        console.info("YASF parsed and loaded.");
    }
    
    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.printYASF(data)
    }

    addGlobals() {

        if (this.parser.globals.background) {
            this.app.scene.background = this.parser.globals.background;
        }

        if (this.parser.globals.ambient) {
            this.app.scene.add(this.parser.globals.ambient);
        }

        if (this.parser.globals.fog) {
            this.app.scene.fog = this.parser.globals.fog;
        }

        if (this.parser.globals.skybox) {
            this.app.scene.add(this.parser.globals.skybox);
        }
    }

    addCameras() {
        this.app.cameras = this.parser.cameras;
        this.app.setActiveCamera(this.parser.initialCameraName || Object.keys(this.app.cameras)[0]);

        this.app.gui.updateCameraOptions(); 
    }
    
    addLights() {
        if (this.parser.lights) {
            this.parser.lights.forEach(light => {
                this.app.scene.add(light);

            });
            this.app.gui.updateLights();
        }
    }

    addObjects() {
        if (this.parser.objects) {

            const root = this.parser.objects[this.parser.rootid];

            if (root) {
                this.app.scene.add(root);
                this.objects.push(root);
            }  
        }

        if (this.parser.meshes) {
            this.parser.meshes.forEach(mesh => {
                if (mesh.name.includes("Button")) {
                    this.meshes.push(mesh);
                }
            });
        }
    }

    toggleWireframe(enableWireframe) {
        this.app.scene.traverse(node => {
            if (node.isMesh && node.material) {
                if (Array.isArray(node.material)) {
                    node.material.forEach(material => {
                        material.wireframe = enableWireframe;
                        material.needsUpdate = true;
                    });
                } else {
                    node.material.wireframe = enableWireframe;
                    node.material.needsUpdate = true;
                }
            }
        });
    }    
}

export { MyContents };
