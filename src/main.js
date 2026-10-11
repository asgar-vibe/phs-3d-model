import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import logoUrl from './assets/logo.png';

/* ==========================================================================
   Panyarat High School (PHS) - 3D Interactive Campus Model
   Dimensions: Width 72.5m x Length 75.5m (Long side along Soi Silom 18)
   ========================================================================== */

const CAMPUS_WIDTH = 72.5; // Width (72.5 m)
const CAMPUS_LENGTH = 75.5; // Length along Soi Silom 18 (75.5 m)
const ACADEMIC_HEIGHT = 11.4; // 3 floors ~ 11.4 m (3.8 m per floor)
const ACADEMIC_FLOORS = 3;

// --- Campus Building & Zone Data ---
const CAMPUS_DATA = [
  {
    id: 'north_wing',
    nameTh: 'อาคารทิศเหนือ',
    nameEn: 'North Wing',
    typeEn: '3-story building',
    badge: '01',
    badgeColor: '#2563eb',
    width: 70.0,
    depth: 11.0,
    height: ACADEMIC_HEIGHT,
    floors: ACADEMIC_FLOORS,
    x: 0.0,
    z: -30.0,
    y: ACADEMIC_HEIGHT / 2,
    color: 0xffffff,
    edgeColor: 0x2563eb,
    isNorthWing: true,
    descEn: 'A three-story school building with a cafeteria on the ground floor.'
  },
  {
    id: 'east_wing',
    nameTh: 'อาคารทิศตะวันออก',
    nameEn: 'East Wing',
    typeEn: '3-story building',
    badge: '02',
    badgeColor: '#16a34a',
    width: 11.0,
    depth: 49.0,
    height: ACADEMIC_HEIGHT,
    floors: ACADEMIC_FLOORS,
    x: 29.5,
    z: 0.0,
    y: ACADEMIC_HEIGHT / 2,
    color: 0xffffff,
    edgeColor: 0x16a34a,
    isEastWing: true,
    descEn: 'This wing is located next to the main gate, with a three-story building structure. It also serves as the main building for external inquiries and contact.'
  },
  {
    id: 'south_wing',
    nameTh: 'อาคารทิศใต้',
    nameEn: 'South Wing',
    typeEn: '3-story building',
    badge: '03',
    badgeColor: '#9333ea',
    width: 52.0,
    depth: 11.0,
    height: ACADEMIC_HEIGHT,
    floors: ACADEMIC_FLOORS,
    x: 9.0,
    z: 30.0,
    y: ACADEMIC_HEIGHT / 2,
    color: 0xffffff,
    edgeColor: 0x9333ea,
    descEn: 'A three-story building located at the southern end of the school, used for teaching and administrative offices.'
  },
  {
    id: 'west_wing',
    nameTh: 'อาคารทิศตะวันตก',
    nameEn: 'West Wing',
    typeEn: '3-story building',
    badge: '04',
    badgeColor: '#0284c7',
    width: 11.0,
    depth: 49.0,
    height: ACADEMIC_HEIGHT,
    floors: ACADEMIC_FLOORS,
    x: -11.5,
    z: 0.0,
    y: ACADEMIC_HEIGHT / 2,
    color: 0xffffff,
    edgeColor: 0x0284c7,
    isWestWing: true,
    descEn: 'A three-story building located on the western side of the campus. It features an underpass on the ground floor connecting the main courtyard to the gymnasium area.'
  },
  {
    id: 'gym',
    nameTh: 'โรงยิมเนเซียม',
    nameEn: 'Gymnasium',
    typeEn: 'Sports Arena & Basketball Court',
    badge: '🏀',
    badgeColor: '#0284c7',
    width: 18.0,
    depth: 32.0,
    height: 10.5,
    floors: 2,
    x: -26.0,
    z: -8.5,
    y: 10.5 / 2,
    color: 0xf8fafc,
    edgeColor: 0x0284c7,
    isGym: true,
    descEn: 'Sports court accommodates basketball, futsal, and other sports; it features spectator stands and is sometimes used for parking.'
  },
  {
    id: 'auditorium',
    nameTh: 'หอประชุม',
    nameEn: 'Auditorium',
    typeEn: 'Assembly Hall & Event Center',
    badge: '🎭',
    badgeColor: '#7c3aed',
    width: 18.0,
    depth: 28.0,
    height: 9.5,
    floors: 2,
    x: -26.0,
    z: 21.5,
    y: 9.5 / 2,
    color: 0xf5f3ff,
    edgeColor: 0x7c3aed,
    isAuditorium: true,
    descEn: 'Grand auditorium and multi-purpose hall equipped for ceremonies, stage performances, academic symposia, and large student gatherings.'
  },
  {
    id: 'flagpole_court',
    nameTh: 'ลานเสาธง & สวนหย่อม (เสาธง)',
    nameEn: 'Flagpole',
    typeEn: 'Garden and seating areas all around',
    badge: '🚩',
    badgeColor: '#dc2626',
    width: 30.0,
    depth: 22.5,
    height: 0.15,
    floors: 1,
    x: 9.0,
    z: -13.25,
    y: 0.08,
    color: 0xdcfce7,
    edgeColor: 0x16a34a,
    descEn: 'This flagpole area is used for morning assemblies and activities, and features an outdoor seating zone.'
  },
  {
    id: 'covered_walkway',
    nameTh: 'ทางเดินมีหลังคา (Covered Walkway)',
    nameEn: 'Covered Walkway',
    typeEn: 'Walkway Between Wings',
    badge: '🚶',
    badgeColor: '#0d9488',
    width: 30.0,
    depth: 3.6,
    height: 3.4,
    floors: 1,
    x: 9.0,
    z: -3.0,
    y: 1.7,
    color: 0x38bdf8,
    edgeColor: 0x0284c7,
    isWalkway: true,
    descEn: 'The covered walkway connecting the buildings and serves as a pick-up and drop-off point.'
  },
  {
    id: 'parking_court',
    nameTh: 'ลานจอดรถ (parking)',
    nameEn: 'Parking',
    typeEn: 'Parking Area',
    badge: '🅿️',
    badgeColor: '#475569',
    width: 30.0,
    depth: 22.5,
    height: 0.12,
    floors: 1,
    x: 9.0,
    z: 13.25,
    y: 0.06,
    color: 0x334155,
    edgeColor: 0x64748b,
    descEn: 'A moderately sized parking lot'
  }
];

// --- Application State ---
const state = {
  selectedBuildingId: null,
  labelsVisible: true,
  gridVisible: true,
  autoRotate: false,
  cameraAnimating: false,
  timeMode: 'day',
  timeCycling: false,
  timeValue: 12.0
};

// --- Core Three.js Variables ---
let scene, camera, renderer, labelRenderer, controls;
let buildingMeshes = new Map();
let labelObjects = [];
let gridHelper;
let raycaster, mouse;
const canvasContainer = document.getElementById('canvas-container');
const labelsContainer = document.getElementById('labels-container');
const animatedObjects = { flag: null, trees: [] };

// --- Lighting & Atmosphere System Variables ---
let ambientLight, hemiLight, sunLight, fillLight;
let skyMesh, skyMaterial;
const gateSpotLights = [];
const windowMaterials = [];
const nightLights = [];
let currentLightingState = null;
let lightingTransition = {
  active: false,
  startState: null,
  targetState: null,
  startTime: 0,
  duration: 1000
};

// --- Time of Day Presets (Bangkok BTS Style Atmosphere) ---
const TIME_PRESETS = {
  day: {
    id: 'day',
    label: 'Day',
    timeVal: 12.0,
    sunPos: [20, 100, 15],
    sunColor: 0xfffaf0,
    sunIntensity: 1.45,
    ambientColor: 0xffffff,
    ambientIntensity: 0.75,
    hemiSky: 0xdbeafe,
    hemiGround: 0x64748b,
    hemiIntensity: 0.5,
    fillColor: 0xdbeafe,
    fillIntensity: 0.35,
    fogColor: 0xe0f2fe,
    fogDensity: 0.0022,
    skyTop: [0.12, 0.28, 0.72],
    skyMid: [0.22, 0.72, 0.98],
    skyBot: [0.86, 0.94, 0.99],
    sunGlow: 1.0,
    stars: 0.0,
    nightGlow: 0.0,
    gateSpots: false
  },
  sunrise: {
    id: 'sunrise',
    label: 'Sunrise',
    timeVal: 6.5,
    sunPos: [85, 20, -20], // Sun rises from the East (Soi Silom 18 side at +X)
    sunColor: 0xffa347,
    sunIntensity: 1.6,
    ambientColor: 0xfed7aa,
    ambientIntensity: 0.52,
    hemiSky: 0xfb7185,
    hemiGround: 0x78350f,
    hemiIntensity: 0.45,
    fillColor: 0x38bdf8,
    fillIntensity: 0.25,
    fogColor: 0xfed7aa,
    fogDensity: 0.0026,
    skyTop: [0.15, 0.22, 0.55],
    skyMid: [0.95, 0.45, 0.22],
    skyBot: [0.99, 0.88, 0.65],
    sunGlow: 1.5,
    stars: 0.05,
    nightGlow: 0.35,
    gateSpots: true
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    timeVal: 18.0,
    sunPos: [-85, 18, 25], // Sun sets in the West (-X, behind Gymnasium & Auditorium), casting long evening shadows towards East
    sunColor: 0xff5414,
    sunIntensity: 1.75,
    ambientColor: 0xfb923c,
    ambientIntensity: 0.48,
    hemiSky: 0xc026d3,
    hemiGround: 0x451a03,
    hemiIntensity: 0.45,
    fillColor: 0x6366f1,
    fillIntensity: 0.25,
    fogColor: 0xf97316,
    fogDensity: 0.0028,
    skyTop: [0.16, 0.05, 0.38],
    skyMid: [0.88, 0.28, 0.12],
    skyBot: [0.98, 0.85, 0.48],
    sunGlow: 1.6,
    stars: 0.15,
    nightGlow: 0.6,
    gateSpots: true
  },
  night: {
    id: 'night',
    label: 'Night',
    timeVal: 22.0,
    sunPos: [-35, 75, -45],
    sunColor: 0x93c5fd,
    sunIntensity: 0.35,
    ambientColor: 0x1e1b4b,
    ambientIntensity: 0.25,
    hemiSky: 0x1e293b,
    hemiGround: 0x020617,
    hemiIntensity: 0.2,
    fillColor: 0x312e81,
    fillIntensity: 0.15,
    fogColor: 0x0b1120,
    fogDensity: 0.0035,
    skyTop: [0.015, 0.025, 0.09],
    skyMid: [0.06, 0.09, 0.18],
    skyBot: [0.11, 0.14, 0.22],
    sunGlow: 0.35,
    stars: 1.0,
    nightGlow: 1.0,
    gateSpots: true
  }
};

// --- Lighting State Interpolation Helpers ---
function lerpVal(a, b, t) {
  return a + (b - a) * t;
}

function lerpArr(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ];
}

function lerpColorHex(c1, c2, t) {
  const col1 = new THREE.Color(c1);
  const col2 = new THREE.Color(c2);
  return col1.lerp(col2, t).getHex();
}

function lerpLightingStates(s1, s2, t) {
  return {
    sunPos: lerpArr(s1.sunPos, s2.sunPos, t),
    sunColor: lerpColorHex(s1.sunColor, s2.sunColor, t),
    sunIntensity: lerpVal(s1.sunIntensity, s2.sunIntensity, t),
    ambientColor: lerpColorHex(s1.ambientColor, s2.ambientColor, t),
    ambientIntensity: lerpVal(s1.ambientIntensity, s2.ambientIntensity, t),
    hemiSky: lerpColorHex(s1.hemiSky, s2.hemiSky, t),
    hemiGround: lerpColorHex(s1.hemiGround, s2.hemiGround, t),
    hemiIntensity: lerpVal(s1.hemiIntensity, s2.hemiIntensity, t),
    fillColor: lerpColorHex(s1.fillColor, s2.fillColor, t),
    fillIntensity: lerpVal(s1.fillIntensity, s2.fillIntensity, t),
    fogColor: lerpColorHex(s1.fogColor, s2.fogColor, t),
    fogDensity: lerpVal(s1.fogDensity, s2.fogDensity, t),
    skyTop: lerpArr(s1.skyTop, s2.skyTop, t),
    skyMid: lerpArr(s1.skyMid, s2.skyMid, t),
    skyBot: lerpArr(s1.skyBot, s2.skyBot, t),
    sunGlow: lerpVal(s1.sunGlow, s2.sunGlow, t),
    stars: lerpVal(s1.stars, s2.stars, t),
    nightGlow: lerpVal(s1.nightGlow, s2.nightGlow, t),
    gateSpots: s2.nightGlow > 0.3
  };
}

function getCurrentLightingValues() {
  if (currentLightingState) {
    return { ...currentLightingState };
  }
  return { ...TIME_PRESETS.day };
}

function calculateStateForTime(hour) {
  if (hour >= 5 && hour < 8) {
    const t = (hour - 5) / 3;
    return lerpLightingStates(TIME_PRESETS.night, TIME_PRESETS.sunrise, t);
  } else if (hour >= 8 && hour < 13) {
    const t = (hour - 8) / 5;
    return lerpLightingStates(TIME_PRESETS.sunrise, TIME_PRESETS.day, t);
  } else if (hour >= 13 && hour < 18) {
    const t = (hour - 13) / 5;
    return lerpLightingStates(TIME_PRESETS.day, TIME_PRESETS.sunset, t);
  } else if (hour >= 18 && hour < 21) {
    const t = (hour - 18) / 3;
    return lerpLightingStates(TIME_PRESETS.sunset, TIME_PRESETS.night, t);
  } else {
    return { ...TIME_PRESETS.night };
  }
}

function applyLightingState(s) {
  currentLightingState = { ...s };

  if (sunLight) {
    sunLight.position.set(s.sunPos[0], s.sunPos[1], s.sunPos[2]);
    sunLight.color.setHex(s.sunColor);
    sunLight.intensity = s.sunIntensity;
  }

  if (ambientLight) {
    ambientLight.color.setHex(s.ambientColor);
    ambientLight.intensity = s.ambientIntensity;
  }

  if (hemiLight) {
    hemiLight.color.setHex(s.hemiSky);
    hemiLight.groundColor.setHex(s.hemiGround);
    hemiLight.intensity = s.hemiIntensity;
  }

  if (fillLight) {
    fillLight.color.setHex(s.fillColor);
    fillLight.intensity = s.fillIntensity;
  }

  if (scene && scene.fog) {
    scene.fog.color.setHex(s.fogColor);
    scene.fog.density = s.fogDensity;
  }

  if (skyMaterial) {
    skyMaterial.uniforms.topColor.value.setRGB(s.skyTop[0], s.skyTop[1], s.skyTop[2]);
    skyMaterial.uniforms.midColor.value.setRGB(s.skyMid[0], s.skyMid[1], s.skyMid[2]);
    skyMaterial.uniforms.bottomColor.value.setRGB(s.skyBot[0], s.skyBot[1], s.skyBot[2]);
    skyMaterial.uniforms.sunPos.value.set(s.sunPos[0], s.sunPos[1], s.sunPos[2]);
    skyMaterial.uniforms.sunGlow.value = s.sunGlow;
    skyMaterial.uniforms.starIntensity.value = s.stars;
  }

  // Windows emissive glow in buildings
  windowMaterials.forEach((mat) => {
    if (s.nightGlow > 0.05) {
      mat.emissive.setHex(0xfef08a);
      mat.emissiveIntensity = s.nightGlow * 0.85;
    } else {
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0.0;
    }
  });

  // Entrance gate spotlights
  gateSpotLights.forEach((spot) => {
    spot.intensity = s.gateSpots ? s.nightGlow * 3.5 : 0.0;
  });

  // Night lights in Gym & Canteen
  nightLights.forEach((item) => {
    item.light.intensity = s.nightGlow * item.baseIntensity;
  });
}

function setTimePreset(modeKey, animate = true) {
  const target = TIME_PRESETS[modeKey];
  if (!target) return;

  state.timeMode = modeKey;
  state.timeValue = target.timeVal;

  ['day', 'sunrise', 'sunset', 'night'].forEach((k) => {
    const btn = document.getElementById(`btn-time-${k}`);
    if (btn) btn.classList.toggle('active', k === modeKey);
  });

  if (!animate) {
    applyLightingState(target);
    return;
  }

  lightingTransition = {
    active: true,
    startState: getCurrentLightingValues(),
    targetState: target,
    startTime: performance.now(),
    duration: 1000
  };
}

// --- Dynamic Atmospheric Sky Dome ---
function createSkyDome() {
  const skyVertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const skyFragmentShader = `
    uniform vec3 topColor;
    uniform vec3 midColor;
    uniform vec3 bottomColor;
    uniform vec3 sunPos;
    uniform float sunGlow;
    uniform float starIntensity;
    varying vec3 vWorldPosition;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    void main() {
      vec3 dir = normalize(vWorldPosition);
      float h = dir.y;

      vec3 sky;
      if (h > 0.25) {
        float f = (h - 0.25) / 0.75;
        sky = mix(midColor, topColor, pow(f, 0.75));
      } else if (h > -0.15) {
        float f = (h + 0.15) / 0.4;
        sky = mix(bottomColor, midColor, f);
      } else {
        sky = bottomColor;
      }

      // Sun / Moon optical glow
      vec3 sDir = normalize(sunPos);
      float sunDot = max(0.0, dot(dir, sDir));
      if (sunGlow > 0.01) {
        sky += vec3(1.0, 0.9, 0.7) * pow(sunDot, 180.0) * sunGlow * 1.5;
        sky += vec3(1.0, 0.65, 0.35) * pow(sunDot, 24.0) * sunGlow * 0.4;
      }

      // Night Stars
      if (starIntensity > 0.01 && h > 0.08) {
        vec3 grid = floor(dir * 160.0);
        float n = hash(grid);
        if (n > 0.982) {
          float sparkle = pow(n - 0.982, 2.0) * 3500.0 * starIntensity;
          sky += vec3(sparkle * (0.85 + 0.15 * sin(grid.x * 7.0 + grid.y * 3.0)));
        }
      }

      gl_FragColor = vec4(sky, 1.0);
    }
  `;

  const p = TIME_PRESETS.day;
  skyMaterial = new THREE.ShaderMaterial({
    vertexShader: skyVertexShader,
    fragmentShader: skyFragmentShader,
    uniforms: {
      topColor: { value: new THREE.Color().fromArray(p.skyTop) },
      midColor: { value: new THREE.Color().fromArray(p.skyMid) },
      bottomColor: { value: new THREE.Color().fromArray(p.skyBot) },
      sunPos: { value: new THREE.Vector3(...p.sunPos) },
      sunGlow: { value: p.sunGlow },
      starIntensity: { value: p.stars }
    },
    side: THREE.BackSide,
    depthWrite: false
  });

  const skyGeo = new THREE.SphereGeometry(450, 32, 20);
  skyMesh = new THREE.Mesh(skyGeo, skyMaterial);
  scene.add(skyMesh);
}

// --- Initialization ---
function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#e0f2fe', 0.0022);

  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(40, aspect, 1, 1000);
  camera.position.set(68, 62, 78);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  canvasContainer.appendChild(renderer.domElement);

  labelRenderer = new CSS2DRenderer({ element: labelsContainer });
  labelRenderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 15;
  controls.maxDistance = 240;
  controls.target.set(0, 5, 0);

  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };

  setupLighting();
  createEnvironment();
  createBuildings();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  setupUI();
  setupEventListeners();

  animate();
}

// --- Lighting Setup ---
function setupLighting() {
  createSkyDome();

  const p = TIME_PRESETS.day;

  ambientLight = new THREE.AmbientLight(p.ambientColor, p.ambientIntensity);
  scene.add(ambientLight);

  hemiLight = new THREE.HemisphereLight(p.hemiSky, p.hemiGround, p.hemiIntensity);
  hemiLight.position.set(0, 60, 0);
  scene.add(hemiLight);

  sunLight = new THREE.DirectionalLight(p.sunColor, p.sunIntensity);
  sunLight.position.set(...p.sunPos);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 280;
  const shadowRange = 75;
  sunLight.shadow.camera.left = -shadowRange;
  sunLight.shadow.camera.right = shadowRange;
  sunLight.shadow.camera.top = shadowRange;
  sunLight.shadow.camera.bottom = -shadowRange;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  fillLight = new THREE.DirectionalLight(p.fillColor, p.fillIntensity);
  fillLight.position.set(-60, 40, -50);
  scene.add(fillLight);

  setTimePreset('day', false);
}

// --- Environment: Ground, Campus Boundaries, Roads, Fence ---
function createEnvironment() {
  const envGroup = new THREE.Group();
  envGroup.name = 'EnvironmentGroup';

  const halfW = CAMPUS_WIDTH / 2; // 36.25m
  const halfL = CAMPUS_LENGTH / 2; // 37.75m

  // 1. Outer urban ground base
  const outerGroundGeo = new THREE.PlaneGeometry(240, 240);
  const outerGroundMat = new THREE.MeshStandardMaterial({
    color: 0xdde4ec,
    roughness: 0.9,
    metalness: 0.05
  });
  const outerGround = new THREE.Mesh(outerGroundGeo, outerGroundMat);
  outerGround.rotation.x = -Math.PI / 2;
  outerGround.position.y = -0.05;
  outerGround.receiveShadow = true;
  envGroup.add(outerGround);

  // 2. School Property Plot (72.5m x 75.5m exact)
  const campusGroundGeo = new THREE.PlaneGeometry(CAMPUS_WIDTH, CAMPUS_LENGTH);
  const campusGroundMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.65,
    metalness: 0.02
  });
  const campusGround = new THREE.Mesh(campusGroundGeo, campusGroundMat);
  campusGround.rotation.x = -Math.PI / 2;
  campusGround.position.set(0, 0.01, 0);
  campusGround.receiveShadow = true;
  envGroup.add(campusGround);

  // 3. Campus boundary outline
  const campusBorderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(CAMPUS_WIDTH, 0.1, CAMPUS_LENGTH));
  const campusBorderMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 2 });
  const campusBorder = new THREE.LineSegments(campusBorderGeo, campusBorderMat);
  campusBorder.position.set(0, 0.05, 0);
  envGroup.add(campusBorder);

  // 4. Soi Silom 18 Road (ด้านยาว 75.5 ม. ติดถนนซอยสีลม 18 ริมขวา)
  const roadGeo = new THREE.BoxGeometry(8, 0.06, 110);
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
    metalness: 0.1
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.position.set(halfW + 4.5, 0.04, 0);
  road.receiveShadow = true;
  envGroup.add(road);

  // Road dashed center line
  for (let z = -50; z <= 50; z += 6) {
    const dashGeo = new THREE.PlaneGeometry(0.2, 3);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const dash = new THREE.Mesh(dashGeo, dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(halfW + 4.5, 0.08, z);
    envGroup.add(dash);
  }

  // Sidewalk curbs
  const sidewalkGeo = new THREE.BoxGeometry(2, 0.18, 110);
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xcfd8e3, roughness: 0.8 });
  const sidewalkEast = new THREE.Mesh(sidewalkGeo, sidewalkMat);
  sidewalkEast.position.set(halfW + 9.5, 0.09, 0);
  sidewalkEast.receiveShadow = true;
  envGroup.add(sidewalkEast);

  const sidewalkWest = new THREE.Mesh(sidewalkGeo, sidewalkMat);
  sidewalkWest.position.set(halfW - 0.5, 0.09, 0);
  sidewalkWest.receiveShadow = true;
  envGroup.add(sidewalkWest);

  // 5. Perimeter Fence (รั้วล้อมรอบที่ดิน 72.5m x 75.5m พร้อมประตูทางเข้าที่ลูกศรแดง Entrance ชี้)
  createPerimeterFence(envGroup, halfW, halfL);

  // 6. Flagpole (เสาธงในคอร์ทเสาธง พร้อมธงชาติไทยโบกสะบัด)
  createFlagpole(envGroup);

  // 7. Zig-zag Green Island in Parking Courtyard
  createZigzagParkingIsland(envGroup);

  // 8. Landscaping: สวนหย่อม ลานเสาธง ต้นไม้ ทางเดินคอร์ท ม้านั่ง เสาไฟ ลานจอดรถ
  createLandscaping(envGroup, halfW, halfL);

  // 9. Measurement Grid (1 ช่อง = 5 เมตร)
  gridHelper = new THREE.GridHelper(120, 24, 0x3b82f6, 0xcfd8e3);
  gridHelper.position.y = 0.05;
  gridHelper.material.opacity = 0.55;
  gridHelper.material.transparent = true;
  envGroup.add(gridHelper);

  scene.add(envGroup);
}

