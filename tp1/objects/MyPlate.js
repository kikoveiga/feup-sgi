import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyPlate extends MyObject {
     constructor(app, name = 'plate', radius = 0.65, height = 0.1, rim = 0.07) {
          super(app, name);

          const texture = new THREE.TextureLoader().load('./textures/quartz.jpg');

          this.plateMaterial = new THREE.MeshPhongMaterial({
               map: texture,
               color: "#ffffff", 
               specular: "#999999", 
               emissive: "#000000", 
               shininess: 50,
          });

          const plateBaseGeometry = new THREE.CylinderGeometry(radius, radius, height, 50);
          const plateBaseMesh = new THREE.Mesh(plateBaseGeometry, this.plateMaterial);
          plateBaseMesh.position.y = height / 2;
          plateBaseMesh.castShadow = true;
          plateBaseMesh.receiveShadow = true;

          const rimGeometry = new THREE.TorusGeometry(radius + rim, rim, 6, 50);
          const rimMesh = new THREE.Mesh(rimGeometry, this.plateMaterial);
          rimMesh.rotation.x = Math.PI / 2; 
          rimMesh.position.y = height - 0.01; 
          rimMesh.castShadow = true;
          rimMesh.receiveShadow = true;
          
          this.add(plateBaseMesh);
          this.add(rimMesh);
     }
}

export { MyPlate };
