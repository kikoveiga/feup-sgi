import * as THREE from "three";
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyYASFParser } from './parser/MyYASFParser.js';
import { MyReader } from './objects/MyReader.js';
import { PickingManager } from './PickingManager.js';
import { GameStates } from './GameStateManager.js';

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

        this.pickingManager = null;
        this.meshes = [];

        this.playerBalloonString = "Not chosen";
        this.opponentBalloonString = "Not chosen";
        this.playerNameString = "Not chosen";
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
                this.pickingManager = new PickingManager(this.app.scene, this.app.activeCamera, this.app.renderer, this.handleBalloonSelection.bind(this));
                this.meshes.forEach(mesh => { this.pickingManager.addInteractableObject(mesh); });
    
                break;

            case GameStates.RUNNING:
                break;

            case GameStates.FINAL:
                this.winnercolor = "pink"; // TROCAR PARA A COR DO VENCEDOR
                this.losercolor = "blue"; // TROCAR PARA A COR DO PERDEDOR
                this.winner = "joaoalvesss" // TROCAR PARA O NOME DO VENCEDOR
                this.loser = "kikoveiga" // TROCAR PARA O NOME DO PERDEDOR
                this.myreader.buildFinalMenu(this.winnercolor, this.losercolor, this.winner, this.loser);
                break;
            
            default:
                console.error("Invalid scene type: " + state);
        }
    }

    /*********************** TEXTS ZONE /***********************/
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

            const charCode = text.charCodeAt(i);
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

    updateTextMesh(mesh, nexText, color) {

        while (mesh.children.length > 0) {
            const child = mesh.children.pop();
            child.geometry.dispose();
            child.material.dispose();
        }

        const updatedMesh = this.createTextMesh(nexText, 0, 0, 0, color);
        updatedMesh.children.forEach(child => mesh.add(child));
    }

    buildMainMenu() {
        this.topMesh1 = this.createTextMesh("Select your Balloon!", 2024.7, 14.5, 1987.5, 0xffa500); 
        this.topMesh1.scale.set(1.8, 1.8, 1.8);
        this.topMesh1.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh1);
    
        this.topMesh3 = this.createTextMesh("Player balloon: ", 2024.7, 12, 1978.5, 0x87ceeb); 
        this.topMesh3.scale.set(1.8, 1.8, 1.8);
        this.topMesh3.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh3);
    
        this.topMesh2 = this.createTextMesh("Opponent balloon: ", 2024.7, 10, 1978.5, 0xff69b4);
        this.topMesh2.scale.set(1.8, 1.8, 1.8);
        this.topMesh2.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh2);
    
        this.topMesh4 = this.createTextMesh("Play HotRace!", 2024, 17.5, 1992.5, 0x32cd32);
        this.topMesh4.scale.set(2, 2, 2);
        this.topMesh4.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh4);
    
        this.playerBalloon = this.createTextMesh(this.playerBalloonString, 2024.7, 12, 2006, 0xb0b0b0);
        this.playerBalloon.name = 'playerBalloon';
        this.playerBalloon.scale.set(1.8, 1.8, 1.8);
        this.playerBalloon.rotation.y = Math.PI / 2;
        this.app.scene.add(this.playerBalloon);
        this.meshes.push(this.playerBalloon);
    
        this.opponentBalloon = this.createTextMesh(this.opponentBalloonString, 2024.7, 10, 2006, 0xb0b0b0); 
        this.opponentBalloon.name = 'opponentBalloon';
        this.opponentBalloon.scale.set(1.8, 1.8, 1.8);
        this.opponentBalloon.rotation.y = Math.PI / 2;
        this.app.scene.add(this.opponentBalloon);
        this.meshes.push(this.opponentBalloon);
    
        this.gameMesh = this.createTextMesh("Game made by:", 2024.7, 6, 1993.5, 0xffffe0); 
        this.gameMesh.scale.set(1.5, 1.5, 1.5);
        this.gameMesh.rotation.y = Math.PI / 2;
        this.app.scene.add(this.gameMesh);
    
        this.gameMesh2 = this.createTextMesh("João Alves & Francisco Veiga", 2024.7, 4, 1986, 0xffffe0); 
        this.gameMesh2.scale.set(1.5, 1.5, 1.5);
        this.gameMesh2.rotation.y = Math.PI / 2;
        this.app.scene.add(this.gameMesh2);

        this.playerNameMesh = this.createTextMesh("Player Name: ", 1981.5, 0.1, 1988, 0x000000); 
        this.playerNameMesh.scale.set(1.8, 1.8, 1.8);
        this.playerNameMesh.rotation.x = - Math.PI / 2;
        this.playerNameMesh.rotation.z = - Math.PI / 2;
        this.app.scene.add(this.playerNameMesh);

        this.playerName = this.createTextMesh(this.playerNameString, 1981.5, 0.1, 2002, 0xb0b0b0); 
        this.playerName.scale.set(1.8, 1.8, 1.8);
        this.playerName.rotation.x = - Math.PI / 2;
        this.playerName.rotation.z = - Math.PI / 2;
        this.app.scene.add(this.playerName);
    }

    buildOutdoorDisplay() {
        this.elapsedTimeMesh = this.createTextMesh("Elapsed time: ", 230, 175, 70, 0xffffff);
        this.lapsNumberMesh = this.createTextMesh("Completed Laps: ", 230, 155, 70, 0xffffff);
        this.layerMesh = this.createTextMesh("Current Air Layer: ", 230, 135, 70, 0xffffff);
        this.avaiableVouchersMesh = this.createTextMesh("Avaiable Vouchers: ", 230, 115, 70, 0xffffff);
        this.gameStatusMesh = this.createTextMesh("Game Status: ", 230, 95, 70, 0xffffff);
        this.elapsedTimeMesh.scale.set(12, 12, 12);
        this.lapsNumberMesh.scale.set(12, 12, 12);
        this.avaiableVouchersMesh.scale.set(12, 12, 12);
        this.gameStatusMesh.scale.set(12, 12, 12);
        this.layerMesh.scale.set(12, 12, 12);
        this.avaiableVouchersMesh.rotation.y = 120 * Math.PI / 180;
        this.gameStatusMesh.rotation.y = 120 * Math.PI / 180;
        this.lapsNumberMesh.rotation.y = 120 * Math.PI / 180;
        this.elapsedTimeMesh.rotation.y = 120 * Math.PI / 180;
        this.layerMesh.rotation.y = 120 * Math.PI / 180;
        this.app.scene.add(this.elapsedTimeMesh);
        this.app.scene.add(this.lapsNumberMesh);
        this.app.scene.add(this.avaiableVouchersMesh);
        this.app.scene.add(this.gameStatusMesh);
        this.app.scene.add(this.layerMesh);
    }

    buildFinalMenu(winnercolor, losercolor, winnername, losername, winnerTime) {
        this.MenuMesh = this.createTextMesh("Return to Menu!", -7.5, 10015, 2, 0x111111);
        this.MenuMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.MenuMesh);

        this.RematchMesh = this.createTextMesh("Rematch!", -3, 10010, 2, 0x111111);
        this.RematchMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.RematchMesh);

        this.WinnerTextMesh = this.createTextMesh("WINNER", -28, 10036, 0.1, 0x111111);
        this.WinnerTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.WinnerTextMesh);

        this.LoserTextMesh = this.createTextMesh("LOSER", 23, 10036, 0.1, 0x111111);
        this.LoserTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.LoserTextMesh);

        this.WinnerNameMesh = this.createTextMesh(winnername, -31, 10033.5, 0.1, 0x111111);
        this.WinnerNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.WinnerNameMesh);

        this.LoserNameMesh = this.createTextMesh(losername, 20, 10033.5, 0.1, 0x111111);
        this.LoserNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.LoserNameMesh);

        this.WinnerTimeMesh = this.createTextMesh("WINNER'S TIME", -6.5, 10028, 0.1, 0x111111);
        this.WinnerTimeMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.WinnerTimeMesh);

        this.WinnerMesh = this.createTextMesh(" " + winnerTime + " ", -3.5, 10026, 0.1, 0x111111);
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

    handleBalloonSelection(clickedObject, color) {
    
        if (clickedObject === 'playerBalloon') {
            this.playerBalloonString = color;
            this.updateTextMesh(this.playerBalloon, color, 0xffa500);

        } else if (clickedObject === 'opponentBalloon') {
            this.opponentBalloonString = color;
            this.updateTextMesh(this.opponentBalloon, color, 0xff69b4);
        } else if (clickedObject === 'playButton') {
            if (this.playerBalloonString === "Not chosen" || this.opponentBalloonString === "Not chosen") {
                console.warn('Please select both balloons before starting the game.');
                return;
            }

            this.gameStateManager.startGame(this.playerBalloonString, this.opponentBalloonString);
        }
    }

    updatePlayerBalloonText(color) {
        if (this.playerSelected) {
            this.updateTextMesh(this.playerSelected, color, 0xffa500); // Update playerSelected text
        }
        this.playerBalloonColor = color; // Update internal state
    }

    updateOpponentBalloonText(color) {
        if (this.playerSelected2) {
            this.updateTextMesh(this.playerSelected2, color, 0xff69b4); // Update playerSelected2 text
        }
        this.opponentBalloonColor = color; // Update internal state
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
                if (mesh.name.includes("Button")) {
                    this.meshes.push(mesh);
                }
            });
        }
    }

    toggleWireframe(enableWireframe) {
        this.app.scene.traverse(node => {
            if (node.isMesh && node.material) {
                if (Array.isArray(node.material)) {
                    node.material.forEach(material => {
                        material.wireframe = enableWireframe;
                        material.needsUpdate = true;
                    });
                } else {
                    node.material.wireframe = enableWireframe;
                    node.material.needsUpdate = true;
                }
            }
        });
    }    
    
    update(delta) {
        if (this.track) {
            this.track.update(delta);
        }
        this.myreader.update();

        if (this.state === 'final') {
            this.myreader.updateFireworks(); 
        }
    }
    
}

export { MyContents };
