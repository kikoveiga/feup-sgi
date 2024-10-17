import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './objects/MyTable.js';
import { MyFloor } from './objects/MyFloor.js';
import { MyWall } from './objects/MyWall.js';
import { MyPlate } from './objects/MyPlate.js';
import { MyCake } from './objects/MyCake.js';
import { MyCandle } from './objects/MyCandle.js';
import { MyChair } from './objects/MyChair.js';
import { MyCup } from './objects/MyCup.js';
import { MyDoor } from './objects/MyDoor.js';
import { MyRug } from './objects/MyRug.js';
import { MyPainting } from './objects/MyPainting.js';
import { MySofa } from './objects/MySofa.js';
import { MyLamp } from './objects/MyLamp.js';
import { MyPolyline } from './objects/MyPolyline.js';
import { MyQuadraticBezierCurve } from './objects/MyQuadraticBezierCurve.js';
import { MyCubicBezierCurve } from './objects/MyCubicBezierCurve.js';
import { MyCatmullRomCurve } from './objects/MyCatmullRomCurve.js';


class MyContents  {

    constructor(app) {
        this.app = app
        this.axis = null

        // object creating
        this.objects = [];

        this.table = null;
        this.floor = null;
        this.wall1 = null;
        this.wall2 = null;
        this.wall3 = null;
        this.wall4 = null;
        this.ceiling = null;
        this.plate = null;
        this.cake = null;
        this.chair1 = null;
        this.chair2 = null;
        this.cup = null;
        this.door = null;
        this.rug = null;
        this.painting = null;
        this.sofa = null;
        this.polyline = null;
        this.quadraticBezierCurve = null;
        this.cubicBezierCurve = null;
        this.catmullRomCurve = null;

        // aux vars
        this.floorWidth = 24;
        this.floorLength = 18;
    }


    buildFloor() {    
        this.floor = new MyFloor(this.app, this.floorWidth, this.floorLength, true);
        this.app.scene.add(this.floor);
        this.objects.push(this.floor);
    }

    buildTable() {
        this.table = new MyTable(this.app);
        this.table.scale.set(1.4, 1.4, 1.4);
        this.table.receiveShadow = true;
        this.app.scene.add(this.table);
        this.objects.push(this.table);
    }

    buildWalls() {
        const wallHeight = 10;

        this.wall1 = new MyWall(this.app, this.floorWidth, wallHeight, 'wall1');
        this.wall1.position.set(0, wallHeight / 2, -this.floorLength / 2);
        this.app.scene.add(this.wall1);
        this.objects.push(this.wall1);

        this.wall2 = new MyWall(this.app, this.floorWidth, wallHeight, 'wall2');
        this.wall2.rotation.y = 180 * Math.PI / 180;
        this.wall2.position.set(0, wallHeight / 2, this.floorLength / 2); 
        this.app.scene.add(this.wall2);
        this.objects.push(this.wall2);

        this.wall3 = new MyWall(this.app, this.floorLength, wallHeight, 'wall3');
        this.wall3.rotation.y = Math.PI / 2;
        this.wall3.position.set(-this.floorWidth / 2, wallHeight / 2, 0);
        this.app.scene.add(this.wall3);
        this.objects.push(this.wall3);

        this.wall4 = new MyWall(this.app, this.floorLength, wallHeight, 'wall4');
        this.wall4.rotation.y = -Math.PI / 2;
        this.wall4.position.set(this.floorWidth / 2, wallHeight / 2, 0);
        this.app.scene.add(this.wall4);
        this.objects.push(this.wall4);

        this.ceiling = new MyFloor(this.app, this.floorWidth, this.floorLength, false);
        this.ceiling.rotation.z = 180 * Math.PI / 180;
        this.ceiling.position.set(0, wallHeight, 0);
        this.app.scene.add(this.ceiling);
        this.objects.push(this.ceiling);
    }

