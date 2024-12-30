import * as THREE from "three";
import { MyObject } from "./MyObject.js";


class MyRoute extends MyObject {
    constructor(app, name) {
          super();
          this.app = app;
          this.name = name;
          this.type = "Group";

          this.route = [
               new THREE.Vector3(-2, 0, -1), 
               new THREE.Vector3(-2, 0, 2.5), 
               new THREE.Vector3(-1.8, 0, 3.75), 
               new THREE.Vector3(-1.6, 0, 4.7), 
               new THREE.Vector3(-1.0, 0, 5.3), 
               new THREE.Vector3(0.5, 0, 5), 
               new THREE.Vector3(2.8, 0, 4.8),
               new THREE.Vector3(3.5, 0, 4.6),
               new THREE.Vector3(4.2, 0, 4.25),
               new THREE.Vector3(4.5, 0, 3.7),
               new THREE.Vector3(4.7, 0, 3.1),
               new THREE.Vector3(4.4, 0, 2.3),
               new THREE.Vector3(3.5, 0, 1.5),
               new THREE.Vector3(2.0, 0, 0.5),
               new THREE.Vector3(1.5, 0, 0.0),
               new THREE.Vector3(1.5, 0, -0.6),
               new THREE.Vector3(2.0, 0, -1.0),
               new THREE.Vector3(2.7, 0, -1.2),
               new THREE.Vector3(3.9, 0, -1.5),
               new THREE.Vector3(4.6, 0, -1.9),
               new THREE.Vector3(5.2, 0, -2.3),
               new THREE.Vector3(5.5, 0, -2.85),
               new THREE.Vector3(5.4, 0, -3.35),
               new THREE.Vector3(5.1, 0, -3.8),
               new THREE.Vector3(4.5, 0, -4.5),
               new THREE.Vector3(3.7, 0, -5.2),
               new THREE.Vector3(1.5, 0, -5.6),
               new THREE.Vector3(0, 0, -5.3),
               new THREE.Vector3(-1.3, 0, -4.8),
               new THREE.Vector3(-2.0, 0, -3.5),
          ];

          const texture = new THREE.TextureLoader().load("./images/tourus.jpg");
          this.ringMaterial = new THREE.MeshStandardMaterial({
               map: texture,
               color: 0xffff00,   
               roughness: 0.3,
               metalness: 0.2
          });

          this.rings = [];
          // this.createRoute();
     }

    createRoute() {
          this.route.forEach((pt, i) => {
               const geometry = new THREE.SphereGeometry( 0.15, 32, 16 ); 
               const torus = new THREE.Mesh(geometry, this.ringMaterial);
               torus.position.copy(pt);
               this.add(torus);
               this.rings.push(torus);
          });
     }

     getRoutePoints()   {
          return this.route;
     }

}

export { MyRoute };
