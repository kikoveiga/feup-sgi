import * as THREE from 'three';
import { MyBalloon } from '../../objects/MyBalloon.js';
import { MyFirework } from '../../objects/MyFirework.js';
import { PickingManager } from '../../PickingManager.js';
import { State } from '../State.js';

class FinalState extends State {
    constructor(app, gameStateManager, interactableObjects) {
        super(app, gameStateManager);
        this.interactableObjects = interactableObjects;

        this.pickingManager = null;

        this.fireworks = [];
    }

    init() {
        this.pickingManager = new PickingManager(this.app.activeCamera, this.handleButtonSelection.bind(this));
        this.interactableObjects.forEach(obj => { this.pickingManager.addInteractableObject(obj); });

        this.buildFinalMenu(this.winnerColor, this.loserColor, this.winner, this.loser);
    }

    handleButtonSelection(clickedObject) {
        if (clickedObject === "rematchButton") this.gameStateManager.restartGame();
        else this.gameStateManager.startMainMenu();
    }

    buildFinalMenu() {

        let winnerData;
        let loserData;

        if (!this.gameStateManager.winner || this.gameStateManager.winner === this.gameStateManager.player) {
            winnerData = this.gameStateManager.player;
            loserData = this.gameStateManager.opponent;
        } else {
            winnerData = this.gameStateManager.opponent;
            loserData = this.gameStateManager.player;
        }

        this.menuMesh = this.createTextMesh("Return to Main Menu!", -10, -5, 2, 0x111111);
        this.menuMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.menuMesh, true);

        this.rematchMesh = this.createTextMesh("Rematch!", -3, -10, 2, 0x111111);
        this.rematchMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.rematchMesh, true);

        this.winnerTextMesh = this.createTextMesh("WINNER", -28, 16, 0.1, 0x111111);
        this.winnerTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.winnerTextMesh);

        this.loserTextMesh = this.createTextMesh("LOSER", 23, 16, 0.1, 0x111111);
        this.loserTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.loserTextMesh);

        this.winnerNameMesh = this.createTextMesh(winnerData.name, -31, 13.5, 0.1, 0x111111);
        this.winnerNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.winnerNameMesh);

        this.loserNameMesh = this.createTextMesh(loserData.name, 20, 13.5, 0.1, 0x111111);
        this.loserNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.loserNameMesh);

        this.winnerTimeMesh = this.createTextMesh("WINNER'S TIME", -6.5, 8, 0.1, 0x111111);
        this.winnerTimeMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.winnerTimeMesh);
        
        const minutes = Math.floor(winnerData.time / 60);
        const seconds = winnerData.time % 60;
        
        const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.winnerMesh = this.createTextMesh(" " + timeText + " ", -3.5, 6, 0.1, 0x111111);
        this.winnerMesh.scale.set(-1.8, 1.8, 1.8);
        this.addObject(this.winnerMesh);

        this.winnerBalloon = new MyBalloon(this.app, 'WinnerBalloon', winnerData.balloonColor);
        this.winnerBalloon.scale.set(3.5, 3.5, 3.5);
        this.winnerBalloon.rotation.y = 20 * Math.PI / 180;
        this.winnerBalloon.position.set(-25, -32.5, 0);
        this.addObject(this.winnerBalloon);

        this.loserBalloon = new MyBalloon(this.app, 'LoserBalloon', loserData.balloonColor);
        this.loserBalloon.scale.set(3.5, 3.5, 3.5);
        this.loserBalloon.rotation.y = -20 * Math.PI / 180;
        this.loserBalloon.position.set(25, -32.5, 0);
        this.addObject(this.loserBalloon);
    }

    update() {
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
}

export { FinalState };
