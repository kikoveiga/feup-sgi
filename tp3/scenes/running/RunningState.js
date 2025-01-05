import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { MyReader } from '../../objects/MyReader.js';
import { MyShader } from '../../objects/MyShader.js';
import { MyObstacle } from '../../objects/MyObstacle.js';
import { MyPowerUp } from '../../objects/MyPowerUp.js';

class RunningState {
    constructor(app, gameStateManager) {
        this.app = app;
        this.gameStateManager = gameStateManager;

        this.myReader = null;
        this.powerUps = [];
        this.obstacles = [];
        this.shaders = [];

        this.keyStates = {};
        this.paused = false;
        this.pauseTime = 0;
        this.shaderElapsedTime = 0;
        this.playerVoucher = 0;

        this.useFirstPerson = false;
        this.collisionCooldowns = new Map();
    }

    init() {

        if (this.app.clock) this.app.clock.start();
        else this.app.clock = new THREE.Clock();

        this.buildOutdoorDisplay();

        this.myReader = new MyReader(this.app, this.gameStateManager.player.balloonColor, this.gameStateManager.opponent.balloonColor, this.gameStateManager.opponent.smoothFactor);
        this.powerUps = this.myReader.getPowerUps();
        this.obstacles = this.myReader.getObstacles();

        const obstacleTexture = new THREE.TextureLoader().load('./images/obstacle.jpg');
        const powerUpTexture = new THREE.TextureLoader().load('./images/powerup.jpg');
        const depthTexture = new THREE.TextureLoader().load('./images/depth.jpg'); 
        const colorTexture = new THREE.TextureLoader().load('./images/color.jpg');

        this.firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        const balloonWorldPosition = this.myReader.playerBalloon.group.getWorldPosition(new THREE.Vector3());
        this.yOffset = 55;
        balloonWorldPosition.y += this.yOffset;
        this.firstPersonCamera.position.set(balloonWorldPosition.x, balloonWorldPosition.y, balloonWorldPosition.z);
        this.app.cameras['FirstPersonCamera'] = this.firstPersonCamera;

        this.pointerControls = new PointerLockControls(this.firstPersonCamera, document.body);

        window.addEventListener('click', () => {
            if (this.useFirstPerson && !this.pointerControls.isLocked) {    
                this.pointerControls.lock(); 
            }
        });

        this.pointerControls.addEventListener('lock', () => {
            this.app.gui.hide();
        });

        this.pointerControls.addEventListener('unlock', () => {
            this.exitFirstPerson();
        });
        
        window.addEventListener('keydown', (event) => {
            this.keyStates[event.code] = true;

            if (event.code === 'Space') {
                this.togglePause();
            }

            if (event.code === 'KeyC') {
                this.toggleCamera();
            }

            if (event.code === 'Escape' && this.useFirstPerson) {
                this.exitFirstPerson();
            }
        });

        window.addEventListener('keyup', (event) => {
            this.keyStates[event.code] = false;
        });

        this.shaders = [
            new MyShader(this.app, "Pulse shader for obstacle", "Description 1", "./shaders/pulse.vert", "./shaders/pulse.frag", {
                    timeFactor: {type: 'f', value: 0.8 },
                    uSampler: {type: 'sampler2D', value: obstacleTexture }
            }),

            new MyShader(this.app, "Pulse shader for powerUp", "Description 2", "./shaders/pulse.vert", "./shaders/pulse.frag", {
                timeFactor: {type: 'f', value: 0.8 },
                uSampler: {type: 'sampler2D', value: powerUpTexture }
            }),

            new MyShader(this.app, "Bas-relief", "Bas-relief effect", "./shaders/basRelief.vert", "./shaders/basRelief.frag", {
                  uSampler1: { type: 'sampler2D', value: colorTexture }, 
                  uSampler2: { type: 'sampler2D', value: depthTexture }, 
                  scaleFactor: { type: 'f', value: 2.5 }
                }
            )
              
        ];
    
        this.waitForShaders();
    }

