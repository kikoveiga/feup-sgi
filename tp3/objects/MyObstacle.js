import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class MyObstacle extends MyObject {
     constructor(app, name, position = new THREE.Vector3(0, 0, 0), size = 1, color = 0xffffff) {
          super();
          this.name = name;
          this.app = app;
          this.type = "Group";
    
          const obstacleTexture = new THREE.TextureLoader().load('./images/obstacle.jpg');
          const geometry = new THREE.BoxGeometry(size, size, size);
          const material = new THREE.MeshStandardMaterial({
               map: obstacleTexture,
               color: color,
               roughness: 0.5,
               metalness: 0.1,
          });

          this.obstacle = new THREE.Mesh(geometry, material);
          this.obstacle.position.copy(position);

          this.add(this.obstacle);
     }

}

export { MyObstacle };
