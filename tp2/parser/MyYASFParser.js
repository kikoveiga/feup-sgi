import * as THREE from 'three';

class MyYASFParser {

    constructor(scene) {
        this.scene = scene;

        this.data = {};

        this.globals = {};
        this.cameras = {};
        this.textures = {};
        this.materials = {};
        this.nodes = {};

    }

    parse(data) {

        data = data.yasf;

        this.setUpGlobals(data.globals);    
        this.setUpCameras(data.cameras);
        this.loadTextures(data.textures);    
        this.loadMaterials(data.materials);
        this.parseGraph(data.graph);
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

            const textureInfo = textures[textureID];
            const loader = new THREE.TextureLoader();

            const texture = loader.load(textureInfo.filepath);
            texture.generateMipmaps = !textureInfo.mipmap0;

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

    parseGraph(graph) {

        console.log(graph);

        this.rootID = graph.rootid;
        if (!this.rootID || !graph[this.rootID]) {
            console.error("Root node not defined or missing.");
            return;
        }

        this.nodes = {};

        this.parseNode(graph, this.rootID);
    }

    parseNode(graph, nodeID, inheritedMaterial = null, inheritedcastShadow = false, inheritedReceiveshadow = false) {

        const node = graph[nodeID];

        if (!node) {
            console.error(`Node ${nodeID} not defined.`);
            return;
        }

        const nodeGroup = new THREE.Group();
        nodeGroup.name = nodeID;

        nodeGroup.castShadow = node.castShadow ?? inheritedcastShadow;
        nodeGroup.receiveshadow = node.receiveshadow ?? inheritedReceiveshadow;

        if (node.transforms) this.applyTransforms(nodeGroup, node.transforms);

        const materialID = node.materialRef?.materialID || inheritedMaterial;

        if (node.children) this.parseChildren(node.children, nodeGroup, graph, materialID, nodeGroup.castShadow, nodeGroup.receiveshadow);

        this.nodes[nodeID] = nodeGroup;

        return nodeGroup;
    }

    applyTransforms(nodeGroup, transforms) {

        const translation = transforms.filter(t => t.type === 'translate');
        const rotation = transforms.filter(t => t.type === 'rotate');
        const scale = transforms.filter(t => t.type === 'scale');

        if (translation.length > 1 || rotation.length > 1 || scale.length > 1) {
            console.error("Multiple transformations of the same type are not supported.");
            return;
        }

        if (translation[0]) {
            const { x, y, z } = translation[0].amount;
            nodeGroup.position.set(x, y, z);
        }

        if (rotation[0]) {
            const { x, y, z } = rotation[0].amount;

            nodeGroup.position.set(
                THREE.MathUtils.degToRad(x),
                THREE.MathUtils.degToRad(y),
                THREE.MathUtils.degToRad(z)
            );
        }

        if (scale[0]) {
            const { x, y, z } = scale[0].amount;
            nodeGroup.scale.set(x, y, z);
        }
    }

    parseChildren(children, parentGroup, graph, inheritedMaterial, inheritedcastShadow, inheritedReceiveshadow) {

        Object.keys(children).forEach(childID => {
            const child = children[childID];

            if (child.type === 'noderef') {
                const referencedNode = this.parseNode(graph, childID, inheritedMaterial, inheritedcastShadow, inheritedReceiveshadow);
                if (referencedNode) parentGroup.add(referencedNode);
            }

            else if (['rectangle', 'triangle', 'box', 'cylinder', 'sphere', 'polygon'].includes(child.type)) {
                const primitive = this.createPrimitive(child);
                if (primitive) {
                    primitive.castShadow = inheritedcastShadow;
                    primitive.receiveshadow = inheritedReceiveshadow;
                    parentGroup.add(primitive);
                }
            }

            else if (['directionalLight', 'pointlight', 'spotLight'].includes(child.type)) {
                const light = this.createLight(child);
                if (light) parentGroup.add(light);
            }

            else {
                console.error(`Unknown child type: ${child.type}`);
            }

        });
    }

    createPrimitive(primitiveData) {

        let geometry;
        const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });

