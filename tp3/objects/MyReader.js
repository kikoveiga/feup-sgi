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
          this.route = new MyRoute(this.app);

          this.keyPoints = this.route.getRoutePoints();

          this.buildTrack();
          this.setupKeyFrames();
     }

     setupKeyFrames() {

          const keyframes = [
               { time: 0, value: this.keyPoints[0] },
               { time: 1, value: this.keyPoints[1] },
               { time: 2, value: this.keyPoints[2] },
               { time: 3, value: this.keyPoints[3] },
               { time: 4, value: this.keyPoints[4] },
               { time: 5, value: this.keyPoints[5] },
               { time: 6, value: this.keyPoints[6] },
               { time: 7, value: this.keyPoints[7] },
               { time: 8, value: this.keyPoints[8] },
               { time: 9, value: this.keyPoints[9] },
               { time: 10, value: this.keyPoints[10] },
               { time: 11, value: this.keyPoints[11] },
               { time: 12, value: this.keyPoints[12] },
               { time: 13, value: this.keyPoints[13] },
               { time: 14, value: this.keyPoints[14] },
               { time: 15, value: this.keyPoints[15] },
               { time: 16, value: this.keyPoints[16] },
               { time: 17, value: this.keyPoints[17] },
               { time: 18, value: this.keyPoints[18] },
               { time: 19, value: this.keyPoints[19] },
               { time: 20, value: this.keyPoints[20] },
               { time: 21, value: this.keyPoints[21] },
               { time: 22, value: this.keyPoints[22] },
               { time: 23, value: this.keyPoints[23] },
               { time: 24, value: this.keyPoints[24] },
               { time: 25, value: this.keyPoints[25] },
               { time: 26, value: this.keyPoints[26] },
               { time: 27, value: this.keyPoints[27] },
               { time: 28, value: this.keyPoints[28] },
               { time: 29, value: this.keyPoints[29] },
               { time: 30, value: this.keyPoints[30] },
          ];
  
          // Generate points using a catmull spline
  
          this.spline = new THREE.CatmullRomCurve3(keyframes.map(kf => kf.value));
  
          // Setup visual control points
  
          for (let i = 0; i < this.keyPoints.length; i++) {
              const geometry = new THREE.SphereGeometry(1, 32, 32);
              const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
              const sphere = new THREE.Mesh(geometry, material);
              sphere.scale.set(5, 5, 5)
              sphere.position.set(... this.keyPoints[i])
  
              this.app.scene.add(sphere)
          }
  
          const tubeGeometry = new THREE.TubeGeometry(this.spline, 100, 0.5, 10, false);
          const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
          this.app.scene.add(tubeMesh)
  
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
          this.MenuMesh = this.createTextMesh("Return to Menu!", -7.5, 10015, 2, 0x111111);
          this.MenuMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.MenuMesh);

          this.RematchMesh = this.createTextMesh("Rematch!", -3, 10010, 2, 0x111111);
          this.RematchMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.RematchMesh);

          this.WinnerTextMesh = this.createTextMesh("WINNER", -28, 10036, 0.1, 0x111111);
          this.WinnerTextMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerTextMesh);

          this.LoserTextMesh = this.createTextMesh("LOSER", 23, 10036, 0.1, 0x111111);
          this.LoserTextMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.LoserTextMesh);

          this.WinnerNameMesh = this.createTextMesh(winnername, -31, 10033.5, 0.1, 0x111111);
          this.WinnerNameMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerNameMesh);

          this.LoserNameMesh = this.createTextMesh(losername, 20, 10033.5, 0.1, 0x111111);
          this.LoserNameMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.LoserNameMesh);

          this.WinnerTimeMesh = this.createTextMesh("WINNER'S TIME", -6.5, 10028, 0.1, 0x111111);
          this.WinnerTimeMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerTimeMesh);

          this.WinnerMesh = this.createTextMesh(" " + winnerTime + " ", -3.5, 10026, 0.1, 0x111111);
          this.WinnerMesh.scale.set(-1.8, 1.8, 1.8);
          this.app.scene.add(this.WinnerMesh);

          this.winnerBalloon = new MyBalloon(this.app, 'Balloon', winnercolor);
          this.winnerBalloon.scale.set(3.5, 3.5, 3.5);
          this.winnerBalloon.rotation.y = 20 * Math.PI / 180;
          this.winnerBalloon.position.set(-25, 9987.5, 0);
          this.app.scene.add(this.winnerBalloon);

          this.loserBalloon = new MyBalloon(this.app, 'Balloon', losercolor);
          this.loserBalloon.scale.set(3.5, 3.5, 3.5);
          this.loserBalloon.rotation.y = -20 * Math.PI / 180;
          this.loserBalloon.position.set(25, 9987.5, 0);
          this.app.scene.add(this.loserBalloon);
          
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
          this.balloon.scale.set(10, 10, 10);
          this.balloon.position.set(-250, 150, -250);
          this.app.scene.add(this.balloon);
     }

     update() {
          const time = (Date.now() % 36000) / 36000;
          const point = this.spline.getPointAt(time);
          this.balloon.position.set(...point);
     }
}

export { MyReader };
