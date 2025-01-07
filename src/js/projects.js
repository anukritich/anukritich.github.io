import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

let scene, camera, renderer, raycaster, mouse, mixer;
let dModel; // Store the dog model
let secondModelMixer = null;
let velocity = new THREE.Vector3(); // For movement calculations

// Set up raycaster and mouse
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

// Scene and camera setup
scene = new THREE.Scene();
scene.background = new THREE.Color('#F8F8F8');

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

// Load the dog model
const loader = new GLTFLoader();
loader.load('/assets/models/dogwalk.glb', function (gltf) {
    dModel = gltf.scene;
    dModel.scale.set(0.21, 0.21, 0.21);
    dModel.position.set(-30, 0, 0);
    dModel.rotation.x = -Math.PI / 2.2;
    dModel.rotation.z = Math.PI / 2;
    scene.add(dModel);

    // Setup camera to look at the dog model
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5); // Position the camera
    camera.lookAt(dModel.position); // Look at the dog model
    scene.add(camera);

    // Setup animation mixer for the dog model
    mixer = new THREE.AnimationMixer(dModel);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
});

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

// Arrow key controls (on-screen buttons)
let isWalking = false;

document.getElementById('moveLeft').addEventListener('click', () => {
    isWalking = true; // Start walking animation
    moveDog('left');
});

document.getElementById('moveRight').addEventListener('click', () => {
    isWalking = true; // Start walking animation
    moveDog('right');
});

// Move dog based on button input
function moveDog(direction) {
    const speed = 0.1; // Speed of movement

    // Move the dog model based on button press
    if (direction === 'left') dModel.position.x -= speed;
    if (direction === 'right') dModel.position.x += speed;

    // Play walking animation when moving
    if (isWalking && mixer) {
        const walkAction = mixer.clipAction('walk');
        if (walkAction) walkAction.play();
    }
}

// Check if the dog is not moving to play idle animation
function checkIdle() {
    if (!isWalking && mixer) {
        const idleAction = mixer.clipAction('idle');
        if (idleAction) {
            idleAction.play(); // Play idle animation
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Ensure mixer and dModel are defined before updating or animating
    if (mixer && dModel) {
        mixer.update(0.01); // Update dog model animation
    }

    checkIdle(); // Check if the dog should be idle

    composer.render(); // Use post-processing composer
}

animate();

// Load second model if needed
function loadSecondModel() {
    const loader = new GLTFLoader();
    loader.load('/assets/models/dogidle.glb', function (gltf) {
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
