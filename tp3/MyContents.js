import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';
import { MyReader } from './objects/MyReader.js';
import { PickingManager } from './PickingManager.js';

class MyContents {
    constructor(app, sceneType) {
        this.app = app;
        this.sceneType = sceneType;

        this.parser = null;
        this.reader = null;

        this.myreader = new MyReader(this.app);

        this.axis = null;
    
        this.objects = [];
        this.lights = [];

        this.pickingManager = null;
        this.meshes = [];
    }

    async init() {
        console.log("Initializing contents for scene: " + this.sceneType);

        if (this.axis === null) {
            this.axis = new MyAxis(this.app);
            this.app.scene.add(this.axis);
        }

        this.parser = new MyYASFParser(this.app.scene);
        
        await new Promise((resolve, reject) => {
            this.reader = new MyFileReader(async (data) => {
                await this.onSceneLoaded(data);
                console.log("Scene loaded successfully.");
                resolve();
            });

            this.reader.open(`scenes/${this.sceneType}.json`);
        });

        switch (this.sceneType) {
            case "initial":
                this.myreader.buildMainMenu();
                this.pickingManager = new PickingManager(this.app.scene, this.app.activeCamera, this.app.renderer);
                this.meshes.forEach(mesh => {
                    if (mesh.name.includes("Button")) {
                        this.pickingManager.addInteractableObject(mesh);
                    }
                });
                    

                break;

            case "running":
                break;

            case "final":
                this.winnercolor = "pink"; // TROCAR PARA A COR DO VENCEDOR
                this.losercolor = "blue"; // TROCAR PARA A COR DO PERDEDOR
                this.winner = "joaoalvesss" // TROCAR PARA O NOME DO VENCEDOR
                this.loser = "kikoveiga" // TROCAR PARA O NOME DO PERDEDOR
                this.myreader.buildFinalMenu(this.winnercolor, this.losercolor, this.winner, this.loser);
                break;
            
            default:
                console.error("Invalid scene type: " + sceneType);
        }
    }

    clearScene() {
        console.log("Clearing current scene...");

        this.objects.forEach(obj => this.app.scene.remove(obj));
        this.objects = [];

        this.lights.forEach(light => this.app.scene.remove(light));
        this.lights = [];

        if (this.axis !== null) {
            this.app.scene.remove(this.axis);
            this.axis = null;
        }

        if (this.parser !== null) {
            this.parser = null;
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
                this.meshes.push(mesh);
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
    
    update(delta) {
        if (this.track) {
            this.track.update(delta);
        }
        this.myreader.update();
    }
    
}

export { MyContents };
