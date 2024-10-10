import * as THREE from 'three';

class MyCake extends THREE.Object3D {
    constructor(app, radius = 0.7, height = 0.4, width = 0.7, p1rotation = 0, p2rotation = 330 * Math.PI / 180) {
        super();
        this.app = app;

        const texture1 = new THREE.TextureLoader().load('./textures/cake2.jpg');
        const texture2 = new THREE.TextureLoader().load('./textures/cake1.jpg');

        this.cakeMaterial1 = new THREE.MeshPhongMaterial({
            map: texture1,
            color: "#a0a0a0",
            specular: "#777777",
            emissive: "#000000",
            shininess: 0,
            side: THREE.DoubleSide
        });

        this.cakeMaterial2 = new THREE.MeshPhongMaterial({
            map: texture2,
            color: "#a0a0a0",
            specular: "#777777",
            emissive: "#000000",
            shininess: 0
        });

        const cakeGeometry = new THREE.CylinderGeometry(radius, radius, height, 50, 1, false, p1rotation, p2rotation);
        const cakeMesh = new THREE.Mesh(cakeGeometry, this.cakeMaterial1);


        let planeGeometry = new THREE.PlaneGeometry(width, height);

        let plane1Mesh = new THREE.Mesh(planeGeometry, this.cakeMaterial2);
        plane1Mesh.position.set(-radius/4, 0, radius/2 -0.05);
        plane1Mesh.rotation.y = 60 * Math.PI / 180;

        let plane2Mesh = new THREE.Mesh(planeGeometry, this.cakeMaterial2);
        plane2Mesh.position.set(0, 0, radius/2);
        plane2Mesh.rotation.y = - Math.PI / 2;

        cakeMesh.add(plane1Mesh);
        cakeMesh.add(plane2Mesh);

        this.add(cakeMesh);
    }
}

export { MyCake };
