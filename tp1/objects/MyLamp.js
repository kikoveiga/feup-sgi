import * as THREE from 'three';

class MyLamp extends THREE.Object3D {
     constructor(app, baseRadius = 0.5, baseHeight = 0.2, standRadius = 0.1, standHeight = 1, shadeRadius = 0.6, shadeHeight = 0.8) {
          super();
          this.app = app;

          const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');
          const lampTexture = new THREE.TextureLoader().load('./textures/lamp.jpg');

          const standMaterial = new THREE.MeshPhongMaterial({
               map: ironTexture,
               color: "#C0C0C0", 
               shininess: 100,
               specular: "#AAAAAA",
          });

          const shadeMaterial = new THREE.MeshPhongMaterial({
               map: lampTexture,
               color: "#ffe338", 
               shininess: 10,
               specular: "#888888",
               emissive: "#222222",
               side: THREE.DoubleSide,
          });

          // BASE
          const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 32);
          const baseMesh = new THREE.Mesh(baseGeometry, standMaterial);
          baseMesh.position.set(0, baseHeight / 2, 0);
          this.add(baseMesh);

          // STAND
          const standGeometry = new THREE.CylinderGeometry(standRadius, standRadius, standHeight, 32);
          const standMesh = new THREE.Mesh(standGeometry, standMaterial);
          standMesh.position.set(0, baseHeight + standHeight / 2, 0);
          this.add(standMesh);

          // SHADE
          const shadeGeometry = new THREE.CylinderGeometry(shadeRadius, shadeRadius + 0.2, shadeHeight, 32, 1, true);
          const shadeMesh = new THREE.Mesh(shadeGeometry, shadeMaterial);
          shadeMesh.position.set(0, baseHeight + standHeight + shadeHeight / 2, 0);
          this.add(shadeMesh);


     }
}
export { MyLamp };
