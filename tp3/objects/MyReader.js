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

     buildMainMenu() {
          // Title text
          this.topMesh = this.createTextMesh("Select your Balloon!", 2024.7, 14.5, 1987.5, 0xffa500); // Bright orange
          this.topMesh.scale.set(1.9, 1.9, 1.9);
          this.topMesh.rotation.y = Math.PI / 2;
          this.app.scene.add(this.topMesh);
      
          // Subheading for player's selection
          this.topMesh = this.createTextMesh("Your current selection: ", 2024.7, 12, 1978.5, 0x87ceeb); // Sky blue
          this.topMesh.scale.set(1.8, 1.8, 1.8);
          this.topMesh.rotation.y = Math.PI / 2;
          this.app.scene.add(this.topMesh);
      
          // Subheading for opponent's selection
          this.topMesh2 = this.createTextMesh("Oponnent current selection: ", 2024.7, 10, 1978.5, 0xff69b4); // Light pink
          this.topMesh2.scale.set(1.8, 1.8, 1.8);
          this.topMesh2.rotation.y = Math.PI / 2;
          this.app.scene.add(this.topMesh2);
      
          // Play button text
          this.topMesh = this.createTextMesh("Play HotRace!", 2024, 17.5, 1992.5, 0x32cd32); // Lime green
          this.topMesh.scale.set(2, 2, 2);
          this.topMesh.rotation.y = Math.PI / 2;
          this.app.scene.add(this.topMesh);
      
          // Player's selected balloon (default)
          this.playerSelected = this.createTextMesh("Not choosen", 2024.7, 12, 2006, 0xb0b0b0); // Gray
          this.playerSelected.scale.set(1.8, 1.8, 1.8);
          this.playerSelected.rotation.y = Math.PI / 2;
          this.app.scene.add(this.playerSelected);
      
          // Opponent's selected balloon (default)
          this.playerSelected2 = this.createTextMesh("Not choosen", 2024.7, 10, 2010.5, 0xb0b0b0); // Gray
          this.playerSelected2.scale.set(1.8, 1.8, 1.8);
          this.playerSelected2.rotation.y = Math.PI / 2;
          this.app.scene.add(this.playerSelected2);
      
          // Game credits
          this.gameMesh = this.createTextMesh("Game made by:", 2024.7, 6, 1993.5, 0xffffe0); // Light yellow
          this.gameMesh.scale.set(1.5, 1.5, 1.5);
          this.gameMesh.rotation.y = Math.PI / 2;
          this.app.scene.add(this.gameMesh);
      
          this.gameMesh2 = this.createTextMesh("João Alves & Francisco Veiga", 2024.7, 4, 1986, 0xffffe0); // Light yellow
          this.gameMesh2.scale.set(1.5, 1.5, 1.5);
          this.gameMesh2.rotation.y = Math.PI / 2;
          this.app.scene.add(this.gameMesh2);

          // Player Name
          this.playerNameMesh = this.createTextMesh("Player Name: ", 1981.5, 0.1, 1988, 0x000000); // Black
          this.playerNameMesh.scale.set(1.8, 1.8, 1.8);
          this.playerNameMesh.rotation.x = - Math.PI / 2;
          this.playerNameMesh.rotation.z = - Math.PI / 2;
          this.app.scene.add(this.playerNameMesh);

          // Player Name Default
          this.playerSelected3 = this.createTextMesh("Not choosen", 1981.5, 0.1, 2002, 0xb0b0b0); // Gray
          this.playerSelected3.scale.set(1.8, 1.8, 1.8);
          this.playerSelected3.rotation.x = - Math.PI / 2;
          this.playerSelected3.rotation.z = - Math.PI / 2;
          this.app.scene.add(this.playerSelected3);
     }
       
     buildFinalMenu(winnercolor, losercolor, winnername, losername, winnerTime) {
          this.MenuMesh = this.createTextMesh("Return to Menu!", -7.5, 15, 2, 0x111111);
          this.MenuMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.MenuMesh);

          this.RematchMesh = this.createTextMesh("Rematch!", -3, 10, 2, 0x111111);
          this.RematchMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.RematchMesh);

          this.WinnerTextMesh = this.createTextMesh("WINNER", -28, 36, 0.1, 0x111111);
          this.WinnerTextMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerTextMesh);

          this.LoserTextMesh = this.createTextMesh("LOSER", 23, 36, 0.1, 0x111111);
          this.LoserTextMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.LoserTextMesh);

          this.WinnerNameMesh = this.createTextMesh(winnername, -31, 33.5, 0.1, 0x111111);
          this.WinnerNameMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerNameMesh);

          this.LoserNameMesh = this.createTextMesh(losername, 20, 33.5, 0.1, 0x111111);
          this.LoserNameMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.LoserNameMesh);

          this.WinnerTimeMesh = this.createTextMesh("WINNER'S TIME", -6.5, 28, 0.1, 0x111111);
          this.WinnerTimeMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerTimeMesh);

          this.WinnerMesh = this.createTextMesh(" " + winnerTime + " ", -3.5, 26, 0.1, 0x111111);
          this.WinnerMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerMesh);
          
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
          this.balloon = new MyBalloon(this.app, 'Balloon', 'blue');
          this.balloon.scale.set(35, 35, 35);
          this.balloon.position.set(-250, 150, -250);
          this.app.scene.add(this.balloon);
     }
}

export { MyReader };
