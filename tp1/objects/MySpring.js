import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MySpring extends MyObject {
    constructor(app, name = 'spring') {
        super(app, name);

        const points = [];
        const turns = 7;  // Number of coils
        const height = 5;  // Total height of the spring
        const radius = 0.5; // Radius of the spring

        for (let i = 0; i <= turns * 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            const y = (i / (turns * 10)) * height;
            points.push(new THREE.Vector3(x, y, z));
        }

        const texture = new THREE.TextureLoader().load('./textures/iron.jpg');

        const springCurve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(springCurve, 200, 0.1, 8, false); // 0.1 is thickness
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            map: texture,
            metalness: 0.3,
            roughness: 0.8
            
        });
        const springMesh = new THREE.Mesh(tubeGeometry, material);

        this.add(springMesh);
    }


}


export { MySpring };