import * as THREE from 'three';

class MyFirework {
    constructor(app, scene, scale = 1) {
        this.app = app;
        this.scene = scene;
        this.scale = scale; // Scale factor for the firework

        this.done = false;
        this.dest = [];

        this.vertices = null;
        this.colors = null;
        this.geometry = null;
        this.points = null;

        const colorList = [
            new THREE.Color(0xff4500), 
            new THREE.Color(0x1e90ff),
            new THREE.Color(0xadff2f),
            new THREE.Color(0xff69b4),
            new THREE.Color(0x8a2be2), 
            new THREE.Color(0xffd700), 
            new THREE.Color(0x40e0d0), 
            new THREE.Color(0xff6347), 
            new THREE.Color(0x7fffd4), 
            new THREE.Color(0xdc143c), 
            new THREE.Color(0xf0e68c), 
            new THREE.Color(0xdda0dd), 
            new THREE.Color(0x87ceeb), 
            new THREE.Color(0xffa500), 
            new THREE.Color(0x6a5acd), 
        ];
        
        const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
    
        this.material = new THREE.PointsMaterial({
            size: 0.4 * this.scale, 
            color: randomColor,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        });

        this.height = 50 * this.scale; 
        this.speed = 100;

        this.launch();
    }


    launch() {
        let color = new THREE.Color();
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9);
        let colors = [color.r, color.g, color.b];
    
        const x = THREE.MathUtils.randFloat(-25, 25) * this.scale;
        const y = THREE.MathUtils.randFloat(10530, 10570); 
        const z = THREE.MathUtils.randFloat(-15, 0) * this.scale;
    
        this.dest.push(x, y, z);
    
        let vertices = [0, 0, 0];
    
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(vertices), 3)
        );
        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(new Float32Array(colors), 3)
        );
    
        this.points = new THREE.Points(this.geometry, this.material);
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add(this.points);
    }
    


    explode(origin, n, rangeBegin, rangeEnd) {
        this.app.scene.remove(this.points);
        this.points.geometry.dispose();

        const positions = new Float32Array(n * 3);
        const colors = new Float32Array(n * 3);
        this.dest = new Float32Array(n * 3);

        for (let i = 0; i < n; i++) {
            const index = i * 3;

            const r = THREE.MathUtils.randFloat(
                rangeBegin,
                rangeEnd 
            );
            const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));
            const theta = THREE.MathUtils.randFloat(0, 2 * Math.PI);

            const ox = r * Math.sin(phi) * Math.cos(theta);
            const oy = r * Math.cos(phi);
            const oz = r * Math.sin(phi) * Math.sin(theta);

            positions[index] = origin[0];
            positions[index + 1] = origin[1];
            positions[index + 2] = origin[2];

            this.dest[index] = origin[0] + ox;
            this.dest[index + 1] = origin[1] + oy;
            this.dest[index + 2] = origin[2] + oz;

            const color = new THREE.Color();
            color.setHSL(
                THREE.MathUtils.randFloat(0, 1), 
                1.0, 
                0.8 
            );

            colors[index] = color.r;
            colors[index + 1] = color.g;
            colors[index + 2] = color.b;
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );
        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(colors, 3)
        );

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.castShadow = true;
        this.points.receiveShadow = true;

        this.app.scene.add(this.points);
    }


    reset() {
        if (this.points) {
            this.app.scene.remove(this.points);
            this.points.geometry.dispose();
        }
        this.dest = [];
        this.vertices = null;
        this.colors = null;
        this.geometry = null;
        this.points = null;
    }


    update() {
        if (this.points && this.geometry) {
            const verticesAtribute = this.geometry.getAttribute('position');
            const vertices = verticesAtribute.array;
            const count = verticesAtribute.count;

            for (let i = 0; i < vertices.length; i += 3) {
                vertices[i] +=
                    (this.dest[i] - vertices[i]) / this.speed;
                vertices[i + 1] +=
                    (this.dest[i + 1] - vertices[i + 1]) / this.speed;
                vertices[i + 2] +=
                    (this.dest[i + 2] - vertices[i + 2]) / this.speed;
            }
            verticesAtribute.needsUpdate = true;

            if (count === 1) {
                if (Math.ceil(vertices[1]) > this.dest[1] * 0.95) {
                    this.explode(
                        vertices,
                        80,
                        this.height * 0.05,
                        this.height * 0.8
                    );
                    return;
                }
            }

            if (count > 1) {
                this.material.opacity -= 0.015;
                this.material.needsUpdate = true;
            }

            if (this.material.opacity <= 0) {
                this.reset();
                this.done = true;
                return;
            }
        }
    }
}

export { MyFirework };
