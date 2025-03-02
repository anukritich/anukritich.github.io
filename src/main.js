// Cursor elements
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if (cursorDot && cursorOutline) {
    let dotX = 0, dotY = 0; // Position of the inner dot
    let outlineX = 0, outlineY = 0; // Position of the outer outline
    const speed = 0.1; // Adjust for smoother lag effect

    document.addEventListener("mousemove", (e) => {
        dotX = e.clientX;
        dotY = e.clientY;

        // Instantly move the small cursor dot
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    });

    function animateCursor() {
        outlineX += (dotX - outlineX) * speed;
        outlineY += (dotY - outlineY) * speed;

        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor(); // Start animation loop
}

document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const loadingText = document.getElementById("loading-text");
    const sections = document.querySelectorAll(".story-section");
    const welcomeText = document.getElementById("welcome-text");

    let currentSection = 0;
    let isScrolling = false;
    let lastScrollTime = 0;
    const scrollDelay = 1000; // Delay between scroll actions in ms

    // Add scroll indicators
    sections.forEach((section, index) => {
        if (index < sections.length - 1) {
            const indicator = document.createElement("div");
            indicator.className = "scroll-indicator";
            indicator.innerHTML = "Scroll down ↓";
            section.appendChild(indicator);
        }
    });

    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (loadingText) {
                loadingText.textContent = `Loading... ${progress}%`;
            }

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    hideLoadingScreen();
                }, 500);
            }
        }, 100);
    }

    function hideLoadingScreen() {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => {
            loadingScreen.style.display = "none";
            startStory();
        }, 50);
    }

    function startStory() {
        sections[0].classList.add("active-section");

        if (welcomeText) {
            welcomeText.classList.remove("zoom-in");
            void welcomeText.offsetWidth; // Force reflow (triggers a DOM re-render)
            welcomeText.classList.add("zoom-in");
        }

        window.addEventListener("wheel", handleMouseWheel);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);
    }

    let touchStartY = 0;

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (isScrolling) return;

        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                scrollToNextSection();
            } else {
                scrollToPrevSection();
            }
            touchStartY = touchY;
        }
    }

    function handleMouseWheel(e) {
        const now = Date.now();

        if (isScrolling || now - lastScrollTime < scrollDelay) {
            return;
        }

        lastScrollTime = now;

        if (e.deltaY > 0) {
            scrollToNextSection();
        } else {
            scrollToPrevSection();
        }
    }

    function scrollToNextSection() {
        if (currentSection < sections.length - 1) {
            isScrolling = true;

            sections[currentSection].classList.remove("active-section");
            currentSection++;
            sections[currentSection].classList.add("active-section");

            sections[currentSection].scrollIntoView({ behavior: "smooth" });

            setTimeout(() => {
                isScrolling = false;
            }, scrollDelay);
        }
    }

    function scrollToPrevSection() {
        if (currentSection > 0) {
            isScrolling = true;

            sections[currentSection].classList.remove("active-section");
            currentSection--;
            sections[currentSection].classList.add("active-section");

            sections[currentSection].scrollIntoView({ behavior: "smooth" });

            setTimeout(() => {
                isScrolling = false;
            }, scrollDelay);
        }
    }

    simulateLoading();
});

import * as THREE from 'three';

// Set up scene
const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Scene background
scene.background = new THREE.Color(0x000000);



// Create animated fog volumes
const createFogVolumes = () => {
    const fogVolumes = [];
    const fogCount = 20;
    const textureLoader = new THREE.TextureLoader();
    
    // Create a procedural cloud texture with noise
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const ctx = noiseCanvas.getContext('2d');
    
    // Create gradient noise
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    // Create noise texture
    const noiseTexture = new THREE.CanvasTexture(noiseCanvas);
    
    // Create multiple fog volumes
    for (let i = 0; i < fogCount; i++) {
        // Randomize fog colors - purples and blues
        const hue = Math.random() * 0.3 + 0.6; // 0.6-0.9 range in hue (purples to blues)
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
        
        const fogMaterial = new THREE.MeshBasicMaterial({
            map: noiseTexture, 
            transparent: true,
            opacity: Math.random() * 0.3 + 0.1,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            color: color
        });
        
        // Create different sized planes for fog
        const size = Math.random() * 60 + 40;
        const fogGeometry = new THREE.PlaneGeometry(size, size);
        const fog = new THREE.Mesh(fogGeometry, fogMaterial);
        
        // Position fog throughout the scene
        const radius = Math.random() * 80 + 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI/2;
        
        fog.position.set(
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(phi) + (Math.random() - 0.5) * 30,
            radius * Math.cos(theta) * Math.cos(phi)
        );
        
        // Random rotation
        fog.rotation.x = Math.random() * Math.PI;
        fog.rotation.y = Math.random() * Math.PI;
        fog.rotation.z = Math.random() * Math.PI;
        
        // Animation parameters
        fog.userData = {
            // Movement
            velocity: {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.1
            },
            // Rotation
            spin: {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.005
            },
            // Wave animation
            wave: {
                amplitude: Math.random() * 5 + 2,
                frequency: Math.random() * 0.02 + 0.01,
                offset: Math.random() * Math.PI * 2
            },
            // Scale animation
            scale: {
                factor: Math.random() * 0.2 + 0.9,
                speed: Math.random() * 0.01 + 0.005
            },
            // Original position for orbital movement
            origin: {
                x: fog.position.x,
                y: fog.position.y,
                z: fog.position.z
            },
            // Opacity pulsation
            opacity: {
                min: Math.random() * 0.1 + 0.05,
                max: Math.random() * 0.2 + 0.2,
                speed: Math.random() * 0.01 + 0.005
            }
        };
        
        fogVolumes.push(fog);
        scene.add(fog);
    }
    
    return fogVolumes;
};

