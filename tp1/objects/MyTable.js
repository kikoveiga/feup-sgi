import * as THREE from 'three';

class MyTable extends THREE.Object3D {
    constructor(app, width, depth, radiusLegs) {
        super();
        this.app = app;

        const texture = new THREE.TextureLoader().load('./textures/wood.jpg');
        const tableMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            color: "#d8b281",
            specular: "#222222",
            shininess: 50
        });
        const legMaterial = new THREE.MeshPhongMaterial({
            color: "#8b5a2b", 
            specular: "#666666",
            shininess: 50
        });

        // TABLE
        const tableTop = new THREE.BoxGeometry(width, 2.5, depth);
        const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
        tableTopMesh.rotation.x = - Math.PI / 2;
        tableTopMesh.position.y = 2;
        this.add(tableTopMesh);

        // TABLE LEGS
        const createLeg = (x, z) => {
            const legGeometry = new THREE.CylinderGeometry(radiusLegs, radiusLegs, 2, 32);
            const legMesh = new THREE.Mesh(legGeometry, legMaterial);
            legMesh.position.set(x, 1, z);
            this.add(legMesh);
        };

        const legOffsetX = width / 2 - (radiusLegs * 1.5);
        const legOffsetZ = depth / 2 + (radiusLegs * 4);
        createLeg(legOffsetX, legOffsetZ);  
        createLeg(-legOffsetX, legOffsetZ); 
        createLeg(legOffsetX, -legOffsetZ); 
        createLeg(-legOffsetX, -legOffsetZ); 
    }
}

export { MyTable };
