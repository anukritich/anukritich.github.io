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

// Galaxy parameters
const params = {
    count: 50000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: 0x9977ff,
    outsideColor: 0x1b3984,
    fogDensity: 0.05
};

// Add fog to scene
scene.fog = new THREE.FogExp2(0x000b24, params.fogDensity);
scene.background = new THREE.Color(0x000000);

// Planet effect on the bottom
const createPlanet = () => {
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(20, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x0077ff,
            transparent: true,
            opacity: 0.6
        })
    );
    planet.position.set(0, -30, 0);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(23, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(0x00aaff) },
            viewVector: { value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, 0.5);
            }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.set(0, -30, 0);
    scene.add(glowMesh);
    scene.add(planet);
};

// Create galaxy
const generateGalaxy = () => {
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);
    const scales = new Float32Array(params.count);
    
    const insideColor = new THREE.Color(params.insideColor);
    const outsideColor = new THREE.Color(params.outsideColor);
    
    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;
        
        // Position
        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spin;
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
        const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
        const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
        
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY; // Flat galaxy
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        
        // Color
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / params.radius);
        
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
        
        // Scale (for variability)
        scales[i] = Math.random() * 2.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    
    // Material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: params.size * renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute vec3 color;
            attribute float aScale;
            varying vec3 vColor;
            uniform float uTime;
            uniform float uSize;
            
            void main() {
                vColor = color;
                
                // Position
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                
                // Slow rotation
                float angle = uTime * 0.05;
                mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                modelPosition.xz = rotation * modelPosition.xz;
                
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                
                gl_Position = projectedPosition;
                
                // Size
                gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Disc point pattern
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 5.0);
                
                // Final color
                vec3 color = mix(vec3(0.0), vColor, strength);
                gl_FragColor = vec4(color, strength * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });
    
    // Points
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    return { points, material };
};

// Create nebula clouds
const createNebulaClouds = () => {
    const clouds = [];
    const cloudCount = 5;
    
    for (let i = 0; i < cloudCount; i++) {
        const cloudGeometry = new THREE.PlaneGeometry(50, 50);
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
                Math.random() * 0.2 + 0.5, 
                Math.random() * 0.2, 
                Math.random() * 0.5 + 0.5
            ),
            transparent: true,
            opacity: Math.random() * 0.2 + 0.1,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        
        // Random position
        const distance = Math.random() * 30 + 10;
        const angle = Math.random() * Math.PI * 2;
        
        cloud.position.set(
            Math.cos(angle) * distance,
            (Math.random() - 0.5) * 30,
            Math.sin(angle) * distance
        );
        
        cloud.rotation.x = Math.random() * Math.PI;
        cloud.rotation.y = Math.random() * Math.PI;
        cloud.rotation.z = Math.random() * Math.PI;
        
        // Store animation data
        cloud.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.001,
                y: (Math.random() - 0.5) * 0.001,
                z: (Math.random() - 0.5) * 0.001
            },
            floatSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        };
        
        clouds.push(cloud);
        scene.add(cloud);
    }
    
    return clouds;
};

const galaxy = generateGalaxy();
const nebulaClouds = createNebulaClouds();
createPlanet();

camera.position.z = 75;
camera.position.y = 30;
camera.lookAt(0, 0, 0);

// Add soft ambient light
const ambientLight = new THREE.AmbientLight(0x7744ff, 0.5);
scene.add(ambientLight);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = Date.now() * 0.001;
    
    // Update galaxy uniforms
    galaxy.material.uniforms.uTime.value = elapsedTime;
    
    // Animate nebula clouds
    nebulaClouds.forEach(cloud => {
        // Rotation
        cloud.rotation.x += cloud.userData.rotationSpeed.x;
        cloud.rotation.y += cloud.userData.rotationSpeed.y;
        cloud.rotation.z += cloud.userData.rotationSpeed.z;
        
        // Floating movement
        cloud.position.x += Math.sin(elapsedTime * 0.2) * cloud.userData.floatSpeed.x;
        cloud.position.y += Math.cos(elapsedTime * 0.3) * cloud.userData.floatSpeed.y;
        cloud.position.z += Math.sin(elapsedTime * 0.4) * cloud.userData.floatSpeed.z;
    });
    
    // Slight camera movement
    camera.position.x = Math.sin(elapsedTime * 0.1) * 5;
    camera.position.z = 75 + Math.cos(elapsedTime * 0.1) * 5;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// Resize event handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});