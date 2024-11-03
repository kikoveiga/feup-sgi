import * as THREE from 'three';
import { MyObject } from './MyObject.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyJar extends MyObject {
     constructor(app, name = 'jar') {
          super(app, name);
          
          this.app = app;
          this.builder = new MyNurbsBuilder(app);
          this.buildMaterial();
          this.buildHalfJar();
     }

     buildMaterial() {
          const textureBody = new THREE.TextureLoader().load('./textures/ceramic4.jpg');
          textureBody.wrapS = THREE.RepeatWrapping;
          textureBody.wrapT = THREE.RepeatWrapping;
          textureBody.repeat.set(1, 1.8); 

          this.bodyMaterial = new THREE.MeshPhongMaterial({
               map: textureBody,
               color: "#ffffff",
               shininess: 60,
               side: THREE.DoubleSide,
          });
     }

     buildHalfJar() {

     const halfJarControlPoints = [
          [
              [-0.75, 0, 0, 1],      
              [-1.5, 1, 0, 1],      
              [-0.25, 2.75, 0, 1],  
              [-1.25, 3.75, 0, 1]    
          ],
          [
              [0, 0, 1.5, 1],        
              [0, 1, 3, 1],          
              [0, 2.75, 0.5, 1],    
              [0, 3.75, 2.75, 1]    
          ],
          [
              [0.75, 0, 0, 1],      
              [1.5, 1, 0, 1],        
              [0.25, 2.75, 0, 1],   
              [1.25, 3.75, 0, 1]    
          ]
     ];
      
      
     const degreeU = 2;
     const degreeV = 2;
     const samplesU = 20;
     const samplesV = 20;
 
     const halfJarGeometry = this.builder.build(halfJarControlPoints, degreeU, degreeV, samplesU, samplesV);
     const halfJarMesh = new THREE.Mesh(halfJarGeometry, this.bodyMaterial);
     halfJarMesh.castShadow = true;
     halfJarMesh.receiveShadow = true;

     const halfJarMesh2 = new THREE.Mesh(halfJarGeometry, this.bodyMaterial)
     halfJarMesh2.rotation.y = Math.PI;
     halfJarMesh2.castShadow = true;
     halfJarMesh2.receiveShadow = true;
 
     const baseGeometry = new THREE.CircleGeometry(0.7, 80);  
     const baseMesh = new THREE.Mesh(baseGeometry, this.bodyMaterial);
     baseMesh.rotation.x = -Math.PI / 2;
     baseMesh.castShadow = true;
     baseMesh.receiveShadow = true;
 
     this.add(halfJarMesh);
     this.add(halfJarMesh2);
     this.add(baseMesh);
 }
 
 
}

export { MyJar };
