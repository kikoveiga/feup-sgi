import * as THREE from 'three';

class MyWall extends THREE.Object3D {
    constructor(app, width, height) {
        super();
        this.app = app;

        const texture = new THREE.TextureLoader().load('./textures/mossybricks.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(6, 3);

        this.wallMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            color: "#a0a0a0", 
            specular: "#777777", 
            emissive: "#000000", 
            shininess: 0
        });

        let wallGeometry = new THREE.PlaneGeometry(width, height);
        this.wallMesh = new THREE.Mesh(wallGeometry, this.wallMaterial);
        this.add(this.wallMesh);
    }
}

export { MyWall };
