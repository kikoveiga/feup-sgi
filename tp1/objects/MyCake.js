import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyCake extends MyObject {
    constructor(app, radius = 0.7, height = 0.4, width = 0.7, p1rotation = 0, p2rotation = 330 * Math.PI / 180, name = 'cake') {
        super(app, name);

        const texture1 = new THREE.TextureLoader().load('./textures/cake2.jpg');
        const texture2 = new THREE.TextureLoader().load('./textures/cake1.jpg');
        const texture3 = new THREE.TextureLoader().load('./textures/cake2.jpg');

        texture1.wrapS = THREE.RepeatWrapping;
        texture1.wrapT = THREE.RepeatWrapping;
        texture1.repeat.set(3.5, 0.8);          

        texture3.wrapS = THREE.RepeatWrapping;
        texture3.wrapT = THREE.RepeatWrapping;
        texture3.repeat.set(1.5, 1.5);        

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
            shininess: 0,
            side: THREE.DoubleSide
        });

        this.cakeMaterial3 = new THREE.MeshPhongMaterial({
            map: texture3,
            color: "#a0a0a0",
            specular: "#777777",
            emissive: "#000000",
            shininess: 0,
            side: THREE.DoubleSide
        });

        // OPEN CYLINDER
        const cakeGeometry = new THREE.CylinderGeometry(radius, radius, height, 50, 1, true, p1rotation, p2rotation);
        const cakeMesh = new THREE.Mesh(cakeGeometry, this.cakeMaterial1);

        cakeMesh.receiveShadow = true;
        cakeMesh.castShadow = true;

        // TOP
        const topGeometry = new THREE.CircleGeometry(radius, 50, 0, p2rotation);
        const topMesh = new THREE.Mesh(topGeometry, this.cakeMaterial3);
        topMesh.rotation.x = -Math.PI / 2;
        topMesh.rotation.z = - 90 * Math.PI / 180;
        topMesh.position.y = height / 2;    
        topMesh.receiveShadow = true;
        topMesh.castShadow = true;

        // BOTTOM
        const bottomGeometry = new THREE.CircleGeometry(radius, 50, 0, p2rotation);
        const bottomMesh = new THREE.Mesh(bottomGeometry, this.cakeMaterial3);
        bottomMesh.rotation.x = -Math.PI / 2;
        bottomMesh.rotation.z = - 90 * Math.PI / 180;
        bottomMesh.position.y = - height / 2 + 0.03;    
        bottomMesh.receiveShadow = true;
        bottomMesh.castShadow = true;

        let planeGeometry = new THREE.PlaneGeometry(width, height);

        let plane1Mesh = new THREE.Mesh(planeGeometry, this.cakeMaterial2);
        plane1Mesh.position.set(-radius / 4, 0, radius / 2 - 0.05);
        plane1Mesh.rotation.y = 60 * Math.PI / 180;

        let plane2Mesh = new THREE.Mesh(planeGeometry, this.cakeMaterial2);
        plane2Mesh.position.set(0, 0, radius / 2);
        plane2Mesh.rotation.y = -Math.PI / 2;

        plane1Mesh.receiveShadow = true;
        plane1Mesh.castShadow = true;

        plane2Mesh.receiveShadow = true;
        plane2Mesh.castShadow = true;

        cakeMesh.add(topMesh);  
        cakeMesh.add(bottomMesh);
        cakeMesh.add(plane1Mesh);  
        cakeMesh.add(plane2Mesh);  

        this.add(cakeMesh);
    }
}

export { MyCake };
