import * as THREE from 'three';
import { MyReader } from '../../objects/MyReader.js';
import { MyShader } from '../../objects/MyShader.js';
import { MyObstacle } from '../../objects/MyObstacle.js';
import { MyPowerUp } from '../../objects/MyPowerUp.js';

class RunningState {
    constructor(app, gameStateManager) {
        this.app = app;
        this.gameStateManager = gameStateManager;

        this.myReader = null;
        this.track = null;
        this.powerups = [];
        this.obstacles = [];
        this.shaders = [];

        this.windLayers = [
            { direction: new THREE.Vector3(0, 0, 0), speed: 0 },
            { direction: new THREE.Vector3(0, 0, -1), speed: 2 },
            { direction: new THREE.Vector3(0, 0, 1), speed: 2 },
            { direction: new THREE.Vector3(1, 0, 0), speed: 2 },
            { direction: new THREE.Vector3(-1, 0, 0), speed: 2 },
        ];

        this.keyStates = {};
        this.paused = false;
        this.pauseTime = 0;
        this.shaderElapsedTime = 0;
        
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

        if (this.paused) {
            this.myReader.pause();
            this.pauseTime = this.app.clock.getElapsedTime();
        } else {
            this.myReader.resume();
            const resumeTime = this.app.clock.getElapsedTime();
            this.timeOffset = resumeTime - this.pauseTime;
            this.shaderElapsedTime += this.timeOffset;
        }
    }

    init() {

        console.log("Building running state...");

        this.buildOutdoorDisplay();

        this.myReader = new MyReader(this.app, this.gameStateManager.player.balloonColor, this.gameStateManager.opponent.balloonColor);
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

    buildOutdoorDisplay() { // 200 140 -> 400 170. scale 3.2 -> 4.0
        this.elapsedTimeMesh = this.createTextMesh("Elapsed time: ", 430, 215, 80, 0xffffff);
        this.elapsedTimeMesh.scale.set(15, 15, 15);
        this.elapsedTimeMesh.rotation.y = 120 * Math.PI / 180;

        this.elapsedTime = this.createTextMesh("0", 360, 215, 200, 0xffffff); // pos primeira linha
        this.elapsedTime.scale.set(15, 15, 15);
        this.elapsedTime.rotation.y = 120 * Math.PI / 180;

        this.lapsNumberMesh = this.createTextMesh("Completed Laps: ", 430, 195, 80, 0xffffff);
        this.lapsNumberMesh.scale.set(15, 15, 15);
        this.lapsNumberMesh.rotation.y = 120 * Math.PI / 180;

        this.segundalinha = this.createTextMesh("0", 350, 195, 210, 0xffffff); // pos segunda linha
        this.segundalinha.scale.set(15, 15, 15);
        this.segundalinha.rotation.y = 120 * Math.PI / 180;

        this.layerMesh = this.createTextMesh("Current Air Layer: ", 430, 175, 80, 0xffffff);
        this.layerMesh.scale.set(15, 15, 15);
        this.layerMesh.rotation.y = 120 * Math.PI / 180;

        this.terceiralinha = this.createTextMesh("0", 340, 175, 235, 0xffffff); // pos terceira linha
        this.terceiralinha.scale.set(15, 15, 15);
        this.terceiralinha.rotation.y = 120 * Math.PI / 180;

        this.avaiableVouchersMesh = this.createTextMesh("Avaiable Vouchers: ", 430, 155, 80, 0xffffff);
        this.avaiableVouchersMesh.scale.set(15, 15, 15);
        this.avaiableVouchersMesh.rotation.y = 120 * Math.PI / 180;

        this.quartalinha = this.createTextMesh("0", 340, 155, 235, 0xffffff); // pos quarta linha
        this.quartalinha.scale.set(15, 15, 15);
        this.quartalinha.rotation.y = 120 * Math.PI / 180;

        this.gameStatusMesh = this.createTextMesh("Game Status: ", 430, 135, 80, 0xffffff);
        this.gameStatusMesh.scale.set(15, 15, 15);;
        this.gameStatusMesh.rotation.y = 120 * Math.PI / 180;

        this.ultimalinha = this.createTextMesh("running", 370, 135, 185, 0xffffff); // pos ultima linha
        this.ultimalinha.scale.set(15, 15, 15);
        this.ultimalinha.rotation.y = 120 * Math.PI / 180;

        this.app.scene.add(this.elapsedTimeMesh);
        this.app.scene.add(this.elapsedTime);
        this.app.scene.add(this.lapsNumberMesh);
        this.app.scene.add(this.avaiableVouchersMesh);
        this.app.scene.add(this.gameStatusMesh);
        this.app.scene.add(this.layerMesh);
        this.app.scene.add(this.segundalinha);
        this.app.scene.add(this.ultimalinha);
        this.app.scene.add(this.terceiralinha);
        this.app.scene.add(this.quartalinha);


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
        this.group.scale.set(3.2, 3.2, 3.2);
        this.group.position.set(-300, 0, 0);
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

        if (this.timeOffset) {
            delta -= this.timeOffset;
            this.timeOffset = 0;
        }

        console.log("Updating running state...");

        const elapsedTimeText = this.app.clock.getElapsedTime().toFixed(0);
        this.updateTextMesh(this.elapsedTimeMesh, "Elapsed time: " + elapsedTimeText, 0xffffff);

        if (this.keyStates["KeyW"]) {
            this.myReader.playerBalloon.updateAltitude(delta, 1);
        }
        if (this.keyStates["KeyS"]) {
            this.myReader.playerBalloon.updateAltitude(delta, -1);
        }

        this.myReader.playerBalloon.update(delta, this.windLayers);
        this.myReader.track.update(delta);
        
        this.shaderElapsedTime += delta;
        for (const shader of this.shaders) {

            if (shader && shader.hasUniform("timeFactor")) {
                shader.updateUniformsValue("timeFactor", this.shaderElapsedTime);
            }
        }            

        this.myReader.update();
    }

    createTextMesh(text, x, y, z, color) {
        const texture = new THREE.TextureLoader().load("./images/font.png");
        
        const group = new THREE.Group();
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
            
            const u = (charCode % cols) * (1 / cols);
            const v = Math.floor((charCode / cols)) * (1 / rows);
            
            const uvAttribute = geometry.attributes.uv;

            uvAttribute.array.set([
                u,            1 - v - 1 / rows,
                u + 1 / cols, 1 - v - 1 / rows,
                u,            1 - v,
                u + 1 / cols, 1 - v
            ]);

            geometry.setAttribute('uv', uvAttribute);

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = offset;
            mesh.name = text[i];
            offset += 0.65; // looks good

            group.add(mesh);
        }

        group.position.set(x, y, z);
        group.rotation.x = -Math.PI;
        group.rotation.y = -Math.PI;
        return group;
        }

    updateTextMesh(mesh, newText, color) {

        if (mesh.lastText === newText) {
            return;
        }

        mesh.lastText = newText;

        while (mesh.children.length > 0) {
            const child = mesh.children.pop();
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        }

        const updatedMesh = this.createTextMesh(newText, 0, 0, 0, color);        
        while (updatedMesh.children.length > 0) {
            const child = updatedMesh.children.pop();
            mesh.add(child);
        }
    }
}

export { RunningState };
