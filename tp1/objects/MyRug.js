import * as THREE from 'three';

class MyRug extends THREE.Object3D {
    constructor(app, width = 5, length = 8) {
        super();
        this.app = app;

        const rugTexture = new THREE.TextureLoader().load('./textures/rug.jpg');
        const rugBumpMap = new THREE.TextureLoader().load('./textures/rugbump.jpg'); 

        rugTexture.wrapS = THREE.RepeatWrapping;
        rugTexture.wrapT = THREE.RepeatWrapping;
        rugBumpMap.wrapS = THREE.RepeatWrapping;
        rugBumpMap.wrapT = THREE.RepeatWrapping;


        rugTexture.repeat.set(1, 2);  
        rugBumpMap.repeat.set(1, 2);

        const rugMaterial = new THREE.MeshPhongMaterial({
            map: rugTexture,      
            bumpMap: rugBumpMap,       
            bumpScale: 0.2,           
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
