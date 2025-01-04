import * as THREE from 'three';
import { MyReader } from '../../objects/MyReader.js';
import { MyShader } from '../../objects/MyShader.js';
import { MyObstacle } from '../../objects/MyObstacle.js';
import { MyPowerUp } from '../../objects/MyPowerUp.js';

class RunningState {
    constructor(app, gameStateManager, interactableObjects) {
        this.app = app;
        this.gameStateManager = gameStateManager;
        this.interactableObjects = interactableObjects;

        this.myReader = null;
        this.track = null;
        this.powerups = [];
        this.obstacles = [];
        this.shaders = [];

        this.windLayers = [
            { direction: new THREE.Vector3(0, 0, 0), speed: 0 },
            { direction: new THREE.Vector3(0, 0, -1), speed: 5 },
            { direction: new THREE.Vector3(0, 0, 1), speed: 5 },
            { direction: new THREE.Vector3(1, 0, 0), speed: 5 },
            { direction: new THREE.Vector3(-1, 0, 0), speed: 5 },
        ];

        this.keyStates = {};
        this.paused = false;
        
        window.addEventListener('keydown', (event) => {
            this.keyStates[event.code] = true;

            if (event.code === 'Space') {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (event) => {
            this.keyStates[event.code] = false;
        });
    }

    togglePause() {
        this.paused = !this.paused;
    }

    init() {

        console.log("Building running state...");

        this.buildOutdoorDisplay();

        this.myReader = new MyReader(this.app, this.gameStateManager.playerBalloonColor, this.gameStateManager.opponentBalloonColor);
        this.powerups = this.myReader.getPowerUps();
        this.obstacles = this.myReader.getObstacles();

        const obstacleTexture = new THREE.TextureLoader().load('./images/obstacle.jpg');
        const powerupTexture = new THREE.TextureLoader().load('./images/powerup.jpg');
        const depthTexture = new THREE.TextureLoader().load('./images/depth.jpg'); 
        const colorTexture = new THREE.TextureLoader().load('./images/color.jpg');

        this.shaders = [
            new MyShader(this.app, "Pulse shader for obstacle", "Description 1", "./shaders/pulse.vert", "./shaders/pulse.frag", {
                    timeFactor: {type: 'f', value: 0.8 },
                    uSampler: {type: 'sampler2D', value: obstacleTexture }
            }),

            new MyShader(this.app, "Pulse shader for powerup", "Description 2", "./shaders/pulse.vert", "./shaders/pulse.frag", {
                timeFactor: {type: 'f', value: 0.8 },
                uSampler: {type: 'sampler2D', value: powerupTexture }
            }),

            new MyShader(this.app, "Basrelief", "Bas-relief effect", "./shaders/basrelief.vert", "./shaders/basrelief.frag", {
                  uSampler1: { type: 'sampler2D', value: colorTexture }, 
                  uSampler2: { type: 'sampler2D', value: depthTexture }, 
                  scaleFactor: { type: 'f', value: 2.5 }
                }
            )
              
        ];
    
        this.waitForShaders();
    }

    buildOutdoorDisplay() {
        this.elapsedTimeMesh = this.createTextMesh("Elapsed time: ", 230, 175, 70, 0xffffff);
        this.elapsedTimeMesh.scale.set(12, 12, 12);
        this.elapsedTimeMesh.rotation.y = 120 * Math.PI / 180;

        this.lapsNumberMesh = this.createTextMesh("Completed Laps: ", 230, 155, 70, 0xffffff);
        this.lapsNumberMesh.scale.set(12, 12, 12);
        this.lapsNumberMesh.rotation.y = 120 * Math.PI / 180;

        this.layerMesh = this.createTextMesh("Current Air Layer: ", 230, 135, 70, 0xffffff);
        this.layerMesh.scale.set(12, 12, 12);
        this.layerMesh.rotation.y = 120 * Math.PI / 180;

        this.avaiableVouchersMesh = this.createTextMesh("Avaiable Vouchers: ", 230, 115, 70, 0xffffff);
        this.avaiableVouchersMesh.scale.set(12, 12, 12);
        this.avaiableVouchersMesh.rotation.y = 120 * Math.PI / 180;

        this.gameStatusMesh = this.createTextMesh("Game Status: ", 230, 95, 70, 0xffffff);
        this.gameStatusMesh.scale.set(12, 12, 12);
        this.gameStatusMesh.rotation.y = 120 * Math.PI / 180;

        this.app.scene.add(this.elapsedTimeMesh);
        this.app.scene.add(this.lapsNumberMesh);
        this.app.scene.add(this.avaiableVouchersMesh);
        this.app.scene.add(this.gameStatusMesh);
        this.app.scene.add(this.layerMesh);


        this.group = new THREE.Group();

        const ironTexture = new THREE.TextureLoader().load('./images/iron.jpg');
        const legMaterial = new THREE.MeshPhysicalMaterial({
            map: ironTexture,            
            color: "#808080",           
            roughness: 0.3,              
            metalness: 0.6,              
            bumpMap: ironTexture,        
            bumpScale: 0.02,             
            reflectivity: 0.7,          
        });

        const planeMaterial = new THREE.MeshPhysicalMaterial({
            map: ironTexture,           
            color: "#dddddd",           
            roughness: 0.5,              
            metalness: 0.2,            
            bumpMap: ironTexture,        
            bumpScale: 0.02,             
            reflectivity: 0.5,           
        });

        const geometry = new THREE.PlaneGeometry(50, 30, 100, 100);

        this.outdoorDisplay = new THREE.Mesh(geometry);
        this.outdoorDisplay.scale.set(1.2, 1.2, 1.2);
        this.outdoorDisplay.position.set(0, 42.5, -2.35);
        this.outdoorDisplay.rotation.y = -Math.PI;
        
        const cylinderGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 30, 32 );
        const cylinder1 = new THREE.Mesh(cylinderGeometry, legMaterial);
        cylinder1.position.set(-20, 15, 0);
        cylinder1.scale.set(2.0, 1.0, 2.0);

        const cylinder2 = new THREE.Mesh(cylinderGeometry, legMaterial);
        cylinder2.position.set(20, 15, 0);
        cylinder2.scale.set(2.0, 1.0, 2.0);

        const boxGeometry = new THREE.BoxGeometry( 50, 30, 2 );
        const box = new THREE.Mesh(boxGeometry, planeMaterial);
        box.position.set(0, 42.5, 0);
        box.scale.set(1.2, 1.2, 1.2);

        this.group.add(box);
        this.group.add(cylinder1);
        this.group.add(cylinder2);
        this.group.add(this.outdoorDisplay);
        this.group.scale.set(2.7, 2.7, 2.7);
        this.group.position.set(-180, 0, 210);
        this.group.rotation.y = - 30 * Math.PI / 180;
        this.app.scene.add(this.group);
    }

    waitForShaders() {
        for (const shader of this.shaders) {
            if (!shader.ready) {
                setTimeout(this.waitForShaders.bind(this), 100);
                return;
            }
        }
    
        for (const obstacle of this.obstacles) {
            if (obstacle instanceof MyObstacle) {
                this.setCurrentShader(this.shaders[0], obstacle.obstacle);
            } else {
                console.error("Invalid obstacle object");
            }
        }
    
        for (const powerup of this.powerups) {
            if (powerup instanceof MyPowerUp) {
                this.setCurrentShader(this.shaders[1], powerup.powerup);
            } else {
                console.error("Invalid powerup object");
            }
        }

        this.setCurrentShader(this.shaders[2], this.outdoorDisplay);
    }
    
    setCurrentShader(shader, selectedObject) {
        if (shader === null || shader === undefined) {
            console.error("shader is null or undefined")
            return
        }

        if (selectedObject instanceof THREE.Mesh) {
            selectedObject.material = shader.material;
            selectedObject.material.needsUpdate = true;
            // console.log("Shader set to object");
        } else {
            console.error("Selected object is not a valid THREE.Mesh");
        }
        
    }

    update(delta) {
        if (!this.myReader || this.paused) {
            return;
        }

        if (this.keyStates["KeyW"]) {
            this.myReader.playerBalloon.updateAltitude(delta, 1);
        }
        if (this.keyStates["KeyS"]) {
            this.myReader.playerBalloon.updateAltitude(delta, -1);
        }

        this.myReader.playerBalloon.update(delta, this.windLayers);

        this.myReader.track.update(delta);
        
        const elapsedTime = this.app.clock.getElapsedTime();
        for (const shader of this.shaders) {
            // console.log("Shader:", shader);
            if (shader && shader.hasUniform("timeFactor")) {
                shader.updateUniformsValue("timeFactor", elapsedTime);
            }
        }            

        this.myReader.update();
    }

    createTextMesh(text, x, y, z, color) {
        const texture = new THREE.TextureLoader().load("./images/font.png");
        
        const meshes = [];
        let offset = 0;
        
        for (let i = 0; i < text.length; i++) {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                color: color
            });

            const charCode = text.charCodeAt(i) % 256;
            const cols = 16;
            const rows = 16;
            
            const u = (charCode % (cols * rows)) % cols * (1 / cols);
            const v = Math.floor((charCode % (cols * rows)) / cols) * (1 / rows);
    
            const mesh = new THREE.Mesh(geometry, material);
            const originalUV = geometry.getAttribute('uv').clone();

            originalUV.set([
                u,         1 - v - 1/rows,
                u + 1/cols,1 - v - 1/rows,
                u,         1 - v,
                u + 1/cols,1 - v
            ]);
            geometry.setAttribute('uv', originalUV);
            
            mesh.position.x = offset;
            offset += 0.65; // looks good

            meshes.push(mesh);
        }

        const group = new THREE.Group();
        meshes.forEach(mesh => group.add(mesh));
        group.position.set(x, y, z);
        group.rotation.x = -Math.PI;
        group.rotation.y = -Math.PI;
        return group;
    }
}

export { RunningState };
