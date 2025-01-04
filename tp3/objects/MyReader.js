import * as THREE from "three";
import { MyBalloon } from "./MyBalloon.js";
import { MyRoute } from "./MyRoute.js";
import { MyTrack } from "./MyTrack.js";

class MyReader {
     constructor(app, playerBalloonColor = null, opponentBalloonColor = null) {
          this.app = app;
          this.playerBalloonColor = playerBalloonColor;
          this.opponentBalloonColor = opponentBalloonColor;

          this.route = new MyRoute(this.app);

          this.playerBalloon = null;
          this.opponentBalloon = null;

          this.keyPoints = this.route.getRoutePoints();

          this.buildTrack();

          this.clock = new THREE.Clock();
          this.mixerTime = 0;
          this.mixerPause = false;
          this.enableAnimationRotation = true;
          this.enableAnimationPosition = true;

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
     initBalloonsAnimation() {

          this.playerMixer = new THREE.AnimationMixer(this.playerBalloon);
          this.createBalloonAnimation(this.playerMixer);

          this.opponentMixer = new THREE.AnimationMixer(this.opponentBalloon);
          this.createBalloonAnimation(this.opponentMixer);
     }

     createBalloonAnimation(mixer) {
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
          
          const positionClip = new THREE.AnimationClip('positionAnimation', 30, [positionKF]);
          const rotationClip = new THREE.AnimationClip('rotationAnimation', 30, [quaternionKF]);
    
          const positionAction = mixer.clipAction(positionClip);
          const rotationAction = mixer.clipAction(rotationClip);

          positionAction.play();
          rotationAction.play();
     }

     setMixerTime() {
          if (this.playerMixer) this.playerMixer.setTime(this.mixerTime);
          if (this.opponentMixer) this.opponentMixer.setTime(this.mixerTime);
     }
  
     debugKeyFrames() {
          let spline = new THREE.CatmullRomCurve3([...this.keyPoints]);
  
          for (let i = 0; i < this.keyPoints.length; i++) {
              const geometry = new THREE.SphereGeometry(1, 32, 32);
              const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
              const sphere = new THREE.Mesh(geometry, material);
              sphere.scale.set(3, 3, 3);
              sphere.position.set(... this.keyPoints[i]);
  
              this.app.scene.add(sphere);
          }
  
          const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false);
          const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
          this.app.scene.add(tubeMesh);
     }

     checkAnimationStateIsPause() {
          if (this.mixerPause) {
               this.playerMixer.timeScale = 0;
               this.opponentMixer.timeScale = 0;
          } 
          else {
               this.playerMixer.timeScale = 1;
               this.opponentMixer.timeScale = 1;
          }
     }

     checkTracksEnabled() {
          const processMixerActions = (mixer) => {
               const actions = mixer._actions;
               for (let i = 0; i < actions.length; i++) {
                    const track = actions[i]._clip.tracks[0];

                    if (track.name === '.quaternion' && this.enableAnimationRotation === false) {
                         actions[i].stop();
                    }
                    else if (track.name === '.position' && this.enableAnimationPosition === false) {
                         actions[i].stop();
                    }
                    else {
                         if (!actions[i].isRunning())
                              actions[i].play();
                    }
               }
          }

          if (this.playerMixer) processMixerActions(this.playerMixer);
          if (this.opponentMixer) processMixerActions(this.opponentMixer);
     }

     buildTrack() {
          this.track = new MyTrack(this.app);
          this.track.position.set(35, 5, 0);   
          this.track.scale.set(35, 35, 35);
          this.app.scene.add(this.track);

          this.playerBalloon = new MyBalloon(this.app, 'Balloon', this.playerBalloonColor);
          this.playerBalloon.scale.set(10, 10, 10);
          this.app.scene.add(this.playerBalloon);

          this.opponentBalloon = new MyBalloon(this.app, 'Balloon', this.opponentBalloonColor);
          this.opponentBalloon.scale.set(10, 10, 10);
          this.app.scene.add(this.opponentBalloon);

          this.initBalloonsAnimation();

     }

     pause() {
          this.mixerPause = true;
          this.clock.stop();
          this.pauseTime = this.clock.getElapsedTime();
     }

     resume() {
          this.mixerPause = false;
          const resumeTime = this.clock.getElapsedTime();
          this.timeOffset = resumeTime - this.pauseTime;
          this.clock.start();
     }

     update() {

          let delta = this.clock.getDelta();

          if (this.mixerPause) {
               return;
          }

          if (this.timeOffset) {
               delta -= this.timeOffset;
               this.timeOffset = 0;
          }
          
          this.playerMixer.update(delta);
          this.opponentMixer.update(delta);

          this.checkAnimationStateIsPause();
          this.checkTracksEnabled();
     }
}

export { MyReader };
