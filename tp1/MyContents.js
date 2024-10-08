import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './objects/MyTable.js';
import { MyFloor } from './objects/MyFloor.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // object creating
        this.table = null;
        this.floor = null;


    }


    buildFloor() {    
        this.floor = new MyFloor(this.app, 15, 12);
        this.app.scene.add(this.floor);
    }

    buildTable() {
        this.table = new MyTable(this.app, 4, 2.5, 0.3, 2, 0.2);
        this.app.scene.add(this.table);
    }

    init() {
       
        if (this.axis === null) {
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
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
        
    }
    

    
    // useless
    update() {

        
    }

}

export { MyContents };