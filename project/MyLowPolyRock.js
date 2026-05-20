import { CGFobject } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyLowPolyRock extends CGFobject {
  constructor(scene, slices = 6, stacks = 4) {
    super(scene);
    this.core = new MySphere(scene, 1, slices, stacks, false, false, 1, 1);
  }

  display() {
    this.core.display();
  }
}
