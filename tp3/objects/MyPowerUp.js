import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class MyPowerUp extends MyObject {
     constructor(app, name, position = new THREE.Vector3(0, 0, 0), size = 0.5, color = 0x0000ff) {
          super(app, name);
          this.app = app;
          this.type = "Group";

          this.initialPosition = position.clone();
          this.amplitude = 0.5;
          this.speed = 0.25; 

          const powerupTexture = new THREE.TextureLoader().load('./images/powerup.jpg');
          const geometry = new THREE.BoxGeometry(size, size, size);
          const material = new THREE.MeshStandardMaterial({
               map: powerupTexture,
               color: color,
               roughness: 0.5,
               metalness: 0.1,
          });

          this.powerup = new THREE.Mesh(geometry, material);
          this.powerup.position.copy(position);
          this.powerup.castShadow = true;
          this.powerup.receiveShadow = true;
          this.add(this.powerup);
     }
}

export { MyPowerUp };
