import { CGFobject } from "../lib/CGF.js";

export class MyGrassBlade extends CGFobject {

  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -0.03, 0.0, 0.0,
       0.03, 0.0, 0.0,
      -0.015, 0.32, 0.02,
       0.015, 0.32, 0.02,
       0.0, 0.0, -0.03,
       0.0, 0.0, 0.03,
       0.02, 0.32, -0.015,
       0.02, 0.32, 0.015
    ];

    this.indices = [
      0, 1, 3,
      0, 3, 2,
      4, 5, 7,
      4, 7, 6
    ];

    this.texCoords = [
      0.0, 1.0,
      1.0, 1.0,
      0.1, 0.0,
      0.9, 0.0,
      0.0, 1.0,
      1.0, 1.0,
      0.1, 0.0,
      0.9, 0.0
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}