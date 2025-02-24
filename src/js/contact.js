import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.mixer = null;
        this.secondModelMixer = null;
        this.currentModel = null;
        this.progress = 0;
        this.isMousePressed = false;

        this.progressBar = null;
        this.instructionText = null;

        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.setupGround();
        this.setupPostProcessing();
        this.setupEventListeners();
        this.createUI();
        this.loadInitialDog();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#F8F8F8');

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 20;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        const hemisphereLight = new THREE.HemisphereLight(0xeeeeee, 0x444444, 9.5);
        hemisphereLight.position.set(0, 0, 0);
        this.scene.add(hemisphereLight);
    }

    setupGround() {
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0 });
        const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        groundPlane.rotation.x = -Math.PI / 2;
        this.scene.add(groundPlane);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(new SMAAPass(window.innerWidth, window.innerHeight));
    }

    createUI() {
        const barContainer = document.createElement('div');
        Object.assign(barContainer.style, {
            position: 'absolute',
            top: '78%',
            left: '20%',
            width: '200px',
            height: '20px',
            backgroundColor: '#ddd',
            borderRadius: '10px'
        });
        document.body.appendChild(barContainer);

        this.progressBar = document.createElement('div');
        Object.assign(this.progressBar.style, {
            width: '0%',
            height: '100%',
            backgroundColor: '#4CAF50',
            borderRadius: '10px'
        });
        barContainer.appendChild(this.progressBar);

        this.instructionText = document.createElement('div');
        Object.assign(this.instructionText.style, {
            position: 'absolute',
            top: '78%',
            left: '25%',
            fontSize: '14px',
            color: '#333'
        });
        this.instructionText.innerText = 'Click Me!';
        document.body.appendChild(this.instructionText);
    }

    loadModel(path, callback) {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.21, 0.21, 0.21);
            model.position.set(-13, -1.0, 0);
            model.rotation.y = Math.PI / 2.25;

            if (callback) callback(model, gltf.animations);
        },
        (xhr) => {
            const percentage = Math.round((xhr.loaded / xhr.total) * 100);
            document.getElementById('loading-text').textContent = `Loading... ${percentage}%`;
        },
        (error) => {
            console.error('Error loading model:', error);
        });
    }

    loadInitialDog() {
        this.loadModel('/assets/models/dogidle.glb', (model, animations) => {
            this.currentModel = model;
            this.scene.add(model);

            this.mixer = new THREE.AnimationMixer(model);
            animations.forEach(clip => {
                this.mixer.clipAction(clip).play();
            });
        });
    }

    loadJumpingDog() {
        this.loadModel('/assets/models/dogjump.glb', (model, animations) => {
            this.currentModel = model;
            this.scene.add(model);

            this.secondModelMixer = new THREE.AnimationMixer(model);
            animations.forEach(clip => {
                this.secondModelMixer.clipAction(clip).play();
            });
        });
    }

    handleProgress() {
        if (this.progress < 100) {
            this.progress += 33.33;
            if (this.progress > 100) this.progress = 100;

            this.progressBar.style.width = `${this.progress}%`;

            if (this.progress === 100) {
                this.instructionText.innerText = 'Contact Unlocked!';
                this.instructionText.style.left = '23%';

                window.dispatchEvent(
                    new CustomEvent('barFull', {
                        detail: { isBarFull: true }
                    })
                );

                if (this.currentModel) {
                    this.scene.remove(this.currentModel);
                    this.loadJumpingDog();
                }
            }
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousedown', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.handleProgress();
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        if (this.mixer) this.mixer.update(delta);
        if (this.secondModelMixer) this.secondModelMixer.update(delta);

        this.composer.render();
    }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');

    const loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = (url, loaded, total) => {
        const progress = Math.round((loaded / total) * 100);
        loadingText.textContent = `Loading... ${progress}%`;
    };

    loadingManager.onLoad = () => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            new SceneManager();
        }, 500);
    };

    loadingManager.onError = (url) => {
        console.error('Error loading:', url);
        loadingText.textContent = 'Error loading assets';
    };

    // Preload models
    const loader = new GLTFLoader(loadingManager);
    const models = [
        '/assets/models/dogidle.glb',
        '/assets/models/dogjump.glb'
    ];

    models.forEach(modelPath => {
        loader.load(modelPath, () => {}, undefined, (error) => console.error(`Error loading model ${modelPath}:`, error));
    });
});

function unlockFormFields() {
    const formElements = document.querySelectorAll('input, textarea');
    const sendBtn = document.getElementById('send-btn');

    formElements.forEach(input => {
        if (input) {
            input.disabled = false;

            input.addEventListener('mouseover', () => {
                Object.assign(input.style, {
                    backgroundColor: '#F7E7CE',
                    color: 'black',
                    borderColor: 'black',
                    transition: 'transform 0.3s',
                    transform: 'scale(1.1)'
                });
            });

            input.addEventListener('mouseout', () => {
                Object.assign(input.style, {
                    backgroundColor: '',
                    color: '',
                    borderColor: '',
                    transform: 'scale(1)'
                });
            });
        }
    });

    if (sendBtn) sendBtn.disabled = false;
}

// Setup form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            message: document.getElementById('message')?.value || ''
        };

        emailjs.send('service_p9ddpnh', 'template_29u5xyj', formData)
            .then(
                response => {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Your message has been sent successfully!');
                    this.reset();
                },
                error => {
                    console.error('FAILED...', error);
                    alert('Failed to send the message. Please try again later.');
                }
            );
    });
}

// Setup form unlock handler
window.addEventListener('barFull', (event) => {
    if (event.detail.isBarFull) {
        unlockFormFields();
    }
});