        switch (primitiveData.type) {

            case 'rectangle':
                geometry = new THREE.PlaneGeometry(
                    Math.abs(primitiveData.xy2.x - primitiveData.xy1.x),
                    Math.abs(primitiveData.xy2.y - primitiveData.xy1.y)
                );
                break;

            case 'triangle': {
                geometry = new THREE.BufferGeometry();

                const vertices = new Float32Array([
                    primitiveData.xyz1.x, primitiveData.xyz1.y, primitiveData.xyz1.z,
                    primitiveData.xyz2.x, primitiveData.xyz2.y, primitiveData.xyz2.z,
                    primitiveData.xyz3.x, primitiveData.xyz3.y, primitiveData.xyz3.z,
                ]);

                geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                geometry.setIndex([0, 1, 2]);
                break;
            }

            case 'box':
                geometry = new THREE.BoxGeometry(
                    Math.abs(primitiveData.xyz2.x - primitiveData.xyz1.x),
                    Math.abs(primitiveData.xyz2.y - primitiveData.xyz1.y),
                    Math.abs(primitiveData.xyz2.z - primitiveData.xyz1.z),
                    primitiveData.parts_x || 1,
                    primitiveData.parts_y || 1,
                    primitiveData.parts_z || 1
                );
                break;

            case 'cylinder':
                geometry = new THREE.CylinderGeometry(
                    primitiveData.top,
                    primitiveData.base,
                    primitiveData.height,
                    primitiveData.slices,
                    primitiveData.stacks,
                    primitiveData.capsclose || false,
                    primitiveData.thetaStart || 0,
                    primitiveData.thetaLength || Math.PI * 2
                );
                break;

            case "sphere":
                geometry = new THREE.SphereGeometry(
                    primitiveData.radius,
                    primitiveData.slices,
                    primitiveData.stacks,
                    primitiveData.thetastart || 0,
                    primitiveData.thetalength || Math.PI * 2,
                    primitiveData.phistart || 0,
                    primitiveData.philength || Math.PI * 2
                );
                break;
        
            case "polygon":
                geometry = new THREE.CylinderGeometry(
                    primitiveData.radius,
                    primitiveData.radius,
                    0, // Height of 0 to create a flat disc
                    primitiveData.slices,
                    primitiveData.stacks
                );
                material.color = new THREE.Color(
                    primitiveData.color_c.r,
                    primitiveData.color_c.g,
                    primitiveData.color_c.b
                );
                break;

            default:
                console.error(`Unknown primitive type: ${primitiveData.type}`);
                return null;

        }

        return new THREE.Mesh(geometry, material);
    }

    createLight(lightData, inheritedcastShadow = false) {
        let light;

        const color = new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b);
        const intensity = lightData.intensity || 1;

        switch (lightData.type) {

            case 'directionalLight':
                light = new THREE.DirectionalLight(color, intensity);
                light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
                light.castShadow = inheritedcastShadow || lightData.castShadow;

                if (light.castShadow) {
                    
                    light.shadow.camera.left = lightData.shadowLeft || -5;
                    light.shadow.camera.right = lightData.shadowRight || 5;
                    light.shadow.camera.top = lightData.shadowTop || 5;
                    light.shadow.camera.bottom = lightData.shadowBottom || -5;
                    light.shadow.camera.far = lightData.shadow.far || 500.0;
                    light.shadow.mapSize.width = lightData.shadowMapSize || 512;
                    light.shadow.mapSize.height = lightData.shadowMapSize || 512;
                }
                break;

            case 'pointlight':
                light = new THREE.PointLight(color, intensity, lightData.distance || 1000, lightData.decay || 2);
                light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
                light.castShadow = inheritedcastShadow || lightData.castShadow;

                if (light.castShadow) {
                    light.shadow.camera.far = lightData.shadow.far || 500.0;
                    light.shadow.mapSize.width = lightData.shadowMapSize || 512;
                    light.shadow.mapSize.height = lightData.shadowMapSize || 512;
                }
                break;

            case 'spotLight':
                light = new THREE.SpotLight(color, intensity, lightData.distance || 1000, lightData.angle, lightData.decay || 2);
                light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
                light.target.position.set(lightData.target.x, lightData.target.y, lightData.target.z);
                light.castShadow = inheritedcastShadow || lightData.castShadow;
                light.penumbra = lightData.penumbra || 1;

                if (light.castShadow) {
                    light.shadow.camera.far = lightData.shadow.far || 500.0;
                    light.shadow.mapSize.width = lightData.shadowMapSize || 512;
                    light.shadow.mapSize.height = lightData.shadowMapSize || 512;
                }
                break;

            default:
                console.error(`Unknown light type: ${lightData.type}`);
                return null;
        }

        return light;

    }

}

export { MyYASFParser };