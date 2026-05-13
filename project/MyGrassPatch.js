import { CGFobject } from "../lib/CGF.js";
import { MyGrassBlade } from "./MyGrassBlade.js";

export class MyGrassPatch extends CGFobject {
  constructor(scene) {
    super(scene);
    this.blade = new MyGrassBlade(scene);
  }

  display(blades, textureIndex) {
    for (const blade of blades) {
      if (blade.textureIndex !== textureIndex) continue;
      this.scene.pushMatrix();
      this.scene.translate(blade.offsetX, 0, blade.offsetZ);
      this.scene.rotate(blade.rotation, 0, 1, 0);
      this.scene.scale(blade.scale, blade.scale, blade.scale);
      this.blade.displayCrossed();
      this.scene.popMatrix();
    }
  }
}
