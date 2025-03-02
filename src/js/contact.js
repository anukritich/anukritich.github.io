// Cursor elements
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if (cursorDot && cursorOutline) {
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    const speed = 0.1;

    document.addEventListener("mousemove", (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    });

    function animateCursor() {
        outlineX += (dotX - outlineX) * speed;
        outlineY += (dotY - outlineY) * speed;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

import * as THREE from 'three';
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
        this.galaxy = null;
        this.isTyping = false;
        this.typingTimeout = null;

        this.init();
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.setupPostProcessing();
        this.setupEventListeners();
        this.loadGalaxy();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 17;

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
        this.scene.add(hemisphereLight);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(new SMAAPass(window.innerWidth, window.innerHeight));
    }

    
    

    loadGalaxy() {
        this.galaxy = new Galaxy(this.scene);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        });


        // Detect typing in input and textarea fields
        document.addEventListener("input", () => this.startTyping());
    }

    startTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
        }

        // Reset typing timeout
        clearTimeout(this.typingTimeout);

        // Stop galaxy rotation after 1 second of inactivity
        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
        }, 1000);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate galaxy when typing
        if (this.isTyping && this.galaxy) {
            this.galaxy.animateGalaxy();
        }

        this.composer.render();
    }
}

class Galaxy {
    constructor(scene) {
        this.scene = scene;
        this.particles = null;
        this.initGalaxy();
    }

    initGalaxy() {
        const particleCount = 20000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const radius = 2;

        for (let i = 0; i < particleCount; i++) {
            // Spherical distribution formula
            let theta = Math.random() * Math.PI * 2; // Random angle in xy-plane
            let phi = Math.acos(2 * Math.random() - 1); // Random angle from z-axis
            let r = Math.cbrt(Math.random()) * radius; // Cube root for uniform density

            let x = r * Math.sin(phi) * Math.cos(theta);
            let y = r * Math.sin(phi) * Math.sin(theta);
            let z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            colors[i * 3] = 0.2 + Math.random() * 0.6;
            colors[i * 3 + 1] = 0.1;
            colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Load a circular texture for spherical particles
        const textureLoader = new THREE.TextureLoader();
        const particleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/circle.png');

        const material = new THREE.PointsMaterial({
            size: 0.05,
            map: particleTexture, // Apply texture to make points circular
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false, // Prevents rendering issues
            blending: THREE.AdditiveBlending,
        });

        this.particles = new THREE.Points(geometry, material);
        this.particles.position.set(0, 0, 0);
        this.particles.scale.set(5, 5, 5);
        this.scene.add(this.particles);
    }

    animateGalaxy() {
        if (this.particles) {
            this.particles.rotation.y += 0.002;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');

    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            new SceneManager();
        }, 500);
    }, 1000);
});

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("8zyGzzVV8yWtsPwJx"); 
});

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Use FormData for cleaner handling
        const formData = new FormData(this);
        const templateParams = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        emailjs
            .send("service_p9ddpnh", "template_29u5xyj", templateParams)
            .then(
                (response) => {
                    console.log("SUCCESS!", response.status, response.text);
                    alert("Your message has been sent successfully!");
                    contactForm.reset(); // Reset form after successful submission
                },
                (error) => {
                    console.error("FAILED...", error);
                    alert("Failed to send the message. Please try again later.");
                }
            );
    });
}