    exitFirstPerson() {
        this.useFirstPerson = false;
        this.pointerControls.unlock();
        this.app.setActiveCamera(this.app.lastActiveCameraName);
        this.app.gui.show();
    }

    toggleCamera() {
        this.useFirstPerson = !this.useFirstPerson;

        if (this.useFirstPerson) {
        
            this.app.setActiveCamera('FirstPersonCamera');
            this.pointerControls.lock();
        }

        else this.pointerControls.unlock();
        
    }

    togglePause() {
        this.paused = !this.paused;

        if (this.paused) {
            this.myReader.pause();
            this.pauseTime = this.app.clock.getElapsedTime();
            this.updateTextMesh(this.ultimalinha, "paused", 0xff0000);
        } else {
            this.myReader.resume();
            const resumeTime = this.app.clock.getElapsedTime();
            this.timeOffset = resumeTime - this.pauseTime;
            this.shaderElapsedTime += this.timeOffset;
            this.updateTextMesh(this.ultimalinha, "running", 0x008000);
        }
    }

    buildOutdoorDisplay() { // 200 140 -> 400 170. scale 3.2 -> 4.0
        this.elapsedTimeMesh = this.createTextMesh("Time: ", 430, 215, 80, 0xffffff);
        this.elapsedTimeMesh.scale.set(15, 15, 15);
        this.elapsedTimeMesh.rotation.y = 120 * Math.PI / 180;

        this.elapsedTime = this.createTextMesh("0", 355, 215, 212, 0xffffff);
        this.elapsedTime.scale.set(15, 15, 15);
        this.elapsedTime.rotation.y = 120 * Math.PI / 180;

        this.lapsNumberMesh = this.createTextMesh("Lap: ", 430, 195, 80, 0xffffff);
        this.lapsNumberMesh.scale.set(15, 15, 15);
        this.lapsNumberMesh.rotation.y = 120 * Math.PI / 180;

        this.segundalinha = this.createTextMesh(`1/${this.gameStateManager.laps}`, 350, 195, 217.5, 0xffffff);
        this.segundalinha.scale.set(15, 15, 15);
        this.segundalinha.rotation.y = 120 * Math.PI / 180;

        this.layerMesh = this.createTextMesh("Air Layer: ", 430, 175, 80, 0xffffff);
        this.layerMesh.scale.set(15, 15, 15);
        this.layerMesh.rotation.y = 120 * Math.PI / 180;

        this.layer = this.createTextMesh("0", 340, 175, 235, 0xffffff);
        this.layer.scale.set(15, 15, 15);
        this.layer.rotation.y = 120 * Math.PI / 180;

        this.avaiableVouchersMesh = this.createTextMesh("Vouchers: ", 430, 155, 80, 0xffffff);
        this.avaiableVouchersMesh.scale.set(15, 15, 15);
        this.avaiableVouchersMesh.rotation.y = 120 * Math.PI / 180;

        this.quartalinha = this.createTextMesh("0", 340, 155, 235, 0xffffff);
        this.quartalinha.scale.set(15, 15, 15);
        this.quartalinha.rotation.y = 120 * Math.PI / 180;

        this.gameStatusMesh = this.createTextMesh("Status: ", 430, 135, 80, 0xffffff);
        this.gameStatusMesh.scale.set(15, 15, 15);;
        this.gameStatusMesh.rotation.y = 120 * Math.PI / 180;

        this.ultimalinha = this.createTextMesh("running", 370, 135, 185, 0x008000);
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
        this.app.scene.add(this.layer);
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
        this.group.position.set(-370, 0, 0);
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
    
        for (const powerUp of this.powerUps) {
            if (powerUp instanceof MyPowerUp) {
                this.setCurrentShader(this.shaders[1], powerUp.powerUp);
            } else {
                console.error("Invalid powerUp object");
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

        if (this.useFirstPerson) {
            const balloonWorldPosition = this.myReader.playerBalloon.group.getWorldPosition(new THREE.Vector3());
            balloonWorldPosition.y += this.yOffset;
            this.firstPersonCamera.position.lerp(balloonWorldPosition, 0.5);
        }

        const elapsedTimeInSeconds = Math.floor(this.app.clock.getElapsedTime());
        const minutes = Math.floor(elapsedTimeInSeconds / 60);
        const seconds = elapsedTimeInSeconds % 60;
        
        const elapsedTimeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.updateTextMesh(this.elapsedTime, elapsedTimeText, 0xffffff);

        if (this.keyStates["KeyW"]) {
            this.myReader.playerBalloon.updateAltitude(delta, 1);
        }
        if (this.keyStates["KeyS"]) {
            this.myReader.playerBalloon.updateAltitude(delta, -1);
        }

        this.myReader.playerBalloon.update(delta);
        this.myReader.track.update(delta);

        const currentTime = this.app.clock.getElapsedTime();

        // Balloons
        if (!this.isOnCooldown(this.myReader.opponentBalloon, currentTime)) {
            const collisionDetected = this.checkCollision(this.myReader.playerBalloon, this.myReader.opponentBalloon, 30, 30);

            if (collisionDetected) {
                console.log("Collision with opponent balloon!");

                // Handle the collision logic (e.g., bounce effect, penalty, etc.)
                // this.handleOpponentCollision();

                this.setCooldown(this.myReader.opponentBalloon, currentTime, 3.5);
            }
        }
        
        // Obstacles
        for (const obstacle of this.obstacles) {
            if (this.isOnCooldown(obstacle, currentTime)) continue;
    
            if (this.checkCollision(this.myReader.playerBalloon, obstacle, 30, 15)) {
                console.log("Collision with obstacle: ", obstacle.name);
    
                // Handle collision logic here (e.g., reduce health, apply penalty, etc.)
                

                this.setCooldown(obstacle, currentTime, 3.5); 
            }
        }
    
        // Power-ups
        for (const powerUp of this.powerUps) {
            if (this.isOnCooldown(powerUp, currentTime)) continue;
    
            if (this.checkCollision(this.myReader.playerBalloon, powerUp, 30, 15)) {
                console.log("Collision with powerUp: ", powerUp.name);
    
                this.playerVoucher += 1;
                this.updateTextMesh(this.quartalinha, this.playerVoucher.toString(), 0xffffff);
                this.setCooldown(powerUp, currentTime, 3.5);
            }
        }

        // this.updateTextMesh(this.segundalinha, this.myReader.track.lapsCompleted, 0xffffff);
        
        this.updateTextMesh(this.layer, this.myReader.playerBalloon.windLayer.toString(), 0xffffff);

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

    checkCollision(balloon, otherObject, balloonRadius = 2.0, otherRadius = 1.0) {
        const balloonPos = balloon.group.getWorldPosition(new THREE.Vector3());
    
        let mesh = null;
        if (otherObject.obstacle) {
            mesh = otherObject.obstacle;
        } 
        else if (otherObject.powerUp) {
            mesh = otherObject.powerUp;
        } 
        else {
            return false;
        }
        const objectPos = mesh.getWorldPosition(new THREE.Vector3());
    
        const distance = balloonPos.distanceTo(objectPos);
    
        return distance <= (balloonRadius + otherRadius);
    }

    isOnCooldown(object, currentTime) {
        const lastCollisionTime = this.collisionCooldowns.get(object);
        return lastCollisionTime && currentTime - lastCollisionTime < 3.5; 
    }
    
    setCooldown(object, currentTime, cooldownDuration) {
        this.collisionCooldowns.set(object, currentTime);
        
        setTimeout(() => {
            this.collisionCooldowns.delete(object);
        }, cooldownDuration * 1000);
    }
    
    
}

export { RunningState };
