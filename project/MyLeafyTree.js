import { CGFobject } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";
import { MySphere } from "./MySphere.js";

export class MyLeafyTree extends CGFobject {
  constructor(scene) {
    super(scene);
    this.trunk = new MyCylinder(scene, 6, 1);
    this.canopy = new MySphere(scene, 1, 6, 4, false, false, 1, 1);
  }

  displayTrunk() {
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.2, 0.2, 1.1);
    this.trunk.display();
    this.scene.popMatrix();
  }

  displayFoliage() {
    this.scene.pushMatrix();
    this.scene.translate(0, 1.05, 0);
    this.scene.scale(0.8, 0.8, 0.8);
    this.canopy.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.2, 1.35, -0.1);
    this.scene.scale(0.6, 0.6, 0.6);
    this.canopy.display();
    this.scene.popMatrix();
  }

  display() {
    this.displayTrunk();
    this.displayFoliage();
  }
}
