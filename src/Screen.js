import {
  createStaticTexture,
  createLogoTexture,
  createMissionDataTexture,
  createMenuItemTexture
} from './textures.js';
  
  import * as THREE from 'three';

  export class Screen {
    /**
     * Creates a CRT-style screen that can be added to a TV or other object.
     * @param {Object} options - Options for the screen.
     * @param {number} options.width - The width of the screen.
     * @param {number} options.height - The height of the screen.
     * @param {string} options.contentType - Which texture to display ("static", "black-ops-logo", "mission-data", "menu", "custom").
     * @param {THREE.Texture} [options.customTexture] - Custom texture to use when contentType is "custom".
     * @param {Object} [options.menuConfig] - Configuration for menu items when contentType is "menu".
     * @param {number} [options.emissiveIntensity=0.1] - Intensity of the emissive glow.
     * @param {number} [options.emissiveColor] - Color for the emissive glow (defaults based on contentType).
     * @param {boolean} [options.addGlass=false] - Whether to add a glass overlay.
     */
    constructor(options) {
      this.options = options;
      this.meshes = {};
      this.createScreen();
    }
  
    createScreen() {
      const { width, height, contentType } = this.options;
      
      // Create the screen plane with a glowing, emissive material
      const screenGeom = new THREE.PlaneGeometry(width, height);
      
      // Determine texture and emissive properties based on content type
      let screenTexture;
      let emissiveColor = this.options.emissiveColor || 0xeeeeee;
      let emissiveIntensity = this.options.emissiveIntensity || 0.1;
      
      switch (contentType) {
        case 'static':
          screenTexture = createStaticTexture();
          emissiveColor = this.options.emissiveColor || 0xaaaaaa;
          break;
        case 'black-ops-logo':
          screenTexture = createLogoTexture();
          emissiveColor = this.options.emissiveColor || 0xff0000;
          break;
        case 'mission-data':
          screenTexture = createMissionDataTexture();
          emissiveColor = this.options.emissiveColor || 0x00ff00;
          break;
        case 'custom':
          if (this.options.customTexture) {
            screenTexture = this.options.customTexture;
          } else {
            screenTexture = createStaticTexture(); // Fallback
          }
          break;
        default:
          screenTexture = createStaticTexture();
      }
      
      const screenMat = new THREE.MeshStandardMaterial({
        map: screenTexture,
        color: 0x111111,
        emissive: emissiveColor,
        emissiveIntensity: emissiveIntensity,
      });
      
      this.meshes.screen = new THREE.Mesh(screenGeom, screenMat);
      
      // Add glass overlay if requested
      if (this.options.addGlass) {
        const glassGeom = new THREE.PlaneGeometry(width * 1.02, height * 1.02);
        const glassMat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.1,
          specular: 0x111111,
          shininess: 5,
        });
        this.meshes.glass = new THREE.Mesh(glassGeom, glassMat);
        // Position the glass slightly in front of the screen
        this.meshes.glass.position.z = 0.01;
      }
  
      // If it's a menu screen, add menu items
      if (contentType === 'menu' && this.options.menuConfig) {
        this.addMenuItems();
      }
    }
  
    /**
     * Add menu items to the screen if it's a menu screen
     */
    addMenuItems() {
      if (!this.options.menuConfig || !this.options.menuConfig.items) {
        return;
      }
  
      const { menuConfig, width } = this.options;
      this.meshes.menuItems = [];
  
      menuConfig.items.forEach((item, index) => {
        const itemGeometry = new THREE.PlaneGeometry(width * 0.85, 0.2);
        // Import createMenuItemTexture from textures.js if needed
        const itemTexture = createMenuItemTexture(item.label, false);
        const itemMaterial = new THREE.MeshBasicMaterial({
          map: itemTexture,
          transparent: true,
        });
        const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
        
        // Position menu items vertically based on index
        itemMesh.position.set(0, 0.6 - index * 0.25, 0.02);
        itemMesh.userData = { menuItem: item.id, label: item.label, link: item.link };
        
        // Add to screen
        this.meshes.screen.add(itemMesh);
        this.meshes.menuItems.push(itemMesh);
      });
    }
  
    /**
     * Update screen content
     * @param {string} contentType - Type of content to display
     * @param {THREE.Texture} [customTexture] - Custom texture to use if contentType is "custom"
     */
    updateContent(contentType, customTexture = null) {
      let screenTexture;
      let emissiveColor = this.options.emissiveColor || 0xeeeeee;
      
      switch (contentType) {
        case 'static':
          screenTexture = createStaticTexture();
          emissiveColor = 0xaaaaaa;
          break;
        case 'black-ops-logo':
          screenTexture = createLogoTexture();
          emissiveColor = 0xff0000;
          break;
        case 'mission-data':
          screenTexture = createMissionDataTexture();
          emissiveColor = 0x00ff00;
          break;
        case 'custom':
          if (customTexture) {
            screenTexture = customTexture;
          } else {
            screenTexture = createStaticTexture(); // Fallback
          }
          break;
        default:
          screenTexture = createStaticTexture();
      }
      
      this.meshes.screen.material.map = screenTexture;
      this.meshes.screen.material.emissive = new THREE.Color(emissiveColor);
      this.meshes.screen.material.needsUpdate = true;
    }
  
    /**
     * Highlight a menu item
     * @param {number} index - Index of the menu item to highlight
     */
    highlightMenuItem(index) {
      if (!this.meshes.menuItems || !this.meshes.menuItems[index]) {
        return;
      }
      
      const item = this.meshes.menuItems[index];
      item.material.map = createMenuItemTexture(item.userData.label, true);
      item.material.needsUpdate = true;
    }
  
    /**
     * Reset all menu items to unhighlighted state
     */
    resetMenuItems() {
      if (!this.meshes.menuItems) {
        return;
      }
      
      this.meshes.menuItems.forEach(item => {
        item.material.map = createMenuItemTexture(item.userData.label, false);
        item.material.needsUpdate = true;
      });
    }
  
    /**
     * Get all the meshes associated with this screen
     * @returns {Object} All meshes (screen, glass, etc.)
     */
    getMeshes() {
      return this.meshes;
    }
  
    /**
     * Get screen mesh
     * @returns {THREE.Mesh} The screen mesh
     */
    getScreenMesh() {
      return this.meshes.screen;
    }
  
    /**
     * Get menu items
     * @returns {Array<THREE.Mesh>} Array of menu item meshes
     */
    getMenuItems() {
      return this.meshes.menuItems || [];
    }
  
    /**
     * Add a flickering or static animation to the screen
     * @param {number} intensity - Animation intensity (0-1)
     */
    addNoise(intensity = 0.1) {
      if (!this.noiseInterval) {
        this.noiseInterval = setInterval(() => {
          // Only add noise if the screen is showing static
          if (this.options.contentType === 'static') {
            this.meshes.screen.material.map = createStaticTexture();
            this.meshes.screen.material.needsUpdate = true;
          }
        }, 100);
      }
    }
  
    /**
     * Stop any screen animations
     */
    stopAnimations() {
      if (this.noiseInterval) {
        clearInterval(this.noiseInterval);
        this.noiseInterval = null;
      }
    }
  }