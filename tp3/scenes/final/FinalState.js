import * as THREE from 'three';
import { MyBalloon } from '../../objects/MyBalloon.js';
import { MyFirework } from '../../objects/MyFirework.js';
import { MyReader } from '../../objects/MyReader.js';

class FinalState {
    constructor(app, gameStateManager) {
        this.app = app;
        this.gameStateManager = gameStateManager;

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
        console.log("Building final menu...");
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
