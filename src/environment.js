import { createNoiseTexture } from "./textures.js";
import { Wall } from "./Wall.js";
import { Screen } from "./Screen.js";

import * as THREE from 'three';

// Create the room with floor, walls, ceiling, and atmospheric details.
export function createRoom(scene) {
  // --- Floor ---
  const floorGeometry = new THREE.PlaneGeometry(30, 90); // Extended floor dimensions
  const floorTexture = createNoiseTexture(256, 256, [0x111111, 0x222222, 0x333333]);
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.9,
    metalness: 0.2,
    color: 0x080808,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -3, -5); // Moved back a bit
  floor.receiveShadow = true;
  scene.add(floor);

  const redLight = new THREE.PointLight(0xff0000, 10, 4);
  redLight.position.set(-5, 4.5, -19); // Position in front of the screen
  scene.add(redLight);

  const redLight2 = new THREE.PointLight(0xff0000, 8, 4);
  redLight2.position.set(-5, 1, -19); // Position in front of the screen
  scene.add(redLight2);

  // --- Walls ---

  // Back Hall
  new Wall(scene, {
    width: 20,
    height: 15,
    position: new THREE.Vector3(-5, 0, -20),
    rotation: new THREE.Euler(0, 0, 0),
    color: 0x040404,      // Darker base color instead of 0xffffff
    roughness: 0.9,       // Slightly smoother
    metalness: 0.6,      // Lower metalness to reduce shininess
    textureUrl: 'src/assets/hall-wall.jpg'
  });

  // Back Hall
  new Wall(scene, {
    width: 10,
    height: 5,
    position: new THREE.Vector3(-5, 2, -19),
    rotation: new THREE.Euler(0, 0, 0),
    color: 0x050505,      // Darker base color instead of 0xffffff
    roughness: 0.9,       // Slightly smoother
    metalness: 0.1,      // Lower metalness to reduce shininess
  });

  new Wall(scene, {
    width: 20,
    height: 15,
    position: new THREE.Vector3(9, 0, -15),
    rotation: new THREE.Euler(0, 0, 0),
    color: 0x020202,      // Darker base color instead of 0xffffff
    roughness: 0.9,       // Slightly smoother
    metalness: 0,      // Lower metalness to reduce shininess
    textureUrl: 'src/assets/back-wall.jpg'
  });

  new Wall(scene, {
    width: 20,
    height: 15,
    position: new THREE.Vector3(-15, 0, -15),
    rotation: new THREE.Euler(0, 0, 0),
    color: 0x030303,      // Darker base color instead of 0xffffff
    roughness: 0.9,       // Slightly smoother
    metalness: 0,      // Lower metalness to reduce shininess
    textureUrl: 'src/assets/back-wall.jpg'
  });

  // add big blue screen to back wall here
  const screen = new Screen({
    width: 10,
    height: 3,
    contentType: "mission-data",
    customTexture: null,
    emissiveColor: 0xaaaaff, // Blue color
    emissiveIntensity: 0.9,
    addGlass: false,
    menuConfig: null
  });

  // Get the screen meshes and position them on the back wall
  const screenMeshes = screen.getMeshes();

  screenMeshes.screen.position.set(5, 5, -14.9); // Just in front of the back wall at z=-15

  // Add a point light specifically for the screen
  const screenLight = new THREE.PointLight(0x90fcf5, 1, 20);
  screenLight.position.set(0, 1, -13); // Position in front of the screen
  scene.add(screenLight);

  // Add the meshes to the scene
  scene.add(screenMeshes.screen);

  // Add second blue screen to the back wall
  const screen2 = new Screen({
    width: 1,                // Adjust width as needed
    height: 1,               // Adjust height as needed
    contentType: "mission-data",
    customTexture: null,
    emissiveColor: 0xffffff,  // Blue color (you can tweak this)
    emissiveIntensity: 1.0,  // Increase intensity for extra brightness
    addGlass: false,
    menuConfig: null
  });

  // Get the second screen's meshes
  const screen2Meshes = screen2.getMeshes();

  // Position the second screen (change coordinates to suit your layout)
  screen2Meshes.screen.position.set(-3, 6.8, -4); 
  screen2Meshes.screen.rotation.set(Math.PI/2, 0, 0);

  // Finally, add the second screen mesh to the scene
  scene.add(screen2Meshes.screen);


  // Left wall
  new Wall(scene, {
    width: 30,
    height: 15,
    position: new THREE.Vector3(-15, 0, -5),
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    color: 0x111111,
  });

  // Right wall
  new Wall(scene, {
    width: 30,
    height: 15,
    position: new THREE.Vector3(15, 0, -5),
    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    color: 0x111111,
  });

  // --- Ceiling ---
  const ceilingGeometry = new THREE.PlaneGeometry(30, 30);
  const wallTexture = createNoiseTexture(256, 256, [0x222222, 0x333333]);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 1,
    metalness: 0,
    color: 0x050505,
  });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 7, -5);
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Add room details (cables, equipment, etc.)
  addRoomDetails(scene);
  addDustParticles(scene);
}

