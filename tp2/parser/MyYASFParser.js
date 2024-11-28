import * as THREE from 'three';

class MyYASFParser {

    constructor() {

        this.data = {};

        this.globals = {};
        this.cameras = {};
        this.textures = {};
        this.materials = {};
        this.objects = {};
        this.rootid = null;
        this.initialCameraName = null;
        this.lights = [];
        
    }

    async parse(data) {

        if (!data.yasf) console.error("Invalid data format: yasf object not found.");

        data = data.yasf;

        if (!data.globals) console.error("Invalid data format: globals object not found.");
        if (!data.cameras) console.error("Invalid data format: cameras object not found.");
        if (!data.textures) console.error("Invalid data format: textures object not found.");
        if (!data.materials) console.error("Invalid data format: materials object not found.");
        if (!data.graph) console.error("Invalid data format: graph object not found.");

        this.setUpGlobals(data.globals);
        this.setUpCameras(data.cameras);
        
        if (Object.keys(data.textures).length === 0) console.warn("No textures found.");
        else await this.loadTextures(data.textures);

        this.loadMaterials(data.materials);
        this.parseGraph(data.graph);
    }


    setUpGlobals(globals) {

        if (!globals.background) console.warn("Background color not defined.");
        else {
            const { r, g, b } = globals.background;
            this.globals.background = new THREE.Color(r, g, b);
        }

        if (!globals.ambient) console.warn("Ambient light not defined.");
        else {
            const { r, g, b, intensity } = globals.ambient;
            this.globals.ambient = new THREE.AmbientLight(new THREE.Color(r, g, b), intensity);
        }

        if (!globals.fog) console.warn("Fog not defined.");
        else {
            const { r, g, b } = globals.fog.color;
            this.globals.fog = new THREE.Fog(new THREE.Color(r, g, b), globals.fog.near, globals.fog.far);
        }

        if (!globals.skybox) console.warn("Skybox not defined.");
        else {

            const { size, center, emissive, intensity, front, back, up, down, left, right } = globals.skybox;
        
            const skyBoxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            const loader = new THREE.TextureLoader();

            const emissiveColor = new THREE.Color(emissive.r, emissive.g, emissive.b);
            
            const materials = [
                new THREE.MeshStandardMaterial({ map: loader.load(front), emissive: emissiveColor, emissiveIntensity: intensity, side: THREE.BackSide }),
                new THREE.MeshStandardMaterial({ map: loader.load(back) , emissive: emissiveColor, emissiveIntensity: intensity, side: THREE.BackSide }),
                new THREE.MeshStandardMaterial({ map: loader.load(up)   , emissive: emissiveColor, emissiveIntensity: intensity, side: THREE.BackSide }),
                new THREE.MeshStandardMaterial({ map: loader.load(down) , emissive: emissiveColor, emissiveIntensity: intensity, side: THREE.BackSide }),
                new THREE.MeshStandardMaterial({ map: loader.load(left) , emissive: emissiveColor, emissiveIntensity: intensity, side: THREE.BackSide }),
                new THREE.MeshStandardMaterial({ map: loader.load(right), emissive: emissiveColor, emissiveIntensity: intensity, side: THREE.BackSide })
            ];
        
            const skyBox = new THREE.Mesh(skyBoxGeometry, materials);
        
            if (center) {
                skyBox.position.set(center.x, center.y, center.z);
            }

            this.globals.skybox = skyBox;
        }
        
    }

    setUpCameras(cameras) {
        this.initialCameraName = cameras.initial;
        delete cameras.initial;
    
        Object.keys(cameras).forEach(cameraID => {
            const camera = cameras[cameraID];
            let newCamera;
    
            if (camera.type === 'orthogonal') {
                newCamera = new THREE.OrthographicCamera(
                    camera.left,
                    camera.right,
                    camera.top,
                    camera.bottom,
                    camera.near,
                    camera.far
                );
    
            } else if (camera.type == 'perspective') {
                newCamera = new THREE.PerspectiveCamera(
                    camera.angle,
                    window.innerWidth / window.innerHeight,
                    camera.near,
                    camera.far
                );
    
            } else {
                console.error(`Unknown camera type: ${camera.type}`);
                return; 
            }

            newCamera.position.set(camera.location.x, camera.location.y, camera.location.z);
            newCamera.lookAt(camera.target.x, camera.target.y, camera.target.z);
    
            if (camera.location) newCamera.position.set(camera.location.x, camera.location.y, camera.location.z);
            if (camera.target) newCamera.lookAt(camera.target.x, camera.target.y, camera.target.z);
    
            newCamera.updateProjectionMatrix();
            newCamera.updateMatrixWorld();
    
            this.cameras[cameraID] = newCamera;
        });
    
        if (this.initialCameraName && this.cameras[this.initialCameraName]) {
            this.activeCamera = this.cameras[this.initialCameraName];
        } else {
            console.error("Initial camera not defined or not found.");
            this.activeCamera = Object.values(this.cameras)[0];
        }
    }
    
    