// --- Perimeter Fence ---
function createPerimeterFence(group, halfW, halfL) {
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5, metalness: 0.2 });
  const fenceBaseMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 });
  const fenceHeight = 2.4;

  function addFenceWall(x1, z1, x2, z2) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);

    const baseGeo = new THREE.BoxGeometry(0.3, 0.6, length);
    const baseMesh = new THREE.Mesh(baseGeo, fenceBaseMat);
    baseMesh.position.set((x1 + x2) / 2, 0.3, (z1 + z2) / 2);
    baseMesh.rotation.y = angle;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    const panelGeo = new THREE.BoxGeometry(0.08, fenceHeight - 0.6, length);
    const panelMesh = new THREE.Mesh(panelGeo, fenceMat);
    panelMesh.position.set((x1 + x2) / 2, 0.6 + (fenceHeight - 0.6) / 2, (z1 + z2) / 2);
    panelMesh.rotation.y = angle;
    panelMesh.castShadow = true;
    group.add(panelMesh);
  }

  // West Wall (ริมซ้าย 75.5 ม.)
  addFenceWall(-halfW, -halfL, -halfW, halfL);
  // South Wall (ด้านล่าง 72.5 ม.)
  addFenceWall(-halfW, halfL, halfW, halfL);
  // North Wall (ด้านบน 72.5 ม.)
  addFenceWall(-halfW, -halfL, halfW, -halfL);

  // East Wall (ริมขวา ติดถนนซอย 18 ยาว 75.5 ม.)
  // มีช่องประตูหลัก Entrance ที่ Z = 8 ถึง Z = 16 (ตรงตามลูกศรแดงใน plan1.png ขยับลงใต้ 2 ม.)
  addFenceWall(halfW, -halfL, halfW, 8);
  addFenceWall(halfW, 16, halfW, halfL);

  // Gate Pillars at Entrance
  const pillarGeo = new THREE.BoxGeometry(1.2, 3.8, 1.2);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
  const p1 = new THREE.Mesh(pillarGeo, pillarMat);
  p1.position.set(halfW, 1.9, 8);
  p1.castShadow = true;
  group.add(p1);

  const p2 = new THREE.Mesh(pillarGeo, pillarMat);
  p2.position.set(halfW, 1.9, 16);
  p2.castShadow = true;
  group.add(p2);

  // Gate Arch Bar
  const archGeo = new THREE.BoxGeometry(1.4, 0.8, 9.2);
  const archMesh = new THREE.Mesh(archGeo, pillarMat);
  archMesh.position.set(halfW, 3.6, 12);
  archMesh.castShadow = true;
  group.add(archMesh);
}

// --- Flagpole with Waving Thai National Flag ---
function createFlagpole(group) {
  const baseGeo = new THREE.CylinderGeometry(1.2, 1.6, 0.5, 16);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(9.0, 0.25, -13.25);
  base.castShadow = true;
  group.add(base);

  const tierGeo = new THREE.CylinderGeometry(0.6, 0.9, 0.3, 16);
  const tier = new THREE.Mesh(tierGeo, baseMat);
  tier.position.set(9.0, 0.65, -13.25);
  tier.castShadow = true;
  group.add(tier);

  const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 12, 16);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.2 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(9.0, 6.75, -13.25);
  pole.castShadow = true;
  group.add(pole);

  const ballGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.1 });
  const ball = new THREE.Mesh(ballGeo, ballMat);
  ball.position.set(9.0, 12.85, -13.25);
  group.add(ball);

  // Waving Thai National Flag (แถบ แดง-ขาว-น้ำเงิน-ขาว-แดง)
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 150;
  flagCanvas.height = 100;
  const ctx = flagCanvas.getContext('2d');
  const h = flagCanvas.height;
  ctx.fillStyle = '#dc2626'; ctx.fillRect(0, 0, 150, h);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, h * (1 / 6), 150, h * (4 / 6));
  ctx.fillStyle = '#1e3a8a'; ctx.fillRect(0, h * (2 / 6), 150, h * (2 / 6));

  const tex = new THREE.CanvasTexture(flagCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const flagMat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.5,
    side: THREE.DoubleSide
  });

  const flagGeo = new THREE.PlaneGeometry(2.2, 1.4, 8, 4);
  const flagMesh = new THREE.Mesh(flagGeo, flagMat);
  flagMesh.position.set(9.0 + 1.15, 11.8, -13.25);
  flagMesh.castShadow = true;
  group.add(flagMesh);
  animatedObjects.flag = flagMesh;
}

// --- Zig-zag Green Island in Parking Courtyard ---
function createZigzagParkingIsland(group) {
  const islandGroup = new THREE.Group();
  const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 });

  const segments = [
    { x: 1, z: 12.5, w: 5.0, d: 2 },
    { x: 5, z: 10.5, w: 5.0, d: 2 },
    { x: 9, z: 12.5, w: 5.0, d: 2 },
    { x: 13, z: 10.5, w: 5.0, d: 2 },
    { x: 17, z: 12.5, w: 5.0, d: 2 }
  ];

  segments.forEach((seg) => {
    // Stone curb base
    const curbGeo = new THREE.BoxGeometry(seg.w + 0.3, 0.2, seg.d + 0.3);
    const curb = new THREE.Mesh(curbGeo, borderMat);
    curb.position.set(seg.x, 0.1, seg.z);
    curb.receiveShadow = true;
    islandGroup.add(curb);

    // Lush trimmed hedge
    const geo = new THREE.BoxGeometry(seg.w, 0.75, seg.d);
    const m = new THREE.Mesh(geo, hedgeMat);
    m.position.set(seg.x, 0.45, seg.z);
    m.castShadow = true;
    m.receiveShadow = true;
    islandGroup.add(m);

    // Flower accents on hedge top
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 });
    for (let fx = -seg.w / 2 + 0.6; fx <= seg.w / 2 - 0.6; fx += 1.1) {
      const fl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 0), flowerMat);
      fl.position.set(seg.x + fx, 0.85, seg.z);
      islandGroup.add(fl);
    }
  });

  group.add(islandGroup);
}

// --- Landscaping: Trees, Courtyard Paths, Benches, Lamps, Parking Stripes ---
function createLandscaping(group, halfW, halfL) {
  const landGroup = new THREE.Group();
  landGroup.name = 'LandscapingGroup';

  // 1. Procedural Architectural Tree Creator
  function createTree(x, z, scale = 1, type = 0) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.9 });
    const trunkGeo = new THREE.CylinderGeometry(0.16 * scale, 0.28 * scale, 3.8 * scale, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.9 * scale;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);

    const foliageColors = [
      [0x15803d, 0x22c55e, 0x16a34a, 0x4ade80],
      [0x166534, 0x15803d, 0x16a34a, 0x86efac],
      [0x065f46, 0x059669, 0x10b981, 0x34d399]
    ];
    const pal = foliageColors[type % foliageColors.length];

    const crownGroup = new THREE.Group();
    crownGroup.position.y = 3.6 * scale;

    const clusters = [
      { r: 1.8 * scale, col: pal[0], y: 0.2, x: 0, z: 0 },
      { r: 1.4 * scale, col: pal[1], y: 1.0 * scale, x: 0.3 * scale, z: -0.2 * scale },
      { r: 1.2 * scale, col: pal[2], y: 0.5 * scale, x: -0.7 * scale, z: 0.3 * scale },
      { r: 1.1 * scale, col: pal[3], y: 0.6 * scale, x: 0.6 * scale, z: 0.4 * scale },
      { r: 0.9 * scale, col: pal[1], y: 1.5 * scale, x: -0.2 * scale, z: 0.1 * scale }
    ];

    clusters.forEach(c => {
      const geo = new THREE.DodecahedronGeometry(c.r, 1);
      const mat = new THREE.MeshStandardMaterial({ color: c.col, roughness: 0.8 });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(c.x, c.y, c.z);
      m.castShadow = true;
      m.receiveShadow = true;
      crownGroup.add(m);
    });

    treeGroup.add(crownGroup);
    animatedObjects.trees.push(crownGroup);
    landGroup.add(treeGroup);
  }

  // 2. Park Benches in Courtyard Garden
  function createBench(x, z, rotY = 0) {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(x, 0, z);
    benchGroup.rotation.y = rotY;

    const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });

    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.5), metalMat);
    leg1.position.set(-0.7, 0.24, 0);
    leg1.castShadow = true;
    benchGroup.add(leg1);

    const leg2 = leg1.clone();
    leg2.position.x = 0.7;
    benchGroup.add(leg2);

    for (let i = -0.16; i <= 0.16; i += 0.11) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.08), woodMat);
      slat.position.set(0, 0.48, i);
      slat.castShadow = true;
      benchGroup.add(slat);
    }

    for (let j = 0.58; j <= 0.82; j += 0.11) {
      const backSlat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.04), woodMat);
      backSlat.position.set(0, j, -0.22);
      backSlat.castShadow = true;
      benchGroup.add(backSlat);
    }

    landGroup.add(benchGroup);
  }

  // 3. Minimalist LED Campus Lamp Posts
  function createCampusLamp(x, z) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(x, 0, z);

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 });

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.2, 8), poleMat);
    pole.position.y = 2.1;
    pole.castShadow = true;
    lampGroup.add(pole);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.06), poleMat);
    arm.position.set(0.25, 4.15, 0);
    lampGroup.add(arm);

    const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.18), glowMat);
    fixture.position.set(0.45, 4.05, 0);
    lampGroup.add(fixture);

    landGroup.add(lampGroup);
  }

  // Plant Trees in Courtyard Garden around Flagpole
  createTree(-2.5, -15.0, 1.15, 0);
  createTree(-2.5, -8.5, 0.95, 1);
  createTree(20.5, -16.0, 1.1, 2);
  createTree(20.5, -8.5, 1.0, 0);
  createTree(3.5, -20.5, 0.9, 1);
  createTree(14.5, -20.5, 0.95, 2);

  // Plant Trees along Perimeter Borders (North & West Green Belts)
  createTree(-32.0, -20.0, 1.15, 1);
  createTree(-32.0, 3.0, 1.05, 0);
  createTree(-32.0, 26.0, 1.1, 2);
  createTree(-15.0, -33.5, 0.95, 0);
  createTree(15.0, -33.5, 0.95, 1);

  // Add Benches in Garden
  createBench(4.0, -10.0, 0);
  createBench(14.0, -10.0, 0);
  createBench(4.0, -16.5, Math.PI);
  createBench(14.0, -16.5, Math.PI);

  // Add Campus Lamps (จัดตำแหน่งรอบทางเดินและคอร์ท)
  createCampusLamp(7.0, -5.5);
  createCampusLamp(11.0, -5.5);
  createCampusLamp(7.0, -0.5);
  createCampusLamp(11.0, -0.5);
  createCampusLamp(28.0, 8.0);
  createCampusLamp(28.0, 16.0);

  // 4. Stepping Stone Paths in Courtyard Lawn (ทางเดินหินในสวน เชื่อมจากทางเดินมีหลังคาที่ Z = -3.0 ไปยังเสาธง)
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
  for (let z = -4.5; z >= -12.0; z -= 1.4) {
    const stone = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.9), pathMat);
    stone.position.set(9.0, 0.12, z);
    stone.receiveShadow = true;
    landGroup.add(stone);
  }

  // Cross path to west and east wings
  for (let x = -3.0; x <= 21.0; x += 1.6) {
    if (Math.abs(x - 9.0) > 1.2) {
      const stone = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 1.4), pathMat);
      stone.position.set(x, 0.12, -13.25);
      stone.receiveShadow = true;
      landGroup.add(stone);
    }
  }

  // 5. White Painted Parking Lines in Parking Courtyard
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let x = -3.0; x <= 21.0; x += 2.8) {
    const stripe1 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 4.2), stripeMat);
    stripe1.rotation.x = -Math.PI / 2;
    stripe1.position.set(x, 0.08, 6.0);
    landGroup.add(stripe1);

    const stripe2 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 4.2), stripeMat);
    stripe2.rotation.x = -Math.PI / 2;
    stripe2.position.set(x, 0.08, 20.5);
    landGroup.add(stripe2);
  }

  group.add(landGroup);
}

