import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyTerrain } from "./MyTerrain.js";
import { MySphere } from "./MySphere.js";
import { MyLowPolyRock } from "./MyLowPolyRock.js";
import { MyPineTree } from "./MyPineTree.js";
import { MyLeafyTree } from "./MyLeafyTree.js";
import { MyDeadTree } from "./MyDeadTree.js";
import { MyGrassClump } from "./MyGrassClump.js";
import { MyWaterPond } from "./MyWaterPond.js";
import { MyGrassPatch } from "./MyGrassPatch.js";
import { MyGrassBlade } from "./MyGrassBlade.js";
import { MyFlora } from "./MyFlora.js";

/**
 * MyScene
 * @constructor
 */
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

    // Initialize scene objects
    this.axis = new CGFaxis(this);
    this.terrain = new MyTerrain(
      this,
      200,
      100,
      2.0,
      8,
      1,
      0.035,
      3,
      0.5,
      2.0,
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
      uMaxHeight: this.terrain.maxHeight,
      uBlendLow: 0.2,
      uBlendHigh: 0.7
    });
    this.useTerrainShader = false;

    this.enablePonds = true;
    this.pondCount = 3;
    this.pondLowHeightThreshold = 0.6;
    this.pondMinRadius = 5.0;
    this.pondMaxRadius = 8.0;
    this.pondDistortion = 0.25;


    this.enableGrass = true;
    this.enableFlora = false;
    this.grassPatchCount = 8;
    this.grassPatchMinScale = 1.0;
    this.grassPatchMaxScale = 1.6;
    this.grassBladesMin = 1;
    this.grassBladesMax = 2;
    this.grassFlatSlope = 0.35;

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

    this.displayPlane = true;

    this.initScatterElements();
    this.initWaterPonds();
    this.initGrassSystem();
    this.initFloraSystem();
  }

  initLights() {
    this.lights[0].setPosition(0, 1, -1, 0);
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

    this.rockInstances = this.generateScatter(10, 0.6, 1.4);
    this.pineInstances = this.generateScatter(8, 1.4, 2.3);
    this.leafyInstances = this.generateScatter(6, 1.2, 1.9);
    this.deadInstances = this.generateScatter(3, 1.2, 1.8);
    this.grassInstances = this.generateScatter(24, 0.4, 0.9);
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
    const lowThreshold = minHeight + this.pondLowHeightThreshold;
    let lowPoints = this.terrain.getLowPoints(lowThreshold, 4);
    const maxRadius = this.pondMaxRadius;
    const bounds = this.terrain.size * 0.5 - maxRadius * 1.2;

    if (lowPoints.length === 0) {
      const fallback = this.terrain.getLowPoints(minHeight + this.pondLowHeightThreshold * 2, 6);
      lowPoints = fallback.length ? fallback : this.terrain.getLowPoints(minHeight + 0.8, 8);
    }

    this.pondInstances = [];
    let attempts = 0;
    while (this.pondInstances.length < this.pondCount && attempts < lowPoints.length * 2) {
      const index = Math.floor(this.pondRandom() * lowPoints.length);
      const point = lowPoints[index];
      attempts++;
      if (!point) continue;
      if (Math.abs(point.x) > bounds || Math.abs(point.z) > bounds) continue;
      if (Math.hypot(point.x, point.z) < this.centerClearRadius) continue;

      const radius = this.pondMinRadius + (this.pondMaxRadius - this.pondMinRadius) * this.pondRandom();
      const scaleX = radius * (0.85 + 0.3 * this.pondRandom());
      const scaleZ = radius * (0.85 + 0.3 * this.pondRandom());
      const rotation = this.pondRandom() * Math.PI * 2;
      const y = point.height + 0.05;

      this.pondInstances.push({ x: point.x, z: point.z, y, scaleX, scaleZ, rotation });
    }

  
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

    this.grassBlade = new MyGrassBlade(this);
    this.grassPatch = new MyGrassPatch(this);
    this.grassTextures = [
      new CGFtexture(this, "images/flora/grass_1.png"),
      new CGFtexture(this, "images/flora/grass_2.png"),
      new CGFtexture(this, "images/flora/grass_3.png")
    ];

    this.grassAppearances = this.grassTextures.map((texture) => {
      const appearance = new CGFappearance(this);
      appearance.setAmbient(1.0, 1.0, 1.0, 1.0);
      appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
      appearance.setSpecular(0.0, 0.0, 0.0, 1.0);
      appearance.setEmission(0.0, 0.0, 0.0, 1.0);
      appearance.setShininess(1.0);
      appearance.setTexture(texture);
      appearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
      return appearance;
    });

    this.grassPatchInstances = this.generateGrassScatter();
    console.log("Grass patches generated:", this.grassPatchInstances.length);

    const bladesPerPatch = this.grassBladesMax;
    const totalGrassQuads = this.grassPatchInstances.length * bladesPerPatch * 2;
    const totalFloraQuads = this.enableFlora ? this.floraCount * 2 : 0;
    console.log("Vegetation init", {
      grassPatches: this.grassPatchInstances.length,
      bladesPerPatch,
      grassQuads: totalGrassQuads,
      floraCount: this.enableFlora ? this.floraCount : 0,
      totalTransparentQuads: totalGrassQuads + totalFloraQuads
    });
  }

  initFloraSystem() {
    if (!this.enableFlora) return;

    this.flora = new MyFlora(this);
    this.floraTextures = [
      "images/flora/flower_1.png",
      "images/flora/flower_2.png",
      "images/flora/fern.png",
      "images/flora/weed.png",
      "images/flora/tall_weed.png",
      "images/flora/small_shrub.png"
    ].map((path) => new CGFtexture(this, path));

    this.floraAppearances = this.floraTextures.map((texture) => {
      const appearance = new CGFappearance(this);
      appearance.setAmbient(1.0, 1.0, 1.0, 1.0);
      appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
      appearance.setSpecular(0.0, 0.0, 0.0, 1.0);
      appearance.setEmission(0.0, 0.0, 0.0, 1.0);
      appearance.setShininess(1.0);
      appearance.setTexture(texture);
      appearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
      return appearance;
    });

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
      if (this.isInsidePond(x, z)) continue;
      if (this.getTerrainSlope(x, z) > this.grassFlatSlope) continue;

      const y = this.terrain.getHeightAt(x, z);
      const scale = this.grassPatchMinScale + (this.grassPatchMaxScale - this.grassPatchMinScale) * random();
      const rotation = random() * Math.PI * 2;
      const tint = 0.8 + 0.3 * random();

      const blades = [];
      const bladeCount =
        this.grassBladesMin + Math.floor(random() * (this.grassBladesMax - this.grassBladesMin + 1));
      for (let b = 0; b < bladeCount; b++) {
        const angle = random() * Math.PI * 2;
        const radius = 0.03 + 0.08 * random();
        blades.push({
          offsetX: Math.cos(angle) * radius,
          offsetZ: Math.sin(angle) * radius,
          rotation: random() * Math.PI * 2,
          scale: 0.8 + 0.35 * random(),
          textureIndex: Math.floor(random() * this.grassAppearances.length)
        });
      }

      patches.push({
          x,
          z,
          y,
          rotation,
          scale,
          tint,
          textureIndex: Math.floor(random() * this.grassAppearances.length),
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
      if (this.isInsidePond(x, z)) continue;
      if (this.getTerrainSlope(x, z) > this.floraFlatSlope) continue;

      const y = this.terrain.getHeightAt(x, z);
      flora.push({
        x,
        z,
        y,
        rotation: random() * Math.PI * 2,
        scale: this.floraMinScale + (this.floraMaxScale - this.floraMinScale) * random(),
        tint: 0.85 + 0.3 * random(),
        textureIndex: Math.floor(random() * this.floraAppearances.length),
        tilt: (random() - 0.5) * 0.2
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

  isInsidePond(x, z) {
    if (!this.pondInstances) return false;
    for (const pond of this.pondInstances) {
      const dx = x - pond.x;
      const dz = z - pond.z;
      const nx = dx / pond.scaleX;
      const nz = dz / pond.scaleZ;
      if (nx * nx + nz * nz < 1.1) return true;
    }
    return false;
  }

  generateScatter(count, minScale, maxScale) {
    const items = [];
    const maxAttempts = count * 12;

    for (let i = 0; i < maxAttempts && items.length < count; i++) {
      const x = (this.random() * 2 - 1) * this.scatterBounds;
      const z = (this.random() * 2 - 1) * this.scatterBounds;
      const centerDist = Math.hypot(x, z);
      if (centerDist < this.centerClearRadius) continue;

      const scale = minScale + (maxScale - minScale) * this.random();
      const rotation = this.random() * Math.PI * 2;
      const tint = 0.85 + 0.3 * this.random();

      items.push({ x, z, scale, rotation, tint });
    }

    return items;
  }

  applyTintedAppearance(appearance, tint) {
    const base = appearance;
    const diffuse = base.diffuse;
    base.setDiffuse(diffuse[0] * tint, diffuse[1] * tint, diffuse[2] * tint, diffuse[3]);
    base.apply();
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    // Sky dome
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


    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor, 0.0, 0.0, 0.0,
      0.0, this.scaleFactor, 0.0, 0.0,
      0.0, 0.0, this.scaleFactor, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
    this.multMatrix(sca);

    // Draw Ground
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

    this.displayScatter();

    this.displayGrass();
    this.displayFlora();

    this.displayPonds();
  }

  displayGrass() {
  if (!this.enableGrass || !this.grassPatchInstances) return;

  this.gl.enable(this.gl.BLEND);
  this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  this.gl.disable(this.gl.CULL_FACE);
  this.gl.depthMask(true);

  for (const patch of this.grassPatchInstances) {
    const textureIndex = patch.textureIndex ?? 0;
    const appearance = this.grassAppearances[textureIndex];

    this.pushMatrix();
    this.translate(patch.x, patch.y + 0.02, patch.z);
    this.rotate(patch.rotation, 0, 1, 0);
    this.scale(patch.scale, patch.scale, patch.scale);

    appearance.apply();
    if (patch.blades && patch.blades.length > 0) {
    this.grassPatch.display(patch.blades, textureIndex);
  }

    this.popMatrix();
  }

  this.gl.enable(this.gl.CULL_FACE);
  this.gl.disable(this.gl.BLEND);
}

  displayFlora() {
    if (!this.enableFlora || !this.floraInstances) return;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.depthMask(false);

    const appearance = this.grassAppearances[0];
    for (const patch of this.grassPatchInstances) {
      this.pushMatrix();
      this.translate(patch.x, patch.y, patch.z);
      this.rotate(patch.rotation, 0, 1, 0);
      this.scale(patch.scale, patch.scale, patch.scale);
      this.applyTintedTexture(appearance, patch.tint, 1.0);
      this.grassPatch.display(patch.blades);
      this.popMatrix();
    }
    

    this.gl.depthMask(true);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.disable(this.gl.BLEND);
  }

  applyTintedTexture(appearance, tint, alpha) {
    appearance.setAmbient(tint, tint, tint, alpha);
    appearance.setDiffuse(tint, tint, tint, alpha);
    appearance.apply();
  }

  displayPonds() {
    if (!this.enablePonds || !this.pondInstances) return;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthMask(true);

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
  }

  displayScatter() {
    for (const rock of this.rockInstances) {
      const y = this.terrain.getHeightAt(rock.x, rock.z);
      this.pushMatrix();
      this.translate(rock.x, y, rock.z);
      this.rotate(rock.rotation, 0, 1, 0);
      this.scale(rock.scale, rock.scale * 0.7, rock.scale);
      this.applyTintedAppearance(this.rockAppearance, rock.tint);
      this.rock.display();
      this.popMatrix();
    }

    for (const tree of this.pineInstances) {
      const y = this.terrain.getHeightAt(tree.x, tree.z);
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
      const y = this.terrain.getHeightAt(tree.x, tree.z);
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
      const y = this.terrain.getHeightAt(tree.x, tree.z);
      this.pushMatrix();
      this.translate(tree.x, y, tree.z);
      this.rotate(tree.rotation, 0, 1, 0);
      this.scale(tree.scale, tree.scale, tree.scale);
      this.trunkAppearance.apply();
      this.deadTree.display();
      this.popMatrix();
    }

    for (const clump of this.grassInstances) {
      const y = this.terrain.getHeightAt(clump.x, clump.z) + 0.02;
      this.pushMatrix();
      this.translate(clump.x, y, clump.z);
      this.rotate(clump.rotation, 0, 1, 0);
      this.scale(clump.scale, clump.scale, clump.scale);
      this.applyTintedAppearance(this.grassAppearance, clump.tint);
      this.grassClump.display();
      this.popMatrix();
    }
  }
}