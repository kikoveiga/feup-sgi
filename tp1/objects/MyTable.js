import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyTable extends MyObject {
    constructor(app, width = 6, depth = 0.2, radiusLegs = 0.2, height = 4, name = 'table') {
        super(app, name);
        this.type = 'Group';

        const glassTexture = new THREE.TextureLoader().load('./textures/glass.jpg');
        const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');

        // const tableMaterial = new THREE.MeshPhongMaterial({
        //     map: glassTexture,
        //     color: "#eeeeff",
        //     specular: "#eeeeff",
        //     transparent: true,
        //     opacity: 0.5
        // });

        const tableMaterial = new THREE.MeshPhysicalMaterial({
            map: glassTexture,         
            color: "#eeeeff",          
            transparent: true,         
            opacity: 0.5,              
            roughness: 0.05,           
            metalness: 0.0,           
            reflectivity: 0.9,         
            transmission: 0.9,       
            ior: 1.45,                 
            clearcoat: 0.0,            
            clearcoatRoughness: 0.0,  
        });

        const legMaterial = new THREE.MeshPhongMaterial({
            map: ironTexture,  
            color: "#808080",  
            specular: "#ffffff",  
            shininess: 70, 
            bumpScale: 0.1,  
        });

        // TABLE
        const tableTop = new THREE.BoxGeometry(width, height, depth);
        const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
        tableTopMesh.rotation.x = - Math.PI / 2;
        tableTopMesh.position.y = 2.05;
        tableTopMesh.receiveShadow = true;
        tableTopMesh.castShadow = true;
        this.add(tableTopMesh);

        // TABLE LEGS
        const createLeg = (x, z) => {
            const legGeometry = new THREE.CylinderGeometry(radiusLegs, radiusLegs, 2, 32);
            const legMesh = new THREE.Mesh(legGeometry, legMaterial);
            legMesh.position.set(x, 1, z);
            legMesh.receiveShadow = true;
            legMesh.castShadow = true;
            this.add(legMesh);
        };

        const legOffsetX = width / 2 - (radiusLegs * 4);
        const legOffsetZ = depth / 2 + (radiusLegs * 6);
        createLeg(legOffsetX, legOffsetZ);  
        createLeg(-legOffsetX, legOffsetZ); 
        createLeg(legOffsetX, -legOffsetZ); 
        createLeg(-legOffsetX, -legOffsetZ); 
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };
