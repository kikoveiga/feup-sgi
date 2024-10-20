import * as THREE from 'three';
import { MyObject } from './MyObject.js';

class MyCatmullRomCurve extends MyObject {
    constructor(app, numberOfSamples, position, points, name = 'catmull rom curve') {
        super(app, name);

        let curve = new THREE.CatmullRomCurve3(points);
        let sampledPoints = curve.getPoints(numberOfSamples);

        this.curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        this.lineObj = new THREE.Line(this.curveGeometry, this.lineMaterial);
        this.lineObj.position.set(position.x, position.y, position.z);
        this.add(this.lineObj);
    }
}

export { MyCatmullRomCurve };