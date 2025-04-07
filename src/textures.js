import * as THREE from 'three';

export function createNoiseTexture(width, height, colors) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const colorIndex = Math.floor(Math.random() * colors.length);
    const color = colors[colorIndex];
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    const noise = Math.random() * 0.3 + 0.85;
    data[i] = r * noise;
    data[i + 1] = g * noise;
    data[i + 2] = b * noise;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createMenuBackgroundTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Dark gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(1, '#111111');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle noise (scan lines)
  for (let y = 0; y < canvas.height; y += 2) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.02})`;
    ctx.fillRect(0, y, canvas.width, 1);
  }
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillStyle = `rgba(100, 100, 100, ${Math.random() * 0.05})`;
    ctx.fillRect(0, y, canvas.width, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createMenuItemTexture(text, isActive) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add background effect for active items
  if (isActive) {
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    bgGradient.addColorStop(0, 'rgba(150, 150, 150, 0.3)');
    bgGradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.2)');
    bgGradient.addColorStop(1, 'rgba(150, 150, 150, 0.1)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Add scan lines for a CRT effect
  for (let y = 0; y < canvas.height; y += 2) {
    ctx.fillStyle = `rgba(200, 200, 200, ${Math.random() * 0.05})`;
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  if (isActive) {
    // Apply glow effect for active items
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
  } else {
    ctx.fillStyle = '#aaaaaa';
  }
  ctx.fillText(text, 20, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createStaticTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Fill with dark background
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  // Generate static with a motion-blur-like effect
  for (let y = 0; y < canvas.height; y++) {
    const noiseAmount = Math.random() * 0.7 + 0.3;
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const value = Math.floor(Math.random() * 180 * noiseAmount);
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // Add scan lines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let y = 0; y < canvas.height; y += 2) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  // Add CRT RGB effect (subtle color separation)
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(255, 0, 0, 0.03)';
  ctx.fillRect(1, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 255, 0, 0.03)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 255, 0.03)';
  ctx.fillRect(-1, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  // Periodically update the static effect to animate it
  setInterval(() => {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    for (let y = 0; y < canvas.height; y++) {
      const noiseAmount = Math.random() * 0.7 + 0.3;
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const value = Math.floor(Math.random() * 180 * noiseAmount);
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let y = 0; y < canvas.height; y += 2) {
      ctx.fillRect(0, y, canvas.width, 1);
    }
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.03)';
    ctx.fillRect(1, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 255, 0.03)';
    ctx.fillRect(-1, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
  }, 100);

  return texture;
}

export function createLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = '#ff0000';
  ctx.fillText('BLACK', canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('OPS', canvas.width / 2, canvas.height / 2 + 20);
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createMissionDataTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#001100';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '14px monospace';
  ctx.fillStyle = '#001100';
  const lines = [
    '> MISSION DATA:',
    '> TARGET: CLASSIFIED',
    '> LOCATION: [REDACTED]',
    '> STATUS: PENDING AUTHORIZATION',
    '',
    '> TEAM ALPHA STANDING BY',
    '> SECURITY LEVEL: 5',
    '> CLEARANCE CODE: ********',
    '',
    '> LOADING ASSETS... 89%',
    '> WARNING: COMMS COMPROMISED',
    '>',
    '> ...CONNECTION SECURE...',
  ];
  lines.forEach((line, index) => {
    ctx.fillText(line, 20, 30 + index * 25);
  });
  ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
  for (let y = 0; y < canvas.height; y += 2) {
    ctx.fillRect(0, y, canvas.width, 1);
  }
  let cursorVisible = true;
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  setInterval(() => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (cursorVisible) {
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(20 + 9 * 8, 30 + 11 * 25, 10, 16);
    } else {
      ctx.putImageData(imageData, 0, 0);
    }
    cursorVisible = !cursorVisible;
    texture.needsUpdate = true;
  }, 500);
  return texture;
}
