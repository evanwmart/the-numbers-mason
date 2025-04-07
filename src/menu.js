import { CRTTV } from './CCRTV.js';
import * as THREE from 'three';
import { createMenuItemTexture } from './textures.js';

export const clickableScreens = [];

// Menu configuration for the main TV
const menuItems = [
  { id: 'campaign', label: 'CAMPAIGN' },
  { id: 'multiplayer', label: 'MULTIPLAYER' },
  { id: 'zombies', label: 'ZOMBIES' },
  { id: 'github', label: 'GITHUB', link: 'https://github.com/evanwmart' }
];

// Create the main menu screen (CRT-style TV) using the CRTTV class
export function createMainMenuScreen(scene) {
  const options = {
    type: 'main', // "main" TVs don't add the extra glass overlay
    position: new THREE.Vector3(-4, 0.8, -3),
    rotation: new THREE.Euler(0, 0.6, 0),
    tvWidth: 3,
    tvHeight: 2.3,
    tvDepth: 1.8,
    screenContent: 'menu', // Use 'menu' type for the screen
    screenLightColor: 0xaaaaaa,
    screenLightIntensity: 0.4,
    menuConfig: {
      items: menuItems
    }
  };

  const mainTV = new CRTTV(scene, options);
  
  // Add the menu items to the clickable screens array for interactivity
  const menuItemsMeshes = mainTV.getMenuItems();
  if (menuItemsMeshes && menuItemsMeshes.length) {
    menuItemsMeshes.forEach(mesh => {
      clickableScreens.push(mesh);
    });
  }
  
  return mainTV;
}

// Configuration for secondary TVs (vintage CRT monitors)
const secondaryOptions = [
  {
    type: 'secondary',
    position: new THREE.Vector3(1.8, 1.75, -3.5),
    rotation: new THREE.Euler(0, -0.15, 0),
    tvWidth: 0.8 + 0.3,
    tvHeight: 0.6 + 0.3,
    tvDepth: 1.0,
    screenContent: 'static'
  },
  {
    type: 'secondary',
    position: new THREE.Vector3(1.5, 0.5, -3.5),
    rotation: new THREE.Euler(0, -0.15, 0),
    tvWidth: 1.5 + 0.3,
    tvHeight: 1 + 0.3,
    tvDepth: 1.0,
    screenContent: 'custom',
    screenTextureUrl: 'src/assets/desktop.png', // URL of your JPEG file
    screenLightColor: 0x000000,
    screenLightIntensity: 0.001,
  },
  {
    type: 'secondary',
    position: new THREE.Vector3(3.4, 1.96, -2.5),
    rotation: new THREE.Euler(0, -0.9, 0),
    tvWidth: 1.5 + 0.3,
    tvHeight: 1 + 0.3,
    tvDepth: 1.0,
    screenContent: 'static'
  },
  {
    type: 'secondary',
    position: new THREE.Vector3(3.4, 0.5, -2.5),
    rotation: new THREE.Euler(0, -0.9, 0),
    tvWidth: 1.5 + 0.3,
    tvHeight: 1 + 0.3,
    tvDepth: 1.0,
    screenContent: 'custom',
    screenTextureUrl: 'src/assets/arch.png', // URL of your JPEG file
    screenLightColor: 0x010101,
    screenLightIntensity: 0.005,
  },
  {
    type: 'secondary',
    position: new THREE.Vector3(4.6, 0.5, -0.8),
    rotation: new THREE.Euler(0, -1.2, 0),
    tvWidth: 1.5 + 0.3,
    tvHeight: 1 + 0.3,
    tvDepth: 1.0,
    screenContent: 'static'
  }
];

export function createSecondaryScreens(scene) {
  const tvs = [];
  secondaryOptions.forEach(options => {
    tvs.push(new CRTTV(scene, options));
  });
  return tvs;
}

export function setupInteractivity(scene, camera, renderer, mainMenuTV) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableScreens);

    // Reset menu item visuals if applicable
    if (mainMenuTV) {
      mainMenuTV.resetMenuItems();
    } else {
      clickableScreens.forEach((screen) => {
        if (screen.userData.menuItem) {
          screen.material.map = createMenuItemTexture(screen.userData.label, false);
          screen.material.needsUpdate = true;
        }
      });
    }

    // Highlight hovered menu item (visual feedback only)
    if (intersects.length > 0) {
      const hoveredItem = intersects[0].object;
      if (hoveredItem.userData.menuItem) {
        hoveredItem.material.map = createMenuItemTexture(hoveredItem.userData.label, true);
        hoveredItem.material.needsUpdate = true;
        
        document.getElementById('menu-description').style.opacity = '1';
        document.getElementById('selected-item').textContent = hoveredItem.userData.label;
      }
    } else {
      document.getElementById('menu-description').style.opacity = '0';
    }
  });

  window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableScreens);
    if (intersects.length > 0) {
      const selectedItem = intersects[0].object;
      if (selectedItem.userData.menuItem) {
        const menuItem = selectedItem.userData.menuItem;
        console.log('Selected menu item:', menuItem);
        playMenuSound('select');
        // If a link is embedded, open it in a new tab
        if (selectedItem.userData.link) {
          window.location.href = selectedItem.userData.link;
          console.log("Hit: ", selectedItem.userData.link);
        }
      }
    }
  });

  // Helper function for menu sounds
  function playMenuSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    if (type === 'select') {
      oscillator.type = 'sine';
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }
}