// --- Buildings (Rich Architectural Detailing: 3 Floors, Walkways, Windows) ---
function createBuildings() {
  CAMPUS_DATA.forEach((data) => {
    const buildingGroup = new THREE.Group();
    buildingGroup.name = data.nameEn;
    buildingGroup.userData = data;

    // Special Case 1: ทางเดินมีหลังคา (Covered Walkway)
    // โปร่งโล่ง 100% ไม่มีกล่องตีทึบกั้นห้อง เดินทะลุผ่านได้ทุกทิศทาง
    if (data.id === 'covered_walkway') {
      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(data.width, data.height, data.depth),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.userData = data;
      buildingGroup.add(hitBox);

      detailCoveredWalkway(buildingGroup, data);
      buildingGroup.position.set(data.x, data.y, data.z);
      scene.add(buildingGroup);
      buildingMeshes.set(data.id, buildingGroup);
      createFloatingLabel(buildingGroup, data);
      return;
    }

    // Special Case 2: อาคารทิศตะวันออก (East Wing) มีช่องประตูทางเข้าโล่งชั้น 1 ให้รถวิ่งเข้ามาได้
    if (data.id === 'east_wing') {
      createEastWingWithDriveway(buildingGroup, data);
      buildingGroup.position.set(data.x, data.y, data.z);
      scene.add(buildingGroup);
      buildingMeshes.set(data.id, buildingGroup);
      createFloatingLabel(buildingGroup, data);
      return;
    }

    // Special Case 3: อาคารทิศตะวันตก (West Wing) ชั้น 1 มีทางลอดให้รถวิ่งเข้าไปที่โรงยิมได้
    if (data.id === 'west_wing') {
      createWestWingWithUnderpass(buildingGroup, data);
      buildingGroup.position.set(data.x, data.y, data.z);
      scene.add(buildingGroup);
      buildingMeshes.set(data.id, buildingGroup);
      createFloatingLabel(buildingGroup, data);
      return;
    }

    // Special Case 4: โรงยิมเนเซียม (Gymnasium) มีโถงทางเข้าเปิดโล่งเชื่อมกับทางลอดอาคารตะวันตก
    if (data.id === 'gymnasium') {
      createGymnasiumWithEntrance(buildingGroup, data);
      buildingGroup.position.set(data.x, data.y, data.z);
      scene.add(buildingGroup);
      buildingMeshes.set(data.id, buildingGroup);
      createFloatingLabel(buildingGroup, data);
      return;
    }

    // Standard Solid Massing Buildings (North Wing, South Wing, Auditorium)
    const boxGeo = new THREE.BoxGeometry(data.width, data.height, data.depth);
    const boxMat = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.35,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    const mesh = new THREE.Mesh(boxGeo, boxMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = data;
    buildingGroup.add(mesh); // children[0]

    // Crisp Architectural Edges
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: data.edgeColor || 0x2563eb,
      linewidth: 1.5
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    buildingGroup.add(edgesMesh); // children[1]

    // Architectural Detailing
    if (data.isAuditorium) {
      detailAuditorium(buildingGroup, data);
    } else if (data.floors === 3) {
      detailAcademicWing(buildingGroup, data);
    }

    // Position the building group
    buildingGroup.position.set(data.x, data.y, data.z);
    scene.add(buildingGroup);
    buildingMeshes.set(data.id, buildingGroup);

    // Floating CSS2D Building Label
    createFloatingLabel(buildingGroup, data);
  });
}

// --- Gate Signage Texture Generator (From gate.png & logo.png) ---
function createGateSignageTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  function render() {
    // 1. Champagne metallic architectural composite panel background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#f1ede6');
    bgGrad.addColorStop(0.35, '#e2d7c7');
    bgGrad.addColorStop(0.7, '#cbbcb0');
    bgGrad.addColorStop(1, '#b5a190');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle architectural panel joints (Alucobond grid seams)
    ctx.strokeStyle = 'rgba(75, 65, 55, 0.25)';
    ctx.lineWidth = 3;
    [0.25, 0.5, 0.75].forEach((ratio) => {
      ctx.beginPath();
      ctx.moveTo(canvas.width * ratio, 0);
      ctx.lineTo(canvas.width * ratio, canvas.height);
      ctx.stroke();
    });
    [0.22, 0.46, 0.73, 0.94].forEach((ratio) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * ratio);
      ctx.lineTo(canvas.width, canvas.height * ratio);
      ctx.stroke();
    });

    // NOTE: PHS Logo Crest is rendered exclusively as a single 3D emblem mesh mounted proud
    // on the sign structure in createGateSignageMesh, preventing duplicate overlapping logos!

    // 3. Metallic Lettering: Thai Name "โรงเรียนมัธยมปัญญารัตน์"
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    ctx.font = 'bold 50px "Sarabun", "Noto Sans Thai", sans-serif';
    const thaiGrad = ctx.createLinearGradient(0, 480, 0, 540);
    thaiGrad.addColorStop(0, '#ffffff');
    thaiGrad.addColorStop(0.5, '#e2e8f0');
    thaiGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = thaiGrad;
    ctx.fillText('โรงเรียนมัธยมปัญญารัตน์', canvas.width / 2, 510);
    ctx.restore();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.font = 'bold 50px "Sarabun", "Noto Sans Thai", sans-serif';
    ctx.strokeText('โรงเรียนมัธยมปัญญารัตน์', canvas.width / 2, 510);

    // 4. Metallic Lettering: English Name "PANYARAT HIGH SCHOOL"
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;

    ctx.font = '900 52px "Cinzel", "Times New Roman", "Georgia", serif';
    const engGrad = ctx.createLinearGradient(0, 580, 0, 650);
    engGrad.addColorStop(0, '#ffffff');
    engGrad.addColorStop(0.4, '#f1f5f9');
    engGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = engGrad;
    ctx.fillText('PANYARAT HIGH SCHOOL', canvas.width / 2, 615);
    ctx.restore();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.font = '900 52px "Cinzel", "Times New Roman", "Georgia", serif';
    ctx.strokeText('PANYARAT HIGH SCHOOL', canvas.width / 2, 615);

    // 5. Subtitle: "The ELITE High School of Mathematics and Science (English Program)"
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.font = '600 24px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('The ELITE High School of Mathematics and Science (English Program)', canvas.width / 2, 695);
    ctx.restore();

    // 6. Metallic Accent Trim Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.15, 735);
    ctx.lineTo(canvas.width * 0.85, 735);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.15, 738);
    ctx.lineTo(canvas.width * 0.85, 738);
    ctx.stroke();
  }

  render();
  return texture;
}

