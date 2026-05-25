import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { CGFobjModel } from "./CGFobjModel.js";
import { MyCylinder } from "./MyCylinder.js";
import { MySphere } from "./MySphere.js";

export class MyHorse extends CGFobject {
  constructor(scene, phaseOffset = 0) {
    super(scene);
    this.phaseOffset = phaseOffset;
    this.walkCycle = phaseOffset;
    this.speedFactor = 0;

    this.horseMesh = new CGFobjModel(this.scene, "models/horse.obj");
    this.cylinder = new MyCylinder(scene, 10, 1);
    this.joint = new MySphere(scene, 1, 8, 5, false, false, 1, 1);

    this.horseMaterial = this.makeMaterial(0.22, 0.105, 0.045, 0.45, 0.22, 0.08, 0.12, 18);
    this.darkMaterial = this.makeMaterial(0.035, 0.022, 0.015, 0.08, 0.05, 0.03, 0.08, 12);
    this.hoofMaterial = this.makeMaterial(0.02, 0.018, 0.015, 0.06, 0.05, 0.04, 0.18, 22);
    this.leatherMaterial = this.makeMaterial(0.045, 0.025, 0.012, 0.12, 0.07, 0.035, 0.1, 14);
  }

  makeMaterial(ar, ag, ab, dr, dg, db, spec, shine) {
    const mat = new CGFappearance(this.scene);
    mat.setAmbient(ar, ag, ab, 1.0);
    mat.setDiffuse(dr, dg, db, 1.0);
    mat.setSpecular(spec, spec, spec, 1.0);
    mat.setShininess(shine);
    return mat;
  }

  update(speed, dt) {
    const amount = Math.min(Math.abs(speed) / 18.0, 1.0);
    this.speedFactor += (amount - this.speedFactor) * Math.min(dt * 8.0, 1.0);
    this.walkCycle += (2.0 + amount * 7.0) * Math.max(Math.abs(speed), 1.0) * 0.18 * dt;
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
    this.cylinder.display();
    this.scene.popMatrix();
  }

  drawSphere(material, x, y, z, sx, sy, sz) {
    material.apply();
    this.scene.pushMatrix();
    this.scene.translate(x, y, z);
    this.scene.scale(sx, sy, sz);
    this.joint.display();
    this.scene.popMatrix();
  }

  displayHarness(phase) {
    const reinSwing = Math.sin(phase) * 0.04 * this.speedFactor;
    for (const x of [-0.32, 0.32]) {
      this.drawCylinder(this.leatherMaterial, x, 1.5 + reinSwing, 0.35, 0.018, 0.95, Math.PI / 2, 0, 0);
      this.drawCylinder(this.leatherMaterial, x, 1.35, 0.9, 0.014, 0.8, 0, Math.PI / 2, 0);
    }
  }

  displayHoofCues(phase) {
    const gait = [phase, phase + Math.PI, phase + Math.PI, phase];
    const positions = [[-0.23, 0.58], [0.23, 0.58], [-0.23, -0.56], [0.23, -0.56]];

    for (let i = 0; i < positions.length; i++) {
      const [x, z] = positions[i];
      const swing = Math.sin(gait[i]) * 0.18 * this.speedFactor;
      const lift = Math.max(0, Math.sin(gait[i] + 0.6)) * 0.08 * this.speedFactor;
      this.drawSphere(this.hoofMaterial, x, 0.08 + lift, z + swing, 0.08, 0.045, 0.11);
    }
  }

  display() {
    const phase = this.walkCycle + this.phaseOffset;
    const movement = this.speedFactor;
    const bob = Math.abs(Math.sin(phase * 0.5)) * 0.08 * movement;
    const rock = Math.cos(phase * 0.5) * 0.08 * movement;

    this.scene.pushMatrix();
    this.scene.translate(0, bob, 0);
    this.scene.rotate(rock, 1, 0, 0);

    this.horseMaterial.apply();
    this.scene.gl.disable(this.scene.gl.CULL_FACE);
    this.scene.pushMatrix();
    this.scene.translate(0, 1.7, 0);
    this.scene.scale(0.012, 0.012, 0.012);
    this.scene.rotate(-Math.PI / 2 - 0.3, 0, 1, 0);
    this.horseMesh.display();
    this.scene.popMatrix();
    this.scene.gl.enable(this.scene.gl.CULL_FACE);

    this.displayHoofCues(phase);
    this.displayHarness(phase);
    this.scene.popMatrix();
  }
}
