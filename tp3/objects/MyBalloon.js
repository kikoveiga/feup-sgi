import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyBalloon extends MyObject {
     constructor(app, name = 'balloon', color = 'orange', isPlayer = false) {
          super(app, name);
          this.type = 'Group';
          this.group = new THREE.Group();
          this.color = color;
          this.add(this.group);

          this.createTextures();
          this.raycaster = new THREE.Raycaster();

          this.distance = 1000;

          this.lod = new THREE.LOD();
          const highBody = this.createBalloonBodyHigh(); 
          const lowBody  = this.createBalloonBodyLow(); 
          this.lod.addLevel(highBody, 0);     
          this.lod.addLevel(lowBody, this.distance); 
          this.lod.position.set(0, -0.5, 0);
          this.group.add(this.lod);

          // Basket LOD
          this.basketLod = new THREE.LOD();
          const highBasket = this.createBalloonBasketHigh();
          const lowBasket = this.createBalloonBasketLow();
          this.basketLod.addLevel(highBasket, 0);
          this.basketLod.addLevel(lowBasket, this.distance);
          this.basketLod.position.set(0, 4.5, 0);
          this.group.add(this.basketLod);

          // Ropes LOD
          this.ropesLod = new THREE.LOD();
          const highRopes = this.createRopesHigh();
          const lowRopes = this.createRopesLow();
          this.ropesLod.addLevel(highRopes, 0);
          this.ropesLod.addLevel(lowRopes, this.distance);
          this.ropesLod.position.set(0, 4.5, 0);
          this.group.add(this.ropesLod);

          // Shadow
          if(isPlayer){
               this.shadow = this.createShadow();
               this.shadow.position.set(0, 1.5, 0); 
               this.group.add(this.shadow);
               // console.log(this.shadow);
          }

          // Movement properties
          this.altitude = 0; 
          this.windLayer = 0; 
          this.speed = 0;

          this.windLayers = [
               { direction: new THREE.Vector3(0, 0, 0), speed: 0 },
               { direction: new THREE.Vector3(0, 0, 1), speed: 40 },
               { direction: new THREE.Vector3(0, 0, -1), speed: 40 },
               { direction: new THREE.Vector3(-1, 0, 0), speed: 40 },
               { direction: new THREE.Vector3(1, 0, 0), speed: 40 },
          ];

     }

     updateAltitude(delta, direction) {

          const altitudeStep = 3;
          const smoothFactor = 2;

          this.altitude += direction * altitudeStep * delta * smoothFactor;

          this.altitude = THREE.MathUtils.clamp(this.altitude, 0, altitudeStep * this.windLayers.length);

          const nextLayer = Math.floor(this.altitude / altitudeStep);
          if (nextLayer !== this.windLayer) {
               this.windLayer = THREE.MathUtils.clamp(nextLayer, 0, this.windLayers.length - 1);
          }

          this.group.position.y = this.altitude;
     }

     applyWindMovement(delta, windDirection, windSpeed) {
          const movement = windDirection.clone().multiplyScalar(windSpeed * delta);

          const targetPosition = this.group.position.clone().add(movement);
          this.group.position.lerp(targetPosition, 0.1);
     }

     update(delta) {
          const currentWind = this.windLayers[this.windLayer];
          this.applyWindMovement(delta, currentWind.direction, currentWind.speed);

          if (this.shadow) {
               const balloonWorldPos = new THREE.Vector3();
               this.group.getWorldPosition(balloonWorldPos);
          
               this.shadow.position.set(balloonWorldPos.x, 5, balloonWorldPos.z);
               this.shadow.visible = true; 
          }
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

     createBalloonBodyHigh() {

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
          const cylinderGeometry = new THREE.CylinderGeometry(1.0, 1.8, 1.7, 32, 1, true);
          const cylinderMesh = new THREE.Mesh(cylinderGeometry, this.mat);
          cylinderMesh.rotation.x = THREE.MathUtils.degToRad(180);
          cylinderMesh.position.set(0, 8.5, 0);
          cylinderMesh.castShadow = true;
          cylinderMesh.receiveShadow = true;
          bodyGroup.add(cylinderMesh);
  
          // Cone
          const cylinderGeometry2 = new THREE.CylinderGeometry(1.0, 0.35, 1.0, 32, 1, true);
          const coneMesh = new THREE.Mesh(cylinderGeometry2, this.mat);
          coneMesh.rotation.x = THREE.MathUtils.degToRad(0);
          coneMesh.position.set(0, 7.15, 0);
          coneMesh.castShadow = true;
          coneMesh.receiveShadow = true;
          bodyGroup.add(coneMesh);

          const sphereGeometry2 = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI);
          const sphereMesh2 = new THREE.Mesh(sphereGeometry2, this.mat);
          sphereMesh2.rotation.x = THREE.MathUtils.degToRad(90);
          sphereMesh2.position.set(0, 6.7, 0);
          sphereMesh2.castShadow = true;
          sphereMesh2.receiveShadow = true;
          bodyGroup.add(sphereMesh2);

          bodyGroup.scale.set(1.1, 1.0, 1.1);
          return bodyGroup;
     }

     createBalloonBodyLow() {
          const geometry = new THREE.SphereGeometry(2.2, 32, 32); 
          const bodyMesh = new THREE.Mesh(geometry, this.mat);
      
          bodyMesh.rotation.x = THREE.MathUtils.degToRad(270);
          bodyMesh.position.set(0, 9, 0);
          bodyMesh.castShadow = true;
          bodyMesh.receiveShadow = true;
      
          const group = new THREE.Group();
          group.add(bodyMesh);
          return group;
     }

     createBalloonBasketHigh() {
          const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); 
          geometry.receiveShadow = true;
          geometry.castShadow = true;
          return new THREE.Mesh(geometry, this.crateApp);
     }
      
     createBalloonBasketLow() {
          const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7); 
          return new THREE.Mesh(geometry, this.crateApp);
     }
      

     createRopesHigh() {
          const ropes = new THREE.Group();
          const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 6, 1); 
      
          const createRope = (x, y, z, rotX, rotZ) => {
              const rope = new THREE.Mesh(ropeGeometry, this.ropeApp);
              rope.rotation.x = THREE.MathUtils.degToRad(rotX);
              rope.rotation.z = THREE.MathUtils.degToRad(rotZ);
              rope.position.set(x, y, z);
              rope.receiveShadow = true;
              rope.castShadow = true;
              return rope;
          };
      
          ropes.add(createRope(-0.35, 1.2, 0.4, 5, 5));
          ropes.add(createRope(-0.35, 1.2, -0.4, -5, 5));
          ropes.add(createRope(0.35, 1.2, -0.4, -5, -5));
          ropes.add(createRope(0.35, 1.2, 0.4, 5, -5));
          return ropes;
     }
      
     createRopesLow() {
          const ropes = new THREE.Group();
          const ropeGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 4, 1);
      
          const createRope = (x, y, z) => {
              const rope = new THREE.Mesh(ropeGeometry, this.ropeApp);
              rope.position.set(x, y, z);
              return rope;
          };
          
          ropes.add(createRope(-0.3, 1.2, 0.3));
          ropes.add(createRope(-0.3, 1.2, -0.3));
          ropes.add(createRope(0.3, 1.2, -0.3));
          ropes.add(createRope(0.3, 1.2, 0.3));
          return ropes;
     }
      

     createShadow() {

          const geometry = new THREE.CircleGeometry(1.0, 32); 
          const material = new THREE.MeshBasicMaterial({
              color: 0x000000,
              opacity: 0.5,
              transparent: true,
              side: THREE.DoubleSide
          });

          const shadowMesh = new THREE.Mesh(geometry, material);
          shadowMesh.rotation.x = -Math.PI / 2; 
          shadowMesh.scale.set(1.5, 1.5, 1.5);
          shadowMesh.visible = true; 
          return shadowMesh;
     }
      
}

MyBalloon.prototype.isGroup = true;

export { MyBalloon };