// --- Attach Gate Signage Panel & Ground Sliders on East Wing Facade ---
function createGateSignageMesh(group, data) {
  // 1. Facade Feature Sign Monument Structure (Floors 2 & 3 above driveway opening facing Soi Silom 18)
  // ให้หนา 0.90 ม. ยื่นออกมาจากตัวอาคารอย่างสง่างาม ลอยพ้นคานและแผ่นพื้นอาคาร (ซึ่งยื่นเพียง 0.15 ม.) ไม่ให้บดบังตัวหนังสือ
  const signW = 8.4;
  const signH = 7.6;
  const signThick = 0.90; // ความหนากล่องป้าย 90 ซม. ยื่นเด่นสง่างาม

  const signPosX = data.width / 2 + signThick / 2; // X = 5.5 + 0.45 = 5.95m
  const frontFaceX = data.width / 2 + signThick + 0.01; // X = 6.41m (พ้นคานอาคารที่ X = 5.65m ถึง 76 ซม.!)

  // 1.1 Thick 3D Monument Backing Box (โครงสร้างกล่องป้ายหนา 3 มิติ ผิวหินแกรนิต/อลูมิเนียมคอมโพสิต)
  const boxGeo = new THREE.BoxGeometry(signThick, signH, signW);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // โทน Slate Charcoal สถาปัตยกรรมระดับพรีเมียม
    roughness: 0.35,
    metalness: 0.35
  });
  const signBox = new THREE.Mesh(boxGeo, boxMat);
  signBox.position.set(signPosX, 1.9, 12.0);
  signBox.castShadow = true;
  signBox.receiveShadow = true;
  group.add(signBox);

  // Architectural frame border around the 3D monument box
  const boxEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(boxGeo),
    new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 })
  );
  boxEdges.position.copy(signBox.position);
  group.add(boxEdges);

  // 1.2 Front Sign Face (แผ่นป้ายหน้าหลักลาย Champagne พร้อมตัวหนังสือสีทอง-เงิน)
  const signGeo = new THREE.PlaneGeometry(signW, signH);
  const signMat = new THREE.MeshStandardMaterial({
    map: createGateSignageTexture(),
    roughness: 0.32,
    metalness: 0.25,
    side: THREE.FrontSide
  });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(frontFaceX, 1.9, 12.0);
  signMesh.rotation.y = Math.PI / 2; // Face towards Soi 18 (+X)
  signMesh.castShadow = true;
  group.add(signMesh);

  // Sign panel metallic gold accent frame border
  const borderFrame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.04, signH, signW)),
    new THREE.LineBasicMaterial({ color: 0xd97706, linewidth: 2.5 })
  );
  borderFrame.position.set(frontFaceX + 0.01, 1.9, 12.0);
  group.add(borderFrame);

  // 1.3 Dedicated SINGLE 3D PHS Crest Logo Emblem mounted proudly on front face
  // โลโก้ PHS มีเพียงอันเดียว ติดตั้งลอยบนหน้าป้ายอย่างคมชัด
  const logoTexture = new THREE.TextureLoader().load(logoUrl);
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  const logoSize = 3.2;
  const logoGeo = new THREE.PlaneGeometry(logoSize, logoSize);
  const logoMat = new THREE.MeshStandardMaterial({
    map: logoTexture,
    transparent: true,
    alphaTest: 0.05,
    roughness: 0.2,
    metalness: 0.1,
    side: THREE.FrontSide
  });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.set(frontFaceX + 0.03, 3.5, 12.0);
  logoMesh.rotation.y = Math.PI / 2;
  logoMesh.castShadow = true;
  group.add(logoMesh);

  // 2. Parapet Floodlights (4 spotlights pointing down at sign face)
  const spotMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
  [-3.0, -1.0, 1.0, 3.0].forEach((zOff) => {
    // Structural cantilever bracket arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.08), spotMat);
    arm.position.set(frontFaceX + 0.22, 5.75, 12.0 + zOff);
    group.add(arm);

    // Lamp fixture housing angled down at the sign
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.28), spotMat);
    lamp.position.set(frontFaceX + 0.48, 5.65, 12.0 + zOff);
    lamp.rotation.z = -Math.PI / 4.5;
    group.add(lamp);

    // Real Downward Three.js SpotLight for atmospheric night lighting
    const spot = new THREE.SpotLight(0xfff7ed, 0, 18, Math.PI / 4, 0.4, 1.2);
    spot.position.set(data.x + frontFaceX + 0.5, data.y + 5.65, data.z + 12.0 + zOff);
    spot.target.position.set(data.x + frontFaceX, data.y + 2.0, data.z + 12.0 + zOff);
    spot.castShadow = true;
    spot.shadow.bias = -0.001;
    scene.add(spot);
    scene.add(spot.target);
    gateSpotLights.push(spot);
  });

  // 3. Ground Entrance Gates & Posts (as seen in gate.png)
  const postMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
  const woodSlatMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
  const metalFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

  // North gate pillar (Z = 8.0)
  const northPost = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.8, 0.6), postMat);
  northPost.position.set(data.width / 2 + 0.25, -data.height / 2 + 1.9, 8.0);
  northPost.castShadow = true;
  group.add(northPost);

  // South gate pillar (Z = 16.0)
  const southPost = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.8, 0.6), postMat);
  southPost.position.set(data.width / 2 + 0.25, -data.height / 2 + 1.9, 16.0);
  southPost.castShadow = true;
  group.add(southPost);

  // Wooden slat sliding gates (parked open along driveway sides as in gate.png)
  [-1, 1].forEach((dir) => {
    const gateZ = dir === -1 ? 7.2 : 16.8;
    const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 2.0), metalFrameMat);
    gateFrame.position.set(data.width / 2 + 0.2, -data.height / 2 + 1.2, gateZ);
    group.add(gateFrame);

    for (let sy = 0.3; sy < 2.3; sy += 0.25) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 1.8), woodSlatMat);
      slat.position.set(data.width / 2 + 0.2, -data.height / 2 + sy, gateZ);
      group.add(slat);
    }
  });

  // Guard booth info display board on North side
  const boothBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.4, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 })
  );
  boothBoard.position.set(data.width / 2 - 1.5, -data.height / 2 + 1.8, 8.05);
  group.add(boothBoard);
}

// --- Create East Wing With Open Vehicular Gateway on Floor 1 ---
// ทางลอดโปร่ง 100% เชื่อมต่อจากซอยสีลม 18 เข้าสู่ลานจอดรถและคอร์ทกลาง
function createEastWingWithDriveway(group, data) {
  const boxMat = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.35,
    metalness: 0.05
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: data.edgeColor || 0x16a34a, linewidth: 1.5 });

  const floorHeight = data.height / data.floors; // 3.8m
  const upperH = data.height - floorHeight; // 7.6m (Floors 2 & 3)

  // 1. Upper Floors (Floors 2 & 3 bridge continuously across full 49m)
  const upperGeo = new THREE.BoxGeometry(data.width, upperH, data.depth);
  const upperMesh = new THREE.Mesh(upperGeo, boxMat);
  upperMesh.position.set(0, -data.height / 2 + floorHeight + upperH / 2, 0);
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  upperMesh.userData = data;
  group.add(upperMesh);

  const upperEdges = new THREE.LineSegments(new THREE.EdgesGeometry(upperGeo), edgeMat);
  upperEdges.position.copy(upperMesh.position);
  group.add(upperEdges);

  // 2. Floor 1 North Section (from Z = -24.5 to 8.0, length = 32.5m)
  const northLen = 32.5;
  const northGeo = new THREE.BoxGeometry(data.width, floorHeight, northLen);
  const northMesh = new THREE.Mesh(northGeo, boxMat);
  northMesh.position.set(0, -data.height / 2 + floorHeight / 2, -24.5 + northLen / 2);
  northMesh.castShadow = true;
  northMesh.receiveShadow = true;
  northMesh.userData = data;
  group.add(northMesh);

  const northEdges = new THREE.LineSegments(new THREE.EdgesGeometry(northGeo), edgeMat);
  northEdges.position.copy(northMesh.position);
  group.add(northEdges);

  // 3. Floor 1 South Section (from Z = 16.0 to 24.5, length = 8.5m)
  const southLen = 8.5;
  const southGeo = new THREE.BoxGeometry(data.width, floorHeight, southLen);
  const southMesh = new THREE.Mesh(southGeo, boxMat);
  southMesh.position.set(0, -data.height / 2 + floorHeight / 2, 24.5 - southLen / 2);
  southMesh.castShadow = true;
  southMesh.receiveShadow = true;
  southMesh.userData = data;
  group.add(southMesh);

  const southEdges = new THREE.LineSegments(new THREE.EdgesGeometry(southGeo), edgeMat);
  southEdges.position.copy(southMesh.position);
  group.add(southEdges);

  // 4. Floor 1 Open Driveway Road Surface (Hollow & Clear from X = -8 to +10)
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
  const roadSlab = new THREE.Mesh(new THREE.BoxGeometry(data.width + 4.0, 0.06, 8.0), roadMat);
  roadSlab.position.set(0, -data.height / 2 + 0.03, 12.0);
  roadSlab.receiveShadow = true;
  group.add(roadSlab);

  // Road yellow curb clearance markers
  const curbMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  [8.05, 15.95].forEach((cz) => {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(data.width + 3.8, 0.08, 0.15), curbMat);
    curb.position.set(0, -data.height / 2 + 0.04, cz);
    group.add(curb);
  });

  // Underside Ceiling Slab of Gateway at Y = -1.9
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
  const ceilingSlab = new THREE.Mesh(new THREE.BoxGeometry(data.width, 0.12, 8.0), ceilingMat);
  ceilingSlab.position.set(0, -data.height / 2 + floorHeight - 0.06, 12.0);
  group.add(ceilingSlab);

  // Gateway recessed downlights in ceiling
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
  [-2.5, 0, 2.5].forEach((lx) => {
    [-2.0, 2.0].forEach((lz) => {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.5), lightMat);
      lamp.position.set(lx, -data.height / 2 + floorHeight - 0.1, 12.0 + lz);
      group.add(lamp);
    });
  });

  // Attach Gate Signage Panel & Sliders (from gate.png & logo.png)
  createGateSignageMesh(group, data);

  // Architectural detailing (opening-aware)
  detailAcademicWing(group, data);
}

// --- Create West Wing With Underpass on Floor 1 to Gym ---
// ทางลอดโปร่ง 100% เชื่อมต่อจากคอร์ทกลาง ทะลุเข้าสู่โถงทางเข้าโรงยิม (Gymnasium)
function createWestWingWithUnderpass(group, data) {
  const boxMat = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.35,
    metalness: 0.05
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: data.edgeColor || 0x0284c7, linewidth: 1.5 });

  // Underpass opening is at world Z = 0.0 to 6.0 (in local coords: Z = 4.5 to 10.5, length = 6.0m)
  const floorHeight = data.height / data.floors; // 3.8m
  const upperH = data.height - floorHeight; // 7.6m (Floors 2 & 3)

  // 1. Upper Floors (Floors 2 & 3 bridge continuously across full 49m)
  const upperGeo = new THREE.BoxGeometry(data.width, upperH, data.depth);
  const upperMesh = new THREE.Mesh(upperGeo, boxMat);
  upperMesh.position.set(0, -data.height / 2 + floorHeight + upperH / 2, 0);
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  upperMesh.userData = data;
  group.add(upperMesh);

  const upperEdges = new THREE.LineSegments(new THREE.EdgesGeometry(upperGeo), edgeMat);
  upperEdges.position.copy(upperMesh.position);
  group.add(upperEdges);

  // 2. Floor 1 North Section (from local Z = -24.5 to 4.5, length = 29.0m)
  const northLen = 29.0;
  const northGeo = new THREE.BoxGeometry(data.width, floorHeight, northLen);
  const northMesh = new THREE.Mesh(northGeo, boxMat);
  northMesh.position.set(0, -data.height / 2 + floorHeight / 2, -24.5 + northLen / 2);
  northMesh.castShadow = true;
  northMesh.receiveShadow = true;
  northMesh.userData = data;
  group.add(northMesh);

  const northEdges = new THREE.LineSegments(new THREE.EdgesGeometry(northGeo), edgeMat);
  northEdges.position.copy(northMesh.position);
  group.add(northEdges);

  // 3. Floor 1 South Section (from local Z = 10.5 to 24.5, length = 14.0m)
  const southLen = 14.0;
  const southGeo = new THREE.BoxGeometry(data.width, floorHeight, southLen);
  const southMesh = new THREE.Mesh(southGeo, boxMat);
  southMesh.position.set(0, -data.height / 2 + floorHeight / 2, 24.5 - southLen / 2);
  southMesh.castShadow = true;
  southMesh.receiveShadow = true;
  southMesh.userData = data;
  group.add(southMesh);

  const southEdges = new THREE.LineSegments(new THREE.EdgesGeometry(southGeo), edgeMat);
  southEdges.position.copy(southMesh.position);
  group.add(southEdges);

  // 4. Floor 1 Underpass Driveway (Hollow & Clear connecting to Gym Entrance at X = -5.0)
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
  const roadSlab = new THREE.Mesh(new THREE.BoxGeometry(data.width + 1.0, 0.06, 6.0), roadMat);
  roadSlab.position.set(-0.5, -data.height / 2 + 0.03, 7.5);
  roadSlab.receiveShadow = true;
  group.add(roadSlab);

  // Yellow clearance side stripes
  const curbMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  [4.55, 10.45].forEach((cz) => {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.8, 0.08, 0.12), curbMat);
    curb.position.set(-0.5, -data.height / 2 + 0.04, cz);
    group.add(curb);
  });

  // Underpass clearance warning bar facing courtyard (+X side)
  const signMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const signBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 5.8), signMat);
  signBar.position.set(data.width / 2 + 0.16, -data.height / 2 + floorHeight - 0.25, 7.5);
  group.add(signBar);

  // Side structural pillars
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
  [-1, 1].forEach((px) => {
    [4.5, 10.5].forEach((pz) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, floorHeight, 0.6), pillarMat);
      col.position.set(px * (data.width / 2 - 0.3), -data.height / 2 + floorHeight / 2, pz);
      col.castShadow = true;
      group.add(col);
    });
  });

  // Underside Ceiling Slab at Y = -1.9
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
  const ceilingSlab = new THREE.Mesh(new THREE.BoxGeometry(data.width, 0.12, 6.0), ceilingMat);
  ceilingSlab.position.set(0, -data.height / 2 + floorHeight - 0.06, 7.5);
  group.add(ceilingSlab);

  // Architectural detailing (opening-aware)
  detailAcademicWing(group, data);
}

