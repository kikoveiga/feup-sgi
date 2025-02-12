import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app;
        this.datgui =  new GUI();
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
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective 2', 'Left', 'Top', 'Front', 'Back', 'Right' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord");
 
        const objectsFolder = this.datgui.addFolder('Objects');

        const toggleVisibility = {
            visible: true,
        }

        const controllers = [];

        objectsFolder.add(toggleVisibility, 'visible').name('ALL').onChange((value) => {
            if (this.contents && this.contents.objects) {
                this.contents.objects.forEach((object, index) => {
                    object.visible = value;
                    controllers[index].updateDisplay();
                });
            }
        });

        console.log(this.contents);

        if (this.contents && this.contents.objects) {
            this.contents.objects.forEach((object) => {
                const controller = objectsFolder.add(object, 'visible').name(object.name);
                controllers.push(controller);
            });
        }

        objectsFolder.close();
    }
}

export { MyGuiInterface };