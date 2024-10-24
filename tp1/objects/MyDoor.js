import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyDoor extends MyObject {
     constructor(app, width = 4, height = 8, name = 'door') {
          super(app, name);
          
          const doorTexture = new THREE.TextureLoader().load('./textures/door.jpg'); 
          const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');

          const handleMaterial = new THREE.MeshPhongMaterial({
               map: ironTexture,
               color: "#dddddd",
               specular: "#808080",
               shininess: 70, 
               bumpScale: 0.1,  
          });

          const doorMaterial = new THREE.MeshPhongMaterial({ 
               map: doorTexture,
               color: 0xE5D3B3, 
               specular: "#5C4033",
               shininess: 10,
               side: THREE.FrontSide
          });

          const doorGeometry = new THREE.BoxGeometry(width, height, 0.1); 
          this.doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);

          const handleGeometry = new THREE.SphereGeometry( 0.15, 32, 16 );
          this.handleMesh = new THREE.Mesh(handleGeometry, handleMaterial); 

          const auxGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.15, 32);
          this.auxMesh = new THREE.Mesh(auxGeometry, handleMaterial);

          this.doorMesh.position.set(0, height / 2, -0.05);
          this.handleMesh.position.set(-1.3, height / 2 - 0.2, -0.3);
          this.auxMesh.position.set(-1.3, height / 2 - 0.2, -0.1);
          this.auxMesh.rotation.x = Math.PI / 2;

          this.add(this.doorMesh);
          this.add(this.handleMesh);
          this.add(this.auxMesh);
     }
}

export { MyDoor };
