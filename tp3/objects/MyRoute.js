import * as THREE from "three";
import { MyObject } from "./MyObject.js";

class MyRoute extends MyObject {
    constructor(app, name = 'Route') {
          super(app, name);
          this.type = "Group";

          this.multiplier = 2.0;

          this.route = [
               new THREE.Vector3(100 * this.multiplier, 0, -35 * this.multiplier), // 1
               new THREE.Vector3(110 * this.multiplier, 0, 87.5 * this.multiplier), // 2
               new THREE.Vector3(120 * this.multiplier, 0, 135 * this.multiplier), // 3
               new THREE.Vector3(96 * this.multiplier, 0, 180 * this.multiplier), //4
               new THREE.Vector3(65 * this.multiplier, 0, 190 * this.multiplier), // 5
               new THREE.Vector3(12.5 * this.multiplier, 0, 175 * this.multiplier), // 6
               new THREE.Vector3(-68 * this.multiplier, 0, 168 * this.multiplier), // 7
               new THREE.Vector3(-92.5 * this.multiplier, 0, 161 * this.multiplier), // 8
               new THREE.Vector3(-117 * this.multiplier, 0, 148.75 * this.multiplier), // 9
               new THREE.Vector3(-127.5 * this.multiplier, 0, 129.5 * this.multiplier), // 10
               new THREE.Vector3(-134.5 * this.multiplier, 0, 108.5 * this.multiplier), // 11
               new THREE.Vector3(-124 * this.multiplier, 0, 80.5 * this.multiplier), // 12
               new THREE.Vector3(-92.5 * this.multiplier, 0, 52.5 * this.multiplier), // 13
               new THREE.Vector3(-40 * this.multiplier, 0, 25 * this.multiplier), // 14
               new THREE.Vector3(-15 * this.multiplier, 0, 5 * this.multiplier), // 15
               new THREE.Vector3(-22.5 * this.multiplier, 0, -21 * this.multiplier), // 16
               new THREE.Vector3(-40 * this.multiplier, 0, -35 * this.multiplier), // 17
               new THREE.Vector3(-64.5 * this.multiplier, 0, -42 * this.multiplier), // 18
               new THREE.Vector3(-106.5 * this.multiplier, 0, -52.5 * this.multiplier), // 19
               new THREE.Vector3(-131 * this.multiplier, 0, -66.5 * this.multiplier), // 20
               new THREE.Vector3(-152 * this.multiplier, 0, -80.5 * this.multiplier), // 21
               new THREE.Vector3(-162.5 * this.multiplier, 0, -99.75 * this.multiplier), // 22
               new THREE.Vector3(-159 * this.multiplier, 0, -117.25 * this.multiplier), // 23
               new THREE.Vector3(-148.5 * this.multiplier, 0, -130 * this.multiplier), // 24
               new THREE.Vector3(-127.5 * this.multiplier, 0, -145 * this.multiplier), // 25
               new THREE.Vector3(-99.5 * this.multiplier, 0, -165 * this.multiplier), // 26
               new THREE.Vector3(-22.5 * this.multiplier, 0, -195 * this.multiplier), // 27
               new THREE.Vector3(30 * this.multiplier, 0, -185.5 * this.multiplier), // 28
               new THREE.Vector3(75.5 * this.multiplier, 0, -168 * this.multiplier), // 29
               new THREE.Vector3(100 * this.multiplier, 0, -122.5 * this.multiplier), // 30
               new THREE.Vector3(100 * this.multiplier, 0, -35 * this.multiplier), // 31       
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
               const geometry = new THREE.SphereGeometry( 15, 32, 16 ); 
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
