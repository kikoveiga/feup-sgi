import * as THREE from "three";
import { MyObject } from "./MyObject.js";
import { MyObstacle } from "./MyObstacle.js";
import { MyPowerUp } from "./MyPowerUp.js";
import { MyRoute } from "./MyRoute.js";

class MyTrack extends MyObject {
     constructor(app, name = "Track") {
          super(app, name);
          this.type = 'Group';

          //Curve related attributes
          this.segments = 100;
          this.width = 2.0;
          this.textureRepeat = 1;
          this.showWireframe = false;
          this.showMesh = true;
          this.showLine = false;
          this.closedCurve = true;

          this.multiplier = 2.0;

          this.path = new THREE.CatmullRomCurve3([
              // vertical
              new THREE.Vector3(-2 * this.multiplier, 0, 5 * this.multiplier),
              new THREE.Vector3(-2 * this.multiplier, 0, 3 * this.multiplier),
              new THREE.Vector3(-2 * this.multiplier, 0, 1 * this.multiplier),
              new THREE.Vector3(-2 * this.multiplier, 0, -1 * this.multiplier),
              new THREE.Vector3(-2 * this.multiplier, 0, -3 * this.multiplier),
              new THREE.Vector3(-2 * this.multiplier, 0.1, -5 * this.multiplier),
          
              // bottom
              new THREE.Vector3(4.5 * this.multiplier, 0, -5 * this.multiplier),
              new THREE.Vector3(6 * this.multiplier, 0, -4 * this.multiplier),
              new THREE.Vector3(5.75 * this.multiplier, 0, -2.5 * this.multiplier),
              new THREE.Vector3(5 * this.multiplier, 0, -1.5 * this.multiplier),
              new THREE.Vector3(1 * this.multiplier, 0.8, 0 * this.multiplier),
          
              // top
              new THREE.Vector3(4.5 * this.multiplier, -0.1, 1.5 * this.multiplier),
              new THREE.Vector3(5.5 * this.multiplier, 0, 3 * this.multiplier),
              new THREE.Vector3(4 * this.multiplier, 0, 5 * this.multiplier),
              new THREE.Vector3(0.5 * this.multiplier, 0, 5 * this.multiplier),
          
              // connect
              new THREE.Vector3(-2.85 * this.multiplier, 0.5, 5 * this.multiplier),
          ]);
           

          this.createCurveMaterialsTextures();
          this.createCurveObjects();
          this.initializeObstacles();
          this.initializePowerUps();
          this.initializeRoute();
     }

     createCurveMaterialsTextures() {
          const texture = new THREE.TextureLoader().load("./images/road.jpg");
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(5, 3);
      

          this.material = new THREE.MeshStandardMaterial({
              map: texture,               
              roughness: 0.5,             
              metalness: 0.3,             
              side: THREE.DoubleSide,     
          });
      
          const normalTexture = new THREE.TextureLoader().load("./images/track_normal.jpg");
          this.material.normalMap = normalTexture;
          this.material.normalScale.set(1, 1); 
      
          this.wireframeMaterial = new THREE.MeshBasicMaterial({
              color: 0x0000ff,
              opacity: 0.3,
              wireframe: true,
              transparent: true,
          });
      
          this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
     }
      
     createCurveObjects() {
          let geometry = new THREE.TubeGeometry(
               this.path,
               this.segments,
               this.width,
               3,
               this.closedCurve
          );
          this.mesh = new THREE.Mesh(geometry, this.material);
          this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

          let points = this.path.getPoints(this.segments);
          let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

          this.line = new THREE.Line(bGeometry, this.lineMaterial);

          this.curve = new THREE.Group();

          this.mesh.visible = this.showMesh;
          this.wireframe.visible = this.showWireframe;
          this.line.visible = this.showLine;

          this.curve.add(this.mesh);
          this.curve.add(this.wireframe);
          this.curve.add(this.line);

          this.curve.rotateZ(Math.PI);
          this.curve.scale.set(1, 0.2, 1);
          this.add(this.curve);
     }

     initializeObstacles() {
          this.obstacles = [];

          const obstaclePositions = [
              new THREE.Vector3(-2.7 * this.multiplier, 1.8, -0.5 * this.multiplier),  
              new THREE.Vector3(-2.5 * this.multiplier, 1.8, -4.8 * this.multiplier),   
              new THREE.Vector3(1 * this.multiplier, 1.8, 4.65 * this.multiplier),   
              new THREE.Vector3(-5 * this.multiplier, 1.8, -5.1 * this.multiplier)     
          ];

          obstaclePositions.forEach((pos, index) => {
              const obstacle = new MyObstacle(this.app, `Obstacle_${index}`, pos, 1, 0xffffff);
              obstacle.scale.set(1, 3, 1);
              obstacle.position.y = -3.6;
              this.obstacles.push(obstacle);
              this.add(obstacle);
          });
     }

     initializePowerUps() {
          this.powerUps = [];
  
          const powerUpPositions = [
              new THREE.Vector3(-5.5 * this.multiplier, 2.0, -3.0 * this.multiplier), 
              new THREE.Vector3(-4.5 * this.multiplier, 1.0, 2.2 * this.multiplier),
              new THREE.Vector3(2.3 * this.multiplier, 3.0, 3.0 * this.multiplier), 
          ];
  
          powerUpPositions.forEach((pos, index) => {
              const powerUp = new MyPowerUp(this.app, `PowerUp_${index}`, pos, 0.6, 0xffffff);
              this.powerUps.push(powerUp);
              this.add(powerUp); 
          });
     }

     initializeRoute() {
          this.myRoute = new MyRoute(this.app, "RouteRings", this.path, 10);
          // this.myRoute.createRoute();
          this.myRoute.scale.set(0.11, 0.1, 0.1);
          this.myRoute.position.set(0, 1.2, 0);
          this.myRoute.rotation.y = Math.PI;
          this.myRoute.rotation.x = Math.PI;
          this.add(this.myRoute);
     }

     getPowerUps() {
          return this.powerUps;
     }

     getObstacles() {
          return this.obstacles;
     }
     
     update(delta) {
     }
      
}

MyTrack.prototype.isGroup = true;

export { MyTrack };
