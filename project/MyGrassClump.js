import { CGFobject } from "../lib/CGF.js";
import { MyCone } from "./MyCone.js";

export class MyGrassClump extends CGFobject {
  constructor(scene) {
    super(scene);
    this.blade = new MyCone(scene, 5, 1);
  }

  display() {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      this.scene.pushMatrix();
      this.scene.rotate(angle, 0, 1, 0);
      this.scene.translate(0.12, 0, 0);
      this.scene.scale(0.08, 0.35, 0.08);
      this.blade.display();
      this.scene.popMatrix();
    }
  }
}
