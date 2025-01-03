import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class MyRoute extends MyObject {
    constructor(app, name = 'Route') {
          super(app, name);
          this.type = "Group";

          this.route = [
               new THREE.Vector3(100, 0, -35), 
               new THREE.Vector3(100, 0, 87.5), 
               new THREE.Vector3(93, 0, 131.25), 
               new THREE.Vector3(96, 0, 164.5), 
               new THREE.Vector3(65, 0, 190), 
               new THREE.Vector3(12.5, 0, 175), 
               new THREE.Vector3(-68, 0, 168),
               new THREE.Vector3(-92.5, 0, 161),
               new THREE.Vector3(-117, 0, 148.75),
               new THREE.Vector3(-127.5, 0, 129.5),
               new THREE.Vector3(-134.5, 0, 108.5),
               new THREE.Vector3(-124, 0, 80.5),
               new THREE.Vector3(-92.5, 0, 52.5),
               new THREE.Vector3(-40, 0, 17.5),
               new THREE.Vector3(-22.5, 0, 0),
               new THREE.Vector3(-22.5, 0, -21),
               new THREE.Vector3(-40, 0, -35),
               new THREE.Vector3(-64.5, 0, -42),
               new THREE.Vector3(-106.5, 0, -52.5),
               new THREE.Vector3(-131, 0, -66.5),
               new THREE.Vector3(-152, 0, -80.5),
               new THREE.Vector3(-162.5, 0, -99.75),
               new THREE.Vector3(-159, 0, -117.25),
               new THREE.Vector3(-148.5, 0, -133),
               new THREE.Vector3(-127.5, 0, -157.5),
               new THREE.Vector3(-99.5, 0, -182),
               new THREE.Vector3(-22.5, 0, -196),
               new THREE.Vector3(30, 0, -185.5),
               new THREE.Vector3(75.5, 0, -168),
               new THREE.Vector3(100, 0, -122.5),
               new THREE.Vector3(100, 0, -35),                
          ];

          const texture = new THREE.TextureLoader().load("./images/tourus.jpg");
          this.ringMaterial = new THREE.MeshStandardMaterial({
               map: texture,
               color: 0xffff00,   
               roughness: 0.3,
               metalness: 0.2
          });

          this.rings = [];
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

     getRoutePoints() {
          return this.route;
     }

}

export { MyRoute };
