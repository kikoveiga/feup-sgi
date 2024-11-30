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

        const toggleVisibility = {
            visible: true,
        }

        const controllers = [];

        this.objectsFolder.add(toggleVisibility, 'visible').name('ALL').onChange((value) => {
            if (this.contents && this.contents.objects) {
                this.contents.objects.forEach((object, index) => {
                    object.visible = value;
                    controllers[index].updateDisplay();
                });
            }
        });

        if (this.contents && this.contents.objects) {
            this.contents.objects.forEach( object => {
                const controller = this.objectsFolder.add(object, 'visible').name(object.name);
                controllers.push(controller);
            });
        }

        this.objectsFolder.close();
    }
        
}

export { MyGuiInterface };
