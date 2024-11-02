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
        centerMesh.rotation.x = 90 * Math.PI / 180;
        centerMesh.castShadow = true;
        centerMesh.receiveShadow = true;


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


        // Petals
        const petalShape = new THREE.Shape();
        petalShape.bezierCurveTo(0.1, 0.2, 0.15, 0.5, 0, 0.7);
        petalShape.bezierCurveTo(-0.15, 0.5, -0.1, 0.2, 0, 0);
        const petalGeometry = new THREE.ShapeGeometry(petalShape);

        const petalGroup = new THREE.Group();
        const petalRadius = 0.4; 

        const petal1 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal2 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal3 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal4 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal5 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal6 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal7 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal8 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal9 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal10 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal11 = new THREE.Mesh(petalGeometry, petalMaterial);
        const petal12 = new THREE.Mesh(petalGeometry, petalMaterial);

        petal1.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.4, 3.1, petalRadius * Math.sin(Math.PI * 2) + 0.9);

        petal2.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.4, 2.15, petalRadius * Math.sin(Math.PI * 2) + 0.9);

        petal3.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.5, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal3.rotation.z = 90 * Math.PI / 180;

        petal4.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.3, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal4.rotation.z = - 90 * Math.PI / 180;

        petal5.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.5, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal5.rotation.z = 55 * Math.PI / 180;

        petal6.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.3, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal6.rotation.z = - 55 * Math.PI / 180;

        petal7.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.5, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal7.rotation.z = 20 * Math.PI / 180;

        petal8.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.3, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal8.rotation.z = - 20 * Math.PI / 180;

        petal9.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.5, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal9.rotation.z = 125 * Math.PI / 180;

        petal10.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.3, 3.05, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal10.rotation.z = - 125 * Math.PI / 180;

        petal11.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.5, 3, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal11.rotation.z = 160 * Math.PI / 180;

        petal12.position.set(petalRadius * Math.cos(Math.PI * 2) - 0.3, 3, petalRadius * Math.sin(Math.PI * 2) + 0.9);
        petal12.rotation.z = - 160 * Math.PI / 180;

        petal1.castShadow = true;
        petal1.receiveShadow = true;
        petal2.castShadow = true;
        petal2.receiveShadow = true;
        petal3.castShadow = true;
        petal3.receiveShadow = true;
        petal4.castShadow = true;
        petal4.receiveShadow = true;
        petal5.castShadow = true;
        petal5.receiveShadow = true;
        petal6.castShadow = true;
        petal6.receiveShadow = true;
        petal7.castShadow = true;
        petal7.receiveShadow = true;
        petal8.castShadow = true;
        petal8.receiveShadow = true;
        petal9.castShadow = true;
        petal9.receiveShadow = true;
        petal10.castShadow = true;
        petal10.receiveShadow = true;
        petal11.castShadow = true;
        petal11.receiveShadow = true;
        petal12.castShadow = true;
        petal12.receiveShadow = true;

        petalGroup.add(petal1);
        petalGroup.add(petal2);
        petalGroup.add(petal3);
        petalGroup.add(petal4);
        petalGroup.add(petal5);
        petalGroup.add(petal6);
        petalGroup.add(petal7);
        petalGroup.add(petal8);
        petalGroup.add(petal9);
        petalGroup.add(petal10);
        petalGroup.add(petal11);
        petalGroup.add(petal12);
        petalGroup.add(centerMesh);

        petalGroup.rotation.x = - 10 * Math.PI / 180;
        petalGroup.position.set(0, -0.2, 0.5);

        this.add(stemMesh);
        this.add(petalGroup);
        this.add(leaf1);
        this.add(leaf2);
    }
}

export { MyFlower };
