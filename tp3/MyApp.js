
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = {}
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null

        this.clock = new THREE.Clock();
    }
    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('TemporaryCamera'); 

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        
        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );



        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.update();

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;
        this.activeCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.activeCamera.position.set(10, 10, 3);
        this.activeCameraName = 'TemporaryCamera';
    
        this.cameras['TemporaryCamera'] = this.activeCamera;
    }
    

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {
        if (this.cameras[cameraName]) {
            this.activeCameraName = cameraName;
            this.activeCamera = this.cameras[this.activeCameraName];
        } else {
            console.error(`Camera "${cameraName}" not found.`);
            const cameraNames = Object.keys(this.cameras);
            if (cameraNames.length > 0) {
                this.activeCameraName = cameraNames[0];
                this.activeCamera = this.cameras[this.activeCameraName];
            } else {
                console.error('No cameras available.');
                this.activeCamera = null;
            }
        }
    }
      

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName];
    
            if (!this.activeCamera) {
                console.error(`Camera "${this.activeCameraName}" not found.`);
                return;
            }
    
            document.getElementById("camera").innerHTML = this.activeCameraName;
    
            this.onResize();
    
            if (this.controls) {
                this.controls.dispose();
            }
    
            this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
            this.controls.enableZoom = true;
    
            if (this.activeCamera.userData && this.activeCamera.userData.target) {
                this.controls.target.copy(this.activeCamera.userData.target);
            } 
            else {
                this.controls.target.set(0, 0, 0);
            }
    
            this.controls.update();
        }
    }
    
    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        const delta = this.clock.getDelta();

        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update(delta);
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };