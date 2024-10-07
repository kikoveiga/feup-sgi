import * as THREE from 'three';
import { SuperObject } from './SuperObject.js';


class Table extends SuperObject {

    constructor(name, x, y, z, ang = 0) {
        super(name, x, y, z, ang);
    
    }

    build() {
     
    }
}

export { Table };