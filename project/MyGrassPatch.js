import { CGFobject } from "../lib/CGF.js";
import { MyGrassBlade } from "./MyGrassBlade.js";

export class MyGrassPatch extends CGFobject {
  constructor(scene) {
    super(scene);
    this.blade = new MyGrassBlade(scene);
  }

  display(blades, maxBlades) {
    if (!blades || blades.length === 0) return;

    const count = maxBlades ? Math.min(blades.length, maxBlades) : blades.length;
    for (let i = 0; i < count; i++) {
      const blade = blades[i];
      this.scene.pushMatrix();
      this.scene.translate(blade.offsetX, 0, blade.offsetZ);
      this.scene.rotate(blade.rotation, 0, 1, 0);
      this.scene.rotate(blade.leanX || 0, 1, 0, 0);
      this.scene.rotate(blade.leanZ || 0, 0, 0, 1);
      this.scene.scale(blade.scale, blade.scale, blade.scale);
      this.scene.scale(0.7, 1.0, 0.7);
      this.blade.display();
      this.scene.popMatrix();
    }
  }
}
