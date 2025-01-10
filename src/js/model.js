//import * as THREE from 'three';
//import * as THREE from './js/three.module.js';
//import * as THREE from "../node_modules/three/build/three.module.js";
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { CatmullRom } from 'three/src/extras/core/Interpolations.js';

let scene, camera, renderer, raycaster, mouse,  mixer, cmixer ;
let groundPlane, progressBar, progress = 0;
let instructionText;
let isMousePressed = false;
let dModel, bird,cat; 
let secondModelMixer = null; 
let angle = 0; 
const radius = 40; // Radius of the circular path
const centerX = 0; // X-coordinate of the center of the island
const centerZ = 0; // Z-coordinate of the center of the island
const clock = new THREE.Clock();

export function contact() {
    // Set up raycaster and mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Scene and camera setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8F8F8');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Renderer setup with anti-aliasing
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // High resolution
    renderer.shadowMap.enabled = true; 
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // General 
    scene.add(ambientLight);

    // Hemisphere Light 
    const hemisphereLight = new THREE.HemisphereLight(0xeeeeee, 0x444444, 9.5); 
    hemisphereLight.position.set(0, 0, 0); 
    scene.add(hemisphereLight);

    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0 });
    groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    groundPlane.rotation.x = - Math.PI / 2;
    scene.add(groundPlane);

    // Load the dog model
    const loader = new GLTFLoader();
    loader.load('/assets/models/dogidle.glb', function (gltf) {
        dModel = gltf.scene; // 
        dModel.scale.set(0.21, 0.21, 0.21);
        dModel.position.set(10, 0.5, 0); 
        dModel.rotation.y = -(Math.PI / 3); // Rotate 60 degrees to the right
        scene.add(dModel);

        // Setup animation
        mixer = new THREE.AnimationMixer(dModel);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        // Add mouse interaction for petting the dog
        window.addEventListener('mousedown', onMouseDown, false);
        window.addEventListener('mouseup', onMouseUp, false);
        window.addEventListener('mousemove', onMouseMove, false);
    });

    // Create a progress bar below the dog
    const barContainer = document.createElement('div');
    barContainer.style.position = 'absolute';
    barContainer.style.top = '73%';  
    barContainer.style.right = '25%';
    barContainer.style.width = '200px';
    barContainer.style.height = '20px';
    barContainer.style.backgroundColor = '#ddd';
    barContainer.style.borderRadius = '10px';
    document.body.appendChild(barContainer);

    progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#4CAF50';
    progressBar.style.borderRadius = '10px 10px 10px 10px';
    barContainer.appendChild(progressBar);

    instructionText = document.createElement('div');
    instructionText.innerText = 'Pet the dog to unlock the contact!';
    instructionText.style.position = 'absolute';
    instructionText.style.top = '78%'; 
    instructionText.style.right = '25%';
    instructionText.style.fontSize = '14px';
    instructionText.style.color = '#333';
    document.body.appendChild(instructionText);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new SMAAPass(window.innerWidth, window.innerHeight)); // Smooth jagged edges

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (mixer) mixer.update(0.01); // Update 
        if (secondModelMixer) secondModelMixer.update(0.01); // Update second model's
        composer.render(); // Use post-processing composer
    }

    animate();

    function onMouseDown(event) {
        isMousePressed = true;

        // Check if mouse is over the dog model 
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        // If mouse is over the dog, update progress
        if (intersects.length > 0 && progress < 100) {
            progress += 33.33; 
            if (progress > 100) progress = 100; 

            // Update the progress bar's width
            progressBar.style.width = progress + '%';
            instructionText.innerText = 'Pet the dog to unlock the contact!';

            // Notify 
            if (progress === 100) {    
                instructionText.innerText = 'Unlocked! Well Done!';
                const event = new CustomEvent('barFull', { detail: { isBarFull: true } });
                window.dispatchEvent(event); // Trigger event when the progress bar is full

                // Remove the dog model
                scene.remove(dModel);

                // Load and play the second model
                loadSecondModel();
            }
        }
    }

    function onMouseUp() {
        isMousePressed = false;
    }

    function onMouseMove() {
        // Mouse move interaction, if necessary
    }

    function loadSecondModel() {
        const loader = new GLTFLoader();
        loader.load('/assets/models/dogjump.glb', function (gltf) {
            const model = gltf.scene;
            model.scale.set(0.21, 0.21, 0.21);
            model.position.set(10, 0.5, 0); 
            model.rotation.y = -(Math.PI / 3); // Rotate 60 degrees to the right
            scene.add(model);

            // Setup animation
            secondModelMixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                secondModelMixer.clipAction(clip).play();
            });
        });
    }
}

