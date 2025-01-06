import * as THREE from 'three';

class PickingManager {
    constructor(camera, selectionCallback) {

        this.camera = camera;
        this.selectionCallback = selectionCallback;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.hoveredObject = null;
        this.selectedColorButton = null;

        this.interactableObjects = [];

        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
    }
    
    addInteractableObject(object) {
        if (object.isMesh) {
            this.interactableObjects.push(object);
        } else if (object.isGroup || object instanceof THREE.Group) {
            object.traverse(child => {
                if (child.isMesh) {
                    child.name = object.name;
                    this.interactableObjects.push(child);
                }
            });
        } else console.warn('Object is not a mesh or group: ', object);
            
    }

    removeInteractableObject(object) {
        const index = this.interactableObjects.indexOf(object);
        if (index !== -1) {
            this.interactableObjects.splice(index, 1);
        }
    }

    onMouseMove(event) {

        if (this.interactableObjects.length === 0) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);

        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;

            if (this.hoveredObject !== hoveredObject) {
                if (this.hoveredObject && this.hoveredObject !== this.selectedColorButton) {
                    this.removeHighlight(this.hoveredObject);
                }

                this.hoveredObject = hoveredObject;
                if (this.hoveredObject !== this.selectedColorButton) {
                    this.addHighlight(this.hoveredObject);
                }
            }
        } else {
            if (this.hoveredObject && this.hoveredObject !== this.selectedColorButton) {
                this.removeHighlight(this.hoveredObject);
            }

            this.hoveredObject = null;
        }
    }

    onClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;

            if (clickedObject.name === 'playButton' || clickedObject.name === 'playerName' || clickedObject.name === 'selectLaps' || clickedObject.name === 'selectStartPoint') {
                this.selectionCallback(clickedObject.name);
            }

            else if (['orangeButton', 'greenButton', 'blueButton', 'pinkButton'].includes(clickedObject.name)) {
                if (this.selectedColorButton === null) {
                    this.selectedColorButton = clickedObject;
                } else if (this.selectedColorButton === clickedObject) {
                    this.selectedColorButton = null;
                    this.removeHighlight(clickedObject);
                } else {
                    this.removeHighlight(this.selectedColorButton);
                    this.selectedColorButton = clickedObject;
                }
            }

            else if (clickedObject.name === 'playerBalloon' || clickedObject.name === 'opponentBalloon') {
                if (this.selectedColorButton === null) {
                    console.warn('Please select a color before selecting a balloon.');
                    return;
                }

                this.selectionCallback(clickedObject.name, this.selectedColorButton.name.replace('Button', ''));
            }

            else {
                this.selectionCallback(clickedObject.name);
            }
        } 
    }

    addHighlight(object) {
        if (object && object.material && object.material.emissive) {
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
}

export { PickingManager };