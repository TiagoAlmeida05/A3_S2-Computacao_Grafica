import { CGFobject } from "../lib/CGF.js";
import { MyTexturedQuad } from "./MyTexturedQuad.js";

export class MyFlora extends CGFobject {
  constructor(scene) {
    super(scene);
    this.quad = new MyTexturedQuad(scene);
  }

  displayCrossed(tilt = 0) {
    this.scene.pushMatrix();
    if (tilt !== 0) this.scene.rotate(tilt, 1, 0, 0);
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    if (tilt !== 0) this.scene.rotate(tilt, 1, 0, 0);
    this.quad.display();
    this.scene.popMatrix();
  }
}
