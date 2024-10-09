import * as THREE from 'three';

class MyPainting extends THREE.Object3D {
    constructor(app, paintingWidth = 16, paintingHeight = 9, frameThickness = 0.2) {
        super();
        this.app = app;

        const paintingTexture = new THREE.TextureLoader().load('./textures/painting.jpg');
        const woodTexture = new THREE.TextureLoader().load('./textures/wood.jpg');
        const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');
        
        const paintingMaterial = new THREE.MeshPhongMaterial({
            map: paintingTexture,
            shininess: 50
        });

        const paintingGeometry = new THREE.PlaneGeometry(paintingWidth, paintingHeight);
        this.paintingMesh = new THREE.Mesh(paintingGeometry, paintingMaterial);
        this.paintingMesh.position.set(0, 0, 0.01);  

        const frameMaterial = new THREE.MeshPhongMaterial({
            map: woodTexture,
            color: "#ffffff", 
            specular: "#777777", 
            emissive: "#000000", 
            shininess: 0
        });

        const frameWidth = paintingWidth + frameThickness * 3;
        const frameHeight = paintingHeight + frameThickness * 3;


        const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness);
        this.frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
        this.frameMesh.position.set(0, 0, -frameThickness / 2);

        const chandelierMaterial = new THREE.MeshPhongMaterial({
            map: ironTexture,
            color: 0xaaaaaa, 
            shininess: 80
        });

        const chandelierGeometry = new THREE.ConeGeometry(0.2, 0.5, 16);
        this.chandelierMesh = new THREE.Mesh(chandelierGeometry, chandelierMaterial);
        this.chandelierMesh.position.set(0, frameHeight / 2 + 0.5, -frameThickness); // Above the frame
        this.chandelierMesh.rotation.x = Math.PI; // Rotate so the cone is pointing down

        this.add(this.frameMesh);
        this.add(this.paintingMesh);
        this.add(this.chandelierMesh);
    }
}

export { MyPainting };
