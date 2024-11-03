import * as THREE from 'three';
import { MyObject } from './MyObject.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyNewspaper extends MyObject {
    constructor(app, name = 'newspaper') {
        super(app, name);

        this.app = app;
        this.material = null;
        this.mesh = null;
        this.builder = new MyNurbsBuilder(app);

    }

    buildMaterial() {
        const map = new THREE.TextureLoader().load('textures/newspaper.jpeg');
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;


        this.material = new THREE.MeshLambertMaterial({ 
            map: map, 
            side: THREE.DoubleSide,
            color: 0xffffff
        });
    }

    buildNewspaper() {
        let controlPoints = [
            [
                [ -1.0, -1.0, 0.0, 1 ],
                [ -1.0,  1.0, 0.0, 1 ]
            ],
            [ 
                [ 0, -1.0, 2.0, 1 ],
                [ 0,  1.0, 2.0, 1 ]
            ],
            [
                [ 1.0, -1.0, 0.0, 1 ],
                [ 1.0,  1.0, 0.0, 1 ]
            ]
        ];
    
        const orderU = 2;
        const orderV = 1; 
        const samplesU = 20;
        const samplesV = 20;
    
        const geometry = this.builder.build(controlPoints, orderU, orderV, samplesU, samplesV);
        this.mesh1 = new THREE.Mesh(geometry, this.material);
        this.mesh2 = new THREE.Mesh(geometry, this.material);
    
        this.mesh2.position.set(-2, 3, -1.0);
        this.mesh1.position.set(-3, 3, -1.0);
        this.mesh1.rotation.y = Math.PI;
        this.mesh1.rotation.x = 90 * Math.PI / 180;
        this.mesh2.rotation.x = -90 * Math.PI / 180;

        this.mesh2.scale.set(0.5, 0.5, 0.4);
        this.mesh1.scale.set(0.5, 0.5, 0.4);
        
        this.mesh1.castShadow = true;
        this.mesh1.receiveShadow = true;
        this.mesh2.castShadow = true;
        this.mesh2.receiveShadow = true;

        this.app.scene.add(this.mesh1);
        this.app.scene.add(this.mesh2);
    }
    
    
    
    
}

export { MyNewspaper };