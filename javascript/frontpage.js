//---------------------------------------------------------------------

document.addEventListener("wheel", (event) => {
    event.preventDefault();
    document.querySelector('.container').scrollBy({
        top: event.deltaY,
        behavior: 'smooth'
    });
}, { passive: false });

// Molecule Simulation
const canvas = document.getElementById('moleculeCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const molecules = [];
const maxMolecules = 100;

// Molecule class
class Molecule {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = 'rgba(255, 255, 255, 0.8)';
        this.alpha = Math.random() * 0.5 + 0.5; // Random opacity
        this.speedX = Math.random() * 2 - 1; // Random speed X
        this.speedY = Math.random() * 2 - 1; // Random speed Y
    }

    // Move molecule
    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary collision logic
        if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
    }

    // Draw molecule
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Randomize appearance
    randomize() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2; // Random size between 2 and 5
        this.alpha = Math.random() * 0.5 + 0.5;
    }
}

// Create random molecules
for (let i = 0; i < maxMolecules; i++) {
    molecules.push(new Molecule(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 2));
}

// Draw connections between molecules
function drawConnections() {
    for (let i = 0; i < molecules.length; i++) {
        for (let j = i + 1; j < molecules.length; j++) {
            const dx = molecules[i].x - molecules[j].x;
            const dy = molecules[i].y - molecules[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only connect molecules that are within a certain distance
            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.6; // Gradually fade out with distance
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(molecules[i].x, molecules[i].y);
                ctx.lineTo(molecules[j].x, molecules[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Move and draw each molecule
    for (let i = 0; i < molecules.length; i++) {
        molecules[i].move();
        molecules[i].draw();
    }

    // Draw connections between molecules
    drawConnections();

    requestAnimationFrame(animate); // Recursively call animate to create the animation
}

// Resize the canvas when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start the animation
animate();

// MOUSE ANIMATION----------------------------------------------------------------------------------------
console.clear();

// Select the circle element
const circleElement = document.querySelector('.circle');

// Create objects to track mouse position and custom cursor position
const mouse = { x: 0, y: 0 }; // Track current mouse position
const previousMouse = { x: 0, y: 0 } // Store the previous mouse position
const circle = { x: 0, y: 0 }; // Track the circle position

// Initialize variables to track scaling and rotation
let currentScale = 0; // Track current scale value
let currentAngle = 0; // Track current angle value

// Update mouse position on the 'mousemove' event
window.addEventListener('mousemove', (e) => {
mouse.x = e.x;
mouse.y = e.y;
});

// Smoothing factor for cursor movement speed (0 = smoother, 1 = instant)
const speed = 0.17;

// Start animation
const tick = () => {
// MOVE
// Calculate circle movement based on mouse position and smoothing
circle.x += (mouse.x - circle.x) * speed;
circle.y += (mouse.y - circle.y) * speed;
// Create a transformation string for cursor translation
const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

// SQUEEZE
// 1. Calculate the change in mouse position (deltaMouse)
const deltaMouseX = mouse.x - previousMouse.x;
const deltaMouseY = mouse.y - previousMouse.y;
// Update previous mouse position for the next frame
previousMouse.x = mouse.x;
previousMouse.y = mouse.y;
// 2. Calculate mouse velocity using Pythagorean theorem and adjust speed
const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150); 
// 3. Convert mouse velocity to a value in the range [0, 0.5]
const scaleValue = (mouseVelocity / 150) * 0.5;
// 4. Smoothly update the current scale
currentScale += (scaleValue - currentScale) * speed;
// 5. Create a transformation string for scaling
const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

// ROTATE
// 1. Calculate the angle using the atan2 function
const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
// 2. Check for a threshold to reduce shakiness at low mouse velocity
if (mouseVelocity > 20) {
    currentAngle = angle;
}
// 3. Create a transformation string for rotation
const rotateTransform = `rotate(${currentAngle}deg)`;

// Apply all transformations to the circle element in a specific order: translate -> rotate -> scale
circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

// Request the next frame to continue the animation
window.requestAnimationFrame(tick);
}

// Start the animation loop
tick();
// MOUSE ANIMATION----------------------------------------------------------------------------------------

// newpagejs.js
document.getElementById("startBtn").addEventListener("click", function() {
    window.location.href = "hydrogen.html";  // Redirect to the next page
});