// Create distant stars
const createStarfield = () => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Place stars far away in a sphere
        const radius = Math.random() * 200 + 400;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        
        starPositions[i3] = radius * Math.sin(theta) * Math.cos(phi);
        starPositions[i3 + 1] = radius * Math.sin(phi);
        starPositions[i3 + 2] = radius * Math.cos(theta) * Math.cos(phi);
        
        // Random star sizes
        starSizes[i] = Math.random() * 2 + 0.5;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('aScale', new THREE.BufferAttribute(starSizes, 1));
    
    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute float aScale;
            uniform float uTime;
            uniform float uPixelRatio;
            
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Calculate twinkle effect
                float twinkle = sin(uTime * 0.5 + position.x * 100.0) * 0.5 + 0.5;
                
                // Size attenuation
                gl_PointSize = aScale * uPixelRatio * (300.0 / -mvPosition.z) * (0.5 + 0.5 * twinkle);
            }
        `,
        fragmentShader: `
            void main() {
                // Create a soft glow
                float distToCenter = length(gl_PointCoord - vec2(0.5));
                float strength = 1.0 - smoothstep(0.0, 0.5, distToCenter);
                
                gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    return stars;
};

// Create moving nebula particles
const createNebulaParticles = () => {
    const particleCount = 5000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    // Create color palette
    const colorPalette = [
        new THREE.Color(0x9977ff), // Purple
        new THREE.Color(0x8866ee), // Light purple
        new THREE.Color(0x5588ff), // Blue
        new THREE.Color(0x7744ff)  // Deep purple
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random position in a spherical volume
        const radius = Math.random() * 100 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI/2;
        
        positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
        positions[i3 + 1] = radius * Math.sin(phi);
        positions[i3 + 2] = radius * Math.cos(theta) * Math.cos(phi);
        
        // Random color from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Random size
        scales[i] = Math.random() * 4 + 1;
        
        // Random velocity
        velocities[i3] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    particlesGeometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));
    
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute vec3 color;
            attribute float aScale;
            attribute vec3 aVelocity;
            varying vec3 vColor;
            uniform float uTime;
            uniform float uPixelRatio;
            
            void main() {
                vColor = color;
                
                // Apply velocity over time
                vec3 movingPosition = position + aVelocity * uTime * 10.0;
                
                // Keep particles within bounds using modulo-like behavior
                float bound = 150.0;
                if(abs(movingPosition.x) > bound) movingPosition.x = -sign(movingPosition.x) * (bound - 10.0);
                if(abs(movingPosition.y) > bound) movingPosition.y = -sign(movingPosition.y) * (bound - 10.0);
                if(abs(movingPosition.z) > bound) movingPosition.z = -sign(movingPosition.z) * (bound - 10.0);
                
                vec4 mvPosition = modelViewMatrix * vec4(movingPosition, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Pulsating size
                float pulse = sin(uTime + aScale) * 0.5 + 0.5;
                gl_PointSize = aScale * uPixelRatio * (600.0 / -mvPosition.z) * (0.7 + 0.3 * pulse);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Soft particle edge
                float distToCenter = length(gl_PointCoord - vec2(0.5));
                float strength = 1.0 - smoothstep(0.0, 0.5, distToCenter);
                
                gl_FragColor = vec4(vColor, strength * 0.7);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    return particles;
};

// Create all scene elements
const fogVolumes = createFogVolumes();
const starfield = createStarfield();
const nebulaParticles = createNebulaParticles();


// Set camera position
camera.position.z = 100;
camera.position.y = 20;
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
   // Update starfield
   if (starfield.material.uniforms) {
    starfield.material.uniforms.uTime.value = time;
}

// Update nebula particles
if (nebulaParticles.material.uniforms) {
    nebulaParticles.material.uniforms.uTime.value = time;
}

// Animate fog volumes - the key to creating moving fog
fogVolumes.forEach(fog => {
    // Apply rotation
    fog.rotation.x += fog.userData.spin.x;
    fog.rotation.y += fog.userData.spin.y;
    fog.rotation.z += fog.userData.spin.z;
    
    // Apply wave-like position changes
    const waveX = Math.sin(time * fog.userData.wave.frequency + fog.userData.wave.offset) * fog.userData.wave.amplitude;
    const waveZ = Math.cos(time * fog.userData.wave.frequency + fog.userData.wave.offset) * fog.userData.wave.amplitude;
    
    // Apply linear movement
    fog.position.x += fog.userData.velocity.x;
    fog.position.y += fog.userData.velocity.y;
    fog.position.z += fog.userData.velocity.z;
    
    // Add wave movement
    fog.position.x += waveX * 0.05;
    fog.position.z += waveZ * 0.05;
    
    // Keep fog within bounds
    const bound = 150;
    if (Math.abs(fog.position.x) > bound) {
        fog.position.x = -Math.sign(fog.position.x) * (bound - 20);
    }
    if (Math.abs(fog.position.y) > bound) {
        fog.position.y = -Math.sign(fog.position.y) * (bound - 20);
    }
    if (Math.abs(fog.position.z) > bound) {
        fog.position.z = -Math.sign(fog.position.z) * (bound - 20);
    }
    
    // Scaling animation
    const scale = 1.0 + Math.sin(time * fog.userData.scale.speed) * fog.userData.scale.factor * 0.2;
    fog.scale.set(scale, scale, scale);
    
    // Opacity pulsation
    const opacityFactor = fog.userData.opacity.min + 
        (Math.sin(time * fog.userData.opacity.speed + fog.userData.wave.offset) * 0.5 + 0.5) * 
        (fog.userData.opacity.max - fog.userData.opacity.min);
    fog.material.opacity = opacityFactor;
});

// Create slow orbital movement for camera
const cameraRadius = 100;
const cameraSpeed = 0.05;
const cameraAngle = time * cameraSpeed;

camera.position.x = Math.sin(cameraAngle) * cameraRadius * 0.2;
camera.position.z = Math.cos(cameraAngle) * cameraRadius;
camera.position.y = 20 + Math.sin(time * 0.2) * 5;  // Gentle up/down movement

// Always look at center
camera.lookAt(0, 0, 0);

// Update planet glow shader
scene.children.forEach(child => {
    if (child.material && child.material.uniforms && child.material.uniforms.viewVector) {
        child.material.uniforms.viewVector.value = camera.position;
    }
});

renderer.render(scene, camera);
}

