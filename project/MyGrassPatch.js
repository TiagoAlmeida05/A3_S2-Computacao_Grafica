import { CGFobject } from "../lib/CGF.js";
import { MyGrassBlade } from "./MyGrassBlade.js";

export class MyGrassPatch extends CGFobject {
  constructor(scene) {
    super(scene);
    this.blade = new MyGrassBlade(scene);
  }

  display(blades) {
    if (!blades || blades.length === 0) return;

    for (const blade of blades) {
      this.scene.pushMatrix();
      this.scene.translate(blade.offsetX, 0, blade.offsetZ);
      this.scene.rotate(blade.rotation, 0, 1, 0);
      this.scene.scale(blade.scale, blade.scale, blade.scale);
      this.scene.scale(0.7, 1.0, 1.0);
      this.blade.display();
      this.scene.popMatrix();
    }
}
}
