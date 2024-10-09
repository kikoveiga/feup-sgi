import * as THREE from 'three';

class MyTable extends THREE.Object3D {
    constructor(app, width = 5, depth = 0.2, radiusLegs = 0.2) {
        super();
        this.app = app;

        const glassTexture = new THREE.TextureLoader().load('./textures/glass.jpg');
        const ironTexture = new THREE.TextureLoader().load('./textures/iron.jpg');

        const tableMaterial = new THREE.MeshPhongMaterial({
            map: glassTexture,
            color: "#eeeeff",
            specular: "#eeeeff",
            transparent: true,
            opacity: 0.5
        });

        const legMaterial = new THREE.MeshPhongMaterial({
            map: ironTexture,  
            color: "#808080",  
            specular: "#808080",  
            shininess: 70, 
            bumpScale: 0.1,  
            metalness: 0.1
        });

        // TABLE
        const tableTop = new THREE.BoxGeometry(width, 3, depth);
        const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
        tableTopMesh.rotation.x = - Math.PI / 2;
        tableTopMesh.position.y = 2.05;
        this.add(tableTopMesh);

        // TABLE LEGS
        const createLeg = (x, z) => {
            const legGeometry = new THREE.CylinderGeometry(radiusLegs, radiusLegs, 2, 32);
            const legMesh = new THREE.Mesh(legGeometry, legMaterial);
            legMesh.position.set(x, 1, z);
            this.add(legMesh);
        };

        const legOffsetX = width / 2 - (radiusLegs * 3);
        const legOffsetZ = depth / 2 + (radiusLegs * 4);
        createLeg(legOffsetX, legOffsetZ);  
        createLeg(-legOffsetX, legOffsetZ); 
        createLeg(legOffsetX, -legOffsetZ); 
        createLeg(-legOffsetX, -legOffsetZ); 
    }
}

export { MyTable };
