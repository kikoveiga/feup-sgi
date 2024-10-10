import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyCup extends MyObject {
     constructor(app, radiusTop = 0.8, radiusBottom = 0.6, height = 1.35, handleRadius = 0.4, handleThickness = 0.1, coffeeHeight = 1, name = 'cup') {
          super(app, name);

          const cupTexture = new THREE.TextureLoader().load('./textures/ceramic.jpg');
          const coffeeTexture = new THREE.TextureLoader().load('./textures/coffee.jpg'); 

          const cupMaterial1 = new THREE.MeshPhongMaterial({
               map: cupTexture,
               color: "#ffffff", 
               specular: "#aaaaaa",
               shininess: 100,
               side: THREE.DoubleSide
          });

          const cupMaterial2 = new THREE.MeshPhongMaterial({
               map: cupTexture,
               color: "#ffffff", 
               specular: "#aaaaaa",
               shininess: 100,
          });

          const coffeeMaterial = new THREE.MeshPhongMaterial({
              map: coffeeTexture,
              transparent: true,
              opacity: 0.9,
              shininess: 10,
              side: THREE.DoubleSide
          });

          // CUP
          const cupGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32, 1, true);
          const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial1);
          cupMesh.position.y = height / 2;
          this.add(cupMesh);
          
          // BOTTOM CIRCLE
          const bottomCircleGeometry = new THREE.CircleGeometry(radiusBottom, 32);
          const bottomCircleMesh = new THREE.Mesh(bottomCircleGeometry, cupMaterial1);
          bottomCircleMesh.position.y = 0;
          bottomCircleMesh.rotation.x = -Math.PI / 2;
          this.add(bottomCircleMesh);

          // HANDLE
          const handleGeometry = new THREE.TorusGeometry(handleRadius, handleThickness, 16, 100, 240 * Math.PI/ 180);
          const handleMesh = new THREE.Mesh(handleGeometry, cupMaterial2);
          handleMesh.position.set(radiusTop + handleThickness - 0.04, height / 2 - 0.1, 0);
          handleMesh.rotation.z = 230 * Math.PI / 180;
          this.add(handleMesh);

          // COFFEE
          const coffeeGeometry = new THREE.CylinderGeometry(radiusTop - 0.05, radiusBottom - 0.05, coffeeHeight, 32, 1, false);
          const coffeeMesh = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
          coffeeMesh.position.y = (coffeeHeight / 2) + 0.1; 
          this.add(coffeeMesh);
     }
}

export { MyCup };
