import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './objects/MyTable.js';
import { MyFloor } from './objects/MyFloor.js';
import { MyWall } from './objects/MyWall.js';
import { MyPlate } from './objects/MyPlate.js';
import { MyCake } from './objects/MyCake.js';
import { MyCandle } from './objects/MyCandle.js';


class MyContents  {

    constructor(app) {
        this.app = app
        this.axis = null

        // object creating
        this.table = null;
        this.floor = null;
        this.wall1 = null;
        this.wall2 = null;
        this.wall3 = null;
        this.wall4 = null;
        this.plate = null;
        this.cake = null;


        // aux vars
        this.floorWidth = 24;
        this.floorLength = 18;

    }


    buildFloor() {    
        this.floor = new MyFloor(this.app, this.floorWidth, this.floorLength);
        this.app.scene.add(this.floor);
    }

    buildTable() {
        this.table = new MyTable(this.app);
        this.table.scale.set(1.4, 1.4, 1.4);
        this.app.scene.add(this.table);
    }

    buildWalls() {
        const wallHeight = 10;

        this.wall1 = new MyWall(this.app, this.floorWidth, wallHeight);
        this.wall1.position.set(0, wallHeight / 2, -this.floorLength / 2);
        this.app.scene.add(this.wall1);

        this.wall2 = new MyWall(this.app, this.floorWidth, wallHeight);
        this.wall2.rotation.y = 180 * Math.PI / 180;
        this.wall2.position.set(0, wallHeight / 2, this.floorLength / 2); 
        this.app.scene.add(this.wall2);

        this.wall3 = new MyWall(this.app, this.floorLength, wallHeight);
        this.wall3.rotation.y = Math.PI / 2;
        this.wall3.position.set(-this.floorWidth / 2, wallHeight / 2, 0);
        this.app.scene.add(this.wall3);

        this.wall4 = new MyWall(this.app, this.floorLength, wallHeight);
        this.wall4.rotation.y = -Math.PI / 2;
        this.wall4.position.set(this.floorWidth / 2, wallHeight / 2, 0);
        this.app.scene.add(this.wall4);
    }

    buildPlate() {
        this.plate = new MyPlate(this.app);
        this.plate.position.set(0, 3.0, 0);
        this.plate.scale.set(1.2,1.2,1.2);
        this.app.scene.add(this.plate);
    }

    buildCake() {
        this.cake = new MyCake(this.app);
        this.cake.position.set(0, 3.3, 0);
        this.app.scene.add(this.cake);
    }

    buildCandle() {
        this.candle = new MyCandle(this.app);
        this.candle.position.set(0.2, 3.62, 0.1);
        this.candle.scale.set(0.3, 0.3, 0.3);
        this.app.scene.add(this.candle);
    }

    init() {
       
        if (this.axis === null) {
            this.axis = new MyAxis(this)
            // this.app.scene.add(this.axis)
        }

        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildFloor();
        this.buildTable();
        this.buildWalls();
        this.buildPlate();
        this.buildCake();
        this.buildCandle();
    }
    
    // useless
    update() {

        
    }

}

export { MyContents };