import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyPainting extends MyObject {
    constructor(app, paintingWidth = 16, paintingHeight = 9, frameThickness = 0.2, name = 'painting') {
        super(app, name);
        this.type = 'Group';

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

        const chandelierGeometry = new THREE.ConeGeometry(0.2, 0.5, 16, 1, true);
        this.chandelierMesh = new THREE.Mesh(chandelierGeometry, chandelierMaterial);
        this.chandelierMesh.position.set(0, frameHeight / 2 + 1, -frameThickness); 
        this.chandelierMesh.rotation.y = Math.PI; 
        this.chandelierMesh.rotation.x = - 20 * Math.PI / 180; 
        this.chandelierMesh.scale.set(2, 2, 2);
        this.add(this.frameMesh);
        this.add(this.paintingMesh);
        this.add(this.chandelierMesh);
    }
}

MyPainting.prototype.isGroup = true;

export { MyPainting };