// --- Detail Academic Wing: 3 Floors, Ribbon Windows, Sunshades, Slabs & Canteen ---
function detailAcademicWing(group, data) {
  const slabMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5, metalness: 0.1 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.15,
    metalness: 0.85,
    transparent: true,
    opacity: 0.85
  });
  windowMaterials.push(glassMat); // Registered for nighttime warm window glow

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.4 });
  const sunshadeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.5 });
  const roofGravelMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });

  const floorHeight = data.height / data.floors; // 3.8m per floor

  // 1. Concrete Floor Slabs (Opening-Aware Plinth at Floor 1, Continuous above)
  for (let f = 0; f <= data.floors; f++) {
    const slabY = -data.height / 2 + f * floorHeight;

    if (f === 0 && data.id === 'east_wing') {
      // East Wing Plinth: Split around driveway gateway Z = 8.0 to 16.0
      // North Plinth
      const nLen = 32.5;
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.3, 0.22, nLen), slabMat);
      s1.position.set(0, slabY, -24.5 + nLen / 2);
      group.add(s1);
      // South Plinth
      const sLen = 8.5;
      const s2 = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.3, 0.22, sLen), slabMat);
      s2.position.set(0, slabY, 24.5 - sLen / 2);
      group.add(s2);
    } else if ((f === 1 || f === 2) && data.id === 'east_wing') {
      // East Wing Upper Floors: Split slabs around the prominent 3D entrance sign (Z = 7.8 to 16.2)
      // North Slab
      const nLen = 32.3;
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.3, 0.22, nLen), slabMat);
      s1.position.set(0, slabY, -24.5 + nLen / 2);
      s1.castShadow = true;
      s1.receiveShadow = true;
      group.add(s1);
      // South Slab
      const sLen = 8.3;
      const s2 = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.3, 0.22, sLen), slabMat);
      s2.position.set(0, slabY, 24.5 - sLen / 2);
      s2.castShadow = true;
      s2.receiveShadow = true;
      group.add(s2);
    } else if (f === 0 && data.id === 'west_wing') {
      // West Wing Plinth: Split around underpass local Z = 4.5 to 10.5
      // North Plinth
      const nLen = 29.0;
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.3, 0.22, nLen), slabMat);
      s1.position.set(0, slabY, -24.5 + nLen / 2);
      group.add(s1);
      // South Plinth
      const sLen = 14.0;
      const s2 = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.3, 0.22, sLen), slabMat);
      s2.position.set(0, slabY, 24.5 - sLen / 2);
      group.add(s2);
    } else {
      // Standard continuous slab
      const slabGeo = new THREE.BoxGeometry(data.width + 0.3, 0.22, data.depth + 0.3);
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.y = slabY;
      slab.castShadow = true;
      slab.receiveShadow = true;
      group.add(slab);
    }
  }

  // 2. Ribbon Windows & Sunshades on each floor (Opening-Aware)
  for (let f = 0; f < data.floors; f++) {
    const floorCenterY = -data.height / 2 + f * floorHeight + floorHeight / 2;
    const windowH = 1.8;
    const windowY = floorCenterY + 0.1;

    // Special case: North Wing Floor G (Canteen - โรงอาหาร)
    if (data.isNorthWing && f === 0) {
      const colMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const colRadius = 0.22;
      const colHeight = floorHeight - 0.22;
      const colZ = data.depth / 2 - 0.3;

      for (let cx = -data.width / 2 + 3; cx <= data.width / 2 - 3; cx += 4.5) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(colRadius, colRadius, colHeight, 16), colMat);
        col.position.set(cx, floorCenterY, colZ);
        col.castShadow = true;
        group.add(col);
      }

      // Cafeteria dining tables and bench sets
      const tableMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
      const benchMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      for (let tx = -data.width / 2 + 5; tx <= data.width / 2 - 5; tx += 6.0) {
        const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 1.1), tableMat);
        table.position.set(tx, -data.height / 2 + 0.38, 0);
        group.add(table);

        const b1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.35), benchMat);
        b1.position.set(tx, -data.height / 2 + 0.23, -0.9);
        group.add(b1);

        const b2 = b1.clone();
        b2.position.z = 0.9;
        group.add(b2);
      }

      // North exterior face of Canteen has glass windows
      const glassNorth = new THREE.Mesh(new THREE.BoxGeometry(data.width - 2, windowH, 0.08), glassMat);
      glassNorth.position.set(0, windowY, -data.depth / 2 - 0.04);
      group.add(glassNorth);

      continue;
    }

    // Standard Academic Floors (Classrooms & Science Labs)
    const isNorthOrSouth = (data.id === 'north_wing' || data.id === 'south_wing');
    if (isNorthOrSouth) {
      [-1, 1].forEach((side) => {
        const glass = new THREE.Mesh(new THREE.BoxGeometry(data.width - 1.5, windowH, 0.08), glassMat);
        glass.position.set(0, windowY, side * (data.depth / 2 + 0.04));
        group.add(glass);

        const sunshade = new THREE.Mesh(new THREE.BoxGeometry(data.width - 1.2, 0.08, 0.4), sunshadeMat);
        sunshade.position.set(0, windowY + windowH / 2 + 0.06, side * (data.depth / 2 + 0.2));
        sunshade.castShadow = true;
        group.add(sunshade);

        for (let mx = -data.width / 2 + 2; mx <= data.width / 2 - 2; mx += 3.2) {
          const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, windowH, 0.12), frameMat);
          mullion.position.set(mx, windowY, side * (data.depth / 2 + 0.05));
          group.add(mullion);
        }
      });
    } else if (data.id === 'east_wing') {
      // East Wing: Opening-Aware Window Strips
      // Ground floor (f=0) has NO windows in gateway Z = 8.0 to 16.0
      // Upper floors (f=1,2): East facade has sign panel at Z = 7.8 to 16.2
      [-1, 1].forEach((side) => {
        const isEastFacade = (side === 1);
        const shouldSplit = (f === 0) || isEastFacade;

        if (shouldSplit) {
          // North window section (Z = -24.5 to 7.5, length = 32.0m)
          const nLen = 32.0;
          const nCenterZ = -24.5 + nLen / 2;
          const glassN = new THREE.Mesh(new THREE.BoxGeometry(0.08, windowH, nLen - 0.4), glassMat);
          glassN.position.set(side * (data.width / 2 + 0.04), windowY, nCenterZ);
          group.add(glassN);

          const sunshadeN = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, nLen - 0.2), sunshadeMat);
          sunshadeN.position.set(side * (data.width / 2 + 0.2), windowY + windowH / 2 + 0.06, nCenterZ);
          sunshadeN.castShadow = true;
          group.add(sunshadeN);

          for (let mz = -23.0; mz <= 6.0; mz += 3.2) {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, windowH, 0.08), frameMat);
            mullion.position.set(side * (data.width / 2 + 0.05), windowY, mz);
            group.add(mullion);
          }

          // South window section (Z = 16.5 to 24.5, length = 8.0m)
          const sLen = 8.0;
          const sCenterZ = 24.5 - sLen / 2;
          const glassS = new THREE.Mesh(new THREE.BoxGeometry(0.08, windowH, sLen - 0.4), glassMat);
          glassS.position.set(side * (data.width / 2 + 0.04), windowY, sCenterZ);
          group.add(glassS);

          const sunshadeS = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, sLen - 0.2), sunshadeMat);
          sunshadeS.position.set(side * (data.width / 2 + 0.2), windowY + windowH / 2 + 0.06, sCenterZ);
          sunshadeS.castShadow = true;
          group.add(sunshadeS);

          for (let mz = 17.5; mz <= 23.5; mz += 3.0) {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, windowH, 0.08), frameMat);
            mullion.position.set(side * (data.width / 2 + 0.05), windowY, mz);
            group.add(mullion);
          }
        } else {
          // Continuous window strip on courtyard side of upper floors
          const glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, windowH, data.depth - 1.5), glassMat);
          glass.position.set(side * (data.width / 2 + 0.04), windowY, 0);
          group.add(glass);

          const sunshade = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, data.depth - 1.2), sunshadeMat);
          sunshade.position.set(side * (data.width / 2 + 0.2), windowY + windowH / 2 + 0.06, 0);
          sunshade.castShadow = true;
          group.add(sunshade);

          for (let mz = -data.depth / 2 + 2; mz <= data.depth / 2 - 2; mz += 3.2) {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, windowH, 0.08), frameMat);
            mullion.position.set(side * (data.width / 2 + 0.05), windowY, mz);
            group.add(mullion);
          }
        }
      });
    } else if (data.id === 'west_wing') {
      // West Wing: Underpass-Aware Window Strips
      // Ground floor (f=0) has NO windows in underpass local Z = 4.5 to 10.5
      [-1, 1].forEach((side) => {
        if (f === 0) {
          // North section (local Z = -24.5 to 4.0, length = 28.5m)
          const nLen = 28.5;
          const nCenterZ = -24.5 + nLen / 2;
          const glassN = new THREE.Mesh(new THREE.BoxGeometry(0.08, windowH, nLen - 0.4), glassMat);
          glassN.position.set(side * (data.width / 2 + 0.04), windowY, nCenterZ);
          group.add(glassN);

          const sunshadeN = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, nLen - 0.2), sunshadeMat);
          sunshadeN.position.set(side * (data.width / 2 + 0.2), windowY + windowH / 2 + 0.06, nCenterZ);
          sunshadeN.castShadow = true;
          group.add(sunshadeN);

          for (let mz = -23.0; mz <= 3.0; mz += 3.2) {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, windowH, 0.08), frameMat);
            mullion.position.set(side * (data.width / 2 + 0.05), windowY, mz);
            group.add(mullion);
          }

          // South section (local Z = 11.0 to 24.5, length = 13.5m)
          const sLen = 13.5;
          const sCenterZ = 24.5 - sLen / 2;
          const glassS = new THREE.Mesh(new THREE.BoxGeometry(0.08, windowH, sLen - 0.4), glassMat);
          glassS.position.set(side * (data.width / 2 + 0.04), windowY, sCenterZ);
          group.add(glassS);

          const sunshadeS = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, sLen - 0.2), sunshadeMat);
          sunshadeS.position.set(side * (data.width / 2 + 0.2), windowY + windowH / 2 + 0.06, sCenterZ);
          sunshadeS.castShadow = true;
          group.add(sunshadeS);

          for (let mz = 12.0; mz <= 23.5; mz += 3.2) {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, windowH, 0.08), frameMat);
            mullion.position.set(side * (data.width / 2 + 0.05), windowY, mz);
            group.add(mullion);
          }
        } else {
          // Upper floors: continuous window ribbon
          const glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, windowH, data.depth - 1.5), glassMat);
          glass.position.set(side * (data.width / 2 + 0.04), windowY, 0);
          group.add(glass);

          const sunshade = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, data.depth - 1.2), sunshadeMat);
          sunshade.position.set(side * (data.width / 2 + 0.2), windowY + windowH / 2 + 0.06, 0);
          sunshade.castShadow = true;
          group.add(sunshade);

          for (let mz = -data.depth / 2 + 2; mz <= data.depth / 2 - 2; mz += 3.2) {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, windowH, 0.08), frameMat);
            mullion.position.set(side * (data.width / 2 + 0.05), windowY, mz);
            group.add(mullion);
          }
        }
      });
    }
  }

  // 3. Modern Flat Roof: Parapet wall, dark gravel surface, and HVAC chillers
  const parapetGeo = new THREE.BoxGeometry(data.width + 0.1, 0.55, data.depth + 0.1);
  const parapet = new THREE.Mesh(parapetGeo, slabMat);
  parapet.position.y = data.height / 2 + 0.28;
  group.add(parapet);

  const roofGravel = new THREE.Mesh(new THREE.BoxGeometry(data.width - 0.6, 0.1, data.depth - 0.6), roofGravelMat);
  roofGravel.position.y = data.height / 2 + 0.1;
  roofGravel.receiveShadow = true;
  group.add(roofGravel);

  // Rooftop Machine Penthouse
  const penthouseGeo = new THREE.BoxGeometry(4.5, 2.4, 3.2);
  const penthouse = new THREE.Mesh(penthouseGeo, slabMat);
  penthouse.position.set(0, data.height / 2 + 1.2, 0);
  penthouse.castShadow = true;
  group.add(penthouse);

  // Rooftop AC chiller units
  const hvacMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
  for (let hx = -6; hx <= 6; hx += 12) {
    const hvac = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.2), hvacMat);
    hvac.position.set(hx, data.height / 2 + 0.6, 1.5);
    hvac.castShadow = true;
    group.add(hvac);
  }
}

