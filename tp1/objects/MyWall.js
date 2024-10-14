import * as THREE from 'three';

class MyWall extends THREE.Object3D {
    constructor(app, width, height) {
        super();
        this.app = app;

        const texture = new THREE.TextureLoader().load('./textures/concrete2.jpg');

        this.wallMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            color: "#a0a0a0",   
            specular: "#000000",  
            emissive: "#000000", 
            shininess: 0         
        });

        const wallGeometry = new THREE.PlaneGeometry(width, height);
        this.wallMesh = new THREE.Mesh(wallGeometry, this.wallMaterial);
        this.add(this.wallMesh);

        this.addBaseboard(width, height);
    }

    addBaseboard(width, height) {
        const baseboardHeight = 0.3; 
        const baseboardThickness = 0.05; 

        const baseboardTexture = new THREE.TextureLoader().load('./textures/wood.jpg');
        const baseboardMaterial = new THREE.MeshPhongMaterial({
            map: baseboardTexture,
            color: "#ffffff",
            specular: "#777777",
            emissive: "#000000",
            shininess: 10
        });

        const baseboardGeometry = new THREE.BoxGeometry(width, baseboardHeight, baseboardThickness);
        const baseboardMesh = new THREE.Mesh(baseboardGeometry, baseboardMaterial);
        baseboardMesh.position.set(0, -height / 2 + baseboardHeight / 2, baseboardThickness / 2);

        this.add(baseboardMesh);
    }
}

export { MyWall };
