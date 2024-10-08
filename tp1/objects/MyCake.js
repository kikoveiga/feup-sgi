import * as THREE from 'three';

class MyCake extends THREE.Object3D {
    constructor(app, radius = 0.7, height = 0.4, width = 0.7, p1rotation, p2rotation, x1, z1, x2, z2) {
        super();
        this.app = app;

        const texture1 = new THREE.TextureLoader().load('./textures/cake2.jpg');
        const texture2 = new THREE.TextureLoader().load('./textures/cake1.jpg');

        this.cakeMaterial1 = new THREE.MeshPhongMaterial({
            map: texture1,
            color: "#a0a0a0", 
            specular: "#777777", 
            emissive: "#000000", 
            shininess: 0
        });

        this.cakeMaterial2 = new THREE.MeshPhongMaterial({
            map: texture2,
            color: "#a0a0a0", 
            specular: "#777777", 
            emissive: "#000000", 
            shininess: 0
        });

        const cakeGeometry = new THREE.CylinderGeometry(radius, radius, height, 50);
        const cakeMesh = new THREE.Mesh(cakeGeometry, this.cakeMaterial1);

        let plane1Geometry = new THREE.PlaneGeometry(width, height);
        let plane1Mesh = new THREE.Mesh(plane1Geometry, this.cakeMaterial2);
        let plane2Mesh = new THREE.Mesh(plane1Geometry, this.cakeMaterial2);

        // PLANE CLIPPING NEEDS TO BE DONE HERE

        cakeMesh.add(plane1Mesh);
        cakeMesh.add(plane2Mesh);

        this.add(cakeMesh);
        this.add(plane1Mesh);
        this.add(plane2Mesh);

    }
}

export { MyCake };
