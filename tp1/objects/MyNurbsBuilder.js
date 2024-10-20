import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

class MyNurbsBuilder {

    constructor(app) {
        this.app = app;
    }

    build(controlPoints, degree1, degree2, samples1, samples2) {

        const knots1 = this.getKnotVector(degree1, controlPoints.length);
        const knots2 = this.getKnotVector(degree2, controlPoints[0].length);

        let stackedPoints = controlPoints.map(row =>
            row.map(p => new THREE.Vector4(p[0], p[1], p[2], p[3]))
        )

        const nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, stackedPoints);
        const geometry = new ParametricGeometry(getSurfacePoint, samples1, samples2);

        return geometry;

        function getSurfacePoint(u, v, target) {
            return nurbsSurface.getPoint(u, v, target);
        }
    }

    getKnotVector(degree, numControlPoints) {
        const knotVector = [];
        const knotCount = degree + numControlPoints + 1;

        for (let i = 0; i < knotCount; i++) {
            if (i < degree) {
                knotVector.push(0);
            } else if (i >= knotCount - degree) {
                knotVector.push(1);
            } else {
                // Evenly distribute intermediate values
                knotVector.push((i - degree) / (knotCount - 2 * degree));
            }
        }

        return knotVector;
    }

}

export { MyNurbsBuilder };