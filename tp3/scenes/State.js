import * as THREE from 'three';

class State {
    constructor(app, gameStateManager) {
        this.app = app;
        this.gameStateManager = gameStateManager;

        this.objects = [];
    }
    
    addObject(obj, isInteractable = false) {
        this.objects.push(obj);
        this.app.scene.add(obj);

        if (isInteractable) this.interactableObjects.push(obj);
    }

    createTextMesh(text, x, y, z, color) {
        const texture = new THREE.TextureLoader().load("./images/font.png");
        
        const group = new THREE.Group();
        let offset = 0;
        
        for (let i = 0; i < text.length; i++) {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                color: color
            });

            const charCode = text.charCodeAt(i) % 256;
            const cols = 16;
            const rows = 16;
            
            const u = (charCode % cols) * (1 / cols);
            const v = Math.floor((charCode / cols)) * (1 / rows);
            
            const uvAttribute = geometry.attributes.uv;

            uvAttribute.array.set([
                u,            1 - v - 1 / rows,
                u + 1 / cols, 1 - v - 1 / rows,
                u,            1 - v,
                u + 1 / cols, 1 - v
            ]);

            geometry.setAttribute('uv', uvAttribute);

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = offset;
            mesh.name = text[i];
            offset += 0.65; // looks good

            group.add(mesh);
        }

        group.position.set(x, y, z);
        group.rotation.x = -Math.PI;
        group.rotation.y = -Math.PI;
        return group;
    }

    updateTextMesh(mesh, newText, color) {
    
        if (mesh.lastText === newText) {
            return;
        }

        mesh.lastText = newText;

        while (mesh.children.length > 0) {
            const child = mesh.children.pop();
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        }

        const updatedMesh = this.createTextMesh(newText, 0, 0, 0, color);

        while (updatedMesh.children.length > 0) {
            const child = updatedMesh.children.pop();
            mesh.add(child);
        }
    }

    update(delta) {

    }
}

export { State };