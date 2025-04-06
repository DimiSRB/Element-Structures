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

// -------------------------------------------------------------------------
// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 20); // Move higher and further back

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Increase intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Stronger light
directionalLight.position.set(5, 10, 5); // Position light better
directionalLight.castShadow = true; // Enable shadows if needed
scene.add(directionalLight);


// Load the GLTF model
const loader = new THREE.GLTFLoader();
loader.load('models/hydrogen.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1); // Scale model
    model.position.set(0, 0, 0); // Ensure it's at the origin
    scene.add(model);
}, undefined, function (error) {
    console.error("Error loading model:", error);
});

// Add OrbitControls for interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Adjust the canvas size when resizing the window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});



