import * as THREE from 'three';

class MyObject extends THREE.Object3D {
    constructor(app, name) {
        super();
        this.app = app;
        this.name = name;
    }
}

export { MyObject };
