import * as THREE from "three";
import { MyBalloon } from "./MyBalloon.js";
import { MyObstacle } from "./MyObstacle.js";
import { MyPowerUp } from "./MyPowerUp.js";
import { MyRoute } from "./MyRoute.js";
import { MyTrack } from "./MyTrack.js";
import { MyFirework } from "./MyFirework.js";
import { MyShader } from "./MyShader.js";


class MyReader {
     constructor(app) {
          this.app = app;
          this.track = new MyTrack(this.app);
          this.route = new MyRoute(this.app);

          this.keyPoints = this.route.getRoutePoints();

          this.buildTrack();

          this.clock = new THREE.Clock();
          this.mixerTime = 0;
          this.mixerPause = false;
          this.enableAnimationRotation = true;
          this.enableAnimationPosition = true;
          this.initBalloonAnimation();

          this.raceFisnished = true;

          this.powerups = this.track.getPowerUps();
          this.obstacles = this.track.getObstacles();
     }

     getPowerUps() {
          return this.powerups;
     }

     getObstacles() {
          return this.obstacles;
     }
     
     /*********************** ANIMATION ZONE ***********************/
     initBalloonAnimation() {
          // this.debugKeyFrames()

          const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
               [
                    ...this.keyPoints[0],
                    ...this.keyPoints[1],
                    ...this.keyPoints[2],
                    ...this.keyPoints[3],
                    ...this.keyPoints[4],
                    ...this.keyPoints[5],
                    ...this.keyPoints[6],
                    ...this.keyPoints[7],
                    ...this.keyPoints[8],
                    ...this.keyPoints[9],
                    ...this.keyPoints[10],
                    ...this.keyPoints[11],
                    ...this.keyPoints[12],
                    ...this.keyPoints[13],
                    ...this.keyPoints[14],
                    ...this.keyPoints[15],
                    ...this.keyPoints[16],
                    ...this.keyPoints[17],
                    ...this.keyPoints[18],
                    ...this.keyPoints[19],
                    ...this.keyPoints[20],
                    ...this.keyPoints[21],
                    ...this.keyPoints[22],
                    ...this.keyPoints[23],
                    ...this.keyPoints[24],
                    ...this.keyPoints[25],
                    ...this.keyPoints[26],
                    ...this.keyPoints[27],
                    ...this.keyPoints[28],
                    ...this.keyPoints[29],
                    ...this.keyPoints[30]
               ],
               THREE.InterpolateSmooth  
          )
  
          const yAxis = new THREE.Vector3(0, 1, 0);

          const rotations = [
              new THREE.Quaternion().setFromAxisAngle(yAxis, 0),                  // Point 0
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 16),       // Point 1
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 8),        // Point 2
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 6),        // Point 3
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 5),        // Point 4
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 4),        // Point 5
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 3),        // Point 6
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 2.5),      // Point 7
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 2),        // Point 8
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 1.8),      // Point 9
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 1.6),      // Point 10
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 1.4),      // Point 11
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 1.3),      // Point 12
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 1.2),      // Point 13
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI / 1.1),      // Point 14
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI),            // Point 15
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.1),      // Point 16
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.2),      // Point 17
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.3),      // Point 18
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.4),      // Point 19
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.5),      // Point 20
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.6),      // Point 21
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.7),      // Point 22
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.8),      // Point 23
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 1.9),      // Point 24
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2),        // Point 25
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2.1),      // Point 26
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2.2),      // Point 27
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2.3),      // Point 28
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2.4),      // Point 29
              new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2.5)       // Point 30
          ];
          

          const quaternionComponents = [];
          rotations.forEach(q => {
              quaternionComponents.push(q.x, q.y, q.z, q.w);
          });
          
          const quaternionKF = new THREE.QuaternionKeyframeTrack(
              '.quaternion',
              [...Array(31).keys()], 
              quaternionComponents
          );
          
          const positionClip = new THREE.AnimationClip('positionAnimation', 30, [positionKF])
          const rotationClip = new THREE.AnimationClip('rotationAnimation', 30, [quaternionKF])
  
          this.mixer = new THREE.AnimationMixer(this.balloon)
  
          const positionAction = this.mixer.clipAction(positionClip)
          const rotationAction = this.mixer.clipAction(rotationClip)

          positionAction.play()
          rotationAction.play()
     }

     setMixerTime() {
          this.mixer.setTime(this.mixerTime)
     }
  
     debugKeyFrames() {
          let spline = new THREE.CatmullRomCurve3([...this.keyPoints])
  
          for (let i = 0; i < this.keyPoints.length; i++) {
              const geometry = new THREE.SphereGeometry(1, 32, 32)
              const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
              const sphere = new THREE.Mesh(geometry, material)
              sphere.scale.set(3, 3, 3);
              sphere.position.set(... this.keyPoints[i])
  
              this.app.scene.add(sphere)
          }
  
          const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
          const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
          const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
          this.app.scene.add(tubeMesh)
     }

     checkAnimationStateIsPause() {
          if (this.mixerPause)
               this.mixer.timeScale = 0
          else
               this.mixer.timeScale = 1
     }

     checkTracksEnabled() {
          const actions = this.mixer._actions
          for (let i = 0; i < actions.length; i++) {
               const track = actions[i]._clip.tracks[0]

               if (track.name === '.quaternion' && this.enableAnimationRotation === false) {
                    actions[i].stop()
               }
               else if (track.name === '.position' && this.enableAnimationPosition === false) {
                    actions[i].stop()
               }
               else {
                    if (!actions[i].isRunning())
                         actions[i].play()
               }
          }
     }

     /*********************** TEXTS ZONE ***********************/
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
  
          this.track = new MyTrack(this.app);
          this.track.position.set(35, 5, 0);   
          this.track.scale.set(35, 35, 35);
          this.app.scene.add(this.track);

          this.balloon = new MyBalloon(this.app, 'Balloon', 'green');
          this.balloon.scale.set(10, 10, 10);
          this.app.scene.add(this.balloon);
     }


     update() {
          const delta = this.clock.getDelta()
          this.mixer.update(delta)

          this.checkAnimationStateIsPause()
          this.checkTracksEnabled()
     }
}

export { MyReader };
