import * as THREE from 'three';
import { MyObject } from './MyObject.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyNewspaper extends MyObject {
    constructor(app, name = 'newspaper') {
        super(app, name);

        this.material = null;
        this.mesh = null;
        this.builder = new MyNurbsBuilder(app);

    }

    buildMaterial() {
        const map = new THREE.TextureLoader().load('textures/newspaper.jpeg');
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide, transparent: true, opacity: 0.90 });
    }

    buildNewspaper() {

        let controlPoints = [
            [ // U = 0
                [-1.5, -1.5, 0.0, 1],  // Bottom left
                [-1.5,  0.0, 1.5, 1],  // Bottom center (interpolated)
                [-1.5,  1.5, 0.0, 1]   // Bottom right
            ],
            [ // U = 1
                [0.0, -1.5, 3.0, 1],   // Center left
                [0.0,  0.0, 3.0, 1],   // Center (original)
                [0.0,  1.5, 3.0, 1]    // Center right
            ],
            [ // U = 2
                [1.5, -1.5, 0.0, 1],   // Top left
                [1.5,  0.0, 1.5, 1],   // Top center (interpolated)
                [1.5,  1.5, 0.0, 10]   // Top right
            ]
        ];
        
        const orderU = 2;
        const orderV = 2;

        const samplesU = 20;
        const samplesV = 20;

        // Use MyNurbsBuilder to create the geometry
        const geometry = this.builder.build(controlPoints, orderU, orderV, samplesU, samplesV);

        // Create a mesh with the generated NURBS geometry and the material
        this.mesh = new THREE.Mesh(geometry, this.material);

        // Set position and rotation (if needed)
        this.mesh.position.set(0, 0, 0);
        this.mesh.rotation.set(0, 0, 0);

        // Add the mesh to the scene
        this.app.scene.add(this.mesh);
    }

    removeNewspaper() {
        if (this.mesh) {
            this.app.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
    }

}

export { MyNewspaper };