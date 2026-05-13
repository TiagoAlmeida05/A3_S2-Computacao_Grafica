import { CGFobject } from "../lib/CGF.js";

export class MyWaterPond extends CGFobject {
  constructor(scene, radius = 2.5, segments = 28, distortion = 0.25, seed = 1) {
    super(scene);
    this.radius = radius;
    this.segments = segments;
    this.distortion = distortion;
    this.seed = seed;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [0, 0, 0];
    this.indices = [];
    this.normals = [0, 1, 0];
    this.texCoords = [0.5, 0.5];

    const step = (2 * Math.PI) / this.segments;

    for (let i = 0; i <= this.segments; i++) {
      const angle = i * step;
      const jitter = this.hash(i) * 2 - 1;
      const radius = this.radius * (1 + jitter * this.distortion);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      this.vertices.push(x, 0, z);
      this.normals.push(0, 1, 0);
      this.texCoords.push(0.5 + x / (2 * this.radius), 0.5 + z / (2 * this.radius));
    }

    for (let i = 1; i <= this.segments; i++) {
      this.indices.push(0, i + 1, i);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  hash(i) {
    const value = Math.sin((i + this.seed) * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }
}
