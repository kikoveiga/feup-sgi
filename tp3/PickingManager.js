import * as THREE from 'three';

class PickingManager {
    constructor(scene, camera, renderer) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.hoveredObject = null;
        this.selectedObject = null;

        this.interactableObjects = [];

        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
    }
    
    addInteractableObject(object) {
        this.interactableObjects.push(object);
    }

    removeInteractableObject(object) {
        const index = this.interactableObjects.indexOf(object);
        if (index !== -1) {
            this.interactableObjects.splice(index, 1);
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);

        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;

            if (this.hoveredObject !== hoveredObject) {
                if (this.hoveredObject) {
                    this.removeHighlight(this.hoveredObject);
                }

                this.hoveredObject = hoveredObject;
                this.addHighlight(this.hoveredObject);
            }
        } else {
            if (this.hoveredObject) {
                this.removeHighlight(this.hoveredObject);
                this.hoveredObject = null;
            }
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);

        if (intersects.length > 0) {
            this.selectedObject = intersects[0].object;
            console.log(`Selected object: ${this.selectedObject.name}`);
            this.handleSelection();
        }
    }

    addHighlight(object) {
        if (object && object.material) {
            object.material.emissive = new THREE.Color(0x444444);
        }
    }

    removeHighlight(object) {
        if (object && object.material) {
            object.material.emissive = new THREE.Color(0x000000);
        }
    }

    handleSelection() {
        if (!this.selectedObject) {
            return;
        }

        switch (this.selectedObject.name) {

            case 'balloon':
                console.log('Balloon selected!');
                break;

            case 'powerup':
                console.log('Powerup selected!');
                break;

            default:
                console.log('Unknown object selected!');
        }
    }
}

export { PickingManager };