import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyCubicBezierCurve extends MyObject {
    constructor(app, numberOfSamples, position, points, name = 'cubic bezier curve') {
        super(app, name);

        let curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        let sampledPoints = curve.getPoints(numberOfSamples);

        this.curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        this.lineObj = new THREE.Line(this.curveGeometry, this.lineMaterial);
        this.lineObj.position.set(position.x, position.y, position.z);
        this.add(this.lineObj);
    }
}

export { MyCubicBezierCurve };