// --- Detail Covered Walkway: Modern Structural Canopy with Slim Columns ---
// ทางเดินโปร่ง 100% มีเฉพาะหลังคาและเสา ไม่มีผนังทึบ สามารถเดินทะลุผ่านได้ทุกทิศทาง
function detailCoveredWalkway(group, data) {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
  const colMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.2 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 });

  // 1. Paved elevated base walkway slab (แผ่นพื้นทางเดินยกสูงบางๆ)
  const baseGeo = new THREE.BoxGeometry(data.width, 0.16, data.depth - 0.4);
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -data.height / 2 + 0.08;
  base.receiveShadow = true;
  group.add(base);

  const baseEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(baseGeo),
    new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 1.5 })
  );
  baseEdges.position.copy(base.position);
  group.add(baseEdges);

  // 2. Stainless steel columns along left and right (เสากระบอกสแตนเลสโปร่ง)
  const colH = data.height - 0.3;
  const colR = 0.07;
  for (let x = -data.width / 2 + 2; x <= data.width / 2 - 2; x += 3.5) {
    [-1, 1].forEach((side) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(colR, colR, colH, 12), colMat);
      col.position.set(x, 0, side * (data.depth / 2 - 0.35));
      col.castShadow = true;
      group.add(col);
    });
  }

  // 3. Modern Flat Canopy Roof with Skylight Inserts (หลังคาคลุมด้านบน)
  const roofGeo = new THREE.BoxGeometry(data.width + 0.2, 0.14, data.depth);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = data.height / 2;
  roof.castShadow = true;
  group.add(roof);

  const roofEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(roofGeo),
    new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 1.5 })
  );
  roofEdges.position.copy(roof.position);
  group.add(roofEdges);

  const skylight = new THREE.Mesh(new THREE.BoxGeometry(data.width - 2, 0.16, 1.2), glassMat);
  skylight.position.set(0, data.height / 2 + 0.02, 0);
  group.add(skylight);
}

// --- Create Gymnasium with Open Vehicular / Arena Entrance from West Wing Underpass ---
function createGymnasiumWithEntrance(group, data) {
  const wallMat = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.35,
    metalness: 0.05
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: data.edgeColor || 0x2563eb, linewidth: 1.5 });

  const wallThick = 0.4;

  // 1. West Wall (Full height, full depth)
  const westGeo = new THREE.BoxGeometry(wallThick, data.height, data.depth);
  const westMesh = new THREE.Mesh(westGeo, wallMat);
  westMesh.position.set(-data.width / 2 + wallThick / 2, 0, 0);
  westMesh.castShadow = true;
  westMesh.receiveShadow = true;
  group.add(westMesh);

  // 2. North Wall (Full height, full width)
  const northGeo = new THREE.BoxGeometry(data.width, data.height, wallThick);
  const northMesh = new THREE.Mesh(northGeo, wallMat);
  northMesh.position.set(0, 0, -data.depth / 2 + wallThick / 2);
  northMesh.castShadow = true;
  northMesh.receiveShadow = true;
  group.add(northMesh);

  // 3. South Wall (Full height, full width)
  const southGeo = new THREE.BoxGeometry(data.width, data.height, wallThick);
  const southMesh = new THREE.Mesh(southGeo, wallMat);
  southMesh.position.set(0, 0, data.depth / 2 - wallThick / 2);
  southMesh.castShadow = true;
  southMesh.receiveShadow = true;
  group.add(southMesh);

  // 4. East Wall (Facing West Wing underpass at local Z = 11.5 to 17.5)
  // North section of East Wall (from Z = -17.5 to 11.5, length = 29.0m)
  const nLen = 29.0;
  const eastNGeo = new THREE.BoxGeometry(wallThick, data.height, nLen);
  const eastNMesh = new THREE.Mesh(eastNGeo, wallMat);
  eastNMesh.position.set(data.width / 2 - wallThick / 2, 0, -data.depth / 2 + nLen / 2);
  eastNMesh.castShadow = true;
  eastNMesh.receiveShadow = true;
  group.add(eastNMesh);

  const eastNEdges = new THREE.LineSegments(new THREE.EdgesGeometry(eastNGeo), edgeMat);
  eastNEdges.position.copy(eastNMesh.position);
  group.add(eastNEdges);

  // Header Wall above Entrance Opening (from Z = 11.5 to 17.5, height = 8.0m, Y = -2.0 to 6.0)
  const doorH = 4.0;
  const headerH = data.height - doorH; // 8.0m
  const headerGeo = new THREE.BoxGeometry(wallThick, headerH, 6.0);
  const headerMesh = new THREE.Mesh(headerGeo, wallMat);
  headerMesh.position.set(data.width / 2 - wallThick / 2, -data.height / 2 + doorH + headerH / 2, 14.5);
  headerMesh.castShadow = true;
  headerMesh.receiveShadow = true;
  group.add(headerMesh);

  // Steel portal frame and roll-up header above open entrance
  const portalFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
  const portalHeader = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 6.2), portalFrameMat);
  portalHeader.position.set(data.width / 2, -data.height / 2 + doorH - 0.2, 14.5);
  group.add(portalHeader);

  // 5. Basketball Court Hardwood Parquet Floor inside the Gym Arena
  const courtMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.35,
    metalness: 0.1
  });
  const courtFloor = new THREE.Mesh(new THREE.BoxGeometry(data.width - 0.8, 0.1, data.depth - 0.8), courtMat);
  courtFloor.position.set(0, -data.height / 2 + 0.05, 0);
  courtFloor.receiveShadow = true;
  group.add(courtFloor);

  // Basketball court painted lines
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // Center half-court line
  const midLine = new THREE.Mesh(new THREE.BoxGeometry(data.width - 2.0, 0.02, 0.12), lineMat);
  midLine.position.set(0, -data.height / 2 + 0.11, 0);
  group.add(midLine);

  // Center circle
  const centerCircle = new THREE.Mesh(
    new THREE.RingGeometry(1.6, 1.72, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.set(0, -data.height / 2 + 0.12, 0);
  group.add(centerCircle);

  // Basketball Hoops & Backboards (North & South ends of court)
  const hoopMat = new THREE.MeshBasicMaterial({ color: 0xea580c });
  const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, transparent: true, opacity: 0.85 });
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

  [-1, 1].forEach((dir) => {
    const bz = dir * (data.depth / 2 - 2.5);
    // Support pole
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.8, 0.18), poleMat);
    pole.position.set(0, -data.height / 2 + 1.9, bz);
    group.add(pole);

    // Overhang arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.2), poleMat);
    arm.position.set(0, -data.height / 2 + 3.05, bz - dir * 0.6);
    group.add(arm);

    // Backboard
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.05, 0.06), boardMat);
    board.position.set(0, -data.height / 2 + 3.05, bz - dir * 1.2);
    group.add(board);

    // Orange Rim
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 8, 24), hoopMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, -data.height / 2 + 2.75, bz - dir * 1.5);
    group.add(rim);
  });

  // 6. Suspended High-Bay LED Arena Lights
  const arenaLightMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
  [-8, 0, 8].forEach((lz) => {
    [-3, 3].forEach((lx) => {
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 0.3, 16), arenaLightMat);
      lamp.position.set(lx, data.height / 2 - 1.2, lz);
      group.add(lamp);
    });
  });

  // Warm indoor arena lighting for nighttime glow
  const gymLight = new THREE.PointLight(0xfef08a, 0, 35);
  gymLight.position.set(0, 3.5, 0);
  group.add(gymLight);
  nightLights.push({ light: gymLight, baseIntensity: 1.8 });

  // 7. Architectural Detailing (Curved vaulted roof & clerestory daylight windows)
  detailGymnasium(group, data);
}

// --- Detail Gymnasium: Vaulted Curved Roof, Ribbed Panels & Clerestory Windows ---
function detailGymnasium(group, data) {
  const roofRadius = data.width / 2;
  const roofGeo = new THREE.CylinderGeometry(roofRadius, roofRadius, data.depth, 24, 1, false, 0, Math.PI);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.2 });
  const roofMesh = new THREE.Mesh(roofGeo, roofMat);
  roofMesh.rotation.z = Math.PI / 2;
  roofMesh.rotation.y = Math.PI / 2;
  roofMesh.position.y = data.height / 2;
  roofMesh.castShadow = true;
  group.add(roofMesh);

  const roofEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(roofGeo),
    new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 })
  );
  roofEdges.rotation.z = Math.PI / 2;
  roofEdges.rotation.y = Math.PI / 2;
  roofEdges.position.y = data.height / 2;
  group.add(roofEdges);

  // Central longitudinal skylight on roof apex
  const skylightGeo = new THREE.BoxGeometry(1.6, 0.2, data.depth - 2);
  const skylightMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
  const skylight = new THREE.Mesh(skylightGeo, skylightMat);
  skylight.position.y = data.height / 2 + roofRadius + 0.1;
  group.add(skylight);

  // Clerestory daylight windows under the eaves
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
  windowMaterials.push(glassMat);
  const windowRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, data.depth - 2), glassMat);
  windowRibbon.position.set(data.width / 2 + 0.05, data.height / 2 - 0.8, 0);
  group.add(windowRibbon);
}

// --- Detail Auditorium: Contemporary Acoustic Cladding & Grand Entrance ---
function detailAuditorium(group, data) {
  const accentMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.3 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
  windowMaterials.push(glassMat);

  // Top parapet accent band
  const topBand = new THREE.Mesh(new THREE.BoxGeometry(data.width + 0.2, 0.8, data.depth + 0.2), accentMat);
  topBand.position.y = data.height / 2 - 0.4;
  topBand.castShadow = true;
  group.add(topBand);

  // Vertical timber architectural feature stripes
  for (let z = -data.depth / 2 + 3; z <= data.depth / 2 - 3; z += 3.5) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, data.height - 1.2, 0.3), woodMat);
    fin.position.set(data.width / 2 + 0.06, 0, z);
    fin.castShadow = true;
    group.add(fin);
  }

  // Foyer entrance canopy
  const foyerCanopy = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 6.0), accentMat);
  foyerCanopy.position.set(data.width / 2 + 1.25, -data.height / 2 + 3.2, 0);
  foyerCanopy.castShadow = true;
  group.add(foyerCanopy);
}

// --- Floating CSS2D Label ---
function createFloatingLabel(buildingGroup, data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'floating-label-wrapper';
  wrapper.dataset.buildingId = data.id;

  const extraHeight = data.isGym ? 4.0 : 0;

  wrapper.innerHTML = `
    <div class="floating-label-pill">
      <div class="label-icon" style="background: ${data.badgeColor};">${data.badge}</div>
      <div class="label-texts">
        <span class="label-main">${data.nameEn}</span>
        <span class="label-sub">${data.typeEn}</span>
      </div>
    </div>
    <div class="label-pin" style="background: linear-gradient(to bottom, ${data.badgeColor}, transparent);"></div>
  `;

  wrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    selectBuilding(data.id, true);
  });

  const labelObject = new CSS2DObject(wrapper);
  const stalkHeight = 3.5;
  labelObject.position.set(0, data.height / 2 + extraHeight + stalkHeight, 0);

  buildingGroup.add(labelObject);
  labelObjects.push(labelObject);
}

