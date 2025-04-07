import { Screen } from './Screen.js';
import * as THREE from 'three';

export class CRTTV {
  /**
   * Creates a CRT-style TV.
   * @param {THREE.Scene} scene - The scene to add the TV to.
   * @param {Object} options - Options for the TV.
   * @param {string} options.type - "main" or "secondary". Secondary TVs get an extra glass overlay.
   * @param {THREE.Vector3} options.position - The TV's position.
   * @param {THREE.Euler} options.rotation - The TV's rotation.
   * @param {number} options.tvWidth - The width of the TV body.
   * @param {number} options.tvHeight - The height of the TV body.
   * @param {number} options.tvDepth - The depth of the TV body.
   * @param {string} options.screenContent - Which texture to display ("static", "black-ops-logo", "mission-data", "menu").
   * @param {string} [options.screenTextureUrl] - Optional URL for an external screen texture.
   * @param {number} [options.screenLightIntensity=0] - Intensity for a point light on the screen.
   * @param {number} [options.screenLightColor=0xffffff] - Color for the screen point light.
   * @param {Object} [options.menuConfig] - Configuration for menu screens.
   */
  constructor(scene, options) {
    this.scene = scene;
    this.options = options;
    this.createTV();
  }

  createTV() {
    const { tvWidth, tvHeight, tvDepth, position, rotation, screenContent } = this.options;
    
    // Create the TV body (casing)
    const bodyGeom = new THREE.BoxGeometry(tvWidth, tvHeight, tvDepth);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x010101,
      roughness: 1.0,
      metalness: 0.05,
    });
    this.body = new THREE.Mesh(bodyGeom, bodyMat);
    this.body.position.copy(position);
    if (rotation) this.body.rotation.copy(rotation);
    this.body.castShadow = true;
    this.scene.add(this.body);
    
    // Add bezels to simulate a CRT border
    this.addBezels(tvWidth, tvHeight, tvDepth);
    
    // Create the screen
    const screenWidth = tvWidth * 0.8;
    const screenHeight = tvHeight * 0.75;
    
    // Determine if we need custom texture
    let customTexture = null;
    if (this.options.screenTextureUrl) {
      const loader = new THREE.TextureLoader();
      customTexture = loader.load(this.options.screenTextureUrl);
    }
    
    // Determine emissive color based on screen content
    let emissiveColor;
    switch (screenContent) {
      case 'static': emissiveColor = 0xaaaaaa; break;
      case 'black-ops-logo': emissiveColor = 0xff0000; break;
      case 'mission-data': emissiveColor = 0x00ff00; break;
      default: emissiveColor = 0xeeeeee;
    }

    // Create screen with appropriate options
    this.screen = new Screen({
      width: screenWidth,
      height: screenHeight,
      contentType: screenContent === 'custom' ? 'custom' : screenContent,
      customTexture: customTexture,
      emissiveColor: this.options.screenLightColor || emissiveColor,
      emissiveIntensity: 0.1,
      addGlass: this.options.type === 'secondary',
      menuConfig: this.options.menuConfig
    });
    
    // Add screen meshes to the TV body
    const screenMeshes = this.screen.getMeshes();
    const screenMesh = screenMeshes.screen;
    screenMesh.position.z = tvDepth / 2 + 0.01;
    this.body.add(screenMesh);
    
    // Add glass overlay if it exists
    if (screenMeshes.glass) {
      screenMeshes.glass.position.z = tvDepth / 2 + 0.02;
      this.body.add(screenMeshes.glass);
    }
    
    // Add basic details (buttons, indicator lights)
    this.addDetails(tvWidth, tvHeight, tvDepth);
    
    // Add a screen light if parameters were provided
    if (this.options.screenLightColor !== undefined && this.options.screenLightIntensity !== undefined) {
      this.addScreenLight(this.options.screenLightColor, this.options.screenLightIntensity, tvDepth);
    }

    // If this is a static screen, add the noise effect
    if (screenContent === 'static') {
      this.screen.addNoise();
    }

    // Store menu items for interactivity
    this.menuItems = this.screen.getMenuItems();
  }
    
  addBezels(width, height, depth) {
    const bevelThickness = 0.02;
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.9,
      metalness: 0.1,
    });
    
    const topGeom = new THREE.BoxGeometry(width, bevelThickness, bevelThickness);
    const topBevel = new THREE.Mesh(topGeom, material);
    topBevel.position.set(0, height / 2 - bevelThickness / 2, depth / 2 - bevelThickness / 2);
    this.body.add(topBevel);
    
    const bottomBevel = new THREE.Mesh(topGeom, material);
    bottomBevel.position.set(0, -height / 2 + bevelThickness / 2, depth / 2 - bevelThickness / 2);
    this.body.add(bottomBevel);
    
    const sideGeom = new THREE.BoxGeometry(bevelThickness, height - bevelThickness * 2, bevelThickness);
    const leftBevel = new THREE.Mesh(sideGeom, material);
    leftBevel.position.set(-width / 2 + bevelThickness / 2, 0, depth / 2 - bevelThickness / 2);
    this.body.add(leftBevel);
    
    const rightBevel = new THREE.Mesh(sideGeom, material);
    rightBevel.position.set(width / 2 - bevelThickness / 2, 0, depth / 2 - bevelThickness / 2);
    this.body.add(rightBevel);
  }
    
  addDetails(width, height, depth) {
    const buttonGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16);
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.5,
      metalness: 0.1,
    });
    const button = new THREE.Mesh(buttonGeom, buttonMat);
    button.rotation.x = Math.PI / 2;
    button.position.set(width / 2 + 0.02, 0, 0);
    this.body.add(button);
    
    const lightGeom = new THREE.CircleGeometry(0.01, 16);
    const lightMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const indicator = new THREE.Mesh(lightGeom, lightMat);
    indicator.position.set(width * 0.45, -height * 0.45, 0.16);
    indicator.rotation.x = Math.PI / 2;
    this.body.add(indicator);
  }
    
  addScreenLight(color, intensity, tvDepth) {
    // Create a small point light near the screen to simulate the TV lighting the room
    const pointLight = new THREE.PointLight(color, intensity, 5);
    pointLight.position.set(0, 0, tvDepth / 2 + 0.05);
    this.body.add(pointLight);
  }

  /**
   * Update the TV's screen content
   * @param {string} contentType - Type of content to display
   * @param {THREE.Texture} [customTexture] - Custom texture if contentType is "custom"
   */
  updateScreen(contentType, customTexture = null) {
    this.screen.updateContent(contentType, customTexture);
    
    // Update screen light color if needed
    if (contentType === 'static') {
      this.updateScreenLight(0xaaaaaa);
    } else if (contentType === 'black-ops-logo') {
      this.updateScreenLight(0xff0000);
    } else if (contentType === 'mission-data') {
      this.updateScreenLight(0x00aa00);
    }
  }

  /**
   * Update the TV's screen light color/intensity
   * @param {number} color - Color for the screen light
   * @param {number} [intensity] - Intensity for the screen light
   */
  updateScreenLight(color, intensity = null) {
    if (!this.screenLight) return;
    
    this.screenLight.color.set(color);
    if (intensity !== null) {
      this.screenLight.intensity = intensity;
    }
  }

  /**
   * Get menu items
   * @returns {Array} Array of menu items
   */
  getMenuItems() {
    return this.menuItems || [];
  }

  /**
   * Highlight a menu item
   * @param {number} index - Index of the menu item to highlight
   */
  highlightMenuItem(index) {
    this.screen.highlightMenuItem(index);
  }

  /**
   * Reset all menu items to unhighlighted state
   */
  resetMenuItems() {
    this.screen.resetMenuItems();
  }

  /**
   * Clean up resources
   */
  dispose() {
    // Stop any animations
    this.screen.stopAnimations();
    
    // Remove meshes from scene if needed
    // For a more thorough cleanup you'd need to dispose geometries and materials
  }
}