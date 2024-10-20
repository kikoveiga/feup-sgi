import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyFloor extends MyObject {
     constructor(app, width, length, isFloor, name = 'floor') {
          super(app, name);
          let texture;

          if (isFloor) {
               texture = new THREE.TextureLoader().load('./textures/wood.jpg');
               texture.wrapS = THREE.RepeatWrapping;
               texture.wrapT = THREE.RepeatWrapping;
               texture.repeat.set(6, 6);

          
               this.floorMaterial = new THREE.MeshPhysicalMaterial({
                    map: texture,
                    color: "#ffffff", 
                    roughness: 0.6,   
                    metalness: 0.0,    
                    reflectivity: 0.2, 
               });
          } 
          else {

               texture = new THREE.TextureLoader().load('./textures/ceiling.jpg');

               texture.wrapS = THREE.RepeatWrapping;
               texture.wrapT = THREE.RepeatWrapping;
               texture.repeat.set(6, 6);

  
               this.floorMaterial = new THREE.MeshPhysicalMaterial({
                    map: texture,
                    color: "#ffffff",  
                    roughness: 0.8,    
                    metalness: 0.0,    
                    reflectivity: 0.1, 
               });
          }

          const plane = new THREE.PlaneGeometry(width, length);
          this.planeMesh = new THREE.Mesh(plane, this.floorMaterial);
          this.planeMesh.rotation.x = -Math.PI / 2; 
          this.planeMesh.position.y = 0;
          this.add(this.planeMesh);
     }
}

export { MyFloor };
