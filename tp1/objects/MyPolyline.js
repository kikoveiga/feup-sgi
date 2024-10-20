import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyPolyline extends MyObject {
    constructor(app, color, position, points, name = 'polyline') {
        super(app, name);

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        this.polyline = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: color}));
        this.polyline.position.set(position.x, position.y, position.z);
        
        this.add(this.polyline);
    }
}

export { MyPolyline };