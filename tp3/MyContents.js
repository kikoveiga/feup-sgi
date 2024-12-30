import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';
import { MyBalloon } from './objects/MyBalloon.js';
import { MyTrack } from './objects/MyTrack.js';
import { MyReader } from './objects/MyReader.js';

class MyContents {
    constructor(app) {
        this.app = app
        this.axis = null

        this.parser = new MyYASFParser(this.app.scene);
        this.myreader = new MyReader(this.app);

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/scene.json");

        // this.objects = [];
        this.lights = [];

        this.track = null;
    }

    buildTrack() {
        this.textMesh = this.myreader.createTextMesh("Come work lil n bird", 0, 100, 0, 0x0000ff);
        this.textMesh.scale.set(10, 10, 10);
        this.app.scene.add(this.textMesh);
        // this.objects.push(this.textMesh);
        this.balloon = new MyBalloon(this.app);
        this.track = new MyTrack(this.app);
        this.track.position.set(35, 5, 0);   
        this.track.scale.set(35, 35, 35);
        this.balloon.scale.set(35, 35, 35);
        this.balloon.position.set(-250, 150, -250);
        this.app.scene.add(this.track);
        this.app.scene.add(this.balloon);
        // this.objects.push(this.balloon);
        // this.objects.push(this.track);
    }    

    init() {

        if (this.axis === null) {
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        this.buildTrack();

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
                this.lights.push(light);
            });
            this.app.gui.updateLights();
        }
    }

    addObjects() {
        if (this.parser.objects) {
            const root = this.parser.objects[this.parser.rootid];

            if (root) {
            
                this.app.scene.add(root);
                // this.objects.push(root);

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
