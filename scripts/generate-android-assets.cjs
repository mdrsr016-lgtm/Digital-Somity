const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const LOGO_PATH = path.join(__dirname, '../src/assets/images/logo.svg');
const rawSvg = fs.readFileSync(LOGO_PATH, 'utf8');

// Extract the path d attribute
const pathMatch = rawSvg.match(/<path\s+d="([^"]+)"/);
if (!pathMatch) {
  console.error("Could not find path d in logo.svg");
  process.exit(1);
}
const pathD = pathMatch[1];

const RES_DIR = path.join(__dirname, '../android/app/src/main/res');

// 1. Helper to render SVG to PNG buffer
function renderSvg(svgString, width, height) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: width }
  });
  return resvg.render().asPng();
}

// 2. Generate Adaptive Icon Foreground (Transparent background, smaller logo + logo text)
function getForegroundSvg(size) {
  // Foreground size is typically 108dp to 432px.
  // Safe zone is center circle of diameter size * 0.66
  const logoWidth = size * 0.38;
  const logoHeight = logoWidth * (4008 / 5000);
  const fontSize = Math.round(size * 0.088);
  const gap = size * 0.04;

  const totalHeight = logoHeight + gap + (fontSize * 0.75);
  const startY = (size - totalHeight) / 2;

  const logoX = (size - logoWidth) / 2;
  const logoY = startY;
  const textY = logoY + logoHeight + gap + (fontSize * 0.75);

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F5BE4" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${size * 0.012}" stdDeviation="${size * 0.018}" flood-color="#0F5BE4" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g transform="translate(${logoX}, ${logoY}) scale(${logoWidth / 5000})" filter="url(#shadow)">
    <path fill="url(#logoGrad)" d="${pathD}" />
  </g>
  <text x="${size / 2}" y="${textY}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="800" fill="#0F172A" letter-spacing="0.2">
    Digital <tspan fill="#0F5BE4">Somity</tspan>
  </text>
</svg>`;
}

// 3. Generate Legacy App Drawer Icon (Squircle / Rounded on White background, smaller logo + logo text)
function getLegacyIconSvg(size, isRound = false) {
  const logoWidth = size * 0.44;
  const logoHeight = logoWidth * (4008 / 5000);
  const fontSize = Math.round(size * 0.105);
  const gap = size * 0.045;
  const radius = isRound ? size / 2 : Math.round(size * 0.22);

  const totalHeight = logoHeight + gap + (fontSize * 0.75);
  const startY = (size - totalHeight) / 2;

  const logoX = (size - logoWidth) / 2;
  const logoY = startY;
  const textY = logoY + logoHeight + gap + (fontSize * 0.75);

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F5BE4" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${size * 0.015}" stdDeviation="${size * 0.02}" flood-color="#0F5BE4" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="#FFFFFF" />
  <g transform="translate(${logoX}, ${logoY}) scale(${logoWidth / 5000})" filter="url(#shadow)">
    <path fill="url(#logoGrad)" d="${pathD}" />
  </g>
  <text x="${size / 2}" y="${textY}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="800" fill="#0F172A" letter-spacing="0.2">
    Digital <tspan fill="#0F5BE4">Somity</tspan>
  </text>
</svg>`;
}

