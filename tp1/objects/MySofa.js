import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MySofa extends MyObject {
     constructor(app, width = 6, depth = 2.75, height = 2, name = 'sofa') {
          super(app, name);

          const texture1 = new THREE.TextureLoader().load('./textures/sofa.jpg');
          const texture2 = new THREE.TextureLoader().load('./textures/sofa2.jpg');
          const texture3 = new THREE.TextureLoader().load('./textures/iron.jpg');

          const sofaMaterial = new THREE.MeshPhongMaterial({
               map: texture1,
               color: "#ffffff",
               shininess: 10,
          });

          const cushionMaterial = new THREE.MeshPhongMaterial({
               map: texture2,
               color: "#ffffff",
               shininess: 30,
          });

          const legMaterial = new THREE.MeshPhongMaterial({
               map: texture3,
               color: "#000000",
               specular: "#000000",
               shininess: 70,
          });

          // BASE
          const seatGeometry = new THREE.BoxGeometry(width, 0.5, depth);
          this.seatMesh = new THREE.Mesh(seatGeometry, sofaMaterial);
          this.seatMesh.position.set(0, 0.25, 0); 
          this.seatMesh.receiveShadow = true;
          this.seatMesh.castShadow = true;
          this.add(this.seatMesh);

          // BACK
          const backrestGeometry = new THREE.BoxGeometry(width, height, 0.5);
          this.backrestMesh = new THREE.Mesh(backrestGeometry, sofaMaterial);
          this.backrestMesh.position.set(0, height / 2 + 0.25, -depth / 2 + 0.25);
          this.backrestMesh.receiveShadow = true;
          this.backrestMesh.castShadow = true;
          this.add(this.backrestMesh);

          // SIDES
          const armrestWidth = 0.5;
          const armrestHeight = height;
          const armrestGeometry = new THREE.BoxGeometry(armrestWidth, armrestHeight, depth);

          this.leftArmrestMesh = new THREE.Mesh(armrestGeometry, sofaMaterial);
          this.leftArmrestMesh.position.set(-width / 2 + armrestWidth / 2, height / 2, 0); 
          this.leftArmrestMesh.receiveShadow = true;
          this.leftArmrestMesh.castShadow = true;
          this.add(this.leftArmrestMesh);

          this.rightArmrestMesh = new THREE.Mesh(armrestGeometry, sofaMaterial);
          this.rightArmrestMesh.position.set(width / 2 - armrestWidth / 2, height / 2, 0); 
          this.rightArmrestMesh.receiveShadow = true;
          this.rightArmrestMesh.castShadow = true;
          this.add(this.rightArmrestMesh);

          // SEATING
          const cushionDepth = depth - 1;
          const cushionGeometry = new THREE.BoxGeometry(width - 1, 0.6, cushionDepth);
          this.cushionMesh = new THREE.Mesh(cushionGeometry, cushionMaterial);
          this.cushionMesh.position.set(0, 0.5, 0); 
          this.cushionMesh.receiveShadow = true;
          this.cushionMesh.castShadow = true;
          this.add(this.cushionMesh);

          // LEGS
          const legGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.3, 16);

          this.addLeg(-width / 2 + 0.5, -0.25, -depth / 2 + 0.5, legGeometry, legMaterial);
          this.addLeg(width / 2 - 0.5, -0.25, -depth / 2 + 0.5, legGeometry, legMaterial);
          this.addLeg(-width / 2 + 0.5, -0.25, depth / 2 - 0.5, legGeometry, legMaterial);
          this.addLeg(width / 2 - 0.5, -0.25, depth / 2 - 0.5, legGeometry, legMaterial);
     }

     addLeg(x, y, z, legGeometry, legMaterial) {
          const leg = new THREE.Mesh(legGeometry, legMaterial);
          leg.position.set(x, y + 0.15, z);
          leg.castShadow = true;
          leg.receiveShadow = true;
          this.add(leg);
     }
}

export { MySofa };
