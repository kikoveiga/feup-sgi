import * as THREE from 'three';

class PickingManager {
    constructor(scene, camera, renderer, gameStateManager) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.gameStateManager = gameStateManager;

        this.hoveredObject = null;
        this.selectedObject = null;
        this.selectedColor = null;

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
                if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
                    this.removeHighlight(this.hoveredObject);
                }

                this.hoveredObject = hoveredObject;
                if (this.hoveredObject !== this.selectedObject) {
                    this.addHighlight(this.hoveredObject);
                }
            }
        } else {
            if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
                this.removeHighlight(this.hoveredObject);
            }

            this.hoveredObject = null;
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;

            if (this.selectedObject === clickedObject) {
                console.log('Deselecting object');
                this.removeHighlight(this.selectedObject);
                this.selectedObject = null;
                this.handleSelection();
            } else {
                if (this.selectedObject) {
                    this.removeHighlight(this.selectedObject);
                }

                this.selectedObject = clickedObject;
                this.addHighlight(this.selectedObject);
                this.handleSelection();
            }
        } 
    }

    addHighlight(object) {
        if (object && object.material) {
            if (!object.userData.originalEmissive) {
                object.userData.originalEmissive = object.material.emissive.clone();
            }

            object.material.emissive = new THREE.Color(0x444444);
        }
    }

    removeHighlight(object) {
        if (object && object.material && object.userData.originalEmissive) {
            object.material.emissive.copy(object.userData.originalEmissive);
            delete object.userData.originalEmissive;
        }
    }

    handleSelection() {
        if (!this.selectedObject) {
            this.selectedColor = null;
            return;
        }

        if (['orangeButton', 'greenButton', 'blueButton', 'pinkButton'].includes(this.selectedObject.name)) {
            this.selectedColor = this.selectedObject.name.replace('Button', '');
            console.log(`Selected color: ${this.selectedColor}`);
        }

        else if (this.selectedObject.name === 'playButton') {

            if (this.selectedColor === null) {
                this.selectedObject = null;
                console.warn('Please select a color before starting the game.');

            } else {
                this.gameStateManager.startGame(this.selectedColor);
            }
        }
    }
}

export { PickingManager };