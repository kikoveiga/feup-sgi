import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';
import { MyReader } from './objects/MyReader.js';
import { PickingManager } from './PickingManager.js';
import { GameStates } from './GameStateManager.js';
import { MyBalloon } from './objects/MyBalloon.js';
import { MyFirework } from './objects/MyFirework.js';
import { MyShader } from './objects/MyShader.js';
import { MyPowerUp } from './objects/MyPowerUp.js';
import { MyObstacle } from './objects/MyObstacle.js';

class MyContents {
    constructor(app, state, gameStateManager) {
        this.app = app;
        this.state = state;
        this.gameStateManager = gameStateManager;

        this.parser = null;
        this.reader = null;

        this.myreader = new MyReader(this.app);

        this.axis = null;
    
        this.objects = [];
        this.lights = [];
        this.fireworks = [];

        this.pickingManager = null;
        this.meshes = [];

        this.powerups = this.myreader.getPowerUps();
        this.obstacles = this.myreader.getObstacles();

        const obstacleTexture = new THREE.TextureLoader().load('./images/obstacle.jpg');
        const powerupTexture = new THREE.TextureLoader().load('./images/powerup.jpg');

        this.shaders = [
             new MyShader(this.app, "input 1", "input 1", "./shaders/pulse.vert", "./shaders/pulse.frag", {
                      timeFactor: {type: 'f', value: 1.0 },
                      uSampler: {type: 'sampler2D', value: obstacleTexture }
             }),
             new MyShader(this.app, "input 2", "input 2", "./shaders/pulse.vert", "./shaders/pulse.frag", {
                  timeFactor: {type: 'f', value: 1.0 },
                  uSampler: {type: 'sampler2D', value: powerupTexture }
         }),
        ];

        this.waitForShaders();
    }

    async init() {
        console.log("Initializing contents for scene: " + this.state);

        if (this.axis === null) {
            this.axis = new MyAxis(this.app);
            this.app.scene.add(this.axis);
        }

        this.parser = new MyYASFParser(this.app.scene);
        
        await new Promise((resolve, reject) => {
            this.reader = new MyFileReader(async (data) => {
                await this.onSceneLoaded(data);
                console.log("Scene loaded successfully.");
                resolve();
            });

            this.reader.open(`scenes/${this.state}.json`);
        });

        switch (this.state) {
            case GameStates.INITIAL:
                this.buildMainMenu();
                this.pickingManager = new PickingManager(this.app.scene, this.app.activeCamera, this.app.renderer, this.gameStateManager);
                this.meshes.forEach(mesh => {
                    if (mesh.name.includes("Button")) {
                        this.pickingManager.addInteractableObject(mesh);
                    }
                });
                    

                break;

            case GameStates.RUNNING:
                break;

            case GameStates.FINAL:
                this.winnercolor = "pink"; // TROCAR PARA A COR DO VENCEDOR
                this.losercolor = "blue"; // TROCAR PARA A COR DO PERDEDOR
                this.winner = "joaoalvesss" // TROCAR PARA O NOME DO VENCEDOR
                this.loser = "kikoveiga" // TROCAR PARA O NOME DO PERDEDOR
                this.buildFinalMenu(this.winnercolor, this.losercolor, this.winner, this.loser);
                break;
            
            default:
                console.error("Invalid scene type: " + state);
        }
    }

    clearScene() {
        console.log("Clearing current scene...");

        this.objects.forEach(obj => this.app.scene.remove(obj));
        this.objects = [];

        this.lights.forEach(light => this.app.scene.remove(light));
        this.lights = [];

        if (this.axis !== null) {
            this.app.scene.remove(this.axis);
            this.axis = null;
        }

        if (this.parser !== null) {
            this.parser = null;
        }
    }

