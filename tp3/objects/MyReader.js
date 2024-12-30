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
              offset += 0.65; // looks good

              meshes.push(mesh);
          }

          const group = new THREE.Group();
          meshes.forEach(mesh => group.add(mesh));
          group.position.set(x, y, z);
          group.rotation.x = -Math.PI;
          group.rotation.y = -Math.PI;
          return group;
     }

     buildTrack() {

          // Outdoor Text
          this.ElapsedTimeMesh = this.createTextMesh("Elapsed time: ", 230, 175, 70, 0xffffff);
          this.LapsNumberMesh = this.createTextMesh("Completed Laps: ", 230, 155, 70, 0xffffff);
          this.LayerMesh = this.createTextMesh("Current Air Layer: ", 230, 135, 70, 0xffffff);
          this.AvaiableVouchersMesh = this.createTextMesh("Avaiable Vouchers: ", 230, 115, 70, 0xffffff);
          this.GameStatusMesh = this.createTextMesh("Game Status: ", 230, 95, 70, 0xffffff);
          this.ElapsedTimeMesh.scale.set(12, 12, 12);
          this.LapsNumberMesh.scale.set(12, 12, 12);
          this.AvaiableVouchersMesh.scale.set(12, 12, 12);
          this.GameStatusMesh.scale.set(12, 12, 12);
          this.LayerMesh.scale.set(12, 12, 12);
          this.AvaiableVouchersMesh.rotation.y = 120 * Math.PI / 180;
          this.GameStatusMesh.rotation.y = 120 * Math.PI / 180;
          this.LapsNumberMesh.rotation.y = 120 * Math.PI / 180;
          this.ElapsedTimeMesh.rotation.y = 120 * Math.PI / 180;
          this.LayerMesh.rotation.y = 120 * Math.PI / 180;
          this.app.scene.add(this.ElapsedTimeMesh);
          this.app.scene.add(this.LapsNumberMesh);
          this.app.scene.add(this.AvaiableVouchersMesh);
          this.app.scene.add(this.GameStatusMesh);
          this.app.scene.add(this.LayerMesh);
  
          // Track
          this.track = new MyTrack(this.app);
          this.track.position.set(35, 5, 0);   
          this.track.scale.set(35, 35, 35);
          this.app.scene.add(this.track);

          // Example Balloon
          this.balloon = new MyBalloon(this.app);
          this.balloon.scale.set(35, 35, 35);
          this.balloon.position.set(-250, 150, -250);
          this.app.scene.add(this.balloon);
     }
}

export { MyReader };