// Add dust particles to create an atmospheric effect.
function addDustParticles(scene) {
  const particleCount = 80;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = Math.random() * 7 - 2;
    positions[i + 2] = (Math.random() - 0.5) * 10 - 1;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x222222,
    size: 0.01,
    transparent: true,
    opacity: 0.7,
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  function animateParticles() {
    const positions = particles.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.003; // Slowly falling dust
      // Reset particles that fall below the floor
      if (positions[i + 1] < -3) {
        positions[i + 1] = 4;
      }
    }
    particles.attributes.position.needsUpdate = true;
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ------------------
// Object constructors for room details
// ------------------

// Cable class creates a cable between given points.
class Cable {
  constructor(scene, start, control, end) {
    const curve = new THREE.CatmullRomCurve3([start, control, end]);
    const geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
    const material = new THREE.MeshStandardMaterial({
      color: 0x030202,
      roughness: 0.9,
      metalness: 0.1,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
  }
}

// EquipmentPanel creates a wall-mounted equipment panel.
class EquipmentPanel {
  constructor(scene, position, rotation, dimensions) {
    const geometry = new THREE.BoxGeometry(
      dimensions.width,
      dimensions.height,
      dimensions.depth
    );
    const material = new THREE.MeshStandardMaterial({
      color: 0x060607,
      roughness: 0.6,
      metalness: 0.4,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotation;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);
  }
}

// FloorEquipment creates equipment placed on the floor.
class FloorEquipment {
  constructor(scene, position, size, rotation) {
    const geometry = new THREE.BoxGeometry(size, size * 0.7, size * 0.9);
    const material = new THREE.MeshStandardMaterial({
      color: 0x070707,
      roughness: 0.7,
      metalness: 0.6,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotation;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);
  }
}

export function addRoomDetails(scene) {
  // Create cables with fixed positions.
  new Cable(
    scene,
    new THREE.Vector3(-1, -2.9, -15),
    new THREE.Vector3(2, -2.9, -7),
    new THREE.Vector3(-1, -2.9, 3)
  );

  new Cable(
    scene,
    new THREE.Vector3(-1, -2.9, -15),
    new THREE.Vector3(-3, -2.9, -11),
    new THREE.Vector3(6, -2.9, 5)
  );

  new Cable(
    scene,
    new THREE.Vector3(-1, -2.9, -15),
    new THREE.Vector3(0, -2.9, -8),
    new THREE.Vector3(-5, -2.9, 3)
  );

  new Cable(
    scene,
    new THREE.Vector3(-1, -2.9, -15),
    new THREE.Vector3(1, -2.9, -9),
    new THREE.Vector3(-3, -2.9, 2)
  );

  // Create wall-mounted equipment panels with fixed positions.
  new EquipmentPanel(
    scene,
    new THREE.Vector3(0, -1, -14),
    0, // rotation in radians
    { width: 1.5, height: 1, depth: 0.3 }
  );
  new EquipmentPanel(
    scene,
    new THREE.Vector3(-7, 4, -14),
    0,
    { width: 3, height: 2, depth: 0.8 }
  );

  // Create floor equipment with fixed values.
  new FloorEquipment(scene, new THREE.Vector3(-4, -1.4, -3), 2.8, 0.6);
  new FloorEquipment(scene, new THREE.Vector3(3, -2.2, -2), 3, Math.PI / 6);
}

// Equipment detail constructors for additional features

class EquipmentButton {
  constructor(equipment, position, size) {
    const geometry = new THREE.CylinderGeometry(size, size, 0.03, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.5,
      metalness: 0.1,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI / 2;
    this.mesh.position.copy(position);
    equipment.add(this.mesh);
  }
}

class EquipmentIndicator {
  constructor(equipment, position, size, color) {
    const geometry = new THREE.CircleGeometry(size, 16);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    equipment.add(this.mesh);
  }
}

export function addEquipmentDetails(equipment, width, height, depth) {
  new EquipmentButton(
    equipment,
    new THREE.Vector3(width * 0.2, height * 0.1, depth / 2 + 0.02),
    0.04
  );
  new EquipmentButton(
    equipment,
    new THREE.Vector3(-width * 0.2, height * 0.1, depth / 2 + 0.02),
    0.04
  );
  new EquipmentIndicator(
    equipment,
    new THREE.Vector3(0, -height * 0.3, depth / 2 + 0.01),
    0.02,
    0x00ff00
  );
}

