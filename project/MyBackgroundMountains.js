import { CGFobject } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";

export class MyBackgroundMountains extends CGFobject {
  constructor(scene) {
    super(scene);
    this.plane = new MyPlane(scene, 1, 1);
  }

  display() {
    this.plane.display();
  }
}
