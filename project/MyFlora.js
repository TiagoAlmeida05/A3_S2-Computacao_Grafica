import { CGFobject } from "../lib/CGF.js";
import { MyCone } from "./MyCone.js";
import { MyCylinder } from "./MyCylinder.js";
import { MySphere } from "./MySphere.js";

export class MyFlora extends CGFobject {
  constructor(scene) {
    super(scene);
    this.stem = new MyCylinder(scene, 6, 1);
    this.petal = new MyCone(scene, 6, 1);
    this.center = new MySphere(scene, 0.5, 8, 8, false, false, 1, 1);
    this.leaf = new MyFloraLeaf(scene);
  }

  displayFlower(params, appearances) {
    const {
      stemHeight = 0.5,
      stemRadius = 0.04,
      petalCount = 6,
      petalLength = 0.22,
      petalWidth = 0.12,
      petalTilt = 0.4,
      petalCount2 = 0,
      petalLength2 = 0.16,
      petalWidth2 = 0.08,
      petalTilt2 = 0.35,
      centerRadius = 0.06,
      leafCount = 0,
      leafLength = 0.22,
      leafWidth = 0.1,
      leafTilt = 0.35
    } = params;

    const stemAppearance = appearances?.stem;
    const petalAppearance = appearances?.petal;
    const centerAppearance = appearances?.center;

    if (stemAppearance) stemAppearance.apply();
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(stemRadius, stemRadius, stemHeight);
    this.stem.display();
    this.scene.popMatrix();

    if (stemAppearance && leafCount > 0) stemAppearance.apply();
    if (leafCount > 0) {
      this.displayLeafLayer(leafCount, stemHeight * 0.45, leafLength, leafWidth, leafTilt);
    }

    if (petalAppearance) petalAppearance.apply();
    this.displayPetalLayer(petalCount, stemHeight, petalLength, petalWidth, petalTilt, 0);
    if (petalCount2 > 0) {
      const offset = Math.PI / Math.max(petalCount2, 3);
      this.displayPetalLayer(petalCount2, stemHeight * 0.98, petalLength2, petalWidth2, petalTilt2, offset);
    }

    if (centerAppearance) centerAppearance.apply();
    this.scene.pushMatrix();
    this.scene.translate(0, stemHeight + petalLength * 0.12, 0);
    this.scene.scale(centerRadius, centerRadius, centerRadius);
    this.center.display();
    this.scene.popMatrix();
  }

  displayPetalLayer(count, stemHeight, petalLength, petalWidth, petalTilt, angleOffset) {
    const petals = Math.max(3, count);
    const step = (Math.PI * 2) / petals;
    for (let i = 0; i < petals; i++) {
      const angle = i * step + angleOffset;
      this.scene.pushMatrix();
      this.scene.translate(0, stemHeight, 0);
      this.scene.rotate(angle, 0, 1, 0);
      this.scene.rotate(petalTilt, 1, 0, 0);
      this.scene.scale(petalWidth, petalLength, petalWidth);
      this.petal.display();
      this.scene.popMatrix();
    }
  }

  displayLeafLayer(count, height, length, width, tilt) {
    const leaves = Math.max(1, count);
    const step = (Math.PI * 2) / leaves;
    for (let i = 0; i < leaves; i++) {
      const angle = i * step;
      this.scene.pushMatrix();
      this.scene.translate(0, height, 0);
      this.scene.rotate(angle, 0, 1, 0);
      this.scene.rotate(tilt, 1, 0, 0);
      this.scene.scale(width, length, width);
      this.leaf.display();
      this.scene.popMatrix();
    }
  }
}

class MyFloraLeaf extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -0.4, 0.0, 0.0,
       0.4, 0.0, 0.0,
      -0.25, 0.55, 0.03,
       0.25, 0.55, 0.03,
       0.0, 1.0, 0.06,
      -0.4, 0.0, 0.0,
       0.4, 0.0, 0.0,
      -0.25, 0.55, -0.03,
       0.25, 0.55, -0.03,
       0.0, 1.0, -0.06
    ];

    this.indices = [
      0, 1, 3,
      0, 3, 2,
      2, 3, 4,
      5, 8, 6,
      5, 7, 8,
      7, 9, 8
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1
    ];

    this.texCoords = [
      0.0, 1.0,
      1.0, 1.0,
      0.2, 0.5,
      0.8, 0.5,
      0.5, 0.0,
      0.0, 1.0,
      1.0, 1.0,
      0.2, 0.5,
      0.8, 0.5,
      0.5, 0.0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