    async loadTextures(textures) {

        const loader = new THREE.TextureLoader();
        const imageLoader = new THREE.ImageLoader();
        const allPromises = [];
        
        Object.keys(textures).forEach(textureID => {
            const textureInfo = textures[textureID];

            allPromises.push(
                new Promise((resolve, reject) => {
                    if (textureInfo.isVideo) {

                        const video = document.createElement('video');
                        video.src = textureInfo.filepath;
                        video.load();
                        video.loop = true;
                        video.muted = true;
                        video.play();

                        const texture = new THREE.VideoTexture(video);
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.minFilter = THREE.LinearFilter;

                        this.textures[textureID] = texture;
                        resolve(texture);
                    }

                    else {
                        loader.load(
                            textureInfo.filepath,

                            async (texture) => {
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.wrapT = THREE.RepeatWrapping;

                                const mipmaps = [];
                                let level = 0;
                                let hasCustomMipmaps = false;

                                while(`mipmap${level}` in textureInfo && level <= 7) {
                                    hasCustomMipmaps = true;

                                    const mipmapPromise = new Promise((mipmapResolve, mipmapReject) => {
                                        imageLoader.load(
                                            textureInfo[`mipmap${level}`],
                                            (image) => {
                                                mipmaps.push(image);
                                                mipmapResolve();
                                            },
                                            undefined,
                                            (error) => mipmapReject(error)
                                        );
                                    });

                                    try {
                                        await mipmapPromise;
                                    } catch (error) {
                                        console.error(`Error loading mipmap level ${level} for texture ${textureID}: ${error}`);
                                        return reject(error);
                                    }

                                    level++;
                                }

                                if (hasCustomMipmaps) {
                                    texture.mipmaps = mipmaps;
                                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                                    texture.generateMipmaps = false;
                                } else {
                                    texture.generateMipmaps = true;
                                }

                                this.textures[textureID] = texture;
                                resolve(texture);
                            },
                            undefined,
                            (error) => reject(error)
                        );
                    }
                })
            );
        });

        return Promise.all(allPromises)
            .then(() => {
                console.log("All textures loaded!");
            })
            .catch((error) => {
                console.error("Error loading textures:", error);
            });
    }
    

    loadMaterials(materials) {

        Object.keys(materials).forEach(materialID => {
            const materialInfo = materials[materialID];
    
            const {
                color,
                specular,
                shininess,
                emissive,
                transparent,
                opacity,
                wireframe = false,
                shading = false,
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
                // emissive: new THREE.Color(emissive),
                transparent: transparent,
                opacity: opacity,
                wireframe: wireframe,
                shading: shading ? THREE.FlatShading : THREE.SmoothShading,
                side: twosided ? THREE.DoubleSide : THREE.FrontSide,
            };

            if (textureref && this.textures[textureref]) {
                const texture = this.textures[textureref];
                texture.repeat.set(texlength_s, texlength_t);
                materialParams.map = texture;
            }

            if (bumpref && this.textures[bumpref]) {
                materialParams.bumpMap = this.textures[textureref];
                materialParams.bumpScale = bumpscale;
            }

            if (specularref && this.textures[specularref]) {
                materialParams.specular = this.textures[textureref];
            }

            this.materials[materialID] = new THREE.MeshPhongMaterial(materialParams);
        });
    }

    parseGraph(graph) {
    
        this.rootid = graph.rootid;
        if (!this.rootid || !graph[this.rootid]) {
            console.error("Root node not defined or missing.");
            return;
        }
        
        this.parseNode(graph, this.rootid);
    }
    
