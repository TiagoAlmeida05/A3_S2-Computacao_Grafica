import { CGFobject, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";
import { MyCylinder } from "./MyCylinder.js";
import { MyHalfCylinder } from "./MyHalfCylinder.js";
import { MySphere } from "./MySphere.js";
import { MyHorse } from "./MyHorse.js";

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

    this.darkMaterial = this.makeMaterial(0.035, 0.032, 0.03, 0.08, 0.075, 0.07, 0.25, 18);
    this.metalMaterial = this.makeMaterial(0.14, 0.13, 0.11, 0.38, 0.34, 0.28, 0.65, 50);
    this.leatherMaterial = this.makeMaterial(0.05, 0.028, 0.012, 0.14, 0.08, 0.035, 0.12, 14);
    this.lampMaterial = this.makeMaterial(0.9, 0.58, 0.18, 1.0, 0.75, 0.25, 0.35, 30);

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

    this.drawCylinder(this.darkMaterial, 0, 0, -0.2, 0.86, 0.28);
    this.drawCylinder(this.metalMaterial, 0, 0, -0.24, 0.72, 0.08);
    this.drawCylinder(this.darkMaterial, 0, 0, -0.34, 0.54, 0.08);
    this.drawCylinder(this.metalMaterial, 0, 0, -0.39, 0.2, 0.5);

    for (let i = 0; i < 10; i++) {
      this.scene.pushMatrix();
      this.scene.rotate((Math.PI * 2 * i) / 10, 0, 0, 1);
      this.drawCylinder(this.metalMaterial, 0, 0, -0.5, 0.025, 0.72, -Math.PI / 2, 0, 0);
      this.scene.popMatrix();
    }

    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      this.drawSphere(this.metalMaterial, Math.cos(angle) * 0.74, Math.sin(angle) * 0.74, -0.55, 0.055, 0.055, 0.025);
    }

    this.scene.popMatrix();
  }

  displayAxle(z, wheelRotation, steeringAngle = 0) {
    this.scene.pushMatrix();
    this.scene.translate(0, 0.7, z);
    this.drawCylinder(this.metalMaterial, 0, 0, 0, 0.08, 4.0, 0, Math.PI / 2, 0);
    this.woodBox(0, 0.18, 0, 1.25, 0.06, 0.12);

    this.scene.pushMatrix();
    this.scene.translate(-1.85, 0, 0);
    if (steeringAngle) this.scene.rotate(steeringAngle, 0, 1, 0);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.displayWheel(wheelRotation);
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(1.85, 0, 0);
    if (steeringAngle) this.scene.rotate(steeringAngle, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.displayWheel(-wheelRotation);
    this.scene.popMatrix();
    this.scene.popMatrix();
  }

  displayCabin() {
    for (let i = -2; i <= 2; i++) this.woodBox(i * 0.55, 1.0, 0, 0.22, 0.08, 3.08);
    this.woodBox(0, 0.84, -2.9, 1.55, 0.13, 0.1);
    this.woodBox(0, 0.84, 2.9, 1.55, 0.13, 0.1);

    for (const side of [-1, 1]) {
      this.woodBox(side * 1.48, 1.32, 0, 0.055, 0.42, 3.0);
      this.woodBox(side * 1.5, 1.75, 0, 0.07, 0.07, 3.08);
      this.woodBox(side * 1.5, 1.25, 0, 0.06, 0.06, 3.08);
      for (let z = -2.3; z <= 2.31; z += 1.15) {
        this.woodBox(side * 1.5, 1.5, z, 0.075, 0.36, 0.045);
        this.drawSphere(this.metalMaterial, side * 1.57, 1.67, z, 0.055, 0.055, 0.025);
      }
    }

    this.woodBox(0, 1.38, 3.2, 1.2, 0.1, 0.5);
    this.woodBox(0, 1.72, 2.98, 1.2, 0.45, 0.08, -0.25, 0, 0);
    this.woodBox(0, 1.02, 3.95, 0.9, 0.05, 0.35, -0.45, 0, 0);
    this.woodBox(-0.92, 1.2, 3.35, 0.08, 0.55, 0.08);
    this.woodBox(0.92, 1.2, 3.35, 0.08, 0.55, 0.08);
  }

  displayRoof() {
    this.canvasMaterial.apply();
    this.scene.gl.disable(this.scene.gl.CULL_FACE);
    this.scene.pushMatrix();
    this.scene.translate(0, 1.78, 0);
    this.scene.scale(1.56, 1.18, 6.25);
    this.scene.translate(0, 0, -0.5);
    this.roof.display();
    this.scene.popMatrix();
    this.scene.gl.enable(this.scene.gl.CULL_FACE);

    for (let z = -2.85; z <= 2.86; z += 0.95) {
      this.drawCylinder(this.metalMaterial, 0, 1.78, z, 0.024, 2.65, 0, Math.PI / 2, 0);
      this.woodBox(0, 1.85, z, 1.42, 0.035, 0.04);
    }
  }

  displayHarness() {
    this.woodBox(0, 1.0, 4.6, 0.12, 0.12, 3.1);
    this.woodBox(0, 1.15, 7.45, 1.05, 0.08, 0.08);
    this.woodBox(-0.55, 1.12, 5.5, 0.045, 0.045, 1.8, 0.04, 0.08, 0);
    this.woodBox(0.55, 1.12, 5.5, 0.045, 0.045, 1.8, 0.04, -0.08, 0);
    for (const x of [-0.52, 0.52]) {
      this.drawCylinder(this.leatherMaterial, x, 1.35, 5.6, 0.018, 2.65);
      this.drawCylinder(this.leatherMaterial, x * 1.15, 1.28, 5.65, 0.014, 2.55);
      this.drawSphere(this.metalMaterial, x, 1.15, 7.45, 0.055, 0.055, 0.055);
    }
  }

  displayDetails() {
    for (const x of [-1.3, 1.3]) {
      this.drawSphere(this.lampMaterial, x, 1.55, 3.35, 0.13, 0.13, 0.13);
      this.drawCylinder(this.metalMaterial, x, 1.38, 3.35, 0.025, 0.22, -Math.PI / 2, 0, 0);
    }
    for (const x of [-1.1, 1.1]) {
      for (const z of [-2.4, 2.4]) this.drawSphere(this.metalMaterial, x, 1.13, z, 0.055, 0.055, 0.055);
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

  display(wheelRotation = 0, steeringAngle = 0) {
    this.scene.pushMatrix();
    this.displayCabin();
    this.displayHarness();
    this.displayAxle(-2.0, wheelRotation, 0);
    this.displayAxle(2.0, wheelRotation, steeringAngle);
    this.displayRoof();
    this.displayDetails();
    this.displayHorses();
    this.scene.popMatrix();
  }

  update(speed, dt) {
    this.horseLeft.update(speed, dt);
    this.horseRight.update(speed, dt);
  }
}