// 4. Generate Splash Screen SVG with centered Logo SVG and Brand Text
function getSplashSvg(width, height) {
  const isPortrait = height >= width;
  const baseDim = isPortrait ? width : height;
  const logoWidth = Math.round(baseDim * (isPortrait ? 0.32 : 0.26));
  const logoHeight = Math.round(logoWidth * (4008 / 5000));
  
  const totalContentHeight = logoHeight + (isPortrait ? 110 : 80);
  const startY = (height - totalContentHeight) / 2;

  const logoX = (width - logoWidth) / 2;
  const logoY = startY;

  const textY = logoY + logoHeight + (isPortrait ? 52 : 40);
  const subTextY = textY + (isPortrait ? 28 : 22);
  const fontSize = Math.round(baseDim * (isPortrait ? 0.068 : 0.052));
  const subFontSize = Math.round(fontSize * 0.42);

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Deep Rich Dark Background -->
  <rect width="${width}" height="${height}" fill="#080C16" />
  <defs>
    <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F5BE4" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="24" flood-color="#0F5BE4" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Ambient Glow Behind Logo -->
  <circle cx="${width/2}" cy="${logoY + logoHeight/2}" r="${logoWidth * 0.7}" fill="#0F5BE4" opacity="0.12" filter="blur(30px)"/>

  <!-- Logo SVG -->
  <g transform="translate(${logoX}, ${logoY}) scale(${logoWidth / 5000})" filter="url(#glow)">
    <path fill="url(#splashGrad)" d="${pathD}" />
  </g>

  <!-- Brand Wordmark Text -->
  <text x="${width / 2}" y="${textY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">
    Digital <tspan fill="#38BDF8">Somity</tspan>
  </text>

  <text x="${width / 2}" y="${subTextY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${subFontSize}" font-weight="500" fill="#64748B" letter-spacing="2">
    COOPERATIVE BANKING PLATFORM
  </text>
</svg>`;
}

async function run() {
  console.log("Generating Android Launcher Icons & Splash Screens...");

  // ─── 1. Adaptive Icon Vector Drawable (res/drawable-v24/ic_launcher_foreground.xml)
  const vectorDrawableXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <group
        android:scaleX="0.012"
        android:scaleY="0.012"
        android:translateX="24"
        android:translateY="30">
        <path
            android:fillColor="#0F5BE4"
            android:pathData="${pathD}" />
    </group>
</vector>`;

  const v24Dir = path.join(RES_DIR, 'drawable-v24');
  if (!fs.existsSync(v24Dir)) fs.mkdirSync(v24Dir, { recursive: true });
  fs.writeFileSync(path.join(v24Dir, 'ic_launcher_foreground.xml'), vectorDrawableXml, 'utf8');
  console.log("✓ Created drawable-v24/ic_launcher_foreground.xml");

  // ─── 2. Launcher Densities (Legacy + Foreground PNGs)
  const densities = [
    { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  for (const { dir, size, fgSize } of densities) {
    const targetDir = path.join(RES_DIR, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // ic_launcher.png (Squircle on white)
    const iconPng = renderSvg(getLegacyIconSvg(size, false), size, size);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), iconPng);

    // ic_launcher_round.png (Circle on white)
    const roundPng = renderSvg(getLegacyIconSvg(size, true), size, size);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), roundPng);

    // ic_launcher_foreground.png
    const fgPng = renderSvg(getForegroundSvg(fgSize), fgSize, fgSize);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), fgPng);

    console.log(`✓ Generated icons for ${dir} (${size}x${size}, fg ${fgSize}x${fgSize})`);
  }

  // ─── 3. Splash Screens (Portrait & Landscape for all densities)
  const splashSizes = [
    { dir: 'drawable', w: 480, h: 800 },
    { dir: 'drawable-port-mdpi', w: 320, h: 480 },
    { dir: 'drawable-port-hdpi', w: 480, h: 800 },
    { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
    { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
    { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
    { dir: 'drawable-land-mdpi', w: 480, h: 320 },
    { dir: 'drawable-land-hdpi', w: 800, h: 480 },
    { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
    { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
    { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
  ];

  for (const { dir, w, h } of splashSizes) {
    const targetDir = path.join(RES_DIR, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const splashPng = renderSvg(getSplashSvg(w, h), w, h);
    fs.writeFileSync(path.join(targetDir, 'splash.png'), splashPng);
    console.log(`✓ Generated splash for ${dir} (${w}x${h})`);
  }

  console.log("All Android assets successfully generated!");
}

run().catch(err => {
  console.error("Failed to generate assets:", err);
  process.exit(1);
});

