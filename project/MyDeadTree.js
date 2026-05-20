import { CGFobject } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";

export class MyDeadTree extends CGFobject {
  constructor(scene) {
    super(scene);
    this.trunk = new MyCylinder(scene, 6, 1);
    this.branch = new MyCylinder(scene, 5, 1);
  }

  display() {
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.18, 0.18, 1.2);
    this.trunk.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0.85, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.rotate(-0.6, 0, 0, 1);
    this.scene.scale(0.08, 0.08, 0.5);
    this.branch.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0.95, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.rotate(0.5, 0, 0, 1);
    this.scene.scale(0.07, 0.07, 0.45);
    this.branch.display();
    this.scene.popMatrix();
  }
}
