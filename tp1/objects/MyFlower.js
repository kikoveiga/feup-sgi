import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyFlower extends MyObject {
    constructor(app, name = 'curvedStemFlower') {
        super(app, name);

        const centerTexture = new THREE.TextureLoader().load('./textures/center.jpg');
        const petalsTexture = new THREE.TextureLoader().load('./textures/petals.jpg');
        const stemTexture = new THREE.TextureLoader().load('./textures/stem.jpg');
        const leafTexture = new THREE.TextureLoader().load('./textures/leaf.jpg'); 

        const stemMaterial = new THREE.MeshPhongMaterial({
            map: stemTexture,
            color: "#228B22",
            shininess: 10
        });

        const petalMaterial = new THREE.MeshPhongMaterial({
            map: petalsTexture,
            color: "#FFD700",
            shininess: 30,
            side: THREE.DoubleSide
        });

        const centerMaterial = new THREE.MeshPhongMaterial({
            map: centerTexture,
            color: "#8B4513",
            shininess: 5
        });

        const leafMaterial = new THREE.MeshPhongMaterial({
            map: leafTexture,
            color: "#228B22",
            shininess: 5,
            side: THREE.DoubleSide
        });

        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0.15),
            new THREE.Vector3(0, 2, 0.35),
            new THREE.Vector3(0, 2.5, 0.6),
            new THREE.Vector3(0, 3, 0.9)
        ]);

        const stemGeometry = new THREE.TubeGeometry(path, 20, 0.05, 8, false);
        const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
        stemMesh.castShadow = true;
        stemMesh.receiveShadow = true;

        // Flower center
        const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
        centerMesh.position.set(0, 3, 0.9);
        centerMesh.scale.set(1, 0.5, 1);
        centerMesh.rotation.x = 70 * Math.PI / 180;
        centerMesh.castShadow = true;
        centerMesh.receiveShadow = true;

        // Petal Shape
        const petalShape = new THREE.Shape();
        petalShape.bezierCurveTo(0.1, 0.2, 0.15, 0.5, 0, 0.7);
        petalShape.bezierCurveTo(-0.15, 0.5, -0.1, 0.2, 0, 0);

        const petalGeometry = new THREE.ShapeGeometry(petalShape);

        // Group for Petals
        const petalGroup = new THREE.Group();
        const petalCount = 16; 
        const petalRadius = 0.4; 

        for (let i = 0; i < petalCount; i++) {
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);

            const angle = (i / petalCount) * Math.PI * 2;
            const x = petalRadius * Math.cos(angle);
            const z = petalRadius * Math.sin(angle);

            petal.position.set(x, 3, z + 0.9);
            petal.rotation.x = 90 * Math.PI / 180;
            petal.rotation.y = -angle; 

            petal.castShadow = true;
            petal.receiveShadow = true;
            petalGroup.add(petal);
        }

        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);  
        leafShape.bezierCurveTo(0.4, 0, 0.6, 1.2, 0, 2); 
        leafShape.bezierCurveTo(-0.4, 1.2, -0.4, 0.2, 0, 0); 

        const leafGeometry = new THREE.ShapeGeometry(leafShape);

        // Leaves
        const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf1.position.set(-0.05, 1.3, 0.25);
        leaf1.rotation.z = Math.PI / 4;
        leaf1.rotation.x = -Math.PI / 6;
        leaf1.scale.set(0.6, 0.6, 0.6);
        leaf1.castShadow = true;
        leaf1.receiveShadow = true;

        const leaf2 = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf2.position.set(0, 1.8, 0.25);
        leaf2.rotation.z = -Math.PI / 4;
        leaf2.rotation.x = Math.PI / 6;
        leaf2.scale.set(0.6, 0.6, 0.6);
        leaf2.castShadow = true;
        leaf2.receiveShadow = true;

        petalGroup.rotation.x = 70 * Math.PI / 180;
        petalGroup.position.set(0, 3.2, -2.3);
        this.add(stemMesh);
        this.add(centerMesh);
        this.add(petalGroup);
        this.add(leaf1);
        this.add(leaf2);
    }
}

export { MyFlower };
