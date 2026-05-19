import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyTerrain } from "./MyTerrain.js";
import { MySphere } from "./MySphere.js";

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
      200,
      1.5,
      "images/heightmaps/heightmap_attempt_1.png",
      8,
      1
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

    this.skyAppearance = new CGFappearance(this);
    this.skyAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.skyAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.skyAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setEmission(1.0, 1.0, 1.0, 1.0);
    this.skyAppearance.setShininess(1.0);
    this.skyAppearance.loadTexture('images/skyline/sky_panorama.jpg');
    this.skyAppearance.setTextureWrap('REPEAT', 'CLAMP_TO_EDGE');

    this.displayPlane = true;
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
  }
}