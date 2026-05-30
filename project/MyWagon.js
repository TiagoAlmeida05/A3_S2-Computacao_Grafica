import { CGFobject, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";
import { MyCylinder } from "./MyCylinder.js";
import { MyHalfCylinder } from "./MyHalfCylinder.js";
import { MySphere } from "./MySphere.js";
import { MyHorse } from "./MyHorse.js";
import { MyHayBale } from "./MyHayBale.js";

export class MyWagon extends CGFobject {
  constructor(scene) {
    super(scene);

    this.woodTexture = new CGFtexture(this.scene, "images/textures/wood.jpg");
    this.fabricTexture = new CGFtexture(this.scene, "images/textures/fabric.jpg");

    this.box = new MyUnitCubeQuad(
      this.scene,
      this.woodTexture,
      this.woodTexture,
      this.woodTexture,
      this.woodTexture,
      this.woodTexture,
      this.woodTexture
    );
    this.cylinderMesh = new MyCylinder(this.scene, 24, 1);
    this.roof = new MyHalfCylinder(this.scene, 24, 1);
    this.sphereMesh = new MySphere(this.scene, 1, 14, 8, false, false, 1, 1);

    this.horseLeft = new MyHorse(this.scene, 0);
    this.horseRight = new MyHorse(this.scene, Math.PI);
    this.hayBaleCargo = new MyHayBale(this.scene, 0, 0, 0);

    this.darkMaterial = this.makeMaterial(0.035, 0.032, 0.03, 0.08, 0.075, 0.07, 0.25, 18);
    this.metalMaterial = this.makeMaterial(0.14, 0.13, 0.11, 0.38, 0.34, 0.28, 0.65, 50);
    this.leatherMaterial = this.makeMaterial(0.05, 0.028, 0.012, 0.14, 0.08, 0.035, 0.12, 14);
    this.lampMaterial = this.makeMaterial(0.9, 0.58, 0.18, 1.0, 0.75, 0.25, 0.35, 30);

    this.wagonWoodMaterial = new CGFappearance(this.scene);
    this.wagonWoodMaterial.setAmbient(0.1, 0.1, 0.1, 1);
    this.wagonWoodMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.wagonWoodMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.wagonWoodMaterial.setShininess(10.0);
    this.wagonWoodMaterial.setTexture(this.woodTexture);

    this.canvasMaterial = new CGFappearance(this.scene);
    this.canvasMaterial.setAmbient(0.62, 0.58, 0.48, 1.0);
    this.canvasMaterial.setDiffuse(0.86, 0.82, 0.68, 1.0);
    this.canvasMaterial.setSpecular(0.06, 0.06, 0.06, 1.0);
    this.canvasMaterial.setShininess(6.0);
    this.canvasMaterial.setTexture(this.fabricTexture);
  }

  makeMaterial(ar, ag, ab, dr, dg, db, spec, shine) {
    const mat = new CGFappearance(this.scene);
    mat.setAmbient(ar, ag, ab, 1.0);
    mat.setDiffuse(dr, dg, db, 1.0);
    mat.setSpecular(spec, spec, spec, 1.0);
    mat.setShininess(shine);
    return mat;
  }

  woodBox(x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) {
    this.scene.pushMatrix();
    this.scene.translate(x, y, z);
    if (rx) this.scene.rotate(rx, 1, 0, 0);
    if (ry) this.scene.rotate(ry, 0, 1, 0);
    if (rz) this.scene.rotate(rz, 0, 0, 1);
    this.scene.scale(sx, sy, sz);
    this.box.display();
    this.scene.popMatrix();
  }

  drawCylinder(material, x, y, z, radius, length, rx = 0, ry = 0, rz = 0) {
    material.apply();
    this.scene.pushMatrix();
    this.scene.translate(x, y, z);
    if (rx) this.scene.rotate(rx, 1, 0, 0);
    if (ry) this.scene.rotate(ry, 0, 1, 0);
    if (rz) this.scene.rotate(rz, 0, 0, 1);
    this.scene.scale(radius, radius, length);
    this.scene.translate(0, 0, -0.5);
    this.cylinderMesh.display();
    this.scene.popMatrix();
  }

  drawSphere(material, x, y, z, sx, sy, sz) {
    material.apply();
    this.scene.pushMatrix();
    this.scene.translate(x, y, z);
    this.scene.scale(sx, sy, sz);
    this.sphereMesh.display();
    this.scene.popMatrix();
  }

  displayWheel(rotation = 0) {
    this.scene.pushMatrix();
    this.scene.rotate(rotation, 0, 0, 1);

    this.drawCylinder(this.wagonWoodMaterial, 0, 0, -0.22, 0.86, 0.22);

    this.drawCylinder(this.wagonWoodMaterial, 0, 0, -0.34, 0.26, 0.34);
    this.drawCylinder(this.metalMaterial, 0, 0, -0.38, 0.08, 0.42);
    this.drawSphere(this.wagonWoodMaterial, 0, 0, -0.56, 0.27, 0.27, 0.08);
    this.drawSphere(this.wagonWoodMaterial, 0, 0, -0.12, 0.25, 0.25, 0.06);
    this.drawSphere(this.metalMaterial, 0, 0, -0.62, 0.08, 0.08, 0.05);

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      this.displayWheelSpoke(angle);
    }

    this.scene.popMatrix();
  }

  displayWheelSpoke(angle) {
    const innerRadius = 0.25;
    const outerRadius = 0.86; 
    const length = outerRadius - innerRadius;
    const midpoint = innerRadius + length * 0.5;
    this.wagonWoodMaterial.apply();
    this.scene.pushMatrix();
    this.scene.translate(Math.cos(angle) * midpoint, Math.sin(angle) * midpoint, -0.32);
    this.scene.rotate(angle, 0, 0, 1);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(0.022, 0.022, length); 
    this.scene.translate(0, 0, -0.5);
    this.cylinderMesh.display();
    this.scene.popMatrix();
  }

  displayAxle(z, wheelRotation) {
    this.scene.pushMatrix();
    this.scene.translate(0, 0.86, z); 
    this.drawCylinder(this.metalMaterial, 0, 0, 0, 0.045, 3.78, 0, Math.PI / 2, 0);
    this.woodBox(0, 0.32, 0, 1.2, 0.38, 0.25);
    this.scene.pushMatrix();
    this.scene.translate(-2.15, 0, 0);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.displayWheel(wheelRotation);
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(2.15, 0, 0);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.displayWheel(-wheelRotation);
    this.scene.popMatrix();
    this.scene.popMatrix();
  }

  displayCabin() {
    for (let i = -2; i <= 2; i++) {
      this.woodBox(i * 0.55, 1.0, 0, 0.22, 0.08, 3.08);
    }
    this.woodBox(0, 0.84, -2.9, 1.55, 0.13, 0.1);

    for (const side of [-1, 1]) {
      this.woodBox(side * 1.48, 1.32, 0, 0.055, 0.42, 3.0);
      this.woodBox(side * 1.5, 1.75, 0, 0.07, 0.07, 3.08);
      this.woodBox(side * 1.5, 1.25, 0, 0.06, 0.06, 3.08);
      for (let z = -2.3; z <= 2.31; z += 1.15) {
        this.woodBox(side * 1.5, 1.5, z, 0.075, 0.36, 0.045);
        this.drawSphere(this.metalMaterial, side * 1.57, 1.67, z, 0.055, 0.055, 0.025);
      }
    }

  }

  displayDriverSeat() {
    this.woodBox(0, 1.08, 3.3, 1.24, 0.12, 0.4);
    this.woodBox(0, 1.36, 3, 1.24, 0.35, 0.08);
  }

  displayRoof() {
    this.canvasMaterial.apply();
    this.scene.gl.disable(this.scene.gl.CULL_FACE);
    this.scene.pushMatrix();
    this.scene.translate(0, 1.78, 1.56);
    this.scene.scale(1.56, 1.18, 3.125); 
    this.scene.translate(0, 0, -0.5);
    this.roof.display();
    this.scene.popMatrix();
    this.scene.gl.enable(this.scene.gl.CULL_FACE);

    for (let z = 0.0; z <= 2.85; z += 0.95) {
      this.drawCylinder(this.metalMaterial, 0, 1.78, z, 0.024, 2.65, 0, Math.PI / 2, 0);
      this.woodBox(0, 1.85, z, 1.42, 0.035, 0.04);
    }
  }

  displayHarness() {
    this.woodBox(0, 1.0, 5, 0.12, 0.12, 2.8); 
    this.woodBox(0, 1.15, 7.45, 1.05, 0.08, 0.08); 
    this.woodBox(-0.55, 1.12, 5, 0.06, 0.06, 2.8, 0.04, 0.08, 0);
    this.woodBox(0.55, 1.12, 5, 0.06, 0.06, 2.8, 0.04, -0.08, 0);
    
    for (const x of [-0.52, 0.52]) {
      this.drawCylinder(this.leatherMaterial, x, 1.35, 5.8, 0.018, 3.4);
      this.drawCylinder(this.leatherMaterial, x * 1.15, 1.28, 5.85, 0.014, 3.3);
      this.drawSphere(this.metalMaterial, x, 1.15, 7.45, 0.055, 0.055, 0.055);
    }
  }

  displayHorses() {
    this.scene.pushMatrix();
    this.scene.translate(-0.78, 0.04, 6.25);
    this.scene.scale(0.9, 0.9, 0.9);
    this.horseLeft.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.78, 0.04, 6.25);
    this.scene.scale(0.9, 0.9, 0.9);
    this.horseRight.display();
    this.scene.popMatrix();
  }

  displayHayBales(count) {
    if (count < 1) return;
    this.scene.pushMatrix();
    this.scene.translate(0, 1.9, -0.8); 
    this.hayBaleCargo.display(); 
    this.scene.popMatrix(); 
    if (count < 2) return;
    this.scene.pushMatrix();
    this.scene.translate(0, 1.9, -1.5); 
    this.hayBaleCargo.display();
    this.scene.popMatrix();
  }

  display(wheelRotation = 0, steeringAngle = 0, carriedHayCount = 0) {
    this.scene.pushMatrix();
    this.scene.pushMatrix();
    this.scene.translate(0, 0.75, 0);
    this.displayCabin();
    this.displayDriverSeat();
    this.displayHayBales(carriedHayCount); 
    this.displayRoof();
    this.scene.popMatrix();
    this.displayAxle(-2.0, wheelRotation);
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 2.0); 
    this.scene.rotate(steeringAngle, 0, 1, 0);
    this.scene.translate(0, 0, -2.0);
    this.displayHarness();                 
    this.displayAxle(2.0, wheelRotation);
    this.displayHorses();                  
    this.scene.popMatrix();
    this.scene.popMatrix();
  }

  update(speed, dt) {
    this.horseLeft.update(speed, dt);
    this.horseRight.update(speed, dt);
  }
}