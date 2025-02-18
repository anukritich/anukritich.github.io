import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Galaxy parameters
const numStars = 10000; // Number of stars in the galaxy
const galaxyRadius = 800; // The radius of the galaxy
const spiralDensity = 0.5; // Density of stars in the spiral arm

// Geometry and material for stars
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(numStars * 3);
const colors = new Float32Array(numStars * 3); // Array to store color data
const sizes = new Float32Array(numStars); // Array to store size data for stars

// Function to generate a very light sapphire blue or white color
function randomColor() {
    // Randomly choose white or a very light sapphire blue color
    if (Math.random() > 0.5) {
        // Return white
        return new THREE.Color(1, 1, 1);
    } else {
        // Return a very light sapphire blue color (RGB: r=0, g=0, b=0.7)
        return new THREE.Color(0, 0, 0.7); // Adjust blue to create light sapphire blue
    }
}

// Function to calculate size based on distance from center
function getStarSize(radius) {
    // Make stars bigger toward the center (smaller in outer space)
    return 1 + (1 - radius / galaxyRadius) * 3; // Larger stars near center, smaller at edges
}

// Create stars with more randomness in position and color
for (let i = 0; i < numStars; i++) {
    const angle = Math.random() * Math.PI * 2; // Random angle for the star
    
    // Uniform random distribution for the radius (no heavy concentration near center)
    const radius = Math.random() * galaxyRadius; // Uniformly distribute stars within the galaxy's radius
    const z = (Math.random() - 0.5) * 2 * galaxyRadius; // Random height (z-axis)

    // Use randomness to make the spiral more scattered
    const x = radius * Math.cos(angle + Math.random() * spiralDensity);
    const y = radius * Math.sin(angle + Math.random() * spiralDensity);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Assign random color to each star (white or very light sapphire blue)
    const color = randomColor();
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Calculate star size based on its radius from the center
    sizes[i] = getStarSize(radius);
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// Material for the stars (using vertex colors for custom star colors)
const material = new THREE.PointsMaterial({
    vertexColors: true, // Enable vertex colors for each star
    sizeAttenuation: true, // Allows size to adjust based on the distance from the camera
    transparent: true,
    opacity: 0.8
});

// Create points (stars) in the galaxy
const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Camera positioning
camera.position.z = 1000;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the galaxy for better visual effect
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0001;

    // Render the scene
    renderer.render(scene, camera);
}

animate();
