import { CGFobject } from "../lib/CGF.js";

export class MyDirtTrail extends CGFobject {
  constructor(scene, length, width, lengthSegments = 120, widthSegments = 8, texRepeatLength = 18) {
    super(scene);
    this.length = length;
    this.width = width;
    this.lengthSegments = lengthSegments;
    this.widthSegments = widthSegments;
    this.texRepeatLength = texRepeatLength;
    this.heightOffset = 0.16;
    this.terrainEdgeInset = 0.5;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const halfLength = this.length * 0.5;
    const halfWidth = this.width * 0.5;

    for (let zIndex = 0; zIndex <= this.lengthSegments; zIndex++) {
      const t = zIndex / this.lengthSegments;
      const z = -halfLength + this.length * t;

      for (let xIndex = 0; xIndex <= this.widthSegments; xIndex++) {
        const s = xIndex / this.widthSegments;
        const x = -halfWidth + this.width * s;
        const sampleZ = this.clampToTerrain(z);
        const y = this.scene.getGroundY(x, sampleZ, this.heightOffset);

        this.vertices.push(x, y, z);
        this.normals.push(0, 1, 0);
        this.texCoords.push(s, t * this.texRepeatLength);
      }
    }

    const vertsPerRow = this.widthSegments + 1;
    for (let zIndex = 0; zIndex < this.lengthSegments; zIndex++) {
      for (let xIndex = 0; xIndex < this.widthSegments; xIndex++) {
        const topLeft = zIndex * vertsPerRow + xIndex;
        const topRight = topLeft + 1;
        const bottomLeft = (zIndex + 1) * vertsPerRow + xIndex;
        const bottomRight = bottomLeft + 1;

        this.indices.push(topLeft, topRight, bottomLeft);
        this.indices.push(topRight, bottomRight, bottomLeft);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  clampToTerrain(value) {
    const halfTerrain = this.scene.terrain.size * 0.5 - this.terrainEdgeInset;
    return Math.max(-halfTerrain, Math.min(halfTerrain, value));
  }
}