    buildPlate() {
        this.plate1 = new MyPlate(this.app, 'plate1');
        this.plate1.position.set(0.9, 3, 0.9);
        this.plate1.scale.set(1.2, 1.2, 1.2);

        this.plate2 = new MyPlate(this.app, 'plate2');
        this.plate2.position.set(0, 3, -1.7);
        this.plate2.scale.set(0.8, 0.8, 0.8);

        this.app.scene.add(this.plate1);
        this.app.scene.add(this.plate2);

        this.objects.push(this.plate1);
        this.objects.push(this.plate2);
    }

    buildCake() {
        this.cake = new MyCake(this.app);
        this.cake.position.set(0.9, 3.3, 0.9);
        this.app.scene.add(this.cake);
        this.objects.push(this.cake);
    }

    buildCandle() {
        this.candle = new MyCandle(this.app);
        this.candle.position.set(1.1, 3.62, 1);
        this.candle.scale.set(0.3, 0.3, 0.3);
        this.app.scene.add(this.candle);
        this.objects.push(this.candle);
    }

    buildChairs() {
        this.chair1 = new MyChair(this.app, 'chair1');
        this.chair2 = new MyChair(this.app, 'chair2');

        this.chair1.position.set(0, 0, -3);
        this.chair1.scale.set(1.2, 1.2, 1.2);
        this.app.scene.add(this.chair1);
        this.objects.push(this.chair1);

        this.chair2.position.set(-1.5, 1.1, 3.5);
        this.chair2.scale.set(1.2, 1.2, 1.2);
        this.chair2.rotation.x = - Math.PI / 2;
        this.chair2.rotation.z = 130 * Math.PI / 180;
        this.app.scene.add(this.chair2);
        this.objects.push(this.chair2);
    }   

    buildCup() {
        this.cup = new MyCup(this.app);
        this.cup.scale.set(0.3, 0.3, 0.3);
        this.cup.position.set(1, 3.1, -1.3);
        this.cup.rotation.y = 120 *Math.PI / 180;
        this.objects.push(this.cup);
        this.app.scene.add(this.cup);
    }

    buildDoor() {
        this.door = new MyDoor(this.app);
        this.door.position.set(this.floorLength / 3, 0, this.floorLength / 2);
        this.objects.push(this.door);
        this.app.scene.add(this.door);
    }

    buildRug() {
        this.rug = new MyRug(this.app);
        this.rug.position.set(0, 0, 0);
        this.rug.scale.set(2, 2, 2);
        this.rug.rotation.y = Math.PI /2;
        this.objects.push(this.rug);
        this.app.scene.add(this.rug);
    }

    buildPainting() {
        this.painting = new MyPainting(this.app);
        this.painting.position.set(-5, 6, -(this.floorLength / 2) + 0.1);
        this.painting.scale.set(0.4, 0.4, 0.4);
        this.objects.push(this.painting);
        this.app.scene.add(this.painting);
    }

    buildSofa() {
        this.sofa = new MySofa(this.app);
        this.sofa.scale.set(1.3, 1.3, 1.3);
        this.sofa.rotation.y = Math.PI / 2;
        this.sofa.position.set(- this.floorLength / 2 - 1, 0.3, 0);
        this.objects.push(this.sofa);
        this.app.scene.add(this.sofa);
    }

    buildLamp() {
        this.lamp = new MyLamp(this.app);
        this.lamp.position.set(0, 5, 0);
        this.objects.push(this.lamp);
        this.app.scene.add(this.lamp);
    }

