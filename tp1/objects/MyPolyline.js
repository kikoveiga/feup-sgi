import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyPolyline extends MyObject {
    constructor(app, color, points, position, name = 'polyline') {
        super(app, name);

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        this.polyline = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: color}));
        this.polyline.position.set(position.x, position.y, position.z);
    }

    drawHull() {
        
        this.hullMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, opacity: 0.5, transparent: true} );
        let line = new THREE.Line( geometry, this.hullMaterial );
    }
}

export { MyPolyline };