    parseNode(graph, nodeID, inheritedMaterial = null, inheritedCastShadow = false, inheritedReceiveShadow = false) {
        const node = graph[nodeID];
    
        if (!node) {
            console.error(`Node ${nodeID} not defined.`);
            return;
        }
    
        const nodeGroup = new THREE.Group();
        nodeGroup.name = nodeID;
    
        nodeGroup.castShadow = node.castShadow ?? inheritedCastShadow;
        nodeGroup.receiveShadow = node.receiveShadow ?? inheritedReceiveShadow;
    
        if (node.transforms) this.applyTransforms(nodeGroup, node.transforms);
    
        const materialID = node.materialref?.materialId || inheritedMaterial;
        
        if (node.children) {
            this.parseChildren(node.children, nodeGroup, graph, materialID, nodeGroup.castShadow, nodeGroup.receiveShadow);
        }
    
        this.objects[nodeID] = nodeGroup;
    
        return nodeGroup;
    }
    

    applyTransforms(nodeGroup, transforms) {
        transforms.forEach(transform => {
            const { type, amount } = transform;
    
            switch (type) {
                case 'scale':
                    nodeGroup.scale.x *= amount.x;
                    nodeGroup.scale.y *= amount.y;
                    nodeGroup.scale.z *= amount.z;
                    break;

                case 'rotate':
                    nodeGroup.rotation.x += THREE.MathUtils.degToRad(amount.x);
                    nodeGroup.rotation.y += THREE.MathUtils.degToRad(amount.y);
                    nodeGroup.rotation.z += THREE.MathUtils.degToRad(amount.z);
                    break;    

                case 'translate':
                    nodeGroup.position.x += amount.x;
                    nodeGroup.position.y += amount.y;
                    nodeGroup.position.z += amount.z;
                    break;

                default:
                    console.error(`Unknown transform type: ${type}`);
            }
        });
    }    

    parseChildren(children, parentGroup, graph, inheritedMaterial, inheritedCastShadow, inheritedReceiveShadow) {
        Object.keys(children).forEach(childID => {
            const child = children[childID];

            if (childID === 'nodesList') {

                child.forEach(nodeId => {
                    const node = this.parseNode(graph, nodeId, inheritedMaterial, inheritedCastShadow, inheritedReceiveShadow);
                    if (node) parentGroup.add(node);
                });
            } 

            else if (['rectangle', 'triangle', 'box', 'cylinder', 'sphere', 'polygon'].includes(child.type)) {
                const material = this.materials[inheritedMaterial];
                const primitive = this.createPrimitive(child, material);
                if (primitive) {
                    primitive.castShadow = inheritedCastShadow;
                    primitive.receiveshadow = inheritedReceiveShadow;
                    parentGroup.add(primitive);
                }
            }

            else if (child.type === 'lodsList') {
                child.lodsList.forEach(lodId => {
                    const lodNode = this.parseNode(graph, lodId, inheritedMaterial, inheritedCastShadow, inheritedReceiveShadow);
                    if (lodNode) parentGroup.add(lodNode);
                });
            } 

            else if (['directionalLight', 'pointlight', 'spotLight'].includes(child.type)) {
                const light = this.createLight(child);
                if (light) parentGroup.add(light);
            }

            else console.error(`Unknown child type: ${child.type}`);
            
        });
    }

