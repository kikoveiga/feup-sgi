import * as THREE from 'three';
import { MyObject } from './MyObject.js';
import { MyPainting } from './MyPainting.js';

class MyBeetle extends MyObject {
    constructor(app, name = 'beetle') {
        super(app, name);

        this.type = 'Group';

        this.painting = new MyPainting(app, 'ceu', 5, 3, 0.2);
        this.painting.position.set(5, 2.5, 0);
        this.painting.scale.set(15, 15, 1);

        this.add(this.painting);

        const leftWheel = new THREE.ArcCurve(0.01, 0, 3, 2 * Math.PI, Math.PI, false); // Half arc
        this.drawArc(leftWheel, 0xFF0000);

        // Half-circle for right wheel
        const rightWheel = new THREE.ArcCurve(10, 0, 3, 2 * Math.PI, Math.PI, false); // Half arc
        this.drawArc(rightWheel, 0xFF0000);

        // Three quarter arcs for the top part of the body
        const leftTop = new THREE.ArcCurve(5, 0, 8, Math.PI / 2, Math.PI, false); // Left quarter
        const middleTop = new THREE.ArcCurve(5, 4, 4, 0, Math.PI / 2, false); // Middle quarter
        const rightTop = new THREE.ArcCurve(9, 0, 4, 0, Math.PI / 2, false); // Right quarter
        
        this.drawArc(leftTop, 0xffffff);
        this.drawArc(middleTop, 0xffffff);
        this.drawArc(rightTop, 0x000000);
    }


    drawArc(arc, color) {

        const points = arc.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color });
        const arcLine = new THREE.Line(geometry, material);

        this.add(arcLine);
    }
}   

MyBeetle.prototype.isGroup = true;


export { MyBeetle };