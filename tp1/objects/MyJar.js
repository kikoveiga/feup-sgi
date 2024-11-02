import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyJar extends MyObject {
     constructor(app, name = 'jar') {
          super(app, name);

          const textureBody = new THREE.TextureLoader().load('./textures/ceramic4.jpg');
          const textureDirt = new THREE.TextureLoader().load('./textures/dirt.jpg');
          textureBody.wrapS = THREE.RepeatWrapping;
          textureBody.wrapT = THREE.RepeatWrapping;
          textureBody.repeat.set(1, 1.8); 

          const bodyMaterial = new THREE.MeshPhongMaterial({
               map: textureBody,
               color: "#ffffff",
               shininess: 60,
               side: THREE.DoubleSide,
          });

          const dirtMaterial = new THREE.MeshPhongMaterial({
               map: textureDirt,
               color: "#aaaaaa",
               shininess: 0,
          });

          const bodyProfile = [
               new THREE.Vector2(0.3, 0),     
               new THREE.Vector2(0.3, 0.2),   
               new THREE.Vector2(0.5, 1.0),   
               new THREE.Vector2(0.6, 1.5),   
               new THREE.Vector2(0.55, 2.0),  
               new THREE.Vector2(0.45, 2.3),   
               new THREE.Vector2(0.4, 2.6),    
               new THREE.Vector2(0.35, 2.8),   
               new THREE.Vector2(0.4, 3.0),   
          ];

          const bodyGeometry = new THREE.LatheGeometry(bodyProfile, 80);
          const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
          bodyMesh.castShadow = true;
          bodyMesh.receiveShadow = true;

          const baseGeometry = new THREE.CircleGeometry(bodyProfile[0].x, 80);
          const baseMesh = new THREE.Mesh(baseGeometry, bodyMaterial);
          baseMesh.rotation.x = -Math.PI / 2; 
          baseMesh.position.y = 0;           
          baseMesh.castShadow = true;
          baseMesh.receiveShadow = true;

          const topGeometry = new THREE.CircleGeometry(bodyProfile[bodyProfile.length - 1].x - 0.04, 80);
          const topMesh = new THREE.Mesh(topGeometry, dirtMaterial);
          topMesh.rotation.x = -Math.PI / 2; 
          topMesh.position.y = 2.75;        
          topMesh.castShadow = true;
          topMesh.receiveShadow = true;

          this.add(bodyMesh);
          this.add(baseMesh);
          this.add(topMesh);
     }
}

export { MyJar };
