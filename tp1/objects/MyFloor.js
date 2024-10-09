import * as THREE from 'three';

class MyFloor extends THREE.Object3D {
     constructor(app, width, length, isFloor) {
          super();
          this.app = app;
          let texture;

          if(isFloor){
               texture = new THREE.TextureLoader().load('./textures/wood.jpg');

               texture.wrapS = THREE.RepeatWrapping;
               texture.wrapT = THREE.RepeatWrapping;
               texture.repeat.set(6, 6);
     
               this.floorMaterial = new THREE.MeshPhongMaterial({
                    map: texture,
                    color: "#ffffff", 
                    specular: "#777777", 
                    emissive: "#000000", 
                    shininess: 0
               });
          }
          else {
               texture = new THREE.TextureLoader().load('./textures/ceiling.jpg');

               texture.wrapS = THREE.RepeatWrapping;
               texture.wrapT = THREE.RepeatWrapping;
               texture.repeat.set(6, 6);
     
               this.floorMaterial = new THREE.MeshPhongMaterial({
                    map: texture,
                    color: "#ffffff", 
                    specular: "#ffffff", 
                    emissive: "#000000", 
                    shininess: 0
               });
          }
          


          let plane = new THREE.PlaneGeometry(width, length);
          this.planeMesh = new THREE.Mesh(plane, this.floorMaterial);
          this.planeMesh.rotation.x = -Math.PI / 2;
          this.planeMesh.position.y = 0;
          this.add(this.planeMesh);
     }
}

export { MyFloor };
