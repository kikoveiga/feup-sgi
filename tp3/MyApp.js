
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null;
        this.stats = null;

        // camera related attributes
        this.activeCamera = null;
        this.activeCameraName = null;
        this.lastActiveCameraName = null;
        this.cameras = {};

        // other attributes
        this.renderer = null;
        this.controls = null;
        this.gui = null;
        this.contents = null;

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

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias:true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        
        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        const canvasContainer = document.getElementById('canvas');
        if (!canvasContainer) {
            console.error('Canvas container not found.');
            return;
        }

        canvasContainer.appendChild(this.renderer.domElement);

        this.setActiveCamera('DefaultCamera');

        this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.update();

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        const defaultCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        defaultCamera.position.set(10, 10, 3);    
        this.cameras['DefaultCamera'] = defaultCamera;

        this.activeCamera = defaultCamera;
        this.activeCameraName = 'DefaultCamera';
    }
    
    setActiveCamera(cameraName) {
        if (this.cameras[cameraName]) {
            this.lastActiveCameraName = this.activeCameraName;
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

        if (this.activeCamera) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
        }

        this.updateControls();
    }

    updateControls() {
        if (this.controls) this.controls.dispose();

        if (this.activeCameraName !== "FirstPersonCamera") {
        
            this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
            this.controls.enableZoom = true;
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
    }
    
    onResize() {
        if (this.activeCamera && this.renderer) {
            if (this.activeCamera.isPerspectiveCamera) {
                this.activeCamera.aspect = window.innerWidth / window.innerHeight;
                this.activeCamera.updateProjectionMatrix();
            }
            this.renderer.setSize(window.innerWidth, window.innerHeight);
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
        this.gui = gui;
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render() {
        this.stats.begin();

        const delta = this.clock.getDelta();

        if (this.activeScene) {
            this.activeScene.update(delta);
            this.activeScene.render();
        }

        if (this.contents) this.contents.update(delta);
        

        if (this.controls instanceof OrbitControls) this.controls.update();
        

        if (this.activeCamera) this.renderer.render(this.scene, this.activeCamera);

        this.stats.end();
        requestAnimationFrame(this.render.bind(this));
    }
}


export { MyApp };