export function about() {
    
    // Set up raycaster and mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 10, 60);
    camera.lookAt(0, 2, 0);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // General
   
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFEB8C, 1); 
    directionalLight.position.set(10, 10, 10); 
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xeeeeee, 0x444444, 5); // Sky color, ground color, and intensity
    hemisphereLight.position.set(0, 0, 0);
    
    scene.add(hemisphereLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // High resolution
    renderer.shadowMap.enabled = true; // Enable shadows
    document.body.appendChild(renderer.domElement);

    // Blue Sky Shader
    const blueSkyShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x1E90FF) }, // Deep blue (top of the sky)
            middleColor: { value: new THREE.Color(0x87CEEB) }, // Sky blue (middle of the sky)
            bottomColor: { value: new THREE.Color(0xB0E0E6) }, // Light blue (near the horizon)
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 middleColor;
            uniform vec3 bottomColor;
            varying vec3 vWorldPosition;
    
            void main() {
                float h = normalize(vWorldPosition).y;
                vec3 gradientColor;
                if (h > 0.6) {
                    gradientColor = mix(middleColor, topColor, (h - 0.6) * 2.5);
                } else {
                    gradientColor = mix(bottomColor, middleColor, h / 0.6);
                }
                gl_FragColor = vec4(gradientColor, 1.0);
            }
        `,
        side: THREE.BackSide
    });
    
    
    // Sky Geometry (Blue Sky)
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const sky = new THREE.Mesh(skyGeometry, blueSkyShaderMaterial);
    scene.add(sky);

    const textureLoader = new THREE.TextureLoader();
    const cloudTexture = textureLoader.load('assets/images/cloud.svg');

    const cloudMaterial = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,  
        opacity: 0.6,       
        side: THREE.DoubleSide,  
        blending: THREE.AdditiveBlending, 
        depthWrite: true,  
    });


    const cloudGeometry = new THREE.CircleGeometry(200, 32); // Radius 200, 32 segments
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.position.z=-40;
    scene.add(clouds);


    // Load the island model
    const loader = new GLTFLoader();
    let island = null;
    loader.load('/assets/models/island.glb', function (gltf) {
        island = gltf.scene;
        scene.add(island);
        island.position.set(0, 0, 0);
        island.scale.set(0.4, 0.4, 0.4);  
        island.rotation.y = (Math.PI); 
        island.castShadow = true;
        island.receiveShadow = true;
    });

    loader.load('assets/models/bird.glb', function (gltf) {
        bird = gltf.scene; 
        bird.scale.set(1,1,1);
        bird.position.set(-15, 5, 45); 
        bird.castShadow=true;
        bird.lookAt(island);
        scene.add(bird);

        // Setup animation
        mixer = new THREE.AnimationMixer(bird);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    });

        loader.load('assets/models/cat.glb', function (gltf) {
            cat = gltf.scene; 
            cat.scale.set(0.09,0.09,0.09);
            cat.position.set(0, 10, 10); 
            cat.rotation.y=Math.PI/4;
            cat.castShadow=true;
            scene.add(cat);
    
            // Setup animation
            cmixer = new THREE.AnimationMixer(cat);
            gltf.animations.forEach((clip) => {
                cmixer.clipAction(clip).play();
            });
        
    });


    // Scroll delta initialization
    let scrollDelta = 0;
    let smoothScrollDelta = 0;
    window.addEventListener('wheel', (event) => {
        scrollDelta += event.deltaY * 0.001;
        
    });

    // Postprocessing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(fxaaPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,  
        0.4,  
        0.85   
    );
    composer.addPass(bloomPass);

    const bokehPass = new BokehPass(scene, camera, {
        focus: 1.0,
        aperture: 0.025,
        maxblur: 0.01,
    });
    composer.addPass(bokehPass);

    if (island && cat && !island.children.includes(cat)) {
        island.add(cat);
    
    }
  
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (cmixer) cmixer.update(0.06);
        if (mixer) mixer.update(clock.getDelta());
        if (bird) {
            
            angle += 0.01; 
            bird.position.x = centerX + radius * Math.cos(angle);
            bird.position.z = centerZ + radius * Math.sin(angle);
    
            bird.rotation.set(0, -Math.PI / 2, 0); 

        }
        smoothScrollDelta += (scrollDelta - smoothScrollDelta) * 0.1;
        if(cat){
            cat.rotation.y+=smoothScrollDelta;
        }
        if (island) {
            island.rotation.y += smoothScrollDelta;
        }
        
        cloudTexture.offset.y += 0.001; 
       
       clouds.rotation.z += 0.007;  

        scrollDelta *= 0.9;

        composer.render();
        renderer.render(scene, camera);
    }

    animate();


    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}  
