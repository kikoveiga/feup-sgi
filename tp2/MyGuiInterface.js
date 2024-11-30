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
        this.lightsFolder = this.datgui.addFolder('Lights');

        this.updateCameraOptions();

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
            const controller = folder.add(object, 'visible').name(object.name);
            controllers.push(controller);
        };

        const addSubfoldersForChildren = (object, folder) => {
            if (object.children) {
                const childFolder = folder.addFolder(object.name);

                object.children.forEach(child => {
                    addVisibilityController(child, childFolder);
                });

                object.children.forEach(child => {
                    addSubfoldersForChildren(child, childFolder);
                });

                childFolder.close();
            }
        }

        const sceneController = this.objectsFolder.add(this.contents.objects[0], 'visible').name('Scene');
        controllers.push(sceneController);

        sceneController.onChange((value) => {
            this.contents.objects[0].visible = value;
            this.contents.objects[0].children.forEach(child => {
                child.visible = value;
            });
        });
        
        const sceneFolder = this.objectsFolder.addFolder('Scene');

        this.contents.objects[0].children.forEach(child => {
            addVisibilityController(child, sceneFolder);
        });
        
        this.contents.objects[0].children.forEach(child => {
            addSubfoldersForChildren(child, sceneFolder);
        });

        sceneFolder.close();

        this.objectsFolder.close();
    }
        
}

export { MyGuiInterface };
