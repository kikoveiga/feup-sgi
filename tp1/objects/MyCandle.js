import * as THREE from 'three';

class MyCandle extends THREE.Object3D {
    constructor(app) {
        super();
        this.app = app;

        const texture = new THREE.TextureLoader().load('./textures/quartz.jpg');

        this.candleMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            color: "#a0a0a0", 
            specular: "#777777", 
            emissive: "#000000", 
            shininess: 0
        });


    }
}

export { MyCandle };