animate();

// Resize event handling
window.addEventListener("resize", () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);

// Update star and particle pixel ratio if needed
if (starfield.material.uniforms && starfield.material.uniforms.uPixelRatio) {
    starfield.material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
}

if (nebulaParticles.material.uniforms && nebulaParticles.material.uniforms.uPixelRatio) {
    nebulaParticles.material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
}
});

// Optional: add more volumetric fog clouds
function addMoreFogClouds() {
// Create 5 large background fog clouds
for (let i = 0; i < 5; i++) {
    const size = Math.random() * 120 + 100;
    const fogGeometry = new THREE.PlaneGeometry(size, size);
    
    // Darker blue-purple for background depth
    const color = new THREE.Color(
        0.2 + Math.random() * 0.1,  // Red component
        0.1 + Math.random() * 0.1,  // Green component
        0.4 + Math.random() * 0.2   // Blue component
    );
    
    const fogMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.05 + Math.random() * 0.05,  // Very subtle
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const fog = new THREE.Mesh(fogGeometry, fogMaterial);
    
    // Position these further back
    const distance = Math.random() * 50 + 150;
    const angle = Math.random() * Math.PI * 2;
    
    fog.position.set(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 100,
        Math.sin(angle) * distance
    );
    
    fog.lookAt(camera.position);  // Face the camera
    
    // Very slow movement
    fog.userData = {
        velocity: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.02
        },
        spin: {
            x: (Math.random() - 0.5) * 0.001,
            y: (Math.random() - 0.5) * 0.001,
            z: (Math.random() - 0.5) * 0.001
        }
    };
    
    fogVolumes.push(fog);
    scene.add(fog);
}
}

// Call this function to add more depth to the scene
addMoreFogClouds();