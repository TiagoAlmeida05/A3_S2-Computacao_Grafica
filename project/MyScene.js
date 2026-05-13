import { CGFscene, CGFcamera, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
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
    this.plane = new MyPlane(this, 200, 100);
    this.sky = new MySphere(this, 200, 100, 80, true, false, 1, 1); 
    
    this.cloudRotation = 0;
    this.setUpdatePeriod(50);

    this.greenAppearance = new CGFappearance(this);
    this.greenAppearance.setAmbient(0.25, 0.6, 0.25, 1.0);
    this.greenAppearance.setDiffuse(0.25, 0.6, 0.25, 1.0);
    this.greenAppearance.setSpecular(0.2, 0.35, 0.2, 1.0);
    this.greenAppearance.setEmission(0.0, 0.1, 0.0, 1.0);
    this.greenAppearance.setShininess(10.0);

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
    this.greenAppearance.apply();
    if (this.displayPlane) this.plane.display();
  }
}