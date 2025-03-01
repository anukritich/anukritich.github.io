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
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Set up scene
const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const loader = new SVGLoader();
const stars = [];
const starCount = 200; // Dense starfield

loader.load('/assets/models/star.svg', (data) => {
    const paths = data.paths;

    paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {
            const extrudeSettings = { depth: 0.003, bevelEnabled: false };
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 1 
            });

            for (let i = 0; i < starCount; i++) {
                const star = new THREE.Mesh(geometry, material);

                // Random position in 3D space
                const radius = Math.random() * 300 + 100; // Set revolution radius
                const angle = Math.random() * Math.PI * 2; // Random start angle
                star.userData.orbitRadius = radius;
                star.userData.orbitAngle = angle;
                star.userData.orbitSpeed = (Math.random() - 0.5) * 0.0005; // Small revolution speed

                star.position.set(
                    radius * Math.cos(angle),
                    (Math.random() - 0.5) * 300, // Random Y height
                    radius * Math.sin(angle)
                );

                // Random rotation
                star.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );

                // Small star size
                const scale = Math.random() * 0.007 + 0.005;
                star.scale.set(scale, scale, scale);

                // Store movement speed & direction
                star.userData.blinkSpeed = Math.random() * 0.02 + 0.01;
                star.userData.moveSpeed = {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.005
                };

                // Rotation speed
                star.userData.rotationSpeed = {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                };

                scene.add(star);
                stars.push(star);
            }
        });
    });

    animate(); // Start animation after loading stars
});

camera.position.z = 200; // Adjusted for a full view

// Animation loop for blinking, moving, rotating & revolving
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.005;
    stars.forEach((star) => {
        // Blinking effect
        const blinkFactor = (Math.sin(time * star.userData.blinkSpeed) + 1) / 2 * 0.8 + 0.2;
        star.material.opacity = blinkFactor;

        // Smooth floating movement
        star.position.x += star.userData.moveSpeed.x;
        star.position.y += star.userData.moveSpeed.y;
        star.position.z += star.userData.moveSpeed.z;

        // Rotate stars
        star.rotation.x += star.userData.rotationSpeed.x;
        star.rotation.y += star.userData.rotationSpeed.y;
        star.rotation.z += star.userData.rotationSpeed.z;

        // Make stars revolve around the center
        star.userData.orbitAngle += star.userData.orbitSpeed;
        star.position.x = star.userData.orbitRadius * Math.cos(star.userData.orbitAngle);
        star.position.z = star.userData.orbitRadius * Math.sin(star.userData.orbitAngle);

        // Keep stars within bounds
        if (Math.abs(star.position.y) > 300) star.position.y *= -1;
    });

    renderer.render(scene, camera);
}

// Resize event handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
