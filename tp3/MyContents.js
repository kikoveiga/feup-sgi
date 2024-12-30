import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';
import { MyBalloon } from './objects/MyBalloon.js';
import { MyTrack } from './objects/MyTrack.js';
import { MyReader } from './objects/MyReader.js';

class MyContents {
    constructor(app, sceneType) {
        this.app = app;
        this.sceneType = sceneType;

        this.parser = new MyYASFParser(this.app.scene);
        this.myreader = new MyReader(this.app);

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/scene.json");

        this.axis = null;

        this.parser = null;
        this.reader = null;
        
        this.objects = [];
        this.lights = [];

        this.track = null;
        this.balloon = null;
        this.balloon1 = null;
        this.balloon2 = null;
    }

    async loadScene(jsonFile) {
        console.log(`Loading scene from ${jsonFile}`);

        this.parser = new MyYASFParser(this.app.scene);
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open(`scenes/${jsonFile}.json`);
    }
    
    buildBalloonsPickings() {
        this.balloon1 = new MyBalloon(this.app, "Balloon1");
        this.balloon2 = new MyBalloon(this.app, "Balloon2");

        this.app.scene.add(this.balloon1);
        this.app.scene.add(this.balloon2);
    }

    async init() {
        console.log("Initializing contents for scene: " + this.sceneType);

        this.clearScene();

        if (this.axis === null) {
            this.axis = new MyAxis(this.app);
            this.app.scene.add(this.axis);
        }

        switch (this.sceneType) {
            case "initial":
                await this.loadScene("initial");
                this.buildBalloonsPickings();
                break;

            case "running":
                await this.loadScene("scene");
                this.myreader.buildTrack();
                break;

            case "final_results":
                await this.loadScene("final_results");
                break;
            
            default:
                console.error("Invalid scene type: " + sceneType);
        }

        this.myreader.buildTrack();
        this.buildBalloonsPickings();
    }

    clearScene() {
        console.log("Clearing current scene...");

        this.objects.forEach(obj => this.app.scene.remove(obj));
        this.objects = [];

        this.lights.forEach(light => this.app.scene.remove(light));
        this.lights = [];

        this.track = null;
        this.balloon = null;
        this.balloon1 = null;
        this.balloon2 = null;

        if (this.axis !== null) {
            this.app.scene.remove(this.axis);
            this.axis = null;
        }

        if (this.parser !== null) {
            this.parser = null;
        }
    }


    async onSceneLoaded(data) {
        console.info("YASF loaded.")

        await this.parser.parse(data);
        this.addGlobals();
        this.addCameras();
        this.addLights();
        this.addObjects();

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
                this.app.gui.updateObjects();
            }  
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
    
    update(delta) {
        if (this.track) {
            this.track.update(delta);
        }
    }
    
}

export { MyContents };
