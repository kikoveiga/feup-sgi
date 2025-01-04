import * as THREE from 'three';
import { PickingManager } from '../../PickingManager.js';
import { GameStates } from '../../GameStateManager.js';

class InitialState {
    constructor(app, gameStateManager, interactableObjects) {
        this.app = app;
        this.gameStateManager = gameStateManager;
        this.interactableObjects = interactableObjects;

        this.pickingManager = null;

        this.playerBalloonString = "Not chosen";
        this.opponentBalloonString = "Not chosen";
        this.playerNameString = "Not chosen";
    }

    init() {
        this.buildMainMenu();
        this.pickingManager = new PickingManager(this.app.scene, this.app.activeCamera, this.app.renderer, this.handleBalloonSelection.bind(this));
        this.interactableObjects.forEach(obj => { this.pickingManager.addInteractableObject(obj); });
    }

    buildMainMenu() {
        console.log("Building main menu...");
        this.topMesh1 = this.createTextMesh("Select your Balloon!", 2024.7, 14.5, 1987.5, 0xffa500); 
        this.topMesh1.scale.set(1.8, 1.8, 1.8);
        this.topMesh1.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh1);
    
        this.topMesh2 = this.createTextMesh("Player balloon: ", 2024.7, 12, 1978.5, 0x87ceeb); 
        this.topMesh2.scale.set(1.8, 1.8, 1.8);
        this.topMesh2.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh2);
    
        this.topMesh3 = this.createTextMesh("Opponent balloon: ", 2024.7, 10, 1978.5, 0xff69b4);
        this.topMesh3.scale.set(1.8, 1.8, 1.8);
        this.topMesh3.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh3);
    
        this.topMesh4 = this.createTextMesh("Play HotRace!", 2024, 17.5, 1992.5, 0x32cd32);
        this.topMesh4.scale.set(2, 2, 2);
        this.topMesh4.rotation.y = Math.PI / 2;
        this.app.scene.add(this.topMesh4);
    
        this.playerBalloon = this.createTextMesh(this.playerBalloonString, 2024.7, 12, 2006, 0xb0b0b0);
        this.playerBalloon.name = 'playerBalloon';
        this.playerBalloon.scale.set(1.8, 1.8, 1.8);
        this.playerBalloon.rotation.y = Math.PI / 2;
        this.app.scene.add(this.playerBalloon);
        this.interactableObjects.push(this.playerBalloon);
    
        this.opponentBalloon = this.createTextMesh(this.opponentBalloonString, 2024.7, 10, 2006, 0xb0b0b0); 
        this.opponentBalloon.name = 'opponentBalloon';
        this.opponentBalloon.scale.set(1.8, 1.8, 1.8);
        this.opponentBalloon.rotation.y = Math.PI / 2;
        this.app.scene.add(this.opponentBalloon);
        this.interactableObjects.push(this.opponentBalloon);
    
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

    handleBalloonSelection(clickedObject, color) {
        this.colorHex = null;

        if(color === 'pink') {
            this.colorHex = 0xffb5c2;
        } else if(color === 'blue') {
            this.colorHex = 0x87cfff;
        } else if(color === 'orange') {
            this.colorHex = 0xff8000;
        } else if(color === 'green') {
            this.colorHex = 0x00cc00;
        }

        if (clickedObject === 'playerBalloon') {
            this.playerBalloonString = color;
            this.updateTextMesh(this.playerBalloon, color, this.colorHex);
        } 
        else if (clickedObject === 'opponentBalloon') {
            this.opponentBalloonString = color;
            this.updateTextMesh(this.opponentBalloon, color, this.colorHex);
        } 
        else if (clickedObject === 'playButton') {
            if (this.playerBalloonString === "Not chosen" || this.opponentBalloonString === "Not chosen") {
                console.warn('Please select both balloons before starting the game.');
                return;
            }
            this.gameStateManager.setState(GameStates.RUNNING, this.playerBalloonString, this.opponentBalloonString);
        }
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

        while (mesh.children.length > 0) {
            const child = mesh.children.pop();
            child.geometry.dispose();
            child.material.dispose();
        }

        let updatedMesh = this.createTextMesh(newText, 2024, 0, 0, color);
        
        while (updatedMesh.children.length > 0) {
            mesh.add(updatedMesh.children.pop());
        }
    }

    update(delta) {

    }
}

export { InitialState };
