import * as THREE from "three";
import { MyBalloon } from "./MyBalloon.js";
import { MyObstacle } from "./MyObstacle.js";
import { MyPowerUp } from "./MyPowerUp.js";
import { MyRoute } from "./MyRoute.js";
import { MyTrack } from "./MyTrack.js";


class MyReader {
     constructor(app) {
          this.app = app;
          this.track = new MyTrack(this.app);
     }

     createTextMesh(text, x, y, z, color) {
          const texture = new THREE.TextureLoader().load("./images/font.png");
          
          const meshes = [];
          let offset = 0;
          
          for (let i = 0; i < text.length; i++) {
              const geometry = new THREE.PlaneGeometry(1, 1);
              const material = new THREE.MeshBasicMaterial({
                  map: texture,
                  side: THREE.DoubleSide,
                  transparent: true,
                  color: color
              });

              const charCode = text.charCodeAt(i);
              const cols = 16;
              const rows = 16;
              
              const u = (charCode % (cols * rows)) % cols * (1 / cols);
              const v = Math.floor((charCode % (cols * rows)) / cols) * (1 / rows);
      
              const mesh = new THREE.Mesh(geometry, material);
              const originalUV = geometry.getAttribute('uv').clone();

              originalUV.set([
                  u,         1 - v - 1/rows,
                  u + 1/cols,1 - v - 1/rows,
                  u,         1 - v,
                  u + 1/cols,1 - v
              ]);
              geometry.setAttribute('uv', originalUV);
              
              mesh.position.x = offset;
              offset += 0.85; // looks good

              meshes.push(mesh);
          }

          const group = new THREE.Group();
          meshes.forEach(mesh => group.add(mesh));
          group.position.set(x, y, z);
          group.rotation.x = -Math.PI;
          group.rotation.y = -Math.PI;
          return group;
     }
}

export { MyReader };
