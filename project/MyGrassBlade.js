import { CGFobject } from "../lib/CGF.js";

export class MyGrassBlade extends CGFobject {

  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    const baseVertices = [
      -0.03, 0.0, 0.0,
       0.03, 0.0, 0.0,
      -0.015, 0.32, 0.02,
       0.015, 0.32, 0.02,
       0.0, 0.0, -0.03,
       0.0, 0.0, 0.03,
       0.02, 0.32, -0.015,
       0.02, 0.32, 0.015
    ];

    const baseIndices = [
      0, 1, 3,
      0, 3, 2,
      4, 5, 7,
      4, 7, 6
    ];

    const baseTexCoords = [
      0.0, 1.0,
      1.0, 1.0,
      0.1, 0.0,
      0.9, 0.0,
      0.0, 1.0,
      1.0, 1.0,
      0.1, 0.0,
      0.9, 0.0
    ];

    const baseNormals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0
    ];

    this.vertices = baseVertices.concat(baseVertices);
    this.texCoords = baseTexCoords.concat(baseTexCoords);
    this.normals = baseNormals.concat(baseNormals.map((value) => -value));

    this.indices = baseIndices.slice();
    const offset = baseVertices.length / 3;
    for (let i = 0; i < baseIndices.length; i += 3) {
      this.indices.push(
        baseIndices[i + 2] + offset,
        baseIndices[i + 1] + offset,
        baseIndices[i] + offset
      );
    }

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}