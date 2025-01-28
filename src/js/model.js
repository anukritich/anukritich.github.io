import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

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
        dModel.position.set(-13, 0.0, 0); 
        dModel.rotation.y = (Math.PI / 2.25); // Rotate 60 degrees to the right
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
    barContainer.style.left = '20%';
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
    instructionText.innerText = 'Click Me!';
    instructionText.style.position = 'absolute';
    instructionText.style.top = '78%'; 
    instructionText.style.left = '25%';
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
            instructionText.innerText = 'Click Me!';

            // Notify 
            if (progress === 100) {    
                instructionText.innerText = 'Contact Unlocked!';
                instructionText.style.left = '23%';
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
            model.position.set(-13, 0.0, 0); 
            model.rotation.y = (Math.PI / 2.25); // Rotate 60 degrees to the right
            scene.add(model);

            // Setup animation
            secondModelMixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                secondModelMixer.clipAction(clip).play();
            });
        });
    }
}

