import * as THREE from 'three';

class MyCake extends THREE.Object3D {
    constructor(app, radius = 0.7, height = 0.4, width = 0.7, p1rotation = -Math.PI / 2, p2rotation = 2 * Math.PI / 6, z1 = 0.35, x2 = -0.125, z2 = 0.33) {
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
            clippingPlanes: []
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

        const clipPlanes = [
            new THREE.Plane(new THREE.Vector3(Math.sin(p1rotation), 0, Math.cos(p1rotation)), 0.35), 
            new THREE.Plane(new THREE.Vector3(-Math.sin(p2rotation), 0, -Math.cos(p2rotation)), 0.35) 
        ];

        this.cakeMaterial1.clippingPlanes = clipPlanes;

        let planeGeometry = new THREE.PlaneGeometry(width, height);

        let plane1Mesh = new THREE.Mesh(planeGeometry, this.cakeMaterial2);
        plane1Mesh.position.set(0, height / 2 - 0.2, z1);
        plane1Mesh.rotation.y = p1rotation;

        let plane2Mesh = new THREE.Mesh(planeGeometry, this.cakeMaterial2);
        plane2Mesh.position.set(x2, height / 2 - 0.2, z2);
        plane2Mesh.rotation.y = p2rotation;

        cakeMesh.add(plane1Mesh);
        cakeMesh.add(plane2Mesh);

        this.add(cakeMesh);
    }
}

export { MyCake };
