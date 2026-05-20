import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyTerrain } from "./MyTerrain.js";
import { MySphere } from "./MySphere.js";
import { MyLowPolyRock } from "./MyLowPolyRock.js";
import { MyPineTree } from "./MyPineTree.js";
import { MyLeafyTree } from "./MyLeafyTree.js";
import { MyDeadTree } from "./MyDeadTree.js";
import { MyGrassClump } from "./MyGrassClump.js";
import { MyWaterPond } from "./MyWaterPond.js";
import { MyGrassBlade } from "./MyGrassBlade.js";
import { MyFlora } from "./MyFlora.js";
import { MyWagon } from './MyWagon.js';

export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);
    
    this.initCameras();
    this.initLights();

    this.enableTextures(true);

    this.gl.clearColor(0.38, 0.72, 0.95, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.scaleFactor = 1.0;

    this.axis = new CGFaxis(this);
    this.terrain = new MyTerrain(
      this,
      200,
      100,
      4.0,
      8,
      3,
      0.035,
      4,
      0.45,
      1.85,
      1337
    );
    this.sky = new MySphere(this, 200, 100, 80, true, false, 1, 1); 
    
    this.cloudRotation = 0;
    this.setUpdatePeriod(50);

    this.terrainAppearance = new CGFappearance(this);
    this.terrainAppearance.setAmbient(0.3, 0.4, 0.3, 1.0);
    this.terrainAppearance.setDiffuse(0.6, 0.7, 0.6, 1.0);
    this.terrainAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
    this.terrainAppearance.setEmission(0.0, 0.0, 0.0, 1.0);
    this.terrainAppearance.setShininess(6.0);

    this.grassTexture = new CGFtexture(this, "images/textures/grass_diffuse.jpg");
    this.dirtTexture = new CGFtexture(this, "images/textures/dirt_diffuse.jpg");
    this.terrainAppearance.setTexture(this.grassTexture);
    this.terrainAppearance.setTextureWrap("REPEAT", "REPEAT");

    this.terrainShader = new CGFshader(
      this.gl,
      "shaders/terrain.vert",
      "shaders/terrain.frag"
    );
    this.terrainShader.setUniformsValues({
      uSampler: 0,
      uSampler2: 1,
      uMaxHeight: this.terrain.getMaxHeight(),
      uBlendLow: 0.2,
      uBlendHigh: 0.7
    });
    this.useTerrainShader = false;

    this.grassWindShader = new CGFshader(
      this.gl,
      "shaders/grass.vert",
      "shaders/grass.frag"
    );
    this.windTime = 0;
    this.enableWind = true;
    this.windDirection = [1.0, 0.25];
    this.windStrength = 0.35;

    this.enablePonds = true;
    this.pondCount = 6;
    this.pondLowHeightThreshold = 0.6;
    this.pondMinRadius = 5.0;
    this.pondMaxRadius = 8.0;
    this.pondDistortion = 0.25;

    this.enableGrass = true;
    this.enableFlora = true;
    this.grassPatchCount = 140;
    this.grassPatchMinScale = 2.0;
    this.grassPatchMaxScale = 3.6;
    this.grassBladesMin = 260;
    this.grassBladesMax = 420;
    this.grassDeadPatchChance = 0.15;
    this.grassFlatSlope = 0.5;
    this.grassMaxDistance = 140;
    this.grassMaxTotalBlades = 40000;
    this.grassLodNear = 20;
    this.grassLodMid = 35;
    this.grassPatchHeightScale = 0.75;

    this.cameraMove = { forward: false, backward: false };
    this.cameraSpeed = 0.25;

    this.floraCount = 8;
    this.floraMinScale = 0.7;
    this.floraMaxScale = 1.6;
    this.floraFlatSlope = 0.45;

    this.skyAppearance = new CGFappearance(this);
    this.skyAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.skyAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.skyAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setEmission(1.0, 1.0, 1.0, 1.0);
    this.skyAppearance.setShininess(1.0);
    this.skyAppearance.loadTexture('images/skyline/sky_panorama.jpg');
    this.skyAppearance.setTextureWrap('REPEAT', 'CLAMP_TO_EDGE');

    this.wagon = new MyWagon(this);

    this.displayPlane = true;

    this.initWaterPonds();
    this.initScatterElements();
    this.initGrassSystem();
    this.initFloraSystem();
  }

  initLights() {
    this.lights[0].setPosition(-100, 150, 10, 0); 
    
    this.lights[0].setAmbient(0.2, 0.2, 0.2, 1.0);
    this.lights[0].setDiffuse(1.0, 0.95, 0.8, 1.0);
    this.lights[0].setSpecular(1.0, 0.95, 0.8, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 1.7, 25), vec3.fromValues(0, 1.0, 24));
  }

  initScatterElements() {
    this.scatterSeed = 20240513;
    this.random = this.createSeededRandom(this.scatterSeed);

    this.rock = new MyLowPolyRock(this);
    this.pineTree = new MyPineTree(this);
    this.leafyTree = new MyLeafyTree(this);
    this.deadTree = new MyDeadTree(this);
    this.grassClump = new MyGrassClump(this);

    this.rockAppearance = new CGFappearance(this);
    this.rockAppearance.setAmbient(0.18, 0.18, 0.18, 1.0);
    this.rockAppearance.setDiffuse(0.32, 0.32, 0.32, 1.0);
    this.rockAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
    this.rockAppearance.setShininess(4.0);

    this.trunkAppearance = new CGFappearance(this);
    this.trunkAppearance.setAmbient(0.25, 0.18, 0.12, 1.0);
    this.trunkAppearance.setDiffuse(0.45, 0.32, 0.2, 1.0);
    this.trunkAppearance.setSpecular(0.08, 0.08, 0.08, 1.0);
    this.trunkAppearance.setShininess(6.0);

    this.foliageAppearance = new CGFappearance(this);
    this.foliageAppearance.setAmbient(0.12, 0.25, 0.12, 1.0);
    this.foliageAppearance.setDiffuse(0.2, 0.45, 0.2, 1.0);
    this.foliageAppearance.setSpecular(0.05, 0.06, 0.05, 1.0);
    this.foliageAppearance.setShininess(4.0);

    this.grassAppearance = new CGFappearance(this);
    this.grassAppearance.setAmbient(0.18, 0.35, 0.18, 1.0);
    this.grassAppearance.setDiffuse(0.25, 0.5, 0.25, 1.0);
    this.grassAppearance.setSpecular(0.04, 0.04, 0.04, 1.0);
    this.grassAppearance.setShininess(3.0);

    const halfSize = this.terrain.size * 0.5;
    this.scatterBounds = halfSize * 0.9;
    this.centerClearRadius = 12;

    this.rockInstances = this.generateScatter(10, 0.6, 1.4, 0.7);
    this.pineInstances = this.generateScatter(8, 1.4, 2.3, 0.45);
    this.leafyInstances = this.generateScatter(6, 1.2, 1.9, 0.45);
    this.deadInstances = this.generateScatter(3, 1.2, 1.8, 0.45);
    this.grassInstances = this.generateScatter(24, 0.4, 0.9, 0.5);
  }

  initWaterPonds() {
    if (!this.enablePonds) return;

    this.pondSeed = 20240601;
    this.pondRandom = this.createSeededRandom(this.pondSeed);
    this.pondShape = new MyWaterPond(
      this,
      1,
      28,
      this.pondDistortion,
      this.pondSeed
    );

    this.pondAppearance = new CGFappearance(this);
    this.pondAppearance.setAmbient(0.0, 0.2, 0.8, 1.0);
    this.pondAppearance.setDiffuse(0.0, 0.4, 1.0, 1.0);
    this.pondAppearance.setSpecular(0.8, 0.8, 0.9, 1.0);
    this.pondAppearance.setEmission(0.0, 0.1, 0.3, 1.0);
    this.pondAppearance.setShininess(80.0);

    const minHeight = this.terrain.getMinHeight();
    let lowThreshold = minHeight + this.pondLowHeightThreshold;
    let lowPoints = this.terrain.getLowPoints(lowThreshold, 4);
    const maxRadius = this.pondMaxRadius;
    const bounds = this.terrain.size * 0.5 - maxRadius * 1.2;

    while (lowPoints.length < this.pondCount * 8 && lowThreshold < minHeight + 2.4) {
      lowThreshold += 0.35;
      lowPoints = this.terrain.getLowPoints(lowThreshold, 4);
    }

    this.pondInstances = [];
    const candidates = lowPoints
      .filter((point) =>
        Math.abs(point.x) <= bounds &&
        Math.abs(point.z) <= bounds &&
        Math.hypot(point.x, point.z) >= this.centerClearRadius
      )
      .map((point) => ({ point, sort: this.pondRandom() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ point }) => point);

    for (const point of candidates) {
      if (this.pondInstances.length >= this.pondCount) break;

      const radius = this.pondMinRadius + (this.pondMaxRadius - this.pondMinRadius) * this.pondRandom();
      const scaleX = radius * (0.85 + 0.3 * this.pondRandom());
      const scaleZ = radius * (0.85 + 0.3 * this.pondRandom());
      const minDistance = Math.max(scaleX, scaleZ) + this.pondMaxRadius * 0.9;
      const overlaps = this.pondInstances.some((pond) => {
        const otherRadius = Math.max(pond.scaleX, pond.scaleZ);
        return Math.hypot(point.x - pond.x, point.z - pond.z) < minDistance + otherRadius;
      });
      if (overlaps) continue;

      const rotation = this.pondRandom() * Math.PI * 2;
      const y = point.height + 0.05;

      this.pondInstances.push({ x: point.x, z: point.z, y, scaleX, scaleZ, rotation });
    }

    if (this.pondInstances.length < this.pondCount) {
      for (const point of candidates) {
        if (this.pondInstances.length >= this.pondCount) break;
        const radius = this.pondMinRadius + (this.pondMaxRadius - this.pondMinRadius) * this.pondRandom();
        const scaleX = radius * (0.85 + 0.3 * this.pondRandom());
        const scaleZ = radius * (0.85 + 0.3 * this.pondRandom());
        const overlaps = this.pondInstances.some((pond) =>
          Math.hypot(point.x - pond.x, point.z - pond.z) <
          Math.max(scaleX, scaleZ) + Math.max(pond.scaleX, pond.scaleZ) + 1.5
        );
        if (overlaps) continue;

        this.pondInstances.push({
          x: point.x,
          z: point.z,
          y: point.height + 0.05,
          scaleX,
          scaleZ,
          rotation: this.pondRandom() * Math.PI * 2
        });
      }
    }

    if (this.pondInstances.length < this.pondCount) {
      const ringRadius = this.terrain.size * 0.32;
      for (let i = 0; i < this.pondCount && this.pondInstances.length < this.pondCount; i++) {
        const angle = (Math.PI * 2 * i) / this.pondCount + 0.35;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        if (Math.hypot(x, z) < this.centerClearRadius) continue;

        const radius = this.pondMinRadius + (this.pondMaxRadius - this.pondMinRadius) * this.pondRandom();
        const scaleX = radius * (0.85 + 0.3 * this.pondRandom());
        const scaleZ = radius * (0.85 + 0.3 * this.pondRandom());
        const overlaps = this.pondInstances.some((pond) =>
          Math.hypot(x - pond.x, z - pond.z) <
          Math.max(scaleX, scaleZ) + Math.max(pond.scaleX, pond.scaleZ) + 2.0
        );
        if (overlaps) continue;

        this.pondInstances.push({
          x,
          z,
          y: this.getGroundY(x, z, 0.05),
          scaleX,
          scaleZ,
          rotation: this.pondRandom() * Math.PI * 2
        });
      }
    }

    console.log("Water ponds generated:", this.pondInstances.length);

  
  }


  createSeededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6d2b79f5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  initGrassSystem() {
    if (!this.enableGrass) return;

    const avgBlades = (this.grassBladesMin + this.grassBladesMax) * 0.5;
    const maxPatches = Math.max(10, Math.floor(this.grassMaxTotalBlades / avgBlades));
    if (this.grassPatchCount > maxPatches) {
      this.grassPatchCount = maxPatches;
      console.log("Grass patch count reduced for budget:", this.grassPatchCount);
    }

    this.grassBlade = new MyGrassBlade(this);
    this.grassLiveAppearance = new CGFappearance(this);
    this.grassLiveAppearance.setAmbient(0.2, 0.35, 0.2, 1.0);
    this.grassLiveAppearance.setDiffuse(0.45, 0.75, 0.4, 1.0);
    this.grassLiveAppearance.setSpecular(0.02, 0.02, 0.02, 1.0);
    this.grassLiveAppearance.setShininess(4.0);

    this.grassDeadAppearance = new CGFappearance(this);
    this.grassDeadAppearance.setAmbient(0.25, 0.2, 0.12, 1.0);
    this.grassDeadAppearance.setDiffuse(0.6, 0.5, 0.3, 1.0);
    this.grassDeadAppearance.setSpecular(0.01, 0.01, 0.01, 1.0);
    this.grassDeadAppearance.setShininess(3.0);

    this.grassPatchInstances = this.generateGrassScatter();
    console.log("Grass patches generated:", this.grassPatchInstances.length);

    const bladesPerPatch = this.grassBladesMax;
    const totalGrassTris = this.grassPatchInstances.length * bladesPerPatch * 3;
    console.log("Vegetation init", {
      grassPatches: this.grassPatchInstances.length,
      bladesPerPatch,
      grassTris: totalGrassTris,
      floraCount: this.enableFlora ? this.floraCount : 0
    });
  }

  initFloraSystem() {
    if (!this.enableFlora) return;

    this.flora = new MyFlora(this);
    this.floraStemAppearance = new CGFappearance(this);
    this.floraPetalAppearance = new CGFappearance(this);
    this.floraCenterAppearance = new CGFappearance(this);

    this.floraStemPalette = [
      [0.12, 0.32, 0.14],
      [0.16, 0.4, 0.18],
      [0.1, 0.26, 0.12]
    ];

    this.floraPetalPalette = [
      [0.95, 0.85, 0.85],
      [0.95, 0.7, 0.75],
      [0.9, 0.85, 0.55],
      [0.75, 0.85, 0.95],
      [0.85, 0.8, 0.95]
    ];

    this.floraCenterPalette = [
      [0.95, 0.85, 0.25],
      [0.85, 0.6, 0.1],
      [0.95, 0.75, 0.35]
    ];

    this.floraInstances = this.generateFloraScatter();
  }

  generateGrassScatter() {
    const patches = [];
    const random = this.createSeededRandom(20240612);
    const halfSize = this.terrain.size * 0.5 * 0.95;
    const attempts = this.grassPatchCount * 10;

    for (let i = 0; i < attempts && patches.length < this.grassPatchCount; i++) {
      const x = (random() * 2 - 1) * halfSize;
      const z = (random() * 2 - 1) * halfSize;

      if (Math.hypot(x, z) < this.centerClearRadius) continue;
      if (this.getTerrainSlope(x, z) > this.grassFlatSlope) continue;

      const scale = this.grassPatchMinScale + (this.grassPatchMaxScale - this.grassPatchMinScale) * random();
      const patchRadius = scale * 1.8;
      if (this.isInsidePond(x, z, patchRadius + 0.6)) continue;

      const y = this.getGroundY(x, z);
      const rotation = random() * Math.PI * 2;
      const isDead = random() < this.grassDeadPatchChance;
      const tint = isDead ? 0.55 + 0.2 * random() : 0.85 + 0.25 * random();

      const blades = [];
      let bladeCount =
        this.grassBladesMin + Math.floor(random() * (this.grassBladesMax - this.grassBladesMin + 1));
      if (isDead) bladeCount = Math.max(2, Math.floor(bladeCount * 0.6));
      const maxBladeAttempts = bladeCount * 6;
      let bladeAttempts = 0;
      while (blades.length < bladeCount && bladeAttempts < maxBladeAttempts) {
        bladeAttempts++;
        const angle = random() * Math.PI * 2;
        const radius = 0.6 + 1.2 * random();
        const offsetX = Math.cos(angle) * radius;
        const offsetZ = Math.sin(angle) * radius;

        const cosR = Math.cos(rotation);
        const sinR = Math.sin(rotation);
        const worldX = x + (offsetX * scale) * cosR - (offsetZ * scale) * sinR;
        const worldZ = z + (offsetX * scale) * sinR + (offsetZ * scale) * cosR;

        if (this.isInsidePond(worldX, worldZ, 0.35 * scale)) continue;

        blades.push({
          offsetX,
          offsetZ,
          worldX,
          worldZ,
          worldY: this.getGroundY(worldX, worldZ),
          rotation: random() * Math.PI * 2,
          leanX: (random() - 0.5) * 0.35,
          leanZ: (random() - 0.5) * 0.35,
          scale: 0.6 + 0.35 * random(),
        });
      }

      patches.push({
        x,
        z,
        y,
        rotation,
        scale,
        tint,
        isDead,
        blades
      });
    }

    return patches;
  }

  generateFloraScatter() {
    const flora = [];
    const random = this.createSeededRandom(20240613);
    const halfSize = this.terrain.size * 0.5 * 0.92;
    const attempts = this.floraCount * 12;

    const anchors = [
      ...this.rockInstances,
      ...this.pineInstances,
      ...this.leafyInstances,
      ...this.deadInstances
    ];

    for (let i = 0; i < attempts && flora.length < this.floraCount; i++) {
      const anchor = anchors[Math.floor(random() * anchors.length)];
      const offsetAngle = random() * Math.PI * 2;
      const offsetRadius = 3 + 6 * random();
      const x = (anchor?.x || 0) + Math.cos(offsetAngle) * offsetRadius;
      const z = (anchor?.z || 0) + Math.sin(offsetAngle) * offsetRadius;

      if (Math.abs(x) > halfSize || Math.abs(z) > halfSize) continue;
      if (Math.hypot(x, z) < this.centerClearRadius) continue;
      if (this.isInsidePond(x, z, 0.8)) continue;
      if (this.getTerrainSlope(x, z) > this.floraFlatSlope) continue;

      const y = this.getGroundY(x, z);
      const petalCount = 4 + Math.floor(random() * 5);
      const petalLength = 0.14 + 0.2 * random();
      const petalWidth = 0.08 + 0.1 * random();
      const petalTilt = 0.35 + 0.4 * random();
      const hasSecondary = random() < 0.55;

      const stemHeight = 0.3 + 0.4 * random();
      const stemRadius = 0.02 + 0.02 * random();
      const centerRadius = 0.04 + 0.05 * random();
      const leafCount = 1 + Math.floor(random() * 3);
      const leafLength = 0.18 + 0.18 * random();
      const leafWidth = 0.07 + 0.08 * random();
      const leafTilt = 0.2 + 0.35 * random();

      const stemColor = this.floraStemPalette[
        Math.floor(random() * this.floraStemPalette.length)
      ];
      const petalColor = this.floraPetalPalette[
        Math.floor(random() * this.floraPetalPalette.length)
      ];
      const centerColor = this.floraCenterPalette[
        Math.floor(random() * this.floraCenterPalette.length)
      ];

      flora.push({
        x,
        z,
        y,
        rotation: random() * Math.PI * 2,
        scale: this.floraMinScale + (this.floraMaxScale - this.floraMinScale) * random(),
        tilt: (random() - 0.5) * 0.25,
        stemHeight,
        stemRadius,
        petalCount,
        petalLength,
        petalWidth,
        petalTilt,
        petalCount2: hasSecondary ? Math.max(3, petalCount - 1) : 0,
        petalLength2: petalLength * (0.7 + 0.15 * random()),
        petalWidth2: petalWidth * (0.7 + 0.15 * random()),
        petalTilt2: petalTilt * (0.85 + 0.15 * random()),
        centerRadius,
        leafCount,
        leafLength,
        leafWidth,
        leafTilt,
        stemColor,
        petalColor,
        centerColor
      });
    }

    return flora;
  }

  getTerrainSlope(x, z) {
    const h = this.terrain.getHeightAt(x, z);
    const hx = this.terrain.getHeightAt(x + 1.0, z);
    const hz = this.terrain.getHeightAt(x, z + 1.0);
    return Math.max(Math.abs(hx - h), Math.abs(hz - h));
  }

  isInsidePond(x, z, margin = 0) {
    if (!this.pondInstances) return false;
    for (const pond of this.pondInstances) {
      const dx = x - pond.x;
      const dz = z - pond.z;
      const scaleX = pond.scaleX + margin;
      const scaleZ = pond.scaleZ + margin;
      const nx = dx / scaleX;
      const nz = dz / scaleZ;
      if (nx * nx + nz * nz < 1.0) return true;
    }
    return false;
  }

  generateScatter(count, minScale, maxScale, maxSlope = Infinity) {
    const items = [];
    const maxAttempts = count * 12;

    for (let i = 0; i < maxAttempts && items.length < count; i++) {
      const x = (this.random() * 2 - 1) * this.scatterBounds;
      const z = (this.random() * 2 - 1) * this.scatterBounds;
      const centerDist = Math.hypot(x, z);
      if (centerDist < this.centerClearRadius) continue;
      if (this.getTerrainSlope(x, z) > maxSlope) continue;

      const scale = minScale + (maxScale - minScale) * this.random();
      const rotation = this.random() * Math.PI * 2;
      const tint = 0.85 + 0.3 * this.random();

      if (this.isInsidePond(x, z, scale * 0.9)) continue;

      items.push({ x, z, scale, rotation, tint });
    }

    return items;
  }

  applyTintedAppearance(appearance, tint) {
    if (!appearance._baseDiffuse) appearance._baseDiffuse = appearance.diffuse.slice();
    const diffuse = appearance._baseDiffuse;
    appearance.setDiffuse(diffuse[0] * tint, diffuse[1] * tint, diffuse[2] * tint, diffuse[3]);
    appearance.apply();
  }

  getGroundY(x, z, offset = 0) {
    return this.terrain.getHeightAt(x, z) + offset;
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.depthMask(false);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    this.pushMatrix();
    const skyMatrix = this.getMatrix();
    skyMatrix[12] = 0; skyMatrix[13] = 0; skyMatrix[14] = 0;
    this.setMatrix(skyMatrix);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.depthMask(false);
    this.gl.disable(this.gl.CULL_FACE);
    
    this.translate(0, -5, 0);
    this.scale(1, -1, 1);
    

    this.skyAppearance.apply();
    this.sky.display();
    
    this.gl.disable(this.gl.BLEND);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthMask(true);
    this.gl.enable(this.gl.CULL_FACE); 
    this.popMatrix();
    
    this.pushMatrix();

    const wagonX = 0;
    const wagonZ = 20;

    const wagonY = this.getGroundY(wagonX, wagonZ) - 2.0;
    this.translate(wagonX, wagonY, wagonZ);
    this.rotate(Math.PI / 6, 0, 1, 0);
    this.wagon.display();
    
    this.popMatrix();

    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor, 0.0, 0.0, 0.0,
      0.0, this.scaleFactor, 0.0, 0.0,
      0.0, 0.0, this.scaleFactor, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
    this.multMatrix(sca);

    if (this.displayPlane) {
      if (this.useTerrainShader) {
        this.setActiveShader(this.terrainShader);
        this.terrainAppearance.apply();
        this.dirtTexture.bind(1);
        this.terrain.display();
        this.setActiveShader(this.defaultShader);
      } else {
        this.terrainAppearance.apply();
        this.terrain.display();
      }
    }

    this.displayPonds();

    this.displayScatter();

    this.displayGrass();
    this.displayFlora();
  }

  displayGrass() {
    if (!this.enableGrass || !this.grassPatchInstances) return;

    this.gl.disable(this.gl.CULL_FACE);
    this.gl.depthMask(true);
    this.windTime =
      typeof performance !== "undefined" ? performance.now() * 0.001 : this.windTime + 0.05;
    this.setActiveShader(this.grassWindShader);
    this.grassWindShader.setUniformsValues({
      uTime: this.windTime,
      uWindDirection: this.windDirection,
      uWindStrength: this.windStrength,
      uWindEnabled: this.enableWind ? 1.0 : 0.0,
      uBladeHeight: 0.32,
      uLightDir: [0.35, 1.0, 0.25]
    });

    const camPos = this.camera?.position;
    const maxDist = this.grassMaxDistance;

    for (const patch of this.grassPatchInstances) {
      let dist = 0;
      if (camPos && maxDist) {
        const dx = patch.x - camPos[0];
        const dz = patch.z - camPos[2];
        dist = Math.hypot(dx, dz);
        if (dist > maxDist) continue;
      }

      const appearance = patch.isDead ? this.grassDeadAppearance : this.grassLiveAppearance;
      const baseColor = patch.isDead ? [0.6, 0.5, 0.3] : [0.45, 0.75, 0.4];

      appearance.apply();
      this.grassWindShader.setUniformsValues({
        uGrassColor: [
          baseColor[0] * patch.tint,
          baseColor[1] * patch.tint,
          baseColor[2] * patch.tint
        ]
      });

      if (patch.blades && patch.blades.length > 0) {
        let bladeLimit = patch.blades.length;
        if (dist > this.grassLodMid) bladeLimit = Math.floor(bladeLimit * 0.25);
        else if (dist > this.grassLodNear) bladeLimit = Math.floor(bladeLimit * 0.55);

        for (let i = 0; i < bladeLimit; i++) {
          const blade = patch.blades[i];
          this.pushMatrix();
          this.translate(blade.worldX, blade.worldY, blade.worldZ);
          this.rotate(blade.leanX || 0, 1, 0, 0);
          this.rotate(blade.leanZ || 0, 0, 0, 1);
          this.scale(
            patch.scale * blade.scale * 0.7,
            patch.scale * this.grassPatchHeightScale * blade.scale,
            patch.scale * blade.scale * 0.7
          );
          this.grassBlade.display();
          this.popMatrix();
        }
      }
    }

    this.setActiveShader(this.defaultShader);
    this.gl.enable(this.gl.CULL_FACE);
  }

  displayFlora() {
    if (!this.enableFlora || !this.floraInstances) return;
    this.gl.disable(this.gl.BLEND);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthMask(true);

    for (const flower of this.floraInstances) {
      this.pushMatrix();
      this.translate(flower.x, flower.y, flower.z);
      this.rotate(flower.rotation, 0, 1, 0);
      this.rotate(flower.tilt, 1, 0, 0);
      this.rotate(flower.tilt * 0.5, 0, 0, 1);
      this.scale(flower.scale, flower.scale, flower.scale);

      this.applyColorToAppearance(this.floraStemAppearance, flower.stemColor, 1.0);
      this.applyColorToAppearance(this.floraPetalAppearance, flower.petalColor, 1.0);
      this.applyColorToAppearance(this.floraCenterAppearance, flower.centerColor, 1.0);

      this.flora.displayFlower(flower, {
        stem: this.floraStemAppearance,
        petal: this.floraPetalAppearance,
        center: this.floraCenterAppearance
      });
      this.popMatrix();
    }
  }

  applyColorToAppearance(appearance, color, alpha) {
    appearance.setAmbient(color[0] * 0.5, color[1] * 0.5, color[2] * 0.5, alpha);
    appearance.setDiffuse(color[0], color[1], color[2], alpha);
    appearance.setSpecular(0.05, 0.05, 0.05, alpha);
    appearance.setShininess(6.0);
  }

  displayPonds() {
    if (!this.enablePonds || !this.pondInstances) return;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthMask(false);

    this.pondAppearance.apply();
    for (const pond of this.pondInstances) {
      this.pushMatrix();
      this.translate(pond.x, pond.y, pond.z);
      this.rotate(pond.rotation, 0, 1, 0);
      this.scale(pond.scaleX, 1, pond.scaleZ);
      this.pondShape.display();
      this.popMatrix();
    }

    this.gl.disable(this.gl.BLEND);
    this.gl.depthMask(true);
  }

  displayScatter() {
    for (const rock of this.rockInstances) {
      const y = this.getGroundY(rock.x, rock.z, rock.scale * 0.7);
      this.pushMatrix();
      this.translate(rock.x, y, rock.z);
      this.rotate(rock.rotation, 0, 1, 0);
      this.scale(rock.scale, rock.scale * 0.7, rock.scale);
      this.applyTintedAppearance(this.rockAppearance, rock.tint);
      this.rock.display();
      this.popMatrix();
    }

    for (const tree of this.pineInstances) {
      const y = this.getGroundY(tree.x, tree.z);
      this.pushMatrix();
      this.translate(tree.x, y, tree.z);
      this.rotate(tree.rotation, 0, 1, 0);
      this.scale(tree.scale, tree.scale, tree.scale);
      this.trunkAppearance.apply();
      this.pineTree.displayTrunk();
      this.foliageAppearance.apply();
      this.pineTree.displayFoliage();
      this.popMatrix();
    }

    for (const tree of this.leafyInstances) {
      const y = this.getGroundY(tree.x, tree.z);
      this.pushMatrix();
      this.translate(tree.x, y, tree.z);
      this.rotate(tree.rotation, 0, 1, 0);
      this.scale(tree.scale, tree.scale, tree.scale);
      this.trunkAppearance.apply();
      this.leafyTree.displayTrunk();
      this.foliageAppearance.apply();
      this.leafyTree.displayFoliage();
      this.popMatrix();
    }

    for (const tree of this.deadInstances) {
      const y = this.getGroundY(tree.x, tree.z);
      this.pushMatrix();
      this.translate(tree.x, y, tree.z);
      this.rotate(tree.rotation, 0, 1, 0);
      this.scale(tree.scale, tree.scale, tree.scale);
      this.trunkAppearance.apply();
      this.deadTree.display();
      this.popMatrix();
    }

    for (const clump of this.grassInstances) {
      const y = this.getGroundY(clump.x, clump.z);
      this.pushMatrix();
      this.translate(clump.x, y, clump.z);
      this.rotate(clump.rotation, 0, 1, 0);
      this.scale(clump.scale, clump.scale, clump.scale);
      this.applyTintedAppearance(this.grassAppearance, clump.tint);
      this.grassClump.display();
      this.popMatrix();
    }
  }

  update(currTime) {
    this.windTime = currTime * 0.001;
    this.cloudRotation += 0.0008;
    if (this.cloudRotation > 2 * Math.PI) this.cloudRotation -= 2 * Math.PI;

    if (this.camera && (this.cameraMove.forward || this.cameraMove.backward)) {
      const dir = vec3.create();
      vec3.subtract(dir, this.camera.target, this.camera.position);
      dir[1] = 0;
      vec3.normalize(dir, dir);
      const step = this.cameraSpeed * (this.cameraMove.forward ? 1 : -1);

      vec3.scaleAndAdd(this.camera.position, this.camera.position, dir, step);
      vec3.scaleAndAdd(this.camera.target, this.camera.target, dir, step);
      this.camera.updateProjectionMatrix();
    }
  }
}
