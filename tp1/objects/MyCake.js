import * as THREE from 'three';

class MyCake extends THREE.Object3D {
    constructor(app) {
        super();
        this.app = app;

        const texture1 = new THREE.TextureLoader().load('./textures/mossybricks.jpg');
        const texture2 = new THREE.TextureLoader().load('./textures/mossybricks.jpg');

        this.cakeMaterial1 = new THREE.MeshPhongMaterial({
            map: texture1,
            color: "#a0a0a0", 
            specular: "#777777", 
            emissive: "#000000", 
            shininess: 0
        });

        this.cakeMaterial2 = new THREE.MeshPhongMaterial({
          map: texture2,
          color: "#a0a0a0", 
          specular: "#777777", 
          emissive: "#000000", 
          shininess: 0
      });

    }
}

export { MyCake };
