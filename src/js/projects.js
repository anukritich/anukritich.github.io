import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class GalaxyVisualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stars = null;
        this.numStars = 10000;
        this.galaxyRadius = 800;
        this.spiralDensity = 0.5;
        this.assetsLoaded = 0;
        this.totalAssets = 0;

        this.assetsToPreload = {
            textures: [
                '/assets/textures/star.png',
                '/assets/textures/galaxy_bg.jpg'
            ],
            models: [
                '/assets/models/spacecraft.glb'
            ],
            audio: [
                '/assets/audio/space_ambient.mp3'
            ]
        };

        this.totalAssets = this.assetsToPreload.textures.length + 
                           this.assetsToPreload.models.length + 
                           this.assetsToPreload.audio.length;

        this.loadedAssets = {
            textures: {},
            models: {},
            audio: {}
        };

        this.setupLoadingScreen();
        this.preloadAssets();
    }

    setupLoadingScreen() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingText = document.getElementById('loading-text');
        this.loadingSpinner = document.getElementById('spinner');

        if (!this.loadingScreen || !this.loadingText || !this.loadingSpinner) {
            console.warn("Warning: Loading screen elements not found in DOM.");
            return;
        }

        this.loadingText.textContent = 'Loading 0%';
        this.loadingSpinner.style.display = 'block';
    }

    updateLoadingProgress() {
        this.assetsLoaded++;
        const progress = Math.round((this.assetsLoaded / this.totalAssets) * 100);
        
        if (this.loadingText) {
            this.loadingText.textContent = `Loading ${progress}%`;
        }

        if (this.assetsLoaded >= this.totalAssets) {
            this.init();
            this.animate();

            setTimeout(() => {
                if (this.loadingScreen) this.loadingScreen.style.display = 'none';
                if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
            }, 300);
        }
    }

    preloadAssets() {
        if (this.totalAssets === 0) {
            this.simulateLoading();
            return;
        }

        const loadingManager = new THREE.LoadingManager(() => {
            console.log("All assets loaded");
            this.updateLoadingProgress();
        });

        // Preload textures
        const textureLoader = new THREE.TextureLoader(loadingManager);
        this.assetsToPreload.textures.forEach(texturePath => {
            textureLoader.load(texturePath,
                (texture) => {
                    this.loadedAssets.textures[texturePath] = texture;
                    this.updateLoadingProgress();
                },
                undefined,
                (error) => {
                    console.error(`Error loading texture ${texturePath}:`, error);
                    this.updateLoadingProgress();
                }
            );
        });

        // Preload models
        const modelLoader = new GLTFLoader(loadingManager);
        this.assetsToPreload.models.forEach(modelPath => {
            modelLoader.load(modelPath,
                (gltf) => {
                    this.loadedAssets.models[modelPath] = gltf;
                    this.updateLoadingProgress();
                },
                undefined,
                (error) => {
                    console.error(`Error loading model ${modelPath}:`, error);
                    this.updateLoadingProgress();
                }
            );
        });

        // Preload audio
        this.assetsToPreload.audio.forEach(audioPath => {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', () => {
                this.loadedAssets.audio[audioPath] = audio;
                this.updateLoadingProgress();
            }, { once: true });

            audio.addEventListener('error', () => {
                console.error(`Error loading audio ${audioPath}`);
                this.updateLoadingProgress();
            }, { once: true });

            audio.src = audioPath;
            audio.load();
        });
    }

    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (this.loadingText) this.loadingText.textContent = `Loading ${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                this.init();
                this.animate();

                setTimeout(() => {
                    if (this.loadingScreen) this.loadingScreen.style.display = 'none';
                }, 300);
            }
        }, 150);
    }

    init() {
        this.setupScene();
        this.createGalaxy();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 1000;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Add preloaded model
        if (this.loadedAssets.models['/assets/models/spacecraft.glb']) {
            const model = this.loadedAssets.models['/assets/models/spacecraft.glb'].scene;
            model.scale.set(0.1, 0.1, 0.1);
            model.position.set(0, 0, 800);
            this.scene.add(model);
        }

        // Start background audio
        if (this.loadedAssets.audio['/assets/audio/space_ambient.mp3']) {
            const ambientSound = this.loadedAssets.audio['/assets/audio/space_ambient.mp3'];
            ambientSound.loop = true;
            ambientSound.volume = 0.5;
            document.addEventListener('click', () => {
                ambientSound.play().catch(err => console.error('Audio play error:', err));
            }, { once: true });
        }
    }

    randomColor() {
        return Math.random() > 0.5 
            ? new THREE.Color(1, 1, 1)
            : new THREE.Color(0, 0, 0.7);
    }

    createGalaxy() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.numStars * 3);
        const colors = new Float32Array(this.numStars * 3);

        for (let i = 0; i < this.numStars; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * this.galaxyRadius;
            const z = (Math.random() - 0.5) * 2 * this.galaxyRadius;

            positions.set([radius * Math.cos(angle), radius * Math.sin(angle), z], i * 3);

            const color = this.randomColor();
            colors.set([color.r, color.g, color.b], i * 3);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            vertexColors: true,
            size: 2,
            transparent: true
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.stars) {
            this.stars.rotation.y += 0.0005;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.onload = () => {
    new GalaxyVisualization();
};
