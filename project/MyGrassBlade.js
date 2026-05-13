import { CGFobject } from "../lib/CGF.js";
import { MyTexturedQuad } from "./MyTexturedQuad.js";

export class MyGrassBlade extends CGFobject {
  constructor(scene) {
    super(scene);
    this.quad = new MyTexturedQuad(scene);
  }

  displayCrossed() {
    this.scene.pushMatrix();
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.quad.display();
    this.scene.popMatrix();
  }
}
