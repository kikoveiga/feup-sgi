import * as THREE from 'three';

class SuperObject {
     constructor(name, x, y, z, angle = 0) {
          this.super = new THREE.Group();
          this.name = name;
          this.enable = true;
          this.updatePos(x, y, z);
          this.updateAngle(angle);
          this.subObjects = [];
     }

     toggleEnable() {
          this.enable = !this.enable;
          this.super.visible = this.enable;
     }
     
     // rotation in y axis
     updateAngle(axis = new THREE.Vector3(0, 1, 0), angle) {
          this.super.rotateOnAxis(axis, angle);
     }

     getPos() {
          return this.super.position;
     }

     updatePos(x, y, z) {
          this.super.position.set(x,y,z);
     }

     getScale() {
          return this.super.scale;
     }

     updateScale(x, y, z) {
          this.super.scale.set(x,y,z);
     }
     
     pushToSubObjects(object) {
          this.subObjects.push(object)
     }

     popFromSubObjects(object) {
          const index = this.subObjects.indexOf(object);
          if (index > -1) {
              this.subObjects.splice(index, 1);
              return object;
          }
          return null;
     }
}

export { SuperObject };
