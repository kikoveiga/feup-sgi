import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyTableLamp extends MyObject {
    constructor(app, baseRadius = 0.4, poleHeight = 1, lampHeadRadius = 0.3, lampHeadHeight = 0.5, name = 'table lamp') {
        super(app, name);

        const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');

        const lampBodyMaterial1 = new THREE.MeshPhongMaterial({
            map: ironTexture,  
            color: "#808080",  
            specular: "#ffffff",  
            shininess: 70, 
            side: THREE.DoubleSide
       });

        const lampBodyMaterial2 = new THREE.MeshPhongMaterial({
            map: ironTexture,  
            color: "#ffffff",  
            specular: "#ffffff",  
            shininess: 70, 
        });
       
        // LAMP BASE
        const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, 0.1, 32);
        const baseMesh = new THREE.Mesh(baseGeometry, lampBodyMaterial1);
        baseMesh.position.set(0, 0.05, 0);
        this.add(baseMesh);

        // LAMP POLE
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, poleHeight, 16);
        const poleMesh = new THREE.Mesh(poleGeometry, lampBodyMaterial2);
        poleMesh.position.set(0, poleHeight / 2 + 0.05, 0);
        this.add(poleMesh);

        // FLEX ARM
        const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 16);
        const armMesh = new THREE.Mesh(armGeometry, lampBodyMaterial2);
        armMesh.position.set(0, poleHeight + 0.25, -0.15);
        armMesh.rotation.x = - Math.PI / 4;
        this.add(armMesh);

        // LAMP HEAD
        const lampHeadGeometry = new THREE.ConeGeometry(lampHeadRadius, lampHeadHeight, 32, 1, true);
        const lampHeadMesh = new THREE.Mesh(lampHeadGeometry, lampBodyMaterial1);
        lampHeadMesh.position.set(0, poleHeight + 0.6, -0.42);
        lampHeadMesh.rotation.x = Math.PI / 6; 
        this.add(lampHeadMesh);

        const sphereGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const sphereMesh = new THREE.Mesh(sphereGeometry, lampBodyMaterial1);
        sphereMesh.position.set(0, poleHeight + 0.1, 0); 
        this.add(sphereMesh);

        // SPOTLIGHT
        const spotLight = new THREE.SpotLight(0xffffff, 4, 7, Math.PI / 6, 0.2, 1);
        spotLight.position.set(0, poleHeight + 0.6, -0.45); 
        spotLight.target.position.set(0, poleHeight - 1, -1.5); 
        spotLight.castShadow = true;
        this.add(spotLight);
        this.add(spotLight.target);

        // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        // this.add(spotLightHelper);
    }
}

export { MyTableLamp };
