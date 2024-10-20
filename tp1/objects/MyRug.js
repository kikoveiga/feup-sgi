import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyRug extends MyObject {
    constructor(app, width = 5, length = 8, name = 'rug') {
        super(app, name);

        const rugTexture = new THREE.TextureLoader().load('./textures/rug.jpg');
        const rugBumpMap = new THREE.TextureLoader().load('./textures/rugbump.jpg'); 

        rugTexture.wrapS = THREE.RepeatWrapping;
        rugTexture.wrapT = THREE.RepeatWrapping;
        rugBumpMap.wrapS = THREE.RepeatWrapping;
        rugBumpMap.wrapT = THREE.RepeatWrapping;

        rugTexture.repeat.set(1, 2);  
        rugBumpMap.repeat.set(1, 2);

        const rugMaterial = new THREE.MeshPhysicalMaterial({
            map: rugTexture,       
            bumpMap: rugBumpMap,  
            bumpScale: 0.2,        
            roughness: 0.8,        
            metalness: 0.0,        
            reflectivity: 0.1,     
            clearcoat: 0.0,        
            shininess: 10,         
        });

        const rugGeometry = new THREE.PlaneGeometry(width, length);

        this.rugMesh = new THREE.Mesh(rugGeometry, rugMaterial);
        this.rugMesh.rotation.x = -Math.PI / 2;
        this.rugMesh.position.y = 0.01; 

        this.add(this.rugMesh);
    }
}

export { MyRug };