    drawHull(position, points) {

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        this.hullMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, opacity: 0.8, transparent: true} );
        let line = new THREE.Line( geometry, this.hullMaterial );
        line.position.set(position.x, position.y, position.z);
        this.app.scene.add(line);
    }

    buildPolyline() {

        if (this.polyline !== null) this.app.scene.remove(this.polyline);
        
        let color = 0xff0000;
        let position = new THREE.Vector3(-4,4,0);

        let points = [

            new THREE.Vector3( -0.6, -0.6, 1.0 ),
            new THREE.Vector3(  0.6, -0.6, 0.0 ),
            new THREE.Vector3(  0.6,  0.6, 0.0 ),
            new THREE.Vector3( -0.6,  0.6, 5.0 )
        ];

        this.drawHull(position, points);

        this.polyline = new MyPolyline(this.app, color, position, points);
        this.objects.push(this.polyline);
        this.app.scene.add(this.polyline);
    }

    recomputePolyline() { 
        if (this.polyline !== null) this.app.scene.remove(this.polyline);
        this.buildPolyline();
    }

    buildQuadraticBezierCurve() {

        let numberOfSamples = 16;
        let position = new THREE.Vector3(-2, 4, 0);

        let points = [

            new THREE.Vector3( -0.6, -0.6, 0.0 ), // starting point
            new THREE.Vector3(    0,  0.6, 0.0 ), // control point
            new THREE.Vector3(  0.6, -0.6, 0.0 )  // ending point
        ];

        this.drawHull(position, points);

        this.quadraticBezierCurve = new MyQuadraticBezierCurve(this.app, numberOfSamples, position, points);
        this.objects.push(this.quadraticBezierCurve);
        this.app.scene.add(this.quadraticBezierCurve);
    }

    recomputeQuadraticBezierCurve() {
        if (this.quadraticBezierCurve !== null) this.app.scene.remove(this.quadraticBezierCurve);
        this.buildQuadraticBezierCurve();
    }

    buildCubicBezierCurve() {

        let numberOfSamples = 500;
        let position = new THREE.Vector3(-4, 0, 0);

        let points = [

            new THREE.Vector3( -0.6, -0.6, 0.0 ), // starting point
            new THREE.Vector3( -0.6,  0.6, 0.0 ), // control point
            new THREE.Vector3(  0.6, -0.6, 0.0 ), // control point
            new THREE.Vector3(  0.6,  0.6, 0.0 )  // ending point
        ];

        this.drawHull(position, points);

        this.cubicBezierCurve = new MyCubicBezierCurve(this.app, numberOfSamples, position, points);
        this.objects.push(this.cubicBezierCurve);
        this.app.scene.add(this.cubicBezierCurve);
    }

    recomputeCubicBezierCurve() {
        if (this.cubicBezierCurve !== null) this.app.scene.remove(this.cubicBezierCurve);
        this.buildCubicBezierCurve();
    }

    buildCatmullRomCurve() {

        let numberOfSamples = 500;
        let position = new THREE.Vector3(-4, 0, 0);

        let points = [

            new THREE.Vector3( -0.6,  0.0, 0.0 ), 
            new THREE.Vector3( -0.3,  0.6, 0.3 ), 
            new THREE.Vector3(  0.0,  0.0, 0.0 ), 
            new THREE.Vector3(  0.3, -0.6, 0.3 ),
            new THREE.Vector3(  0.6,  0.0, 0.0 ),
            new THREE.Vector3(  0.9,  0.6, 0.3 ),
            new THREE.Vector3(  1.2,  0.0, 0.0 ),
        ];

        this.drawHull(position, points);

        this.catmullRomCurve = new MyCatmullRomCurve(this.app, numberOfSamples, position, points);
        this.objects.push(this.catmullRomCurve);
        this.app.scene.add(this.catmullRomCurve);
    }

    recomputeCatmullRomCurve() {
        if (this.catmullRomCurve !== null) this.app.scene.remove(this.catmullRomCurve);
        this.buildCatmullRomCurve();
    }

    init() {
       
        if (this.axis === null) {
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }

        const pointLight = new THREE.PointLight( 0xffffff, 2, 0, 0);
        pointLight.position.set( 5, 20, 5 );
        this.app.scene.add( pointLight );

        const sphereSize = 0.5
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        const ambientLight = new THREE.AmbientLight( 0x555555, 4 );
        this.app.scene.add( ambientLight );

        this.buildFloor();
        this.buildTable();
        this.buildWalls();
        this.buildPlate();
        this.buildCake();
        this.buildCandle();
        this.buildChairs();
        this.buildCup();
        this.buildDoor();
        this.buildRug();
        this.buildPainting();
        this.buildSofa();
        this.buildLamp();
        this.recomputePolyline();
        this.recomputeQuadraticBezierCurve();
        this.recomputeCubicBezierCurve();
        this.recomputeCatmullRomCurve();
    }
    
    // useless
    update() {
        
    }

}

export { MyContents };