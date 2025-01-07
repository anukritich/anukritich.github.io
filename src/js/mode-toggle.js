let isLightOn = true; // Track the light state (on/off)

// Initialize the scene
export function init() {
    // Add a button to toggle light
    const button = document.getElementById('toggleButton');
    button.addEventListener('click', toggleLight);

}

// Toggle the light on/off and switch the button icon
function toggleLight() {
    isLightOn = !isLightOn;

    if (isLightOn) {
        document.getElementById('buttonImage').src = '/assets/images/sun.png'; // Show Sun icon
    } else {
        document.getElementById('buttonImage').src = '/assets/images/moon.png'; // Show Moon icon
    }
}