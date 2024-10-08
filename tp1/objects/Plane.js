import * as THREE from 'three';
import { SuperObject } from '/tp1/objects/SuperObject.js';


class Plane extends SuperObject {
     constructor(name, x, y, z, angle) {
          super(name, x, y, z, angle);
          this.planeMesh = null;
          this.diffusePlaneColor = "#00ffff"
          this.specularPlaneColor = "#777777"
          this.planeShininess = 30

          this.planeMaterial = new THREE.MeshPhongMaterial({ 
               color: this.diffusePlaneColor, 
               specular: this.specularPlaneColor, 
               emissive: "#000000", 
               shininess: this.planeShininess,
               side: THREE.DoubleSide 
          });

          
     }

     build() {
          let plane = new THREE.PlaneGeometry( 10, 10 );
          this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
          this.planeMesh.rotation.x = -Math.PI / 2;
          this.planeMesh.position.y = -0.1; 
          this.super.add(this.planeMesh);
     }

     selectMat(nMat) {
          this.planeMaterial = nMat;
          if (this.planeMesh) {
               this.planeMesh.material = nMat;
          }
     }
}


export { Plane };