    async onSceneLoaded(data) {

        await this.parser.parse(data);

        this.addGlobals();
        this.addCameras();
        this.addLights();
        this.addObjects();

        console.info("YASF parsed and loaded.");
    }
    
    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.printYASF(data)
    }

    addGlobals() {

        if (this.parser.globals.background) {
            this.app.scene.background = this.parser.globals.background;
        }

        if (this.parser.globals.ambient) {
            this.app.scene.add(this.parser.globals.ambient);
        }

        if (this.parser.globals.fog) {
            this.app.scene.fog = this.parser.globals.fog;
        }

        if (this.parser.globals.skybox) {
            this.app.scene.add(this.parser.globals.skybox);
        }
    }

    addCameras() {
        this.app.cameras = this.parser.cameras; 
        this.app.setActiveCamera(this.parser.initialCameraName || Object.keys(this.app.cameras)[0]);
        this.app.gui.updateCameraOptions(); 
    }
    
    addLights() {
        if (this.parser.lights) {
            this.parser.lights.forEach(light => {
                this.app.scene.add(light);

            });
            this.app.gui.updateLights();
        }
    }

    addObjects() {
        if (this.parser.objects) {

            const root = this.parser.objects[this.parser.rootid];

            if (root) {
                this.app.scene.add(root);
                this.objects.push(root);
            }  
        }

        if (this.parser.meshes) {
            this.parser.meshes.forEach(mesh => {
                this.meshes.push(mesh);
            });
        }
    }
    
    buildMainMenu() {
        this.topMesh1 = this.myreader.createTextMesh("Select your Balloon!", 2024.7, 14.5, 1987.5, 0xffa500); 
        this.topMesh1.scale.set(1.8, 1.8, 1.8);
        this.topMesh1.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh1);
    
        this.topMesh3 = this.myreader.createTextMesh("Your current selection: ", 2024.7, 12, 1978.5, 0x87ceeb); 
        this.topMesh3.scale.set(1.8, 1.8, 1.8);
        this.topMesh3.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh3);
    
        this.topMesh2 = this.myreader.createTextMesh("Oponnent current selection: ", 2024.7, 10, 1978.5, 0xff69b4);
        this.topMesh2.scale.set(1.8, 1.8, 1.8);
        this.topMesh2.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh2);
    
        this.topMesh4 = this.myreader.createTextMesh("Play HotRace!", 2024, 17.5, 1992.5, 0x32cd32);
        this.topMesh4.scale.set(2, 2, 2);
        this.topMesh4.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh4);
    
        this.playerSelected = this.myreader.createTextMesh("Not chosen", 2024.7, 12, 2006, 0xb0b0b0); 
        this.playerSelected.scale.set(1.8, 1.8, 1.8);
        this.playerSelected.rotation.y = Math.PI / 2;
        this.app.scene.add(this.playerSelected);
    
        this.playerSelected2 = this.myreader.createTextMesh("Not chosen", 2024.7, 10, 2010.5, 0xb0b0b0); 
        this.playerSelected2.scale.set(1.8, 1.8, 1.8);
        this.playerSelected2.rotation.y = Math.PI / 2;
        this.app.scene.add(this.playerSelected2);
    
        this.gameMesh = this.myreader.createTextMesh("Game made by:", 2024.7, 6, 1993.5, 0xffffe0); 
        this.gameMesh.scale.set(1.5, 1.5, 1.5);
        this.gameMesh.rotation.y = Math.PI / 2;
        this.app.scene.add(this.gameMesh);
    
        this.gameMesh2 = this.myreader.createTextMesh("João Alves & Francisco Veiga", 2024.7, 4, 1986, 0xffffe0); 
        this.gameMesh2.scale.set(1.5, 1.5, 1.5);
        this.gameMesh2.rotation.y = Math.PI / 2;
        this.app.scene.add(this.gameMesh2);

        this.playerNameMesh = this.myreader.createTextMesh("Player Name: ", 1981.5, 0.1, 1988, 0x000000); 
        this.playerNameMesh.scale.set(1.8, 1.8, 1.8);
        this.playerNameMesh.rotation.x = - Math.PI / 2;
        this.playerNameMesh.rotation.z = - Math.PI / 2;
        this.app.scene.add(this.playerNameMesh);

        this.playerSelected3 = this.myreader.createTextMesh("Not chosen", 1981.5, 0.1, 2002, 0xb0b0b0); 
        this.playerSelected3.scale.set(1.8, 1.8, 1.8);
        this.playerSelected3.rotation.x = - Math.PI / 2;
        this.playerSelected3.rotation.z = - Math.PI / 2;
        this.app.scene.add(this.playerSelected3);
    }
        
    buildFinalMenu(winnercolor, losercolor, winnername, losername, winnerTime) {
        this.MenuMesh = this.myreader.createTextMesh("Return to Menu!", -7.5, 10015, 2, 0x111111);
        this.MenuMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.MenuMesh);

        this.RematchMesh = this.myreader.createTextMesh("Rematch!", -3, 10010, 2, 0x111111);
        this.RematchMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.RematchMesh);

        this.WinnerTextMesh = this.myreader.createTextMesh("WINNER", -28, 10036, 0.1, 0x111111);
        this.WinnerTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.WinnerTextMesh);

        this.LoserTextMesh = this.myreader.createTextMesh("LOSER", 23, 10036, 0.1, 0x111111);
        this.LoserTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.LoserTextMesh);

        this.WinnerNameMesh = this.myreader.createTextMesh(winnername, -31, 10033.5, 0.1, 0x111111);
        this.WinnerNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.WinnerNameMesh);

        this.LoserNameMesh = this.myreader.createTextMesh(losername, 20, 10033.5, 0.1, 0x111111);
        this.LoserNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.LoserNameMesh);

        this.WinnerTimeMesh = this.myreader.createTextMesh("WINNER'S TIME", -6.5, 10028, 0.1, 0x111111);
        this.WinnerTimeMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.WinnerTimeMesh);

        this.WinnerMesh = this.myreader.createTextMesh(" " + winnerTime + " ", -3.5, 10026, 0.1, 0x111111);
        this.WinnerMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.WinnerMesh);

        this.winnerBalloon = new MyBalloon(this.app, 'Balloon', winnercolor);
        this.winnerBalloon.scale.set(3.5, 3.5, 3.5);
        this.winnerBalloon.rotation.y = 20 * Math.PI / 180;
        this.winnerBalloon.position.set(-25, 9987.5, 0);
        this.app.scene.add(this.winnerBalloon);

        this.loserBalloon = new MyBalloon(this.app, 'Balloon', losercolor);
        this.loserBalloon.scale.set(3.5, 3.5, 3.5);
        this.loserBalloon.rotation.y = -20 * Math.PI / 180;
        this.loserBalloon.position.set(25, 9987.5, 0);
        this.app.scene.add(this.loserBalloon);      
    }  
    
    /*********************** SHADERS ZONE /***********************/
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
        if (this.track) {
            this.track.update(delta);
        }
        
        if(this.state === 'running') {
            let t = this.app.clock.getElapsedTime();
            for (const shader of this.shaders) {
                // console.log("Shader:", shader);
                if (shader && shader.hasUniform("timeFactor")) {
                    shader.updateUniformsValue("timeFactor", t);
                }
            }            
        }    

        if (this.state === 'final') {
            if (Math.random() < 0.025) {
                const randomScale = THREE.MathUtils.randFloat(0.8, 1.5);
                this.fireworks.push(new MyFirework(this.app, this, randomScale));
            }
        
            for (let i = 0; i < this.fireworks.length; i++) {
                if (this.fireworks[i].done) {
                    this.fireworks.splice(i, 1);
                    continue;
                }
                this.fireworks[i].update();
            }
        }

        this.myreader.update();
    }
    
}

export { MyContents };
