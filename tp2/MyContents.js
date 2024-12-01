import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null

        this.parser = new MyYASFParser(this.app.scene);


        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/demo/demo.json");

        this.objects = [];
        this.lights = [];
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    async onSceneLoaded(data) {
        console.info("YASF loaded.")

        await this.parser.parse(data);
        this.addGlobals();
        this.addCameras();
        this.addLights();
        this.addObjects();

        // this.onAfterSceneLoadedAndBeforeRender(data)
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
                this.objects.push(root);

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
    
    update() {
    }
}

export { MyContents };
