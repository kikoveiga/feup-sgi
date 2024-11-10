import * as THREE from 'three';

class MyYASFParser {

    constructor(scene) {
        this.scene = scene;

        this.data = {};

        this.globals = {};
        this.cameras = {};
        this.textures = {};
        this.materials = {};
        this.graph = {};

    }

    parse(data) {

        data = data.yasf;

        this.setUpGlobals(data.globals);    
        this.setUpCameras(data.cameras);
        // this.loadTextures(data.textures);    
        this.loadMaterials(data.materials);
        // this.parseGraph(data.graph);
    }

    setUpGlobals(globals) {

        if (globals.background) {
            const { r, g, b } = globals.background;
            this.globals.background = new THREE.Color(r, g, b);
        }

        if (globals.ambient) {
            const { r, g, b, intensity = 1 } = globals.ambient;
            this.globals.ambient = new THREE.AmbientLight(new THREE.Color(r, g, b), intensity);
        }

        if (globals.fog) {
            const { r, g, b } = globals.fog.color;
            this.globals.fog = new THREE.Fog(new THREE.Color(r, g, b), globals.fog.near, globals.fog.far);
        }

        if (globals.skybox) {

            const { size, center, emissive, intensity, front, back, up, down, left, right } = globals.skybox;

            const skyBoxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            const loader = new THREE.TextureLoader();

            const materials = [
                new THREE.MeshBasicMaterial({ map: loader.load(front), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: loader.load(back), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: loader.load(up), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: loader.load(down), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: loader.load(left), side: THREE.BackSide }),
                new THREE.MeshBasicMaterial({ map: loader.load(right), side: THREE.BackSide })
            ];

            const skyBox = new THREE.Mesh(skyBoxGeometry, materials);

            if (center) {
                skyBox.position.set(center.x, center.y, center.z);
            }

            if (emissive) {
                const emissiveColor = new THREE.Color(emissive);
                skyBox.materials.forEach(material => {
                    material.emissive = emissiveColor;
                    material.emissiveIntensity = intensity || 1;
                });
            }

            this.globals.skybox = skyBox;

        }
    }

    setUpCameras(cameras) {

        this.initialCamera = null;

        Object.keys(cameras).forEach(cameraID => {

            const camera = cameras[cameraID];

            if (cameraID == 'initial') {
                this.initialCamera = camera;
                return;
            }

            let newCamera;

            if (camera.type == 'orthogonal') {
                newCamera = new THREE.OrthographicCamera(
                    camera.left, 
                    camera.right,
                    camera.top,
                    camera.bottom,
                    camera.near,
                    camera.far
                );
                
                if (camera.location) newCamera.position.set(camera.location.x, camera.location.y, camera.location.z);
                if (camera.target) newCamera.lookAt(camera.target.x, camera.target.y, camera.target.z);

            }
            
            else if (camera.type == 'perspective') {
                newCamera = new THREE.PerspectiveCamera(
                    camera.angle,
                    window.innerWidth / window.innerHeight,
                    camera.near,
                    camera.far
                );

                if (camera.location) newCamera.position.set(camera.location.x, camera.location.y, camera.location.z);
                if (camera.target) newCamera.lookAt(camera.target.x, camera.target.y, camera.target.z);
                
            }
            
            else {
                console.error(`Unknown camera type: ${camera.type}`);
            }

            this.cameras[cameraID] = newCamera;
        });

        if (this.initialCamera) this.activeCamera = this.cameras[this.initialCamera];

        else {
            console.error("No initial camera defined.");
            this.activeCamera = Object.values(this.cameras)[0];
        }

    }

    loadTextures(textures) {

        Object.keys(textures).forEach(textureID => {

            console.log(textureID);

            const textureInfo = textures[textureID];
            const loader = new THREE.TextureLoader();

            const texture = loader.load("../scenes/textures/scratchedWall.jpg");
            // texture.generateMipmaps = !textureInfo.mipmap0;

            const mipmaps = [];
            let level = 0;

            while (`mipmap${level}` in textureInfo && level <= 7) {
                mipmaps.push(loader.load(textureInfo[`mipmap${level}`]));
                level++;
            }

            if (mipmaps.length > 0) {
                texture.mipmaps = mipmaps;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
            }

            this.textures[textureID] = texture;

        });

    }

    loadMaterials(materials) {

        Object.keys(materials).forEach((materialID, materialInfo) => {

            const {
                color,
                specular,
                shininess = 30,
                emissive,
                transparent = false,
                opacity = 1,
                wireframe = false,
                shading = 'smooth',
                textureref = null,
                texlength_s = 1,
                texlength_t = 1,
                twosided = false,
                bumpref = null,
                bumpscale = 1.0,
                specularref = null
            } = materialInfo;

            const materialParams = {
                color: new THREE.Color(color),
                specular: new THREE.Color(specular),
                shininess: shininess,
                emissive: new THREE.Color(emissive),
                transparent: transparent,
                opacity: opacity,
                wireframe: wireframe,
                side: twosided ? THREE.DoubleSide : THREE.FrontSide,
            };

            if (shading === 'flat') materialParams.flatShading = true;
            else if (shading === 'smooth') materialParams.flatShading = false;

            if (textureref && this.textures[textureref]) {
                const texture = this.textures[textureref];
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(texlength_s, texlength_t);
                materialParams.map = texture;
            }

            if (bumpref && this.textures[bumpref]) {
                const bumpMap = this.textures[bumpref];
                bumpMap.wrapS = THREE.RepeatWrapping;
                bumpMap.wrapT = THREE.RepeatWrapping;
                materialParams.bumpMap = bumpMap;
                materialParams.bumpScale = bumpscale;
            }

            if (specularref && this.textures[specularref]) {
                const specularMap = this.textures[specularref];
                specularMap.wrapS = THREE.RepeatWrapping;
                specularMap.wrapT = THREE.RepeatWrapping;
                materialParams.specularMap = specularMap;
            }

            this.materials[materialID] = new THREE.MeshPhongMaterial(materialParams);
        });
    }

}

export { MyYASFParser };