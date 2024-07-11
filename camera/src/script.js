import "./style.css";
import "./style1.css";
import * as THREE from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45, // View
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1, // Near
    1000 // Far
);

// Initial position
camera.position.set(-4.9, 4.4, 1.9);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Pointer Lock Controls
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Event listeners for pointer lock
canvas.addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    console.log('Pointer locked');
});

controls.addEventListener('unlock', () => {
    console.log('Pointer unlocked');
});

// Movement parameters
const moveSpeed = 0.1;
const moveDirection = new THREE.Vector3();
const keyState = {};

// Event listeners for keyboard
window.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});
window.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

// GLTF Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load("mod/swedish-royal/scene.gltf", (gltf)=>{
    const model = gltf.scene;
    scene.add(model);
});

// Update camera movement
const updateCameraMovement = () => {
    moveDirection.set(0, 0, 0);
    if (keyState['KeyW']) moveDirection.z -= moveSpeed;
    if (keyState['KeyS']) moveDirection.z += moveSpeed;
    if (keyState['KeyA']) moveDirection.x -= moveSpeed;
    if (keyState['KeyD']) moveDirection.x += moveSpeed;

    moveDirection.applyQuaternion(camera.quaternion);
    controls.getObject().position.add(moveDirection);
};

// Animation loop
const animate = () => {
    updateCameraMovement();
    renderer.render(scene, camera);
};

// Set animation loop
renderer.setAnimationLoop(animate);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
