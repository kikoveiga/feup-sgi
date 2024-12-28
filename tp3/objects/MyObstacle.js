import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class MyObstacle extends MyObject {
     constructor(app, name, position = new THREE.Vector3(0, 0, 0), size = 1, color = 0xffffff) {
          super();
          this.name = name;
          this.app = app;
          this.type = "Group";

          // this.initialPosition = position.clone();

          // this.amplitude = 0.5;
          // this.speed = 0.1;       
          const obstacleTexture = new THREE.TextureLoader().load('./images/obstacle.jpg');
          const geometry = new THREE.BoxGeometry(size, size, size);
          const material = new THREE.MeshStandardMaterial({
               map: obstacleTexture,
               color: color,
               roughness: 0.5,
               metalness: 0.1,
          });

          this.obstacle = new THREE.Mesh(geometry, material);
          // this.obstacle.castShadow = true;
          // this.obstacle.receiveShadow = true;
          this.obstacle.position.copy(position);

          this.add(this.obstacle);
     }

 
     update(delta) {
          // const time = this.app.clock.getElapsedTime(); 
          // this.obstacle.position.y = this.initialPosition.y + Math.sin(time * this.speed) * this.amplitude;
          // this.obstacle.rotation.y += delta * 0.2;
     }
}

export { MyObstacle };
