import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyWall extends MyObject {
    constructor(app, width, height, hasWindow = false, name = 'wall') {
        super(app, name);

        const wallTexture = new THREE.TextureLoader().load('./textures/concrete2.jpg');
        this.wallMaterial = new THREE.MeshPhysicalMaterial({
            map: wallTexture,       
            color: "#a0a0a0",       
            roughness: 0.8,         
            metalness: 0.0,        
            reflectivity: 0.1,      
            clearcoat: 0.0,        
        });

        const wallGeometry = new THREE.PlaneGeometry(width, height);
        this.wallMesh = new THREE.Mesh(wallGeometry, this.wallMaterial);
        this.wallMesh.receiveShadow = true;
        this.add(this.wallMesh);

        this.addBaseboard(width, height);

        if (hasWindow) {
            this.addWindowWithLandscape(width, height);
        }
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
        baseboardMesh.receiveShadow = true;
        this.add(baseboardMesh);
    }

    addWindowWithLandscape() {
        const windowWidth = 8;
        const windowHeight = 4;
        const windowDepth = 0.1;

        const windowYPosition = 1;

        const frameMaterial = new THREE.MeshPhongMaterial({
            color: "#444444", 
            specular: "#000000",
            shininess: 30
        });

        const landscapeTexture = new THREE.TextureLoader().load('./textures/landscape.jpg');
        const landscapeMaterial = new THREE.MeshPhongMaterial({
            map: landscapeTexture,
        });

        const frameThickness = 0.3;
        const frameGeometry = new THREE.BoxGeometry(windowWidth + frameThickness, windowHeight + frameThickness, windowDepth);
        const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
        frameMesh.position.set(0, windowYPosition, windowDepth / 2);
        this.add(frameMesh);

        const landscapeGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
        const landscapeMesh = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
        landscapeMesh.position.set(0, windowYPosition, windowDepth / 2 + 0.06); 
        this.add(landscapeMesh);

        const auxGeometry1 = new THREE.PlaneGeometry(windowWidth, 0.1);
        const auxMesh1 = new THREE.Mesh(auxGeometry1, frameMaterial);
        auxMesh1.position.set(0, windowYPosition, windowDepth / 2 + 0.07); 
        auxMesh1.castShadow = true;  
        auxMesh1.receiveShadow = true;
        this.add(auxMesh1);

        const auxGeometry2 = new THREE.PlaneGeometry(0.1, windowHeight);
        const auxMesh2 = new THREE.Mesh(auxGeometry2, frameMaterial);
        auxMesh2.position.set(0, windowYPosition, windowDepth / 2 + 0.07); 
        auxMesh2.castShadow = true;  
        auxMesh2.receiveShadow = true; 
        this.add(auxMesh2);

        this.addDirectionalLight();
    }

    addDirectionalLight() {
        const dirLight = new THREE.DirectionalLight(0x2a9df4, 0.8);
        
        dirLight.position.set(-12, 6, 0); 
    
        const target = new THREE.Object3D();
        target.position.set(-10, 0, 8); 
        this.add(target);
        dirLight.target = target;
    
        dirLight.castShadow = true;
        this.add(dirLight);
    
        // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 3);
        // this.add(dirLightHelper);
    }
    
}

export { MyWall };
