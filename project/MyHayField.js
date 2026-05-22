import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyHayBale } from "./MyHayBale.js";

export class MyHayFields extends CGFobject {
  constructor(scene, diagonalZ) {
    super(scene);
    this.hayBale = new MyHayBale(scene);

    this.hayPatch1 = new MyAdaptivePlane(scene, 3.6, diagonalZ, 2.4, 6.5, 12, 24);
    this.hayPatch2 = new MyAdaptivePlane(scene, 6.4, diagonalZ, 2.4, 6.5, 12, 24);

    this.hayMaterial = new CGFappearance(scene);
    this.hayMaterial.setAmbient(0.75, 0.6, 0.15, 1.0);
    this.hayMaterial.setDiffuse(0.85, 0.7, 0.2, 1.0);
    this.hayMaterial.setSpecular(0.05, 0.05, 0.01, 1.0);
    this.hayMaterial.loadTexture("images/textures/hay_diffuse.jpg");
    this.hayMaterial.setTextureWrap("REPEAT", "REPEAT");
  }

  display(barnBaseY) {
    this.hayMaterial.apply();
    this.hayPatch1.display();
    this.hayPatch2.display();

    this.scene.pushMatrix();
    let b1X = 3.6, b1Z = 2.7;
    let b1Y = this.scene.getGroundY(b1X, -4.0 + b1Z) - barnBaseY + 0.32;
    this.scene.translate(b1X, b1Y, b1Z);
    this.scene.rotate(Math.PI / 2 + 0.2, 0, 1, 0);
    this.scene.scale(0.35, 0.35, 0.85);
    this.hayBale.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    let b2X = 6.4, b2Z = 0.3;
    let b2Y = this.scene.getGroundY(b2X, -4.0 + b2Z) - barnBaseY + 0.32;
    this.scene.translate(b2X, b2Y, b2Z);
    this.scene.rotate(Math.PI / 2 - 0.15, 0, 1, 0);
    this.scene.scale(0.35, 0.35, 0.85);
    this.hayBale.display();
    this.scene.popMatrix();
  }
}

class MyAdaptivePlane extends CGFobject {
  constructor(scene, centerX, centerZ, width, depth, xDivs, zDivs) {
    super(scene);
    this.centerX = centerX; this.centerZ = centerZ;
    this.width = width; this.depth = depth;
    this.xDivs = xDivs; this.zDivs = zDivs;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = []; this.indices = []; this.normals = []; this.texCoords = [];
    const xStep = this.width / this.xDivs; const zStep = this.depth / this.zDivs;
    const barnBaseY = this.scene.getGroundY(0, 0);
    for (let j = 0; j <= this.zDivs; j++) {
      const localZ = this.centerZ - (this.depth / 2) + (j * zStep);
      for (let i = 0; i <= this.xDivs; i++) {
        const localX = this.centerX - (this.width / 2) + (i * xStep);
        const localY = this.scene.getGroundY(localX, -4.0 + localZ, 0.025) - barnBaseY;
        this.vertices.push(localX, localY, localZ); this.normals.push(0, 1, 0);
        this.texCoords.push(i / this.xDivs, j / this.zDivs);
      }
    }
    const numVertsX = this.xDivs + 1;
    for (let j = 0; j < this.zDivs; j++) {
      for (let i = 0; i < this.xDivs; i++) {
        const topLeft = j * numVertsX + i; const topRight = topLeft + 1;
        const bottomLeft = (j + 1) * numVertsX + i; const bottomRight = bottomLeft + 1;
        this.indices.push(topLeft, bottomLeft, topRight); this.indices.push(topRight, bottomLeft, bottomRight);
      }
    }
    this.primitiveType = this.scene.gl.TRIANGLES; this.initGLBuffers();
  }
}