// --- UI Setup & Building Drawer ---
function setupUI() {
  const buildingListContainer = document.getElementById('building-list');
  const countBadge = document.getElementById('building-count');
  countBadge.textContent = `${CAMPUS_DATA.length} Zones`;

  CAMPUS_DATA.forEach((b) => {
    const item = document.createElement('div');
    item.className = 'building-item';
    item.dataset.id = b.id;
    item.innerHTML = `
      <div class="item-color-box" style="background: ${b.badgeColor};"></div>
      <div class="item-info">
        <span class="item-title">${b.nameEn}</span>
        <span class="item-subtitle">${b.typeEn}</span>
      </div>
      <span class="item-tag">${b.width}×${b.depth}m</span>
    `;

    item.addEventListener('click', () => {
      selectBuilding(b.id, true);
    });

    buildingListContainer.appendChild(item);
  });
}

// --- Building Selection & Modal ---
function selectBuilding(id, shouldFocusCamera = false) {
  state.selectedBuildingId = id;
  const building = CAMPUS_DATA.find((b) => b.id === id);
  if (!building) return;

  document.querySelectorAll('.building-item').forEach((el) => {
    el.classList.toggle('active', el.dataset.id === id);
  });

  document.querySelectorAll('.floating-label-wrapper').forEach((el) => {
    el.classList.toggle('selected', el.dataset.buildingId === id);
  });

  buildingMeshes.forEach((group, bId) => {
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive && !child.material.map) {
        if (bId === id) {
          child.material.emissive = new THREE.Color(building.badgeColor);
          child.material.emissiveIntensity = 0.22;
        } else {
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
      }
    });
  });

  const modal = document.getElementById('detail-modal');
  document.getElementById('modal-type-badge').textContent = building.typeEn;
  document.getElementById('modal-type-badge').style.background = `${building.badgeColor}15`;
  document.getElementById('modal-type-badge').style.color = building.badgeColor;

  document.getElementById('modal-title').textContent = building.nameEn;
  document.getElementById('modal-en-title').textContent = building.typeEn;
  // document.getElementById('modal-dim-size').textContent = `${building.width} × ${building.depth} m`;
  // document.getElementById('modal-dim-height').textContent = `${building.height} m (${building.floors} Floors)`;
  // document.getElementById('modal-dim-pos').textContent = `(${building.x}, ${building.z})`;
  document.getElementById('modal-description').textContent = building.descEn;

  modal.classList.add('show');

  if (shouldFocusCamera) {
    focusOnPosition(
      new THREE.Vector3(building.x + 24, building.y + 20, building.z + 28),
      new THREE.Vector3(building.x, building.y, building.z)
    );
  }
}

function deselectBuilding() {
  state.selectedBuildingId = null;
  document.querySelectorAll('.building-item').forEach((el) => el.classList.remove('active'));
  document.querySelectorAll('.floating-label-wrapper').forEach((el) => el.classList.remove('selected'));
  document.getElementById('detail-modal').classList.remove('show');

  buildingMeshes.forEach((group) => {
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        child.material.emissive = new THREE.Color(0x000000);
        child.material.emissiveIntensity = 0;
      }
    });
  });
}

// --- Camera Animation ---
function focusOnPosition(targetPos, targetLookAt, duration = 1000) {
  state.cameraAnimating = true;
  const startPos = camera.position.clone();
  const startLookAt = controls.target.clone();
  const startTime = performance.now();

  function step(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const t = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPos, targetPos, t);
    controls.target.lerpVectors(startLookAt, targetLookAt, t);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      state.cameraAnimating = false;
    }
  }

  requestAnimationFrame(step);
}

// --- Camera Presets ---
function setViewPreset(type) {
  document.querySelectorAll('.toolbar-group:first-child .tool-btn').forEach((b) => b.classList.remove('active'));

  if (type === 'iso') {
    document.getElementById('btn-view-iso').classList.add('active');
    focusOnPosition(new THREE.Vector3(68, 62, 78), new THREE.Vector3(0, 5, 0));
  } else if (type === 'front') {
    document.getElementById('btn-view-front').classList.add('active');
    // Looking from Soi Silom 18 (East towards West across the 75.5m front)
    focusOnPosition(new THREE.Vector3(75, 35, 0), new THREE.Vector3(0, 8, 0));
  } else if (type === 'top') {
    document.getElementById('btn-view-top').classList.add('active');
    // Top-down bird's eye view matching plan1.png
    focusOnPosition(new THREE.Vector3(0, 115, 0.1), new THREE.Vector3(0, 0, 0));
  } else if (type === 'reset') {
    document.getElementById('btn-view-iso').classList.add('active');
    deselectBuilding();
    focusOnPosition(new THREE.Vector3(68, 62, 78), new THREE.Vector3(0, 5, 0));
  }
}

// --- Event Listeners ---
function setupEventListeners() {
  window.addEventListener('resize', onWindowResize);

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  let pointerDownPos = { x: 0, y: 0 };
  function onPointerDown(e) {
    pointerDownPos = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e) {
    const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    if (dist > 6) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const meshes = Array.from(buildingMeshes.values()).map((g) => g.children[0]);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitData = intersects[0].object.userData;
      if (hitData && hitData.id) {
        selectBuilding(hitData.id, false);
      }
    } else {
      deselectBuilding();
    }
  }

  // Camera Presets
  document.getElementById('btn-view-iso').addEventListener('click', () => setViewPreset('iso'));
  document.getElementById('btn-view-front').addEventListener('click', () => setViewPreset('front'));
  document.getElementById('btn-view-top').addEventListener('click', () => setViewPreset('top'));
  document.getElementById('btn-view-reset').addEventListener('click', () => setViewPreset('reset'));

  // Toggle Labels
  const btnToggleLabels = document.getElementById('btn-toggle-labels');
  btnToggleLabels.addEventListener('click', () => {
    state.labelsVisible = !state.labelsVisible;
    btnToggleLabels.classList.toggle('active', state.labelsVisible);
    labelsContainer.style.display = state.labelsVisible ? 'block' : 'none';
  });

  // Toggle Grid
  const btnToggleGrid = document.getElementById('btn-toggle-grid');
  btnToggleGrid.addEventListener('click', () => {
    state.gridVisible = !state.gridVisible;
    btnToggleGrid.classList.toggle('active', state.gridVisible);
    if (gridHelper) gridHelper.visible = state.gridVisible;
  });

  // Toggle Auto-Rotate
  const btnToggleRotate = document.getElementById('btn-toggle-rotate');
  btnToggleRotate.addEventListener('click', () => {
    state.autoRotate = !state.autoRotate;
    btnToggleRotate.classList.toggle('active', state.autoRotate);
    controls.autoRotate = state.autoRotate;
    controls.autoRotateSpeed = 1.2;
  });

  // Modal actions
  document.getElementById('modal-close-btn').addEventListener('click', deselectBuilding);
  document.getElementById('modal-focus-btn').addEventListener('click', () => {
    if (state.selectedBuildingId) {
      const b = CAMPUS_DATA.find((x) => x.id === state.selectedBuildingId);
      if (b) {
        focusOnPosition(
          new THREE.Vector3(b.x + 24, b.y + 20, b.z + 28),
          new THREE.Vector3(b.x, b.y, b.z)
        );
      }
    }
  });

  // Atmosphere & Time of Day Presets (Bangkok BTS Style)
  const btnTimeDay = document.getElementById('btn-time-day');
  if (btnTimeDay) {
    btnTimeDay.addEventListener('click', () => {
      state.timeCycling = false;
      const cycleBtn = document.getElementById('btn-time-cycle');
      if (cycleBtn) cycleBtn.classList.remove('active');
      setTimePreset('day', true);
    });
  }

  const btnTimeSunrise = document.getElementById('btn-time-sunrise');
  if (btnTimeSunrise) {
    btnTimeSunrise.addEventListener('click', () => {
      state.timeCycling = false;
      const cycleBtn = document.getElementById('btn-time-cycle');
      if (cycleBtn) cycleBtn.classList.remove('active');
      setTimePreset('sunrise', true);
    });
  }

  const btnTimeSunset = document.getElementById('btn-time-sunset');
  if (btnTimeSunset) {
    btnTimeSunset.addEventListener('click', () => {
      state.timeCycling = false;
      const cycleBtn = document.getElementById('btn-time-cycle');
      if (cycleBtn) cycleBtn.classList.remove('active');
      setTimePreset('sunset', true);
    });
  }

  const btnTimeNight = document.getElementById('btn-time-night');
  if (btnTimeNight) {
    btnTimeNight.addEventListener('click', () => {
      state.timeCycling = false;
      const cycleBtn = document.getElementById('btn-time-cycle');
      if (cycleBtn) cycleBtn.classList.remove('active');
      setTimePreset('night', true);
    });
  }

  const btnTimeCycle = document.getElementById('btn-time-cycle');
  if (btnTimeCycle) {
    btnTimeCycle.addEventListener('click', () => {
      state.timeCycling = !state.timeCycling;
      btnTimeCycle.classList.toggle('active', state.timeCycling);
      if (state.timeCycling) {
        lightingTransition.active = false;
      }
    });
  }

  // Hint dismiss
  const hintCloseBtn = document.getElementById('hint-close-btn');
  if (hintCloseBtn) {
    hintCloseBtn.addEventListener('click', () => {
      const hint = document.getElementById('interaction-hint');
      if (hint) hint.style.opacity = '0';
    });
  }
}

// --- Window Resize ---
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  labelRenderer.setSize(width, height);
}

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const time = now * 0.0015;

  if (animatedObjects.flag) {
    animatedObjects.flag.rotation.z = Math.sin(time * 2.5) * 0.06;
  }
  for (let i = 0; i < animatedObjects.trees.length; i++) {
    animatedObjects.trees[i].rotation.z = Math.sin(time * 1.5 + i * 0.7) * 0.015;
  }

  // Keep atmospheric sky dome centered on camera position
  if (skyMesh) {
    skyMesh.position.copy(camera.position);
  }

  // Smooth lighting transitions between presets (Day, Sunset, Night)
  if (lightingTransition.active) {
    const elapsed = now - lightingTransition.startTime;
    const progress = Math.min(elapsed / lightingTransition.duration, 1.0);
    // Smooth cubic ease-in-out
    const t = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    const blended = lerpLightingStates(lightingTransition.startState, lightingTransition.targetState, t);
    applyLightingState(blended);

    if (progress >= 1.0) {
      lightingTransition.active = false;
      applyLightingState(lightingTransition.targetState);
    }
  } else if (state.timeCycling) {
    // Continuous dynamic Bangkok BTS style Day/Night auto-cycle
    state.timeValue = (state.timeValue + 0.035) % 24;
    const cycledState = calculateStateForTime(state.timeValue);
    applyLightingState(cycledState);

    // Update active button indicators based on current hour
    const h = state.timeValue;
    const activeKey = (h >= 5 && h < 8) ? 'sunrise' : (h >= 8 && h < 16) ? 'day' : (h >= 16 && h < 20) ? 'sunset' : 'night';
    ['day', 'sunrise', 'sunset', 'night'].forEach((k) => {
      const btn = document.getElementById(`btn-time-${k}`);
      if (btn) btn.classList.toggle('active', k === activeKey);
    });
  }

  controls.update();

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', init);
