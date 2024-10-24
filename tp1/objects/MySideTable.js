import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MySideTable extends MyObject {
     constructor(app, tableRadius = 1, tableHeight = 1.5, legRadius = 0.1, legHeight = 1.4, name = 'side table') {
          super(app, name);

          const woodTexture = new THREE.TextureLoader().load('./textures/wood2.jpg');
          const legMaterial = new THREE.MeshPhongMaterial({
               map: woodTexture,
               color: "#8B4513", 
               shininess: 20,
               specular: "#333333",
          });

          const tableTopMaterial = new THREE.MeshPhongMaterial({
               map: woodTexture,
               color: "#A0522D", 
               shininess: 30,
               specular: "#444444",
          });

          // Tabletop
          const tabletopGeometry = new THREE.CylinderGeometry(tableRadius, tableRadius, 0.1, 32);
          const tabletopMesh = new THREE.Mesh(tabletopGeometry, tableTopMaterial);
          tabletopMesh.position.set(0, tableHeight, 0);
          this.add(tabletopMesh);

          // Legs
          const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);

          this.addLeg(-tableRadius / 2, legHeight / 2 +0.1, -tableRadius / 2, legGeometry, legMaterial);
          this.addLeg(tableRadius / 2, legHeight / 2 +0.1, -tableRadius / 2, legGeometry, legMaterial);
          this.addLeg(-tableRadius / 2, legHeight / 2 +0.1, tableRadius / 2, legGeometry, legMaterial);
          this.addLeg(tableRadius / 2, legHeight / 2 +0.1, tableRadius / 2, legGeometry, legMaterial);
     }

     addLeg(x, y, z, legGeometry, legMaterial) {
          const leg = new THREE.Mesh(legGeometry, legMaterial);
          leg.position.set(x, y, z);
          this.add(leg);
     }
}

export { MySideTable };
