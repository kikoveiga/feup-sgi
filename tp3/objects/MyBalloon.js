import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyBalloon extends MyObject {
     constructor(app, name = 'balloon', color = 'orange') {
          super(app, name);
          this.type = 'Group';
          this.group = new THREE.Group();
          this.color = color;
          this.add(this.group);

          this.createTextures();

          // Balloon Body
          this.body = this.createBalloonBody();
          this.body.position.set(0, -0.5, 0);
          this.group.add(this.body);

          // Basket
          this.basket = this.createBalloonBasket();
          this.basket.position.set(0, -1.5, 0); 
          this.group.add(this.basket);

          this.ropes = this.createRopes();
          this.ropes.position.set(0, 4.5, 0);
          this.group.add(this.ropes);

          // Shadow/Mark
          // this.shadow = this.createShadow();
          // this.shadow.position.set(0, -3, 0);
          // this.group.add(this.shadow);

          // Initial Position
          this.group.position.set(0, 0, 0);

          // Movement properties
          this.altitude = 0; 
          this.windLayer = 0; 
          this.speed = 0;
     }

     updateAltitude(delta, direction) {

          const altitudeStep = 2;

          if (direction === 1 && this.windLayer < 4) this.windLayer++;
          else if (direction === -1 && this.windLayer > 0) this.windLayer--;

          const targetAltitude = this.windLayer * altitudeStep;

          this.altitude += (targetAltitude - this.altitude) * 0.1;
          this.group.position.y = this.altitude;
     }

     applyWindMovement(delta, windDirection, windSpeed) {
          const movement = windDirection.clone().multiplyScalar(windSpeed * delta);
          this.group.position.add(movement);
     }

     update(delta, windLayers) {
          const currentWind = windLayers[this.windLayer];
          this.applyWindMovement(delta, currentWind.direction, currentWind.speed);
     }

     createTextures() {
          const orangeTexture = new THREE.TextureLoader().load("./images/orange.jpg");
          this.orangeApp = new THREE.MeshStandardMaterial({
               map: orangeTexture,
               color: 0xff8000, 
               emissive: 0x1a0d00, 
               transparent: false,
               opacity: 1.0,
               side: THREE.DoubleSide,
          });

          const blueTexture = new THREE.TextureLoader().load("./images/blue.jpg");
          this.blueApp = new THREE.MeshStandardMaterial({
               map: blueTexture,
               color: 0x87cfff, 
               emissive: 0x1a1a33,
               transparent: false,
               opacity: 1.0,
               side: THREE.DoubleSide,
          });
           
          const pinkTexture = new THREE.TextureLoader().load("./images/pink.jpg");
          this.pinkApp = new THREE.MeshStandardMaterial({
               map: pinkTexture,
               color: 0xffb5c2, 
               emissive: 0x331a1a,
               transparent: false,
               opacity: 1.0,
               side: THREE.DoubleSide,
          });
           
          const greenTexture = new THREE.TextureLoader().load("./images/green.jpg");
          this.greenApp = new THREE.MeshStandardMaterial({
               map: greenTexture,
               color: 0x00cc00, 
               emissive: 0x003300, 
               transparent: false,
               opacity: 1.0,
               side: THREE.DoubleSide,
          });
            
          const ropeTexture = new THREE.TextureLoader().load("./scenes/textures/rope.jpg");
          this.ropeApp = new THREE.MeshStandardMaterial({
               color: 0xcccccc, 
               emissive: 0x000000, 
               map: ropeTexture,
               transparent: false,
               opacity: 1.0,
               side: THREE.DoubleSide,
          });

          const crateTexture = new THREE.TextureLoader().load("./scenes/textures/crate.jpg");
          this.crateApp = new THREE.MeshStandardMaterial({
               color: 0xffffff, 
               emissive: 0x000000, 
               map: crateTexture,
               transparent: false,
               opacity: 1.0,
               side: THREE.DoubleSide,
          });
     }

     createBalloonBody() {

          this.mat = null;
          if(this.color === 'orange') {
               this.mat = this.orangeApp;
          }
          else if(this.color === 'blue') {
               this.mat = this.blueApp;
          }
          else if(this.color === 'pink') {
               this.mat = this.pinkApp;
          }
          else if(this.color === 'green') {
               this.mat = this.greenApp;
          } else console.error('Invalid color for balloon');     

          const bodyGroup = new THREE.Group();
          // Sphere
          const sphereGeometry = new THREE.SphereGeometry(1.8, 16, 16, 0, Math.PI);
          const sphereMesh = new THREE.Mesh(sphereGeometry, this.mat);
          sphereMesh.rotation.x = THREE.MathUtils.degToRad(270);
          sphereMesh.position.set(0, 9.34, 0);
          sphereMesh.castShadow = true;
          sphereMesh.receiveShadow = true;
          bodyGroup.add(sphereMesh);
  
          // Cylinder
          const cylinderGeometry = new THREE.CylinderGeometry(1.0, 1.8, 1.7, 32, 1, false);
          const cylinderMesh = new THREE.Mesh(cylinderGeometry, this.mat);
          cylinderMesh.rotation.x = THREE.MathUtils.degToRad(180);
          cylinderMesh.position.set(0, 8.5, 0);
          cylinderMesh.castShadow = true;
          cylinderMesh.receiveShadow = true;
          bodyGroup.add(cylinderMesh);
  
          // Cone
          const coneGeometry = new THREE.ConeGeometry(1.0, 1.7, 32);
          const coneMesh = new THREE.Mesh(coneGeometry, this.mat);
          coneMesh.rotation.x = THREE.MathUtils.degToRad(180);
          coneMesh.position.set(0, 6.8, 0);
          coneMesh.castShadow = true;
          coneMesh.receiveShadow = true;
          bodyGroup.add(coneMesh);

          bodyGroup.scale.set(1.1, 1.0, 1.1);
          return bodyGroup;
     }

     createBalloonBasket() {
          const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); 
          geometry.translate(0, 6, 0);
          geometry.receiveShadow = true;
          geometry.castShadow = true;
          return new THREE.Mesh(geometry, this.crateApp);
     }

     createRopes() {
          const ropes = new THREE.Group();
          const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 6, 1);
          const rope1 = new THREE.Mesh(ropeGeometry, this.ropeApp);
          const rope2 = new THREE.Mesh(ropeGeometry, this.ropeApp);
          const rope3 = new THREE.Mesh(ropeGeometry, this.ropeApp);
          const rope4 = new THREE.Mesh(ropeGeometry, this.ropeApp);

          rope1.rotation.x = THREE.MathUtils.degToRad(5);
          rope1.rotation.z = THREE.MathUtils.degToRad(5);
          rope1.position.set(-0.35, 1.2, 0.4);

          rope2.rotation.x = THREE.MathUtils.degToRad(-5);
          rope2.rotation.z = THREE.MathUtils.degToRad(5);
          rope2.position.set(-0.35, 1.2, -0.4);

          rope3.rotation.x = THREE.MathUtils.degToRad(-5);
          rope3.rotation.z = THREE.MathUtils.degToRad(-5);
          rope3.position.set(0.35, 1.2, -0.4);

          rope4.rotation.x = THREE.MathUtils.degToRad(5);
          rope4.rotation.z = THREE.MathUtils.degToRad(-5);
          rope4.position.set(0.35, 1.2, 0.4);

          rope1.receiveShadow = true;
          rope1.castShadow = true;
          rope2.receiveShadow = true;
          rope2.castShadow = true;
          rope3.receiveShadow = true;
          rope3.castShadow = true;
          rope4.receiveShadow = true;
          rope4.castShadow = true;

          ropes.add(rope1);
          ropes.add(rope2);
          ropes.add(rope3);
          ropes.add(rope4);
          return ropes;
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
