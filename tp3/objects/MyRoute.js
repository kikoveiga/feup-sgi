import * as THREE from "three";
import { MyObject } from "./MyObject.js";


class MyRoute extends MyObject {
    constructor(app, name, path, segments = 10) {
          super();
          this.app = app;
          this.name = name;
          this.type = "Group";

          this.path = path;
          this.segments = segments;

          const texture = new THREE.TextureLoader().load("./images/tourus.jpg");
          this.ringMaterial = new THREE.MeshStandardMaterial({
               map: texture,
               color: 0xffff00,   
               roughness: 0.3,
               metalness: 0.2
          });

          this.rings = [];
          this.createRoute();
     }

    createRoute() {
          const points = this.path.getPoints(this.segments);
          points.forEach((pt, i) => {
               const geometry = new THREE.TorusGeometry(
                    0.5,      // radius of the ring
                    0.08,     // thickness of the ring tube
                    16,        // radial segments (detail)
                    32        // tubular segments (detail)
               );

               const torus = new THREE.Mesh(geometry, this.ringMaterial);
               torus.position.copy(pt);
               this.add(torus);
               this.rings.push(torus);
          });
     }

    update(delta) {
          this.rings.forEach((ring) => {
               ring.rotation.z += 0.5 * delta;
          });
     }
}

export { MyRoute };
