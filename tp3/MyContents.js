import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';
import { MyReader } from './objects/MyReader.js';
import { PickingManager } from './PickingManager.js';
import { GameStates } from './GameStateManager.js';
import { MyBalloon } from './objects/MyBalloon.js';
import { MyFirework } from './objects/MyFirework.js';
import { MyShader } from './objects/MyShader.js';
import { MyPowerUp } from './objects/MyPowerUp.js';
import { MyObstacle } from './objects/MyObstacle.js';
import { InitialState } from './scenes/initial/InitialState.js';
import { RunningState } from './scenes/running/RunningState.js';
import { FinalState } from './scenes/final/FinalState.js';

class MyContents {
    constructor(app, gameStateManager) {
        this.app = app;
        this.gameStateManager = gameStateManager;

        this.state = null;
        this.gameStateManager.onStateChange(this.switchState.bind(this));

        this.parser = null;
        this.reader = null;

        this.axis = null;
    
        this.objects = [];
        this.lights = [];
        this.meshes = [];
    }

    async switchState(newState) {

        if (this.state) this.cleanUp();

        console.log("Initializing contents for scene: " + newState);

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

            this.reader.open(`scenes/${newState}/${newState}.json`);
        });

        switch (newState) {
            case GameStates.INITIAL:
                this.state = new InitialState(this.app, this.gameStateManager, this.meshes);
                await this.state.init();
                break;

            case GameStates.RUNNING:
                this.state = new RunningState(this.app, this.gameStateManager, this.meshes);
                this.state.init();
                break;

            case GameStates.FINAL:
                this.state = new FinalState(this.app, this.gameStateManager);
                
                break;
            
            default:
                console.error("Invalid scene type: " + state);
        }
    }

    cleanUp() {
        console.log("Cleaning up MyContents...");

        this.objects.forEach(obj => {
            if (obj) {
                this.app.scene.remove(obj);

                obj.traverse(child => {
                    if (child.isMesh) {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => { mat.dispose(); });
                            } else child.material.dispose();
                        }
                    }
                });
            }
        }); 

        this.objects = [];

        this.lights.forEach(light => {
            if (light) {
                this.app.scene.remove(light);
                if (light.dispose) light.dispose();
            }
        });
        this.lights = [];

        this.meshes.forEach(mesh => {
            if (mesh) {
                this.app.scene.remove(mesh);

                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(mat => { mat.dispose(); });
                    } else mesh.material.dispose();
                }
            }
        });
        this.meshes = [];

        if (this.axis) {
            this.app.scene.remove(this.axis);
            this.axis = null;
        }

        this.parser = null;
        this.reader = null;
    }

    update(delta) {
        if (this.state) {
            this.state.update(delta);
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
}

export { MyContents };
