import { contact } from './model.js';

// Initialize the dog model scene
contact();

// EmailJS initialization
emailjs.init('8zyGzzVV8yWtsPwJx'); // Replace with your Public Key

// Form submission handler
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form's default submission behavior

    // Collect form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Prepare the data for EmailJS
    const templateParams = {
        name: name,
        email: email,
        message: message,
    };

    // Send the email via EmailJS
    emailjs
        .send('service_p9ddpnh', 'template_29u5xyj', templateParams) // Replace with your IDs
        .then(
            function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Your message has been sent successfully!');
                document.getElementById('contact-form').reset(); // Clear the form after successful submission
            },
            function (error) {
                console.error('FAILED...', error);
                alert('Failed to send the message. Please try again later.');
            }
        );
});

// Listen for the 'barFull' event to unlock the form fields
window.addEventListener('barFull', function (event) {
    if (event.detail.isBarFull) {
        unlockFormFields(); // Unlock form fields when the bar is full
    }
});

function unlockFormFields() {
    const form = document.getElementById('contact-form');
    
    document.querySelectorAll('input, textarea').forEach(input => {
        if (input.disabled) {
            input.disabled = false; // Enable form fields
        }
    
        input.addEventListener('mouseover', () => {
            input.style.backgroundColor = '#F7E7CE';
            input.style.color = 'black';
            input.style.borderColor = 'black';
            input.style.transition = 'transform 0.3s'; // Smooth transition
            input.style.transform = 'scale(1.1)'; // Apply zoom effect
        });
    
        input.addEventListener('mouseout', () => {
            input.style.backgroundColor = '';
            input.style.color = '';
            input.style.borderColor = '';
            input.style.transform = 'scale(1)'; // Reset zoom on mouse out
        });
    });
    

    // Enable submit button if it's disabled
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn.disabled) {
        sendBtn.disabled = false; // Enable submit button

    }
}
