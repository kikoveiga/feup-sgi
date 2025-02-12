import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class MyObstacle extends MyObject {
     constructor(app, name = "obstacle", position = new THREE.Vector3(0, 0, 0), size = 1, color = 0xffffff) {
          super(app, name);
          this.type = "Group";
    
          const obstacleTexture = new THREE.TextureLoader().load('./images/obstacle.jpg');
          const geometry = new THREE.BoxGeometry(size * 0.5, size, size * 0.5);
          const material = new THREE.MeshStandardMaterial({
               map: obstacleTexture,
               color: color,
               roughness: 0.5,
               metalness: 0.1,
          });

          this.obstacle = new THREE.Mesh(geometry, material);
          this.obstacle.position.copy(position);
          this.obstacle.castShadow = true;
          this.obstacle.receiveShadow = true;
          this.add(this.obstacle);
     }

}

export { MyObstacle };
