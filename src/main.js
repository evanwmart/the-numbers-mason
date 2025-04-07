import { createScene, createCamera, createRenderer } from './scene.js';
import { createLighting } from './lighting.js';
import { createRoom } from './environment.js';
import { createMainMenuScreen, createSecondaryScreens, setupInteractivity } from './menu.js';

import * as THREE from 'three';

import { EffectComposer } from 'https://unpkg.com/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'https://unpkg.com/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';


// Global variables
let scene, camera, renderer, composer;
let targetRotationX = 0;
let windowHalfX = window.innerWidth / 2;
let rotationDamping = 0.05;

init();
animate();

function init() {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();
  document.body.appendChild(renderer.domElement);

  // Set up post-processing
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomParams = {
    threshold: 0.7,  // Try lowering this value to catch more bright areas
    strength: 2,   // Increase the strength for more glow
    radius: 1      // Adjust as needed for glow spread
  };

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    bloomParams.strength,
    bloomParams.radius,
    bloomParams.threshold
  );
  composer.addPass(bloomPass);

  // (noiseIntensity, scanlineIntensity, scanlineCount, grayscale)
  const filmPass = new FilmPass(0.15, 0.008, 648, false);
  composer.addPass(filmPass);

  createLighting(scene);
  createRoom(scene);

  const mainMenuTV = createMainMenuScreen(scene);
  createSecondaryScreens(scene);
  setupInteractivity(scene, camera, renderer, mainMenuTV);

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.5;

  // Setup camera controls based on cursor position
  setupCameraControls();

  // Handle window resize
  window.addEventListener('resize', onWindowResize);

  // Optional: initial camera animation (reset rotation)
  animateCamera();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  windowHalfX = window.innerWidth / 2;
}

function animate() {
  requestAnimationFrame(animate);

  // Smoothly update horizontal rotation
  camera.rotation.y += (targetRotationX - camera.rotation.y) * rotationDamping;

  // Clamp horizontal rotation so you can't look behind (restrict to ±10°)
  const rotationLimit = Math.PI / 18; // 10° in radians
  camera.rotation.y = Math.max(-rotationLimit, Math.min(rotationLimit, camera.rotation.y));

  TWEEN.update();
  composer.render(scene, camera);
}

function animateCamera() {
  // Set initial camera position and rotation (with a pitch of 0.5 radians)
  camera.position.set(0, 1.2, 3.5);
  camera.rotation.set(0.2, 0, 0);
  
  // Animate the position to (0, 1.2, 3)
  new TWEEN.Tween(camera.position)
    .to({ x: 0, y: 1.2, z: 3 }, 4000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
  
  // Animate the rotation to zero (no rotation)
  new TWEEN.Tween(camera.rotation)
    .to({ x: 0, y: 0, z: 0 }, 4000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}


function setupCameraControls() {
  // Listen for mouse move events and update target horizontal rotation based on cursor position
  document.addEventListener('mousemove', (event) => {
    // Normalize the mouse x position: center = 0, left = -1, right = 1
    const normalizedX = (event.clientX - windowHalfX) / windowHalfX;
    const horizontalLimit = Math.PI / 18; // 10° limit
    // Flip the direction if needed (multiply by -1 to invert)
    targetRotationX = -normalizedX * horizontalLimit;
  });
}
