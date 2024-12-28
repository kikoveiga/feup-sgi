import * as THREE from "three";


/**
 *  This class contains the contents of out application
 */
class MyTrack extends THREE.Object3D {
     constructor(app) {
          super();
          this.app = app;
          this.type = 'Group';

          //Curve related attributes
          this.segments = 100;
          this.width = 1;
          this.textureRepeat = 1;
          this.showWireframe = false;
          this.showMesh = true;
          this.showLine = true;
          this.closedCurve = false;

          this.path = new THREE.CatmullRomCurve3([
               // vertical
               new THREE.Vector3(-2, 0, 5),
               new THREE.Vector3(-2, 0, 3),
               new THREE.Vector3(-2, 0, 1),
               new THREE.Vector3(-2, 0, -1),
               new THREE.Vector3(-2, 0, -3),
               new THREE.Vector3(-2, 0, -5),
           
               // bottom
               new THREE.Vector3(4.5, 0, -5),
               new THREE.Vector3(6, 0, -4),
               new THREE.Vector3(5.75, 0, -2.5),
               new THREE.Vector3(5, 0, -1.5),
               new THREE.Vector3(1, 0.05, 0),
           
               // top
               new THREE.Vector3(4.5, -0.05, 1.5),
               new THREE.Vector3(5.5, 0, 3),
               new THREE.Vector3(4, 0, 5),
               new THREE.Vector3(0.5, 0, 5),
           
               // connect
               new THREE.Vector3(-2.85, 0.05, 5),
           ]);
           

          this.createCurveMaterialsTextures();
          this.createCurveObjects();
     }

     createCurveMaterialsTextures() {
          const texture = new THREE.TextureLoader().load("./images/track.jpg");
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(4, 4);
      

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

     update() {}
}

MyTrack.prototype.isGroup = true;

export { MyTrack };
