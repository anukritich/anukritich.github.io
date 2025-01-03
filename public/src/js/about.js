import { about } from './model.js';
export function home(){


// Call the about function to initialize the scene
about();

// Create the instruction text element
const instructionText = document.createElement('div');
instructionText.innerText = 'Scroll to explore';
instructionText.style.position = 'absolute';
instructionText.style.top = '20%'; // Center vertically
instructionText.style.left = '50%'; // Center horizontally
instructionText.style.transform = 'translate(-50%, -50%)'; // Adjust for perfect centering
instructionText.style.fontSize = '18px'; // Adjust font size
instructionText.style.color = 'black';
instructionText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)'; // Add text shadow for better readability
instructionText.style.fontFamily = 'Calibri, sans-serif'; // Ensure a clean font
document.body.appendChild(instructionText);

// Add an event listener to remove the instruction text on interaction
function removeInstruction() {
    if (instructionText) {
        instructionText.remove();
    }
    window.removeEventListener('wheel', removeInstruction);
    
}

// Listen for user interaction
window.addEventListener('wheel', removeInstruction);
}
