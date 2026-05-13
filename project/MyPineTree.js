import { CGFobject } from "../lib/CGF.js";
import { MyCone } from "./MyCone.js";
import { MyCylinder } from "./MyCylinder.js";

export class MyPineTree extends CGFobject {
  constructor(scene) {
    super(scene);
    this.trunk = new MyCylinder(scene, 6, 1);
    this.foliage = new MyCone(scene, 6, 1);
  }

  displayTrunk() {
    // Trunk
    this.scene.pushMatrix();
    this.scene.scale(0.18, 1.0, 0.18);
    this.trunk.display();
    this.scene.popMatrix();
  }

  displayFoliage() {
    // Layered cones for low-poly pine silhouette
    this.scene.pushMatrix();
    this.scene.translate(0, 0.7, 0);
    this.scene.scale(0.75, 1.0, 0.75);
    this.foliage.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 1.1, 0);
    this.scene.scale(0.55, 0.9, 0.55);
    this.foliage.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 1.45, 0);
    this.scene.scale(0.35, 0.7, 0.35);
    this.foliage.display();
    this.scene.popMatrix();
  }

  display() {
    this.displayTrunk();
    this.displayFoliage();
  }
}
