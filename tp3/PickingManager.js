class PickingManager {
    constructor(scene, camera, renderer) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.selectedObject = null;
        window.addEventListener('click', this.onClick.bind(this));
    }

    onClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            this.selectedObject = intersects[0].object;
            console.log(`Selected: ${this.selectedObject.name}`);

            this.handleSelection();
        }
    }

    handleSelection() {
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

const pickingManager = new PickingManager(scene, camera, renderer);