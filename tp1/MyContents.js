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
import { MySideTable } from './objects/MySideTable.js';
import { MyStudioLamp } from './objects/MyStudioLamp.js';
import { MyTableLamp } from './objects/MyTableLamp.js';


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
        this.sidetable = null;
        this.studioLamp = null;
        this.tableLamp = null;

        // aux vars
        this.floorWidth = 24;
        this.floorLength = 18;

    }


    buildFloor() {    
        this.floor = new MyFloor(this.app, this.floorWidth, this.floorLength, true);
        this.app.scene.add(this.floor);
    }

    buildTable() {
        this.table = new MyTable(this.app);
        this.table.scale.set(1.4, 1.4, 1.4);
        this.table.receiveShadow = true;
        this.app.scene.add(this.table);
    }

    buildWalls() {
        const wallHeight = 10;

        this.wall1 = new MyWall(this.app, this.floorWidth, wallHeight, false);
        this.wall1.position.set(0, wallHeight / 2, -this.floorLength / 2);
        this.app.scene.add(this.wall1);

        this.wall2 = new MyWall(this.app, this.floorWidth, wallHeight, false);
        this.wall2.rotation.y = 180 * Math.PI / 180;
        this.wall2.position.set(0, wallHeight / 2, this.floorLength / 2); 
        this.app.scene.add(this.wall2);

        this.wall3 = new MyWall(this.app, this.floorLength, wallHeight, true);
        this.wall3.rotation.y = Math.PI / 2;
        this.wall3.position.set(-this.floorWidth / 2, wallHeight / 2, 0);
        this.app.scene.add(this.wall3);

        this.wall4 = new MyWall(this.app, this.floorLength, wallHeight, false);
        this.wall4.rotation.y = -Math.PI / 2;
        this.wall4.position.set(this.floorWidth / 2, wallHeight / 2, 0);
        this.app.scene.add(this.wall4);

        this.ceiling = new MyFloor(this.app, this.floorWidth, this.floorLength, false);
        this.ceiling.rotation.z = 180 * Math.PI / 180;
        this.ceiling.position.set(0, wallHeight, 0);
        this.app.scene.add(this.ceiling);
    }

    buildPlate() {
        this.plate = new MyPlate(this.app);
        this.plate.position.set(0.9, 3, 0.9);
        this.plate.scale.set(1.2, 1.2, 1.2);

        this.plate2 = new MyPlate(this.app);
        this.plate2.position.set(0, 3, -1.7);
        this.plate2.scale.set(0.8, 0.8, 0.8);

        this.app.scene.add(this.plate);
        this.app.scene.add(this.plate2);
    }

    buildCake() {
        this.cake = new MyCake(this.app);
        this.cake.position.set(0.9, 3.3, 0.9);
        this.app.scene.add(this.cake);
    }

    buildCandle() {
        this.candle = new MyCandle(this.app);
        this.candle.position.set(1.1, 3.62, 1);
        this.candle.scale.set(0.3, 0.3, 0.3);
        this.app.scene.add(this.candle);
    }

    buildChairs() {
        this.chair1 = new MyChair(this.app);
        this.chair2 = new MyChair(this.app);

        this.chair1.position.set(0, 0, -3);
        this.chair1.scale.set(1.2, 1.2, 1.2);
        this.app.scene.add(this.chair1);

        this.chair2.position.set(-1.5, 1.1, 3.5);
        this.chair2.scale.set(1.2, 1.2, 1.2);
        this.chair2.rotation.x = - Math.PI / 2;
        this.chair2.rotation.z = 130 * Math.PI / 180;
        this.app.scene.add(this.chair2);
    }   

    buildCup() {
        this.cup = new MyCup(this.app);
        this.cup.scale.set(0.3, 0.3, 0.3);
        this.cup.position.set(1, 3.1, -1.3);
        this.cup.rotation.y = 120 *Math.PI / 180;
        this.app.scene.add(this.cup);
    }

    buildDoor() {
        this.door = new MyDoor(this.app);
        this.door.position.set(this.floorLength / 3, 0, this.floorLength / 2);
        this.app.scene.add(this.door);
    }

    buildRug() {
        this.rug = new MyRug(this.app);
        this.rug.position.set(0, 0, 0);
        this.rug.scale.set(2, 2, 2);
        this.rug.rotation.y = Math.PI /2;
        this.app.scene.add(this.rug);
    }

    buildPainting() {
        this.painting = new MyPainting(this.app, "painting");
        this.painting.position.set(-5, 6, -(this.floorLength / 2) + 0.1);
        this.app.scene.add(this.painting);

        this.painting = new MyPainting(this.app, "painting2");
        this.painting.position.set(5, 6, -(this.floorLength / 2) + 0.1);
        this.app.scene.add(this.painting);
    }

    buildSofa() {
        this.sofa = new MySofa(this.app);
        this.sofa.scale.set(1.3, 1.3, 1.3);
        this.sofa.rotation.y = Math.PI / 2;
        this.sofa.position.set(- this.floorLength / 2 - 1, 0.3, 0);
        this.app.scene.add(this.sofa);
    }

    buildLamps() {
        this.lamp = new MyLamp(this.app);
        this.lamp.position.set(- this.floorLength / 2 - 1, 1.5, this.floorLength / 3);
        this.app.scene.add(this.lamp);

        this.studioLamp = new MyStudioLamp(this.app);
        this.studioLamp.position.set(0, 9, 0);
        this.app.scene.add(this.studioLamp);
        
        this.tableLamp = new MyTableLamp(this.app);
        this.tableLamp.position.set(2.5, 3, 1.5);
        this.tableLamp.rotation.y = Math.PI / 2.5;
        this.app.scene.add(this.tableLamp);
    }

    buildSideTable() {
        this.sidetable = new MySideTable(this.app);
        this.sidetable.position.set(- this.floorLength / 2 - 1, 0, this.floorLength / 3);
        this.app.scene.add(this.sidetable);
    }


    init() {
       
        if (this.axis === null) {
            // this.axis = new MyAxis(this)
            // this.app.scene.add(this.axis)
        }

        const ambientLight = new THREE.AmbientLight( 0x555555, 2 );
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
        this.buildLamps();
        this.buildSideTable();
    }
    
    // useless
    update() {

        
    }

}

export { MyContents };