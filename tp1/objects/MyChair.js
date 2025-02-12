import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyChair extends MyObject {
     constructor(app, name = 'chair', seatWidth = 2, seatDepth = 1.7, seatHeight = 0.2, legRadius = 0.08, legHeight = 1.5, backrestHeight = 2) {
          super(app, name);
          this.type = 'Group';

          const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');

          const seatMaterial = new THREE.MeshPhysicalMaterial({
               map: ironTexture,           
               color: "#dddddd",           
               roughness: 0.5,              
               metalness: 0.2,            
               bumpMap: ironTexture,        
               bumpScale: 0.02,             
               reflectivity: 0.5,           
          });
          
          const legMaterial = new THREE.MeshPhysicalMaterial({
               map: ironTexture,            
               color: "#808080",           
               roughness: 0.3,              
               metalness: 0.6,              
               bumpMap: ironTexture,        
               bumpScale: 0.02,             
               reflectivity: 0.7,          
          });
 

          const seatGeometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
          const seatMesh = new THREE.Mesh(seatGeometry, seatMaterial);
          seatMesh.position.y = legHeight; 
          seatMesh.castShadow = true;
          seatMesh.receiveShadow = true;
          this.add(seatMesh);

          const createLeg1 = (x, z) => {
               const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32);
               const legMesh = new THREE.Mesh(legGeometry, legMaterial);
               legMesh.position.set(x, legHeight / 2, z);
               legMesh.castShadow = true;
               legMesh.receiveShadow = true;
               this.add(legMesh);
          };

          const createLeg2 = (x, z) => {
               const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight + 2, 32);
               const legMesh = new THREE.Mesh(legGeometry, legMaterial);
               legMesh.position.set(x, legHeight + 0.3, z);
               legMesh.castShadow = true;
               legMesh.receiveShadow = true;
               this.add(legMesh);
          };

          const offset = seatWidth / 2 - legRadius - 0.17;

          createLeg1(offset, offset);     
          createLeg1(-offset, offset);   
          createLeg2(offset, -offset);    
          createLeg2(-offset, -offset);  
          
          const backrestWidth = seatWidth;
          const backrestGeometry1 = new THREE.BoxGeometry(backrestWidth, backrestHeight / 3 - 0.15, seatHeight);
          const backrestGeometry2 = new THREE.BoxGeometry(backrestWidth, backrestHeight / 3 - 0.15, seatHeight);
          const backrestGeometry3 = new THREE.BoxGeometry(backrestWidth, backrestHeight / 3 - 0.15, seatHeight);
          const backrestMesh1 = new THREE.Mesh(backrestGeometry1, seatMaterial);
          const backrestMesh2 = new THREE.Mesh(backrestGeometry2, seatMaterial);
          const backrestMesh3 = new THREE.Mesh(backrestGeometry3, seatMaterial);
          backrestMesh1.position.set(0, legHeight + backrestHeight / 2 - 0.5, -seatDepth / 2 + seatHeight / 2);  
          backrestMesh2.position.set(0, legHeight + backrestHeight / 2 + 0.1, -seatDepth / 2 + seatHeight / 2);  
          backrestMesh3.position.set(0, legHeight + backrestHeight / 2 + 0.7, -seatDepth / 2 + seatHeight / 2);  
          backrestMesh1.castShadow = true;
          backrestMesh1.receiveShadow = true;
          backrestMesh2.castShadow = true;
          backrestMesh2.receiveShadow = true;
          backrestMesh3.castShadow = true;
          backrestMesh3.receiveShadow = true;
          this.add(backrestMesh1);
          this.add(backrestMesh2);
          this.add(backrestMesh3);
     }
}

MyChair.prototype.isGroup = true;

export { MyChair };
