import * as THREE from 'three';


document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded, initializing Three.js...");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("loading-canvas"), alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); // Attach to body

    // Create a ball (sphere)
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
    const ball = new THREE.Mesh(geometry, material);
    ball.scale.set(0.5, 0.5, 0.5);
    scene.add(ball);

    camera.position.z = 3;

    // Ball physics
    let positionY = 2;
    let velocity = 0;
    let gravity = -0.005;
    let bounceFactor = 0.7;

    function animate() {
        requestAnimationFrame(animate);

        velocity += gravity;
        positionY += velocity;

        if (positionY <= -1) {
            positionY = -1;
            velocity *= -bounceFactor;
        }

        ball.position.y = positionY;

        renderer.render(scene, camera);
    }
    animate();

    setTimeout(() => {
        console.log("Hiding loading screen...");
        const loadingScreen = document.getElementById("loading-screen");
        const canvas = document.getElementById("loading-canvas");
    
        if (loadingScreen) {
            loadingScreen.style.opacity = "100";
            console.log("🔴 Fading out loading screen...");
    
            setTimeout(() => {
                loadingScreen.remove(); // 🚀 Remove loading screen from DOM
                console.log("✅ Loading screen removed.");
    
                if (canvas) {
                    console.log("🟠 Hiding canvas...");
                    canvas.style.display = "none"; // 🔥 Hide Three.js canvas AFTER loading
                }
    
                console.log("🚀 Initializing Sidebar...");
                initSidebar(); // 🔥 Now call the function AFTER loading
            }, 500); // Match CSS transition time
        }
    }, 2000);
    
    
});

