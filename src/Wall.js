import { createNoiseTexture } from "./textures.js";
import * as THREE from 'three';

export class Wall {
  /**
   * Create a wall.
   * @param {THREE.Scene} scene - The scene to add the wall to.
   * @param {Object} options - Options for the wall.
   * @param {number} options.width - The width of the wall.
   * @param {number} options.height - The height of the wall.
   * @param {THREE.Vector3} options.position - The wall's position.
   * @param {THREE.Euler} options.rotation - The wall's rotation.
   * @param {string} [options.textureUrl] - Optional URL for a JPEG/PNG texture.
   * @param {number} [options.color=0x111111] - Base color if no texture is provided.
   * @param {number} [options.emissive] - Optional emissive color.
   * @param {number} [options.roughness=0.7] - Material roughness.
   * @param {number} [options.metalness=0.2] - Material metalness.
   */
  constructor(scene, {
    width,
    height,
    position,
    rotation,
    textureUrl = null,
    color = 0x111111,
    emissive, // no default value here
    roughness = 0.7,
    metalness = 0.2
  } = {}) {
    // Create plane geometry for the wall.
    this.geometry = new THREE.PlaneGeometry(width, height);

    // Define material options.
    const materialOptions = {
      color,
      roughness,
      metalness
    };

    // Add emissive only if provided.
    if (emissive !== undefined) {
      materialOptions.emissive = emissive;
    }

    // If a texture URL is provided, load that texture.
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      materialOptions.map = loader.load(textureUrl);
    } else {
      // Otherwise, use a noise texture as fallback.
      materialOptions.map = createNoiseTexture(256, 256, [0x222222, 0x333333]);
    }

    this.material = new THREE.MeshStandardMaterial(materialOptions);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    if (position) {
      this.mesh.position.copy(position);
    }
    if (rotation) {
      this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    }
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);
  }
}
