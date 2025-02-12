import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { MyReader } from '../../objects/MyReader.js';
import { MyShader } from '../../objects/MyShader.js';
import { MyObstacle } from '../../objects/MyObstacle.js';
import { MyPowerUp } from '../../objects/MyPowerUp.js';
import { MyScene } from '../MyScene.js';

class MyRunningScene extends MyScene {
    constructor(app, gameStateManager) {
        super(app, gameStateManager);

        this.myReader = null;
        this.powerUps = [];
        this.obstacles = [];
        this.shaders = [];

        this.keyStates = {};
        this.playerVoucher = 0;

        this.totalElapsedTime = 0;
        this.paused = false;
        this.shaderElapsedTime = 0;
        
        this.currentPlayerLap = 1;
        this.currentOpponentLap = 1;
        this.lapCooldown = 5;
        this.lastLapTime = 0;

        this.useFirstPerson = false;
        this.collisionCooldowns = new Map();

        this.penaltyTime = 2; 
        this.penaltyActive = false;
        this.penaltyEndTime = 0; 
        this.gameStartTime = 0; 

        this.freezePosition = new THREE.Vector3();
        this.penaltyCooldown = false;
        this.penaltyCooldownEndTime = 0;
    }

    setFinishLine(finishLine) {
        this.finishLine = finishLine;
    }

    init() {

        if (this.app.clock) this.app.clock.start();
        else this.app.clock = new THREE.Clock();

        this.gameStartTime = this.app.clock.getElapsedTime();

        this.buildOutdoorDisplay();

        this.myReader = new MyReader(this.app, this.gameStateManager.player.balloonColor, this.gameStateManager.opponent.balloonColor, this.gameStateManager.opponent.smoothFactor);
        this.route = this.myReader.getTrack();
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

        const box1Position = new THREE.Vector3();
        const box2Position = new THREE.Vector3();

        this.finishLine.children[0].getWorldPosition(box1Position);
        this.finishLine.children[1].getWorldPosition(box2Position);

        const finishLineCenter = box1Position.clone().add(box2Position).multiplyScalar(0.5);

        const finishLineSize = new THREE.Vector3(
            Math.abs(box1Position.x - box2Position.x),
            Math.abs(1000),
            Math.abs(box1Position.z - box2Position.z)
        );

        this.finishLineBoundingBox = new THREE.Box3().setFromCenterAndSize(finishLineCenter, finishLineSize);
    }

    applyPenalty(currentTime) {
        console.log(`Applying penalty for ${this.penaltyTime} seconds.`);
        this.penaltyActive = true;
        this.penaltyEndTime = currentTime + this.penaltyTime;
        this.freezePosition.copy(this.myReader.playerBalloon.group.position);
    }

    findApproxClosestPointOnCurve(curve, targetPos, steps = 100) {
        let closestDist = Infinity;
        let closestPoint = new THREE.Vector3();
    
        // Debug group for visualization
        const debugGroup = new THREE.Group();
    
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const sample = curve.getPoint(t); 
    
            const dx = sample.x - targetPos.x;
            const dz = sample.z - targetPos.z;
            const dist2D = Math.sqrt(dx * dx + dz * dz);
    
            if (dist2D < closestDist) {
                closestDist = dist2D;
                closestPoint.copy(sample);
            }
        }
    
