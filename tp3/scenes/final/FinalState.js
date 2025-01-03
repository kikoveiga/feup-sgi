import * as THREE from 'three';
import { MyBalloon } from '../../objects/MyBalloon.js';
import { MyFirework } from '../../objects/MyFirework.js';

class FinalState {
    constructor(app, gameStateManager, interactableObjects) {
        this.app = app;
        this.gameStateManager = gameStateManager;
        this.interactableObjects = interactableObjects;

        this.fireworks = [];
    }

    init() {
        this.winnerColor = "pink"; // TROCAR PARA A COR DO VENCEDOR
        this.loserColor = "blue"; // TROCAR PARA A COR DO PERDEDOR
        this.winner = "joaoalvesss" // TROCAR PARA O NOME DO VENCEDOR
        this.loser = "kikoveiga" // TROCAR PARA O NOME DO PERDEDOR
        this.buildFinalMenu(this.winnerColor, this.loserColor, this.winner, this.loser);
    }

    buildFinalMenu(winnerColor, loserColor, winnerName, loserName, winnerTime) {
        this.menuMesh = this.createTextMesh("Return to Menu!", -7.5, 10015, 2, 0x111111);
        this.menuMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.menuMesh);

        this.rematchMesh = this.createTextMesh("Rematch!", -3, 10010, 2, 0x111111);
        this.rematchMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.rematchMesh);

        this.winnerTextMesh = this.createTextMesh("WINNER", -28, 10036, 0.1, 0x111111);
        this.winnerTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.winnerTextMesh);

        this.loserTextMesh = this.createTextMesh("LOSER", 23, 10036, 0.1, 0x111111);
        this.loserTextMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.loserTextMesh);

        this.winnerNameMesh = this.createTextMesh(winnerName, -31, 10033.5, 0.1, 0x111111);
        this.winnerNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.winnerNameMesh);

        this.loserNameMesh = this.createTextMesh(loserName, 20, 10033.5, 0.1, 0x111111);
        this.loserNameMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.loserNameMesh);

        this.winnerTimeMesh = this.createTextMesh("WINNER'S TIME", -6.5, 10028, 0.1, 0x111111);
        this.winnerTimeMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.winnerTimeMesh);

        this.winnerMesh = this.createTextMesh(" " + winnerTime + " ", -3.5, 10026, 0.1, 0x111111);
        this.winnerMesh.scale.set(-1.8, 1.8, 1.8);
        this.app.scene.add(this.winnerMesh);

        this.winnerBalloon = new MyBalloon(this.app, 'Balloon', winnerColor);
        this.winnerBalloon.scale.set(3.5, 3.5, 3.5);
        this.winnerBalloon.rotation.y = 20 * Math.PI / 180;
        this.winnerBalloon.position.set(-25, 9987.5, 0);
        this.app.scene.add(this.winnerBalloon);

        this.loserBalloon = new MyBalloon(this.app, 'Balloon', loserColor);
        this.loserBalloon.scale.set(3.5, 3.5, 3.5);
        this.loserBalloon.rotation.y = -20 * Math.PI / 180;
        this.loserBalloon.position.set(25, 9987.5, 0);
        this.app.scene.add(this.loserBalloon);
    }

    update(delta) {
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
