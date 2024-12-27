import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
    /**
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the gui interface
     */
    init() {
        this.cameraFolder = this.datgui.addFolder("Camera");

        this.updateCameraOptions();
        this.addWireframeToggle();
    }
    
    addWireframeToggle() {
        const settings = { wireframe: false };
    
        this.datgui.add(settings, 'wireframe')
            .name('Wireframe Mode')
            .onChange((value) => {
                if (this.contents) {
                    this.contents.toggleWireframe(value);
                }
            });
    }
    /**
     * Adds camera selection options to the GUI
     */
    updateCameraOptions() {
        if (this.cameraDropdown) {
            this.cameraDropdown.destroy();
        }
        const cameraNames = Object.keys(this.app.cameras);
        this.cameraDropdown = this.cameraFolder
            .add(this.app, 'activeCameraName', cameraNames)
            .name('Active Camera')
            .onChange((value) => {
                this.app.setActiveCamera(value);
            });
    }

    updateObjects() {

        this.objectsFolder = this.datgui.addFolder('Objects');

        const controllers = [];

        const addVisibilityController = (object, folder) => {
            const controller = folder.add(object, 'visible').name(object.name || 'Primitive');
            controllers.push(controller);

            controller.onChange((value) => {
                if (object.children) {
                    setVisibilityRecursive(object, value);
                }
            });
        };

        const setVisibilityRecursive = (object, value) => {
            object.visible = value;

            if (object.children && object.children.length > 0) {
                object.children.forEach(child => {
                    child.visible = value;
                    const childController = controllers.find(controller => controller.object === child);
                    if (childController) {
                        childController.setValue(value);
                        childController.updateDisplay();
                    }
                    setVisibilityRecursive(child, value);
                });
            }
        }

        const addSubfoldersForChildren = (object, folder) => {
            if (object.children && object.children.length > 0) {
                const subfolder = folder.addFolder(object.name);
                addVisibilitiesThenSubfolders(object.children, subfolder);

                subfolder.close();
            }
        }

        function addVisibilitiesThenSubfolders(object, folder) {

            object.forEach(child => {
                addVisibilityController(child, folder);
            });

            object.forEach(child => {
                addSubfoldersForChildren(child, folder);
            });
        };

        if (this.contents && this.contents.objects) {
            addVisibilitiesThenSubfolders(this.contents.objects, this.objectsFolder);
        }

        this.objectsFolder.close();
        // console.log(this.contents);
    }

    /**
     * Adds light selection options to the GUI
     */
    updateLights() {
        
        this.lightsFolder = this.datgui.addFolder('Lights');
        this.contents.lights.forEach(light => {
            // console.log(light);
            this.lightsFolder.add(light, 'intensity', 0, light.intensity*2).name(light.name || 'Light');
        });

        this.lightsFolder.close();
    }
        
}

export { MyGuiInterface };
