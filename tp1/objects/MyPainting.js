import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyPainting extends THREE.Object3D {
    constructor(app, paintName, paintingWidth = 16, paintingHeight = 9, frameThickness = 0.2, name = 'painting') {
        super(app, name);
        this.type = 'Group';

        const paintingTexturePath = `./textures/${paintName}.jpg`;
        const paintingTexture = new THREE.TextureLoader().load(paintingTexturePath);
        const woodTexture = new THREE.TextureLoader().load('./textures/wood.jpg');
        const woodTexture2 = new THREE.TextureLoader().load('./textures/wood2.jpg');
        
        const paintingMaterial = new THREE.MeshPhongMaterial({
            map: paintingTexture,
            shininess: 50
        });

        const paintingGeometry = new THREE.PlaneGeometry(paintingWidth, paintingHeight);
        this.paintingMesh = new THREE.Mesh(paintingGeometry, paintingMaterial);
        this.paintingMesh.position.set(0, 0, 0.01);  
        this.paintingMesh.scale.set(0.4, 0.4, 0.4);
        this.paintingMesh.castShadow = true;
        this.paintingMesh.receiveShadow = true;

        const frameMaterial = new THREE.MeshPhongMaterial({
            map: woodTexture,
            color: "#ffffff", 
            specular: "#777777", 
            emissive: "#000000", 
            shininess: 0
        });
  
        const chandelierMaterial = new THREE.MeshPhongMaterial({
            map: woodTexture2,
            color: "#A0522D", 
            shininess: 30,
            specular: "#444444",
            side: THREE.DoubleSide
        });

        const frameWidth = paintingWidth + frameThickness * 3;
        const frameHeight = paintingHeight + frameThickness * 3;

        const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness);
        this.frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
        this.frameMesh.position.set(0, 0, -frameThickness / 2);
        this.frameMesh.scale.set(0.4, 0.4, 0.4);
        this.frameMesh.castShadow = true;
        this.frameMesh.receiveShadow = true;

        const chandelierGeometry = new THREE.ConeGeometry(0.25, 0.5, 16, 1, true);
        this.chandelierMesh = new THREE.Mesh(chandelierGeometry, chandelierMaterial);
        this.chandelierMesh.position.set(0, frameHeight / 2 - 2.5, 0.6); 
        this.chandelierMesh.rotation.y = Math.PI; 
        this.chandelierMesh.rotation.x = 10 * Math.PI / 180;
        this.chandelierMesh.castShadow = true;
        this.chandelierMesh.receiveShadow = true;

        const auxGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32);
        this.auxMesh = new THREE.Mesh(auxGeometry, chandelierMaterial);
        this.auxMesh.position.set(0, frameHeight / 2 - 2.5, 0.3);
        this.auxMesh.rotation.x = -Math.PI / 2; 
        this.auxMesh.scale.set(0.4, 0.4, 0.4);
        this.auxMesh.castShadow = true;
        this.auxMesh.receiveShadow = true;

        this.add(this.frameMesh);
        this.add(this.paintingMesh);
        this.add(this.chandelierMesh);
        this.add(this.auxMesh);

        const spotLight = new THREE.SpotLight(0xffee8c, 30, 10, Math.PI / 3.5, 0.3, 2);
        spotLight.position.set(0, frameHeight / 2 - 2.5, 0.65); 

        const target = new THREE.Object3D();
        target.position.set(0, 0, 0.01);
        this.add(target);
        spotLight.target = target;
        spotLight.castShadow = true;
        this.add(spotLight);
    }
}

MyPainting.prototype.isGroup = true;

export { MyPainting };