        this.app.scene.add(debugGroup);
        return { point: closestPoint, distance: closestDist };
    }
    
    

    checkIfBalloonOutOfTrack() {
        const shadowPos = new THREE.Vector3();
        if (this.myReader.playerBalloon.shadow) {
            this.myReader.playerBalloon.group.getWorldPosition(shadowPos);
        } else {
            this.myReader.playerBalloon.group.getWorldPosition(shadowPos);
        }
    
        const scaledCurve = this.scaleCurve(this.route.path, new THREE.Vector3(35, 1, 35));
        const mirroredCurve = this.mirrorCurve(scaledCurve, 'x'); 
        const offset = new THREE.Vector3(100, 0, 0); 
        const transformedCurve = this.translateCurve(mirroredCurve, offset); 
    
        const { point: closestPoint, distance } = this.findApproxClosestPointOnCurve(
            transformedCurve,
            shadowPos,
            1000 
        );
    
        const threshold = 90;
        if (distance >= threshold) {
            const parent = this.myReader.playerBalloon.group.parent;
            const localPoint = parent.worldToLocal(closestPoint.clone());
            this.myReader.playerBalloon.group.position.copy(localPoint);
    
            return true;
        }

        return false;
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
            this.totalElapsedTime += this.app.clock.getElapsedTime();
            this.app.clock.stop();
            this.myReader.pause();
            this.updateTextMesh(this.gameStatus, "paused", 0xff0000);
        } else {
            this.app.clock.start();
            this.myReader.resume();
            this.updateTextMesh(this.gameStatus, "running", 0x008000);
        }
    }

    buildOutdoorDisplay() { 
        this.elapsedTimeMesh = this.createTextMesh("Time: ", 430, 215, 80, 0xffffff);
        this.elapsedTimeMesh.scale.set(15, 15, 15);
        this.elapsedTimeMesh.rotation.y = 120 * Math.PI / 180;

        this.elapsedTime = this.createTextMesh("0", 355, 215, 212, 0xffffff);
        this.elapsedTime.scale.set(15, 15, 15);
        this.elapsedTime.rotation.y = 120 * Math.PI / 180;

        this.lapsNumberMesh = this.createTextMesh("Lap: ", 430, 195, 80, 0xffffff);
        this.lapsNumberMesh.scale.set(15, 15, 15);
        this.lapsNumberMesh.rotation.y = 120 * Math.PI / 180;

        this.lapsNumber = this.createTextMesh(`1/${this.gameStateManager.laps}`, 350, 195, 217.5, 0xffffff);
        this.lapsNumber.scale.set(15, 15, 15);
        this.lapsNumber.rotation.y = 120 * Math.PI / 180;

        this.layerMesh = this.createTextMesh("Air Layer: ", 430, 175, 80, 0xffffff);
        this.layerMesh.scale.set(15, 15, 15);
        this.layerMesh.rotation.y = 120 * Math.PI / 180;

        this.layer = this.createTextMesh("0", 350, 175, 217.5, 0xffffff);
        this.layer.scale.set(15, 15, 15);
        this.layer.rotation.y = 120 * Math.PI / 180;

        this.vouchersMesh = this.createTextMesh("Vouchers: ", 430, 155, 80, 0xffffff);
        this.vouchersMesh.scale.set(15, 15, 15);
        this.vouchersMesh.rotation.y = 120 * Math.PI / 180;

        this.vouchers = this.createTextMesh("0", 340, 155, 235, 0xffffff);
        this.vouchers.scale.set(15, 15, 15);
        this.vouchers.rotation.y = 120 * Math.PI / 180;

        this.gameStatusMesh = this.createTextMesh("Status: ", 430, 135, 80, 0xffffff);
        this.gameStatusMesh.scale.set(15, 15, 15);;
        this.gameStatusMesh.rotation.y = 120 * Math.PI / 180;

        this.gameStatus = this.createTextMesh("running", 370, 135, 185, 0x008000);
        this.gameStatus.scale.set(15, 15, 15);
        this.gameStatus.rotation.y = 120 * Math.PI / 180;

        this.addObject(this.elapsedTimeMesh);
        this.addObject(this.elapsedTime);
        this.addObject(this.lapsNumberMesh);
        this.addObject(this.lapsNumber);
        this.addObject(this.layerMesh);
        this.addObject(this.layer);
        this.addObject(this.vouchersMesh);
        this.addObject(this.vouchers);
        this.addObject(this.gameStatusMesh);
        this.addObject(this.gameStatus);


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
        this.addObject(this.group);
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
            console.error("shader is null or undefined");
            return;
        }

        if (selectedObject instanceof THREE.Mesh) {
            selectedObject.material = shader.material;
            selectedObject.material.needsUpdate = true;
        } else {
            console.error("Selected object is not a valid THREE.Mesh");
        }
    }

    checkFinishLineCross() {
        const playerBalloonBoundingBox = new THREE.Box3().setFromObject(this.myReader.playerBalloon.group);
        const opponentBalloonBoundingBox = new THREE.Box3().setFromObject(this.myReader.opponentBalloon.group);
        const currentTime = this.app.clock.getElapsedTime();

        if (this.finishLineBoundingBox && this.finishLineBoundingBox.intersectsBox(playerBalloonBoundingBox) && currentTime - this.lastLapTime > this.lapCooldown) {
            this.lastLapTime = currentTime;
            this.currentPlayerLap++;
        } 
        else if (this.finishLineBoundingBox && this.finishLineBoundingBox.intersectsBox(opponentBalloonBoundingBox) && currentTime - this.lastLapTime > this.lapCooldown) {
            this.lastLapTime = currentTime;
            this.currentOpponentLap++;
        } 

        if (this.currentPlayerLap > this.gameStateManager.laps) {
            this.gameStateManager.endGame(this.gameStateManager.player, (this.totalElapsedTime + this.app.clock.getElapsedTime()).toFixed());
        }
        
        else if (this.currentOpponentLap > this.gameStateManager.laps) {
            this.gameStateManager.endGame(this.gameStateManager.opponent, (this.totalElapsedTime + this.app.clock.getElapsedTime()).toFixed());
        }

        else this.updateTextMesh(this.lapsNumber, `${Math.max(this.currentPlayerLap, this.currentOpponentLap)}/${this.gameStateManager.laps}`, 0xffffff);
    }

    update(delta) {
        if (!this.myReader || this.paused) {
            return;
        }

        if (this.myReader && this.myReader.playerBalloon) {
            const balloonLOD = this.myReader.playerBalloon.lod;
            if (balloonLOD) {
                balloonLOD.update(this.app.cameras[this.app.activeCameraName]);
            }
        }

        if (this.useFirstPerson) {
            const balloonWorldPosition = this.myReader.playerBalloon.group.getWorldPosition(new THREE.Vector3());
            balloonWorldPosition.y += this.yOffset;
            this.firstPersonCamera.position.lerp(balloonWorldPosition, 0.5);
        }

        const elapsedTimeInSeconds = Math.floor(this.totalElapsedTime + this.app.clock.getElapsedTime());
        const minutes = Math.floor(elapsedTimeInSeconds / 60);
        const seconds = elapsedTimeInSeconds % 60;
        const elapsedTimeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.updateTextMesh(this.elapsedTime, elapsedTimeText, 0xffffff);

        const currentTime = this.app.clock.getElapsedTime();

        if (this.penaltyActive) {
            if (currentTime < this.penaltyEndTime) {
                this.myReader.playerBalloon.group.position.copy(this.freezePosition);
            } 
            else {
                this.penaltyActive = false;
                console.log("Penalty expired; balloon can move again.");
            }
        }
        else {
            if (this.keyStates["KeyW"]) {
                this.myReader.playerBalloon.updateAltitude(delta, 1);
            }
            if (this.keyStates["KeyS"]) {
                this.myReader.playerBalloon.updateAltitude(delta, -1);
            }
        }

        
        this.myReader.playerBalloon.update(delta);
        this.myReader.track.update(delta);

        // Off-track penalty
        if (this.penaltyCooldown && currentTime > this.penaltyCooldownEndTime) {
            this.penaltyCooldown = false;
        }

        if (!this.penaltyActive && !this.penaltyCooldown) {
            const isOffTrack = this.checkIfBalloonOutOfTrack();
            if (isOffTrack) {
                console.log("Balloon shadow is off the track!");
                
                if (this.playerVoucher > 0) {
                    this.playerVoucher--;
                    this.updateTextMesh(this.vouchers, this.playerVoucher.toString(), 0xffffff);
                    console.log("Used a voucher; NO penalty. But balloon repositioned on track.");
                } 
                else {
                    this.applyPenalty(currentTime);
                    this.penaltyCooldown = true;
                    this.penaltyCooldownEndTime = currentTime + this.penaltyTime + 4.5;
                }
            }
        }


        // Balloons
        if (!this.isOnCooldown(this.myReader.opponentBalloon, currentTime)) {
            const collisionDetected = this.checkCollision(this.myReader.playerBalloon, this.myReader.opponentBalloon, 35, 35);
            if (collisionDetected) {
                console.log("Collision with opponent balloon!");

                if (this.playerVoucher > 0) {
                    this.playerVoucher--;
                    this.updateTextMesh(this.vouchers, this.playerVoucher.toString(), 0xffffff);
                    console.log("Used a voucher; no penalty applied.");
                } 
                else {
                    this.applyPenalty(currentTime);
                }

                this.setCooldown(this.myReader.opponentBalloon, currentTime, this.penaltyTime + 4.5);
            }
        }

        // Obstacles
        for (const obstacle of this.obstacles) {
            if (this.isOnCooldown(obstacle, currentTime)) continue;

            if (this.checkCollision(this.myReader.playerBalloon, obstacle, 30, 15)) {
                console.log("Collision with obstacle: ", obstacle.name);

                if (this.playerVoucher > 0) {
                    this.playerVoucher--;
                    this.updateTextMesh(this.vouchers, this.playerVoucher.toString(), 0xffffff);
                    console.log("Used a voucher; no penalty applied.");
                } 
                else {
                    this.applyPenalty(currentTime);
                }
                this.setCooldown(obstacle, currentTime, this.penaltyTime + 4.5); 
            }
        }

        // Power-ups
        for (const powerUp of this.powerUps) {
            if (this.isOnCooldown(powerUp, currentTime)) continue;
    
            if (this.checkCollision(this.myReader.playerBalloon, powerUp, 30, 15)) {
                console.log("Collision with powerUp: ", powerUp.name);
                this.playerVoucher += 1;
                this.updateTextMesh(this.vouchers, this.playerVoucher.toString(), 0xffffff);
                this.setCooldown(powerUp, currentTime, 3.5);
            }
        }

        let windLayer = this.myReader.playerBalloon.windLayer.toString();

        switch (windLayer) {
            case '1':
                windLayer += "N^";
                break;
            case '2':
                windLayer += "Sv";
                break;
            case '3':
                windLayer += "E>";
                break;          
            case '4':
                windLayer += "W<";
                break;
        }
        this.updateTextMesh(this.layer, windLayer, 0xffffff);

        this.shaderElapsedTime += delta;
        for (const shader of this.shaders) {

            if (shader && shader.hasUniform("timeFactor")) {
                shader.updateUniformsValue("timeFactor", this.shaderElapsedTime);
            }
        }

        if (!this.finishLineCheckEnabled && (currentTime - this.gameStartTime) >= 15) {
            this.finishLineCheckEnabled = true;
            console.log("Finish line checking is now enabled.");
        }

        if (this.finishLineCheckEnabled) {
            this.checkFinishLineCross();
    }

        this.myReader.update();
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
    
    scaleCurve(curve, scaleFactor) {
        const scaledPoints = curve.points.map(point => {
            return new THREE.Vector3(
                point.x * scaleFactor.x,
                point.y * scaleFactor.y,
                point.z * scaleFactor.z
            );
        });
        return new THREE.CatmullRomCurve3(scaledPoints);
    }
    
    mirrorCurve(curve, axis) {
        const mirroredPoints = curve.points.map(point => {
            const mirroredPoint = point.clone();
            mirroredPoint[axis] *= -1; // Flip the specified axis
            return mirroredPoint;
        });
        return new THREE.CatmullRomCurve3(mirroredPoints);
    }

    translateCurve(curve, offset) {
        const translatedPoints = curve.points.map(point => {
            return new THREE.Vector3(
                point.x + offset.x,
                point.y + offset.y,
                point.z + offset.z
            );
        });
        return new THREE.CatmullRomCurve3(translatedPoints);
    }
    
}

export { MyRunningScene };
