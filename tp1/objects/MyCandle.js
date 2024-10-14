import * as THREE from 'three';

class MyCandle extends THREE.Object3D {
    constructor(app, radius = 0.18, height = 0.9) {
        super();
        this.app = app;

        const texture = new THREE.TextureLoader().load('./textures/candle.jpg');
        const texture2 = new THREE.TextureLoader().load('./textures/flame.jpg');

        this.candleMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            color: 0xa0a0a0, 
            specular: 0x777777, 
            emissive: 0x000000, 
            shininess: 0
        });

        this.flameMaterial = new THREE.MeshPhongMaterial({
            map: texture2,
            color: 0xffff00, 
            emissive: 0xffaa00, 
            transparent: true,
            opacity: 0.6
        });

        this.stringMaterial = new THREE.MeshPhongMaterial({
            color: "#000000", 
            specular: "#000000", 
            emissive: "#000000", 
            shininess: 10
        });

        const candleGeometry = new THREE.CylinderGeometry(radius, radius, height, 50);
        const candleMesh = new THREE.Mesh(candleGeometry, this.candleMaterial);

        const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 50);
        const stringMesh = new THREE.Mesh(stringGeometry, this.stringMaterial);
        
        const flameGeometry = new THREE.ConeGeometry(0.1, 0.4, 50);
        const flameMesh = new THREE.Mesh(flameGeometry, this.flameMaterial);

        const halfSphereGeometry = new THREE.SphereGeometry(0.1, 32, 32, 0, Math.PI * 2, 0, Math.PI /2);
        const halfSphereMesh = new THREE.Mesh(halfSphereGeometry, this.flameMaterial);
        
        flameMesh.position.y = height - 0.1; 
        flameMesh.position.z = 0; 
 
        halfSphereMesh.position.y =  height - 0.3;
        halfSphereMesh.position.z = 0;
        halfSphereMesh.rotation.z = 180 * Math.PI / 180;

        stringMesh.position.y = height - 0.45;
        stringMesh.position.z = 0;
        
        this.add(candleMesh);
        this.add(flameMesh);
        this.add(halfSphereMesh);
        this.add(stringMesh);

        const pointLight = new THREE.PointLight(0xffaa00, 1, 1); 
        pointLight.position.set(0, height - 0.1, 0); 
        pointLight.castShadow = true;
        this.add(pointLight);
    }
}

export { MyCandle };