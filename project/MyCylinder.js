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
    this.texCoords = [];

    const alpha = (2 * Math.PI) / this.slices;
    const stackSize = 1 / this.stacks;

    for (let j = 0; j <= this.stacks; j++) {
      const z = j * stackSize;
      const v = j / this.stacks;

      for (let i = 0; i <= this.slices; i++) {
        const ang = i * alpha;
        const x = Math.cos(ang);
        const y = Math.sin(ang);
        const u = i / this.slices; 

        // OUTSIDE Vertex
        this.vertices.push(x, y, z);
        this.normals.push(x, y, 0);
        this.texCoords.push(u, v); 

        // INSIDE Vertex
        this.vertices.push(x, y, z);
        this.normals.push(-x, -y, 0);
        this.texCoords.push(u, v);
      }
    }

    const vertsPerStack = (this.slices + 1) * 2;

    for (let j = 0; j < this.stacks; j++) {
      for (let i = 0; i < this.slices; i++) {
        const nextI = i + 1;

        const v0_out = j * vertsPerStack + (i * 2);
        const v1_out = j * vertsPerStack + (nextI * 2);
        const v2_out = (j + 1) * vertsPerStack + (i * 2);
        const v3_out = (j + 1) * vertsPerStack + (nextI * 2);

        this.indices.push(v0_out, v1_out, v2_out);
        this.indices.push(v2_out, v1_out, v3_out);

        const v0_in = v0_out + 1;
        const v1_in = v1_out + 1;
        const v2_in = v2_out + 1;
        const v3_in = v3_out + 1;

        this.indices.push(v0_in, v2_in, v1_in);
        this.indices.push(v2_in, v3_in, v1_in);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}