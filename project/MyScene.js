import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyTerrain } from "./MyTerrain.js";
import { MySphere } from "./MySphere.js";
import { MyCloudLayer } from "./MyCloud.js";
import { MyLowPolyRock } from "./MyLowPolyRock.js";
import { MyPineTree } from "./MyPineTree.js";
import { MyLeafyTree } from "./MyLeafyTree.js";
import { MyDeadTree } from "./MyDeadTree.js";
import { MyGrassClump } from "./MyGrassClump.js";
import { MyWaterPond } from "./MyWaterPond.js";
import { MyGrassBlade } from "./MyGrassBlade.js";
import { MyFlora } from "./MyFlora.js";
import { MyWagon } from './MyWagon.js';
import { MyBarn } from "./MyBarn.js";
import { MyHayPickup } from "./MyHayPickup.js";

export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);
    

    this.sunDirection = [-100, 150, 10];

    this.initCameras();
    this.initLights();

    this.enableTextures(true);

    this.gl.clearColor(0.38, 0.72, 0.95, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.NORMALIZE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.scaleFactor = 1.0;

    this.axis = new CGFaxis(this);
    this.terrain = new MyTerrain(
      this,
      200,
      100,
      7.0,
      8,
      2,
      0.045,
      4,
      0.45,
      1.85,
      1337
    );
    this.sky = new MySphere(this, 260, 48, 24, true, true, 1, 1);

    this.barn = new MyBarn(this);

    this.isWagonInDropZone = false;

    this.enableClouds = true;
    this.cloudSpeed = 0.9;
    this.cloudOpacity = 0.72;
    this.cloudCount = 30;
    this.cloudTime = 0;
    this.cloudDirection = null;
    this.cloudSeed = 20240620;
    this.cloudBounds = this.terrain.size * 0.9;
    
    this.skyTime = 0;
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

    this.barnMaterials = {
      barnRed: new CGFappearance(this),
      trimWhite: new CGFappearance(this),
      roofDark: new CGFappearance(this),
      windowBlue: new CGFappearance(this),
      zoneNormal: new CGFappearance(this),
      zoneActive: new CGFappearance(this)
    };

    this.barnMaterials.barnRed.setAmbient(0.6, 0.12, 0.12, 1.0);
    this.barnMaterials.barnRed.setDiffuse(0.75, 0.15, 0.15, 1.0);
    this.barnMaterials.barnRed.loadTexture("images/textures/barn_diffuse.jpg");
    this.barnMaterials.barnRed.setTextureWrap("REPEAT", "REPEAT");

    this.barnMaterials.trimWhite.setAmbient(0.8, 0.8, 0.8, 1.0);
    this.barnMaterials.trimWhite.setDiffuse(0.95, 0.95, 0.95, 1.0);

    this.barnMaterials.roofDark.setAmbient(0.18, 0.18, 0.2, 1.0);
    this.barnMaterials.roofDark.setDiffuse(0.25, 0.25, 0.28, 1.0);
    this.barnMaterials.roofDark.loadTexture("images/textures/roof_diffuse.jpg");
    this.barnMaterials.roofDark.setTextureWrap("REPEAT", "REPEAT");

    this.barnMaterials.windowBlue.setAmbient(0.3, 0.6, 0.8, 1.0);
    this.barnMaterials.windowBlue.setDiffuse(0.4, 0.75, 0.95, 1.0);
    this.barnMaterials.windowBlue.loadTexture("images/textures/window_diffuse.svg");
    this.barnMaterials.windowBlue.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

    this.barnMaterials.zoneNormal.setAmbient(0.1, 0.5, 0.1, 0.4);
    this.barnMaterials.zoneNormal.setDiffuse(0.2, 0.7, 0.2, 0.5);

    this.barnMaterials.zoneActive.setAmbient(0.6, 0.4, 0.1, 0.6);
    this.barnMaterials.zoneActive.setDiffuse(0.9, 0.6, 0.1, 0.7);

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

    this.skyShader = new CGFshader(
      this.gl,
      "shaders/sky.vert",
      "shaders/sky.frag"
    );

    this.cloudShader = new CGFshader(
      this.gl,
      "shaders/cloud.vert",
      "shaders/cloud.frag"
    );

    this.grassWindShader = new CGFshader(
      this.gl,
      "shaders/grass.vert",
      "shaders/grass.frag"
    );

    this.arrowShader = new CGFshader(
      this.gl,
      "shaders/arrow.vert",
      "shaders/arrow.frag"
    );


    this.windTime = 0;
    this.enableWind = true;
    this.windDirection = [1.0, 0.25];
    this.windStrength = 0.35;
    this.cloudDirection = [this.windDirection[0], this.windDirection[1]];

    this.enablePonds = true;
    this.pondCount = 6;
    this.pondLowHeightThreshold = 0.6;
    this.pondMinRadius = 5.0;
    this.pondMaxRadius = 8.0;
    this.pondDistortion = 0.25;

    this.enableGrass = true;
    this.enableFlora = true;
    this.grassPatchCount = 55;
    this.grassPatchMinScale = 2.0;
    this.grassPatchMaxScale = 3.6;
    this.grassBladesMin = 45;
    this.grassBladesMax = 85;
    this.grassDeadPatchChance = 0.15;
    this.grassFlatSlope = 0.5;
    this.grassMaxDistance = 60;
    this.grassMaxTotalBlades = 5000;
    this.grassLodNear = 16;
    this.grassLodMid = 28;
    this.grassPatchHeightScale = 0.75;

    this.wagonInput = { forward: false, braking: false, left: false, right: false, pickup: false, drop: false };    this.wagonPosition = { x: 10, z: 10 };
    this.wagonHeading = Math.PI;
    this.wagonSpeed = 0;
    this.wagonSteering = 0;
    this.wagonWheelAngle = 0;
    this.wagonMaxSpeed = 8.0;
    this.wagonAcceleration = 10.0;
    this.wagonBrakeRate = 12.0;
    this.wagonTurnRate = 1.35;
    this.wagonSteerRate = 3.4;
    this.wagonSteerReturnRate = 1.8;
    this.wagonMaxSteer = Math.PI / 5;
    this.wagonWheelRadius = 0.52;
    this.wagonGroundClearance = 0;
    this.wagonTrackWidth = 2.22;
    this.wagonWheelBase = 2.4;
    this.dropZoneCenter = { x: 0, z: 2.3 };
    this.dropZoneRadius = 3.5;

    this.initGameplayUIState();

    this.firstPersonCamera = false;
    this.driverEyeHeight = 1.56;
    this.driverSeatOffset = 2.01;
    this.driverLookAhead = 14.0;
    this.chaseDistance = 23.0;
    this.chaseHeight = 6.0;
    this.chaseSideOffset = 13.0;
    this.chaseOrbitAngle = Math.atan2(this.chaseSideOffset, this.chaseDistance);
    this.chaseLookAhead = 2.0;
    this.chaseLookHeight = 1.32;
    this.lastUpdateTime = null;
    this.carriedHayCount = 0;

    this.floraCount = 35;
    this.floraMinScale = 0.7;
    this.floraMaxScale = 1.6;
    this.floraFlatSlope = 0.45;

    this.wagon = new MyWagon(this);

    this.displayPlane = true;

    this.hayPickups = [];
    this.maxHayPickups = 6;
    this.carriedHayCount = 0;
    this.maxCarriedHay = 2;
    
    
    this.initHayPickups();
    this.initCloudSystem();
    this.initWaterPonds();
    this.initScatterElements();
    this.initGrassSystem();
    this.initFloraSystem();
  }

  initGameplayUIState() {
    this.maxHealthPoints = 100;
    this.currentHealthPoints = this.maxHealthPoints;
    this.healthLossPerSecond = 1.0;
    this.healthPercent = 100;
    this.totalDamageTaken = 0;
    this.totalHealthRestored = 0;
    this.balesAtBarn = 0;
    this.scoreTime = 0;
    this.scoreValue = 0;
    this.scoreLabel = "0";
    this.healthLabel = "100 / 100 HP";
    this.gameStatus = "START";
    this.lastGameplayUpdateTime = null;

    this.wagonHitboxRadius = 0.9; 
    this.collisionCooldown = 0;
  }

  applyHealthDamage(amount) {
    const damage = Math.max(0, amount);
    if (damage <= 0) return;

    this.totalDamageTaken += damage; 
    this.currentHealthPoints = this.clamp(
      this.currentHealthPoints - damage,
      0,
      this.maxHealthPoints
    );
    this.updateGameplayLabels();
  }

  applyHealthRestoration(amount) {
    const restored = Math.max(0, amount);
    if (restored <= 0) return;

    this.totalHealthRestored += restored;
    this.currentHealthPoints = this.clamp(
      this.currentHealthPoints + restored,
      0,
      this.maxHealthPoints
    );
    this.updateGameplayLabels();
  }

  updateGameplayLabels() {
    const displayedHealth = Number(this.currentHealthPoints.toFixed(1));
    this.healthPercent = this.maxHealthPoints > 0
      ? Number(((displayedHealth / this.maxHealthPoints) * 100).toFixed(1))
      : 0;
    this.healthLabel = `${displayedHealth.toFixed(1)} / ${this.maxHealthPoints} HP`;
    
    this.scoreValue = Math.floor(this.scoreTime);
    this.scoreLabel = `${this.scoreValue}`;

    if (this.currentHealthPoints <= 0 && this.gameStatus === "Running") {
      this.currentHealthPoints = 0; 
      this.gameOver();
    }
  }

  checkCollisions(dt) {
    if (this.collisionCooldown > 0) this.collisionCooldown -= dt;

    if (this.collisionCooldown <= 0) {
      let hitSolid = false;
      const obstacles = [...this.rockInstances, ...this.pineInstances, ...this.leafyInstances, ...this.deadInstances];
      
      for (const item of obstacles) {
        const dist = Math.hypot(this.wagonPosition.x - item.x, this.wagonPosition.z - item.z);
        if (dist < (item.scale * 1.5) + this.wagonHitboxRadius) {
          hitSolid = true; break;
        }
      }

      if (hitSolid) {
        this.applyHealthDamage(10);
        this.collisionCooldown = 1.5;
        this.wagonSpeed *= 0.3;
      }
    }

    let inWater = false;
    if (this.pondInstances) {
      for (const pond of this.pondInstances) {
        const pondRadius = Math.max(pond.scaleX, pond.scaleZ) * 0.8;
        if (Math.hypot(this.wagonPosition.x - pond.x, this.wagonPosition.z - pond.z) < pondRadius) {
          inWater = true; break;
        }
      }
    }

    if (inWater) {
      this.applyHealthDamage(5.0 * dt); 
    }

    return this.healthLossPerSecond;
  }

  updateGameplayUI(currTime) {
    if (this.lastGameplayUpdateTime === null) {
      this.lastGameplayUpdateTime = currTime;
      this.updateGameplayLabels();
      return;
    }

    const dt = Math.min((currTime - this.lastGameplayUpdateTime) * 0.001, 0.1);
    this.lastGameplayUpdateTime = currTime;
    
    if (this.gameStatus !== "Running") return; 
    if (dt <= 0) return;

    this.scoreTime += dt;

    this.checkCollisions(dt);

    if (this.currentHealthPoints > 0) {
      this.currentHealthPoints = this.clamp(
        this.currentHealthPoints - (this.healthLossPerSecond * dt),
        0,
        this.maxHealthPoints
      );
    }

    this.updateGameplayLabels();
  }

  initLights() {
    this.lights[0].setPosition(this.sunDirection[0], this.sunDirection[1], this.sunDirection[2], 0); 
    
    this.lights[0].setAmbient(0.2, 0.2, 0.2, 1.0);
    this.lights[0].setDiffuse(1.0, 0.95, 0.8, 1.0);
    this.lights[0].setSpecular(1.0, 0.95, 0.8, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.thirdPersonCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 1.7, 25), vec3.fromValues(0, 1.0, 24));
    this.wagonCamera = new CGFcamera(0.75, 0.1, 500, vec3.fromValues(0, 2.5, 0), vec3.fromValues(0, 2.5, -1));
    this.camera = this.thirdPersonCamera;
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
    this.pineInstances = this.generateScatter(8, 3.2, 5.5, 0.45);   
    this.leafyInstances = this.generateScatter(6, 2.8, 4.8, 0.45);  
    this.deadInstances = this.generateScatter(3, 1.2, 1.8, 0.45);
    this.grassInstances = this.generateScatter(24, 0.4, 0.9, 0.5);
  }

  initHayPickups() {
    this.hayPickups = [];
    const random = this.createSeededRandom(this.scatterSeed + 99);
    const halfSize = this.terrain.size * 0.5 * 0.85;
    let attempts = 0;

    while (this.hayPickups.length < this.maxHayPickups && attempts < 150) {
        attempts++;
        const x = (random() * 2 - 1) * halfSize;
        const z = (random() * 2 - 1) * halfSize;

        if (Math.hypot(x, z) < this.centerClearRadius + 4) continue;
        if (this.isInsidePond(x, z, 2.0)) continue;
        if (this.getTerrainSlope(x, z) > 0.4) continue;

        const y = this.getGroundY(x, z, 0.4); // Offset slightly above terrain height
        this.hayPickups.push(new MyHayPickup(this, x, z, y));
    }
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

  initCloudSystem() {
    this.cloudInstances = this.generateCloudInstances();
    if (this.cloudLayer) {
      this.cloudLayer.setInstances(this.cloudInstances);
      return;
    }

    this.cloudLayer = new MyCloudLayer(this, this.cloudInstances, this.cloudShader);
  }

  gameOver() {
    this.gameStatus = "GAMEOVER";
    this.wagonSpeed = 0;
  }

  generateCloudInstances() {
    const clouds = [];
    const random = this.createSeededRandom(this.cloudSeed);
    const count = Math.max(8, Math.floor(this.cloudCount || 0));
    const bounds = this.cloudBounds || this.terrain.size * 0.9;

    for (let i = 0; i < count; i++) {
      const x = (random() * 2 - 1) * bounds;
      const z = (random() * 2 - 1) * bounds;
      const y = 58 + 32 * random();
      const width = 18 + 27 * random();
      const height = 7 + 9 * random();
      const depth = 3 + 7 * random();
      const puffCount = 18 + Math.floor(random() * 18);
      const puffs = [];

      const addPuff = (offsetX, offsetY, offsetZ, scaleX, scaleY, opacity, depthBias = 0) => {
        puffs.push({
          offsetX,
          offsetY,
          offsetZ,
          offsetD: depthBias + (random() - 0.5) * depth * 0.2,
          scaleX,
          scaleY,
          opacity,
          rotation: (random() - 0.5) * 0.6,
          seed: random() * 1000.0
        });
      };

      const baseCount = 6 + Math.floor(random() * 5);
      for (let b = 0; b < baseCount; b++) {
        const t = baseCount === 1 ? 0.5 : b / (baseCount - 1);
        const xPos = (t - 0.5) * width * 0.9 + (random() - 0.5) * width * 0.06;
        const yPos = (random() - 0.5) * height * 0.08 - height * 0.18;
        const zPos = (random() - 0.5) * depth * 0.35;
        const sx = 4.5 + 3.5 * random();
        const sy = 2.0 + 1.6 * random();
        addPuff(xPos, yPos, zPos, sx, sy, 0.55 + 0.2 * random());
      }

      const bodyCount = 5 + Math.floor(random() * 4);
      for (let b = 0; b < bodyCount; b++) {
        const t = bodyCount === 1 ? 0.5 : b / (bodyCount - 1);
        const xPos = (t - 0.5) * width * 0.6 + (random() - 0.5) * width * 0.12;
        const yPos = height * (0.1 + 0.25 * random());
        const zPos = (random() - 0.5) * depth * 0.55;
        const sx = 5.5 + 3.5 * random();
        const sy = 3.6 + 3.0 * random();
        addPuff(xPos, yPos, zPos, sx, sy, 0.68 + 0.2 * random());
      }

      const topCount = 3 + Math.floor(random() * 3);
      for (let t = 0; t < topCount; t++) {
        const xPos = (random() - 0.5) * width * 0.45;
        const yPos = height * (0.4 + 0.35 * random());
        const zPos = (random() - 0.5) * depth * 0.45;
        const sx = 4.8 + 3.2 * random();
        const sy = 4.2 + 3.0 * random();
        addPuff(xPos, yPos, zPos, sx, sy, 0.75 + 0.2 * random());
      }

      const sideCount = 2 + Math.floor(random() * 3);
      for (let s = 0; s < sideCount; s++) {
        const side = random() < 0.5 ? -1 : 1;
        const xPos = side * width * (0.48 + 0.08 * random());
        const yPos = height * (0.1 + 0.4 * random());
        const zPos = (random() - 0.5) * depth * 0.45;
        const sx = 3.5 + 2.0 * random();
        const sy = 2.6 + 1.6 * random();
        addPuff(xPos, yPos, zPos, sx, sy, 0.55 + 0.2 * random());
      }

      const backCount = 2 + Math.floor(random() * 3);
      for (let r = 0; r < backCount; r++) {
        const xPos = (random() - 0.5) * width * 0.55;
        const yPos = height * (0.05 + 0.25 * random());
        const zPos = depth * (0.35 + 0.25 * random());
        const sx = 4.0 + 2.6 * random();
        const sy = 2.4 + 1.8 * random();
        addPuff(xPos, yPos, zPos, sx, sy, 0.5 + 0.2 * random(), depth * 0.2);
      }

      while (puffs.length < puffCount) {
        const xPos = (random() - 0.5) * width * 0.5;
        const yPos = height * (0.05 + 0.55 * random());
        const zPos = (random() - 0.5) * depth * 0.5;
        const sx = 4.0 + 3.0 * random();
        const sy = 2.6 + 2.6 * random();
        addPuff(xPos, yPos, zPos, sx, sy, 0.6 + 0.2 * random());
      }

      clouds.push({
        x,
        y,
        z,
        scaleX: 1.0,
        scaleY: 1.0,
        scaleZ: 1.0,
        rotation: random() * Math.PI * 2,
        speed: 0.65 + 0.6 * random(),
        puffs
      });
    }

    return clouds;
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
    this.translate(0, -50, 0);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.depthMask(false);
    this.gl.disable(this.gl.CULL_FACE);
    this.setActiveShader(this.skyShader);
    this.skyShader.setUniformsValues({
      uTime: this.skyTime,
      uSunDirection: this.sunDirection
    });
    
    this.sky.display();
    this.setActiveShader(this.defaultShader);

    this.gl.disable(this.gl.BLEND);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthMask(true);
    this.gl.enable(this.gl.CULL_FACE); 
    this.popMatrix();
    
    this.pushMatrix();

    this.displayClouds();

    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor, 0.0, 0.0, 0.0,
      0.0, this.scaleFactor, 0.0, 0.0,
      0.0, 0.0, this.scaleFactor, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ];
    this.multMatrix(sca);

    this.displayWagon();

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

    const currentTimeMillis = typeof performance !== "undefined" ? performance.now() : 0;
    for (const pickup of this.hayPickups) {
        const distanceToWagon = Math.hypot(this.wagonPosition.x - pickup.x, this.wagonPosition.z - pickup.z);
        const isNearWagon = distanceToWagon < 80.0; 
        
        pickup.display(currentTimeMillis, isNearWagon);
    }

    this.pushMatrix();
    this.translate(0, this.getGroundY(0, 0), -4.0);
    this.barn.display(this.barnMaterials, this.isWagonInDropZone);
    this.popMatrix();

    this.displayGrass();
    this.displayFlora();

    this.popMatrix();
  }

  getLocalPointOnWagon(localX, localZ) {
    const cosR = Math.cos(this.wagonHeading);
    const sinR = Math.sin(this.wagonHeading);
    return {
      x: this.wagonPosition.x + localX * cosR + localZ * sinR,
      z: this.wagonPosition.z - localX * sinR + localZ * cosR
    };
  }

  getWagonTerrainPose() {
    const halfBase = this.wagonWheelBase * 0.5;
    const halfTrack = this.wagonTrackWidth * 0.5;
    const center = this.wagonPosition;
    const front = this.getLocalPointOnWagon(0, halfBase);
    const rear = this.getLocalPointOnWagon(0, -halfBase);
    const left = this.getLocalPointOnWagon(-halfTrack, 0);
    const right = this.getLocalPointOnWagon(halfTrack, 0);

    const centerHeight = this.terrain.getHeightAt(center.x, center.z);
    const frontHeight = this.terrain.getHeightAt(front.x, front.z);
    const rearHeight = this.terrain.getHeightAt(rear.x, rear.z);
    const leftHeight = this.terrain.getHeightAt(left.x, left.z);
    const rightHeight = this.terrain.getHeightAt(right.x, right.z);
    const averageHeight = (centerHeight * 2 + frontHeight + rearHeight + leftHeight + rightHeight) / 6;
    const pitch = Math.atan2(frontHeight - rearHeight, this.wagonWheelBase);
    const roll = Math.atan2(rightHeight - leftHeight, this.wagonTrackWidth);

    const contactPoints = [
      { x: -halfTrack, z: -halfBase, localY: 0.7 - this.wagonWheelRadius },
      { x: halfTrack, z: -halfBase, localY: 0.7 - this.wagonWheelRadius },
      { x: -halfTrack, z: halfBase, localY: 0.7 - this.wagonWheelRadius },
      { x: halfTrack, z: halfBase, localY: 0.7 - this.wagonWheelRadius },
      { x: -0.78, z: 6.25, localY: 0.04 },
      { x: 0.78, z: 6.25, localY: 0.04 }
    ];

    let requiredY = averageHeight + this.wagonGroundClearance;
    for (const point of contactPoints) {
      const world = this.getLocalPointOnWagon(point.x, point.z);
      const groundY = this.terrain.getHeightAt(world.x, world.z);
      const rotatedLocalY =
        point.localY * Math.cos(pitch) * Math.cos(roll) +
        point.z * Math.sin(pitch) -
        point.x * Math.sin(roll);
      requiredY = Math.max(requiredY, groundY - rotatedLocalY + this.wagonGroundClearance);
    }

    return {
      y: requiredY,
      pitch,
      roll
    };
  }

  displayWagon() {
    if (!this.wagon) return;

    const pose = this.getWagonTerrainPose();
    this.pushMatrix();
    this.translate(this.wagonPosition.x, pose.y, this.wagonPosition.z);
    this.rotate(this.wagonHeading, 0, 1, 0);
    this.rotate(-pose.pitch, 1, 0, 0);
    this.rotate(pose.roll, 0, 0, 1);
    
    this.scale(0.6, 0.6, 0.6);
    
    this.wagon.display(this.wagonWheelAngle, this.wagonSteering);
    this.popMatrix();
  }

  updateActiveCamera() {
    this.camera = this.firstPersonCamera ? this.wagonCamera : this.thirdPersonCamera;
    const pose = this.getWagonTerrainPose();
    const horizontalForwardX = Math.sin(this.wagonHeading);
    const horizontalForwardZ = Math.cos(this.wagonHeading);
    const rightX = Math.cos(this.wagonHeading);
    const rightZ = -Math.sin(this.wagonHeading);

    if (!this.firstPersonCamera && this.thirdPersonCamera) {
      const orbitBack = Math.cos(this.chaseOrbitAngle);
      const orbitSide = Math.sin(this.chaseOrbitAngle);
      const eye = vec3.fromValues(
        this.wagonPosition.x - horizontalForwardX * this.chaseDistance * orbitBack + rightX * this.chaseDistance * orbitSide,
        pose.y + this.chaseHeight,
        this.wagonPosition.z - horizontalForwardZ * this.chaseDistance * orbitBack + rightZ * this.chaseDistance * orbitSide
      );
      this.chaseSideOffset = this.chaseDistance * orbitSide;
      const target = vec3.fromValues(
        this.wagonPosition.x + horizontalForwardX * this.chaseLookAhead,
        pose.y + this.chaseLookHeight,
        this.wagonPosition.z + horizontalForwardZ * this.chaseLookAhead
      );
      this.thirdPersonCamera.setPosition(eye);
      this.thirdPersonCamera.setTarget(target);
      return;
    }

    if (!this.wagonCamera) return;

    const pitchedForwardY = Math.sin(pose.pitch);
    const pitchedForwardScale = Math.cos(pose.pitch);
    const forwardX = horizontalForwardX * pitchedForwardScale;
    const forwardZ = horizontalForwardZ * pitchedForwardScale;
    const eye = vec3.fromValues(
      this.wagonPosition.x + forwardX * this.driverSeatOffset,
      pose.y + this.driverEyeHeight + Math.sin(pose.pitch) * this.driverSeatOffset,
      this.wagonPosition.z + forwardZ * this.driverSeatOffset
    );
    const target = vec3.fromValues(
      eye[0] + forwardX * this.driverLookAhead,
      eye[1] + pitchedForwardY * this.driverLookAhead,
      eye[2] + forwardZ * this.driverLookAhead
    );

    this.wagonCamera.setPosition(eye);
    this.wagonCamera.setTarget(target);
  }

  approach(current, target, maxStep) {
    const delta = target - current;
    if (Math.abs(delta) <= maxStep) return target;
    return current + Math.sign(delta) * maxStep;
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  updateDropZoneStatus() {
    this.isWagonInDropZone =
      Math.hypot(
        this.wagonPosition.x - this.dropZoneCenter.x,
        this.wagonPosition.z - this.dropZoneCenter.z
      ) <= this.dropZoneRadius;
  }

  updateWagon(currTime) {
    if (this.lastUpdateTime === null) {
      this.lastUpdateTime = currTime;
      return;
    }

    const dt = Math.min((currTime - this.lastUpdateTime) * 0.001, 0.1);
    this.lastUpdateTime = currTime;
    
    if (this.gameStatus !== "Running") return;

    if (dt <= 0) return;

    const steerInput = (this.wagonInput.left ? 1 : 0) - (this.wagonInput.right ? 1 : 0);
    const steerRate = steerInput === 0 ? this.wagonSteerReturnRate : this.wagonSteerRate;
    this.wagonSteering = this.approach(
      this.wagonSteering,
      steerInput * this.wagonMaxSteer,
      steerRate * dt
    );

    const isBraking = this.wagonInput.braking;
    const isForward = this.wagonInput.forward && !isBraking;

    const targetSpeed = isForward ? this.wagonMaxSpeed : 0;
    const speedRate = isBraking ? this.wagonBrakeRate : this.wagonAcceleration;
    this.wagonSpeed = this.approach(this.wagonSpeed, targetSpeed, speedRate * dt);

    if (Math.abs(this.wagonSpeed) < 0.001) {
      this.wagonSpeed = 0;
      return;
    }

    const distance = this.wagonSpeed * dt;
    const directionSign = this.wagonSpeed >= 0 ? 1 : -1;
    this.wagonHeading += this.wagonSteering * this.wagonTurnRate * dt * directionSign;
    this.wagonPosition.x += Math.sin(this.wagonHeading) * distance;
    this.wagonPosition.z += Math.cos(this.wagonHeading) * distance;

    const bounds = this.terrain.size * 0.5 - 4.0;
    this.wagonPosition.x = this.clamp(this.wagonPosition.x, -bounds, bounds);
    this.wagonPosition.z = this.clamp(this.wagonPosition.z, -bounds, bounds);
    this.wagonWheelAngle -= distance / this.wagonWheelRadius;
    this.updateDropZoneStatus();

      if (this.wagon && this.wagon.update) {
          this.wagon.update(this.wagonSpeed, dt);
      }
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

  displayClouds() {
    if (!this.enableClouds || !this.cloudLayer || !this.cloudInstances) return;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthMask(false);

    const dir = this.cloudDirection || [1.0, 0.0];
    const len = Math.hypot(dir[0], dir[1]) || 1.0;
    const dirX = dir[0] / len;
    const dirZ = dir[1] / len;
    const movement = this.cloudTime * this.cloudSpeed * 6.0;

    this.cloudLayer.display(
      this.cloudTime,
      this.camera,
      this.sunDirection,
      this.cloudOpacity,
      dirX,
      dirZ,
      movement,
      this.cloudBounds
    );

    this.gl.depthMask(true);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.disable(this.gl.BLEND);
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
    this.skyTime = currTime * 0.001;
    this.cloudTime = currTime * 0.001;

    this.updateGameplayUI(currTime);
    this.updateWagon(currTime);
    this.updateDropZoneStatus();
    
    if (this.gameStatus === "Running") {
        this.checkHayGameplayInteractions();
    }

    this.updateActiveCamera();
  }

  checkHayGameplayInteractions() {
    if (this.wagonInput.pickup) {
        for (const pickup of this.hayPickups) {
            if (pickup.isPickedUp) continue;

            const distanceToWagon = Math.hypot(this.wagonPosition.x - pickup.x, this.wagonPosition.z - pickup.z);
            
            if (distanceToWagon < (this.wagonHitboxRadius + 2.0)) {
                if (this.carriedHayCount < this.maxCarriedHay) {
                    pickup.isPickedUp = true;
                    this.carriedHayCount++;
                    this.wagonInput.pickup = false; 
                    break;
                }
            }
        }
    }

    if (this.wagonInput.drop && this.isWagonInDropZone) {
        if (this.carriedHayCount > 0) {
            this.balesAtBarn += this.carriedHayCount;
            
            const hpReward = 20 * this.carriedHayCount;
            this.applyHealthRestoration(hpReward);

            this.carriedHayCount = 0; 
            this.wagonInput.drop = false;

            if (this.hayPickups.every(p => p.isPickedUp)) {
                this.initHayPickups();
            }
        }
    }
  }
}