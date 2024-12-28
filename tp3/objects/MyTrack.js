import * as THREE from "three";
import { MyObject } from "./MyObject.js";
import { MyObstacle } from "./MyObstacle.js";
import { MyPowerup } from "./MyPowerUp.js";
import { MyRoute } from "./MyRoute.js";

class MyTrack extends MyObject {
     constructor(app, name) {
          super();
          this.name = name;
          this.app = app;
          this.type = 'Group';

          //Curve related attributes
          this.segments = 100;
          this.width = 1;
          this.textureRepeat = 1;
          this.showWireframe = false;
          this.showMesh = true;
          this.showLine = true;
          this.closedCurve = true;

          this.path = new THREE.CatmullRomCurve3([
               // vertical
               new THREE.Vector3(-2, 0, 5),
               new THREE.Vector3(-2, 0, 3),
               new THREE.Vector3(-2, 0, 1),
               new THREE.Vector3(-2, 0, -1),
               new THREE.Vector3(-2, 0, -3),
               new THREE.Vector3(-2, 0.1, -5),
           
               // bottom
               new THREE.Vector3(4.5, 0, -5),
               new THREE.Vector3(6, 0, -4),
               new THREE.Vector3(5.75, 0, -2.5),
               new THREE.Vector3(5, 0, -1.5),
               new THREE.Vector3(1, 0.1, 0),
           
               // top
               new THREE.Vector3(4.5, -0.1, 1.5),
               new THREE.Vector3(5.5, 0, 3),
               new THREE.Vector3(4, 0, 5),
               new THREE.Vector3(0.5, 0, 5),
           
               // connect
               new THREE.Vector3(-2.85, 0.1, 5),
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
              new THREE.Vector3(-5, 2, -2),  
              new THREE.Vector3(2.5, 1, -2),   
              new THREE.Vector3(1.5, 1.5, 1.7),   
              new THREE.Vector3(0, 2.5, 5)     
          ];

          obstaclePositions.forEach((pos, index) => {
              const obstacle = new MyObstacle(this.app, `Obstacle_${index}`, pos, 0.5, 0xffffff);
              this.obstacles.push(obstacle);
              this.add(obstacle);
          });
     }

     initializePowerUps() {
          this.powerUps = [];
  
          const powerUpPositions = [
              new THREE.Vector3(-4, 2, -5),
              new THREE.Vector3(2.4, 2, -3),
              new THREE.Vector3(1.7, 2, 3),
              new THREE.Vector3(-3, 2, 5),
              new THREE.Vector3(-1.5, 2, 0.5),
          ];
  
          powerUpPositions.forEach((pos, index) => {
              const powerUp = new MyPowerup(this.app, `PowerUp_${index}`, pos, 0.35, 0xffffff);
              this.powerUps.push(powerUp);
              this.add(powerUp); 
          });
     }

     initializeRoute() {
          this.myRoute = new MyRoute(this.app, "RouteRings", this.path, 12);
          this.myRoute.position.set(-3, 1.5, 0);

          this.add(this.myRoute);
     }

     update(delta) {
          this.obstacles.forEach((obstacle) => {
              obstacle.update(delta); 
          });
          this.powerUps.forEach((power) => {
               power.update(delta); 
          });

          if (this.myRoute) {
               this.myRoute.update(delta);
          }
     }
      
}

MyTrack.prototype.isGroup = true;

export { MyTrack };
