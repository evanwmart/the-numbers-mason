import * as THREE from 'three';

export function createLighting(scene) {
  // Increase ambient light intensity for a brighter overall scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Increase hemisphere light intensity
  const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x333333, 0.5);
  scene.add(hemiLight);

  // Increase directional light intensity
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Increase spotlight intensity if needed
  const spotLight = new THREE.SpotLight(0xaaaaff, 8);
  spotLight.position.set(0, 6, 3);
  spotLight.angle = Math.PI / 10;
  spotLight.penumbra = 0.3;
  spotLight.decay = 1;
  spotLight.distance = 20;
  spotLight.castShadow = true;
  spotLight.target.position.set(0, 3, 3);
  scene.add(spotLight);
  scene.add(spotLight.target);

  // Additional point lights (if needed)
  for (let i = 0; i < 4; i++) {
    const light = new THREE.PointLight(0xffffff, 1.2, 8, 2);
    light.position.set(
      (Math.random() - 0.5) * 5,
      1 + Math.random() * 3,
      (Math.random() - 0.5) * 2 - 2
    );
    scene.add(light);
  }
}
