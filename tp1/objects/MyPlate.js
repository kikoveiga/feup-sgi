import * as THREE from 'three';

class MyPlate extends THREE.Object3D {
     constructor(app, radius = 0.65, height = 0.1, rim = 0.1) {
          super();
          this.app = app;

          const texture = new THREE.TextureLoader().load('./textures/quartz.jpg');

          this.plateMaterial = new THREE.MeshPhongMaterial({
               map: texture,
               color: "#ffffff", 
               specular: "#999999", 
               emissive: "#000000", 
               shininess: 50,
          });

          const plateBaseGeometry = new THREE.CylinderGeometry(radius, radius, height, 50);
          const plateBaseMesh = new THREE.Mesh(plateBaseGeometry, this.plateMaterial);
          plateBaseMesh.position.y = height / 2;

          const rimGeometry = new THREE.TorusGeometry(radius + rim, rim, 6, 50);
          const rimMesh = new THREE.Mesh(rimGeometry, this.plateMaterial);
          rimMesh.rotation.x = Math.PI / 2; 
          rimMesh.position.y = height; 

          this.add(plateBaseMesh);
          this.add(rimMesh);
     }
}

export { MyPlate };
