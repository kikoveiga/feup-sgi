import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyStudioLamp extends MyObject {
     constructor(app, width = 5, height = 0.1, depth = 1.5, cableLength = 1.5, name = 'studio lamp') {
          super(app, name);
          
          const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');

          const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
          const lampBodyMaterial = new THREE.MeshPhongMaterial({
               map: ironTexture,  
               color: "#808080",  
               specular: "#ffffff",  
               shininess: 70, 
               bumpScale: 0.1,  
          });

          const lampBodyGeometry = new THREE.BoxGeometry(width, height, depth);
          const lampBody = new THREE.Mesh(lampBodyGeometry, lampBodyMaterial);
          
          const rectLight = new THREE.RectAreaLight(0xffffff, 8, width, depth);
          rectLight.position.set(0, -height / 2, 0); 
          rectLight.rotation.y = Math.PI / 2;
          rectLight.lookAt(0, -1, 0); 

          const cableGeometry = new THREE.CylinderGeometry(0.01, 0.01, cableLength, 8);
          const leftCable = new THREE.Mesh(cableGeometry, cableMaterial);
          leftCable.position.set(-width / 2 + 0.3, cableLength / 2 - 0.7, 0);
          const rightCable = new THREE.Mesh(cableGeometry, cableMaterial);
          rightCable.position.set(width / 2 - 0.3, cableLength / 2 - 0.7 , 0);
          
          lampBody.position.set(0, -cableLength / 2, 0);
          rectLight.position.set(0, -cableLength / 2 - height / 2, 0);
          
          lampBody.receiveShadow = true;
          lampBody.castShadow = true;

          rightCable.receiveShadow = true;
          rightCable.castShadow = true;

          leftCable.receiveShadow = true;
          leftCable.castShadow = true;

          rectLight.castShadow = true;

          this.add(lampBody);
          this.add(rectLight);
          this.add(rightCable);
          this.add(leftCable);
     }
}

export { MyStudioLamp };
