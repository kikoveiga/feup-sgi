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
                    timeFactor: {type: 'f', value: 1.0 },
                    uSampler: {type: 'sampler2D', value: obstacleTexture }
            }),

            new MyShader(this.app, "Pulse shader for powerup", "Description 2", "./shaders/pulse.vert", "./shaders/pulse.frag", {
                timeFactor: {type: 'f', value: 1.0 },
                uSampler: {type: 'sampler2D', value: powerupTexture }
            }),

            new MyShader(
                this.app, "Bas-Relief Shader", "Bas-relief effect", "./shaders/basrelief.vert","./shaders/basrelief.frag", {
                    depthMap: { type: 'sampler2D', value: depthTexture },
                    colorMap: { type: 'sampler2D', value: colorTexture },
                 scaleFactor: { type: 'f', value: 0.1 },
            }),
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
                // console.log("Shader applied to obstacle");
            } else {
                console.error("Invalid obstacle object");
            }
        }
    
        for (const powerup of this.powerups) {
            if (powerup instanceof MyPowerUp) {
                this.setCurrentShader(this.shaders[1], powerup.powerup);
                // console.log("Shader applied to powerup");
            } else {
                console.error("Invalid powerup object");
            }
        }
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
        if (!this.myReader) {
            return;
        }

        this.myReader.track.update(delta);
        
        let t = this.app.clock.getElapsedTime();
        for (const shader of this.shaders) {
            // console.log("Shader:", shader);
            if (shader && shader.hasUniform("timeFactor")) {
                shader.updateUniformsValue("timeFactor", t);
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
