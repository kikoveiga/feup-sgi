import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyBalloon extends MyObject {
     constructor(app, name = 'balloon') {
          super(app, name);
          this.type = 'Group';
          this.group = new THREE.Group();
          this.add(this.group);

          // Balloon Body
          this.body = this.createBalloonBody();
          this.group.add(this.body);

          // Basket
          this.basket = this.createBalloonBasket();
          this.basket.position.set(0, -1.5, 0); 
          this.group.add(this.basket);

          // Shadow/Mark
          this.shadow = this.createShadow();
          this.shadow.position.set(0, -3, 0);
          this.group.add(this.shadow);

          // Initial Position
          this.group.position.set(0, 0, 0);

          // Movement properties
          this.altitude = 0; 
          this.windLayer = 0; 
          this.speed = 0;
     }

     createBalloonBody() {
          const geometry = new THREE.SphereGeometry(1, 32, 32);
          const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
          return new THREE.Mesh(geometry, material);
     }

     createBalloonBasket() {
          const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); 
          const material = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
          return new THREE.Mesh(geometry, material);
     }

     createShadow() {
          const geometry = new THREE.CircleGeometry(1, 32); 
          const material = new THREE.MeshBasicMaterial({
               color: 0x000000,
               transparent: true,
               opacity: 0.5,
          });
          const shadow = new THREE.Mesh(geometry, material);
          shadow.rotation.x = -Math.PI / 2; 
          return shadow;
     }
}

MyBalloon.prototype.isGroup = true;

export { MyBalloon };
