import { CGFobject } from "../lib/CGF.js";

export class MyCylinder extends CGFobject {
  constructor(scene, slices = 6, stacks = 1) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    const alpha = (2 * Math.PI) / this.slices;
    const stackSize = 1 / this.stacks;

    for (let j = 0; j <= this.stacks; j++) {
      const z = j * stackSize;
      for (let i = 0; i < this.slices; i++) {
        const ang = i * alpha;
        const x = Math.cos(ang);
        const y = Math.sin(ang);
        this.vertices.push(x, y, z);
        this.normals.push(x, y, 0);
      }
    }

    for (let j = 0; j < this.stacks; j++) {
      for (let i = 0; i < this.slices; i++) {
        const nextI = (i + 1) % this.slices;
        const v0 = j * this.slices + i;
        const v1 = j * this.slices + nextI;
        const v2 = (j + 1) * this.slices + i;
        const v3 = (j + 1) * this.slices + nextI;

        this.indices.push(v0, v1, v2);
        this.indices.push(v2, v1, v3);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
