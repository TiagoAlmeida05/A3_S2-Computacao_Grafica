import { CGFobject } from "../lib/CGF.js";

export class MyCone extends CGFobject {
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

    for (let i = 0; i < this.slices; i++) {
      const ang = i * alpha;
      this.vertices.push(Math.cos(ang), 0, -Math.sin(ang));
      this.normals.push(Math.cos(ang), Math.cos(Math.PI / 4), -Math.sin(ang));
    }

    const apexIndex = this.vertices.length / 3;
    this.vertices.push(0, 1, 0);
    this.normals.push(0, 1, 0);

    for (let i = 0; i < this.slices; i++) {
      this.indices.push(i, (i + 1) % this.slices, apexIndex);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