    createPrimitive(primitiveData, material) {

        let geometry;

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

                geometry.setIndex([0, 1, 2]);
                geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                geometry.computeVertexNormals();

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

            case 'cylinder': {
                const thetaStartCylinder = (primitiveData.thetastart || 0) * (Math.PI / 180);
                const thetaLengthCylinder = (primitiveData.thetalength || 360) * (Math.PI / 180);
                
                geometry = new THREE.CylinderGeometry(
                    primitiveData.top,
                    primitiveData.base,
                    primitiveData.height,
                    primitiveData.slices,
                    primitiveData.stacks,
                    primitiveData.capsclose || false,
                    thetaStartCylinder,
                    thetaLengthCylinder
                );
                break;
            }
                
            case 'sphere': {          
                const thetaStartSphere = primitiveData.thetastart * (Math.PI / 180) || 0;
                const thetaLengthSphere = primitiveData.thetalength * (Math.PI / 180) || Math.PI * 2;
                const phiStartSphere = primitiveData.phistart * (Math.PI / 180) || 0;
                const phiLengthSphere = primitiveData.philength * (Math.PI / 180) || Math.PI;

                geometry = new THREE.SphereGeometry(
                    primitiveData.radius,
                    primitiveData.slices,
                    primitiveData.stacks,
                    thetaStartSphere,
                    thetaLengthSphere,
                    phiStartSphere,
                    phiLengthSphere
                );

                break;
            }
            
            case 'nurbs': {
                
                const { degree_u, degree_v, parts_u, parts_v, controlpoints } = primitiveData;
                
                if (controlpoints.length !== (degree_u + 1) * (degree_v + 1)) {
                    console.error("Invalid control points for NURBS surface.");
                    return null;
                }
                
                const controlPoints = [];
                for (let v = 0; v <= degree_v; v++) {
                    const row = [];
                    for (let u = 0; u <= degree_u; u++) {
                        const index = v * (degree_u + 1) + u;
                        const point = controlpoints[index];
                        row.push(new THREE.Vector4(point.x, point.y, point.z, 1));
                    }
                    controlPoints.push(row);
                }
                
                const nurbsSurface = new THREE.NURBSSurface(degree_u, degree_v, controlPoints);
                
                geometry = new THREE.Geometry();
                
                const uStep = 1 / parts_u;
                const vStep = 1 / parts_v;
                
                // Generate vertices by evaluating the NURBS surface
                for (let i = 0; i <= parts_u; i++) {
                    for (let j = 0; j <= parts_v; j++) {
    
                        const u = i * uStep;
                        const v = j * vStep;
                        const point = nurbsSurface.getPointAt(u, v);
                        geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
                    }
                }
    
                // Optionally: Compute face indices or use some other method to connect the vertices
                // You can triangulate the surface, for example:
                const faces = [];
                for (let i = 0; i < parts_u; i++) {
                    for (let j = 0; j < parts_v; j++) {
                        const a = i * (parts_v + 1) + j;
                        const b = a + 1;
                        const c = a + (parts_v + 1);
                        const d = c + 1;
                        faces.push(new THREE.Face3(a, b, c));
                        faces.push(new THREE.Face3(b, d, c));
                   }
                }
    
                geometry.faces = faces;
                geometry.computeVertexNormals();  // For correct shading
    
                // Set the material (default to MeshBasicMaterial, can be adjusted)
                material = new THREE.MeshBasicMaterial({ vertexColors: true });
                
                break;
                
            }
            
            case 'polygon': {
                geometry = new THREE.CircleGeometry(primitiveData.radius, primitiveData.slices);
                
                const colors = [];

                geometry.vertices.forEach((vertex) => {
                    const distance = vertex.length();
                    const lerpedColor = new THREE.Color().lerpColors(
                        new THREE.Color(primitiveData.color_c.r, primitiveData.color_c.g, primitiveData.color_c.b),
                        new THREE.Color(primitiveData.color_p.r, primitiveData.color_p.g, primitiveData.color_p.b),
                        distance / primitiveData.radius
                    );

                    colors.push(lerpedColor.r, lerpedColor.g, lerpedColor.b);
                });

                geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
                
                material = new THREE.MeshBasicMaterial({ vertexColors: true });

                
                break;
            }

            default:
                console.error(`Unknown primitive type: ${primitiveData.type}`);
                return null;

        }

        if (!material) {
            console.error(`Material not found for primitive ${primitiveData.type}`);
            material = this.defaultMaterial;
        }

        return new THREE.Mesh(geometry, material);
    }

    createLight(lightData, inheritedCastShadow = false) {
        let light;

        const color = new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b);
        const intensity = lightData.intensity || 1;

        switch (lightData.type) {

            case 'directionalLight':
                light = new THREE.DirectionalLight(color, intensity);
                light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
                light.castShadow = inheritedCastShadow || lightData.castShadow;

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
                light.castShadow = inheritedCastShadow || lightData.castShadow;

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
                light.castShadow = inheritedCastShadow || lightData.castShadow;
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

        this.lights.push(light);
        return light;

    }

}

export { MyYASFParser };