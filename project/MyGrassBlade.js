import { CGFobject } from "../lib/CGF.js";

export class MyGrassBlade extends CGFobject {

  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {

    this.vertices = [
      -0.5, 0, 0,
       0.5, 0, 0,
      -0.5, 1, 0,
       0.5, 1, 0
    ];

    this.indices = [
      0, 1, 2,
      1, 3, 2
    ];

    this.texCoords = [
      0, 1,
      1, 1,
      0, 0,
      1, 0
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}